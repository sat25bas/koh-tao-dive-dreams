import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Trophy, MapPin } from 'lucide-react';

type Currency = 'THB' | 'USD' | 'EUR';

interface Specialty {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  priceTHB: number;
  priceUSD: number;
  priceEUR: number;
  maxDepth?: string;
  prerequisites?: string;
  highlights?: string[];
}

const SPECIALTIES_EN: Specialty[] = [
  // Core Specialties
  {
    id: 'peak-performance-buoyancy',
    title: 'Peak Performance Buoyancy',
    slug: 'peak-performance-buoyancy',
    description: 'Master perfect buoyancy control for comfort, safety, and efficiency underwater.',
    duration: '1 day',
    level: 'Intermediate',
    category: 'Core',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '18m',
    highlights: ['Perfect buoyancy control', 'Dive efficiency', 'Energy conservation'],
  },
  {
    id: 'underwater-navigator',
    title: 'Underwater Navigator',
    slug: 'underwater-navigator',
    description: 'Learn navigation techniques to explore safely and find your way underwater.',
    duration: '1 day',
    level: 'Intermediate',
    category: 'Core',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '18m',
    highlights: ['Compass navigation', 'Natural navigation', 'Route planning'],
  },
  {
    id: 'deep-diver',
    title: 'Deep Diver',
    slug: 'deep-diver',
    description: 'Explore deeper dive sites safely with specialized deep diving techniques.',
    duration: '2 days',
    level: 'Intermediate',
    category: 'Core',
    priceTHB: 6500,
    priceUSD: 180,
    priceEUR: 165,
    maxDepth: '40m',
    highlights: ['Deep dive planning', 'Nitrogen narcosis management', 'Deep site exploration'],
  },
  {
    id: 'wreck-diver',
    title: 'Wreck Diver',
    slug: 'wreck-diver',
    description: 'Dive historic wrecks around Koh Tao with proper wreck diving techniques.',
    duration: '2 days',
    level: 'Intermediate',
    category: 'Core',
    priceTHB: 6500,
    priceUSD: 180,
    priceEUR: 165,
    maxDepth: '40m',
    prerequisites: 'Advanced Open Water & Deep Diver',
    highlights: ['Wreck penetration basics', 'Safety procedures', 'Historic exploration'],
  },
  
  // Enriched Air & Technical
  {
    id: 'enriched-air-diver',
    title: 'Enriched Air (Nitrox) Diver',
    slug: 'enriched-air-diver',
    description: 'Extend your bottom time with enriched air nitrox (EANx).',
    duration: '1 day',
    level: 'Intermediate',
    category: 'Technical',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '20m',
    highlights: ['Extended bottom time', 'Reduced nitrogen load', 'EANx calculations'],
  },
  {
    id: 'sidemount-diver',
    title: 'Sidemount Diver',
    slug: 'sidemount-diver',
    description: 'Learn specialized sidemount diving configuration for technical diving.',
    duration: '2 days',
    level: 'Advanced',
    category: 'Technical',
    priceTHB: 7500,
    priceUSD: 210,
    priceEUR: 195,
    maxDepth: '40m',
    prerequisites: 'Advanced Open Water',
    highlights: ['Sidemount configuration', 'Trim and buoyancy', 'Technical diving'],
  },
  {
    id: 'search-recovery',
    title: 'Search & Recovery Diver',
    slug: 'search-recovery',
    description: 'Learn search patterns and safe recovery techniques for underwater objects.',
    duration: '2 days',
    level: 'Intermediate',
    category: 'Technical',
    priceTHB: 6500,
    priceUSD: 180,
    priceEUR: 165,
    maxDepth: '18m',
    highlights: ['Search patterns', 'Lift bag techniques', 'Recovery procedures'],
  },

  // Conservation & Awareness
  {
    id: 'fish-identification',
    title: 'Fish Identification',
    slug: 'fish-identification',
    description: 'Learn to identify reef fish species and understand their behavior.',
    duration: '1 day',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Species identification', 'Behavior patterns', 'Marine biology'],
  },
  {
    id: 'shark-conservation',
    title: 'Shark Conservation Awareness',
    slug: 'shark-conservation',
    description: 'Learn about shark behavior, ecology, and the importance of shark conservation.',
    duration: '1 day',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Shark biology', 'Conservation efforts', 'Safe shark diving'],
  },
  {
    id: 'sea-turtle-awareness',
    title: 'Sea Turtle Awareness',
    slug: 'sea-turtle-awareness',
    description: 'Understand sea turtle species, habitat needs, and conservation actions.',
    duration: '1 day',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Species identification', 'Habitat protection', 'Ethical diving'],
  },
  {
    id: 'whaleshark-awareness',
    title: 'Whale Shark Awareness',
    slug: 'whaleshark-awareness',
    description: 'Learn about whale sharks and responsible interactions with these gentle giants.',
    duration: '1 day',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Whale shark biology', 'Conservation status', 'Responsible encounters'],
  },
  {
    id: 'coral-watch',
    title: 'Coral Watch - Reef Restoration',
    slug: 'coral-watch',
    description: 'Participate in coral monitoring and reef restoration projects.',
    duration: '1 day',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Coral monitoring', 'Reef health assessment', 'Restoration techniques'],
  },
  {
    id: 'dive-against-debris',
    title: 'Dive Against Debris',
    slug: 'dive-against-debris',
    description: 'Help clean oceans while learning about marine pollution and protection.',
    duration: '1 day',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Debris removal', 'Ocean conservation', 'Environmental impact'],
  },

  // Specialty Interests
  {
    id: 'underwater-photographer',
    title: 'Underwater Photography',
    slug: 'photography',
    description: 'Master underwater photography techniques and create stunning dive photos.',
    duration: '2 days',
    level: 'Intermediate',
    category: 'Specialty Interests',
    priceTHB: 6500,
    priceUSD: 180,
    priceEUR: 165,
    maxDepth: '18m',
    highlights: ['Camera settings', 'Composition techniques', 'Post-processing basics'],
  },
  {
    id: 'night-diver',
    title: 'Night Diver',
    slug: 'night-diver',
    description: 'Experience the magic of nocturnal diving with proper lighting and safety.',
    duration: '1 day',
    level: 'Intermediate',
    category: 'Specialty Interests',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '12m',
    highlights: ['Night diving safety', 'Light equipment', 'Nocturnal marine life'],
  },
  {
    id: 'boat-diver',
    title: 'Boat Diver',
    slug: 'boat-diver',
    description: 'Learn proper boat diving techniques and boat entry/exit procedures.',
    duration: '1 day',
    level: 'Beginner',
    category: 'Specialty Interests',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Boat procedures', 'Entry/exit techniques', 'Safety protocols'],
  },
  {
    id: 'current-diver',
    title: 'Current Diver',
    slug: 'current-diver',
    description: 'Master techniques for diving in current and tidal conditions.',
    duration: '1 day',
    level: 'Intermediate',
    category: 'Specialty Interests',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '18m',
    highlights: ['Current reading', 'Drift diving', 'Safety management'],
  },
  {
    id: 'dpv-diver',
    title: 'DPV (Diver Propulsion Vehicle)',
    slug: 'dpv-diver',
    description: 'Use underwater scooters to cover more ground with less energy.',
    duration: '2 days',
    level: 'Advanced',
    category: 'Specialty Interests',
    priceTHB: 7500,
    priceUSD: 210,
    priceEUR: 195,
    maxDepth: '30m',
    highlights: ['DPV operation', 'Advanced propulsion', 'Extended exploration'],
  },
  {
    id: 'underwater-naturalist',
    title: 'Underwater Naturalist',
    slug: 'underwater-naturalist',
    description: 'Develop keen observation skills and ecological awareness underwater.',
    duration: '1 day',
    level: 'Beginner',
    category: 'Specialty Interests',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Creature behavior', 'Ecosystem understanding', 'Naturalist skills'],
  },
  {
    id: 'self-reliant-diver',
    title: 'Self Reliant Diver',
    slug: 'self-reliant-diver',
    description: 'Develop independence and confidence in managing your own dives.',
    duration: '1 day',
    level: 'Intermediate',
    category: 'Specialty Interests',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '18m',
    highlights: ['Equipment independence', 'Self rescue', 'Dive planning'],
  },

  // Safety & Technical Skills
  {
    id: 'emergency-o2-provider',
    title: 'Emergency O2 Provider',
    slug: 'emergency-o2',
    description: 'Learn to provide emergency oxygen assistance to distressed divers.',
    duration: '1 day',
    level: 'Intermediate',
    category: 'Safety',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '12m',
    prerequisites: 'EFR/CPR Certification recommended',
    highlights: ['O2 equipment', 'Emergency response', 'First aid integration'],
  },
  {
    id: 'equipment-specialist',
    title: 'Equipment Specialist',
    slug: 'equipment-specialist',
    description: 'Master dive equipment assembly, maintenance, and troubleshooting.',
    duration: '1 day',
    level: 'Intermediate',
    category: 'Safety',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: 'N/A',
    highlights: ['Equipment assembly', 'Maintenance procedures', 'Troubleshooting'],
  },
  {
    id: 'adaptive-support-diver',
    title: 'Adaptive Support Diver',
    slug: 'adaptive-support',
    description: 'Learn to support and dive with divers with physical limitations.',
    duration: '1 day',
    level: 'Intermediate',
    category: 'Safety',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '12m',
    highlights: ['Adaptive techniques', 'Accessibility solutions', 'Inclusive diving'],
  },
];

