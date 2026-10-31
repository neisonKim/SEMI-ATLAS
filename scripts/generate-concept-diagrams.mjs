import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { conceptExplanations } from '../lib/concept-explanations.mjs';

const C = { ink: '#18394f', muted: '#425d70', cyan: '#076171', pale: '#d9f1f3', blue: '#b9d7e8', amber: '#8b471b', gold: '#f5d5ad', line: '#adc6d3', substrate: '#dfe8ed', white: '#ffffff', green: '#e3f2e9' };
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const R = (x,y,w,h,fill=C.white,stroke=C.line,rx=6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
const T = (x,y,text,size=15,fill=C.ink,weight=500,anchor='middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${fill}" font-weight="${weight}">${esc(text)}</text>`;
const L = (x1,y1,x2,y2,color=C.ink,width=2,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const P = (d,color=C.ink,width=2,fill='none',extra='') => `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const A = (x1,y1,x2,y2,color='cyan',width=2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C[color]}" stroke-width="${width}" marker-end="url(#arrow-${color})"/>`;
const AP = (d,color='cyan') => P(d,C[color],2,'none',`marker-end="url(#arrow-${color})"`);
const O = (x,y,r=4,fill=C.cyan) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const B = (x,y,w,h,title,sub='',fill=C.pale) => R(x,y,w,h,fill)+T(x+w/2,y+(sub ? 27 : h/2+6),title,16,C.ink,700)+(sub ? T(x+w/2,y+49,sub,14,C.muted) : '');
const base = (y,label='실리콘 기판',h=55) => R(30,y,300,h,C.substrate,C.line,2)+T(180,y+h/2+5,label,15);
const pins = (x,y,w,h) => Array.from({length:5},(_,i)=>L(x+12+i*(w-24)/4,y-7,x+12+i*(w-24)/4,y)+L(x+12+i*(w-24)/4,y+h,x+12+i*(w-24)/4,y+h+7)).join('');
const chip = (x,y,w,h,label,fill=C.blue) => pins(x,y,w,h)+R(x,y,w,h,fill,C.cyan,4)+T(x+w/2,y+h/2+5,label,15,C.ink,700);
const dots = (xs,y,color=C.amber,r=4) => xs.map(x=>O(x,y,r,color)).join('');
const renderers = {};

renderers.semiconductor = () => {
  let s = B(70,20,220,90,'반도체 재료','전기적 성질을 조절');
  for(let y=83;y<=95;y+=12) s+=dots([105,135,165,195,225,255],y,C.cyan,2.5);
  s+=A(180,115,180,149)+R(70,160,220,100,C.white)+T(180,184,'전류 제어 소자',16,C.ink,700);
  s+=A(34,218,108,218)+T(43,199,'입력',14)+L(116,215,154,215)+L(154,207,154,226,C.amber,3)+L(165,215,236,215)+A(239,215,315,215)+T(302,195,'출력',14);
  s+=A(180,268,180,303)+chip(90,318,180,68,'연결된 회로')+T(180,409,'소자와 배선이 기능을 만듭니다',14,C.muted);
  return s;
};
renderers.conductors = () => {
  let s='';
  [['도체',40],['절연체',163],['반도체',286]].forEach(([label,y],i)=>{
    s+=R(20,y,320,96,C.white)+T(48,y+25,label,16,C.ink,700,'start');
    if(i===0) s+=A(47,y+62,108,y+62)+P(`M110 ${y+62} l10 -9 l12 18 l12 -18 l12 18 l12 -18 l10 9`)+A(181,y+62,306,y+62)+T(259,y+28,'전달 경로',14,C.cyan);
    if(i===1) s+=L(47,y+62,146,y+62)+R(147,y+39,24,44,C.gold,C.amber,1)+L(174,y+62,306,y+62)+T(257,y+28,'원치 않는 이동 억제',14,C.muted);
    if(i===2) s+=A(47,y+62,141,y+62)+R(148,y+46,42,32,C.pale,C.cyan,3)+A(194,y+62,306,y+62)+A(169,y+12,169,y+40,'amber')+T(258,y+28,'입력으로 제어',14,C.cyan);
  });
  return s+T(180,407,'실제 저항·누설은 조건에 따라 달라집니다',14,C.muted);
};
renderers.silicon = () => {
  let s=T(180,28,'① 고순도 실리콘·단결정',16,C.ink,700);
  for(let row=0;row<3;row++)for(let col=0;col<6;col++){const x=90+col*36,y=51+row*27;if(col<5)s+=L(x,y,x+36,y,C.line);if(row<2)s+=L(x,y,x,y+27,C.line);s+=O(x,y,5,C.cyan);}
  s+=A(180,119,180,147)+T(180,172,'② 단결정 잉곳',16,C.ink,700)+R(111,198,138,72,C.blue,C.cyan,1)+`<ellipse cx="180" cy="198" rx="69" ry="18" fill="${C.pale}" stroke="${C.cyan}" stroke-width="1.5"/><path d="M111 270 A69 18 0 0 0 249 270" fill="${C.blue}" stroke="${C.cyan}" stroke-width="1.5"/>`;
  s+=A(180,295,180,322)+`<ellipse cx="180" cy="359" rx="77" ry="24" fill="${C.pale}" stroke="${C.cyan}" stroke-width="2"/>`+T(180,407,'③ 절단·표면 가공한 웨이퍼',16,C.ink,700);return s;
};
renderers.wafer = () => {
  let s='<defs><clipPath id="wafer-area"><circle cx="180" cy="142" r="109"/></clipPath></defs>'+T(180,22,'한 장에서 여러 다이를 함께 가공',16,C.ink,700)+`<circle cx="180" cy="142" r="109" fill="${C.blue}" stroke="${C.cyan}" stroke-width="2"/>`+'<g clip-path="url(#wafer-area)">';
  for(let x=60;x<300;x+=30)for(let y=32;y<260;y+=30)s+=R(x+2,y+2,25,25,C.pale,C.white,1);
  s+='</g>'+R(152,124,25,25,C.gold,C.amber,1)+P('M180 248 l-8 7 h16 Z',C.white,1,C.white)+AP('M165 151 V285 H180 V310')+T(245,287,'분리',15,C.cyan)+chip(129,326,102,57,'개별 다이')+T(180,410,'격자 수는 생산량 계산용이 아닙니다',14,C.muted);return s;
};
renderers.transistor = () => T(180,33,'입력으로 다른 전류를 제어',17,C.ink,700)+B(80,65,200,56,'제어 입력')+A(180,125,180,161,'amber')+R(96,169,168,111,C.pale,C.cyan)+T(180,198,'전류 제어부',16,C.ink,700)+A(18,242,112,242)+L(124,242,170,242)+L(170,242,200,222,C.amber,3)+L(205,242,251,242)+A(265,242,341,242)+T(42,221,'전류',14,C.cyan)+T(313,221,'출력',14,C.cyan)+A(180,288,180,323)+chip(80,340,200,53,'여러 소자 → 논리 기능');
renderers.mosfet = () => {
  let s=T(180,28,'켜진 평면 nMOS의 단순화',16,C.ink,700)+R(30,198,300,119,C.substrate,C.line,2)+R(53,198,72,42,C.blue,C.cyan,1)+R(235,198,72,42,C.blue,C.cyan,1)+R(126,190,108,8,C.gold,C.amber,0)+R(133,148,94,42,C.cyan,C.cyan,2);
  s+=L(89,198,89,136)+L(271,198,271,136)+L(180,153,180,93)+T(89,121,'소스 S',15,C.ink,700)+T(271,121,'드레인 D',15,C.ink,700)+T(180,78,'게이트 G',15,C.ink,700)+T(89,224,'n+',15)+T(271,224,'n+',15)+T(180,295,'p형 바디',16);
  s+=L(125,205,235,205,C.cyan,5)+A(168,190,168,211,'amber',1.5)+A(193,190,193,211,'amber',1.5)+P('M233 193 H317 V169',C.amber,1.2)+T(314,158,'절연막',14,C.amber)+P('M181 208 V253',C.cyan,1.2)+T(180,272,'채널',15,C.cyan)+A(265,346,95,346)+T(180,372,'관례적 전류 방향 D → S',15,C.cyan)+T(180,404,'게이트 전기장이 채널을 제어',15,C.muted);return s;
};
renderers['logic-memory'] = () => B(62,28,236,76,'CPU·GPU','계산·제어')+A(167,112,167,151)+A(193,153,193,114)+T(249,139,'데이터',14,C.cyan)+B(62,164,236,76,'DRAM','작업용·휘발성')+A(167,247,167,286)+A(193,288,193,249)+B(62,299,236,76,'NAND 기반 저장장치','저장용·비휘발성')+T(180,407,'캐시·컨트롤러 등은 생략한 관계도',14,C.muted);
renderers.cpu = () => B(75,20,240,66,'캐시·메모리','명령과 데이터를 공급')+A(195,93,195,121)+R(65,130,260,206,C.white,C.line)+T(195,154,'CPU의 개념적 실행',15,C.ink,700)+B(100,170,190,40,'가져오기')+A(195,215,195,234)+B(100,242,190,40,'해석·실행')+A(195,289,195,337)+B(75,344,240,55,'결과·다음 명령')+AP('M72 371 H32 V54 H68')+T(37,250,'반복',14,C.cyan);
renderers.gpu = () => {
  let s=T(180,28,'작업을 여러 조각으로 나누기',16,C.ink,700)+[40,110,180,250].map(x=>R(x,48,54,28,C.gold,C.amber,3)).join('')+A(180,82,180,115)+R(28,126,304,142,C.white,C.line)+T(180,151,'병렬 연산 자원',16,C.ink,700);
  for(let r=0;r<3;r++)for(let c=0;c<6;c++)s+=R(49+c*44,168+r*28,30,18,C.pale,C.cyan,2);
  for(let x=82;x<=278;x+=49)s+=A(x,317,x,280);
  s+=B(38,328,284,66,'메모리·데이터 공급','연산 자원이 함께 사용')+T(180,414,'격자 수 ≠ 실제 코어 수',14,C.muted);return s;
};
renderers.dram = () => {
  let s=T(180,28,'대표적인 1T1C 셀',17,C.ink,700)+T(82,75,'비트라인',15,C.cyan)+L(82,90,82,307,C.cyan,3)+T(253,85,'워드라인',15,C.amber)+L(168,104,311,104,C.amber,2.5)+L(168,104,168,158,C.amber,2.5)+L(145,158,192,158,C.amber,3);
  s+=L(82,185,140,185,C.cyan)+L(140,185,140,168,C.cyan)+L(140,168,196,168,C.cyan,3)+L(196,168,196,185,C.cyan)+L(196,185,269,185,C.cyan)+O(82,185,3,C.cyan)+L(269,185,269,229,C.cyan)+L(246,229,292,229,C.cyan,3)+L(246,241,292,241,C.cyan,3)+L(269,241,269,272,C.cyan)+L(252,272,286,272,C.cyan);
  s+=T(167,213,'접근 트랜지스터',14)+T(261,313,'저장 커패시터',14)+T(270,336,'기준 전극에 연결',14,C.muted)+B(38,347,165,57,'감지·쓰기 회로')+L(82,307,82,347,C.cyan,3)+AP('M44 375 H20 V145 H72')+T(169,423,'감지 후 복원·주기적 리프레시',14,C.muted);return s;
};
renderers.nand = () => {
  let s=T(180,29,'동작 단위의 계층',17,C.ink,700)+R(28,54,304,272,C.white,C.cyan)+T(65,81,'블록',16,C.ink,700);
  for(let row=0;row<3;row++){const y=97+row*68;s+=R(45,y,270,55,C.pale,C.line,3)+T(75,y+21,`페이지 ${row+1}`,14,C.cyan,600,'start');for(let col=0;col<8;col++)s+=R(67+col*28,y+32,17,13,C.gold,C.amber,2);}
  return s+T(180,354,'읽기·프로그램 → 페이지',16,C.cyan,700)+T(180,383,'지우기 → 블록',16,C.amber,700)+T(180,410,'작은 칸은 셀을 뜻하는 기호',14,C.muted);
};
renderers.fabrication = () => B(22,33,140,70,'막 형성','재료 쌓기')+B(198,135,140,70,'노광','패턴 정의')+B(198,324,140,70,'식각','선택적 제거')+B(22,324,140,70,'세정','오염 저감')+B(22,135,140,70,'검사·계측','상태 확인',C.gold)+AP('M164 67 H268 V125')+A(268,213,268,313)+A(189,359,171,359)+AP('M91 313 V214')+AP('M91 126 V112')+P('M163 170 H188 V286 H198',C.muted,1.5,'none','stroke-dasharray="5 4"')+T(180,250,'층·구조에 맞춰 반복',15,C.cyan,700)+T(180,426,'이온주입·열처리·CMP 등도 조합',14,C.muted);
renderers.oxidation = () => T(180,29,'① 산화 전',16,C.ink,700)+base(67,'실리콘',67)+L(30,67,330,67,C.amber,2,'5 4')+T(180,165,'산소·수증기 등의 분위기',15,C.cyan)+A(127,176,127,206)+A(233,176,233,206)+T(180,237,'② 열산화 후',16,C.ink,700)+R(30,275,300,63,C.gold,C.amber,1)+R(30,338,300,61,C.substrate,C.line,1)+L(20,307,340,307,C.ink,1.5,'5 4')+T(180,296,'산화막 SiO₂',16,C.amber,700)+T(180,330,'점선: 원래 실리콘 표면',14,C.ink)+T(180,374,'일부 실리콘이 소비됨',15)+P('M20 308 V66 H29',C.muted,1,'none','stroke-dasharray="3 5"');
renderers.lithography = () => T(180,26,'① 감광재 도포',16,C.ink,700)+base(68,'가공할 막·기판',39)+R(30,53,300,15,C.gold,C.amber,1)+T(180,140,'② 빛으로 패턴 정보 전달',16,C.ink,700)+R(65,164,230,13,C.ink,C.ink,1)+R(136,164,88,13,C.white,C.white,0)+A(165,182,165,211,'amber')+A(196,182,196,211,'amber')+R(30,220,300,15,C.gold,C.amber,1)+base(235,'아래 재료는 아직 가공 전',39)+T(180,316,'③ 현상한 감광재 패턴',16,C.ink,700)+base(361,'후속 식각·이온주입 등에 활용',43)+R(30,343,92,18,C.gold,C.amber,1)+R(238,343,92,18,C.gold,C.amber,1)+T(180,437,'남는 영역은 감광재 종류에 따라 다름',14,C.muted);
renderers['euv-duv'] = () => {
  let s=R(20,20,320,168,C.white)+T(180,50,'ArF DUV · 193 nm 예시',16,C.ink,700)+A(48,113,124,113,'amber')+`<ellipse cx="150" cy="113" rx="13" ry="40" fill="${C.pale}" stroke="${C.cyan}" stroke-width="2"/>`+A(166,113,278,113,'amber')+L(290,78,290,150,C.ink,5)+T(150,171,'렌즈 중심 광학계',15,C.cyan);
  s+=R(20,210,320,190,C.pale)+T(180,240,'EUV · 약 13.5 nm',16,C.ink,700)+P('M48 283 H119 L209 340 H290',C.amber,2,'none','marker-end="url(#arrow-amber)"')+L(111,291,129,272,C.ink,5)+L(201,348,219,330,C.ink,5)+L(298,307,298,366,C.ink,5)+T(180,384,'진공 환경 · 반사 미러',15,C.cyan);return s;
};
renderers.etching = () => T(180,29,'① 노출된 막과 보호 마스크',16,C.ink,700)+base(123,'아래층',47)+R(30,96,300,27,C.blue,C.cyan,1)+R(30,78,92,18,C.gold,C.amber,1)+R(238,78,92,18,C.gold,C.amber,1)+A(154,53,154,88,'amber')+A(202,53,202,88,'amber')+A(180,185,180,220)+T(180,249,'② 노출 영역을 제거한 예시',16,C.ink,700)+base(337,'아래층·선택비도 관리',48)+R(30,310,92,27,C.blue,C.cyan,1)+R(238,310,92,27,C.blue,C.cyan,1)+R(30,292,92,18,C.gold,C.amber,1)+R(238,292,92,18,C.gold,C.amber,1)+T(180,328,'제거',15,C.amber)+T(180,414,'형상·균일도·손상을 함께 확인',14,C.muted);
renderers.deposition = () => T(180,29,'원료를 표면으로 공급',17,C.ink,700)+dots([77,125,174,222,270],76,C.amber,6)+dots([105,201,295],115,C.amber,5)+[90,180,270].map(x=>A(x,142,x,189,'amber')).join('')+R(30,218,300,24,C.pale,C.cyan,1)+base(242,'기판',83)+T(180,211,'새로 형성되는 박막',16,C.cyan,700)+T(180,365,'두께·조성·균일도·결함 관리',15)+T(180,403,'실제 덮이는 모양은 방법마다 다릅니다',14,C.muted);
renderers.cvd = () => R(30,82,300,257,C.white,C.line)+T(180,28,'기체 공급 → 표면 반응 → 배출',16,C.ink,700)+T(123,66,'원료 기체',15,C.amber)+A(124,72,124,133,'amber')+dots([90,133,179,221,266],159,C.amber,5)+dots([112,168,235],195,C.cyan,4)+A(181,186,181,227)+R(63,241,234,13,C.pale,C.cyan,1)+R(63,254,234,30,C.substrate,C.line,1)+T(180,310,'기판 · 열 공급',15)+AP('M293 202 H343 V148','amber')+T(295,137,'부산물',14,C.amber)+T(180,375,'화학 반응으로 고체 막 형성',16,C.cyan,700)+T(180,406,'가스 분배·장비 상세는 생략',14,C.muted);
renderers.ald = () => {
  let s='';const ys=[28,137,246,355];
  ys.forEach((y,i)=>{s+=T(195,y+10,['① 원료 A 공급','② 퍼지','③ 원료 B 반응','④ 퍼지'][i],16,C.ink,700)+R(75,y+65,240,19,C.substrate,C.line,1);if(i<2)s+=dots([98,137,176,215,254,293],y+60,C.amber,4);else s+=R(75,y+58,240,7,C.pale,C.cyan,0);if(i===0)s+=dots([115,190,265],y+35,C.amber,4);if(i===2)s+=dots([115,190,265],y+35,C.cyan,4);if(i===1||i===3)s+=A(270,y+40,324,y+40,'amber');if(i<3)s+=A(195,y+88,195,y+102);});
  return s+AP('M68 425 H31 V49 H64')+T(180,468,'표면 상태를 바꾸며 주기를 반복',14,C.muted);
};
renderers['ion-implantation'] = () => T(180,28,'선택한 이온을 가속해 주입',16,C.ink,700)+dots([151,180,209],65,C.amber,5)+[151,180,209].map(x=>A(x,82,x,130,'amber')).join('')+R(30,145,300,135,C.substrate,C.line,1)+R(30,131,91,14,C.gold,C.amber,1)+R(239,131,91,14,C.gold,C.amber,1)+[[145,173],[180,183],[218,193],[153,215],[195,225],[171,245],[223,233]].map(([x,y])=>O(x,y,4,C.cyan)).join('')+T(180,305,'에너지: 깊이·분포',15,C.cyan)+T(180,331,'도즈: 면적당 주입량',15,C.amber)+A(180,342,180,360)+B(30,368,300,39,'열처리 · 손상 회복·활성화');
renderers.cmp = () => T(180,28,'패드와 웨이퍼의 상대 운동',16,C.ink,700)+R(38,70,284,37,C.substrate,C.line,2)+T(180,95,'연마 패드',16)+A(82,53,278,53)+dots([81,141,201,261],126,C.cyan,4)+T(180,152,'슬러리',14,C.cyan)+P('M38 236 V190 H98 V174 H157 V203 H215 V185 H279 V195 H322 V236 Z',C.cyan,1.5,C.blue)+T(180,226,'웨이퍼의 높낮이',15)+A(180,253,180,282)+T(180,310,'평탄화 목표',16,C.ink,700)+R(38,334,284,53,C.blue,C.cyan,1)+L(38,334,322,334,C.cyan,3)+T(180,412,'디싱·침식·재료별 제거율도 관리',14,C.muted);
renderers.cleaning = () => {
  let s=T(180,28,'① 입자·유기물·금속 오염 등',16,C.ink,700)+base(106,'표면·재료',51)+dots([64,128,243,287],101,C.amber,6)+P('M170 106 Q174 82 195 91 Q218 85 221 106 Z',C.amber,1,C.gold)+A(180,176,180,211)+T(180,241,'② 오염 종류에 맞는 세정',16,C.ink,700)+[91,180,269].map(x=>P(`M${x} 257 q-14 19 0 24 q14 -5 0 -24 Z`,C.cyan,1,C.pale)).join('')+base(308,'손상·잔여물·재오염도 관리',58)+O(289,304,2,C.amber)+T(180,407,'오염 저감 목표 ≠ 오염 0 보증',14,C.muted);return s;
};
renderers.packaging = () => {
  let s=T(180,27,'와이어 본딩 패키지 예시',16,C.ink,700)+R(26,120,308,180,C.green,C.line,19)+R(47,256,266,44,C.blue,C.cyan,2)+chip(117,209,126,40,'다이')+P('M127 210 Q91 143 70 256',C.amber,2.5)+P('M233 210 Q269 143 291 256',C.amber,2.5);
  for(let x=70;x<300;x+=44)s+=O(x,317,7,C.amber)+L(x,300,x,310,C.amber,2);
  s+=A(154,190,154,67,'amber')+A(206,190,206,67,'amber')+T(180,52,'열이 빠져나갈 경로',15,C.amber)+T(180,145,'보호 구조',15,C.ink,600)+T(180,284,'패키지 기판',15)+A(70,332,70,369)+T(180,382,'전기 신호·전원 ↔ 외부 기기',15,C.cyan)+T(180,408,'접합·보호·방열을 함께 설계',14,C.muted);return s;
};
renderers.tsv = () => {
  let s=T(180,28,'실리콘을 관통하는 연결',17,C.ink,700)+R(34,120,292,174,C.substrate,C.line,1)+R(157,118,46,178,C.pale,C.cyan,1)+R(166,118,28,178,C.gold,C.amber,1)+L(180,119,180,83,C.amber,4)+L(102,83,180,83,C.amber,4)+L(180,296,180,333,C.amber,4)+R(162,331,36,13,C.gold,C.amber,3)+B(90,351,180,43,'다른 연결부·다이', '',C.blue);
  s+=T(76,182,'실리콘',15)+P('M200 162 H272 V145',C.cyan,1.3)+T(277,132,'절연층',14,C.cyan)+P('M184 223 H271 V247',C.amber,1.3)+T(276,269,'도체',14,C.amber)+T(92,62,'표면 배선',14,C.amber)+T(263,339,'접합부',14,C.amber)+T(180,415,'표면 배선과 접합도 함께 필요',14,C.muted);return s;
};
function interposerScene(hbm=false) {
  let s=chip(35,152,114,61,'연산 칩')+R(26,278,308,34,C.pale,C.cyan,1)+R(26,354,308,37,C.blue,C.line,1);
  if(hbm){for(let i=0;i<4;i++)s+=R(221,59+i*31,100,23,C.blue,C.cyan,2)+T(271,75+i*31,'DRAM',14);s+=R(218,190,106,29,C.gold,C.amber,2)+T(271,210,'베이스·I/O',14);for(let x of [240,300]){s+=L(x,64,x,190,C.amber,3);for(let y of [86,117,148,179])s+=O(x,y,3,C.amber);}s+=T(180,28,'DRAM 적층·수직 연결·연산 칩',16,C.ink,700)+T(107,115,'TSV·접합부',14,C.amber)+P('M164 111 H199 V117 H237',C.amber,1.3);}
  else{s+=chip(219,152,104,61,'다른 칩')+T(180,28,'칩 사이의 미세한 연결',17,C.ink,700);}
  for(let x of [65,96,128,238,271,304])s+=O(x,230,4,C.amber)+L(x,213,x,278,C.amber,1.5);
  s+=AP('M96 248 V290 H271 V248')+AP('M238 248 V303 H128 V248')+T(180,337,'인터포저',15,C.cyan,700)+T(180,267,'중간 배선',14,C.cyan)+L(180,272,180,281,C.cyan,1.2);
  for(let x of [64,112,250,298])s+=L(x,312,x,354,C.amber,2)+O(x,345,4,C.amber);
  s+=T(180,378,'패키지 기판',15,C.ink,600);
  for(let x=57;x<=310;x+=41)s+=O(x,407,6,C.amber);
  return s;
}
renderers.interposer = () => interposerScene()+T(180,77,'다이·중간 구조·기판을 구분',15,C.muted);
renderers.hbm = () => interposerScene(true)+T(180,442,'적층 수·배선 수는 예시',14,C.muted);
renderers.integration = () => {
  let s=R(18,18,324,182,C.white)+T(180,44,'2.5D · 나란히 놓은 다이',16,C.ink,700)+chip(47,72,112,46,'다이 A')+chip(204,72,112,46,'다이 B')+R(36,142,288,20,C.pale,C.cyan,1)+L(105,125,105,151,C.amber)+L(259,125,259,151,C.amber)+L(105,151,259,151,C.cyan,2)+T(180,187,'중간 배선 구조 예시',14,C.cyan);
  s+=R(18,222,324,203,C.white)+T(180,248,'3D · 위아래로 결합',16,C.ink,700)+chip(96,271,168,44,'상부 다이')+chip(96,337,168,44,'하부 다이')+[120,150,180,210,240].map(x=>L(x,318,x,333,C.amber,3)).join('')+T(180,407,'접합·수직 연결',14,C.amber)+T(180,445,'실제 제품은 두 방식을 함께 쓰기도 함',14,C.muted);return s;
};
renderers.ecosystem = () => {
  let s=B(125,25,210,59,'설계','기능·회로 정의')+B(125,135,210,59,'제조','웨이퍼에 구현')+B(125,245,210,59,'패키징·테스트','연결·동작 확인')+B(125,371,210,59,'시스템','제품에서 사용');
  s+=A(230,90,230,124)+A(230,202,230,234)+A(230,312,230,360)+B(18,25,86,59,'EDA·IP','설계 지원',C.gold)+A(106,56,119,56,'amber')+R(18,135,86,169,C.green,C.line)+T(61,184,'장비',16,C.ink,700)+T(61,212,'소재',16,C.ink,700)+T(61,256,'여러 단계',14,C.muted)+A(108,164,120,164)+A(108,275,120,275)+T(180,471,'한 기업이 여러 역할을 맡을 수도 있어요',14,C.muted);return s;
};
renderers.fabless = () => R(30,20,300,133,C.white,C.cyan)+T(180,49,'팹리스 회사',17,C.ink,700)+B(47,71,126,61,'제품 기획','기능·요구 정의')+B(187,71,126,61,'회로 설계','공정 규칙 고려')+A(180,163,180,193)+B(45,204,270,64,'외부 파운드리','웨이퍼 제조',C.blue)+A(180,278,180,307)+B(45,318,270,64,'패키징·테스트 파트너','연결·검사',C.green)+T(180,410,'역할 분담과 제조 조건의 협업',14,C.muted);
renderers.foundry = () => B(53,18,254,64,'고객의 회로 설계','목표 기능과 레이아웃')+A(180,89,180,114)+B(53,124,254,64,'설계 규칙·공정 협업','만들 수 있는 설계인지 확인',C.gold)+A(180,196,180,219)+R(53,230,254,94,C.white,C.cyan)+T(180,256,'웨이퍼 제조·검사',16,C.ink,700)+[78,120,162,204,246].map(x=>R(x,273,30,24,C.pale,C.cyan,2)).join('')+A(180,331,180,353)+B(35,364,290,41,'제조 결과 → 후속 패키징·테스트');

export function renderConceptDiagram(id) {
  const data = conceptExplanations[id]?.diagram;
  if (!data || !renderers[id]) throw new Error(`Missing diagram ${id}`);
  const arrows=['ink','cyan','amber'].map(color=>`<marker id="arrow-${color}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 L8 4 L0 8 Z" fill="${C[color]}"/></marker>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="${data.height}" viewBox="0 0 360 ${data.height}" role="img" aria-labelledby="diagram-title diagram-desc"><title id="diagram-title">${esc(data.title)}</title><desc id="diagram-desc">${esc(data.alt)}。${esc(data.scope)}</desc><defs>${arrows}</defs><rect width="360" height="${data.height}" fill="#f7fbfc"/><g font-family="Malgun Gothic,Noto Sans KR,Arial,sans-serif">${renderers[id]()}</g></svg>\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const directory = new URL('../public/assets/concept-diagrams/', import.meta.url);
  await mkdir(directory, { recursive: true });
  for (const id of Object.keys(conceptExplanations)) await writeFile(new URL(`${id}.svg`, directory), renderConceptDiagram(id), 'utf8');
  console.log(`Generated ${Object.keys(conceptExplanations).length} original static concept SVG diagrams.`);
}
