export type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  image: any; // For require() assets
};

export const services: Service[] = [
  {
    id: 'item1',
    name: 'Fade Cut',
    description: 'A stylish fade, from skin fade to taper. Clean and sharp.',
    price: '250',
    originalPrice: '300',
    image: require('../assets/fade-cut.jpg'),
  },
  {
    id: 'item2',
    name: 'Beard Trim & Shape',
    description: 'Expert shaping and trimming to keep your beard looking its best.',
    price: '150',
    originalPrice: '200',
    image: require('../assets/beard-trim.jpg'),
  },
  {
    id: 'item3',
    name: 'Head Massage (15 min)',
    description: 'A relaxing champi-style head massage to relieve stress.',
    price: '200',
    originalPrice: '250',
    image: require('../assets/head-massage.jpg'),
  },
  {
    id: 'item4',
    name: 'Hair Wash & Blow Dry',
    description: 'Complete hair wash with premium shampoo and professional blow dry.',
    price: '180',
    originalPrice: '220',
    image: require('../assets/hair-wash.jpg'),
  },
  {
    id: 'item5',
    name: 'Mustache Trim',
    description: 'Precise mustache trimming and styling for a clean, polished look.',
    price: '80',
    originalPrice: '100',
    image: require('../assets/mustache-trim.jpg'),
  },
  {
    id: 'item6',
    name: 'Hair Styling & Gel',
    description: 'Professional hair styling with premium gel for that perfect finish.',
    price: '120',
    originalPrice: '150',
    image: require('../assets/hair-styling.jpg'),
  },
];
