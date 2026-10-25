import { expandedCompanyMedia } from './company-media-expanded.mjs';

// Original public assets; preserve their colors, proportions, credits and provenance.
export const companyMediaCheckedAt = '2026-10-25';
export const companyMedia = Object.assign(Object.create(null), {
  "nvidia": {
    "image": {
      "width": 625,
      "height": 291,
      "sha256": "96bbdd95e9ce322543b3583791d571aba90a1bedbcba00cbbce47ee8355715e8",
      "bytes": 36226,
      "contentType": "image/jpeg",
      "src": "/assets/companies/nvidia/image.jpg",
      "sourceUrl": "https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/",
      "assetUrl": "https://developer-blogs.nvidia.com/wp-content/uploads/2022/03/SXM5-White-4-NEW-FINAL-625x291.jpg",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "alt": "NVIDIA H100 SXM5 GPU 모듈의 공식 제품 이미지",
      "caption": "NVIDIA H100 SXM5 모듈 · 2022년 공개 제품 이미지",
      "credit": "© NVIDIA"
    },
    "logo": {
      "width": 975,
      "height": 180,
      "sha256": "b6a3fa5fc25372f0d6ba588c2253cd5581e50ec2ec2f2435b2875730bc94ad58",
      "bytes": 2094,
      "contentType": "image/svg+xml",
      "src": "/assets/companies/nvidia/logo.svg",
      "sourceUrl": "https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/",
      "assetUrl": "https://developer-blogs.nvidia.com/wp-content/themes/nvidia/dist/images/nvidia-logo_28b633c7.svg",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "tone": "dark",
      "credit": "© NVIDIA"
    }
  },
  "amd": {
    "logo": {
      "width": 140,
      "height": 33,
      "sha256": "68da06f37f9c334975d93cba332557f112cee98747f66529c695f0b0d675a0b8",
      "bytes": 925,
      "contentType": "image/svg+xml",
      "src": "/assets/companies/amd/logo.svg",
      "sourceUrl": "https://newsroom.amd.com/media-center/",
      "assetUrl": "https://newsroom.amd.com/_astro/amd-header-logo.NP9ywpkQ.svg",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "tone": "dark",
      "credit": "© AMD"
    },
    "image": {
      "width": 800,
      "height": 450,
      "sha256": "081d2c50669a46651b69c6c0e913730ffb5495965ecd10de90cebc7fa335b10f",
      "bytes": 68558,
      "contentType": "image/jpeg",
      "src": "/assets/companies/amd/image.jpg",
      "sourceUrl": "https://newsroom.amd.com/media-center/",
      "assetUrl": "https://newsroom.amd.com/images/media-center/2026/07/a2d6da49-7d48-4513-93d0-7039846d068a.jpg",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "alt": "AMD 로고가 있는 미국 산타클라라 본사 건물",
      "caption": "AMD 미국 산타클라라 본사 · 공식 사진",
      "credit": "© AMD"
    }
  },
  "samsung": {
    "logo": {
      "width": 104,
      "height": 16,
      "sha256": "fd922b228c9b6f07f65fffcd83d015b294d06bfa1c9e7aa37d733c709b27a721",
      "bytes": 2205,
      "contentType": "image/svg+xml",
      "src": "/assets/companies/samsung/logo.svg",
      "sourceUrl": "https://semiconductor.samsung.com/kr/about-us/business-area/memory/",
      "assetUrl": "https://semiconductor.samsung.com/etc.clientlibs/semiconductor/designs/global/common/resources/img/icon/global-samsung-logo.svg",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "tone": "dark",
      "credit": "© Samsung Electronics"
    },
    "image": {
      "width": 1156,
      "height": 385,
      "sha256": "97670bccf18da1279713438ae872c0c3d3e90998b1611dcbf37348e33fbecee1",
      "bytes": 122356,
      "contentType": "image/jpeg",
      "src": "/assets/companies/samsung/image.jpg",
      "sourceUrl": "https://semiconductor.samsung.com/kr/about-us/business-area/memory/",
      "assetUrl": "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/about-us/business-area/memory/business-area-memory3-pc-1156x385-re.png?$ORIGIN_PNG$",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "alt": "서버 랙을 배경으로 전시된 삼성 메모리와 스토리지 제품",
      "caption": "삼성전자 메모리·스토리지 제품 · 공식 이미지",
      "credit": "© Samsung Electronics"
    }
  },
  "tsmc": {
    "logo": {
      "width": 273,
      "height": 215,
      "sha256": "128ee2d8cb91f3303f274041e5eb9c4d2840f94644e897c892e112bb62672a1a",
      "bytes": 21652,
      "contentType": "image/svg+xml",
      "src": "/assets/companies/tsmc/logo.svg",
      "sourceUrl": "https://en.wikipedia.org/wiki/File:Tsmc.svg",
      "assetUrl": "https://upload.wikimedia.org/wikipedia/en/6/63/Tsmc.svg",
      "origin": "public-logo",
      "checkedAt": "2026-10-25",
      "tone": "light",
      "credit": "© TSMC"
    },
    "image": {
      "width": 1280,
      "height": 720,
      "sha256": "1b2b9bd039e5deff55edd643cefe4d2784c146b015deaea46fb4a3d693a1966f",
      "bytes": 235408,
      "contentType": "image/jpeg",
      "src": "/assets/companies/tsmc/image.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:TSMC_factory_in_Taichung%27s_Central_Taiwan_Science_Park.jpg",
      "assetUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/TSMC_factory_in_Taichung%27s_Central_Taiwan_Science_Park.jpg/1280px-TSMC_factory_in_Taichung%27s_Central_Taiwan_Science_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
      "origin": "public-commons",
      "checkedAt": "2026-10-25",
      "alt": "대만 타이중 중앙과학단지의 TSMC 공장 외관",
      "caption": "TSMC 타이중 공장 외관 · 2020년 6월",
      "credit": "Briáxis F. Mendes (孟必思)",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  "sk-hynix": {
    "logo": {
      "width": 102,
      "height": 54,
      "sha256": "99cbb70ee50a5450f25f55200633aea84cbdc5144f888355c84ef5a8bbda20dc",
      "bytes": 3237,
      "contentType": "image/svg+xml",
      "src": "/assets/companies/sk-hynix/logo.svg",
      "sourceUrl": "https://research.skhynix.com/research-areas/future-memory-technologies/evolutionary-memory",
      "assetUrl": "https://research.skhynix.com/research-areas/future-memory-technologies/evolutionary-memory",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "tone": "light",
      "credit": "© SK hynix"
    },
    "image": {
      "width": 976,
      "height": 720,
      "sha256": "8d19c59a92d89a2cc02d5017520156c761c3a4cfdb1d1a2b9ca302f839274b90",
      "bytes": 169119,
      "contentType": "image/jpeg",
      "src": "/assets/companies/sk-hynix/image.jpg",
      "sourceUrl": "https://www.skhynix.com/company/UI-FR-CP02/",
      "assetUrl": "https://mis-prod-koce-skhynixhomepage-cdn-01-ep.azureedge.net/img/content/img_product01_250404.jpg",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "alt": "SK하이닉스 HBM 패키지와 메모리 다이의 공식 제품 이미지",
      "caption": "SK하이닉스 HBM 패키지와 메모리 다이 · 공식 이미지",
      "credit": "© SK hynix"
    }
  },
  "asml": {
    "logo": {
      "sha256": "8f0586bb792efce6e216d913fd8e9b8bf69f549d0c929555bf08b7b59c9ce44d",
      "bytes": 880,
      "contentType": "image/svg+xml",
      "src": "/assets/companies/asml/logo.svg",
      "sourceUrl": "https://www.asml.com/en/company/about-asml",
      "assetUrl": "https://www.asml.com/images/icons/asml-logo.svg",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "tone": "light",
      "credit": "© ASML",
      "symbolId": "logo",
      "width": 108,
      "height": 30
    },
    "image": {
      "width": 1920,
      "height": 1284,
      "sha256": "80da6a76908dc56bd1acb7c3c6a0cc3001686d2619d405abdfea8d08073f854b",
      "bytes": 288039,
      "contentType": "image/jpeg",
      "src": "/assets/companies/asml/image.jpg",
      "sourceUrl": "https://www.asml.com/en/company/about-asml",
      "assetUrl": "https://edge.sitecorecloud.io/asmlnetherlaaea-asmlcom-prd-5369/media/project/asmlcom/asmlcom/asml/images/technology/cleanroom/47006-cleanroom-assembly.jpg?h=1284&iar=0&w=1920",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "alt": "방진복을 입은 작업자들이 ASML 클린룸에서 장비를 조립하는 모습",
      "caption": "ASML 클린룸의 조립 현장 · 공식 사진",
      "credit": "© ASML"
    }
  },
  "synopsys": {
    "logo": {
      "width": 166,
      "height": 36,
      "sha256": "485774034f99d083a44a4a4e11824d84e83ae08b60548d54cdf16f99fd3f79ee",
      "bytes": 2199,
      "contentType": "image/svg+xml",
      "src": "/assets/companies/synopsys/logo.svg",
      "sourceUrl": "https://www.synopsys.com/company.html",
      "assetUrl": "https://www.synopsys.com/company.html",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "tone": "light",
      "credit": "© Synopsys"
    },
    "image": {
      "width": 1705,
      "height": 1126,
      "sha256": "a811b6107e91953d79a88ff50755cd4b5fded6fd904aee37bbb8f68a2bdfc704",
      "bytes": 732987,
      "contentType": "image/jpeg",
      "src": "/assets/companies/synopsys/image.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Synopsys_campus_building_-_Hillsboro,_Oregon.JPG",
      "assetUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Synopsys_campus_building_-_Hillsboro%2C_Oregon.JPG",
      "origin": "public-commons",
      "checkedAt": "2026-10-25",
      "alt": "미국 오리건주 힐즈버러의 시놉시스 캠퍼스 건물",
      "caption": "시놉시스 미국 힐즈버러 캠퍼스 · 2009년",
      "credit": "M. O. Stevens",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
    }
  },
  "sumco": {
    "logo": {
      "width": 1200,
      "height": 453,
      "sha256": "483a271ddf6da423a02bd744e42e30e371df50f213d6a2edc6b26bd2c1568d52",
      "bytes": 23308,
      "contentType": "image/webp",
      "src": "/assets/companies/sumco/logo.webp",
      "sourceUrl": "https://www.sumcosi.com/english/aboutus/",
      "assetUrl": "https://www.sumcosi.com/common/img/logo_sumco.webp",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "tone": "light",
      "credit": "© SUMCO"
    },
    "image": {
      "width": 350,
      "height": 130,
      "sha256": "e4b1e47b70df79dabe3633dbe1e5302f94401d8e4d3bda8c457dce4e8455e542",
      "bytes": 3246,
      "contentType": "image/webp",
      "src": "/assets/companies/sumco/image.webp",
      "sourceUrl": "https://www.sumcosi.com/english/products/lineup.html",
      "assetUrl": "https://www.sumcosi.com/english/images/products/lineup/lineup-img_02.webp",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "alt": "SUMCO 공식 제품 자료의 실리콘 웨이퍼",
      "caption": "SUMCO 실리콘 웨이퍼 · 공식 제품 이미지",
      "credit": "© SUMCO"
    }
  },
  "ase": {
    "logo": {
      "width": 600,
      "height": 300,
      "sha256": "b7b5c8c735f87fa2111310360e0a1a80a5a2892e843544822e9351951285d1e3",
      "bytes": 22489,
      "contentType": "image/png",
      "src": "/assets/companies/ase/logo.png",
      "sourceUrl": "https://www.aseglobal.com/",
      "assetUrl": "https://cdn.prod.website-files.com/6a4c7cf038139cd8999ff317/6a4c7cf038139cd8999ff343_ASE_logo.png",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "tone": "light",
      "credit": "© ASE"
    },
    "image": {
      "width": 351,
      "height": 210,
      "sha256": "72dfb2f1bd4c6ec82cf9fe84fc5a44bbf05ba2304f2e801f53df650d31a4be58",
      "bytes": 63076,
      "contentType": "image/png",
      "src": "/assets/companies/ase/image.png",
      "sourceUrl": "https://www.aseglobal.com/",
      "assetUrl": "https://cdn.prod.website-files.com/6a4c7cf038139cd8999ff310/6aceef1e1ef5489c8f28b5b3_ASE_PowerSiP.png",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "alt": "전력 모듈과 기판, 접합부를 보여주는 ASE powerSiP 패키징 구조 이미지",
      "caption": "ASE powerSiP 패키징 구조 · 공식 기술 이미지",
      "credit": "© ASE"
    }
  },
  "applied-materials": {
    "logo": {
      "width": 618,
      "height": 198,
      "sha256": "57e8e8c621273892ed8bd39caa6ffd36a8b435d88f0c71019f4e2599b6eae946",
      "bytes": 6461,
      "contentType": "image/png",
      "src": "/assets/companies/applied-materials/logo.png",
      "sourceUrl": "https://www.appliedmaterials.com/us/en/newsroom/media-kit-digital-assets.html",
      "assetUrl": "https://www.appliedmaterials.com/content/dam/site/company/news/img/newsroom/2026/media-kit/APPLIED_Impact_Logo_blue.png",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "tone": "light",
      "credit": "© Applied Materials"
    },
    "image": {
      "width": 1920,
      "height": 1080,
      "sha256": "9bd7044e87a3060ffc4092768bd7d56d644744ca7ad8fa7fc2b8df96d35148f5",
      "bytes": 202481,
      "contentType": "image/jpeg",
      "src": "/assets/companies/applied-materials/image.jpg",
      "sourceUrl": "https://www.appliedmaterials.com/us/en/newsroom/media-kit-digital-assets.html",
      "assetUrl": "https://www.appliedmaterials.com/content/dam/site/company/news/img/newsroom/2025/2025-08/aug-6/Applied%20Materials_Austin%20Manufacturing.jpg",
      "origin": "official",
      "checkedAt": "2026-10-25",
      "alt": "어플라이드머티어리얼즈 오스틴 제조 시설에서 장비를 조립하는 작업자들",
      "caption": "어플라이드머티어리얼즈 오스틴 제조 시설 · 공식 사진",
      "credit": "© Applied Materials"
    }
  }
}, expandedCompanyMedia);