const CATEGORIES = ['Core', 'Technical', 'Conservation', 'Specialty Interests', 'Safety'];

const SpecialtiesEn: React.FC = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<Currency>('THB');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSpecialties = selectedCategory === 'All' 
    ? SPECIALTIES_EN
    : SPECIALTIES_EN.filter(s => s.category === selectedCategory);

  const formatPrice = (thb: number, usd: number, eur: number): string => {
    switch (currency) {
      case 'THB': return `฿${thb.toLocaleString()}`;
      case 'USD': return `$${usd.toLocaleString()}`;
      case 'EUR': return `€${eur.toLocaleString()}`;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative h-72 md:h-96 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://api.divinginasia.com/images/whale.webp')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book # Specialty Courses</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl">
            Master specialized diving skills and enhance your underwater experience. Choose from our comprehensive selection of PADI specialty courses.
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Currency Selector */}
            <div className="flex gap-2">
              <span className="self-center font-semibold text-gray-700">Price in:</span>
              {(['THB', 'USD', 'EUR'] as const).map(curr => (
                <Button
                  key={curr}
                  variant={currency === curr ? 'default' : 'outline'}
                  onClick={() => setCurrency(curr)}
                  className="min-w-16"
                >
                  {curr}
                </Button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {['All', ...CATEGORIES].map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  size="sm"
                >
                  {cat === 'All' ? 'All Courses' : cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecialties.map(specialty => (
              <Card key={specialty.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge className={getLevelColor(specialty.level)}>
                      {specialty.level}
                    </Badge>
                    <Badge variant="secondary">{specialty.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{specialty.title}</CardTitle>
                  <CardDescription className="text-sm">{specialty.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{specialty.duration}</span>
                    </div>
                    {specialty.maxDepth && specialty.maxDepth !== 'N/A' && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>Max Depth: {specialty.maxDepth}</span>
                      </div>
                    )}
                    {specialty.prerequisites && (
                      <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                        <strong>Prerequisites:</strong> {specialty.prerequisites}
                      </div>
                    )}
                  </div>

                  {/* Highlights */}
                  {specialty.highlights && specialty.highlights.length > 0 && (
                    <div className="space-y-1">
                      {specialty.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Trophy className="w-3 h-3 mt-0.5 text-amber-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="pt-4 border-t">
                    <div className="text-2xl font-bold text-blue-600 mb-3">
                      {formatPrice(specialty.priceTHB, specialty.priceUSD, specialty.priceEUR)}
                    </div>
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/booking?item=${encodeURIComponent(specialty.title)}&type=course&price=${specialty.priceTHB}&currency=THB`);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">About Our Specialty Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Why Take Specialty Courses?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Build specialized diving skills</li>
                  <li>✓ Increase confidence and safety</li>
                  <li>✓ Unlock new dive sites</li>
                  <li>✓ Enhance your diving resume</li>
                  <li>✓ Join a community of skilled divers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What's Included?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Professional instruction</li>
                  <li>✓ Course materials & certification</li>
                  <li>✓ Equipment rental</li>
                  <li>✓ Boat fees & logistics</li>
                  <li>✓ Small group training</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Not sure which specialty to choose?</strong> Contact us and our instructors will help you find the perfect specialty course based on your interests and goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecialtiesEn;
