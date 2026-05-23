export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  seller: string;
  sellerId: number;
  image: string;
  badge?: string;
  badgeType?: 'green' | 'orange' | 'gold';
  region: string;
  inStock: boolean;
  description: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Seller {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  productsCount: number;
  location: string;
  joinDate: string;
  verified: boolean;
  avatar: string;
  description: string;
}

export const categories: Category[] = [
  { id: 'food', name: 'Продукты', icon: '🫐', count: 245 },
  { id: 'wine', name: 'Вина', icon: '🍷', count: 128 },
  { id: 'honey', name: 'Мёд и варенье', icon: '🍯', count: 89 },
  { id: 'crafts', name: 'Ремёсла', icon: '🏺', count: 167 },
  { id: 'textiles', name: 'Текстиль', icon: '🧵', count: 94 },
  { id: 'cosmetics', name: 'Косметика', icon: '🌿', count: 76 },
  { id: 'tea', name: 'Чай и травы', icon: '🍃', count: 112 },
  { id: 'tourism', name: 'Туризм', icon: '⛰️', count: 43 },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Вино «Лыхны» красное полусухое',
    price: 890,
    oldPrice: 1200,
    rating: 4.8,
    reviews: 342,
    category: 'wine',
    seller: 'Абхазские вина',
    sellerId: 1,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop',
    badge: 'Хит продаж',
    badgeType: 'orange',
    region: 'Гудаута',
    inStock: true,
    description: 'Традиционное абхазское красное вино из виноградников Гудаутского района. Насыщенный вкус с нотками лесных ягод.',
    tags: ['вино', 'красное', 'полусухое', 'абхазское'],
  },
  {
    id: 2,
    name: 'Мёд горный цветочный',
    price: 650,
    rating: 4.9,
    reviews: 218,
    category: 'honey',
    seller: 'Горные пасеки',
    sellerId: 2,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
    badge: 'Органик',
    badgeType: 'green',
    region: 'Сухум',
    inStock: true,
    description: 'Натуральный горный мёд, собранный на высоте 1500м. Уникальный букет альпийских цветов Кавказа.',
    tags: ['мёд', 'горный', 'органик', 'натуральный'],
  },
  {
    id: 3,
    name: 'Аджика абхазская острая',
    price: 320,
    oldPrice: 380,
    rating: 4.7,
    reviews: 891,
    category: 'food',
    seller: 'Ашана маркет',
    sellerId: 3,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    badge: '-16%',
    badgeType: 'orange',
    region: 'Гал',
    inStock: true,
    description: 'Классическая абхазская аджика по традиционному рецепту. Острая, ароматная, с чесноком и пряными травами.',
    tags: ['аджика', 'острая', 'соус', 'приправа'],
  },
  {
    id: 4,
    name: 'Чай горный «Рица»',
    price: 480,
    rating: 4.6,
    reviews: 156,
    category: 'tea',
    seller: 'Чайный дом',
    sellerId: 4,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    region: 'Гудаута',
    inStock: true,
    description: 'Сбор горных трав с берегов озера Рица. Черника, зверобой, мята, чабрец. Экологически чистый регион.',
    tags: ['чай', 'травяной', 'горный', 'рица'],
  },
  {
    id: 5,
    name: 'Ковёр ручной работы «Апсны»',
    price: 12500,
    rating: 5.0,
    reviews: 24,
    category: 'textiles',
    seller: 'Ремёсла Абхазии',
    sellerId: 5,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    badge: 'Ручная работа',
    badgeType: 'gold',
    region: 'Сухум',
    inStock: true,
    description: 'Традиционный абхазский ковёр ручного ткачества. Натуральная шерсть, природные красители, уникальный орнамент.',
    tags: ['ковёр', 'ручная работа', 'шерсть', 'традиционный'],
  },
  {
    id: 6,
    name: 'Варенье из инжира',
    price: 380,
    oldPrice: 450,
    rating: 4.8,
    reviews: 445,
    category: 'honey',
    seller: 'Горные пасеки',
    sellerId: 2,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    badge: 'Новинка',
    badgeType: 'green',
    region: 'Очамчира',
    inStock: true,
    description: 'Варенье из спелого абхазского инжира, приготовленное по старинному рецепту. Без консервантов.',
    tags: ['варенье', 'инжир', 'натуральное'],
  },
  {
    id: 7,
    name: 'Вино «Псоу» белое сухое',
    price: 750,
    rating: 4.5,
    reviews: 189,
    category: 'wine',
    seller: 'Абхазские вина',
    sellerId: 1,
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&h=400&fit=crop',
    region: 'Сухум',
    inStock: true,
    description: 'Лёгкое белое сухое вино с тонким цветочным ароматом. Идеально к морепродуктам и лёгким закускам.',
    tags: ['вино', 'белое', 'сухое'],
  },
  {
    id: 8,
    name: 'Крем-мёд с орехами',
    price: 720,
    oldPrice: 850,
    rating: 4.9,
    reviews: 312,
    category: 'honey',
    seller: 'Горные пасеки',
    sellerId: 2,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
    badge: '-15%',
    badgeType: 'orange',
    region: 'Гудаута',
    inStock: true,
    description: 'Взбитый мёд с грецким орехом. Нежная кремовая текстура, богатый ореховый вкус.',
    tags: ['мёд', 'крем', 'орехи', 'подарок'],
  },
  {
    id: 9,
    name: 'Керамика «Абхазские узоры»',
    price: 2800,
    rating: 4.7,
    reviews: 67,
    category: 'crafts',
    seller: 'Ремёсла Абхазии',
    sellerId: 5,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop',
    badge: 'Ручная работа',
    badgeType: 'gold',
    region: 'Сухум',
    inStock: true,
    description: 'Расписная керамика с традиционными абхазскими орнаментами. Каждое изделие уникально.',
    tags: ['керамика', 'ручная работа', 'сувенир', 'декор'],
  },
  {
    id: 10,
    name: 'Косметика «Апсара» с травами',
    price: 1450,
    rating: 4.6,
    reviews: 203,
    category: 'cosmetics',
    seller: 'Зелёная аптека',
    sellerId: 6,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    badge: 'Органик',
    badgeType: 'green',
    region: 'Новый Афон',
    inStock: true,
    description: 'Натуральная косметика на основе горных трав и эфирных масел Абхазии. Серия для лица и тела.',
    tags: ['косметика', 'натуральная', 'травы', 'уход'],
  },
  {
    id: 11,
    name: 'Чурчхела грецкий орех',
    price: 280,
    rating: 4.8,
    reviews: 634,
    category: 'food',
    seller: 'Ашана маркет',
    sellerId: 3,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
    region: 'Гал',
    inStock: true,
    description: 'Традиционная чурчхела с грецким орехом в виноградном соке. Натуральные ингредиенты.',
    tags: ['чурчхела', 'орех', 'виноград', 'сладость'],
  },
  {
    id: 12,
    name: 'Экскурсия на озеро Рица',
    price: 3500,
    rating: 4.9,
    reviews: 1247,
    category: 'tourism',
    seller: 'Абхаз-тур',
    sellerId: 7,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    badge: 'Популярное',
    badgeType: 'orange',
    region: 'Гудаута',
    inStock: true,
    description: 'Однодневная экскурсия на легендарное озеро Рица в горах Абхазии. Транспорт, гид, страховка включены.',
    tags: ['экскурсия', 'рица', 'горы', 'природа'],
  },
];

