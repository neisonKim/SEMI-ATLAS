import { companyMedia } from '@/lib/company-media.mjs';

export default function CompanyLogo({ company, eager = false }) {
  const logo = companyMedia[company.id]?.logo;
  if (!logo) return null;
  const label = `${company.en} 로고`;
  return (
    <div className={`company-logo-shell company-logo-${logo.tone}`} data-company-logo={company.id}>
      {logo.symbolId
        ? <svg viewBox={`0 0 ${logo.width} ${logo.height}`} width={logo.width} height={logo.height} role="img" aria-label={label} focusable="false"><use href={`${logo.src}#${logo.symbolId}`} /></svg>
        : <img src={logo.src} alt={label} width={logo.width} height={logo.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />}
    </div>
  );
}
