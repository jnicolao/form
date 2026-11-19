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
  {
    id: 'FORM-006',
    slug: 'exfoliating-face-scrub',
    name: 'Exfoliating Face Scrub',
    subtitle: 'Lactic Acid 5%',
    size: '75 g',
    priceKES: 1350,
    image: '/assets/images/exfoliating-face-scrub.webp',
    description:
      'A twice-a-week scrub that lifts away dead skin and buildup, leaving skin smoother and ready for a closer shave.',
    benefits: [
      'Helps remove dead skin and buildup',
      'Smooths the look of rough texture',
      'Preps skin for a closer shave',
    ],
    howToUse:
      'Massage a small amount onto damp skin for 30 seconds, then rinse well. Use two or three times a week. Avoid the eye area.',
    ingredients:
      'Aqua (Water), Glycerin, Lactic Acid, Jojoba Esters, Kaolin, Cetearyl Alcohol, Cocamidopropyl Betaine, Panthenol, Allantoin, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.',
    parcelClass: 'MEDIUM',
  },
  {
    id: 'FORM-007',
    slug: 'soothing-post-shave-balm',
    name: 'Soothing Post-Shave Balm',
    subtitle: 'Aloe Vera + Allantoin',
    size: '100 ml',
    priceKES: 1350,
    image: '/assets/images/post-shave-balm.webp',
    description:
      'A light, alcohol-free balm that calms skin after shaving and helps ease tightness and razor burn.',
    benefits: [
      'Calms skin after shaving',
      'Helps ease tightness and razor burn',
      'Alcohol-free and fast-absorbing',
    ],
    howToUse:
      'After shaving, rinse with cool water, pat dry and smooth a small amount over the shaved area.',
    ingredients:
      'Aqua (Water), Aloe Barbadensis Leaf Juice, Glycerin, Caprylic/Capric Triglyceride, Allantoin, Panthenol, Bisabolol, Cetearyl Alcohol, Tocopherol, Carbomer, Phenoxyethanol, Ethylhexylglycerin.',
    parcelClass: 'MEDIUM',
  },
  {
    id: 'FORM-008',
    slug: 'conditioning-beard-oil',
    name: 'Conditioning Beard Oil',
    subtitle: 'Jojoba + Argan',
    size: '30 ml',
    priceKES: 1450,
    image: '/assets/images/beard-oil.webp',
    description:
      'A lightweight oil that softens beard hair and conditions the skin underneath, without a greasy finish.',
    benefits: [
      'Softens and conditions beard hair',
      'Helps ease dryness and itch under the beard',
      'Lightweight, non-greasy feel',
    ],
    howToUse:
      'Warm three or four drops between your palms and work through a clean, dry beard down to the skin.',
    ingredients:
      'Simmondsia Chinensis (Jojoba) Seed Oil, Argania Spinosa (Argan) Kernel Oil, Vitis Vinifera (Grape) Seed Oil, Caprylic/Capric Triglyceride, Squalane, Tocopherol.',
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