export const sellers: Seller[] = [
  {
    id: 1,
    name: 'Абхазские вина',
    rating: 4.8,
    reviews: 1240,
    productsCount: 45,
    location: 'Сухум',
    joinDate: '2021',
    verified: true,
    avatar: '🍷',
    description: 'Официальный представитель лучших виноделен Абхазии. Более 20 лет на рынке.',
  },
  {
    id: 2,
    name: 'Горные пасеки',
    rating: 4.9,
    reviews: 876,
    productsCount: 28,
    location: 'Гудаута',
    joinDate: '2020',
    verified: true,
    avatar: '🍯',
    description: 'Семейная пасека в горах Абхазии. Натуральный мёд без добавок с высоты 1500м.',
  },
  {
    id: 3,
    name: 'Ашана маркет',
    rating: 4.7,
    reviews: 2341,
    productsCount: 120,
    location: 'Гал',
    joinDate: '2019',
    verified: true,
    avatar: '🛒',
    description: 'Крупнейший поставщик абхазских продуктов питания. Прямые поставки от производителей.',
  },
  {
    id: 5,
    name: 'Ремёсла Абхазии',
    rating: 5.0,
    reviews: 412,
    productsCount: 67,
    location: 'Сухум',
    joinDate: '2022',
    verified: true,
    avatar: '🏺',
    description: 'Объединение мастеров традиционных абхазских ремёсел. Каждое изделие уникально.',
  },
  {
    id: 6,
    name: 'Зелёная аптека',
    rating: 4.6,
    reviews: 534,
    productsCount: 38,
    location: 'Новый Афон',
    joinDate: '2021',
    verified: false,
    avatar: '🌿',
    description: 'Натуральная косметика и фитопрепараты на основе горных трав Абхазии.',
  },
  {
    id: 7,
    name: 'Абхаз-тур',
    rating: 4.9,
    reviews: 3124,
    productsCount: 23,
    location: 'Сухум',
    joinDate: '2018',
    verified: true,
    avatar: '⛰️',
    description: 'Лицензированное туристическое агентство. Экскурсии, туры, трансфер по всей Абхазии.',
  },
];

export const regions = [
  'Все регионы',
  'Сухум',
  'Гудаута',
  'Гал',
  'Очамчира',
  'Новый Афон',
  'Гагра',
  'Пицунда',
];

export const deliveryInfo = {
  regions: [
    { name: 'Сухум', time: '1-2 дня', price: 'Бесплатно от 2000₽' },
    { name: 'Гудаута', time: '1-3 дня', price: '150₽' },
    { name: 'Гагра', time: '2-3 дня', price: '200₽' },
    { name: 'Гал', time: '2-4 дня', price: '250₽' },
    { name: 'Очамчира', time: '2-4 дня', price: '250₽' },
    { name: 'Новый Афон', time: '1-2 дня', price: '100₽' },
    { name: 'Пицунда', time: '2-3 дня', price: '200₽' },
    { name: 'Россия', time: '5-14 дней', price: 'от 500₽' },
  ]
};
