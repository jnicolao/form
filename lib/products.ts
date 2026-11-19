export type ParcelClass = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  size: string;
  priceKES: number;
  image: string;
  description: string;
  benefits: string[];
  howToUse: string;
  ingredients: string;
  parcelClass: ParcelClass;
}

export const products: Product[] = [
  {
    id: 'FORM-001',
    slug: 'daily-face-cleanser',
    name: 'Daily Face Cleanser',
    subtitle: 'Salicylic Acid + LHA 2%',
    size: '100 ml',
    priceKES: 1250,
    image: '/assets/images/daily-face-cleanser.webp',
    description:
      'A straightforward daily cleanse for oily and blemish-prone skin. Helps wash away excess oil, dirt and buildup, leaving skin feeling fresh.',
    benefits: [
      'Helps remove excess oil',
      'Gently cleanses skin',
      'Suitable for an oily-skin routine',
    ],
    howToUse:
      'Apply a small amount to damp skin, massage gently and rinse thoroughly. Avoid the eye area.',
    ingredients:
      'Salicylic Acid, LHA, Glycerin, Aqua (Water), Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine, Niacinamide, Zinc PCA, Xanthan Gum, Sodium Hyaluronate, Phenoxyethanol, Ethylhexylglycerin.',
    parcelClass: 'MEDIUM',
  },
  {
    id: 'FORM-002',
    slug: 'oil-control-serum',
    name: 'Oil Control Serum',
    subtitle: 'Niacinamide 10%',
    size: '30 ml',
    priceKES: 1650,
    image: '/assets/images/oil-control-serum.webp',
    description:
      'A lightweight serum designed to help manage excess oil and improve the appearance of uneven skin tone and blemishes.',
    benefits: [
      'Helps manage visible excess oil',
      'Supports a more even-looking complexion',
      'Lightweight daily texture',
    ],
    howToUse: 'Apply a few drops to clean, dry skin before moisturizing.',
    ingredients:
      'Aqua (Water), Niacinamide, Glycerin, Pentylene Glycol, Zinc PCA, Hyaluronic Acid, Camellia Sinensis Leaf Extract, Allantoin, Carbomer, Triethanolamine, Phenoxyethanol, Ethylhexylglycerin.',
    parcelClass: 'SMALL',
  },
  {
    id: 'FORM-003',
    slug: 'daily-hydrating-moisturizer',
    name: 'Daily Hydrating Moisturizer',
    subtitle: 'Vitamin B5 10%',
    size: '50 g',
    priceKES: 1450,
    image: '/assets/images/hydrating-moisturizer.webp',
    description:
      'Lightweight, oil-free hydration that keeps skin comfortable without a heavy or greasy finish.',
    benefits: [
      'Everyday hydration',
      'Lightweight application',
      'Comfortable non-greasy finish',
    ],
    howToUse: 'Apply evenly to the face after cleansing and any serum.',
    ingredients:
      'Aqua (Water), Glycerin, Panthenol (Vitamin B5), Dimethicone, Niacinamide, Cetearyl Alcohol, Cetearyl Olivate, Sorbitan Olivate, Sodium Hyaluronate, Allantoin, Tocopherol, Phenoxyethanol, Ethylhexylglycerin.',
    parcelClass: 'MEDIUM',
  },
  {
    id: 'FORM-004',
    slug: 'daily-spf-50-sunscreen',
    name: 'Daily SPF 50 Sunscreen',
    subtitle: 'Broad-Spectrum Protection',
    size: '50 g',
    priceKES: 1550,
    image: '/assets/images/spf50-sunscreen.webp',
    description:
      'Everyday UVA and UVB protection with a comfortable lightweight feel. The essential final step of a morning routine.',
    benefits: [
      'Broad-spectrum SPF 50',
      'Suitable for daily sun protection',
      'Comfortable everyday texture',
    ],
    howToUse:
      'Apply generously as the last step of your morning skincare routine, following the product label\u2019s reapplication guidance.',
    ingredients:
      'Aqua (Water), Ethylhexyl Methoxycinnamate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Glycerin, C12-15 Alkyl Benzoate, Niacinamide, Dimethicone, Tocopherol, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.',
    parcelClass: 'MEDIUM',
  },
  {
    id: 'FORM-005',
    slug: 'brightening-face-serum',
    name: 'Brightening Face Serum',
    subtitle: 'Vitamin C 10%',
    size: '30 ml',
    priceKES: 1750,
    image: '/assets/images/brightening-serum.webp',
    description:
      'An antioxidant facial serum designed to improve the appearance of dullness and uneven skin tone.',
    benefits: [
      'Helps improve the look of dullness',
      'Supports more even-looking skin',
      'Antioxidant skincare ingredient',
    ],
    howToUse:
      'Apply a few drops to clean skin before moisturizer. Use sunscreen during the day.',
    ingredients:
      'Aqua (Water), Ethyl Ascorbic Acid (Vitamin C), Glycerin, Propylene Glycol, Ferulic Acid, Hyaluronic Acid, Panthenol, Allantoin, Carbomer, Triethanolamine, Phenoxyethanol, Ethylhexylglycerin.',
    parcelClass: 'SMALL',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(currentId: string, count = 4): Product[] {
  return products.filter((p) => p.id !== currentId).slice(0, count);
}

// Flat fees shown by the standard (demo) checkout.
export const STANDARD_DELIVERY_FEE_KES = 250;
export const STANDARD_PROCESSING_FEE_KES = 50;

export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}
