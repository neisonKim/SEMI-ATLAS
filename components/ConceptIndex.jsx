export default function ConceptIndex({ groups, language }) {
  return (
    <div id="search-results" className="concept-index">
      <nav className="concept-index-jump" aria-label={language === 'ko' ? '초성으로 이동' : '알파벳으로 이동'}>
        {groups.map(group => (
          <a key={group.id} href={`#${group.id}`} aria-label={`${group.label} 그룹으로 이동`}>{group.label}</a>
        ))}
      </nav>
      {groups.map(group => (
        <section className="concept-index-group" key={group.id} aria-labelledby={group.id}>
          <h2 id={group.id} tabIndex={-1}>{group.label}</h2>
          <ul>
            {group.entries.map(({ name, concept }) => (
              <li key={`${concept.id}-${name}`}>
                <a href={`/concept/${concept.id}/`}>
                  <strong lang={language}>{name}</strong>
                  <span lang={language === 'ko' ? 'en' : 'ko'}>{language === 'ko' ? concept.en : concept.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
