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

export const CATEGORIES = ['All', 'Audio', 'Wearables', 'Lifestyle', 'Workspace', 'Home Living', 'Desk Accessories'];

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
  },
  {
    id: 'p7',
    name: 'Horizon Wool Desk Mat',
    category: 'Workspace',
    price: 49,
    rating: 4.8,
    reviewsCount: 167,
    description: 'Protect your workspace and damp keyboard vibrations with this premium 100% Merino wool felt desk pad. Features a scalloped non-slip natural cork base.',
    image: 'https://images.unsplash.com/photo-1632292224971-0d45778b361e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1632292224971-0d45778b361e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Material', value: '100% Merino Wool, Cork' },
      { label: 'Dimensions', value: '900 x 300 x 5 mm' },
      { label: 'Stitching', value: 'Anti-fray flat lock' },
      { label: 'Base Grip', value: '100% Non-Slip Cork' }
    ],
    colors: ['#4B5563', '#9CA3AF', '#D1D5DB'],
    sizes: ['Standard (90x30)', 'Plus (100x40)'],
    inStock: true
  },
  {
    id: 'p8',
    name: 'Ignite Carbon Sunglasses',
    category: 'Lifestyle',
    price: 135,
    rating: 4.7,
    reviewsCount: 83,
    description: 'Engineered with real aerospace-grade carbon fiber templates. Outfitted with premium TAC polarized lenses that offer 100% UV400 protection and scratch-resistant coatings.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Frame Weight', value: 'Only 18 grams' },
      { label: 'Lens Material', value: 'Triacetate Cellulose (TAC)' },
      { label: 'UV Shield', value: '100% UVA / UVB protection' },
      { label: 'Hinges', value: 'Reinforced multi-barrel steel' }
    ],
    colors: ['#000000', '#1F2937', '#B45309'],
    inStock: true
  },
  {
    id: 'p9',
    name: 'Aura Atmos Soundbar',
    category: 'Audio',
    price: 399,
    rating: 4.9,
    reviewsCount: 62,
    description: 'Immersive home theater soundbar featuring 5 custom-tuned internal drivers and a wireless subwoofer receiver. Built-in eARC support for Dolby Atmos decoding.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Audio Channels', value: '3.1.2 Surround' },
      { label: 'Total Power', value: '360 Watts RMS' },
      { label: 'Inputs', value: 'HDMI eARC, Optical, Aux' },
      { label: 'Voice Control', value: 'Alexa, Google Assistant' }
    ],
    colors: ['#000000', '#F3F4F6'],
    inStock: true
  },
  {
    id: 'p10',
    name: 'Chrono Active Band',
    category: 'Wearables',
    price: 199,
    rating: 4.6,
    reviewsCount: 174,
    description: 'An elegant activity tracker built for 24/7 wear. Encased in a polished steel case with premium water-resistant fluoroelastomer and classic leather bands included.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Battery Life', value: 'Up to 14 days' },
      { label: 'Sensors', value: 'Optical PPG Heart Rate, ECG' },
      { label: 'Display Size', value: '1.43" AMOLED Display' },
      { label: 'Body Material', value: 'Stainless steel 316L' }
    ],
    colors: ['#111827', '#E5E7EB', '#D97706'],
    inStock: true
  },
  {
    id: 'p11',
    name: 'Nomad Tech Organizer',
    category: 'Lifestyle',
    price: 65,
    rating: 4.8,
    reviewsCount: 145,
    description: 'Keep your charging bricks, cables, memory cards, and hard drives neatly organized. Made of ballistic nylon with elastic loops and secure zipper meshes.',
    image: 'https://images.unsplash.com/photo-1625014020903-e329f586c990?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1625014020903-e329f586c990?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Material', value: '1680D Ballistic Nylon' },
      { label: 'Dimensions', value: '24 x 15 x 7 cm' },
      { label: 'Zippers', value: 'YKK Aquaguard waterproof' },
      { label: 'Weight', value: '220 grams' }
    ],
    colors: ['#000000', '#374151', '#065F46'],
    inStock: true
  },
  {
    id: 'p12',
    name: 'Keystone Artisan Caps',
    category: 'Workspace',
    price: 75,
    rating: 4.9,
    reviewsCount: 29,
    description: 'Give your mechanical keyboard a centerpiece with these hand-cast resin keycaps featuring floating gold leaf flakes and micro-details. Fits standard Cherry MX stem layout.',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Keycap Profile', value: 'OEM Profile (Esc/R4)' },
      { label: 'Stem Compatibility', value: 'Cherry MX / Gateron / Kailh' },
      { label: 'Material', value: 'Epoxy Resin, Gold foil' },
      { label: 'Creation', value: 'Handmade, polished finish' }
    ],
    colors: ['#F59E0B', '#111827', '#DC2626'],
    inStock: true
  },
  {
    id: 'p13',
    name: 'Sound Wave ANC Speaker',
    category: 'Audio',
    price: 175,
    rating: 4.7,
    reviewsCount: 112,
    description: 'Premium outdoor portable speaker with acoustic-dampening active ambient technology. Encased in a beautiful sandblasted anodized aluminum housing with magnetic handle.',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Output Power', value: '30W Stereo' },
      { label: 'Battery Life', value: 'Up to 20 hours' },
      { label: 'Water Proofing', value: 'IP67 dust & water proof' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, Aux-in' }
    ],
    colors: ['#9CA3AF', '#111827', '#065F46'],
    inStock: true
  },
  {
    id: 'p14',
    name: 'Sound Shield Earplugs',
    category: 'Audio',
    price: 35,
    rating: 4.6,
    reviewsCount: 231,
    description: 'High-fidelity reusable earplugs for musicians, concertgoers, and noise-sensitive individuals. Lowers volume evenly by 18 decibels without sacrificing vocal or melody clarity.',
    image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Attenuation', value: 'SNR 18dB protection' },
      { label: 'Material', value: 'Medical-grade hypoallergenic silicone' },
      { label: 'Tips Included', value: 'S, M, L interchangeable' },
      { label: 'Carry Case', value: 'Aluminum key-ring capsule' }
    ],
    colors: ['#EF4444', '#10B981', '#3B82F6'],
    inStock: true
  },
  {
    id: 'p15',
    name: 'Chrono Smart Ring',
    category: 'Wearables',
    price: 220,
    rating: 4.5,
    reviewsCount: 88,
    description: 'Sleek, lightweight smart ring for continuous bio-metric tracking. Tracks sleep cycles, resting heart rate, and body temperature fluctuations in a hypoallergenic ceramic shell.',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Ring Thickness', value: '2.5 mm' },
      { label: 'Weight', value: '4 grams' },
      { label: 'Battery Life', value: 'Up to 7 days' },
      { label: 'Water Rating', value: '100m Waterproof (10 ATM)' }
    ],
    colors: ['#D1D5DB', '#F59E0B', '#111827'],
    sizes: ['Size 8', 'Size 9', 'Size 10'],
    inStock: true
  },
  {
    id: 'p16',
    name: 'Nomad Passport Wallet',
    category: 'Lifestyle',
    price: 80,
    rating: 4.8,
    reviewsCount: 104,
    description: 'Handcrafted luxury passport wallet in full-grain Horween leather. Features RFID-blocking lining, 4 card slots, boarding pass sleeve, and integrated pen holder.',
    image: 'https://images.unsplash.com/photo-1627123590733-458b5ebca7a7?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1627123590733-458b5ebca7a7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Leather', value: 'Full-grain Horween Leather' },
      { label: 'RFID Blocking', value: 'Yes, 13.56 MHz shielding' },
      { label: 'Card Slots', value: '4 slots, fits 8 cards' },
      { label: 'Warranty', value: 'Lifetime stitch guarantee' }
    ],
    colors: ['#78350F', '#000000', '#1E3A8A'],
    inStock: true
  },
  {
    id: 'p17',
    name: 'Luxe Leather Desk Pad',
    category: 'Workspace',
    price: 110,
    rating: 4.9,
    reviewsCount: 46,
    description: 'Introduce luxury to your keyboard. Crafted from premium vegetable-tanned full-grain leather, developing a unique personal patina over years of use.',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1632292224971-0d45778b361e?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Leather Thickness', value: '2.0 mm' },
      { label: 'Dimensions', value: '800 x 400 mm' },
      { label: 'Edge Finish', value: 'Hand-painted wax finish' },
      { label: 'Sanding', value: 'Suede non-slip backing' }
    ],
    colors: ['#78350F', '#000000', '#4B5563'],
    inStock: true
  },
  {
    id: 'p18',
    name: 'Keystone Aviator Cable',
    category: 'Workspace',
    price: 45,
    rating: 4.7,
    reviewsCount: 153,
    description: 'Premium coiled mechanical keyboard cable with detachable 4-pin GX16 aviator connector. Double-sleeved with Paracord and Techflex for maximum structure and aesthetics.',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Coil Length', value: '6 inches (15 cm)' },
      { label: 'Coil Diameter', value: '1/2 inch outer diameter' },
      { label: 'Connector', value: 'GX16 Aviator, USB-C to USB-A' },
      { label: 'Sleeving', value: 'Double-Sleeved Paracord + Techflex' }
    ],
    colors: ['#F59E0B', '#3B82F6', '#10B981'],
    inStock: true
  },
  {
    id: 'p19',
    name: 'Chrono Carbon Hybrid',
    category: 'Wearables',
    price: 499,
    rating: 4.9,
    reviewsCount: 41,
    description: 'High-performance watch forged from custom forged carbon fiber and grade-5 titanium components. Complete with mechanical chronometer overlay and smart vital indicators.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Material', value: 'Forged Carbon, Grade 5 Titanium' },
      { label: 'Strap', value: 'FKM Sport Fluoroelastomer' },
      { label: 'Power', value: 'Dual solar charging + 20-day battery' },
      { label: 'Weight', value: 'Only 34 grams shell' }
    ],
    colors: ['#111827', '#E5E7EB'],
    inStock: true
  },
  {
    id: 'p20',
    name: 'Aura Studio Monitors',
    category: 'Audio',
    price: 599,
    rating: 4.8,
    reviewsCount: 37,
    description: 'Professional reference speakers for audio creators and luxury desk aesthetics. Features custom planar magnetic tweeters and woven kevlar subwoofers with walnut baffles.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Tweeter Type', value: 'Planar Magnetic Ribbon' },
      { label: 'Woofer Size', value: '5.25" Woven Kevlar' },
      { label: 'Frequency Resp.', value: '38Hz - 22kHz' },
      { label: 'Amplification', value: 'Class-D bi-amplified, 120W per channel' }
    ],
    colors: ['#78350F', '#111827'],
    inStock: true
  },
  {
    id: 'p21',
    name: 'Luxe Leather Duffle',
    category: 'Lifestyle',
    price: 240,
    rating: 4.7,
    reviewsCount: 92,
    description: 'Perfect weekend duffle bag meticulously crafted from vegetable-tanned Italian saddle leather. Features heavy-duty solid brass hardware and soft flannel interior lining.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Capacity', value: '45 Liters' },
      { label: 'Dimensions', value: '55 x 30 x 28 cm' },
      { label: 'Hardware', value: 'Solid brass zippers & D-rings' },
      { label: 'Strap', value: 'Detachable padded leather strap' }
    ],
    colors: ['#78350F', '#000000'],
    inStock: true
  },
  {
    id: 'p22',
    name: 'Keystone Walnut Wrist Rest',
    category: 'Workspace',
    price: 85,
    rating: 4.8,
    reviewsCount: 119,
    description: 'Ergonomically angled keyboard wrist rest carved from a single solid block of black walnut wood. Fitted with rubber non-slip feet and sealed with organic oils.',
    image: 'https://images.unsplash.com/photo-1632292224971-0d45778b361e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1632292224971-0d45778b361e?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Material', value: 'Solid American Black Walnut' },
      { label: 'Angle', value: '8-degree ergonomic slope' },
      { label: 'Dimensions', value: '315 x 80 x 18 mm (fits 75%)' },
      { label: 'Finish', value: 'Rubio Monocoat organic oil' }
    ],
    colors: ['#78350F', '#4B5563'],
    inStock: true
  },
  {
    id: 'p23',
    name: 'AeroBuds Pro Max',
    category: 'Audio',
    price: 220,
    rating: 4.9,
    reviewsCount: 78,
    description: 'Luxury audio ANC earphones designed with high-density ceramic casing and gold-plated connectors. Features advanced transparency mode and smart bone-conduction mics.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Driver', value: '11mm Planar Driver' },
      { label: 'Noise Block', value: 'Up to 48dB Smart ANC' },
      { label: 'Charging', value: 'USB-C + Qi Wireless charging' },
      { label: 'Material', value: 'High-density ceramic & aluminum' }
    ],
    colors: ['#ffffff', '#111827'],
    inStock: true
  },
  {
    id: 'p24',
    name: 'Nomad Titanium Pen',
    category: 'Lifestyle',
    price: 95,
    rating: 4.7,
    reviewsCount: 63,
    description: 'Tactile bolt-action writing instrument CNC machined from solid medical-grade titanium. Outfitted with Schmidt easyFLOW 9000 pressurized ink refills.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Material', value: 'Grade-5 Titanium' },
      { label: 'Length', value: '130 mm' },
      { label: 'Clip', value: 'Deep-carry machined pocket clip' },
      { label: 'Mechanism', value: 'Precise fluid bolt action' }
    ],
    colors: ['#D1D5DB', '#111827'],
    inStock: true
  },
  {
    id: 'p25',
    name: 'Aura Studio Stand',
    category: 'Workspace',
    price: 145,
    rating: 4.8,
    reviewsCount: 42,
    description: 'Acoustically isolated heavy steel desktop speaker stands. Elevates monitors to ear level with a 5-degree tilt and limits mechanical vibrations using custom isolators.',
    image: 'https://images.unsplash.com/photo-1632292224971-0d45778b361e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1632292224971-0d45778b361e?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Material', value: 'Laser-cut powdercoated carbon steel' },
      { label: 'Isolation', value: 'Sorbothane acoustic dampening feet' },
      { label: 'Tilt Angle', value: '5 degrees upward angle' },
      { label: 'Weight Limit', value: 'Up to 15 kg per stand' }
    ],
    colors: ['#111827', '#E5E7EB'],
    inStock: true
  },
  {
    id: 'p26',
    name: 'Chrono Explorer Watch',
    category: 'Wearables',
    price: 650,
    rating: 4.9,
    reviewsCount: 21,
    description: 'Rugged luxury hybrid watch engineered for extreme environments. Outfitted with hardened steel shell, carbon fiber bezel, sapphire glass, and automatic chronometer.',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Casing', value: '316L Sandblasted Hardened Steel' },
      { label: 'Glass', value: 'Scratch-proof Sapphire Crystal' },
      { label: 'Depth Rating', value: '200 meters (20 ATM)' },
      { label: 'Movement', value: 'Japanese automatic calibre' }
    ],
    colors: ['#1F2937', '#9CA3AF'],
    inStock: true
  },
  {
    id: 'p27',
    name: 'Nomad Waxed Canvas Pack',
    category: 'Lifestyle',
    price: 180,
    rating: 4.6,
    reviewsCount: 75,
    description: 'Vintage-styled heavy waxed canvas travel rucksack. Accentuated with vegetable-tanned harness leather straps and solid copper rivets.',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Canvas', value: '18oz Heavy Waxed Cotton Canvas' },
      { label: 'Volume', value: '28 Liters expanded' },
      { label: 'Pockets', value: 'Side water bottle pockets + front organizer' },
      { label: 'Hardware', value: 'Solid brass buckles and snaps' }
    ],
    colors: ['#065F46', '#78350F', '#1F2937'],
    inStock: true
  },
  {
    id: 'p28',
    name: 'Luxe Leather Valet Tray',
    category: 'Workspace',
    price: 55,
    rating: 4.8,
    reviewsCount: 94,
    description: 'Organize your daily carry items in style. Handcrafted leather dresser tray featuring quick-snap solid brass corners that lay flat for easy travel.',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Leather', value: 'Full-Grain English Bridle Leather' },
      { label: 'Snaps', value: 'Solid brass snaps' },
      { label: 'Dimensions', value: '180 x 180 x 40 mm (assembled)' },
      { label: 'Utility', value: 'Perfect for keys, watch, and coins' }
    ],
    colors: ['#78350F', '#000000', '#D1D5DB'],
    inStock: true
  },
  {
    id: 'p29',
    name: 'Keystone Walnut Esc Key',
    category: 'Workspace',
    price: 40,
    rating: 4.9,
    reviewsCount: 16,
    description: 'Accent keycap hand-carved from solid black walnut wood. Finished with premium oils and buffed to a smooth semi-gloss feel. Fits standard mechanical keyboard layouts.',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Key Profile', value: 'R4 (Esc / Function Row)' },
      { label: 'Material', value: 'American Walnut wood' },
      { label: 'Stem Type', value: 'Standard Cherry MX cross' },
      { label: 'Coating', value: 'Sweat-resistant matte polyurethane' }
    ],
    colors: ['#78350F'],
    inStock: true
  },
  {
    id: 'p30',
    name: 'Sound Shield Pro Buds',
    category: 'Audio',
    price: 190,
    rating: 4.7,
    reviewsCount: 52,
    description: 'High-performance active audio protection earphones. Perfect for shooting ranges, heavy workspaces, and concerts, offering real-time acoustic sound suppression.',
    image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Protection', value: 'Active sound gate, NRR 25dB protection' },
      { label: 'Battery Life', value: 'Up to 12 hours continuous' },
      { label: 'Response Time', value: 'Ultra-fast 0.02ms compression trigger' },
      { label: 'Ear Tips', value: 'Comply foam noise-isolation tips' }
    ],
    colors: ['#111827', '#DC2626'],
    inStock: true
  },
  {
    id: 'p31',
    name: 'Lumine Ambient Lightbar',
    category: 'Home Living',
    price: 89,
    rating: 4.8,
    reviewsCount: 112,
    description: 'Dynamic RGBIC ambient lightbar that monitors display output and matches on-screen colors in real-time. Designed with aircraft-grade sandblasted aluminum and diffusion lenses.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Light Engine', value: 'RGBIC Addressable LEDs' },
      { label: 'Sync Modes', value: 'Camera Sync, Audio Reactive, App Manual' },
      { label: 'Dimensions', value: '420 x 30 x 20 mm' },
      { label: 'Control', value: 'Wi-Fi, Bluetooth app, or voice control' }
    ],
    colors: ['#000000', '#F3F4F6'],
    inStock: true
  },
  {
    id: 'p32',
    name: 'Apex Dual Monitor Arm',
    category: 'Workspace',
    price: 159,
    rating: 4.7,
    reviewsCount: 84,
    description: 'Heavy-duty mechanical spring dual monitor mount. Supports screen sizes up to 32 inches and provides 360-degree rotation, tilt, and height adjustments with built-in cable management.',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Weight Capacity', value: '2 - 9 kg per arm' },
      { label: 'VESA Plate', value: '75x75, 100x100 quick release' },
      { label: 'Mounting options', value: 'Desk Clamp or Grommet mount' },
      { label: 'Cable Routing', value: 'Integrated hidden clips' }
    ],
    colors: ['#111827', '#E5E7EB'],
    inStock: true
  },
  {
    id: 'p33',
    name: 'Ergo Leather Desk Pad',
    category: 'Desk Accessories',
    price: 79,
    rating: 4.9,
    reviewsCount: 146,
    description: 'Protect your workspace with premium vegetable-tanned Horween leather. Hand-burnished edges, soft suede lining, and a designated metallic charging channel for accessories.',
    image: 'https://images.unsplash.com/photo-1632292224971-0d45778b361e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1632292224971-0d45778b361e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Material', value: 'Horween Full Grain Leather, Suede' },
      { label: 'Dimensions', value: '800 x 400 x 4 mm' },
      { label: 'Stitching', value: 'Hand-sewn nylon thread' },
      { label: 'Water Resistant', value: 'Treated with wax protector' }
    ],
    colors: ['#78350F', '#000000', '#D1D5DB'],
    sizes: ['Medium', 'Large'],
    inStock: true
  },
  {
    id: 'p34',
    name: 'Apex Vacuum Mug',
    category: 'Lifestyle',
    price: 35,
    rating: 4.5,
    reviewsCount: 220,
    description: 'Double-walled vacuum insulated travel mug built from 18/8 kitchen-grade stainless steel. Keeps drinks piping hot for 12 hours or ice-cold for 24 hours. Leak-proof lock lid.',
    image: 'https://images.unsplash.com/photo-1514218247612-f1da63a49c7b?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1514218247612-f1da63a49c7b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Volume', value: '450 ml (15 oz)' },
      { label: 'Material', value: '18/8 Pro-Grade Stainless Steel' },
      { label: 'BPA Free', value: 'Yes, food-grade silicone seals' },
      { label: 'Lid System', value: 'Trigger-action push button leak lock' }
    ],
    colors: ['#000000', '#065F46', '#1E3A8A'],
    inStock: true
  }
];
