import Image from 'next/image';
import { companyMedia } from '@/lib/company-media.mjs';

export function CompanyMediaCredit({ media }) {
  return (
    <span className="company-media-credit">
      <span>{media.credit}</span>
      <a href={media.sourceUrl} target="_blank" rel="noopener noreferrer">이미지 출처<span className="sr-only"> · 새 창</span> ↗</a>
      {media.license && <a href={media.licenseUrl} target="_blank" rel="noopener noreferrer">{media.license}<span className="sr-only"> · 새 창</span> ↗</a>}
    </span>
  );
}

export default function CompanyMedia({ company, compact = false }) {
  const media = companyMedia[company.id]?.image;
  if (!media) return null;
  return (
    <figure className={`company-media${compact ? ' company-media-compact' : ''}`} data-company-image={company.id}>
      <div className="company-media-frame">
        <Image src={media.src} data-original-src={media.src} sizes={compact ? '(max-width: 600px) 80vw, (max-width: 1000px) 40vw, 350px' : '(max-width: 600px) 90vw, 850px'} alt={media.alt} width={media.width} height={media.height} style={{ maxWidth: `${media.width}px`, width: '100%', height: 'auto' }} loading={compact ? 'lazy' : 'eager'} decoding="async" />
      </div>
      <figcaption><span className="company-media-caption">{media.caption}</span><CompanyMediaCredit media={media} /></figcaption>
    </figure>
  );
}
