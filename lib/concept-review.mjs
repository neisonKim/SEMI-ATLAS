export const explanationModes = [
  { id: 'simple', label: '쉬운 설명', hint: '먼저 큰 뜻을 잡아요' },
  { id: 'principle', label: '작동 원리', hint: '원인과 흐름을 연결해요' },
  { id: 'caution', label: '기술적 주의점', hint: '조건과 한계를 확인해요' },
];

export function explanationModeFromHash(hash) {
  return explanationModes.find(mode => hash === `#explain-${mode.id}`)?.id || null;
}

export function explanationModeForReview(section) {
  if (section === 'what') return 'simple';
  if (section === 'misconceptions' || section === 'question') return 'caution';
  return 'principle';
}
