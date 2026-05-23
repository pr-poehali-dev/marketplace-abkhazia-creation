"""
Главный API маркетплейса АПСНЫ — товары, категории, продавцы, заказы, аутентификация
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = 't_p13685580_marketplace_abkhazia'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id, Authorization',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def ok(data, status=200):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(data, default=str)}

def err(msg, status=400):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}


def handler(event: dict, context) -> dict:
    """Единый API маркетплейса Абхазии"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    params = event.get('queryStringParameters') or {}
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            body = {}

    # ---- КАТЕГОРИИ ----
    if path == '/categories':
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT * FROM {SCHEMA}.categories ORDER BY sort_order")
                return ok(cur.fetchall())

    # ---- ПРОДАВЦЫ ----
    if path == '/sellers':
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT * FROM {SCHEMA}.sellers ORDER BY rating DESC")
                return ok(cur.fetchall())

    if path.startswith('/sellers/') and method == 'GET':
        seller_id = path.split('/')[-1]
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT * FROM {SCHEMA}.sellers WHERE id = %s", (seller_id,))
                seller = cur.fetchone()
                if not seller:
                    return err('Продавец не найден', 404)
                cur.execute(f"SELECT * FROM {SCHEMA}.products WHERE seller_id = %s AND in_stock = TRUE", (seller_id,))
                products = cur.fetchall()
                return ok({'seller': seller, 'products': products})

    # ---- ТОВАРЫ ----
    if path == '/products' and method == 'GET':
        category = params.get('category', '')
        region = params.get('region', '')
        search = params.get('search', '')
        sort = params.get('sort', 'popular')
        min_price = params.get('min_price', '')
        max_price = params.get('max_price', '')
        limit = int(params.get('limit', 50))
        offset = int(params.get('offset', 0))

        where = ["p.in_stock = TRUE"]
        args = []
        if category:
            where.append("p.category_slug = %s")
            args.append(category)
        if region:
            where.append("p.region = %s")
            args.append(region)
        if search:
            where.append("(p.name ILIKE %s OR p.description ILIKE %s OR %s = ANY(p.tags))")
            args += [f'%{search}%', f'%{search}%', search]
        if min_price:
            where.append("p.price >= %s")
            args.append(float(min_price))
        if max_price:
            where.append("p.price <= %s")
            args.append(float(max_price))

        order = 'p.reviews_count DESC'
        if sort == 'price_asc': order = 'p.price ASC'
        elif sort == 'price_desc': order = 'p.price DESC'
        elif sort == 'rating': order = 'p.rating DESC'
        elif sort == 'newest': order = 'p.created_at DESC'

        where_sql = ' AND '.join(where)
        sql = f"""
            SELECT p.*, s.name as seller_name, s.verified as seller_verified
            FROM {SCHEMA}.products p
            LEFT JOIN {SCHEMA}.sellers s ON s.id = p.seller_id
            WHERE {where_sql}
            ORDER BY {order}
            LIMIT %s OFFSET %s
        """
        args += [limit, offset]

        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(sql, args)
                products = cur.fetchall()
                cur.execute(f"SELECT COUNT(*) as total FROM {SCHEMA}.products p WHERE {where_sql}", args[:-2])
                total = cur.fetchone()['total']
                return ok({'products': products, 'total': total})

    if path.startswith('/products/') and method == 'GET':
        product_id = path.split('/')[-1]
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"""
                    SELECT p.*, s.name as seller_name, s.verified as seller_verified,
                           s.rating as seller_rating, s.reviews_count as seller_reviews
                    FROM {SCHEMA}.products p
                    LEFT JOIN {SCHEMA}.sellers s ON s.id = p.seller_id
                    WHERE p.id = %s
                """, (product_id,))
                product = cur.fetchone()
                if not product:
                    return err('Товар не найден', 404)
                cur.execute(f"SELECT * FROM {SCHEMA}.reviews WHERE product_id = %s ORDER BY created_at DESC LIMIT 10", (product_id,))
                reviews = cur.fetchall()
                return ok({'product': product, 'reviews': reviews})

    if path == '/products' and method == 'POST':
        name = body.get('name', '').strip()
        if not name:
            return err('Название товара обязательно')
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"""
                    INSERT INTO {SCHEMA}.products (name, description, price, old_price, category_slug, seller_id, image_url, badge, badge_type, region, in_stock, tags)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *
                """, (
                    name, body.get('description',''), float(body.get('price',0)),
                    body.get('old_price') or None, body.get('category_slug',''),
                    body.get('seller_id') or None, body.get('image_url',''),
                    body.get('badge') or None, body.get('badge_type') or None,
                    body.get('region',''), body.get('in_stock', True),
                    body.get('tags', [])
                ))
                conn.commit()
                return ok(cur.fetchone(), 201)

    if path.startswith('/products/') and method == 'PUT':
        product_id = path.split('/')[-1]
        fields = []
        vals = []
        for key in ['name','description','price','old_price','category_slug','seller_id','image_url','badge','badge_type','region','in_stock']:
            if key in body:
                fields.append(f"{key} = %s")
                vals.append(body[key])
        if not fields:
            return err('Нет данных для обновления')
        vals.append(product_id)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"UPDATE {SCHEMA}.products SET {', '.join(fields)} WHERE id = %s RETURNING *", vals)
                conn.commit()
                return ok(cur.fetchone())

    # ---- AUTH ----
    if path == '/auth/login' and method == 'POST':
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        if not email or not password:
            return err('Email и пароль обязательны')
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT * FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s", (email, password))
                user = cur.fetchone()
                if not user:
                    return err('Неверный email или пароль', 401)
                return ok({'user': {
                    'id': user['id'], 'name': user['name'], 'email': user['email'],
                    'phone': user['phone'], 'role': user['role'], 'avatar': user['avatar']
                }})

    if path == '/auth/register' and method == 'POST':
        name = body.get('name', '').strip()
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        if not name or not email or not password:
            return err('Все поля обязательны')
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
                if cur.fetchone():
                    return err('Пользователь с таким email уже существует')
                cur.execute(f"""
                    INSERT INTO {SCHEMA}.users (name, email, password_hash, phone)
                    VALUES (%s, %s, %s, %s) RETURNING id, name, email, role, avatar
                """, (name, email, password, body.get('phone', '')))
                conn.commit()
                return ok(cur.fetchone(), 201)

    # ---- ЗАКАЗЫ ----
    if path == '/orders' and method == 'POST':
        import random, string
        order_num = 'AB-' + ''.join(random.choices(string.digits, k=8))
        track = 'TRK' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        items = body.get('items', [])
        if not items:
            return err('Корзина пуста')
        total = sum(i['price'] * i['quantity'] for i in items)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"""
                    INSERT INTO {SCHEMA}.orders (order_number, user_id, user_name, user_email, user_phone, total_price, delivery_region, delivery_address, tracking_code)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *
                """, (
                    order_num, body.get('user_id') or None,
                    body.get('user_name',''), body.get('user_email',''), body.get('user_phone',''),
                    total, body.get('delivery_region',''), body.get('delivery_address',''), track
                ))
                order = cur.fetchone()
                for item in items:
                    cur.execute(f"""
                        INSERT INTO {SCHEMA}.order_items (order_id, product_id, product_name, quantity, price)
                        VALUES (%s,%s,%s,%s,%s)
                    """, (order['id'], item.get('product_id'), item.get('product_name',''), item['quantity'], item['price']))
                conn.commit()
                return ok(order, 201)

    if path == '/orders' and method == 'GET':
        user_id = params.get('user_id')
        if not user_id:
            return err('user_id обязателен', 400)
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT * FROM {SCHEMA}.orders WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
                orders = cur.fetchall()
                for order in orders:
                    cur.execute(f"SELECT * FROM {SCHEMA}.order_items WHERE order_id = %s", (order['id'],))
                    order['items'] = cur.fetchall()
                return ok(orders)

    # ---- ADMIN ----
    if path == '/admin/stats' and method == 'GET':
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT COUNT(*) as total FROM {SCHEMA}.products")
                products_total = cur.fetchone()['total']
                cur.execute(f"SELECT COUNT(*) as total FROM {SCHEMA}.orders")
                orders_total = cur.fetchone()['total']
                cur.execute(f"SELECT COALESCE(SUM(total_price),0) as revenue FROM {SCHEMA}.orders WHERE status != 'cancelled'")
                revenue = cur.fetchone()['revenue']
                cur.execute(f"SELECT COUNT(*) as total FROM {SCHEMA}.users WHERE role = 'user'")
                users_total = cur.fetchone()['total']
                cur.execute(f"SELECT COUNT(*) as total FROM {SCHEMA}.sellers")
                sellers_total = cur.fetchone()['total']
                cur.execute(f"SELECT * FROM {SCHEMA}.orders ORDER BY created_at DESC LIMIT 10")
                recent_orders = cur.fetchall()
                return ok({
                    'products': products_total,
                    'orders': orders_total,
                    'revenue': float(revenue),
                    'users': users_total,
                    'sellers': sellers_total,
                    'recent_orders': recent_orders
                })

    if path == '/admin/orders' and method == 'GET':
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT * FROM {SCHEMA}.orders ORDER BY created_at DESC LIMIT 100")
                orders = cur.fetchall()
                for o in orders:
                    cur.execute(f"SELECT * FROM {SCHEMA}.order_items WHERE order_id = %s", (o['id'],))
                    o['items'] = cur.fetchall()
                return ok(orders)

    if path.startswith('/admin/orders/') and method == 'PUT':
        order_id = path.split('/')[-1]
        new_status = body.get('status')
        if not new_status:
            return err('status обязателен')
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"UPDATE {SCHEMA}.orders SET status = %s, updated_at = NOW() WHERE id = %s RETURNING *", (new_status, order_id))
                conn.commit()
                return ok(cur.fetchone())

    if path == '/admin/products' and method == 'GET':
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"""
                    SELECT p.*, s.name as seller_name FROM {SCHEMA}.products p
                    LEFT JOIN {SCHEMA}.sellers s ON s.id = p.seller_id
                    ORDER BY p.created_at DESC
                """)
                return ok(cur.fetchall())

    if path == '/admin/users' and method == 'GET':
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT id, name, email, phone, role, avatar, created_at FROM {SCHEMA}.users ORDER BY created_at DESC")
                return ok(cur.fetchall())

    if path == '/admin/sellers' and method == 'GET':
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"SELECT * FROM {SCHEMA}.sellers ORDER BY created_at DESC")
                return ok(cur.fetchall())

    if path == '/reviews' and method == 'POST':
        product_id = body.get('product_id')
        user_name = body.get('user_name', '').strip()
        rating = body.get('rating', 5)
        comment = body.get('comment', '')
        if not product_id or not user_name:
            return err('product_id и user_name обязательны')
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f"INSERT INTO {SCHEMA}.reviews (product_id, user_name, rating, comment) VALUES (%s,%s,%s,%s) RETURNING *",
                            (product_id, user_name, rating, comment))
                cur.execute(f"""
                    UPDATE {SCHEMA}.products SET
                    reviews_count = reviews_count + 1,
                    rating = (SELECT AVG(rating) FROM {SCHEMA}.reviews WHERE product_id = %s)
                    WHERE id = %s
                """, (product_id, product_id))
                conn.commit()
                return ok(cur.fetchone(), 201)

    return err('Маршрут не найден', 404)
