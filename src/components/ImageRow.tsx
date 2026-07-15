import React from 'react';
import { getCourseImageFallbackUrl, resolveCourseImageUrl } from '@/lib/courseImages';

type Props = { images: string[] };

const ImageRow: React.FC<Props> = ({ images }) => {
  const items = images.slice(0, 3);
  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      {items.map((src, i) => {
        const resolvedSrc = resolveCourseImageUrl(src);
        const fallbackSrc = getCourseImageFallbackUrl(src);

        return (
          <div key={i} className="h-28 md:h-40 overflow-hidden rounded shadow-sm">
            <img
              src={resolvedSrc}
              alt={`gallery-${i}`}
              className="w-full h-full object-cover"
              onError={(event) => {
                const target = event.currentTarget;
                if (target.getAttribute('data-fallback-used') === 'true') {
                  return;
                }
                target.setAttribute('data-fallback-used', 'true');
                target.src = fallbackSrc;
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImageRow;
