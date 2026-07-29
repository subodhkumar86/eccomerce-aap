export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  images: string[];
  specs: { label: string; value: string }[];
  colors: string[];
  sizes?: string[];
  inStock: boolean;
}

export const CATEGORIES = ['All', 'Audio', 'Wearables', 'Lifestyle', 'Workspace'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Aura Sound Pro',
    category: 'Audio',
    price: 299,
    rating: 4.8,
    reviewsCount: 142,
    description: 'Experience absolute audio purity with active noise cancelling, custom spatial audio, and high-fidelity sound. Designed with brushed metallic earcups and full-grain leather details.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Battery Life', value: 'Up to 30 hours' },
      { label: 'Connectivity', value: 'Bluetooth 5.2, USB-C' },
      { label: 'Noise Control', value: 'Hybrid Active ANC' },
      { label: 'Driver Size', value: '40 mm Dynamic' }
    ],
    colors: ['#000000', '#E5E7EB', '#D1FAE5'],
    inStock: true
  },
  {
    id: 'p2',
    name: 'Chrono Elite Watch',
    category: 'Wearables',
    price: 349,
    rating: 4.7,
    reviewsCount: 98,
    description: 'A seamless blend of classic horology and modern smart-tracking. Tracks heart rate, sleep quality, and active stress levels in a sleek titanium-alloy casing.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Material', value: 'Titanium Shell' },
      { label: 'Water Proof', value: '5 ATM (50m)' },
      { label: 'Display', value: 'AMOLED Retina' },
      { label: 'Sensors', value: 'Heart Rate, SpO2, Accelerometer' }
    ],
    colors: ['#374151', '#D1D5DB', '#B45309'],
    inStock: true
  },
  {
    id: 'p3',
    name: 'Apex Minimalist Pack',
    category: 'Lifestyle',
    price: 120,
    rating: 4.6,
    reviewsCount: 215,
    description: 'Designed for the modern commuter. Features a water-resistant Cordura shell, dedicated padded laptop sleeve, and hidden quick-access compartments.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Capacity', value: '22 Liters' },
      { label: 'Laptop Sleeve', value: 'Up to 16 inches' },
      { label: 'Weight', value: '0.85 kg' },
      { label: 'Waterproofing', value: 'IPX4 Splash Resistant' }
    ],
    colors: ['#000000', '#1E3A8A', '#065F46'],
    sizes: ['Standard', 'Pro (28L)'],
    inStock: true
  },
  {
    id: 'p4',
    name: 'Keystone Mechanical Board',
    category: 'Workspace',
    price: 189,
    rating: 4.9,
    reviewsCount: 74,
    description: 'A luxurious tactile workspace upgrade. Designed with hot-swappable switches, sound-dampening foam, custom doubleshot PBT keycaps, and anodized aluminum base.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Layout', value: '75% Compact' },
      { label: 'Switches', value: 'Gateron Brown Tactile' },
      { label: 'Backlight', value: 'RGB Customizable' },
      { label: 'Hot-Swap', value: 'Yes, 3/5-pin compatible' }
    ],
    colors: ['#1F2937', '#F3F4F6'],
    inStock: true
  },
  {
    id: 'p5',
    name: 'AeroBuds Sleek',
    category: 'Audio',
    price: 149,
    rating: 4.5,
    reviewsCount: 312,
    description: 'Ultra-lightweight true wireless earbuds. Delivers powerful deep bass and clear vocal clarity with a pocketable touch-sensitive charging pod.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Driver', value: '10mm Dynamic' },
      { label: 'Battery Life', value: '6h Buds / 24h Case' },
      { label: 'Bluetooth', value: '5.3 BLE' },
      { label: 'Waterproofing', value: 'IPX5 Sweat Proof' }
    ],
    colors: ['#ffffff', '#000000', '#FCA5A5'],
    inStock: true
  },
  {
    id: 'p6',
    name: 'Luxe Drip Coffee Brew',
    category: 'Lifestyle',
    price: 95,
    rating: 4.6,
    reviewsCount: 54,
    description: 'Precision pour-over brewing stand crafted from walnut wood and solid brass. Includes double-walled borosilicate glass carafe for perfect temperature retention.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Material', value: 'Walnut, Brass, Glass' },
      { label: 'Carafe Size', value: '600 ml (2-4 Cups)' },
      { label: 'Filter Type', value: 'Paper / Stainless V60' },
      { label: 'Base Finish', value: 'Waterproof Matte Varnish' }
    ],
    colors: ['#78350F', '#D97706'],
    inStock: true
  }
];
