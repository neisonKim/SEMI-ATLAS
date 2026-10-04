// Editorial fields added during the Next.js MVP detail-page completion pass.
// These fields are intentionally separate from the original migrated rows so the
// source content remains easy to compare with the static prototype.
export const conceptDetails = {
  semiconductor: {
    what: '반도체라는 말은 재료 자체와 그 재료로 만든 칩을 모두 가리키는 경우가 많습니다. 여기서는 재료의 전기적 성질에서 출발해 소자와 회로가 만들어지는 흐름을 구분해서 이해합니다.',
    structureLabels: ['재료', '소자', '회로'],
    industry: '반도체의 기본 원리는 설계·제조·패키징·시스템 기업이 공통으로 사용하는 출발점입니다. 이후의 모든 개념을 이해하기 위한 가장 앞단의 기초 지식입니다.'
  },
  conductors: {
    what: '핵심은 “얼마나 전기가 흐르느냐”보다 전류 흐름을 어떤 방식으로 제어할 수 있느냐입니다. 칩 안에서는 도체·절연체·반도체가 서로 다른 역할을 나눠 맡습니다.',
    structureLabels: ['도체', '부도체·절연체', '반도체'],
    industry: '금속 배선 재료, 절연막 재료, 반도체 기판과 박막은 모두 제조공정의 핵심 소재입니다. 재료의 전기적 성질을 이해해야 공정과 소자의 역할도 연결해서 볼 수 있습니다.'
  },
  silicon: {
    what: '실리콘은 현재 가장 널리 쓰이는 반도체 기반 재료입니다. 높은 순도의 단결정을 만들 수 있고, 공정성이 좋은 산화막을 형성할 수 있다는 점이 오랜 산업 표준 형성에 기여했습니다.',
    structureLabels: ['고순도 실리콘', '단결정 잉곳', '웨이퍼'],
    industry: '실리콘 원재료와 웨이퍼는 반도체 공급망의 가장 앞단에 있습니다. 웨이퍼 품질은 이후 노광·식각·증착과 같은 제조공정의 기반 조건이 됩니다.'
  },
  wafer: {
    what: '웨이퍼는 회로를 한 개씩 만드는 대신 많은 다이를 한 장에서 동시에 가공하기 위한 제조 플랫폼입니다. 표면 평탄도·결정 품질·청정도가 중요한 이유가 여기에 있습니다.',
    structureLabels: ['잉곳', '웨이퍼', '다이'],
    industry: '웨이퍼 공급사는 반도체 제조사에 가공 가능한 기판을 제공합니다. 파운드리와 IDM은 이 웨이퍼 위에서 반복적인 전공정을 수행해 회로를 형성합니다.'
  },
  transistor: {
    what: '트랜지스터는 입력 전기 신호로 다른 전류의 흐름을 제어하는 기본 소자입니다. 디지털 회로에서는 이 제어 기능을 매우 작은 스위치처럼 이용합니다.',
    structureLabels: ['입력 신호', '전류 제어부', '출력 상태'],
    industry: '트랜지스터 구조는 반도체 설계와 공정 기술이 만나는 지점입니다. 설계사는 회로를 구성하고, 제조사는 실제 소자 구조를 웨이퍼 위에 구현합니다.'
  },
  mosfet: {
    what: 'MOSFET은 현대 디지털 칩의 대표적인 트랜지스터 구조입니다. 게이트 전압이 채널의 전기적 상태를 바꾸어 소스와 드레인 사이의 전류를 조절합니다.',
    structureLabels: ['Gate', 'Channel', 'Source · Drain'],
    industry: 'MOSFET의 미세화와 구조 변화는 파운드리 공정 경쟁력과 직접 연결됩니다. 소자 구조가 바뀌면 증착·식각·계측 등 제조 장비와 소재 요구도 함께 달라집니다.'
  },
  'logic-memory': {
    what: '반도체를 기능으로 크게 나누면 계산·제어를 담당하는 로직과 데이터를 저장하는 메모리로 이해할 수 있습니다. 실제 시스템에서는 두 종류가 긴밀하게 데이터를 주고받습니다.',
    structureLabels: ['Logic', 'Memory', 'System'],
    industry: 'CPU·GPU 같은 로직과 DRAM·NAND 같은 메모리는 서로 다른 제품 시장을 이루지만, 데이터센터·PC·모바일 같은 최종 시스템에서는 하나의 성능 체계로 연결됩니다.'
  },
  cpu: {
    what: 'CPU는 다양한 종류의 명령을 해석하고 순서와 조건에 맞게 실행하는 범용 프로세서입니다. 빠른 단일 작업 처리와 복잡한 제어 흐름에 강점을 가집니다.',
    structureLabels: ['Core', 'Cache · Memory', 'I/O · Control'],
    industry: 'CPU는 PC·서버·임베디드 시스템의 핵심 로직 칩입니다. 설계 기업, 파운드리, 메모리·패키징 공급망과 함께 하나의 컴퓨팅 플랫폼을 구성합니다.'
  },
  gpu: {
    what: 'GPU는 비슷한 계산을 대량으로 동시에 처리할 수 있도록 많은 연산 자원을 병렬로 배치한 프로세서입니다. 오늘날에는 그래픽뿐 아니라 AI 연산에서도 핵심 역할을 합니다.',
    structureLabels: ['병렬 연산 자원', '고속 메모리', '대규모 데이터'],
    industry: 'AI 가속기 시장에서 GPU 성능은 HBM과 첨단 패키징의 공급 능력과 함께 평가됩니다. 연산 칩만 빨라서는 전체 시스템 성능을 확보하기 어렵기 때문입니다.'
  },
  dram: {
    what: 'DRAM은 현재 작업에 필요한 데이터를 빠르게 읽고 쓰기 위한 휘발성 메모리입니다. 셀에 저장된 전하를 주기적으로 갱신해야 한다는 특징이 있습니다.',
    structureLabels: ['Memory Cell', 'Refresh', 'Memory Interface'],
    industry: 'DRAM은 PC·서버·모바일 메모리 시장의 핵심 제품이며, HBM도 DRAM 기술을 기반으로 합니다. 메모리 제조사와 패키징 기술의 연결을 이해하는 핵심 노드입니다.'
  },
  nand: {
    what: 'NAND Flash는 전원이 꺼져도 데이터를 유지하는 비휘발성 메모리입니다. 높은 저장 밀도를 위해 여러 셀을 구조적으로 묶고, 최근에는 3차원 적층 구조를 널리 사용합니다.',
    structureLabels: ['Cell', 'Page', 'Block'],
    industry: 'NAND는 SSD·모바일 저장장치·메모리카드의 핵심 부품입니다. 메모리 제조와 컨트롤러, 스토리지 시스템 산업으로 이어지는 공급망을 형성합니다.'
  },
  fabrication: {
    what: '반도체 제조공정은 한 번의 직선적인 순서가 아니라, 필요한 층과 구조를 만들기 위해 여러 단계를 반복하는 정밀 제조 과정입니다. 패턴 형성·재료 가공·검사와 세정이 계속 이어집니다.',
    structureLabels: ['패턴 정의', '재료 형성·가공', '반복 · 검사'],
    industry: '파운드리와 IDM이 제조의 중심을 맡고, 장비·소재 기업이 노광·식각·증착·세정 등 각 단계에 필요한 기술을 공급합니다. 이 페이지가 공정 학습의 허브입니다.'
  },
  oxidation: {
    what: '산화공정은 실리콘 표면 자체를 반응시켜 실리콘 산화막을 만드는 방법입니다. 단순히 막을 얹는 증착과는 형성 원리가 다릅니다.',
    structureLabels: ['Silicon', 'SiO₂', 'Interface'],
    industry: '산화막 품질은 소자 절연과 계면 특성에 영향을 줍니다. 제조사는 온도·시간·분위기를 제어하고, 관련 열처리 장비와 공정 기술이 이를 지원합니다.'
  },
  lithography: {
    what: '노광은 회로를 직접 깎는 공정이 아니라 “어디를 가공할지” 위치 정보를 포토레지스트에 만드는 패턴 정의 단계입니다. 이후 식각이나 이온주입이 이 패턴을 이용합니다.',
    structureLabels: ['Photoresist', 'Mask · Light', 'Pattern'],
    industry: '노광은 첨단 공정의 핵심 병목 중 하나입니다. 노광 장비, 마스크, 포토레지스트, 계측 기술이 함께 정밀도를 결정합니다.'
  },
  'euv-duv': {
    what: 'DUV와 EUV는 노광에 사용하는 빛의 파장과 광학 시스템이 다른 기술입니다. 더 짧은 파장은 더 작은 패턴 구현에 유리하지만 장비와 공정 난도도 크게 높아집니다.',
    structureLabels: ['광원', '광학계 · 마스크', '감광재'],
    industry: 'EUV 생태계는 노광 장비뿐 아니라 광원, 미러, 마스크, 포토레지스트와 계측 기술까지 연결됩니다. 첨단 파운드리 공정 경쟁력과 밀접한 분야입니다.'
  },
  etching: {
    what: '식각은 마스크로 보호되지 않은 재료를 선택적으로 제거해 원하는 형상을 만드는 공정입니다. 패턴을 실제 막이나 기판으로 옮기는 핵심 단계입니다.',
    structureLabels: ['Mask', 'Etch Reaction', 'Pattern Transfer'],
    industry: '식각 장비는 미세한 수직 구조와 높은 종횡비 구조를 만들 때 중요합니다. 플라즈마·가스·챔버 제어 기술이 장비와 소재 공급망을 연결합니다.'
  },
  deposition: {
    what: '증착은 웨이퍼 표면에 필요한 물질의 얇은 막을 형성하는 공정군입니다. 만들고 싶은 막의 재료와 구조에 따라 CVD·ALD 등 여러 방식이 사용됩니다.',
    structureLabels: ['원료', '표면 반응', 'Thin Film'],
    industry: '증착 장비와 전구체 소재는 미세공정과 3D 구조가 복잡해질수록 중요도가 높아집니다. 공정 균일도와 막의 물성이 수율과 소자 성능에 영향을 줍니다.'
  },
  cvd: {
    what: 'CVD는 기체 상태의 원료를 공급하고 표면에서 화학 반응을 일으켜 박막을 만드는 증착 방식입니다. 비교적 높은 처리량과 다양한 막 형성이 장점입니다.',
    structureLabels: ['Reactant Gas', 'Surface Reaction', 'Film Growth'],
    industry: 'CVD 장비와 전구체·공정가스 공급사는 절연막·반도체막·금속계 막 등 다양한 공정에 참여합니다. 막 특성에 따라 장비 구조와 공정 조건이 달라집니다.'
  },
  ald: {
    what: 'ALD는 원료를 한꺼번에 반응시키기보다 순차적으로 공급해 자기제한적인 표면 반응을 반복하는 증착 기술입니다. 복잡한 구조에서도 높은 피복성과 두께 제어가 강점입니다.',
    structureLabels: ['Precursor A', 'Purge · Precursor B', 'Cycle Repeat'],
    industry: 'GAA·3D NAND처럼 입체 구조가 복잡해질수록 ALD의 중요성이 커집니다. 장비, 전구체 소재, 공정 레시피가 함께 경쟁력을 만듭니다.'
  },
  'ion-implantation': {
    what: '이온주입은 원하는 원자를 이온으로 만든 뒤 가속해 웨이퍼의 특정 깊이와 위치에 넣는 도핑 방법입니다. 트랜지스터의 전기적 특성을 만드는 데 사용됩니다.',
    structureLabels: ['Ion Source', 'Acceleration', 'Wafer Implant'],
    industry: '이온주입 장비는 에너지·농도·균일도를 정밀하게 제어해야 합니다. 이후 열처리와 함께 소자의 전기적 특성을 형성하는 핵심 전공정 기술입니다.'
  },
  cmp: {
    what: 'CMP는 화학 반응으로 표면을 부드럽게 만들면서 패드와 슬러리의 기계적 작용으로 높낮이를 줄이는 평탄화 기술입니다. 다음 층을 정밀하게 만들기 위한 기반을 제공합니다.',
    structureLabels: ['Slurry', 'Polishing Pad', 'Wafer Surface'],
    industry: 'CMP는 장비뿐 아니라 슬러리·패드·세정 소재가 함께 필요한 공정입니다. 다층 배선과 적층 구조가 복잡해질수록 평탄도 관리가 중요해집니다.'
  },
  cleaning: {
    what: '세정은 단순한 마지막 청소가 아니라 여러 공정 사이에서 반복되는 핵심 제조 단계입니다. 제거해야 할 오염과 보호해야 할 표면을 동시에 고려합니다.',
    structureLabels: ['Contaminant', 'Chemistry · DIW', 'Clean Surface'],
    industry: '세정 장비, 초순수, 화학약품과 오염 관리 기술은 수율과 직결됩니다. 미세공정에서는 아주 작은 입자나 금속 오염도 결함 원인이 될 수 있습니다.'
  },
  packaging: {
    what: '패키징은 완성된 다이를 외부 시스템과 연결하고 보호하며, 열을 밖으로 전달할 수 있도록 만드는 기술입니다. 최근에는 여러 칩을 결합해 시스템 성능을 높이는 역할까지 확대되었습니다.',
    structureLabels: ['Die', 'Interconnect', 'Package · Substrate'],
    industry: 'OSAT와 IDM, 파운드리의 첨단 패키징 사업이 이 영역에 참여합니다. 기판·범프·본딩·테스트·열관리 소재와 장비가 함께 공급망을 구성합니다.'
  },
  tsv: {
    what: 'TSV는 실리콘 내부를 수직으로 관통하는 전기 연결 통로입니다. 적층된 다이 사이의 연결 거리를 줄이고 많은 신호선을 확보하는 데 활용됩니다.',
    structureLabels: ['Via Hole', 'Insulation · Metal', 'Vertical Link'],
    industry: 'TSV는 HBM과 일부 3D 집적 기술의 핵심 연결 요소입니다. 깊은 식각, 절연·금속 충전, 박막화, 본딩과 같은 여러 공정 기술이 함께 필요합니다.'
  },
  interposer: {
    what: '인터포저는 서로 다른 칩의 미세한 연결을 중간에서 받아 더 큰 기판으로 전달하는 연결 플랫폼입니다. 칩 사이를 매우 가깝게 배치할 수 있도록 돕습니다.',
    structureLabels: ['Compute Die', 'Fine Wiring', 'Package Substrate'],
    industry: 'AI·HPC 패키징에서는 GPU·가속기와 HBM을 고밀도로 연결하는 역할이 중요합니다. 인터포저 제조와 조립은 파운드리·패키징 공급망과 연결됩니다.'
  },
  hbm: {
    what: 'HBM은 여러 DRAM 다이를 수직으로 쌓고 넓은 인터페이스를 사용해 매우 높은 데이터 전송량을 확보한 메모리입니다. 용량보다 “데이터를 얼마나 빠르게 전달하는가”가 핵심 포인트입니다.',
    structureLabels: ['DRAM Stack', 'TSV', 'Base · Interface'],
    industry: 'HBM은 DRAM 제조사, 첨단 패키징, 파운드리, AI 가속기 설계사가 강하게 연결되는 대표 기술입니다. AI 서버 공급망에서 생산능력과 패키징 능력이 함께 중요합니다.'
  },
  integration: {
    what: '2.5D와 3D 집적은 여러 다이를 하나의 시스템처럼 가깝게 연결하기 위한 패키징 전략입니다. 수평 연결과 수직 적층을 어떻게 조합하느냐가 핵심 차이입니다.',
    structureLabels: ['2.5D Side-by-side', '3D Vertical Stack', 'Package System'],
    industry: '칩렛과 AI 가속기 확산으로 이종 집적의 중요성이 커지고 있습니다. 파운드리, OSAT, 기판·본딩 장비와 열관리 기술이 하나의 첨단 패키징 생태계를 형성합니다.'
  },
  ecosystem: {
    what: '반도체 산업은 한 회사가 모든 일을 수행하는 단일 구조가 아니라 설계·제조·패키징·장비·소재·시스템 기업이 분업과 협업으로 연결된 생태계입니다.',
    structureLabels: ['Design', 'Manufacturing', 'Packaging · System'],
    industry: '이 페이지는 기술 개념을 실제 기업 역할과 연결하는 산업 Hub입니다. 기업 이름을 외우기보다 어떤 가치사슬 단계에서 어떤 문제를 해결하는지 이해하는 것이 핵심입니다.'
  },
  fabless: {
    what: '팹리스는 자체 대규모 제조공장 없이 제품 기획과 반도체 설계에 집중하고, 생산은 파운드리와 같은 외부 제조 파트너에 맡기는 사업 모델입니다.',
    structureLabels: ['Architecture · Design', 'Tape-out', 'Foundry Partner'],
    industry: '팹리스는 EDA·IP 기업의 설계 기술과 파운드리의 제조 역량, OSAT·패키징 파트너를 연결합니다. 제품 경쟁력은 설계뿐 아니라 전체 파트너 생태계와 협업에서 나옵니다.'
  },
  foundry: {
    what: '파운드리는 고객이 설계한 칩을 실제 웨이퍼 위에 구현해 생산하는 위탁 제조 사업입니다. 공정 기술과 대규모 생산시설, 수율 관리 능력이 핵심 경쟁력입니다.',
    structureLabels: ['PDK · Design Interface', 'Wafer Fab', 'Yield · Delivery'],
    industry: '파운드리는 팹리스와 장비·소재·패키징 기업을 연결하는 제조 허브입니다. 고객 설계를 안정적으로 양산하기 위해 공정 플랫폼, 설계 생태계, 생산능력을 함께 제공합니다.'
  }
};
