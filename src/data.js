// Pastel colours by discipline (bg/fg for UI, argb for Excel)
export const DISC = {
  Physics:{bg:'#dbeafe',fg:'#1e40af',argb:'FFDBEAFE'},
  Chemistry:{bg:'#fef3c7',fg:'#92400e',argb:'FFFEF3C7'},
  Biology:{bg:'#dcfce7',fg:'#166534',argb:'FFDCFCE7'},
  'Earth & Space':{bg:'#fce7f3',fg:'#9d174d',argb:'FFFCE7F3'},
  Inquiry:{bg:'#e5e7eb',fg:'#374151',argb:'FFE5E7EB'},
}
export const CAT_TYPES=['Test','Practical Investigation','Research Task','Project','Presentation']
export const ROLES=['Creator','Reviewer','Support']

// Victorian Curriculum 2.0 Science (abridged wording; code, strand, discipline). Add more rows as needed.
export const CURRICULUM = [
 ['VC2S8U01','Understanding','Biology','Classification, dichotomous keys, diversity of life'],
 ['VC2S8U02','Understanding','Biology','Cell theory; unicellular/multicellular; organelles'],
 ['VC2S8U03','Understanding','Biology','Cells, tissues, organs in plant and animal organ systems'],
 ['VC2S8U04','Understanding','Biology','Matter/energy flow in ecosystems; food webs & pyramids; biotic/abiotic factors'],
 ['VC2S8U05','Understanding','Chemistry','Particle & kinetic theories; properties of states of matter'],
 ['VC2S8U06','Understanding','Chemistry','Pure substances & mixtures; separation techniques'],
 ['VC2S8U07','Understanding','Chemistry','Atomic theory; elements, compounds, symbols & formulas'],
 ['VC2S8U08','Understanding','Chemistry','Physical vs chemical change; gas tests; precipitates'],
 ['VC2S8U09','Understanding','Earth & Space','Renewable/non-renewable resources; sustainability'],
 ['VC2S8U10','Understanding','Earth & Space','Plate tectonics, plate boundaries, evidence'],
 ['VC2S8U11','Understanding','Earth & Space','Rock cycle, rock properties, mining methods'],
 ['VC2S8U12','Understanding','Earth & Space','Sun-Earth-Moon cycles: eclipses, seasons, tides'],
 ['VC2S8U13','Understanding','Physics','Simple machines alter direction & magnitude of forces'],
 ['VC2S8U14','Understanding','Physics','Balanced/unbalanced forces; force diagrams; motion'],
 ['VC2S8U15','Understanding','Physics','Energy forms, transfers, transformations, efficiency'],
 ['VC2S8U16','Understanding','Physics','Household energy consumption; energy audit'],
 ['VC2S8U17','Understanding','Physics','Electrical circuits; voltage and current'],
 ['VC2S8H01','Human Endeavour','Inquiry','Scientific knowledge, models and theories can change'],
 ['VC2S8H02','Human Endeavour','Inquiry','Multidisciplinary endeavours; different perspectives'],
 ['VC2S8H03','Human Endeavour','Inquiry','Scientific responses to socio-scientific issues'],
 ['VC2S8H04','Human Endeavour','Inquiry','Communication of science informs viewpoints & policy'],
 ['VC2S8I01','Inquiry','Inquiry','Questioning and predicting'],
 ['VC2S8I02','Inquiry','Inquiry','Planning and conducting investigations; variables; risk'],
 ['VC2S8I03','Inquiry','Inquiry','Selecting and using equipment; precision'],
 ['VC2S8I04','Inquiry','Inquiry','Organising and processing data; representations'],
 ['VC2S8I05','Inquiry','Inquiry','Analysing patterns, trends, anomalies'],
 ['VC2S8I06','Inquiry','Inquiry','Analysing methods, claims, sources of error'],
 ['VC2S8I07','Inquiry','Inquiry','Evidence-based arguments; ethical use of secondary data'],
 ['VC2S8I08','Inquiry','Inquiry','Communicating ideas, findings and arguments'],
 ['VC2S10U01','Understanding','Biology','Reproductive cells/organs; sexual & asexual reproduction'],
 ['VC2S10U02','Understanding','Biology','Nervous & endocrine systems; homeostasis'],
 ['VC2S10U03','Understanding','Biology','Infectious/non-infectious disease; controlling transmission'],
 ['VC2S10U04','Understanding','Biology','Genetic inheritance; DNA, alleles, Mendelian crosses'],
 ['VC2S10U05','Understanding','Biology','Evolution by natural selection; evidence'],
 ['VC2S10U06','Understanding','Chemistry','Atomic models; radioactive decay'],
 ['VC2S10U07','Understanding','Chemistry','Periodic table patterns and trends'],
 ['VC2S10U08','Understanding','Chemistry','Conservation of mass; balanced equations'],
 ['VC2S10U09','Understanding','Chemistry','Reaction types; exo/endothermic; reaction rates'],
 ['VC2S10U10','Understanding','Earth & Space','Carbon cycle and Earth systems'],
 ['VC2S10U11','Understanding','Earth & Space','Climate change dynamics and mitigation'],
 ['VC2S10U12','Understanding','Earth & Space','Space exploration'],
 ['VC2S10U13','Understanding','Earth & Space','Universe features; Big Bang theory'],
 ['VC2S10U14','Understanding','Physics','Wave and particle models; EM & mechanical waves'],
 ['VC2S10U15','Understanding','Physics','Conservation of energy; efficiency'],
 ['VC2S10U16','Understanding','Physics','Generating AC/DC electricity'],
 ['VC2S10U17','Understanding','Physics','Newton\u2019s laws; force, mass, acceleration'],
].map(([code,strand,disc,text])=>({code,strand,disc,text}))

