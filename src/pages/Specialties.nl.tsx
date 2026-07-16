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

const SPECIALTIES_NL: Specialty[] = [
  // Core Specialties
  {
    id: 'peak-performance-buoyancy',
    title: 'Peak Performance Buoyancy',
    slug: 'peak-performance-buoyancy',
    description: 'Beheers perfecte drijfvermogen controle voor comfort, veiligheid en efficiëntie onder water.',
    duration: '1 dag',
    level: 'Intermediate',
    category: 'Core',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '18m',
    highlights: ['Perfect drijfvermogen', 'Duik efficiëntie', 'Energiebesparing'],
  },
  {
    id: 'underwater-navigator',
    title: 'Underwater Navigator',
    slug: 'underwater-navigator',
    description: 'Leer navigatietechnieken om veilig onder water te verkennen en je weg te vinden.',
    duration: '1 dag',
    level: 'Intermediate',
    category: 'Core',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '18m',
    highlights: ['Kompasnavigatie', 'Natuurlijke navigatie', 'Routeplanning'],
  },
  {
    id: 'deep-diver',
    title: 'Deep Diver',
    slug: 'deep-diver',
    description: 'Verken diepere duikplekken veilig met gespecialiseerde duiktechnieken.',
    duration: '2 dagen',
    level: 'Intermediate',
    category: 'Core',
    priceTHB: 6500,
    priceUSD: 180,
    priceEUR: 165,
    maxDepth: '40m',
    highlights: ['Diepduik planning', 'Stikstofnarcose management', 'Diepte verkenning'],
  },
  {
    id: 'wreck-diver',
    title: 'Wreck Diver',
    slug: 'wreck-diver',
    description: 'Duik historische wrakken rond Koh Tao met juiste wrakduiktechnieken.',
    duration: '2 dagen',
    level: 'Intermediate',
    category: 'Core',
    priceTHB: 6500,
    priceUSD: 180,
    priceEUR: 165,
    maxDepth: '40m',
    prerequisites: 'Advanced Open Water & Deep Diver',
    highlights: ['Wrappenetratie basis', 'Veiligheidsprocedures', 'Historische verkenning'],
  },
  
  // Enriched Air & Technical
  {
    id: 'enriched-air-diver',
    title: 'Enriched Air (Nitrox) Diver',
    slug: 'enriched-air-diver',
    description: 'Verleng je bodemtijd met verrijkte lucht nitrox (EANx).',
    duration: '1 dag',
    level: 'Intermediate',
    category: 'Technical',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '20m',
    highlights: ['Verlengde bodemtijd', 'Verminderde stikstofbelasting', 'EANx berekeningen'],
  },
  {
    id: 'sidemount-diver',
    title: 'Sidemount Diver',
    slug: 'sidemount-diver',
    description: 'Leer gespecialiseerde sidemount duikconfiguratie voor technisch duiken.',
    duration: '2 dagen',
    level: 'Advanced',
    category: 'Technical',
    priceTHB: 7500,
    priceUSD: 210,
    priceEUR: 195,
    maxDepth: '40m',
    prerequisites: 'Advanced Open Water',
    highlights: ['Sidemount configuratie', 'Trim en drijfvermogen', 'Technisch duiken'],
  },
  {
    id: 'search-recovery',
    title: 'Search & Recovery Diver',
    slug: 'search-recovery',
    description: 'Leer zoekpatronen en veilige bergingtechnieken voor onderwaterteksturen.',
    duration: '2 dagen',
    level: 'Intermediate',
    category: 'Technical',
    priceTHB: 6500,
    priceUSD: 180,
    priceEUR: 165,
    maxDepth: '18m',
    highlights: ['Zoekpatronen', 'Lift bag technieken', 'Bergingsprocedures'],
  },

  // Conservation & Awareness
  {
    id: 'fish-identification',
    title: 'Fish Identification',
    slug: 'fish-identification',
    description: 'Leer rifvissoorten herkennen en hun gedrag begrijpen.',
    duration: '1 dag',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Soortenidentificatie', 'Gedragspatronen', 'Mariene biologie'],
  },
  {
    id: 'shark-conservation',
    title: 'Shark Conservation Awareness',
    slug: 'shark-conservation',
    description: 'Leer over haigedrag, ecologie en het belang van haibescherming.',
    duration: '1 dag',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Hai biologie', 'Beschermingsmaatregelen', 'Veilig haienduiken'],
  },
  {
    id: 'sea-turtle-awareness',
    title: 'Sea Turtle Awareness',
    slug: 'sea-turtle-awareness',
    description: 'Begrijp zeepaddesoorten, leefgebiedbehoeften en beschermingsacties.',
    duration: '1 dag',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Soortenidentificatie', 'Habitat bescherming', 'Ethisch duiken'],
  },
  {
    id: 'whaleshark-awareness',
    title: 'Whale Shark Awareness',
    slug: 'whaleshark-awareness',
    description: 'Leer over walvishaien en verantwoorde interacties met deze zachte reuzen.',
    duration: '1 dag',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Walvishai biologie', 'Beschermingsstatus', 'Verantwoorde ontmoetingen'],
  },
  {
    id: 'coral-watch',
    title: 'Coral Watch - Reef Restoration',
    slug: 'coral-watch',
    description: 'Neem deel aan koraalbewaking en rifrestauratieprojecten.',
    duration: '1 dag',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Koraalbewaking', 'Rifgezondheidstoetsing', 'Restoratietechnieken'],
  },
  {
    id: 'dive-against-debris',
    title: 'Dive Against Debris',
    slug: 'dive-against-debris',
    description: 'Help oceanen schoon te maken terwijl je leert over mariene vervuiling.',
    duration: '1 dag',
    level: 'Beginner',
    category: 'Conservation',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Afval verwijdering', 'Oceaanbescherming', 'Milieu-impact'],
  },

  // Specialty Interests
  {
    id: 'underwater-photographer',
    title: 'Underwater Photography',
    slug: 'photography',
    description: 'Beheers onderwaterfotografietechnieken en maak prachtige duikfoto\'s.',
    duration: '2 dagen',
    level: 'Intermediate',
    category: 'Specialty Interests',
    priceTHB: 6500,
    priceUSD: 180,
    priceEUR: 165,
    maxDepth: '18m',
    highlights: ['Camera instellingen', 'Compositietechnieken', 'Basale nabewerking'],
  },
  {
    id: 'night-diver',
    title: 'Night Diver',
    slug: 'night-diver',
    description: 'Ervaar de magie van nachtduiken met juiste verlichting en veiligheid.',
    duration: '1 dag',
    level: 'Intermediate',
    category: 'Specialty Interests',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '12m',
    highlights: ['Nachtduik veiligheid', 'Licht uitrusting', 'Nachtelijk dierenleven'],
  },
  {
    id: 'boat-diver',
    title: 'Boat Diver',
    slug: 'boat-diver',
    description: 'Leer juiste bootduiktechnieken en boot in-/uitstapprocdures.',
    duration: '1 dag',
    level: 'Beginner',
    category: 'Specialty Interests',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Bootprocedures', 'In-/uitstap technieken', 'Veiligheidsprotocullen'],
  },
  {
    id: 'current-diver',
    title: 'Current Diver',
    slug: 'current-diver',
    description: 'Beheers technieken voor duiken in stroming en getijdencondities.',
    duration: '1 dag',
    level: 'Intermediate',
    category: 'Specialty Interests',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '18m',
    highlights: ['Stroming lezen', 'Driftduiken', 'Veiligheidsbeheer'],
  },
  {
    id: 'dpv-diver',
    title: 'DPV (Diver Propulsion Vehicle)',
    slug: 'dpv-diver',
    description: 'Gebruik onderwaterscoters om meer grond af te leggen met minder energie.',
    duration: '2 dagen',
    level: 'Advanced',
    category: 'Specialty Interests',
    priceTHB: 7500,
    priceUSD: 210,
    priceEUR: 195,
    maxDepth: '30m',
    highlights: ['DPV bediening', 'Geavanceerde voortstuwing', 'Uitgebreide verkenning'],
  },
  {
    id: 'underwater-naturalist',
    title: 'Underwater Naturalist',
    slug: 'underwater-naturalist',
    description: 'Ontwikkel scherpe observatievaardigheden en ecologisch bewustzijn onder water.',
    duration: '1 dag',
    level: 'Beginner',
    category: 'Specialty Interests',
    priceTHB: 3500,
    priceUSD: 95,
    priceEUR: 85,
    maxDepth: '12m',
    highlights: ['Creatuurgedrag', 'Ecosysteembegrip', 'Naturalisten vaardigheden'],
  },
  {
    id: 'self-reliant-diver',
    title: 'Self Reliant Diver',
    slug: 'self-reliant-diver',
    description: 'Ontwikkel onafhankelijkheid en vertrouwen bij het managen van je eigen duiken.',
    duration: '1 dag',
    level: 'Intermediate',
    category: 'Specialty Interests',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '18m',
    highlights: ['Uitrusting onafhankelijkheid', 'Zelfredding', 'Duikplanning'],
  },

  // Safety & Technical Skills
  {
    id: 'emergency-o2-provider',
    title: 'Emergency O2 Provider',
    slug: 'emergency-o2',
    description: 'Leer noodzuurstof hulp te verlenen aan duikers in nood.',
    duration: '1 dag',
    level: 'Intermediate',
    category: 'Safety',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '12m',
    prerequisites: 'EFR/EHBO certificering aanbevolen',
    highlights: ['O2 uitrusting', 'Noodrespons', 'EHBO integratie'],
  },
  {
    id: 'equipment-specialist',
    title: 'Equipment Specialist',
    slug: 'equipment-specialist',
    description: 'Beheers duikuitrusting samenstelling, onderhoud en probleemoplossing.',
    duration: '1 dag',
    level: 'Intermediate',
    category: 'Safety',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: 'N/A',
    highlights: ['Uitrusting samenstelling', 'Onderhoudsprocedures', 'Probleemoplossing'],
  },
  {
    id: 'adaptive-support-diver',
    title: 'Adaptive Support Diver',
    slug: 'adaptive-support',
    description: 'Leer duikers met fysieke beperkingen te ondersteunen en mee te duiken.',
    duration: '1 dag',
    level: 'Intermediate',
    category: 'Safety',
    priceTHB: 4500,
    priceUSD: 125,
    priceEUR: 115,
    maxDepth: '12m',
    highlights: ['Adaptieve technieken', 'Toegankelijkheidsoplossingen', 'Inclusief duiken'],
  },
];

