import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CoursePageTemplate from '@/components/CoursePageTemplate';

const SpecialtyDetail: React.FC = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith('nl') ? 'nl' : 'en';

  if (!slug) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto py-20 px-4">
          <h2 className="text-3xl font-bold">Specialty not found</h2>
          <p className="text-muted-foreground mt-4">No specialty slug provided.</p>
        </div>
      </div>
    );
  }

  const prettyTitle = slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Build a sensible fallback that the CoursePageTemplate can use while the
  // page-content API provides richer data when available.
  const fallbackContent = {
    hero_title: prettyTitle,
    hero_subtitle: 'Detailed curriculum and specifics will be available soon. Contact us for full course information and booking.',
    course_overview: 'Detailed curriculum and specifics will be available soon. Contact us for full course information and booking.',
    price_thb: (3500 * 5).toString(),
    price_usd: '0',
    price_eur: '0',
    duration: '1 day',
  };

  // Use a CMS page slug that matches how course pages are stored. The API
  // accepts arbitrary slugs, and many pages use names like `specialties/<slug>`.
  const pageSlug = `specialties/${slug}`;

  const alternateSlugs = Array.from(new Set([
    `specialty-${slug}`,
    `${slug}`,
    `courses/specialties/${slug}`,
    `specialties/${slug.replace(/-/g, '_')}`,
  ]));

  return (
    <CoursePageTemplate
      pageSlug={pageSlug}
      locale={locale as 'en' | 'nl'}
      fallbackContent={fallbackContent}
      alternatePageSlugs={alternateSlugs}
      bookingItemName={prettyTitle}
      bookingType="course"
    />
  );
};

export default SpecialtyDetail;
