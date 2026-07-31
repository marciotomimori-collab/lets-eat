export interface CuisineType {
  key: string;
  labelPt: string;
  labelEn: string;
  emoji: string;
  googleType?: string; // Google Places type mapping
}

export const CUISINE_TYPES: CuisineType[] = [
  { key: 'japanese', labelPt: 'Japonesa', labelEn: 'Japanese', emoji: '🍣', googleType: 'japanese_restaurant' },
  { key: 'italian', labelPt: 'Italiana', labelEn: 'Italian', emoji: '🍝', googleType: 'italian_restaurant' },
  { key: 'brazilian', labelPt: 'Brasileira', labelEn: 'Brazilian', emoji: '🥩', googleType: 'brazilian_restaurant' },
  { key: 'mexican', labelPt: 'Mexicana', labelEn: 'Mexican', emoji: '🌮', googleType: 'mexican_restaurant' },
  { key: 'chinese', labelPt: 'Chinesa', labelEn: 'Chinese', emoji: '🥡', googleType: 'chinese_restaurant' },
  { key: 'vegan', labelPt: 'Vegana', labelEn: 'Vegan', emoji: '🥗', googleType: 'vegan_restaurant' },
  { key: 'pizza', labelPt: 'Pizza', labelEn: 'Pizza', emoji: '🍕', googleType: 'pizza_restaurant' },
  { key: 'burger', labelPt: 'Hambúrguer', labelEn: 'Burger', emoji: '🍔', googleType: 'hamburger_restaurant' },
  { key: 'arabic', labelPt: 'Árabe', labelEn: 'Arabic', emoji: '🧆', googleType: 'middle_eastern_restaurant' },
  { key: 'indian', labelPt: 'Indiana', labelEn: 'Indian', emoji: '🍛', googleType: 'indian_restaurant' },
  { key: 'korean', labelPt: 'Coreana', labelEn: 'Korean', emoji: '🍜', googleType: 'korean_restaurant' },
  { key: 'french', labelPt: 'Francesa', labelEn: 'French', emoji: '🥐', googleType: 'french_restaurant' },
  { key: 'thai', labelPt: 'Tailandesa', labelEn: 'Thai', emoji: '🍲', googleType: 'thai_restaurant' },
  { key: 'peruvian', labelPt: 'Peruana', labelEn: 'Peruvian', emoji: '🐟', googleType: 'peruvian_restaurant' },
  { key: 'steakhouse', labelPt: 'Churrasco', labelEn: 'Steakhouse', emoji: '🥩', googleType: 'steak_house' },
  { key: 'seafood', labelPt: 'Frutos do Mar', labelEn: 'Seafood', emoji: '🦐', googleType: 'seafood_restaurant' },
  { key: 'bakery', labelPt: 'Padaria/Café', labelEn: 'Bakery/Café', emoji: '☕', googleType: 'bakery' },
  { key: 'dessert', labelPt: 'Doces/Sobremesa', labelEn: 'Dessert', emoji: '🍰', googleType: 'dessert_restaurant' },
];
