
export const ETHIOPIAN_REGIONS = [
  'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'Sidama',
  'SNNPR', 'Somali', 'Afar', 'Benishangul-Gumuz', 'Gambela',
  'Harari', 'Dire Dawa'
];

export const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr', desc: 'Instant mobile money' },
  { id: 'cbe_birr', name: 'CBE Birr', desc: 'Commercial Bank wallet' },
  { id: 'cod',      name: 'Cash on Delivery', desc: 'Pay when you receive' }
];

export const PRODUCT_CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone' },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt' },
  { id: 'home', name: 'Home & Kitchen', icon: 'Home' },
  { id: 'crafts', name: 'Traditional Crafts', icon: 'Palette' },
  { id: 'coffee', name: 'Coffee & Spices', icon: 'Coffee' },
  { id: 'beauty', name: 'Beauty & Health', icon: 'Heart' },
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingBasket' },
  { id: 'books', name: 'Books', icon: 'BookOpen' }
];

export const formatETB = (n: number) =>
  new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(n);