const CATEGORIES = ['Core', 'Technical', 'Conservation', 'Specialty Interests', 'Safety'];

const SpecialtiesNl: React.FC = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<Currency>('THB');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSpecialties = selectedCategory === 'All' 
    ? SPECIALTIES_NL
    : SPECIALTIES_NL.filter(s => s.category === selectedCategory);

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Specialiteitscursussen</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl">
            Beheers gespecialiseerde duikvaardigheden en verbeter je onderwatertechniek. Kies uit onze uitgebreide selectie van PADI specialiteitscursussen.
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Currency Selector */}
            <div className="flex gap-2">
              <span className="self-center font-semibold text-gray-700">Prijs in:</span>
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
                  {cat === 'All' ? 'Alle Cursussen' : cat}
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
                        <span>Max Diepte: {specialty.maxDepth}</span>
                      </div>
                    )}
                    {specialty.prerequisites && (
                      <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                        <strong>Vereisten:</strong> {specialty.prerequisites}
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
                      Nu Boeken
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
            <h2 className="text-2xl font-bold mb-4">Over Onze Specialiteitscursussen</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Waarom Specialiteitscursussen?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Bouw gespecialiseerde duikvaardigheden</li>
                  <li>✓ Verhoog vertrouwen en veiligheid</li>
                  <li>✓ Ontsluit nieuwe duikplekken</li>
                  <li>✓ Verbeter je duikresumé</li>
                  <li>✓ Sluit je aan bij een gemeenschap van ervaren duikers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Wat Is Inbegrepen?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Professionele instructie</li>
                  <li>✓ Cursusmateriaal & certificatie</li>
                  <li>✓ Uitrustingverhuur</li>
                  <li>✓ Boot- en logistieke kosten</li>
                  <li>✓ Kleine groeptraining</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Weet je niet welke specialiteit je moet kiezen?</strong> Neem contact met ons op en onze instructeurs helpen je de perfecte specialiteitscursus te vinden op basis van je interesses en doelen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecialtiesNl;