export const DEFAULT_TERMS=[
 {id:'t1',name:'Term 1',weeks:11,blocks:{6:'Step-Up'}},
 {id:'t2',name:'Term 2',weeks:10,blocks:{9:'Camp'}},
 {id:'t3',name:'Term 3',weeks:10,blocks:{10:'Exams'}},
 {id:'t4',name:'Term 4',weeks:9,blocks:{}},
]
export const DEFAULT_UNITS=[
 {id:'u1',name:'Mixtures',disc:'Chemistry',weeks:4,codes:['VC2S8U06']},
 {id:'u2',name:'States of Matter',disc:'Chemistry',weeks:4,codes:['VC2S8U05']},
 {id:'u3',name:'Forces',disc:'Physics',weeks:3,codes:['VC2S8U13','VC2S8U14']},
 {id:'u4',name:'Energy',disc:'Physics',weeks:4,codes:['VC2S8U15']},
 {id:'u5',name:'Food Chains & Food Webs',disc:'Biology',weeks:4,codes:['VC2S8U04']},
 {id:'u6',name:'Classification & Biodiversity',disc:'Biology',weeks:4,codes:['VC2S8U01']},
 {id:'u7',name:'Active Earth',disc:'Earth & Space',weeks:5,codes:['VC2S8U10','VC2S8U11']},
 {id:'u8',name:'Our Place in Space',disc:'Earth & Space',weeks:4,codes:['VC2S8U12']},
]
const P=(id,unitId,start,len,staff,cats=[],miles=[])=>({id,unitId,start,len,staff,cats,miles,codes:null})
export const DEFAULT_PLANS={
 'Year 7':[P('p1','u1',0,4,'A. Nguyen',[{name:'Mixtures Test',type:'Test',role:'Creator',week:4}],[{name:'Workbook check',week:2}]),
           P('p2','u2',4,4,'J. Smith',[{name:'Separation Practical',type:'Practical Investigation',role:'Reviewer',week:8}],[])],
 'Year 8':[P('p3','u4',0,4,'R. Patel',[{name:'Energy Test',type:'Test',role:'Creator',week:4}],[{name:'Excursion: Scienceworks',week:2}])],
 'Year 9':[P('p4','u5',0,4,'M. Lee',[{name:'Ecosystems Research Task',type:'Research Task',role:'Support',week:4}],[])],
}
export const buildWeeks=terms=>{const w=[];terms.forEach((t,ti)=>{for(let i=1;i<=t.weeks;i++)w.push({gi:w.length,term:ti,w:i,block:t.blocks?.[i]||null,tid:t.id??ti})});return w}

export const LEVELS=['Levels 7 & 8','Levels 9 & 10']
export const AREAS=['Biological sciences','Chemical sciences','Earth and space sciences','Physical sciences','Science as a Human Endeavour','Science Inquiry']
export const levelOf=code=>code.startsWith('VC2S10')?LEVELS[1]:LEVELS[0]
const A={Biology:AREAS[0],Chemistry:AREAS[1],'Earth & Space':AREAS[2],Physics:AREAS[3]}
export const areaOf=c=>c.strand==='Human Endeavour'?AREAS[4]:c.strand==='Inquiry'?AREAS[5]:A[c.disc]

// Keep a unit in the same term/week when terms are added, removed or reordered
export const remap=(oldW,newW,p)=>{const f=gi=>{const o=oldW[Math.min(gi,oldW.length-1)];if(!o)return -1
  const m=newW.filter(x=>x.tid===o.tid);if(!m.length)return -1;return (m.find(x=>x.w===o.w)||m[m.length-1]).gi}
  let s=f(p.start),e=f(p.start+p.len-1);if(s<0)s=Math.min(p.start,newW.length-1);if(e<s)e=Math.min(s+p.len-1,newW.length-1)
  return {...p,start:s,len:Math.max(1,e-s+1)}}
