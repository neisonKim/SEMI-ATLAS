import { expandedCompanies, expandedCompanySources } from './companies-expanded.mjs';

// Relations are learning connections, not an inferred commercial supply chain.
// Keep each connection here once; concept pages derive the reverse direction.
export const companyCheckedAt = '2026-10-25';
export const companyStages = [
  { id: 'fabless', label: '설계·팹리스', en: 'Fabless', description: '칩을 설계하고 외부 제조사와 생산을 연결합니다.' },
  { id: 'idm', label: '종합 반도체', en: 'IDM', description: '자사 반도체의 설계와 제조 역량을 함께 갖춥니다.' },
  { id: 'foundry', label: '파운드리', en: 'Foundry', description: '고객이 설계한 칩을 위탁 생산합니다.' },
  { id: 'memory', label: '메모리', en: 'Memory', description: '작업·저장·데이터 공급에 필요한 메모리를 만듭니다.' },
  { id: 'eda-ip', label: '설계 도구·IP', en: 'EDA / IP', description: '설계·검증 도구와 재사용 가능한 회로 자산을 제공합니다.' },
  { id: 'equipment', label: '장비', en: 'Equipment', description: '웨이퍼를 정밀하게 가공하는 공정 장비를 제공합니다.' },
  { id: 'materials', label: '소재·웨이퍼', en: 'Materials', description: '회로를 만들 기판과 공정 재료를 공급합니다.' },
  { id: 'packaging', label: '패키징·테스트', en: 'Packaging & Test', description: '다이를 연결·보호·검사해 사용할 수 있는 부품으로 만듭니다.' },
];
export const companyStageById = Object.fromEntries(companyStages.map(stage => [stage.id, stage]));
export const companyCountries = [
  { id: 'KR', label: '대한민국' }, { id: 'US', label: '미국' },
  { id: 'TW', label: '대만' }, { id: 'NL', label: '네덜란드' }, { id: 'JP', label: '일본' },
  { id: 'DE', label: '독일' }, { id: 'CH', label: '스위스' }, { id: 'CN', label: '중국' },
  { id: 'IL', label: '이스라엘' }, { id: 'GB', label: '영국' },
];
export const companyCountryById = Object.fromEntries(companyCountries.map(country => [country.id, country]));
export const companyRelationKinds = { product: '제품·서비스', role: '산업 역할', principle: '배경 원리' };
export const companySources = {
  ...expandedCompanySources,
  nvidia_about: ['NVIDIA · 기업과 기술 소개', 'https://www.nvidia.com/en-us/about-nvidia/', '공식 기업 소개'],
  nvidia_hopper: ['NVIDIA · Hopper 구조와 HBM', 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/', '공식 기술 해설'],
  nvidia_model: ['NVIDIA · 제조 전략 공시', 'https://www.sec.gov/Archives/edgar/data/1045810/000104581025000120/a2025conflictmineralsrepor.htm', '기업 공시'],
  amd_about: ['AMD · 기업과 제품 소개', 'https://www.amd.com/en/corporate.html', '공식 기업 소개'],
  amd_supply: ['AMD · 팹리스와 공급망', 'https://www.amd.com/en/corporate/corporate-responsibility/supply-chain-responsibility.html', '공식 사업 설명'],
  tsmc_foundry: ['TSMC · 위탁 제조 사업', 'https://www.tsmc.com/english/dedicatedFoundry', '공식 사업 설명'],
  tsmc_cowos: ['TSMC · CoWoS 패키징', 'https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm', '공식 기술 해설'],
  samsung_about: ['Samsung · 반도체 사업 소개', 'https://news.samsungsemiconductor.com/global/about-us/', '공식 사업 설명'],
  samsung_memory: ['Samsung · 메모리 사업과 제품', 'https://semiconductor.samsung.com/kr/about-us/business-area/memory/', '공식 제품 자료'],
  samsung_foundry: ['Samsung · 파운드리', 'https://semiconductor.samsung.com/kr/foundry/', '공식 사업 설명'],
  hynix_about: ['SK hynix · 기업 소개', 'https://www.skhynix.com/company/UI-FR-CP02/', '공식 기업 소개'],
  hynix_memory: ['SK hynix · DRAM·NAND·HBM 연구', 'https://research.skhynix.com/research-areas/future-memory-technologies/evolutionary-memory', '공식 기술 해설'],
  asml_about: ['ASML · 기업 소개', 'https://www.asml.com/en/company/about-asml', '공식 기업 소개'],
  asml_products: ['ASML · EUV·DUV 장비', 'https://www.asml.com/en/products', '공식 제품 자료'],
  applied_products: ['Applied Materials · 공정 장비', 'https://www.appliedmaterials.com/us/en/semiconductor/products.html', '공식 제품 자료'],
  applied_create: ['Applied Materials · 박막 형성 기술', 'https://www.appliedmaterials.com/us/en/semiconductor/products/create.html', '공식 기술 해설'],
  synopsys_about: ['Synopsys · 설계·IP·분석 솔루션', 'https://www.synopsys.com/company.html', '공식 기업 소개'],
  synopsys_ip: ['Synopsys · 반도체 설계 IP', 'https://www.synopsys.com/designware-ip.html', '공식 제품 자료'],
  sumco_about: ['SUMCO · 실리콘 웨이퍼 사업', 'https://www.sumcosi.com/english/aboutus/', '공식 기업 소개'],
  sumco_products: ['SUMCO · 웨이퍼 종류', 'https://www.sumcosi.com/english/products/lineup.html', '공식 제품 자료'],
  sumco_process: ['SUMCO · 웨이퍼 생산 과정', 'https://www.sumcosi.com/english/products/process/', '공식 공정 설명'],
  ase_about: ['ASE · 패키징과 테스트 사업', 'https://ase.aseglobal.com/about-ase/', '공식 기업 소개'],
  ase_vipack: ['ASE · VIPack 이종 집적', 'https://ase.aseglobal.com/VIPack/', '공식 기술 해설'],
};

const link = (id, kind, reason) => ({ id, kind, reason });
export const companies = [
  {
    id: 'nvidia', name: '엔비디아', en: 'NVIDIA', aliases: ['엔비디아', 'NVIDIA', '지포스', 'GeForce', '쿠다', 'CUDA'], country: 'US', stages: ['fabless'],
    summary: 'GPU와 가속 컴퓨팅 플랫폼을 설계하고 소프트웨어 생태계까지 연결하는 기업입니다.',
    role: 'AI와 그래픽 작업에 필요한 연산 칩·시스템·소프트웨어를 개발합니다. 웨이퍼 제조와 조립 등은 외부 제조 파트너를 활용하는 팹리스 모델을 이해하는 사례입니다.',
    analogy: '많은 계산을 나누어 처리할 작업장을 설계하고, 그 작업장을 움직일 도구와 작업 방식까지 함께 제공하는 팀에 가깝습니다.',
    distinction: 'GPU 설계 기업이라는 역할과 HBM을 제조하는 메모리 기업의 역할을 구분해보세요. 하나의 가속기에는 서로 다른 역할의 기술이 함께 들어갑니다.',
    technologies: [
      { name: 'GPU·가속 컴퓨팅', description: '비슷한 계산을 여러 데이터에 병렬로 적용하는 연산 장치와 시스템을 개발합니다.', source: 'nvidia_about' },
      { name: 'Hopper와 HBM', description: '2022년 공개한 H100 구조는 GPU가 적층 메모리와 가까이 연결되는 학습 사례입니다.', source: 'nvidia_hopper' },
    ],
    concepts: [link('gpu', 'product', 'GPU의 병렬 연산 자원이 실제 가속기 설계로 이어집니다.'), link('hbm', 'product', 'H100의 HBM 구성에서 연산과 데이터 공급의 관계를 살펴볼 수 있습니다.'), link('logic-memory', 'principle', '연산 칩과 메모리의 역할을 나누어 시스템 병목을 이해합니다.'), link('fabless', 'role', '설계와 외부 제조가 협력하는 사업 모델의 사례입니다.'), link('ecosystem', 'role', '칩·메모리·패키징·소프트웨어가 하나의 컴퓨팅 플랫폼으로 연결됩니다.')],
    refs: ['nvidia_about', 'nvidia_hopper', 'nvidia_model'], website: 'https://www.nvidia.com/',
  },
  {
    id: 'amd', name: 'AMD', en: 'Advanced Micro Devices', aliases: ['AMD', '에이엠디', '어드밴스드 마이크로 디바이시스', '라이젠', 'Ryzen', 'EPYC', '에픽', 'Radeon', '라데온', 'Instinct'], country: 'US', stages: ['fabless'],
    summary: 'CPU와 GPU 등 컴퓨팅 반도체를 설계하고 외부 제조사와 생산을 연결하는 기업입니다.',
    role: 'PC·서버용 프로세서와 그래픽·가속기 제품을 설계합니다. 서로 다른 작업에 맞는 CPU·GPU 설계를 이해하고, 설계 역량과 제조 파트너의 역할을 구분하기 좋습니다.',
    analogy: '다양한 용도의 엔진을 설계하고 전문 제작소와 함께 제품을 완성하는 설계팀에 가깝습니다. 용도에 따라 엔진의 구성과 데이터 공급 방식이 달라집니다.',
    distinction: 'CPU와 GPU를 모두 설계한다고 두 제품의 코어 수를 같은 단위로 비교할 수 있는 것은 아닙니다. 실행 방식과 작업 조건을 함께 보아야 합니다.',
    technologies: [
      { name: 'Ryzen·EPYC', description: 'PC와 서버 등 서로 다른 사용 환경을 위한 CPU 제품군입니다.', source: 'amd_about' },
      { name: 'Radeon·Instinct', description: '그래픽과 데이터센터 가속 등 작업에 맞춘 GPU 제품군입니다.', source: 'amd_about' },
    ],
    concepts: [link('cpu', 'product', '프로그램 실행과 제어를 담당하는 CPU가 실제 제품군으로 연결됩니다.'), link('gpu', 'product', '그래픽과 가속 연산에 활용되는 GPU 설계를 이해할 수 있습니다.'), link('logic-memory', 'principle', '프로세서의 계산 능력과 데이터 공급을 함께 보아야 합니다.'), link('fabless', 'role', 'AMD가 설명하는 외부 제조 기반의 팹리스 사업 모델과 연결됩니다.'), link('ecosystem', 'role', '설계 기업과 제조·조립·테스트 파트너가 협력하는 사례입니다.')],
    refs: ['amd_about', 'amd_supply'], website: 'https://www.amd.com/',
  },
  {
    id: 'tsmc', name: 'TSMC', en: 'Taiwan Semiconductor Manufacturing Company', aliases: ['TSMC', '티에스엠씨', '타이완 반도체', '대만 반도체', 'CoWoS', '코워스'], country: 'TW', stages: ['foundry', 'packaging'],
    summary: '고객의 칩 설계를 웨이퍼에 구현하고 첨단 패키징으로 연결하는 파운드리 기업입니다.',
    role: '고객 설계에 맞는 제조 공정과 생산 기반을 제공합니다. 웨이퍼 제조에 더해 CoWoS 같은 패키징 기술로 로직과 메모리 등 서로 다른 다이를 가까이 연결합니다.',
    analogy: '여러 설계팀의 도면을 정밀하게 구현하는 제작소이면서, 완성된 부품들을 촘촘히 연결할 조립 기반도 제공하는 팀으로 생각해보세요.',
    distinction: '파운드리는 제조 사업의 역할을 뜻합니다. 제조 기업이 패키징 서비스도 제공할 수 있으므로 한 회사를 공급망의 한 칸에만 넣을 필요는 없습니다.',
    technologies: [
      { name: '위탁 웨이퍼 제조', description: '고객의 설계와 공정 규칙을 연결해 반도체를 생산하는 서비스입니다.', source: 'tsmc_foundry' },
      { name: 'CoWoS', description: '로직과 HBM 등 여러 다이를 연결하는 첨단 패키징 기술군입니다. 구현에 따라 연결 구조가 달라집니다.', source: 'tsmc_cowos' },
    ],
    concepts: [link('foundry', 'role', '고객 설계를 실제 칩으로 만드는 위탁 제조의 대표 학습 사례입니다.'), link('fabrication', 'product', '여러 가공·검사 단계를 반복해 웨이퍼 위에 회로를 구현합니다.'), link('wafer', 'principle', '여러 다이를 함께 가공하는 웨이퍼가 생산의 기반입니다.'), link('interposer', 'product', 'CoWoS의 연결 플랫폼을 통해 칩 사이 미세 배선의 역할을 이해합니다.'), link('hbm', 'product', 'CoWoS는 로직 다이와 HBM을 연결하는 패키징 사례를 제공합니다.'), link('integration', 'product', '여러 다이를 가깝게 연결하는 이종 집적과 연결됩니다.'), link('packaging', 'product', '회로 제조 이후의 연결·조립도 시스템 성능의 일부입니다.'), link('ecosystem', 'role', '설계 고객과 장비·소재·패키징 기술을 연결하는 제조 허브입니다.')],
    refs: ['tsmc_foundry', 'tsmc_cowos'], website: 'https://www.tsmc.com/',
  },
  {
    id: 'samsung', name: '삼성전자', en: 'Samsung Electronics', aliases: ['삼성전자', '삼성', '삼성 반도체', 'Samsung', 'Samsung Electronics', 'Exynos', '엑시노스'], country: 'KR', stages: ['idm', 'memory', 'foundry'],
    summary: '메모리·시스템 반도체 설계와 제조, 파운드리 사업을 함께 운영하는 기업입니다.',
    role: '반도체 사업에는 Memory, System LSI, Foundry가 있습니다. 자사 제품을 설계·제조하는 역할과 외부 고객의 설계를 생산하는 역할이 한 기업 안에서 공존하는 사례입니다.',
    analogy: '직접 기획한 제품을 만드는 제조팀과 다른 고객의 주문을 제작하는 팀이 함께 있는 큰 공방에 가깝습니다. 같은 회사 안에서도 맡은 역할이 다릅니다.',
    distinction: '메모리 기업·IDM·파운드리는 서로 완전히 배타적인 분류가 아닙니다. 제품의 기능과 사업 모델이라는 서로 다른 기준이 섞여 있습니다.',
    technologies: [
      { name: 'DRAM·NAND·HBM', description: '작업용 메모리, 비휘발성 저장 메모리, 높은 대역폭을 위한 적층 메모리 제품군입니다.', source: 'samsung_memory' },
      { name: 'Foundry', description: '외부 설계 고객을 위한 반도체 제조와 설계 생태계를 제공합니다.', source: 'samsung_foundry' },
    ],
    concepts: [link('dram', 'product', '작업 데이터를 읽고 쓰는 메모리 제품과 연결됩니다.'), link('nand', 'product', '전원이 꺼져도 데이터를 보관하는 저장 메모리 제품과 연결됩니다.'), link('hbm', 'product', 'DRAM 적층과 넓은 데이터 경로를 활용하는 메모리 제품군입니다.'), link('logic-memory', 'product', '메모리와 System LSI 사업에서 저장과 계산의 기능 차이를 볼 수 있습니다.'), link('foundry', 'role', '외부 고객을 위한 제조 서비스도 운영합니다.'), link('fabrication', 'product', '설계된 회로를 실제 웨이퍼 위에 구현하는 제조 역량이 필요합니다.'), link('oxidation', 'principle', '산화막과 계면은 실리콘 기반 소자의 제조를 이해하는 배경 원리입니다.'), link('mosfet', 'principle', '전류를 제어하는 기본 소자에서 로직·메모리 회로의 출발점을 배웁니다.'), link('ecosystem', 'role', '여러 사업 역할이 한 기업에 함께 존재하는 사례입니다.')],
    refs: ['samsung_about', 'samsung_memory', 'samsung_foundry'], website: 'https://semiconductor.samsung.com/kr/',
  },
  {
    id: 'sk-hynix', name: 'SK하이닉스', en: 'SK hynix', aliases: ['SK하이닉스', 'SK 하이닉스', '하이닉스', 'SK hynix', '에스케이하이닉스'], country: 'KR', stages: ['memory', 'idm'],
    summary: 'DRAM·NAND와 HBM 등 데이터 저장·공급을 위한 메모리를 개발하고 제조하는 기업입니다.',
    role: '작업용 DRAM과 저장용 NAND를 개발·생산하고, 적층과 패키징 기술을 활용해 HBM을 만듭니다. 메모리 셀과 시스템의 데이터 공급이 연결되는 과정을 이해하는 사례입니다.',
    analogy: '빠르게 꺼내 쓰는 작업 공간과 오래 보관할 저장 공간을 만들고, 연산 장치로 데이터를 전달하는 길도 넓히는 팀에 가깝습니다.',
    distinction: 'HBM은 독립적인 연산 프로세서가 아니라 DRAM 기반 메모리입니다. 메모리의 용량과 대역폭을 구분하면 AI 시스템에서의 역할이 더 분명해집니다.',
    technologies: [
      { name: 'DRAM·HBM', description: '작업 데이터를 공급하는 DRAM과 고대역폭 적층 메모리를 개발합니다.', source: 'hynix_memory' },
      { name: 'NAND', description: '비휘발성 저장을 위한 메모리 기술을 개발하며 저장장치 구성으로 이어집니다.', source: 'hynix_memory' },
    ],
    concepts: [link('dram', 'product', '휘발성 작업 메모리의 셀과 동작 원리가 제품으로 이어집니다.'), link('nand', 'product', '저장 밀도와 읽기·쓰기·삭제 단위를 이해하는 실제 메모리 사례입니다.'), link('hbm', 'product', '적층 DRAM이 연산 장치의 데이터 공급을 돕는 사례입니다.'), link('tsv', 'principle', '적층 메모리에서 위아래 다이를 잇는 수직 연결 원리를 이해합니다.'), link('packaging', 'product', '메모리를 쌓고 연결하는 공정도 완성 제품의 성능에 영향을 줍니다.'), link('integration', 'principle', '여러 다이를 수직으로 결합할 때 연결·열·수율을 함께 봅니다.'), link('ecosystem', 'role', '메모리 제조와 가속기·패키징의 역할이 만나는 지점입니다.')],
    refs: ['hynix_about', 'hynix_memory'], website: 'https://www.skhynix.com/',
  },
  {
    id: 'asml', name: 'ASML', en: 'ASML', aliases: ['ASML', '에이에스엠엘', 'TWINSCAN', '트윈스캔'], country: 'NL', stages: ['equipment'],
    summary: 'EUV·DUV 노광 장비로 칩을 가공할 위치와 패턴을 정밀하게 정의하도록 돕는 기업입니다.',
    role: '빛과 광학계, 정밀 위치 제어를 결합한 노광 시스템을 제공합니다. 칩을 직접 판매하는 역할과 제조사가 회로 패턴을 만들 도구를 제공하는 역할을 구분해볼 수 있습니다.',
    analogy: '작은 설계도를 여러 층에 정확히 맞춰 인쇄할 초정밀 인쇄기를 만드는 팀에 가깝습니다. 종이를 직접 깎는 대신 어디를 가공할지 표시합니다.',
    distinction: '노광은 빛으로 실리콘을 직접 깎는 공정이 아닙니다. 감광재에 패턴을 만든 뒤 식각 등 후속 공정이 실제 재료를 가공합니다.',
    technologies: [
      { name: 'EUV 노광 시스템', description: '미세한 패턴을 위한 짧은 파장의 빛과 반사 광학계를 활용합니다.', source: 'asml_products' },
      { name: 'DUV 노광 시스템', description: '광원과 광학계에 따라 다양한 층과 제품의 패턴 형성을 지원합니다.', source: 'asml_products' },
    ],
    concepts: [link('lithography', 'product', '패턴을 감광재에 전달하는 노광 장비를 만듭니다.'), link('euv-duv', 'product', '서로 다른 파장과 광학계를 쓰는 두 장비군을 비교할 수 있습니다.'), link('fabrication', 'role', '노광은 여러 공정과 반복되어 전체 회로를 구현합니다.'), link('ecosystem', 'role', '공정 장비가 여러 제조 기업의 생산을 지원하는 사례입니다.')],
    refs: ['asml_about', 'asml_products'], website: 'https://www.asml.com/',
  },
  {
    id: 'applied-materials', name: '어플라이드 머티어리얼즈', en: 'Applied Materials', aliases: ['어플라이드 머티어리얼즈', '어플라이드', '어플라이드머티리얼즈', 'Applied Materials', 'AMAT'], country: 'US', stages: ['equipment'],
    summary: '막을 만들고 제거하고 평탄하게 다듬는 재료 가공 장비와 공정 기술을 제공하는 기업입니다.',
    role: '증착·식각·이온주입·평탄화 등 반도체 제조에 필요한 여러 장비군을 제공합니다. 소자의 입체 구조가 복잡해질수록 막의 두께·조성·형상 제어가 왜 중요한지 연결해볼 수 있습니다.',
    analogy: '정밀 건축 현장에 코팅·절삭·표면 가공 장비를 공급하는 도구 전문팀에 가깝습니다. 설계한 구조를 실제 재료로 구현할 방법을 제공합니다.',
    distinction: '장비 기업의 제품군은 여러 공정에 걸쳐 있습니다. “장비 기업”을 한 공정에만 대응시키거나 한 종류의 칩을 만드는 회사로 이해하지 않도록 합니다.',
    technologies: [
      { name: '박막 형성', description: 'CVD·ALD 등으로 필요한 재료의 막을 만들고 조성을 제어하는 장비군입니다.', source: 'applied_create' },
      { name: '식각·이온주입·CMP', description: '형상·전기적 특성·평탄도를 조절하는 서로 다른 제조 장비군입니다.', source: 'applied_products' },
    ],
    concepts: [link('deposition', 'product', '필요한 기능의 박막을 형성하는 장비를 제공합니다.'), link('cvd', 'product', '기체 원료의 화학 반응으로 막을 만드는 장비군과 연결됩니다.'), link('ald', 'product', '순차적 표면 반응으로 박막을 제어하는 기술과 연결됩니다.'), link('etching', 'product', '원하는 재료와 형상을 선택적으로 제거하는 장비군입니다.'), link('ion-implantation', 'product', '도핑에 필요한 이온의 에너지와 주입량을 제어하는 장비군입니다.'), link('cmp', 'product', '다음 층을 만들기 위한 표면 평탄화 장비와 연결됩니다.'), link('fabrication', 'role', '제조 기업이 여러 공정을 구현하도록 가공 기반을 공급합니다.'), link('ecosystem', 'role', '장비는 제조의 한 단계뿐 아니라 여러 공정에 걸쳐 기여합니다.')],
    refs: ['applied_products', 'applied_create'], website: 'https://www.appliedmaterials.com/',
  },
  {
    id: 'synopsys', name: '시놉시스', en: 'Synopsys', aliases: ['시놉시스', '시높시스', 'Synopsys', 'EDA', 'DesignWare'], country: 'US', stages: ['eda-ip'],
    summary: '칩 설계·검증 도구와 재사용 가능한 반도체 설계 IP를 제공하는 기업입니다.',
    role: '전자설계자동화(EDA) 도구로 회로와 배치를 설계·검증하고, 인터페이스 등 기능 블록을 IP로 제공합니다. 설계 기업이 제조 가능한 설계를 완성하도록 돕는 역할입니다.',
    analogy: '설계팀에게 정밀한 도면 프로그램과 검증 도구, 재사용할 수 있는 부품 설계도를 제공하는 팀에 가깝습니다.',
    distinction: '설계 IP는 완성된 실물 칩이 아니라 재사용 가능한 설계 자산입니다. IP를 제공하는 역할과 그 설계를 웨이퍼에 제조하는 역할은 구분됩니다.',
    technologies: [
      { name: 'EDA·설계 검증', description: '칩의 기능과 구현 조건을 점검하는 소프트웨어 도구를 제공합니다.', source: 'synopsys_about' },
      { name: '반도체 설계 IP', description: '다양한 인터페이스와 기능을 칩에 통합하기 위한 재사용 설계 블록입니다.', source: 'synopsys_ip' },
    ],
    concepts: [link('fabless', 'role', '설계 전문 기업이 칩을 구현하고 검증하는 도구와 IP를 제공합니다.'), link('foundry', 'role', '설계가 목표 제조 공정의 규칙과 모델에 맞도록 연결하는 작업을 이해합니다.'), link('transistor', 'principle', '설계·검증은 기본 소자의 동작 모델 위에서 이루어집니다.'), link('mosfet', 'principle', '소자 모델과 회로 동작을 연결하는 배경 원리입니다.'), link('logic-memory', 'principle', '서로 다른 기능 블록을 설계 자산으로 조합하는 관점과 연결됩니다.'), link('ecosystem', 'role', 'EDA와 IP는 칩 설계와 제조의 공통 기반을 제공합니다.')],
    refs: ['synopsys_about', 'synopsys_ip'], website: 'https://www.synopsys.com/',
  },
  {
    id: 'sumco', name: 'SUMCO', en: 'SUMCO Corporation', aliases: ['SUMCO', '섬코', '숨코', '썸코', '스미토모 미쓰비시 실리콘'], country: 'JP', stages: ['materials'],
    summary: '회로를 만들 바탕인 고품질 실리콘 웨이퍼를 전문적으로 제조하는 기업입니다.',
    role: '실리콘 단결정을 성장시키고 얇게 자른 뒤 연마·세정해 웨이퍼를 공급합니다. 연마 웨이퍼와 에피택셜 웨이퍼처럼 필요한 표면 특성에 맞춘 제품을 제공합니다.',
    analogy: '정밀한 그림을 그릴 수 있도록 종이의 재질·두께·표면을 먼저 맞추는 팀에 가깝습니다. 회로를 만드는 작업 전에 기판의 품질을 준비합니다.',
    distinction: '웨이퍼 소재를 공급하는 일과 그 웨이퍼 위에 고객 회로를 만드는 파운드리 사업은 다릅니다. 두 역할을 연결하면 공급망의 앞단을 이해할 수 있습니다.',
    technologies: [
      { name: '연마 웨이퍼', description: '단결정 잉곳을 자르고 표면을 연마해 평탄한 기판을 준비합니다.', source: 'sumco_products' },
      { name: '에피택셜 웨이퍼', description: '웨이퍼 표면에 단결정 실리콘 층을 성장시켜 필요한 특성을 제공합니다.', source: 'sumco_products' },
    ],
    concepts: [link('silicon', 'product', '실리콘 원료와 단결정에서 웨이퍼가 만들어집니다.'), link('wafer', 'product', '칩 제조의 바탕이 되는 웨이퍼를 공급합니다.'), link('semiconductor', 'principle', '반도체 재료와 그 재료로 만드는 칩을 구분하는 출발점입니다.'), link('conductors', 'principle', '웨이퍼의 전기적 성질을 이해하려면 재료의 전도 특성을 알아야 합니다.'), link('cleaning', 'product', '기판 생산 과정에서 세정과 표면 청정도 관리가 필요합니다.'), link('ecosystem', 'role', '소재 기업이 제조 기업에 기판을 공급하는 역할을 보여줍니다.')],
    refs: ['sumco_about', 'sumco_products', 'sumco_process'], website: 'https://www.sumcosi.com/english/',
  },
  {
    id: 'ase', name: 'ASE', en: 'Advanced Semiconductor Engineering', aliases: ['ASE', '에이에스이', '일월광', '日月光', 'Advanced Semiconductor Engineering', 'VIPack', '브이아이팩'], country: 'TW', stages: ['packaging'],
    summary: '반도체 다이를 조립·연결·검사하는 패키징·테스트 서비스를 제공하는 기업입니다.',
    role: '외부 고객을 위한 패키징과 테스트를 제공하는 OSAT 역할의 사례입니다. 웨이퍼에서 나온 다이를 연결하고 보호하며, 이종 집적으로 여러 기능을 하나의 패키지에 통합합니다.',
    analogy: '정밀 부품을 조립하고 외부 단자와 연결한 뒤 제대로 작동하는지 검사하는 완성 공정팀에 가깝습니다.',
    distinction: '패키징은 외형만 포장하는 일이 아닙니다. 전기적 연결·신호 품질·열 관리와 테스트가 사용 가능한 부품을 만드는 데 함께 필요합니다.',
    technologies: [
      { name: '패키징·테스트 서비스', description: '다이 연결과 보호, 웨이퍼 검사·완제품 테스트 등 후공정 서비스를 제공합니다.', source: 'ase_about' },
      { name: 'VIPack', description: '여러 기능의 다이를 연결하는 첨단 패키징과 이종 집적 기술 플랫폼입니다.', source: 'ase_vipack' },
    ],
    concepts: [link('packaging', 'product', '다이를 연결·보호하고 테스트해 사용할 수 있는 부품으로 만듭니다.'), link('integration', 'product', '여러 기능을 하나의 패키지로 연결하는 이종 집적과 이어집니다.'), link('interposer', 'principle', '미세 연결과 기판 사이를 잇는 중간 연결 구조를 이해합니다.'), link('tsv', 'principle', '수직 연결을 포함한 입체 집적의 기본 개념을 살펴볼 수 있습니다.'), link('ecosystem', 'role', '설계·웨이퍼 제조 이후의 조립과 검사를 맡는 역할입니다.')],
    refs: ['ase_about', 'ase_vipack'], website: 'https://ase.aseglobal.com/',
  },
  ...expandedCompanies,
].map(company => ({ ...company, checkedAt: companyCheckedAt }));

export const companyById = Object.assign(Object.create(null), Object.fromEntries(companies.map(company => [company.id, company])));
export function getCompaniesForConcept(conceptId) {
  return companies.flatMap(company => {
    const connection = company.concepts.find(concept => concept.id === conceptId);
    return connection ? [{ company, connection }] : [];
  });
}
export function getRelatedCompanies(companyId, limit = 3) {
  const company = companyById[companyId];
  if (!company) return [];
  const conceptIds = new Set(company.concepts.filter(c => c.id !== 'ecosystem').map(c => c.id));
  return companies.filter(candidate => candidate.id !== companyId)
    .map(candidate => ({ company: candidate, shared: candidate.concepts.filter(c => conceptIds.has(c.id)).map(c => c.id) }))
    .filter(item => item.shared.length)
    .sort((a, b) => b.shared.length - a.shared.length || a.company.id.localeCompare(b.company.id))
    .slice(0, limit);
}
