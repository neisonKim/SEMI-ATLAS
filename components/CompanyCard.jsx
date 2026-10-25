import CompanyLogo from '@/components/CompanyLogo';
import CompanyMedia from '@/components/CompanyMedia';
import { companyCountryById, companyStageById, companyRelationKinds } from '@/lib/companies.mjs';

export default function CompanyCard({ company, connection = null, showImage = false }) {
  return (
    <article className="company-card" data-company-id={company.id}>
      <div className="company-card-top">
        <span className="company-country">본사 · {companyCountryById[company.country].label}</span>
        <span className="company-card-arrow" aria-hidden="true">↗</span>
      </div>
      <CompanyLogo company={company} />
      <h3><a href={`/company/${company.id}/`}>{company.name}</a></h3>
      <p className="company-en">{company.en}</p>
      <div className="company-stage-tags" aria-label="기업의 역할">
        {company.stages.map(stage => <span key={stage}>{companyStageById[stage].label}</span>)}
      </div>
      {showImage && <CompanyMedia company={company} compact />}
      {!connection && <p className="company-card-summary">{company.summary}</p>}
      {connection && <p className="company-card-connection"><b>{companyRelationKinds[connection.kind]}</b>{connection.reason}</p>}
      <p className="company-card-foot">{company.concepts.length}개 개념과 연결</p>
    </article>
  );
}
