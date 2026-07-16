import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SPECIALTIES: Record<string, any> = {
  'aware-fish-id': {
    title: 'AWARE Fish ID',
    overview: 'Learn to identify common reef fish and contribute to citizen science projects.',
    duration: '1 day',
    depositMajor: 800,
    depositCurrency: 'THB',
  },
  'nitrox-instructor': {
    title: 'Nitrox Instructor',
    overview: 'Teach enriched air nitrox to students and manage nitrox diving safely.',
    duration: '3-4 days',
    depositMajor: 2500,
    depositCurrency: 'THB',
  },
  'deep-instructor': {
    title: 'Deep Instructor',
    overview: 'Instructor-level deep diving techniques and risk management for deeper dives.',
    duration: '2 days',
    depositMajor: 2000,
    depositCurrency: 'THB',
  },
};

const SpecialtyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const data = slug ? SPECIALTIES[slug] : null;

  // If no specific specialty data exists, build a friendly fallback
  const fallbackFromSlug = (s: string | undefined) => {
    if (!s) return null;
    const pretty = s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: pretty,
      overview: 'Detailed curriculum and specifics will be available soon. Contact us for full course information and booking.',
      duration: '1 day',
      depositMajor: 3500,
      depositCurrency: 'THB',
    };
  };

  const resolved = data || fallbackFromSlug(slug);

  if (!resolved) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto py-20 px-4">
          <h2 className="text-3xl font-bold">Specialty not found</h2>
          <p className="text-muted-foreground mt-4">Sorry — we don't have details for that specialty yet.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{resolved.title}</CardTitle>
              <CardDescription className="mt-2">{resolved.overview}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p><strong>Duration:</strong> {resolved.duration}</p>
                <p><strong>Deposit (approx):</strong> {resolved.depositMajor ? `฿${resolved.depositMajor}` : 'Contact us'}</p>
                <p><strong>Total Payable Now:</strong> {resolved.depositMajor ? `฿${resolved.depositMajor}` : 'Contact us'}</p>
                <p className="text-muted-foreground">Detailed curriculum, prerequisites, and certification information available on request.</p>
                <div className="mt-6">
                  <Button onClick={() => {
                    const priceMajor = (resolved as any).priceMajor || (resolved.depositMajor ? resolved.depositMajor * 5 : '');
                    navigate(`/booking?item=${encodeURIComponent(resolved.title)}&type=course&price=${priceMajor}&currency=${resolved.depositCurrency || ''}`);
                  }}>Enquire / Book</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SpecialtyDetail;
