const initials = [...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const koreanOrder = new Intl.Collator('ko', { numeric: true });
const englishOrder = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

// Index names are editorial labels. Search aliases also include related terms
// such as "칩" and "소스", which should keep their broader search behavior.
const koreanNames = {
  semiconductor: '반도체',
  silicon: '실리콘',
  wafer: '웨이퍼',
  transistor: '트랜지스터',
  mosfet: '모스펫',
  finfet: '핀펫',
  gaa: '게이트 올 어라운드',
  'logic-memory': '로직과 메모리',
  cpu: '중앙처리장치',
  gpu: '그래픽처리장치',
  dram: '디램',
  nand: '낸드 플래시',
  fabrication: '반도체 제조공정',
  oxidation: '산화공정',
  lithography: '노광',
  'euv-duv': '극자외선·심자외선 노광',
  etching: '식각',
  deposition: '증착',
  cvd: '화학기상증착',
  ald: '원자층증착',
  'ion-implantation': '이온주입',
  cmp: '화학기계적 평탄화',
  cleaning: '세정',
  yield: '수율',
  packaging: '패키징',
  rdl: '재배선층',
  tsv: '실리콘 관통 전극',
  interposer: '인터포저',
  hbm: '고대역폭 메모리',
  fabless: '팹리스',
  foundry: '파운드리',
  eda: '전자설계자동화',
};

const abbreviations = {
  finfet: ['FinFET'], gaa: ['GAA'], cpu: ['CPU'], gpu: ['GPU'], dram: ['DRAM'],
  nand: ['NAND'], 'euv-duv': ['EUV', 'DUV'], cvd: ['CVD'], ald: ['ALD'], cmp: ['CMP'],
  rdl: ['RDL'], tsv: ['TSV'], hbm: ['HBM'], eda: ['EDA'],
};

export const indexViews = [
  { id: 'cards', label: '카드 보기' },
  { id: 'ko', label: '가나다순' },
  { id: 'en', label: 'ABC순' },
];

export function buildConceptIndex(concepts, language) {
  const korean = language === 'ko';
  const labels = korean ? initials : alphabet;
  const compare = korean ? koreanOrder : englishOrder;
  const groups = new Map([['0–9', []], ...labels.map(label => [label, []]), ['기타', []]]);
  for (const concept of concepts) {
    const names = korean
      ? [koreanNames[concept.id] ?? concept.title]
      : [concept.en, ...(abbreviations[concept.id] ?? [])];
    for (const name of names) {
      const first = name.normalize('NFC').toUpperCase()[0];
      const syllable = first.charCodeAt(0) - 0xac00;
      const label = korean && syllable >= 0 && syllable < 11172
        ? initials[Math.floor(syllable / 588)]
        : /^[0-9]$/.test(first) ? '0–9' : first;
      (groups.get(label) ?? groups.get('기타')).push({ name, concept });
    }
  }
  return [...groups.entries()].flatMap(([label, entries], index) => entries.length ? [{
    id: `concept-index-${language}-${index}`,
    label,
    entries: entries.sort((a, b) => compare.compare(a.name, b.name) || a.concept.num - b.concept.num),
  }] : []);
}
