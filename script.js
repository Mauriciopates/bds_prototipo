/* =========================================================
   BDS · Blue Digital Store — protótipo de loja
   Proposta de estágio · Maurício Pates (TPSI, IEFP Porto)
   ========================================================= */

/* ---------------------------------------------------------
   MODO DO SITE
   'orcamento' = fase 1 (novembro): lista e pedido de orçamento, sem pagamento online
   'completo'  = fase 2: carrinho com pagamento Viva
   --------------------------------------------------------- */
const MODO='orcamento';
const L_ADD=MODO==='orcamento'?'Adicionar ao orçamento':'Adicionar ao carrinho';
const L_CART=MODO==='orcamento'?'ver pedido':'ver carrinho';

/* ---------------------------------------------------------
   LOGÓTIPO DE EXEMPLO E FOTOGRAFIAS-MODELO
   DEFAULT_LOGO aparece centrado em todos os produtos até o
   cliente carregar o seu. PHOTO usa uma fotografia real como
   modelo: x e y = centro do logótipo (% da imagem),
   w = largura do logótipo (% da imagem). Ajuste à vontade.
   --------------------------------------------------------- */
const DEFAULT_LOGO='img/BDS.png';
const PHOTO={
  // Fotografias-modelo (cor = primeira cor do produto; nas outras cores usa o desenho)
  polo:    {src:'img/modelo-polo.jpg',   x:64, y:35, w:11, color:'#ffffff'},
  tshirt:  {src:'img/modelo-tshirt.jpg', x:50, y:35, w:22, color:'#ffffff'},
  hoodie:  {src:'img/modelo-sweat.jpg',  x:50, y:40, w:22, color:'#111827'},
  cap:     {src:'img/modelo-bone.jpg',   x:46, y:40, w:20, color:'#111827'},
  vest:    {src:'img/modelo-colete.jpg', x:62, y:36, w:11, color:'#111827'},
  shirt:   {src:'img/modelo-camisa.jpg', x:37, y:36, w:11, color:'#ffffff'},
  bottle:  {src:'img/Garrafa_transparente.jpg', x:50, y:60, w:17, color:'#e8f1f8'},
  keychain:{src:'img/Chaveiro_vinilico.png',    x:45, y:58, w:40, color:'#ffffff'}
};
// verifica que fotografias existem na pasta img/ (as que faltam usam o desenho)
const PHOTO_OK=new Set();
for(const id in PHOTO){const im=new Image();im.onload=()=>{PHOTO_OK.add(id);
  if(typeof S!=='undefined'&&S.cfg&&S.cfg.pid===id&&S.is3d&&S.pref3d!==true){S.is3d=false;apply3D();renderBuilder(true)}};im.src=PHOTO[id].src}

/* ---------------------------------------------------------
   VÍDEOS (Reels)
   1. Coloque os ficheiros .mp4 na pasta "videos"
   2. Acrescente uma linha por vídeo na lista abaixo
   3. A hashtag na legenda liga o vídeo ao produto:
      #bds-polo  #bds-tshirt  #bds-sweat  #bds-colete  #bds-camisa  #bds-avental
      #bds-bone  #bds-saco  #bds-tote  #bds-caneca  #bds-garrafa  #bds-caneta
   Opcional: cor:'#111827'  tecnica:'Bordado' | 'DTF' | 'Serigrafia' | 'Laser' | 'UV'
   --------------------------------------------------------- */
const VIDEOS=[
  {src:'videos/reel-1-polos.mp4',       cap:'Polos personalizados para equipas #bds-polo',                    cor:'#facc15', tecnica:'Bordado'},
  {src:'videos/reel-2-coletes.mp4',     cap:'Coletes com a marca à frente e nas costas #bds-colete',         cor:'#111827', tecnica:'DTF'},
  {src:'videos/reel-3-fardamento.mp4',  cap:'Fardamento completo para restauração #bds-camisa',              cor:'#ffffff', tecnica:'Bordado'},
  {src:'videos/reel-4-bones.mp4',       cap:'Bonés bordados com o símbolo da marca #bds-bone',               cor:'#111827', tecnica:'Bordado'},
  {src:'videos/reel-5-tshirts.mp4',     cap:'T-shirts estampadas na prensa, prontas a entregar #bds-tshirt', cor:'#ffffff', tecnica:'DTF'},
  {src:'videos/reel-6-brindes.mp4',     cap:'Brindes personalizados para campanhas #bds-caneca',             cor:'#ffffff', tecnica:'UV'},
];


/* ---------------------------------------------------------
   PROMOÇÕES (quadro do início)
   Cada campanha tem produtos com preço por peça personalizada
   (sem IVA, 1 posição) e quantidade mínima. Opcional: cor:'#hex'. O quadro roda
   sozinho entre produtos e entre campanhas.
   Valores de exemplo: a BDS define os preços reais.
   --------------------------------------------------------- */
const PROMOS=[
  {id:'novembro',nome:'Novembro Lançamento',sub:'5 produtos, 5 preços loucos',inicio:'2026-11-01T00:00:00',fim:'2026-11-30T23:59:59',cor:'#ffc629',
   itens:[{pid:'tshirt',preco:2.99,min:25},{pid:'mug',preco:1.99,min:36},{pid:'bottle',preco:4.99,min:25},{pid:'tote',preco:1.29,min:50},{pid:'keychain',preco:0.59,min:100}]},
  {id:'natal',nome:'Natal Corporativo',sub:'Ofertas para equipas e clientes',inicio:'2026-12-01T00:00:00',fim:'2026-12-20T23:59:59',cor:'#ff3d8b',
   itens:[{pid:'pen',preco:0.69,min:100,cor:'#facc15'},{pid:'cooler',preco:2.99,min:50},{pid:'bottle',preco:5.49,min:25},{pid:'polo',preco:9.90,min:25},{pid:'hoodie',preco:16.90,min:20}]},
  {id:'restauracao',nome:'Fardamento Restauração',sub:'Camisa, avental e boné a preço fechado',inicio:null,fim:null,cor:'#2e8cff',
   itens:[{pid:'shirt',preco:14.90,min:10},{pid:'apron',preco:4.90,min:10},{pid:'cap',preco:3.90,min:25,cor:'#facc15'}]}
];

/* =========================================================
   DADOS
   ========================================================= */
const IMG={logo:'img/logo.webp',polo:'img/polo.webp',polo_full:'img/polo_full.webp',bone:'img/bone.webp',canetas:'img/canetas.webp',colete:'img/colete.webp',colete_costas:'img/colete_costas.webp',sacos:'img/sacos.webp',camisa:'img/camisa.webp',avental:'img/avental.webp',leitoes:'img/leitoes.webp'};

const TECH={
  DTF:       {n:'DTF',            unit:1.50,setup:0, days:3,desc:'cores ilimitadas'},
  Bordado:   {n:'Bordado',        unit:2.80,setup:25,days:6,desc:'premium · durável'},
  Serigrafia:{n:'Serigrafia',     unit:0.90,setup:30,days:7,desc:'grandes tiragens'},
  Laser:     {n:'Gravação laser', unit:1.20,setup:10,days:3,desc:'permanente'},
  UV:        {n:'Impressão UV',   unit:1.40,setup:0, days:3,desc:'full color rígidos'}
};
const TIERS=[{min:1,d:0},{min:25,d:.06},{min:50,d:.1},{min:100,d:.15},{min:250,d:.2},{min:500,d:.24}];
const SIZES=['XS','S','M','L','XL','XXL'];
const CN={'#ffffff':'Branco','#111827':'Preto','#1e3a8a':'Azul marinho','#facc15':'Amarelo','#dc2626':'Vermelho','#15803d':'Verde','#9ca3af':'Cinza','#7f1d1d':'Bordeaux','#dbeafe':'Azul claro','#b8e3d6':'Verde menta','#94a3b8':'Cinza azulado','#f5f0e6':'Cru','#e5e7eb':'Inox','#e8f1f8':'Transparente'};
const TEX=['#ffffff','#111827','#1e3a8a','#facc15','#dc2626','#15803d','#9ca3af'];
const PRODUCTS=[
  {id:'polo',  n:'Polo piqué 210 g',        cat:'Têxteis',    src:'Fornecedor A · API', base:7.90, cores:TEX, techs:['Bordado','DTF'], shape:'polo', sizes:true, img:'polo'},
  {id:'tshirt',n:'T-shirt algodão 150 g',   cat:'Têxteis',    src:'Stock próprio',      base:3.20, cores:TEX, techs:['DTF','Serigrafia','Bordado'], shape:'tshirt', sizes:true},
  {id:'hoodie',n:'Sweat com capuz 280 g',   cat:'Têxteis',    src:'Fornecedor A · API', base:14.50,cores:['#111827','#1e3a8a','#9ca3af','#7f1d1d','#ffffff'], techs:['DTF','Bordado','Serigrafia'], shape:'hoodie', sizes:true},
  {id:'vest',  n:'Colete acolchoado',       cat:'Fardamento', src:'Fornecedor A · API', base:18.90,cores:['#111827','#1e3a8a','#7f1d1d'], techs:['Bordado','DTF'], shape:'vest', sizes:true, img:'colete'},
  {id:'shirt', n:'Camisa de fardamento',    cat:'Fardamento', src:'Fornecedor B · XML', base:12.40,cores:['#ffffff','#dbeafe','#111827'], techs:['Bordado','DTF'], shape:'shirt', sizes:true, img:'camisa'},
  {id:'apron', n:'Avental de cintura',      cat:'Fardamento', src:'Stock próprio',      base:5.60, cores:['#111827','#1e3a8a','#7f1d1d','#ffffff'], techs:['DTF','Bordado','Serigrafia'], shape:'apron', img:'avental'},
  {id:'cap',   n:'Boné 5 painéis',          cat:'Têxteis',    src:'Fornecedor B · XML', base:3.90, cores:['#111827','#ffffff','#1e3a8a','#facc15','#dc2626'], techs:['Bordado','DTF'], shape:'cap', img:'bone'},
  {id:'cooler',n:'Saco térmico',            cat:'Brindes',    src:'Fornecedor B · XML', base:4.20, cores:['#b8e3d6','#94a3b8','#1e3a8a','#111827'], techs:['Serigrafia','DTF'], shape:'cooler', img:'sacos'},
  {id:'tote',  n:'Saco tote algodão',       cat:'Brindes',    src:'Stock próprio',      base:1.80, cores:['#f5f0e6','#111827','#1e3a8a'], techs:['Serigrafia','DTF'], shape:'tote'},
  {id:'mug',   n:'Caneca cerâmica 330 ml',  cat:'Brindes',    src:'Fornecedor B · XML', base:2.40, cores:['#ffffff','#111827','#1e3a8a','#dc2626'], techs:['UV','Laser'], shape:'mug'},
  {id:'bottle',n:'Garrafa transparente 500 ml',cat:'Brindes',  src:'Fornecedor A · API', base:6.50, cores:['#e8f1f8','#111827','#1e3a8a','#15803d'], techs:['Laser','UV'], shape:'bottle'},
  {id:'keychain',n:'Porta-chaves vinílico', cat:'Brindes',    src:'Stock próprio',      base:0.60, cores:['#ffffff','#111827','#1e3a8a','#dc2626'], techs:['UV','Laser'], shape:'keychain'},
  {id:'pen',   n:'Caneta metálica touch',   cat:'Escritório', src:'Fornecedor A · API', base:0.85, cores:['#facc15','#111827','#1e3a8a','#dc2626','#9ca3af'], techs:['Laser','UV'], shape:'pen', img:'canetas'}
];
// posições: v = vista (f frente / b costas), r = área [x,y,w,h], k = fator de custo
const POS={
  tshirt:{Frente:{v:'f',r:[70,60,60,60],k:1},Peito:{v:'f',r:[108,56,24,24],k:.6},Manga:{v:'f',r:[34,54,16,16],k:.5},Costas:{v:'b',r:[66,54,68,72],k:1}},
  polo:{Peito:{v:'f',r:[110,62,24,24],k:.6},Frente:{v:'f',r:[70,74,60,54],k:1},Manga:{v:'f',r:[34,54,16,16],k:.5},Costas:{v:'b',r:[66,54,68,72],k:1}},
  hoodie:{Frente:{v:'f',r:[72,78,56,46],k:1},Peito:{v:'f',r:[110,74,22,22],k:.6},Manga:{v:'f',r:[30,108,16,16],k:.5},Costas:{v:'b',r:[64,76,72,60],k:1}},
  vest:{Peito:{v:'f',r:[110,64,28,28],k:.6},Costas:{v:'b',r:[62,48,76,42],k:1}},
  shirt:{Peito:{v:'f',r:[56,60,30,28],k:.6},Manga:{v:'f',r:[20,118,14,14],k:.5},Costas:{v:'b',r:[64,64,72,56],k:1}},
  apron:{Frente:{v:'f',r:[64,78,72,52],k:1}},
  cap:{Frente:{v:'f',r:[80,74,40,30],k:1}},
  cooler:{Frente:{v:'f',r:[56,96,88,60],k:1}},
  tote:{Frente:{v:'f',r:[68,98,64,64],k:1}},
  mug:{Frente:{v:'f',r:[62,82,56,56],k:1}},
  bottle:{Frente:{v:'f',r:[84,88,32,52],k:1}},
  pen:{Corpo:{v:'f',r:[68,93,62,14],k:1}},
  keychain:{Frente:{v:'f',r:[66,80,68,68],k:1}}
};
const BACKS=['tshirt','polo','hoodie','vest','shirt'];
const COMPLEMENT={polo:['cap','vest','pen'],tshirt:['cap','tote','mug'],hoodie:['cap','bottle','tshirt'],vest:['polo','cap','pen'],shirt:['apron','vest','pen'],apron:['shirt','cap','mug'],cap:['polo','tshirt','bottle'],cooler:['bottle','tote','pen'],tote:['bottle','pen','mug'],mug:['pen','bottle','tote'],bottle:['cooler','pen','tote'],pen:['mug','bottle','tote'],keychain:['pen','mug','tote']};

const ICONS={
  shirt:'<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3c-.6 1.6-2.1 2.6-4 2.6S8.6 4.6 8 3z"/>',
  uniform:'<path d="M7 3h10l1 4-6 3-6-3z"/><path d="M6 7v14h12V7"/><path d="M12 10v11"/>',
  gift:'<path d="M4 11h16v10H4zM2 7h20v4H2zM12 7v14"/><path d="M12 7C10 3 6 3 6 5.5S12 7 12 7zm0 0c2-4 6-4 6-1.5S12 7 12 7z"/>',
  needle:'<path d="M3 21 21 3M15 3h6v6"/><circle cx="7" cy="17" r="3"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  pen:'<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>'
};
const SERVICES=[
  {t:'Têxteis personalizados',ic:'shirt',col:'var(--c)',s:'T-shirts, polos e sweats com a sua marca, da unidade à grande tiragem.',d:{'Técnicas':'DTF, serigrafia, bordado','Mínimo':'1 unidade (DTF)','Prazo':'3 a 7 dias úteis','Ideal para':'equipas, eventos, merchandising'}},
  {t:'Fardamento profissional',ic:'uniform',col:'var(--m)',s:'Camisas, aventais e coletes para restauração, hotelaria e indústria.',d:{'Técnicas':'Bordado, DTF','Extra':'nome individual por colaborador','Prazo':'5 a 8 dias úteis','Ideal para':'restaurantes, hotéis, oficinas'}},
  {t:'Brindes corporativos',ic:'gift',col:'var(--y-ink)',s:'Canetas, garrafas, canecas e sacos térmicos que ficam na memória.',d:{'Técnicas':'Laser, UV, serigrafia','Mínimo':'desde 25 unidades','Prazo':'3 a 7 dias úteis','Ideal para':'feiras, campanhas, ofertas'}},
  {t:'Bordado',ic:'needle',col:'#8b7bff',s:'O acabamento mais nobre e duradouro para polos, bonés e coletes.',d:{'Preparação':'digitalização da arte incluída','Durabilidade':'excelente, resiste a lavagens industriais','Prazo':'5 a 7 dias úteis','Ideal para':'imagem corporativa premium'}},
  {t:'Gravação laser',ic:'bolt',col:'var(--ok)',s:'Marcação permanente em metal, madeira, vidro e acrílico.',d:{'Materiais':'metal, madeira, vidro, pele','Durabilidade':'permanente','Prazo':'2 a 4 dias úteis','Ideal para':'canetas, garrafas, placas'}},
  {t:'Design & branding',ic:'pen',col:'#ff8a3d',s:'Criamos ou vetorizamos o seu logótipo e preparamos os ficheiros.',d:{'Inclui':'vetorização, mockups, provas','Formato':'AI, SVG, PDF','Prazo':'1 a 3 dias úteis','Ideal para':'marcas novas ou a renovar'}}
];
const TECH_TABLE=[
  ['DTF','Algodão, poliéster, misturas','Designs com muitas cores, pequenas quantidades','★★★★☆','1 +','3 dias'],
  ['Serigrafia','Têxteis, sacos, papel','Grandes tiragens com poucas cores','★★★★★','50 +','5 a 7 dias'],
  ['Bordado','Polos, bonés, coletes, camisas','Imagem premium e fardamento','★★★★★','1 +','5 a 7 dias'],
  ['Gravação laser','Metal, madeira, vidro, pele','Brindes duradouros e elegantes','★★★★★','10 +','2 a 4 dias'],
  ['Impressão UV','Plásticos, acrílico, cerâmica','Fotografias e cores vivas em rígidos','★★★★☆','1 +','2 a 3 dias']
];
const KITS=[
  {id:'rest',n:'Kit Restauração',img:'leitoes',d:'10 camisas bordadas no peito + 10 aventais com logótipo',items:[{pid:'shirt',color:'#ffffff',tech:'Bordado',positions:['Peito'],qty:10},{pid:'apron',color:'#111827',tech:'DTF',positions:['Frente'],qty:10}]},
  {id:'team',n:'Kit Equipa',img:'polo_full',d:'Polos, bonés e coletes com a mesma identidade + canetas',items:[{pid:'polo',color:'#facc15',tech:'Bordado',positions:['Peito'],qty:25},{pid:'cap',color:'#111827',tech:'Bordado',positions:['Frente'],qty:25},{pid:'vest',color:'#111827',tech:'DTF',positions:['Peito','Costas'],qty:10},{pid:'pen',color:'#facc15',tech:'Laser',positions:['Corpo'],qty:100}]},
  {id:'promo',n:'Kit Promocional',img:'sacos',d:'Sacos térmicos, totes e garrafas para campanhas',items:[{pid:'cooler',color:'#b8e3d6',tech:'Serigrafia',positions:['Frente'],qty:100},{pid:'tote',color:'#f5f0e6',tech:'Serigrafia',positions:['Frente'],qty:100},{pid:'bottle',color:'#111827',tech:'Laser',positions:['Frente'],qty:50}]}
];
const PORTFOLIO=[
  {img:'polo_full',t:'RIMO',s:'Polo amarelo com logótipo no peito · fardamento de equipa'},
  {img:'bone',t:'RIMO',s:'Boné preto com símbolo bordado'},
  {img:'colete',t:'RIMO',s:'Colete acolchoado · logótipo no peito'},
  {img:'canetas',t:'RIMO',s:'Canetas metálicas com gravação a duas cores',w2:true},
  {img:'colete_costas',t:'RIMO',s:'Colete · marca aplicada nas costas'},
  {img:'leitoes',t:'Casa dos Leitões',s:'Camisa e avental · fardamento de restauração'},
  {img:'polo',t:'RIMO',s:'Detalhe da aplicação no polo'},
  {img:'sacos',t:'Continente Equilíbrio',s:'Sacos térmicos promocionais personalizados',w2:true}
];

/* =========================================================
   UTILITÁRIOS
   ========================================================= */
const $=id=>document.getElementById(id);
const eur=n=>n.toLocaleString('pt-PT',{style:'currency',currency:'EUR'});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prod=id=>PRODUCTS.find(p=>p.id===id);
const isDark=c=>{const n=parseInt(c.slice(1),16);return (0.299*(n>>16)+0.587*(n>>8&255)+0.114*(n&255))<150};
const tierOf=q=>[...TIERS].reverse().find(t=>q>=t.min);
function addBiz(n){const d=new Date();let a=0;while(a<n){d.setDate(d.getDate()+1);const w=d.getDay();if(w&&w!==6)a++}return d}
const fdate=d=>d.toLocaleDateString('pt-PT',{weekday:'short',day:'2-digit',month:'short'});
function toast(msg){const t=$('toast');t.innerHTML=msg;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2600)}
function defaultSizes(q){const d={XS:0,S:0,M:0,L:0,XL:0,XXL:0};const pr={S:.15,M:.3,L:.3,XL:.18};let s=0;for(const k in pr){d[k]=Math.floor(q*pr[k]);s+=d[k]}d.M+=q-s;return d}
const icon=(k,sw=1.6)=>`<svg viewBox="0 0 24 24" fill="none" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;

/* =========================================================
   MOCKUPS SVG
   ========================================================= */
function sk(c){return isDark(c)?'rgba(255,255,255,.22)':'#aeb6c6'}
function base(shape,c,v){
  const s=sk(c),L=`stroke="${s}" stroke-width="2" stroke-linejoin="round"`;
  const T='M62 32 L86 22 Q100 36 114 22 L138 32 L176 62 L156 86 L144 76 L144 180 L56 180 L56 76 L44 86 L24 62 Z';
  switch(shape){
    case 'tshirt':return `<path d="${T}" fill="${c}" ${L}/><path d="M86 22 Q100 ${v==='f'?36:28} 114 22" fill="none" ${L}/>`;
    case 'polo':return v==='f'
      ?`<path d="M62 32 L86 22 L100 40 L114 22 L138 32 L176 62 L156 86 L144 76 L144 180 L56 180 L56 76 L44 86 L24 62 Z" fill="${c}" ${L}/><path d="M86 22 L93 45 L100 40 L107 45 L114 22" fill="${c}" ${L}/><path d="M100 40 V68" ${L}/><circle cx="100" cy="51" r="1.8" fill="${s}"/><circle cx="100" cy="60" r="1.8" fill="${s}"/>`
      :`<path d="${T}" fill="${c}" ${L}/><path d="M86 22 Q100 30 114 22 L112 29 Q100 35 88 29 Z" fill="${c}" ${L}/>`;
    case 'hoodie':return `<path d="M64 40 Q70 14 100 14 Q130 14 136 40 L180 72 L166 160 L150 160 L146 88 L146 182 L54 182 L54 88 L50 160 L34 160 L20 72 Z" fill="${c}" ${L}/>`+(v==='f'
      ?`<path d="M80 44 Q100 64 120 44" fill="none" ${L}/><path d="M92 58 V76 M108 58 V76" ${L}/><path d="M72 140 L128 140 L122 168 L78 168 Z" fill="none" ${L}/>`
      :`<path d="M68 38 Q100 74 132 38" fill="rgba(0,0,0,.14)" ${L}/>`);
    case 'vest':{const P=v==='f'?'M70 26 L88 22 L100 56 L112 22 L130 26 L150 40 L146 70 Q138 80 146 92 L150 182 L50 182 L54 92 Q62 80 54 70 L50 40 Z':'M70 26 Q100 34 130 26 L150 40 L146 70 Q138 80 146 92 L150 182 L50 182 L54 92 Q62 80 54 70 L50 40 Z';
      let q='';for(let y=96;y<182;y+=22)q+=`<path d="M54 ${y} H146" stroke="${s}" stroke-width="1.2"/>`;
      return `<path d="${P}" fill="${c}" ${L}/>${q}`+(v==='f'?`<path d="M100 56 V182" stroke="${s}" stroke-width="2.5"/><rect x="97" y="118" width="6" height="12" rx="2" fill="#ffc832"/>`:'');}
    case 'shirt':return `<path d="M64 30 L86 22 L100 34 L114 22 L136 30 L170 70 L186 170 L166 174 L150 92 L148 184 L52 184 L50 92 L34 174 L14 170 L30 70 Z" fill="${c}" ${L}/>`+(v==='f'
      ?`<path d="M86 22 L92 40 L100 34 L108 40 L114 22" fill="${c}" ${L}/><path d="M100 36 V184" stroke="${s}" stroke-width="1.4"/>${[56,80,104,128,152].map(y=>`<circle cx="104" cy="${y}" r="2" fill="${s}"/>`).join('')}<path d="M116 66 H140 V92 Q128 96 116 92 Z" fill="none" stroke="${s}" stroke-width="1.4"/>`
      :`<path d="M50 54 Q100 64 150 54" fill="none" stroke="${s}" stroke-width="1.4"/>`);
    case 'apron':return `<path d="M26 66 L6 92 M174 66 L194 92" stroke="${c}" stroke-width="5" stroke-linecap="round"/><rect x="26" y="58" width="148" height="14" rx="4" fill="${c}" ${L}/><rect x="40" y="70" width="120" height="108" rx="6" fill="${c}" ${L}/><path d="M40 140 H160 M80 140 V178 M120 140 V178" stroke="${s}" stroke-width="1.3"/>`;
    case 'cap':return `<path d="M44 124 Q44 58 100 58 Q156 58 156 124 Z" fill="${c}" ${L}/><path d="M40 124 L176 124 Q190 142 160 144 L44 138 Z" fill="${c}" ${L}/><circle cx="100" cy="58" r="4" fill="${c}" ${L}/><path d="M100 62 V124" stroke="${s}" stroke-width="1.2" opacity=".6"/>`;
    case 'cooler':return `<path d="M72 70 Q72 42 88 42 H112 Q128 42 128 70" fill="none" stroke="#111" stroke-width="8"/><rect x="34" y="64" width="132" height="116" rx="12" fill="${c}" ${L}/><path d="M34 84 H166" stroke="#fff" stroke-width="2" opacity=".7"/><path d="M60 64 V180 M140 64 V180" stroke="#111" stroke-width="7" opacity=".85"/>`;
    case 'tote':{const s2=isDark(c)?s:'#b8ad97';return `<path d="M78 72 Q78 30 100 30 Q122 30 122 72" fill="none" stroke="${s2}" stroke-width="6"/><rect x="50" y="68" width="100" height="116" rx="4" fill="${c}" stroke="${s2}" stroke-width="2"/>`;}
    case 'mug':return `<path d="M142 88 Q178 88 178 116 Q178 144 142 144" fill="none" stroke="${s}" stroke-width="13"/><path d="M142 88 Q178 88 178 116 Q178 144 142 144" fill="none" stroke="${c}" stroke-width="9"/><rect x="48" y="64" width="96" height="112" rx="10" fill="${c}" ${L}/><ellipse cx="96" cy="67" rx="46" ry="6" fill="rgba(0,0,0,.1)"/>`;
    case 'bottle':return `<rect x="86" y="22" width="28" height="22" rx="4" fill="#9ca3af" stroke="rgba(0,0,0,.3)" stroke-width="2"/><rect x="78" y="44" width="44" height="140" rx="16" fill="${c}" ${L}/><rect x="84" y="52" width="6" height="120" rx="3" fill="rgba(255,255,255,.3)"/>`;
    case 'keychain':return `<circle cx="100" cy="36" r="16" fill="none" stroke="#cbd5e1" stroke-width="5"/><circle cx="100" cy="112" r="62" fill="${c}" ${L}/><circle cx="100" cy="60" r="4" fill="rgba(0,0,0,.3)"/>`;
    case 'pen':return `<g transform="rotate(-30 100 100)"><rect x="40" y="91" width="120" height="18" rx="9" fill="${c}" ${L}/><path d="M160 93 L184 100 L160 107 Z" fill="#cbd5e1"/><rect x="44" y="83" width="42" height="5" rx="2" fill="#cbd5e1"/><rect x="146" y="91" width="4" height="18" fill="#cbd5e1"/><circle cx="36" cy="100" r="7" fill="#1f2937"/></g>`;
  }
  return '';
}
function prints(shape,c,v,cfg){
  const P=POS[shape];let out='';
  cfg.positions.forEach(pos=>{
    const d=P[pos];if(!d||d.v!==v)return;
    let [x,y,w,h]=d.r;const sc=cfg.scale||1,cx=x+w/2,cy=y+h/2;w*=sc;h*=sc;x=cx-w/2;y=cy-h/2;
    const rot=shape==='pen'?' transform="rotate(-30 100 100)"':'';
    const dk=isDark(c),ph=dk?'rgba(255,255,255,.85)':'rgba(46,110,220,.9)';
    const txt=cfg.text&&d.k>=1&&shape!=='pen';
    const ih=txt?h*.72:h;
    let g=cfg.logo
      ?`<image href="${cfg.logo}" x="${x}" y="${y}" width="${w}" height="${ih}" preserveAspectRatio="xMidYMid meet"/>`
      :`<rect x="${x}" y="${y}" width="${w}" height="${ih}" rx="3" fill="none" stroke="${ph}" stroke-width="1.2" stroke-dasharray="4 3"/><text x="${cx}" y="${y+ih/2+3}" text-anchor="middle" font-size="${Math.max(5,Math.min(10,w/5.5))}" font-family="Barlow,system-ui,sans-serif" font-weight="800" fill="${ph}">LOGO</text>`;
    if(txt)g+=`<text x="${cx}" y="${y+h-1}" text-anchor="middle" font-size="${Math.max(5,Math.min(h*.2,w/(cfg.text.length*.55)))}" font-family="Barlow Condensed,Impact,sans-serif" letter-spacing=".4" fill="${cfg.textColor==='auto'||!cfg.textColor?(dk?'#fff':'#111'):cfg.textColor}">${esc(cfg.text)}</text>`;
    out+=`<g${rot}>${g}</g>`;
  });
  return out;
}
function mock(pid,c,v='f',cfg=null){const p=prod(pid);return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(p.n)}">${base(p.shape,c,v)}${cfg?prints(p.shape,c,v,cfg):''}</svg>`}

/* =========================================================
   PREÇO
   ========================================================= */
function promoFor(c,q){if(!c.promo)return null;const P=PROMOS.find(x=>x.id===c.promo),it=P&&P.itens.find(i=>i.pid===c.pid);if(!it||q<it.min||c.positions.length!==1)return null;return {...it,nome:P.nome}}
function calc(c){
  const p=prod(c.pid),q=Math.max(1,c.qty||1),t=tierOf(q),T=TECH[c.tech];
  const pr=promoFor(c,q);
  if(pr){const names=c.names?2*q:0,sub0=pr.preco*q+names,express=c.express?sub0*.2:0,sub=sub0+express;let days=T.days+(q>=250?3:0)+(c.names?1:0);if(c.express)days=Math.ceil(days/2);
    const normal=calc({...c,promo:null});return {q,t:TIERS[0],unitBase:pr.preco,posUnit:0,setup:0,names,express,sub,save:Math.max(0,normal.sub-sub),iva:sub*.23,total:sub*1.23,unit:sub/q,days,promo:pr};}
  const unitBase=p.base*(1-t.d);
  const posUnit=c.positions.reduce((a,pos)=>a+T.unit*(POS[p.shape][pos]?.k||1),0);
  const setup=T.setup*c.positions.length;
  const names=c.names?2*q:0;
  const sub0=(unitBase+posUnit)*q+setup+names;
  const express=c.express?sub0*.2:0;
  const sub=sub0+express, save=p.base*t.d*q;
  let days=T.days+(q>=250?3:0)+(c.names?1:0); if(c.express)days=Math.ceil(days/2);
  return {q,t,unitBase,posUnit,setup,names,express,sub,save,iva:sub*.23,total:sub*1.23,unit:sub/q,days};
}

/* =========================================================
   ESTADO
   ========================================================= */
const S={cat:'Todos',view:'f',cfg:null,cart:[],step:1,art:{},bill:{tipo:'empresa'},delivery:'recolha',pay:'viva',orders:[],leads:[],lastLogo:null,uid:1,editing:null};
function newCfg(pid,over={}){
  const p=prod(pid);const c={pid,color:p.cores[0],tech:p.techs[0],positions:[Object.keys(POS[p.shape])[0]],logo:S.lastLogo||S.defLogo,scale:1,text:'',textColor:'auto',qty:p.sizes?50:100,sizes:null,names:false,namesList:'',express:false,...over};
  if(p.sizes&&!c.sizes)c.sizes=defaultSizes(c.qty);
  if(p.sizes)c.qty=Object.values(c.sizes).reduce((a,b)=>a+b,0);
  return c;
}

/* =========================================================
   NAVEGAÇÃO / EFEITOS
   ========================================================= */
function go(tab){
  document.querySelectorAll('#tabs button[data-go]').forEach(b=>b.classList.toggle('on',b.dataset.go===tab));
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.id==='t-'+tab));
  window.scrollTo(0,0);
  if(tab==='carrinho')renderCart();
  if(tab==='painel')renderPanel();
  if(tab==='catalogo')renderCatalog();
  if(typeof closeDD==='function')closeDD();
  observe();
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.dataset.go);return}
  const s=e.target.closest('[data-scroll]');if(s){e.preventDefault();if(s.dataset.scroll==='contacto'){openContact();return}$(s.dataset.scroll).scrollIntoView({behavior:'smooth'});return}
  if(e.target.closest('[data-nolink]'))e.preventDefault();
});
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');if(en.target.querySelector('[data-count]'))count(en.target.querySelector('[data-count]'));io.unobserve(en.target)}}),{threshold:.15});
function observe(){document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el))}
function count(el){if(el._done)return;el._done=1;const to=+el.dataset.count,pre=el.dataset.pre||'',suf=el.dataset.suf||'';if(pre){el.textContent=pre.trim();return}const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1200);el.textContent=Math.round(to*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
const fine=matchMedia('(pointer:fine)').matches;
document.addEventListener('pointermove',e=>{
  if(!fine)return;const el=e.target.closest('[data-tilt]');
  document.querySelectorAll('[data-tilt].tilting').forEach(o=>{if(o!==el){o.classList.remove('tilting');o.style.removeProperty('--rx');o.style.removeProperty('--ry')}});
  if(!el)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  el.classList.add('tilting');el.style.setProperty('--ry',((x-.5)*12).toFixed(2)+'deg');el.style.setProperty('--rx',((.5-y)*10).toFixed(2)+'deg');el.style.setProperty('--gx',x*100+'%');el.style.setProperty('--gy',y*100+'%');
});


/* =========================================================
   INÍCIO + SERVIÇOS
   ========================================================= */
/* =========================================================
   PORTFÓLIO / TRABALHOS REALIZADOS
   Uma linha por fotografia real (pasta img/trabalhos/):
   {src:'img/trabalhos/polos-bordados.webp', produto:'Polo', tecnica:'Bordado', legenda:'Polos para a equipa de sala'}
   Opcional: cliente:'Nome' (só com autorização da empresa)
   ========================================================= */
const TRABALHOS=[
  // {src:'img/trabalhos/exemplo.webp', produto:'Polo', tecnica:'Bordado', legenda:'Descrição curta', cliente:''},
];
let trabFiltro='Todos';
function renderTrabalhos(){
  const grid=$('trabGrid'),filtros=$('trabFiltros');
  grid.replaceChildren();filtros.replaceChildren();
  // Sem fotografias: mostra 8 espaços reservados
  if(TRABALHOS.length===0){
    for(let i=0;i<8;i++){const v=document.createElement('div');v.className='trab-vazio';v.textContent='Fotografia em breve';grid.appendChild(v)}
    return;
  }
  // Filtros criados a partir das técnicas existentes nos dados
  const tecnicas=['Todos'];
  for(const t of TRABALHOS){if(t.tecnica&&!tecnicas.includes(t.tecnica))tecnicas.push(t.tecnica)}
  if(tecnicas.length>2){
    for(const t of tecnicas){const b=document.createElement('button');b.type='button';b.textContent=t;b.dataset.f=t;if(t===trabFiltro)b.classList.add('on');filtros.appendChild(b)}
  }
  TRABALHOS.forEach((t,i)=>{
    if(trabFiltro!=='Todos'&&t.tecnica!==trabFiltro)return;
    const fig=document.createElement('figure');fig.className='trab-item';fig.dataset.i=i;
    if(t.tecnica)fig.dataset.tecnica=t.tecnica;
    const img=document.createElement('img');img.src=t.src;img.alt=(t.produto||'Trabalho')+' personalizado'+(t.tecnica?' · '+t.tecnica:'');img.loading='lazy';
    const cap=document.createElement('figcaption');
    const b=document.createElement('b');b.textContent=t.produto||'';cap.appendChild(b);
    if(t.legenda)cap.append(t.legenda);
    if(t.cliente){const s=document.createElement('small');s.textContent=' · '+t.cliente;cap.appendChild(s)}
    fig.append(img,cap);grid.appendChild(fig);
  });
}
$('trabFiltros').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;trabFiltro=b.dataset.f;renderTrabalhos()});
$('trabGrid').addEventListener('click',e=>{const f=e.target.closest('.trab-item');if(!f)return;const t=TRABALHOS[+f.dataset.i];
  $('lbImg').src=t.src;$('lbCap').textContent=[t.produto,t.tecnica,t.legenda,t.cliente].filter(Boolean).join(' · ');$('lb').classList.add('on')});

function renderHome(){
  renderTrabalhos();
  $('svcHome').innerHTML=SERVICES.map(s=>`<div class="card svc reveal" data-tilt data-go="servicos" style="--ic:${s.col}"><div class="ico lift">${icon(s.ic)}</div><h3>${s.t}</h3><p>${s.s}</p><span class="more">Saber mais →</span></div>`).join('');
  const imgs=PORTFOLIO.map(p=>`<img src="${IMG[p.img]}" alt="${esc(p.t)}" loading="lazy">`).join('');
  $('mtrack').innerHTML=imgs+imgs;
  $('flipGrid').innerHTML=SERVICES.map(s=>`<div class="flip" style="--ic:${s.col}" tabindex="0"><div class="flip-in">
    <div class="fface ffront"><div class="ico">${icon(s.ic,1.5)}</div><span class="turn">↻ virar</span><h3>${s.t}</h3><p>${s.s}</p></div>
    <div class="fface fback"><h3>${s.t}</h3><dl>${Object.entries(s.d).map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl><button class="btn pri sm" data-go="loja">Personalizar →</button></div>
  </div></div>`).join('');
  document.querySelectorAll('.flip').forEach(f=>f.addEventListener('click',e=>{if(!e.target.closest('button'))f.classList.toggle('on')}));
  $('techTable').innerHTML=TECH_TABLE.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td class="muted">${r[2]}</td><td class="stars">${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`).join('');
  $('pfGrid').innerHTML=PORTFOLIO.map((p,i)=>`<div class="card pf ${p.w2?'w2':''}" data-tilt data-pf="${i}"><img src="${IMG[p.img]}" alt="${esc(p.t+' — '+p.s)}" loading="lazy"><div class="cap"><b>${esc(p.t)}</b><small>${esc(p.s)}</small></div></div>`).join('');
}
$('pfGrid')?.addEventListener('click',e=>{const el=e.target.closest('[data-pf]');if(!el)return;const p=PORTFOLIO[+el.dataset.pf];$('lbImg').src=IMG[p.img];$('lbCap').innerHTML=`<b>${esc(p.t)}</b> · ${esc(p.s)}`;$('lb').classList.add('on')});
$('lb').addEventListener('click',e=>{if(e.target.id==='lb'||e.target.id==='lbX')$('lb').classList.remove('on')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('lb').classList.remove('on')});

/* =========================================================
   LOJA / PERSONALIZADOR
   ========================================================= */
function renderKits(){
  $('kits').innerHTML=KITS.map(k=>{const tot=k.items.reduce((a,i)=>a+calc(newCfg(i.pid,{...i,sizes:null})).total,0);
    return `<div class="card kit" data-tilt><img src="${IMG[k.img]}" alt="${esc(k.n)}" loading="lazy"><div class="kbx"><h3>${k.n}</h3><p>${k.d}</p><div class="row2"><span class="price">desde ${eur(tot)} <small class="muted">c/ IVA</small></span><button class="btn pri sm" data-kit="${k.id}">Adicionar kit</button></div></div></div>`}).join('');
}
$('kits').addEventListener('click',e=>{const b=e.target.closest('[data-kit]');if(!b)return;const k=KITS.find(x=>x.id===b.dataset.kit);
  k.items.forEach(i=>pushCart(newCfg(i.pid,{...i,sizes:null,logo:S.cfg.logo||S.lastLogo||S.defLogo})));
  toast(`✓ ${k.n} adicionado ao carrinho (${k.items.length} artigos)`);bumpCart();
});
function renderPicker(){
  const cats=['Todos',...new Set(PRODUCTS.map(p=>p.cat))];
  $('cats').innerHTML=cats.map(c=>`<button class="cat ${c===S.cat?'on':''}" data-cat="${c}">${c}</button>`).join('');
  $('picker').innerHTML=PRODUCTS.filter(p=>S.cat==='Todos'||p.cat===S.cat).map(p=>{const r=calc(newCfg(p.id,{qty:250,sizes:p.sizes?defaultSizes(250):null}));
    return `<button class="pk ${S.cfg&&S.cfg.pid===p.id?'on':''}" data-pid="${p.id}"><div class="th">${p.img?`<img src="${IMG[p.img]}" alt="" loading="lazy">`:mock(p.id,p.cores[0])}</div><div class="nm">${esc(p.n)}<small>desde ${eur(r.unit)}/un.</small></div></button>`}).join('');
  railUpd('picker');
}
$('cats').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;S.cat=b.dataset.cat;renderPicker()});
$('picker').addEventListener('click',e=>{const b=e.target.closest('[data-pid]');if(!b)return;selectProduct(b.dataset.pid)});
function selectProduct(pid,cfg){
  const keep=S.cfg?{logo:S.cfg.logo,scale:S.cfg.scale,text:S.cfg.text,textColor:S.cfg.textColor}:{};
  S.cfg=cfg||newCfg(pid,keep);S.view='f';S.editing=cfg?S.editing:null;
  renderPicker();renderBuilder(true);
}
function renderBuilder(full){
  const c=S.cfg,p=prod(c.pid);
  if(full){
    $('stName').textContent=p.n;$('stSrc').textContent=`${p.cat} · ${p.src}`;
    $('views').style.display=BACKS.includes(p.shape)?'inline-flex':'none';
    $('colors').innerHTML=p.cores.map(k=>`<button class="sw ${k===c.color?'on':''}" style="background:${k}" data-c="${k}" title="${CN[k]||k}" aria-label="${CN[k]||k}"></button>`).join('');
    $('techs').innerHTML=p.techs.map(t=>`<button class="opt ${t===c.tech?'on':''}" data-t="${t}">${TECH[t].n}<small>${TECH[t].desc} · ${TECH[t].days} dias</small></button>`).join('');
    $('poss').innerHTML=Object.entries(POS[p.shape]).map(([k,d])=>`<button class="opt ${c.positions.includes(k)?'on':''}" data-p="${k}">${k}<small>${d.v==='b'?'costas':'frente'} · ${d.k<1?'pequeno':'grande'}</small></button>`).join('');
    $('tcolors').innerHTML=['auto','#ffffff','#111111','#ffc832'].map(k=>`<button class="sw ${k===c.textColor?'on':''}" data-tc="${k}" title="${k==='auto'?'Automático':k}" style="width:26px;height:26px;background:${k==='auto'?'conic-gradient(#fff 0 50%,#111 0)':k}"></button>`).join('');
    $('scale').value=c.scale;$('ptext').value=c.text;$('names').checked=c.names;$('express').checked=c.express;$('namesList').value=c.namesList;$('namesList').style.display=c.names?'block':'none';
    $('qtyBox').innerHTML=p.sizes
      ?`<div class="sizes">${SIZES.map(z=>`<div><label for="sz${z}">${z}</label><input type="number" min="0" id="sz${z}" data-sz="${z}" value="${c.sizes[z]}"></div>`).join('')}</div>`
      :`<input type="number" min="1" id="qtyIn" value="${c.qty}">`;
    renderDrop();
    $('addCart').textContent=S.editing?'Guardar alterações':L_ADD;
  }else{
    document.querySelectorAll('#colors .sw').forEach(b=>b.classList.toggle('on',b.dataset.c===c.color));
    document.querySelectorAll('#techs .opt').forEach(b=>b.classList.toggle('on',b.dataset.t===c.tech));
    document.querySelectorAll('#poss .opt').forEach(b=>b.classList.toggle('on',c.positions.includes(b.dataset.p)));
    document.querySelectorAll('#tcolors .sw').forEach(b=>b.classList.toggle('on',b.dataset.tc===c.textColor));
  }
  document.querySelectorAll('#views button').forEach(b=>b.classList.toggle('on',b.dataset.v===S.view));
  $('colorName').textContent=CN[c.color]||'';
  $('stage').innerHTML=visual(c.pid,c,S.view);
  const r=calc(c);
  $('qtyTotal').textContent=`${r.q} peças`;
  const pct=Math.min(100,r.q/250*100);$('tbFill').style.width=pct+'%';
  const next=TIERS.find(t=>t.min>r.q);
  $('tbMsg').innerHTML=next?`Faltam <b>${next.min-r.q}</b> peças para desbloquear <b>−${Math.round(next.d*100)}%</b> no produto`:`<span style="color:var(--ok)">✓ Melhor escalão de preço desbloqueado</span>`;
  if(c.promo){const P=PROMOS.find(x=>x.id===c.promo),it=P&&P.itens.find(i=>i.pid===c.pid);if(it)$('tbMsg').innerHTML=r.promo?`<span style="color:var(--y-ink)">★ Preço ${esc(P.nome)} ativo: ${eur(it.preco)}/un.</span>`:`Para o preço ${esc(P.nome)} (${eur(it.preco)}/un.): mínimo ${it.min} peças${c.positions.length!==1?' e só 1 posição':''}`}
  if(c.names){const n=c.namesList.split('\n').map(s=>s.trim()).filter(Boolean).length;$('namesHint').className='fhint '+(n===r.q?'ok':'');$('namesHint').textContent=`${n} de ${r.q} nomes preenchidos`+(n===r.q?' ✓':'');}else $('namesHint').textContent='';
  $('pTotal').textContent=eur(r.total);$('pUnit').textContent=eur(r.unit);
  if(r.promo)$('pBreak').innerHTML=`<div class="rw"><span class="muted">Preço ${esc(r.promo.nome)} · ${r.q} × ${eur(r.promo.preco)}</span><span>${eur(r.promo.preco*r.q)}</span></div>${r.names?`<div class="rw"><span class="muted">Nomes individuais · ${r.q} × 2,00 €</span><span>${eur(r.names)}</span></div>`:''}${r.express?`<div class="rw"><span class="muted">Produção expresso (+20%)</span><span>${eur(r.express)}</span></div>`:''}<div class="rw save"><span>Poupança face ao preço normal</span><span>−${eur(r.save)}</span></div><div class="rw"><span class="muted">IVA 23%</span><span>${eur(r.iva)}</span></div><div class="rw tot"><span>Total</span><span>${eur(r.total)}</span></div>`;
  else $('pBreak').innerHTML=`
    <div class="rw"><span class="muted">${esc(prod(c.pid).n)} · ${r.q} × ${eur(r.unitBase)}</span><span>${eur(r.unitBase*r.q)}</span></div>
    <div class="rw"><span class="muted">${TECH[c.tech].n} · ${c.positions.join(' + ')} · ${r.q} × ${eur(r.posUnit)}</span><span>${eur(r.posUnit*r.q)}</span></div>
    ${r.setup?`<div class="rw"><span class="muted">Preparação (${c.tech==='Bordado'?'digitalização':c.tech==='Serigrafia'?'telas':'setup'} × ${c.positions.length})</span><span>${eur(r.setup)}</span></div>`:''}
    ${r.names?`<div class="rw"><span class="muted">Nomes individuais · ${r.q} × 2,00 €</span><span>${eur(r.names)}</span></div>`:''}
    ${r.express?`<div class="rw"><span class="muted">Produção expresso (+20%)</span><span>${eur(r.express)}</span></div>`:''}
    ${r.save?`<div class="rw save"><span>Desconto de quantidade (−${Math.round(r.t.d*100)}%)</span><span>−${eur(r.save)}</span></div>`:''}
    <div class="rw"><span class="muted">IVA 23%</span><span>${eur(r.iva)}</span></div>
    <div class="rw tot"><span>Total</span><span>${eur(r.total)}</span></div>`;
  $('dlDate').textContent=fdate(addBiz(r.days));
  $('dlInfo').innerHTML=`${r.days} dias úteis de produção<br>${c.express?'<span style="color:var(--warn)">⚡ expresso</span>':TECH[c.tech].n}`;
  renderLogoAI();apply3D();renderPP(full);
}
function renderDrop(){
  const c=S.cfg;
  $('drop').innerHTML=c.logo
    ?(isDef(c.logo)?`<div class="has"><img src="${c.logo}" alt="Logótipo de exemplo"><span>A mostrar o logótipo de exemplo BDS</span><label>carregar o seu logótipo<input type="file" accept="image/*" id="logoIn"></label></div>`:`<div class="has"><img src="${c.logo}" alt="Logótipo carregado"><span>Logótipo aplicado</span><label>trocar<input type="file" accept="image/*" id="logoIn"></label> · <a href="#" id="rmLogo" style="color:var(--muted)">remover</a></div>`)
    :`Arraste o logótipo para aqui ou <label>escolha um ficheiro<input type="file" accept="image/*" id="logoIn"></label><br><small class="faint">PNG com fundo transparente dá o melhor resultado</small>`;
}
function setLogo(file){if(!file||!file.type.startsWith('image/'))return toast('Escolha uma imagem (PNG, JPG ou SVG)');const rd=new FileReader();rd.onload=()=>{const orig=rd.result;analyzeLogo(orig,info=>{S.logoInfo=info;S.logoOrig=orig;S.bgRemoved=!!info.removed;const use=info.removed||orig;S.cfg.logo=use;S.lastLogo=use;renderDrop();renderBuilder();toast(info.removed?'✓ Logótipo aplicado · fundo branco removido automaticamente':'✓ Logótipo aplicado à pré-visualização')})};rd.readAsDataURL(file)}
$('drop').addEventListener('change',e=>{if(e.target.id==='logoIn')setLogo(e.target.files[0])});
$('drop').addEventListener('click',e=>{if(e.target.id==='rmLogo'){e.preventDefault();S.cfg.logo=null;S.logoInfo=null;renderDrop();renderBuilder()}});
['dragenter','dragover'].forEach(ev=>$('drop').addEventListener(ev,e=>{e.preventDefault();$('drop').classList.add('over')}));
['dragleave','drop'].forEach(ev=>$('drop').addEventListener(ev,e=>{e.preventDefault();$('drop').classList.remove('over')}));
$('drop').addEventListener('drop',e=>setLogo(e.dataTransfer.files[0]));
$('colors').addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(!b)return;S.cfg.color=b.dataset.c;renderBuilder()});
$('techs').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;S.cfg.tech=b.dataset.t;renderBuilder()});
$('poss').addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b)return;const c=S.cfg,k=b.dataset.p,i=c.positions.indexOf(k);
  if(i>=0){if(c.positions.length===1)return toast('Escolha pelo menos uma posição');c.positions.splice(i,1)}else{c.positions.push(k);const v=POS[prod(c.pid).shape][k].v;if(v!==S.view){S.view=v;if(S.is3d)turn3D(v);else flipStage()}}renderBuilder()});
$('tcolors').addEventListener('click',e=>{const b=e.target.closest('[data-tc]');if(!b)return;S.cfg.textColor=b.dataset.tc;renderBuilder()});
$('views').addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b||b.dataset.v===S.view)return;S.view=b.dataset.v;if(S.is3d)turn3D(S.view);else flipStage();renderBuilder()});
function flipStage(){const s=$('stage');s.classList.remove('turning');void s.offsetWidth;s.classList.add('turning')}
$('scale').addEventListener('input',e=>{S.cfg.scale=+e.target.value;renderBuilder()});
$('ptext').addEventListener('input',e=>{S.cfg.text=e.target.value.toUpperCase();renderBuilder()});
$('qtyBox').addEventListener('input',e=>{const c=S.cfg;if(e.target.dataset.sz){c.sizes[e.target.dataset.sz]=Math.max(0,parseInt(e.target.value)||0);c.qty=Math.max(1,Object.values(c.sizes).reduce((a,b)=>a+b,0))}else c.qty=Math.max(1,parseInt(e.target.value)||1);renderBuilder()});
$('names').addEventListener('change',e=>{S.cfg.names=e.target.checked;$('namesList').style.display=e.target.checked?'block':'none';renderBuilder()});
$('namesList').addEventListener('input',e=>{S.cfg.namesList=e.target.value;renderBuilder()});
$('express').addEventListener('change',e=>{S.cfg.express=e.target.checked;renderBuilder()});
function pushCart(cfg){if(S.step===5)S.step=1;const it={...JSON.parse(JSON.stringify({...cfg,logo:null})),logo:cfg.logo,uid:S.uid++};S.cart.push(it);updateCartN()}
function updateCartN(){$('cartN').textContent=S.cart.length}
function bumpCart(){const b=$('cartBtn');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}
$('addCart').addEventListener('click',()=>{
  const c=S.cfg;if(prod(c.pid).sizes&&Object.values(c.sizes).reduce((a,b)=>a+b,0)<1)return toast('Indique pelo menos uma peça');
  if(S.editing){const i=S.cart.findIndex(x=>x.uid===S.editing);if(i>=0)S.cart[i]={...JSON.parse(JSON.stringify({...c,logo:null})),logo:c.logo,uid:S.editing};S.editing=null;updateCartN();toast('✓ Artigo atualizado');go('carrinho');return}
  pushCart(c);bumpCart();toast(`✓ ${esc(prod(c.pid).n)} adicionado · <a href="#" data-go="carrinho" style="color:var(--y)">${L_CART}</a>`);
});
$('toQuote').addEventListener('click',()=>openQuote(true));

/* =========================================================
   CARRINHO (4 passos)
   ========================================================= */
const STEPS=MODO==='orcamento'?['Lista','Arte e aprovação','Os seus dados','Enviar pedido']:['Carrinho','Arte e aprovação','Faturação e entrega','Pagamento'];
function totals(){const sub=S.cart.reduce((a,i)=>a+calc(i).sub,0),save=S.cart.reduce((a,i)=>a+calc(i).save,0),setup=S.cart.reduce((a,i)=>a+calc(i).setup,0);
  const ship=S.delivery==='recolha'||sub===0?0:(sub>=150?0:6.9);const iva=(sub+ship)*.23;const days=S.cart.reduce((a,i)=>Math.max(a,calc(i).days),0);
  return {sub,save,setup,ship,iva,total:sub+ship+iva,days,pieces:S.cart.reduce((a,i)=>a+calc(i).q,0)}}
function renderStepper(){$('stepper').innerHTML=STEPS.map((s,i)=>`<div class="stp ${i+1===S.step?'on':i+1<S.step?'done':''}"><i>${i+1<S.step?'✓':i+1}</i>${s}</div>`).join('')}
function summaryHTML(btn){const t=totals();return `<div class="card summary">
  <h3>Resumo</h3><p class="muted" style="margin:0 0 12px;font-size:13px">${S.cart.length} artigos · ${t.pieces} peças</p>
  <div class="rw"><span class="muted">Subtotal</span><span>${eur(t.sub)}</span></div>
  ${t.save?`<div class="rw save"><span>Poupança por quantidade</span><span>−${eur(t.save)}</span></div>`:''}
  <div class="rw"><span class="muted">Preparações incluídas</span><span>${eur(t.setup)}</span></div>
  <div style="margin:12px 0 6px;font-size:12.5px;font-weight:600;color:var(--muted)">ENTREGA</div>
  <label class="radio-card"><input type="radio" name="dlv" value="recolha" ${S.delivery==='recolha'?'checked':''}><span>Recolha em Rio Tinto<small>Rua do Casal 106</small></span><span class="rp">Grátis</span></label>
  <label class="radio-card"><input type="radio" name="dlv" value="envio" ${S.delivery==='envio'?'checked':''}><span>Transportadora (24/48 h)<small>grátis acima de 150 €</small></span><span class="rp">${t.sub>=150?'Grátis':'6,90 €'}</span></label>
  <div class="rw"><span class="muted">IVA 23%</span><span>${eur(t.iva)}</span></div>
  <div class="rw tot"><span>${MODO==='orcamento'?'Total estimado':'Total'}</span><span>${eur(t.total)}</span></div>
  <div class="note" style="margin-top:12px;padding:12px;border-radius:12px;background:var(--bg2);font-size:13px">📅 Pronto a partir de <b>${t.days?fdate(addBiz(t.days)):'—'}</b></div>
  ${btn||''}</div>`}
function itemHTML(i){const p=prod(i.pid),r=calc(i),hasB=i.positions.some(k=>POS[p.shape][k].v==='b');
  const sz=p.sizes?SIZES.filter(z=>i.sizes[z]).map(z=>`${z}×${i.sizes[z]}`).join(' · '):'';
  return `<div class="card item" data-tilt><div class="mk">${mock(i.pid,i.color,'f',i)}${hasB?`<div class="bk">${mock(i.pid,i.color,'b',i)}</div>`:''}</div>
  <div><h3><span>${esc(p.n)}</span><span>${eur(r.sub*1.23)}</span></h3>
  <div class="meta"><span class="chip"><span class="dot" style="background:${i.color}"></span>${CN[i.color]||''}</span><span class="chip m">${TECH[i.tech].n}</span>${i.positions.map(k=>`<span class="chip c">${k}</span>`).join('')}${r.promo?`<span class="chip y">★ ${esc(r.promo.nome)}</span>`:''}${i.express?'<span class="chip y">⚡ Expresso</span>':''}${i.logo&&!isDef(i.logo)?'<span class="chip ok">✓ logótipo</span>':'<span class="chip y">logótipo em falta</span>'}</div>
  <p class="ln"><b>${r.q} peças</b>${sz?' · '+sz:''} · ${eur(r.unit)}/un. s/ IVA</p>
  ${i.text?`<p class="ln">Texto: <b>${esc(i.text)}</b></p>`:''}${i.names?`<p class="ln">Nomes individuais: <b>${i.namesList.split('\n').filter(s=>s.trim()).length}</b></p>`:''}
  <p class="ln">Produção: <b>${r.days} dias úteis</b> · pronto ${fdate(addBiz(r.days))}</p>
  <div class="ia"><button class="btn gho sm" data-edit="${i.uid}">✎ Editar</button><button class="btn gho sm" data-dup="${i.uid}">⧉ Duplicar</button><button class="btn gho sm" data-rm="${i.uid}" style="color:var(--err)">Remover</button></div></div></div>`}
function renderCart(){
  renderStepper();const V=$('cartView');
  if(S.step===5)return; // confirmação já desenhada
  if(!S.cart.length){S.step=1;renderStepper();V.innerHTML=`<div class="card empty"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.4"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg><h3>O carrinho está vazio</h3><p class="muted">Personalize um produto ou comece por um dos kits prontos.</p><button class="btn pri" data-go="loja" style="margin-top:10px">Ir para a loja →</button></div>`;return}
  if(S.step===1){
    const inCart=new Set(S.cart.map(i=>i.pid));const sug=[...new Set(S.cart.flatMap(i=>COMPLEMENT[i.pid]))].filter(id=>!inCart.has(id)).slice(0,3);
    const logo=S.cart.find(i=>i.logo&&!isDef(i.logo))?.logo||S.defLogo;
    V.innerHTML=`<div class="cart-grid"><div>${S.cart.map(itemHTML).join('')}
      ${sug.length?`<div class="upsell"><h3>Complete a identidade da sua equipa</h3><p class="muted" style="margin:0 0 12px;font-size:14px">Com o mesmo logótipo${logo?' que já carregou':''}, num clique.</p><div class="ups-grid">${sug.map(id=>{const p=prod(id),cf=newCfg(id,{logo,qty:25,sizes:null}),r=calc(cf);return `<div class="card ups" data-tilt><div class="mk">${mock(id,p.cores[0],'f',cf)}</div><b>${esc(p.n)}</b><span class="muted" style="font-size:13px">25 un. · ${eur(r.total)} c/ IVA</span><button class="btn gho sm" data-ups="${id}">+ Adicionar</button></div>`}).join('')}</div></div>`:''}
    </div>${summaryHTML(`<button class="btn pri" style="width:100%;margin-top:14px" data-step="2">Continuar para aprovação da arte →</button>`)}</div>`;
  }
  if(S.step===2){
    V.innerHTML=`<div class="cart-grid"><div><p class="muted" style="margin-top:0">Confirme cada pré-visualização. Se preferir, a nossa equipa de design ajusta a arte sem custo e envia uma prova final por email.</p>
    ${S.cart.map(i=>{const p=prod(i.pid),hasB=i.positions.some(k=>POS[p.shape][k].v==='b');const a=S.art[i.uid]||{};return `<div class="card art"><div class="mk">${mock(i.pid,i.color,'f',i)}</div><div class="mk">${hasB?mock(i.pid,i.color,'b',i):`<span class="faint" style="font-size:12px;text-align:center;padding:10px">${esc(p.n)}<br>${i.positions.join(' + ')}</span>`}</div>
      <div class="ac"><h3 style="font-size:16px">${esc(p.n)} · ${calc(i).q} peças</h3>${i.logo?'':'<p style="color:var(--y-ink);font-size:13px;margin:4px 0 8px">Sem logótipo: pode enviá-lo depois por email.</p>'}
      <label class="radio-card"><input type="radio" name="art${i.uid}" value="ok" ${a.v==='ok'?'checked':''}><span>Aprovo esta pré-visualização<small>segue diretamente para produção</small></span></label>
      <label class="radio-card"><input type="radio" name="art${i.uid}" value="adj" ${a.v==='adj'?'checked':''}><span>Pedir ajuste à equipa<small>sem custo · prova final por email</small></span></label>
      <textarea data-artnote="${i.uid}" placeholder="Notas para o designer (opcional)" style="min-height:60px;display:${a.v==='adj'?'block':'none'}">${esc(a.note||'')}</textarea></div></div>`}).join('')}
    <div class="nav-steps"><button class="btn gho" data-step="1">← Voltar</button><button class="btn pri" data-step="3" id="artNext">Continuar →</button></div></div>${summaryHTML()}</div>`;
  }
  if(S.step===3){const b=S.bill;
    V.innerHTML=`<div class="cart-grid"><div class="card pad"><h3>Dados de faturação</h3>
      <div class="opts" style="margin:10px 0 16px"><button class="opt ${b.tipo==='empresa'?'on':''}" data-tipo="empresa">Empresa</button><button class="opt ${b.tipo==='part'?'on':''}" data-tipo="part">Particular</button></div>
      <div class="fgrid">
        <div><label class="fl" for="bNome">Nome *</label><input type="text" id="bNome" value="${esc(b.nome||'')}"></div>
        ${b.tipo==='empresa'?`<div><label class="fl" for="bEmp">Empresa *</label><input type="text" id="bEmp" value="${esc(b.emp||'')}"></div>`:'<div></div>'}
        <div><label class="fl" for="bNif">NIF ${b.tipo==='empresa'?'*':''}</label><input type="text" id="bNif" inputmode="numeric" maxlength="9" value="${esc(b.nif||'')}" placeholder="9 dígitos"><div class="fhint" id="hNif"></div></div>
        <div><label class="fl" for="bEmail">Email *</label><input type="email" id="bEmail" value="${esc(b.email||'')}"><div class="fhint" id="hBEmail"></div></div>
        <div><label class="fl" for="bTel">Telemóvel *</label><input type="tel" id="bTel" value="${esc(b.tel||'')}" placeholder="9xx xxx xxx"></div>
        <div></div>
        ${S.delivery==='envio'?`<div class="full"><label class="fl" for="bMor">Morada de entrega *</label><input type="text" id="bMor" value="${esc(b.mor||'')}" placeholder="Rua, nº, código postal, localidade"></div>`:`<div class="full" style="font-size:13.5px;padding:12px 14px;border-radius:12px;background:var(--bg2)">📍 Recolha em <b>Rua do Casal 106, Rio Tinto</b>. Avisamos por SMS/email quando estiver pronto.</div>`}
      </div>
      <div class="fhint err" id="hBill"></div>
      <div class="nav-steps"><button class="btn gho" data-step="2">← Voltar</button><button class="btn pri" id="billNext">Continuar para pagamento →</button></div></div>${summaryHTML()}</div>`;
    nifHint();
  }
  if(S.step===4&&MODO==='orcamento'){
    V.innerHTML=`<div class="cart-grid"><div class="card pad"><h3>Confirmar pedido de orçamento</h3><p class="muted" style="font-size:14px;margin:0 0 14px">Não há pagamento agora. A equipa BDS valida a arte e envia a proposta final com um link de pagamento seguro.</p>
    ${S.cart.map(i=>{const r=calc(i);return `<div class="rw" style="border-bottom:1px solid var(--line);padding:10px 0"><span>${r.q} × ${esc(prod(i.pid).n)} <span class="muted">· ${TECH[i.tech].n} · ${i.positions.join(' + ')}</span></span><span>${eur(r.sub*1.23)}</span></div>`}).join('')}
    <div class="rw" style="padding-top:10px"><span class="muted">Cliente</span><span>${esc(S.bill.emp||S.bill.nome||'')} · ${esc(S.bill.email||'')}</span></div>
    <label class="rgpd" style="margin-top:14px"><input type="checkbox" id="qlRgpd"> Li e aceito os <a href="#" data-legal="termos">Termos e Condições</a> e a <a href="#" data-legal="privacidade">Política de Privacidade</a>.</label><div class="fhint err" id="qlErr"></div>
    <div class="nav-steps"><button class="btn gho" data-step="3">← Voltar</button><button class="btn quick" id="sendQuote">Enviar pedido de orçamento</button></div></div>${summaryHTML()}</div>`;return}
  if(S.step===4){const t=totals();
    V.innerHTML=`<div class="cart-grid"><div class="card pad"><h3>Método de pagamento</h3><p class="muted" style="margin:0 0 14px;font-size:13.5px">A BDS já trabalha com a Viva: o site usa a mesma conta, através do Smart Checkout com o logótipo e a cor da marca. Nesta demonstração, o pagamento é simulado.</p>
      ${[['viva','Pagar com Viva','MB WAY, Multibanco, cartão, Apple Pay ou Google Pay · checkout seguro com a marca BDS',''],['transf','Transferência bancária',b2b()?'Empresas: 50% de adiantamento, restante na entrega':'Envio do comprovativo por email',b2b()?eur(t.total/2)+' agora':'']].map(([v,n,s,rp])=>`<label class="radio-card"><input type="radio" name="pay" value="${v}" ${S.pay===v?'checked':''}><span>${n}<small>${s}</small></span>${rp?`<span class="rp">${rp}</span>`:''}</label>`).join('')}
      <div id="payExtra"></div><label class="rgpd" style="margin-top:12px"><input type="checkbox" id="payRgpd"> Li e aceito os <a href="#" data-legal="termos">Termos e Condições</a> e a <a href="#" data-legal="privacidade">Política de Privacidade</a>.</label>
      <div class="nav-steps"><button class="btn gho" data-step="3">← Voltar</button><button class="btn pri" id="payNow">${S.pay==='viva'?'Ir para o checkout Viva':'Confirmar encomenda'} · ${eur(S.pay==='transf'&&b2b()?t.total/2:t.total)}</button></div></div>${summaryHTML()}</div>`;
    payExtra();
  }
}
const b2b=()=>S.bill.tipo==='empresa';
function payExtra(){const el=$('payExtra');if(el)el.innerHTML=''}
function nifValid(n){if(!/^\d{9}$/.test(n))return false;if(!'1235689'.includes(n[0])&&!['45','70','71','72','74','75','77','79','90','91','98','99'].includes(n.slice(0,2)))return false;let s=0;for(let i=0;i<8;i++)s+=+n[i]*(9-i);let c=11-s%11;if(c>=10)c=0;return c===+n[8]}
function nifHint(){const i=$('bNif'),h=$('hNif');if(!i)return;const v=i.value.trim();if(!v){h.textContent='';h.className='fhint';return}
  if(v.length<9){h.textContent=`${v.length}/9 dígitos`;h.className='fhint';return}h.textContent=nifValid(v)?'✓ NIF válido':'✗ NIF inválido (dígito de controlo)';h.className='fhint '+(nifValid(v)?'ok':'err')}
function readBill(){['Nome','Emp','Nif','Email','Tel','Mor'].forEach(k=>{const el=$('b'+k);if(el)S.bill[k.toLowerCase()]=el.value.trim()})}
$('cartView').addEventListener('input',e=>{if(e.target.id==='bNif'){e.target.value=e.target.value.replace(/\D/g,'');nifHint()}if(e.target.dataset.artnote){(S.art[e.target.dataset.artnote]??={}).note=e.target.value}if(e.target.id?.startsWith('b'))readBill()});
$('cartView').addEventListener('change',e=>{
  if(e.target.name==='dlv'){S.delivery=e.target.value;renderCart()}
  if(e.target.name?.startsWith('art')){const uid=e.target.name.slice(3);(S.art[uid]??={}).v=e.target.value;const ta=document.querySelector(`[data-artnote="${uid}"]`);if(ta)ta.style.display=e.target.value==='adj'?'block':'none'}
  if(e.target.name==='pay'){S.pay=e.target.value;renderCart()}
});
$('cartView').addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;
  if(t.dataset.rm){S.cart=S.cart.filter(i=>i.uid!=t.dataset.rm);updateCartN();renderCart()}
  if(t.dataset.dup){const i=S.cart.find(x=>x.uid==t.dataset.dup);pushCart(i);renderCart();toast('Artigo duplicado. Edite-o para mudar a cor ou a técnica')}
  if(t.dataset.edit){const i=S.cart.find(x=>x.uid==t.dataset.edit);S.editing=i.uid;go('loja');S.cfg={...JSON.parse(JSON.stringify({...i,logo:null})),logo:i.logo};S.view='f';renderPicker();renderBuilder(true);$('stage').scrollIntoView({behavior:'smooth',block:'center'})}
  if(t.dataset.ups){const logo=S.cart.find(i=>i.logo&&!isDef(i.logo))?.logo||S.defLogo;pushCart(newCfg(t.dataset.ups,{logo,qty:25,sizes:null}));bumpCart();renderCart();toast('✓ Adicionado com o seu logótipo')}
  if(t.dataset.tipo){readBill();S.bill.tipo=t.dataset.tipo;renderCart()}
  if(t.dataset.step){const n=+t.dataset.step;
    if(n===3&&S.step===2){const miss=S.cart.filter(i=>!S.art[i.uid]?.v);if(miss.length)return toast(`Falta aprovar ${miss.length} artigo(s)`)}
    S.step=n;renderCart();window.scrollTo({top:0,behavior:'smooth'})}
  if(t.id==='billNext'){readBill();const b=S.bill,er=[];
    if(!b.nome)er.push('nome');if(b2b()&&!b.emp)er.push('empresa');if(b2b()&&!nifValid(b.nif||''))er.push('NIF válido');if(!b2b()&&b.nif&&!nifValid(b.nif))er.push('NIF válido');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email||''))er.push('email');if(!/^\+?[\d\s]{9,}$/.test(b.tel||''))er.push('telemóvel');if(S.delivery==='envio'&&!b.mor)er.push('morada');
    if(er.length){$('hBill').textContent='Falta preencher: '+er.join(', ');return}S.step=4;renderCart();window.scrollTo({top:0,behavior:'smooth'})}
  if(t.id==='payNow'){if(!$('payRgpd').checked){toast('Aceite os Termos e a Política de Privacidade para continuar');return}if(S.pay==='viva')openViva();else confirmOrder()}
  if(t.id==='sendQuote'){if(!$('qlRgpd').checked){$('qlErr').textContent='Aceite os Termos e a Política de Privacidade para enviar.';return}confirmQuoteList()}
});
function confirmOrder(){
  const t=totals(),nr='BDS-'+(1042+S.orders.length),adj=S.cart.some(i=>S.art[i.uid]?.v==='adj');
  let info='',payLabel='Transferência',paid=false;
  if(S.pay==='viva'){const mt=S.vivaMethod||'Cartão';payLabel='Viva · '+mt;
    if(mt==='Multibanco'){const ref=String(Math.floor(1e8+Math.random()*9e8));info=`<div class="payinfo"><span class="muted">Entidade</span><b>12345</b><span class="muted">Referência</span><b>${ref.replace(/(\d{3})(?=\d)/g,'$1 ')}</b><span class="muted">Valor</span><b>${eur(t.total)}</b></div><p class="faint" style="font-size:12px">Referência gerada no checkout Viva · dados fictícios</p>`}
    else{paid=true;info=`<div class="payinfo"><span class="muted">Método</span><b>${esc(mt)}</b><span class="muted">orderCode (s)</span><b>${S.vivaCode}</b><span class="muted">Transação (t)</span><b>${S.vivaTx.slice(0,13)}…</b></div><p class="faint" style="font-size:12px">Confirmado pelo webhook "Transaction Payment Created" · simulação</p>`}}
  if(S.pay==='transf')info=`<div class="payinfo"><span class="muted">IBAN</span><b>PT50 0000 0000 0000 0000 0000 0</b><span class="muted">Valor</span><b>${eur(b2b()?t.total/2:t.total)}</b><span class="muted">Descritivo</span><b>${nr}</b></div><p class="faint" style="font-size:12px">IBAN fictício de demonstração</p>`;
  S.orders.unshift({nr,cliente:S.bill.emp||S.bill.nome,pecas:t.pieces,total:t.total,pay:payLabel,stage:paid&&!adj?1:0,paid});
  S.step=5;renderStepper();document.querySelectorAll('.stp').forEach(s=>{s.classList.remove('on');s.classList.add('done');s.querySelector('i').textContent='✓'});
  const stages=['Recebida','Arte aprovada','Em produção','Pronta','Entregue'],cur=paid&&!adj?1:0;
  $('cartView').innerHTML=`<div class="card confirm"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></div>
    <h2 style="margin:0">Encomenda <span class="gt">${nr}</span> recebida</h2>
    <p class="muted">Obrigado, ${esc(S.bill.nome.split(' ')[0])}! Enviámos a confirmação para <b>${esc(S.bill.email)}</b>.${adj?' A nossa equipa vai enviar a prova de arte ajustada.':''}</p>
    ${info}
    <div class="timeline">${stages.map((s,i)=>`<div class="tl ${i<=cur?'on':''}"><i>${i<=cur?'✓':i+1}</i>${s}</div>`).join('')}</div>
    <p class="muted" style="font-size:13.5px">Previsão: pronto a <b>${fdate(addBiz(t.days))}</b> · ${S.delivery==='recolha'?'recolha em Rio Tinto':'envio por transportadora'}</p>
    <p class="faint" style="font-size:12.5px;max-width:560px;margin:14px auto 0">No sistema real: fatura emitida automaticamente (Moloni / InvoiceXpress), encomenda registada em MySQL e visível no Painel para a produção.</p>
    <div class="cta" style="justify-content:center;margin-top:20px"><button class="btn gho" data-go="painel">Ver no Painel ⚙</button><button class="btn pri" id="newOrder">Nova encomenda</button></div></div>`;
  S.cart=[];S.art={};updateCartN();
  $('newOrder').onclick=()=>{S.step=1;go('loja')};
}

/* =========================================================
   CONTACTO
   ========================================================= */
function ctSubmit(e){
  e.preventDefault();const v=id=>$(id).value.trim();let ok=true;
  const chk=(cond,h,msg)=>{$(h).textContent=cond?'':msg;$(h).className='fhint '+(cond?'':'err');if(!cond)ok=false};
  chk(v('fNome').length>1,'hNome','Indique o seu nome');
  chk(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('fEmail')),'hEmail','Email inválido');
  chk(v('fMsg').length>9,'hMsg','Descreva um pouco mais o pedido');
  chk($('fRgpd').checked,'hRgpd','É necessário aceitar o tratamento de dados');
  if(!ok)return;
  const ref='L-'+String(Date.now()).slice(-5);
  S.leads.unshift({ref,nome:v('fNome'),emp:v('fEmp'),serv:v('fServ'),qtd:v('fQtd'),hora:new Date().toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'})});
  const nome=v('fNome').split(' ')[0],email=v('fEmail');
  $('ctBox').innerHTML=`<div class="okmsg"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></div>
    <h2 style="font-size:40px">Pedido <span class="gt">${ref}</span> enviado</h2><p class="muted">Obrigado, ${esc(nome)}! Foi enviada uma confirmação automática para <b>${esc(email)}</b> e a equipa BDS responde em menos de 24 horas úteis.</p>
    <p class="faint" style="font-size:12.5px">No site real: o pedido é guardado na base de dados, a equipa recebe o alerta por email e, se ativado, por WhatsApp.</p>
    <button class="btn gho" id="ctAgain" style="margin-top:10px">Enviar outro pedido</button></div>`;
  toast('✓ Pedido de contacto enviado');renderPanel();
}
$('ctForm').addEventListener('submit',ctSubmit);
const ctHTML=$('ctBox').innerHTML;
function openContact(){const c=$('contacto');if(typeof closeDD==='function')closeDD();c.classList.remove('ct-hidden');c.classList.remove('ct-in');void c.offsetWidth;c.classList.add('ct-in');setTimeout(()=>window.scrollTo({top:c.getBoundingClientRect().top+scrollY-130,behavior:'smooth'}),30)}
function closeContact(){const c=$('contacto');c.classList.add('ct-hidden');c.classList.remove('ct-in')}
document.addEventListener('click',e=>{if(e.target.id==='ctClose')closeContact()});
function restoreCt(){if(!$('ctForm')){$('ctBox').innerHTML=ctHTML;$('ctForm').addEventListener('submit',ctSubmit)}}
$('ctBox').addEventListener('click',e=>{if(e.target.id==='ctAgain')restoreCt()});

/* =========================================================
   PAINEL
   ========================================================= */
const STAGES=['Recebida','Arte aprovada','Em produção','Pronta','Entregue'];
function renderPanel(){
  $('kOrd').textContent=S.orders.length;$('kLead').textContent=S.leads.length;
  $('kRev').textContent=Math.round(S.orders.reduce((a,o)=>a+o.total,0)).toLocaleString('pt-PT')+' €';
  if(S.orders.length)$('orders').innerHTML=S.orders.map((o,i)=>`<tr><td><b>${o.nr}</b></td><td>${esc(o.cliente)}</td><td>${o.pecas}</td><td>${eur(o.total)}</td><td>${o.pay} ${o.paid?'<span class="tag up">pago</span>':'<span class="tag">pendente</span>'}</td><td><select class="stage-sel" data-ord="${i}">${STAGES.map((s,k)=>`<option ${k===o.stage?'selected':''} value="${k}">${s}</option>`).join('')}</select></td></tr>`).join('');
  if(S.leads.length)$('leads').innerHTML=S.leads.map(l=>`<tr><td><b>${l.ref}</b></td><td>${esc(l.nome)}${l.emp?' · <span class="muted">'+esc(l.emp)+'</span>':''}</td><td>${esc(l.serv)}</td><td>${esc(l.qtd)}</td><td>${l.hora}</td><td>${l.files&&l.files.length?`<div class="thumbs">${l.files.map(f=>`<img src="${f.src}" alt="${esc(f.label)}" title="${esc(f.label)}">`).join('')}</div>`:'<span class="faint">—</span>'}</td></tr>`).join('');
}
$('orders').addEventListener('change',e=>{const s=e.target.closest('[data-ord]');if(!s)return;const o=S.orders[+s.dataset.ord];o.stage=+s.value;toast(`📧 Email automático enviado: ${o.nr} → ${STAGES[o.stage]}`)});
let syncing=false;
$('syncBtn').addEventListener('click',()=>{
  if(syncing)return;syncing=true;$('syncBtn').disabled=true;const log=$('log');log.innerHTML='';
  const tm=()=>new Date().toLocaleTimeString('pt-PT');
  const L=[`<span class="b">[${tm()}]</span> sync.py iniciado (cron 06:00, execução manual)`,
    `<span class="b">[${tm()}]</span> Fornecedor A · GET /api/v2/products … <span class="g">200 OK</span> · 1 248 artigos`,
    `<span class="b">[${tm()}]</span> Fornecedor B · catalogo.xml (3,4 MB) … <span class="g">OK</span> · 864 artigos`,
    `<span class="b">[${tm()}]</span> Filtro de categorias BDS → 12 artigos correspondem`,
    `<span class="b">[${tm()}]</span> Margem ×1,35 aplicada · arredondamento ao cêntimo`,
    `<span class="b">[${tm()}]</span> MySQL · INSERT … ON DUPLICATE KEY UPDATE → <span class="g">5 linhas</span>`,
    `<span class="b">[${tm()}]</span> <span class="y">⚠ Garrafa térmica: stock baixo (86 un.). Alerta enviado</span>`,
    `<span class="b">[${tm()}]</span> WooCommerce · PUT /wp-json/wc/v3/products/batch … <span class="g">200 OK</span>`,
    `<span class="g">✓ Concluído em 4,2 s</span>`];
  const CH=[{p:'Polo piqué 210 g',t:'Preço',v:'7,90 € → 8,15 €',c:'up',f:()=>prod('polo').base=8.15},{p:'Garrafa térmica 500 ml',t:'Stock',v:'1 240 → 86 un.',c:'dn'},{p:'Caneta metálica touch',t:'Preço',v:'0,85 € → 0,79 €',c:'dn',f:()=>prod('pen').base=.79},{p:'Sweat com capuz 280 g',t:'Nova cor',v:'Verde garrafa',c:'nw',f:()=>{const s=prod('hoodie');if(!s.cores.includes('#14532d')){s.cores.push('#14532d');CN['#14532d']='Verde garrafa'}}},{p:'Colete acolchoado',t:'Stock',v:'reposto · 320 un.',c:'up'}];
  let i=0;(function tick(){if(i<L.length){log.innerHTML+=L[i++]+'\n';log.scrollTop=log.scrollHeight;setTimeout(tick,380);return}
    CH.forEach(c=>c.f&&c.f());$('changes').innerHTML=CH.map(c=>`<tr><td>${c.p}</td><td><span class="tag ${c.c}">${c.t}</span></td><td>${c.v}</td></tr>`).join('');
    $('kSync').textContent=tm().slice(0,5);renderPicker();renderKits();renderBuilder(true);syncing=false;$('syncBtn').disabled=false;toast('✓ Catálogo sincronizado: preços atualizados na loja')})();
});

/* =========================================================
   REELS (Instagram)
   ========================================================= */
const HASHTAG={'#bds-polo':'polo','#bds-tshirt':'tshirt','#bds-sweat':'hoodie','#bds-colete':'vest','#bds-camisa':'shirt','#bds-avental':'apron','#bds-bone':'cap','#bds-saco':'cooler','#bds-tote':'tote','#bds-caneca':'mug','#bds-garrafa':'bottle','#bds-caneta':'pen','#bds-portachaves':'keychain'};
const REELS=[
  {img:'polo_full',img2:'polo',cap:'Polos bordados para toda a equipa RIMO. Amarelo que não passa despercebido #bds-polo',pid:'polo',color:'#facc15',tech:'Bordado',positions:['Peito']},
  {img:'colete',img2:'colete_costas',cap:'Coletes com a marca à frente e nas costas, prontos para o inverno #bds-colete',pid:'vest',color:'#111827',tech:'DTF',positions:['Peito','Costas']},
  {img:'leitoes',img2:'avental',cap:'Fardamento completo para restauração: camisa bordada e avental a condizer #bds-camisa',pid:'shirt',color:'#ffffff',tech:'Bordado',positions:['Peito']},
  {img:'bone',img2:'polo_full',cap:'Bonés bordados: o símbolo da marca em destaque #bds-bone',pid:'cap',color:'#111827',tech:'Bordado',positions:['Frente']},
  {img:'canetas',img2:'canetas',cap:'Gravação a laser em canetas metálicas, a duas cores #bds-caneta',pid:'pen',color:'#facc15',tech:'Laser',positions:['Corpo']},
  {img:'sacos',img2:'sacos',cap:'Sacos térmicos personalizados para campanha promocional #bds-saco',pid:'cooler',color:'#b8e3d6',tech:'Serigrafia',positions:['Frente']}
];
const IC_HEART='<path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.3 3.3 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.7 0 5.8 3.8 4.5 7.2C19.5 16.4 12 21 12 21z"/>';
const IC_BUB='<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>';
const IC_SEND='<path d="M22 3 11 14M22 3l-7 19-4-8-8-4z"/>';
const reelMedia=r=>r.video?`<video src="${r.video}" muted loop autoplay playsinline></video>`:`<div class="kb" style="background-image:url(${IMG[r.img]})"></div><div class="kb kb2" style="background-image:url(${IMG[r.img2]})"></div>`;
const capHTML=c=>esc(c).replace(/#[\w-]+/g,m=>`<b>${m}</b>`);
const reelCfg=r=>{const p=prod(r.pid);return newCfg(r.pid,{color:r.color||p.cores[0],tech:r.tech||p.techs[0],positions:r.positions||[Object.keys(POS[p.shape])[0]]})};
function reelCard(r,i){return `<div class="reel" data-reel="${i}"><div class="rmedia">${reelMedia(r)}</div>
  <div class="rtop"><img src="${IMG.logo}" alt="">bluedigital.store<span class="rl">Reels</span></div>${r.isNew?'<span class="chip m new">Novo</span>':''}
  <div class="rside">${[IC_HEART,IC_BUB,IC_SEND].map(p=>`<svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linejoin="round">${p}</svg>`).join('')}</div>
  <div class="rcap">${capHTML(r.cap)}</div><button class="btn pri want" data-want="${i}">Quero um assim →</button></div>`}
function renderReels(){const h=REELS.map(reelCard).join('');$('reelsHome').innerHTML=h;$('reelsPf').innerHTML=h;watchVideos();railUpd('reelsHome');railUpd('reelsPf')}
// vídeo em falta na pasta videos/: o cartão é retirado do feed em vez de mostrar erro
function watchVideos(){document.querySelectorAll('.rmedia video').forEach(v=>v.addEventListener('error',()=>{const card=v.closest('.reel');if(card)card.remove()},{once:true}))}
function loadVideos(){VIDEOS.slice().reverse().forEach(v=>{const m=(v.cap||'').match(/#bds-[\w-]+/i),pid=(m&&HASHTAG[m[0].toLowerCase()])||v.produto||'tshirt',p=prod(pid);REELS.unshift({video:v.src,cap:v.cap||'',pid,color:v.cor||p.cores[0],tech:v.tecnica||p.techs[0]})})}
function want(i){closeRV();const r=REELS[i];S.editing=null;go('loja');selectProduct(r.pid,reelCfg(r));setTimeout(()=>$('stage').scrollIntoView({behavior:'smooth',block:'center'}),80);toast('Configuração do vídeo carregada. Só falta o seu logótipo')}
let RVi=0,RVt=null;
function openRV(i){RVi=i;$('rv').classList.add('on');drawRV()}
function closeRV(){$('rv').classList.remove('on');clearTimeout(RVt);$('rvPanel').innerHTML=''}
function drawRV(){clearTimeout(RVt);const r=REELS[RVi],p=prod(r.pid),cf=reelCfg(r);
  const from=calc(newCfg(r.pid,{qty:250,sizes:p.sizes?defaultSizes(250):null})).unit;
  $('rvPanel').innerHTML=`<div class="rv-bars">${REELS.map((_,k)=>`<span class="${k<RVi?'done':k===RVi?'cur':''}"><i></i></span>`).join('')}</div>
   <div class="rmedia">${reelMedia(r)}</div><div class="rtop"><img src="${IMG.logo}" alt="">bluedigital.store<span class="rl">Reels</span></div>
   <div class="rcap">${capHTML(r.cap)}</div>
   <div class="rv-prod"><div class="mk">${mock(r.pid,cf.color,'f',cf)}</div><div><b>${esc(p.n)}</b><br><small>${TECH[cf.tech].n} · desde ${eur(from)}/un.</small></div><button class="btn pri sm" data-want="${RVi}">Quero um assim</button></div>`;
  RVt=setTimeout(()=>{if(RVi<REELS.length-1){RVi++;drawRV()}else closeRV()},7000)}
document.addEventListener('click',e=>{
  const w=e.target.closest('[data-want]');if(w){want(+w.dataset.want);return}
  const r=e.target.closest('[data-reel]');if(r){openRV(+r.dataset.reel)}
});
$('rvPrev').onclick=()=>{if(RVi>0){RVi--;drawRV()}};
$('rvNext').onclick=()=>{if(RVi<REELS.length-1){RVi++;drawRV()}else closeRV()};
$('rvX').onclick=closeRV;
$('rv').addEventListener('click',e=>{if(e.target.id==='rv')closeRV()});
document.addEventListener('keydown',e=>{if(!$('rv').classList.contains('on'))return;if(e.key==='Escape')closeRV();if(e.key==='ArrowRight')$('rvNext').click();if(e.key==='ArrowLeft')$('rvPrev').click()});

/* Publicar Reel (painel) */
$('rvProd').innerHTML=PRODUCTS.map(p=>`<option value="${p.id}">${esc(p.n)}</option>`).join('');
$('rvCap').addEventListener('input',()=>{const m=$('rvCap').value.match(/#bds-[\w-]+/i);const pid=m&&HASHTAG[m[0].toLowerCase()];
  if(pid){$('rvProd').value=pid;$('rvAuto').textContent=`✓ ${m[0]} → ligado automaticamente a "${prod(pid).n}"`}else $('rvAuto').textContent=m?'Hashtag sem produto correspondente':''});
$('rvPub').addEventListener('click',()=>{
  const f=$('rvFile').files[0];if(!f)return toast('Escolha primeiro um ficheiro de vídeo');
  const cap=$('rvCap').value.trim()||'Mais um trabalho acabado de sair da oficina BDS',pid=$('rvProd').value,ig=$('rvIg').checked,url=URL.createObjectURL(f);
  const L=$('rvLog'),tm=()=>new Date().toLocaleTimeString('pt-PT'),mb=(f.size/1048576).toFixed(1).replace('.',',');L.innerHTML='';
  const lines=[`<span class="b">[${tm()}]</span> Upload de "${esc(f.name)}" (${mb} MB) … <span class="g">OK</span>`,
    `<span class="b">[${tm()}]</span> URL pública: https://bluedigital.store/media/reels/${Date.now()}.mp4`,
    `<span class="b">[${tm()}]</span> Legenda analisada → produto "${esc(prod(pid).n)}"`];
  if(ig)lines.push(`<span class="b">[${tm()}]</span> Instagram API · POST /{ig-user-id}/media  media_type=REELS → container <span class="y">17${String(Math.random()).slice(2,15)}</span>`,
    `<span class="b">[${tm()}]</span> GET /{container-id}?fields=status_code → IN_PROGRESS`,
    `<span class="b">[${tm()}]</span> GET /{container-id}?fields=status_code → <span class="g">FINISHED</span>`,
    `<span class="b">[${tm()}]</span> POST /{ig-user-id}/media_publish → <span class="g">publicado em @bluedigital.store</span> (simulação)`);
  lines.push(`<span class="g">✓ Reel visível no site (Início e Portfólio), com o botão "Quero um assim"</span>`);
  let i=0;$('rvPub').disabled=true;
  (function tick(){if(i<lines.length){L.innerHTML+=lines[i++]+'\n';L.scrollTop=L.scrollHeight;setTimeout(tick,480);return}
    const p=prod(pid);REELS.unshift({video:url,cap,pid,color:p.cores[0],tech:p.techs[0],isNew:true});renderReels();$('rvPub').disabled=false;
    $('rvFile').value='';toast('✓ Reel publicado. Já aparece no Início e no Portfólio')})();
});

/* =========================================================
   INTEGRAÇÕES: diagrama e ciclo
   ========================================================= */
const FSUP=[['TH Clothes','Excel / feed'],['JHK','feed XML'],['Payper','API B2B'],['DTF','envio da arte'],['UV','envio da arte']];
const NODES=[
  {k:'nSYNC',x:260,y:60,w:170,h:64,t:'Sincronização',s:'Python · cron 06:00'},
  {k:'nDB',x:260,y:196,w:170,h:64,t:'Base de dados',s:'MySQL'},
  {k:'nSHOP',x:500,y:128,w:190,h:104,t:'Loja BDS',s:'WooCommerce'},
  {k:'nIG',x:500,y:300,w:190,h:60,t:'Instagram API',s:'Reels da marca'},
  {k:'nCLIENT',x:790,y:20,w:190,h:64,t:'Cliente',s:'personaliza e encomenda'},
  {k:'nVIVA',x:790,y:148,w:190,h:64,t:'Viva',s:'Smart Checkout (marca BDS)'},
  {k:'nERP',x:790,y:276,w:190,h:64,t:'Faturação e email',s:'Moloni / InvoiceXpress'}
];
const FLOWS=[
  {id:'f1',d:'M190 180 C 225 180, 225 92, 260 92',c:'#2e9bff',l:'catálogo',lx:198,ly:150},
  {id:'f2',d:'M345 124 L345 196',c:'#2e9bff',l:'grava',lx:352,ly:166},
  {id:'f3',d:'M430 228 C 465 228, 465 180, 500 180',c:'#2e9bff',l:'publica',lx:436,ly:250},
  {id:'f4',d:'M790 52 C 700 52, 650 80, 640 128',c:'#ffc832',l:'encomenda',lx:680,ly:48},
  {id:'f5',d:'M690 164 C 740 164, 745 172, 790 172',c:'#ff3d8b',l:'cria pagamento',lx:704,ly:154},
  {id:'f6',d:'M790 198 C 745 198, 740 208, 690 208',c:'#34d399',l:'webhook · pago',lx:706,ly:226},
  {id:'f7',d:'M650 232 C 700 290, 740 308, 790 308',c:'#8b7bff',l:'fatura + email',lx:704,ly:292},
  {id:'f8',d:'M500 215 C 450 330, 260 340, 190 300',c:'#ff8a3d',l:'pedido de material · ficheiro da arte',lx:236,ly:352},
  {id:'f9',d:'M595 300 L595 232',c:'#ff3d8b',l:'vídeos',lx:602,ly:272}
];
function buildDiagram(){
  let s=`<svg viewBox="0 0 1000 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama do ciclo de integração das APIs"><text x="20" y="22" style="fill:#5f6a82;font:700 11px Instrument Sans,sans-serif;letter-spacing:1.5px">FORNECEDORES E PARCEIROS</text>`;
  FLOWS.forEach((f,i)=>{s+=`<g class="flow" id="${f.id}" style="--fc:${f.c}"><path id="${f.id}p" d="${f.d}"/><text x="${f.lx}" y="${f.ly}">${f.l}</text><circle r="4.5" style="fill:${f.c}"><animateMotion dur="${2.2+(i%3)*.4}s" repeatCount="indefinite"><mpath href="#${f.id}p"/></animateMotion></circle></g>`});
  FSUP.forEach((n,i)=>{const y=34+i*58;s+=`<g class="node nF"><rect x="20" y="${y}" width="170" height="48" rx="12"/><text x="34" y="${y+21}">${n[0]}</text><text class="s" x="34" y="${y+37}">${n[1]}</text></g>`});
  NODES.forEach(n=>{s+=`<g class="node ${n.k}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="14"/><text x="${n.x+16}" y="${n.y+n.h/2-3}">${n.t}</text><text class="s" x="${n.x+16}" y="${n.y+n.h/2+15}">${n.s}</text></g>`});
  return s+'</svg>';
}
const CYC=[
  {t:'Sincronização diária',d:'Lê os catálogos dos fornecedores (API, feed XML ou Excel), normaliza referência, cor, tamanho e stock, e aplica a margem.',c:'GET /api/products  ·  catalogo.xml  ·  master.xlsx',f:['f1','f2'],n:['nF','nSYNC','nDB']},
  {t:'Catálogo publicado na loja',d:'Preços e stock atualizados sem trabalho manual.',c:'PUT /wp-json/wc/v3/products/batch',f:['f3'],n:['nDB','nSHOP']},
  {t:'Reels ligados aos produtos',d:'Os vídeos de @bluedigital.store entram no site. A hashtag da legenda liga cada vídeo ao produto.',c:'GET /me/media?fields=media_type,media_url,permalink,caption',f:['f9'],n:['nIG','nSHOP']},
  {t:'Cliente personaliza e encomenda',d:'Escolhe o produto, carrega o logótipo e vê o preço e o prazo na hora.',c:'',f:['f4'],n:['nCLIENT','nSHOP']},
  {t:'Pagamento Viva criado',d:'A loja cria a ordem de pagamento e envia o cliente para o Smart Checkout com o logótipo e a cor da BDS.',c:'POST /checkout/v2/orders { amount: 24600, sourceCode }\n→ orderCode (16 dígitos) → /web/checkout?ref=orderCode',f:['f5'],n:['nSHOP','nVIVA']},
  {t:'Confirmação automática',d:'A Viva avisa a loja por webhook. A loja confirma a transação antes de marcar a encomenda como paga.',c:'Webhook "Transaction Payment Created"\nGET /checkout/v2/transactions/{transactionId}',f:['f6'],n:['nVIVA','nSHOP']},
  {t:'Fatura e email',d:'A fatura certificada é emitida e o cliente recebe a confirmação com o estado da encomenda.',c:'API de faturação  ·  email transacional',f:['f7'],n:['nSHOP','nERP']},
  {t:'Material e produção',d:'O pedido de material segue para o fornecedor e o ficheiro da arte para o parceiro DTF/UV. O stock volta a ser lido na sincronização seguinte, e o ciclo fecha.',c:'API ou email do fornecedor  ·  upload do ficheiro da arte',f:['f8'],n:['nSHOP','nF']}
];
function renderIntegr(){
  $('diag').innerHTML=buildDiagram();
  $('cycSteps').innerHTML=CYC.map((s,i)=>`<div class="cstep" id="cs${i}"><i>${i+1}</i><div><b>${s.t}</b><span>${s.d}</span>${s.c?`<code>${esc(s.c)}</code>`:''}</div></div>`).join('');
  $('vivaPreview').innerHTML=vivaHTML(246,'BDS-1042');
}
let cycRun=false;
$('cycBtn').addEventListener('click',()=>{
  if(cycRun)return;cycRun=true;$('cycBtn').disabled=true;document.querySelectorAll('.cstep').forEach(c=>c.classList.remove('on','done'));
  let i=0;(function step(){
    document.querySelectorAll('.flow.hl,.node.hl').forEach(x=>x.classList.remove('hl'));
    if(i>0)$('cs'+(i-1)).classList.replace('on','done');
    if(i>=CYC.length){cycRun=false;$('cycBtn').disabled=false;$('cycBtn').textContent='↻ Simular novamente';toast('✓ Ciclo completo: do fornecedor à entrega');return}
    const s=CYC[i];$('cs'+i).classList.add('on');s.f.forEach(id=>$(id).classList.add('hl'));s.n.forEach(n=>document.querySelectorAll('.'+n).forEach(x=>x.classList.add('hl')));
    i++;setTimeout(step,1900)})();
});

/* =========================================================
   VIVA · Smart Checkout (simulação com a marca BDS)
   ========================================================= */
const VMETHODS=['MB WAY','Multibanco','Cartão','Apple Pay','Google Pay'];
function vvField(m){
  if(m==='MB WAY')return `<input type="tel" placeholder="Telemóvel · 9xx xxx xxx" value="${esc(S.bill.tel||'')}"><p>Vai receber a notificação na app MB WAY.</p>`;
  if(m==='Multibanco')return `<p>É gerada uma referência para pagar no multibanco ou no homebanking.</p>`;
  if(m==='Cartão')return `<input type="text" inputmode="numeric" placeholder="Número do cartão"><p>Protegido com 3D Secure.</p>`;
  return `<p>Confirma com Face ID ou impressão digital, no próprio dispositivo.</p>`;
}
function vivaHTML(amount,ref){return `<div class="vv" style="--vc:#1f6fe5">
  <div class="vv-h"><img src="${IMG.logo}" alt=""><div><b>BDS · Blue Digital Store</b><small>Encomenda ${ref} · pagamento seguro</small></div></div>
  <div class="vv-amt">Total a pagar<b>${eur(amount)}</b></div>
  <div class="vv-m">${VMETHODS.map((m,i)=>`<button type="button" data-vm="${m}" class="${i===0?'on':''}">${m}</button>`).join('')}</div>
  <div class="vv-f">${vvField('MB WAY')}</div>
  <button type="button" class="vv-pay">Pagar ${eur(amount)}</button>
  <div class="vv-foot">Checkout Viva · simulação com a marca BDS</div></div>`}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-vm]');if(b){const vv=b.closest('.vv');vv.querySelectorAll('[data-vm]').forEach(x=>x.classList.toggle('on',x===b));vv.querySelector('.vv-f').innerHTML=vvField(b.dataset.vm);return}
  const p=e.target.closest('.vv-pay');if(p){if(!p.closest('#vmodal'))return toast('Pré-visualização. No site real, este ecrã é o checkout seguro da Viva');vivaPay(p.closest('.vv'))}
});
function openViva(){const t=totals();S.vivaCode=String(Math.floor(1e15+Math.random()*9e15));S.vivaTx=(crypto.randomUUID?crypto.randomUUID():String(Date.now()));
  $('vmBody').innerHTML=vivaHTML(t.total,'BDS-'+(1042+S.orders.length));$('vmodal').classList.add('on')}
function vivaPay(vv){
  const m=vv.querySelector('[data-vm].on').dataset.vm;S.vivaMethod=m;
  vv.querySelectorAll('.vv-m,.vv-f,.vv-pay').forEach(x=>x.style.display='none');
  const st=document.createElement('div');st.style.cssText='padding:6px 18px 16px;text-align:center;font-size:14px';st.innerHTML=`<div class="spin"></div>A processar ${esc(m)}…`;
  vv.insertBefore(st,vv.querySelector('.vv-foot'));
  setTimeout(()=>{st.innerHTML=`<div style="font-size:40px;color:#16a34a;line-height:1.2">✓</div><b>${m==='Multibanco'?'Referência gerada':'Pagamento aprovado'}</b><p style="font-size:11.5px;color:#6b7280;word-break:break-all;margin:8px 0 0">A voltar a bluedigital.store/obrigado?t=${S.vivaTx.slice(0,8)}…&amp;s=${S.vivaCode}</p>`;
    setTimeout(()=>{$('vmodal').classList.remove('on');confirmOrder()},1500)},1600);
}
$('vmX').onclick=()=>$('vmodal').classList.remove('on');

/* =========================================================
   MAIS VENDIDOS (início)
   ========================================================= */
function renderBest(){
  const ids=['polo','tshirt','cap','apron'];
  $('bestHome').innerHTML=ids.map(id=>{const p=prod(id),r=calc(newCfg(id,{qty:250,sizes:p.sizes?defaultSizes(250):null}));
    return `<div class="card prod" data-tilt data-pick="${id}"><div class="th">${p.img?`<img src="${IMG[p.img]}" alt="${esc(p.n)}" loading="lazy">`:mock(id,p.cores[0])}</div>
    <div class="bd"><b>${esc(p.n)}</b><span class="pr">desde <strong>${eur(r.unit)}</strong>/un. personalizado</span><span class="faint" style="font-size:12.5px">${p.techs.map(t=>TECH[t].n).join(' · ')}</span><button class="btn gho sm">Personalizar</button></div></div>`}).join('');
  
}
document.addEventListener('click',e=>{const c=e.target.closest('[data-pick]');if(!c)return;S.editing=null;go('loja');selectProduct(c.dataset.pick)});

/* =========================================================
   ASSISTENTE (IA) — interpreta um pedido escrito
   Demonstração: regras locais. No site real: modelo de IA via API.
   ========================================================= */
const AI_PROD=[[/\bpolos?\b/,'polo'],[/t-?shirts?|camisetas?|camisolas?/,'tshirt'],[/sweats?|hoodies?|capuz|moletons?/,'hoodie'],[/coletes?/,'vest'],[/\bcamisas?\b/,'shirt'],[/aventa/,'apron'],[/bon[eé]s?/,'cap'],[/t[eé]rmic|lancheira/,'cooler'],[/tote|sacos? de (pano|algod)/,'tote'],[/canecas?/,'mug'],[/garrafas?/,'bottle'],[/canetas?/,'pen'],[/porta-?chaves|chaveiros?/,'keychain']];
const AI_COL=[[/pret/,'#111827'],[/branc/,'#ffffff'],[/azul/,'#1e3a8a'],[/amarel/,'#facc15'],[/vermelh/,'#dc2626'],[/verde/,'#15803d'],[/cinz/,'#9ca3af'],[/bord[oô]|bordeaux/,'#7f1d1d']];
const AI_TECH=[[/bordad/,'Bordado'],[/\bdtf\b/,'DTF'],[/serigraf/,'Serigrafia'],[/laser|gravad/,'Laser'],[/\buv\b/,'UV']];
const AI_POS=[[/peito/,'Peito'],[/costas/,'Costas'],[/frente/,'Frente'],[/manga/,'Manga']];
const AI_SECTOR=[[/restaura|cozinha|caf[eé]|\bbar\b|pastelaria|hotel/,'shirt','Para restauração costuma juntar-se o avental a condizer (veja o Kit Restauração).'],
  [/obra|constru|oficina|armaz[eé]m|f[aá]brica/,'polo','Para equipas no terreno, o colete com a marca nas costas dá muita visibilidade.'],
  [/evento|corrida|festa|despedida|torneio/,'tshirt','Para eventos, o DTF permite cores ilimitadas sem custo de preparação.'],
  [/gin[aá]sio|academia|desport|clube/,'tshirt','Para clubes, os nomes individuais nas costas são muito pedidos.'],
  [/feira|congress|brinde|oferta|campanha/,'pen','Para feiras, canetas e sacos com o logótipo são os brindes mais procurados.']];
function aiParse(txt){
  const t=txt.toLowerCase(),notes=[];
  let pid=(AI_PROD.find(([r])=>r.test(t))||[])[1],tip='';
  const sec=AI_SECTOR.find(([r])=>r.test(t));
  if(sec){tip=sec[2];if(!pid){pid=sec[1];notes.push(`Não indicou o produto: pelo contexto sugerimos ${prod(pid).n.toLowerCase()}.`)}}
  if(!pid){pid='tshirt';notes.push('Não identifiquei o produto: comecei por uma t-shirt, pode mudar no personalizador.')}
  const p=prod(pid);
  const qm=t.match(/(\d{1,5})/);let qty=qm?+qm[1]:(p.sizes?30:100);if(qty<1)qty=1;
  if(/pessoas|colaboradores|funcion[aá]rios|equipa de/.test(t)&&qm&&(pid==='shirt'||pid==='polo'))notes.push(`${qty} pessoas: considere 2 peças por pessoa para rotação de lavagem.`);
  let color=(AI_COL.find(([r])=>r.test(t))||[])[1];
  if(color&&!p.cores.includes(color)){notes.push(`${CN[color]} não está disponível neste produto: usei ${CN[p.cores[0]]}.`);color=null}
  let tech=(AI_TECH.find(([r])=>r.test(t))||[])[1];
  if(tech&&!p.techs.includes(tech)){notes.push(`${TECH[tech].n} não se aplica a este produto: sugerimos ${TECH[p.techs[0]].n}.`);tech=null}
  let positions=AI_POS.filter(([r])=>r.test(t)).map(x=>x[1]).filter(k=>POS[p.shape][k]);
  if(!positions.length)positions=[Object.keys(POS[p.shape])[0]];
  const names=/\bnomes?\b/.test(t)&&p.sizes, express=/urgente|expresso|r[aá]pido|at[eé] (amanh|sexta|segunda|ao fim)/.test(t);
  const cfg=newCfg(pid,{qty,sizes:p.sizes?defaultSizes(qty):null,color:color||p.cores[0],tech:tech||p.techs[0],positions,names,express});
  return {cfg,notes,tip};
}
let aiLast=null;
function aiRun(){
  const txt=$('aiText').value.trim();if(txt.length<4)return toast('Descreva o que precisa, por exemplo: 30 polos pretos bordados');
  $('aiOut').innerHTML=`<div class="card pad"><span class="muted" style="font-size:14px">A analisar o pedido </span><span class="typing"><i></i><i></i><i></i></span></div>`;
  setTimeout(()=>{
    const {cfg,notes,tip}=aiParse(txt),p=prod(cfg.pid),r=calc(cfg);aiLast=cfg;
    $('aiOut').innerHTML=`<div class="card pad ai-res">
      <div class="top"><div class="mk">${mock(cfg.pid,cfg.color,'f',cfg)}</div><div><span class="eyebrow" style="font-size:11px">Proposta do assistente</span><h3 style="margin:4px 0 0">${r.q} × ${esc(p.n)}</h3>
      <div class="meta"><span class="chip"><span class="dot" style="background:${cfg.color}"></span>${CN[cfg.color]||''}</span><span class="chip c">${TECH[cfg.tech].n}</span>${cfg.positions.map(k=>`<span class="chip">${k}</span>`).join('')}${cfg.names?'<span class="chip m">Nomes</span>':''}${cfg.express?'<span class="chip y">Expresso</span>':''}</div></div></div>
      <div class="rw tot" style="margin-top:14px"><span>Estimativa com IVA</span><span>${eur(r.total)}</span></div>
      <div class="rw"><span class="muted">Por peça, sem IVA</span><span>${eur(r.unit)}</span></div>
      <div class="rw"><span class="muted">Pronto a partir de</span><span>${fdate(addBiz(r.days))}</span></div>
      ${notes.length||tip?`<ul class="vlist" style="margin-top:10px">${notes.map(n=>`<li>${esc(n)}</li>`).join('')}${tip?`<li><b>Dica:</b> ${esc(tip)}</li>`:''}</ul>`:''}
      <div class="acts"><button class="btn pri" id="aiOpen">Abrir no personalizador</button><button class="btn gho" id="aiCart">${L_ADD}</button></div>
      <p class="ai-note">Demonstração: o pedido é interpretado por regras no próprio browser. No site real, o assistente usa um modelo de IA (via API) para perceber pedidos em linguagem livre.</p></div>`;
  },900);
}
$('aiGo').addEventListener('click',aiRun);
$('aiText').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey))aiRun()});
document.querySelectorAll('#aiEx button').forEach(b=>b.addEventListener('click',()=>{$('aiText').value=b.textContent;aiRun()}));
$('aiOut').addEventListener('click',e=>{
  if(e.target.id==='aiOpen'&&aiLast){S.editing=null;go('loja');selectProduct(aiLast.pid,JSON.parse(JSON.stringify(aiLast)));toast('Pedido do assistente carregado. Falta só o logótipo')}
  if(e.target.id==='aiCart'&&aiLast){pushCart(JSON.parse(JSON.stringify(aiLast)));bumpCart();toast('✓ Adicionado ao carrinho · <a href="#" data-go="carrinho">${L_CART}</a>')}
});
$('heroAI').addEventListener('click',()=>{$('assistente').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('aiText').focus({preventScroll:true}),600)});

/* =========================================================
   ANÁLISE AUTOMÁTICA DO LOGÓTIPO
   remove fundo branco, verifica resolução, deteta cores,
   sugere a cor da peça com melhor contraste
   ========================================================= */
function lum(h){const n=parseInt(h.slice(1),16),f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(n>>16)+.7152*f(n>>8&255)+.0722*f(n&255)}
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
function analyzeLogo(src,cb){
  const img=new Image();
  img.onload=()=>{
    const W=Math.min(img.width,700),H=Math.max(1,Math.round(img.height*W/img.width)),c=document.createElement('canvas');c.width=W;c.height=H;
    const x=c.getContext('2d');x.drawImage(img,0,0,W,H);let d;
    try{d=x.getImageData(0,0,W,H)}catch(err){return cb({w:img.width,h:img.height,whiteBg:false,removed:null,cols:[],nColors:0})}
    const p=d.data,at=(X,Y)=>{const i=(Y*W+X)*4;return [p[i],p[i+1],p[i+2],p[i+3]]};
    const corners=[at(1,1),at(W-2,1),at(1,H-2),at(W-2,H-2)];
    const whiteBg=corners.every(k=>k[3]>200&&k[0]>232&&k[1]>232&&k[2]>232);
    let removed=null;
    if(whiteBg){for(let i=0;i<p.length;i+=4){const m=Math.min(p[i],p[i+1],p[i+2]);if(m>238)p[i+3]=0;else if(m>205)p[i+3]=Math.round(p[i+3]*(238-m)/33)}x.putImageData(d,0,0);removed=c.toDataURL('image/png')}
    const hist={};for(let i=0;i<p.length;i+=16){if(p[i+3]<128)continue;const k=(p[i]>>5)<<6|(p[i+1]>>5)<<3|(p[i+2]>>5);hist[k]=(hist[k]||0)+1}
    const top=Object.entries(hist).sort((a,b)=>b[1]-a[1]),tot=top.reduce((a,b)=>a+b[1],0)||1;
    const cols=top.filter(t=>t[1]/tot>.04).slice(0,4).map(([k])=>{k=+k;return '#'+[(k>>6)&7,(k>>3)&7,k&7].map(v=>(v*32+16).toString(16).padStart(2,'0')).join('')});
    cb({w:img.width,h:img.height,whiteBg,removed,cols,nColors:top.filter(t=>t[1]/tot>.015).length});
  };
  img.onerror=()=>cb({w:0,h:0,whiteBg:false,removed:null,cols:[],nColors:0});
  img.src=src;
}
function renderLogoAI(){
  const el=$('logoAI'),i=S.logoInfo,c=S.cfg;if(!el)return;
  if(!i||!c.logo){el.innerHTML='';return}
  const p=prod(c.pid);
  const sug=i.cols.length?p.cores.map(k=>({k,s:i.cols.reduce((a,l)=>a+ratio(l,k),0)/i.cols.length})).sort((a,b)=>b.s-a.s).slice(0,2).map(x=>x.k):[];
  el.innerHTML=`<div class="logo-ai"><b class="t">✦ Análise automática do logótipo</b><ul>
    ${i.whiteBg?`<li><span class="ok">✓</span>${S.bgRemoved?'Fundo branco removido automaticamente':'Fundo branco mantido'} <button class="lk" data-lai="bg">${S.bgRemoved?'repor original':'remover fundo'}</button></li>`:''}
    <li>${i.w>=800?`<span class="ok">✓</span> Boa resolução (${i.w}×${i.h} px)`:`<span class="wr">⚠</span> Resolução baixa (${i.w}×${i.h} px): pode perder nitidez. A equipa BDS pode vetorizar.`}</li>
    ${i.cols.length?`<li>Cores detetadas: ${i.cols.map(k=>`<span class="dot" style="background:${k}"></span>`).join(' ')}</li>`:''}
    ${sug.length?`<li>Fica melhor em: ${sug.map(k=>`<button class="sg" data-sgc="${k}"><span class="dot" style="background:${k}"></span>${CN[k]||k}</button>`).join(' ')}</li>`:''}
    ${c.tech==='Bordado'&&i.nColors>7?`<li><span class="wr">⚠</span> Muitas cores ou degradês: o DTF reproduz melhor. <button class="lk" data-lai="dtf">Mudar para DTF</button></li>`:''}
  </ul></div>`;
}
$('logoAI').addEventListener('click',e=>{
  const s=e.target.closest('[data-sgc]');if(s){S.cfg.color=s.dataset.sgc;renderBuilder();return}
  const b=e.target.closest('[data-lai]');if(!b)return;
  if(b.dataset.lai==='bg'){S.bgRemoved=!S.bgRemoved;S.cfg.logo=S.bgRemoved?S.logoInfo.removed:S.logoOrig;S.lastLogo=S.cfg.logo;renderDrop();renderBuilder()}
  if(b.dataset.lai==='dtf'&&prod(S.cfg.pid).techs.includes('DTF')){S.cfg.tech='DTF';renderBuilder()}
});

/* =========================================================
   VISUALIZAÇÃO 3D (three.js)
   ========================================================= */
const SIL={
  tshirt:'M62 32 L86 22 Q100 36 114 22 L138 32 L176 62 L156 86 L144 76 L144 180 L56 180 L56 76 L44 86 L24 62 Z',
  polo:'M62 32 L86 22 L100 38 L114 22 L138 32 L176 62 L156 86 L144 76 L144 180 L56 180 L56 76 L44 86 L24 62 Z',
  hoodie:'M64 40 Q70 14 100 14 Q130 14 136 40 L180 72 L166 160 L150 160 L146 88 L146 182 L54 182 L54 88 L50 160 L34 160 L20 72 Z',
  vest:'M70 26 L88 22 L100 50 L112 22 L130 26 L150 40 L146 70 Q138 80 146 92 L150 182 L50 182 L54 92 Q62 80 54 70 L50 40 Z',
  shirt:'M64 30 L86 22 L100 34 L114 22 L136 30 L170 70 L186 170 L166 174 L150 92 L148 184 L52 184 L50 92 L34 174 L14 170 L30 70 Z',
  keychain:'M100 50 C134.24 50 162 77.76 162 112 C162 146.24 134.24 174 100 174 C65.76 174 38 146.24 38 112 C38 77.76 65.76 50 100 50 Z'
};
const V3={ok:typeof THREE!=='undefined',on:false,r:null,scene:null,cam:null,grp:null,rotY:.35,rotX:-.06,target:null,drag:null,idle:0,raf:0,key:'',img:{}};
const can3D=sh=>!!SIL[sh]||sh==='mug'||sh==='bottle';
function pathShape(d){
  const tk=d.match(/[MLQCZ]|-?\d*\.?\d+/g),s=new THREE.Shape();let i=0,cmd='';
  const P=()=>{const x=+tk[i++],y=+tk[i++];return [x-100,100-y]};
  while(i<tk.length){if(/[MLQCZ]/.test(tk[i])){cmd=tk[i++];if(cmd==='Z')continue}
    if(cmd==='M'){const a=P();s.moveTo(a[0],a[1]);cmd='L'}
    else if(cmd==='L'){const a=P();s.lineTo(a[0],a[1])}
    else if(cmd==='Q'){const a=P(),b=P();s.quadraticCurveTo(a[0],a[1],b[0],b[1])}
    else if(cmd==='C'){const a=P(),b=P(),c=P();s.bezierCurveTo(a[0],a[1],b[0],b[1],c[0],c[1])}
    else i++;}
  return s;
}
function init3D(){
  if(V3.r)return true;if(!V3.ok)return false;
  const el=$('stage3d');
  V3.r=new THREE.WebGLRenderer({antialias:true,alpha:true});V3.r.setPixelRatio(Math.min(devicePixelRatio||1,2));V3.r.outputEncoding=THREE.sRGBEncoding;el.appendChild(V3.r.domElement);
  V3.scene=new THREE.Scene();V3.cam=new THREE.PerspectiveCamera(32,1,.1,100);V3.cam.position.set(0,0,6.3);
  V3.scene.add(new THREE.HemisphereLight(0xffffff,0xaab2c0,.85));
  const d1=new THREE.DirectionalLight(0xffffff,.8);d1.position.set(3,4,6);V3.scene.add(d1);
  const d2=new THREE.DirectionalLight(0xffffff,.45);d2.position.set(-4,2,-6);V3.scene.add(d2);
  V3.grp=new THREE.Group();V3.scene.add(V3.grp);
  el.addEventListener('pointerdown',e=>{V3.drag={x:e.clientX,y:e.clientY,ry:V3.rotY,rx:V3.rotX};V3.target=null;el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',e=>{if(!V3.drag)return;V3.rotY=V3.drag.ry+(e.clientX-V3.drag.x)*.011;V3.rotX=Math.max(-.5,Math.min(.5,V3.drag.rx+(e.clientY-V3.drag.y)*.006))});
  const up=()=>{V3.drag=null;V3.idle=performance.now()};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  if(window.ResizeObserver)new ResizeObserver(size3D).observe(el);
  return true;
}
function size3D(){if(!V3.r)return;const el=$('stage3d'),w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;V3.r.setSize(w,h,false);V3.cam.aspect=w/h;V3.cam.updateProjectionMatrix()}
function loop3D(){
  if(!V3.on)return;
  if(V3.target!==null){V3.rotY+=(V3.target-V3.rotY)*.12;if(Math.abs(V3.target-V3.rotY)<.002)V3.target=null}
  else if(!V3.drag&&performance.now()-V3.idle>2500)V3.rotY+=.005;
  V3.grp.rotation.y=V3.rotY;V3.grp.rotation.x=V3.rotX;V3.r.render(V3.scene,V3.cam);V3.raf=requestAnimationFrame(loop3D);
}
function turn3D(v){const off=v==='b'?Math.PI:0;V3.target=Math.round((V3.rotY-off)/(2*Math.PI))*2*Math.PI+off;V3.idle=performance.now()+3000}
function getImg(src){let im=V3.img[src];if(!im){im=new Image();im.onload=()=>{V3.key='';if(V3.on)build3D()};im.src=src;V3.img[src]=im}return im.complete&&im.naturalWidth?im:null}
function drawArt(x,cfg,dk,X,Y,Wd,Ht,withText,fontPx){
  const ih=withText?Ht*.72:Ht;
  if(cfg.logo){if(!(location.protocol==='file:'&&!cfg.logo.startsWith('data:'))){const im=getImg(cfg.logo);if(im){const r=Math.min(Wd/im.width,ih/im.height),w=im.width*r,h=im.height*r;x.drawImage(im,X+(Wd-w)/2,Y+(ih-h)/2,w,h)}}}
  else{const ph=dk?'rgba(255,255,255,.85)':'rgba(31,111,229,.9)';x.strokeStyle=ph;x.lineWidth=5;x.setLineDash([16,12]);x.strokeRect(X,Y,Wd,ih);x.setLineDash([]);x.fillStyle=ph;x.font=`800 ${Math.max(18,Math.min(46,Wd/5))}px Barlow,Arial,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('LOGO',X+Wd/2,Y+ih/2)}
  if(withText){x.fillStyle=cfg.textColor&&cfg.textColor!=='auto'?cfg.textColor:(dk?'#ffffff':'#111111');x.font=`800 ${fontPx}px Barlow,Arial,sans-serif`;x.textAlign='center';x.textBaseline='bottom';x.fillText(cfg.text,X+Wd/2,Y+Ht)}
}
function flatCanvas(shape,cfg,view){
  const W=1024,k=W/200,cv=document.createElement('canvas');cv.width=cv.height=W;const x=cv.getContext('2d'),dk=isDark(cfg.color);
  cfg.positions.forEach(pos=>{const d=POS[shape][pos];if(!d||d.v!==view)return;
    let [rx,ry,rw,rh]=d.r;const sc=cfg.scale||1,cx=rx+rw/2,cy=ry+rh/2;rw*=sc;rh*=sc;rx=cx-rw/2;ry=cy-rh/2;
    const txt=!!cfg.text&&d.k>=1;drawArt(x,cfg,dk,rx*k,ry*k,rw*k,rh*k,txt,Math.max(5,Math.min(rh*.2,rw/(Math.max(1,cfg.text.length)*.6)))*k)});
  return cv;
}
function wrapCanvas(cfg,circ,height,bw,bh){
  const cv=document.createElement('canvas');cv.width=1024;cv.height=512;const x=cv.getContext('2d'),dk=isDark(cfg.color);
  x.fillStyle=cfg.color==='#e8f1f8'?'rgba(225,238,248,.28)':cfg.color;x.fillRect(0,0,1024,512);
  const sc=cfg.scale||1,w=bw/circ*1024*sc,h=bh/height*512*sc;
  drawArt(x,cfg,dk,512-w/2,256-h/2,w,h,!!cfg.text,Math.max(14,h*.18));
  return cv;
}
function tex(cv){const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
const linCol=h=>new THREE.Color(h).convertSRGBToLinear();
function clear3D(){while(V3.grp.children.length){const o=V3.grp.children.pop();o.traverse(m=>{if(m.geometry)m.geometry.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(mt=>{if(mt.map)mt.map.dispose();mt.dispose()})})}}
function build3D(){
  if(!V3.r)return;const c=S.cfg,p=prod(c.pid),sh=p.shape;
  const key=[c.pid,c.color,c.positions.join(),c.scale,c.text,c.textColor,(c.logo||'').length,(c.logo||'').slice(-40)].join('|');
  if(key===V3.key)return;V3.key=key;clear3D();
  if(SIL[sh]){
    const depth=16,bev=7,g=new THREE.ExtrudeGeometry(pathShape(SIL[sh]),{depth,bevelEnabled:true,bevelThickness:bev,bevelSize:6,bevelSegments:8,curveSegments:24});
    g.translate(0,0,-depth/2);g.computeVertexNormals();
    V3.grp.add(new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:linCol(c.color),roughness:.9})));
    const plane=(cv,z,ry)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({map:tex(cv),transparent:true,roughness:.85,depthWrite:false}));m.position.z=z;m.rotation.y=ry;return m};
    V3.grp.add(plane(flatCanvas(sh,c,'f'),depth/2+bev+.5,0));
    if(BACKS.includes(sh))V3.grp.add(plane(flatCanvas(sh,c,'b'),-(depth/2+bev+.5),Math.PI));
    V3.grp.scale.setScalar(.012);
  }else if(sh==='mug'){
    const body=new THREE.Mesh(new THREE.CylinderGeometry(48,46,110,80,1,false,Math.PI,Math.PI*2),[
      new THREE.MeshStandardMaterial({map:tex(wrapCanvas(c,2*Math.PI*48,110,58,56)),roughness:.3}),
      new THREE.MeshStandardMaterial({color:linCol('#3b2f2a'),roughness:.5}),
      new THREE.MeshStandardMaterial({color:linCol(c.color),roughness:.3})]);
    V3.grp.add(body);
    const h=new THREE.Mesh(new THREE.TorusGeometry(27,7.5,20,48,Math.PI),new THREE.MeshStandardMaterial({color:linCol(c.color),roughness:.3}));
    h.rotation.z=-Math.PI/2;h.position.x=46;V3.grp.add(h);V3.grp.scale.setScalar(.0135);
  }else if(sh==='bottle'){
    const body=new THREE.Mesh(new THREE.CylinderGeometry(22,22,140,64,1,false,Math.PI,Math.PI*2),[
      new THREE.MeshStandardMaterial({map:tex(wrapCanvas(c,2*Math.PI*22,140,34,54)),roughness:.35,metalness:.2}),
      new THREE.MeshStandardMaterial({color:linCol(c.color)}),new THREE.MeshStandardMaterial({color:linCol(c.color)})]);
    V3.grp.add(body);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(16,17,26,48),new THREE.MeshStandardMaterial({color:linCol('#9ca3af'),metalness:.6,roughness:.3}));cap.position.y=83;V3.grp.add(cap);
    V3.grp.scale.setScalar(.0135);
  }
}
function apply3D(){
  const sh=prod(S.cfg.pid).shape,ok=can3D(sh)&&V3.ok,b=$('b3d');
  b.disabled=!ok;b.title=!V3.ok?'Biblioteca 3D não carregada':can3D(sh)?'Ver em 3D':'3D disponível para têxteis, canecas, garrafas e porta-chaves';
  if(!ok)S.is3d=false;
  $('stageBox').classList.toggle('is3d',!!S.is3d);b.classList.toggle('on',!!S.is3d);
  if(S.is3d){init3D();size3D();const was=V3.on;V3.on=true;build3D();if(!was){cancelAnimationFrame(V3.raf);loop3D()}}else V3.on=false;
}
$('b3d').addEventListener('click',()=>{S.is3d=!S.is3d;if(S.is3d){V3.key='';V3.rotY=S.view==='b'?Math.PI:.35}apply3D();if(S.is3d)toast('Arraste para rodar a peça em 360°')});


/* =========================================================
   QUADRO DE PROMOÇÕES
   ========================================================= */
S.promoI=0;S.promoHi=0;S.promoPause=false;let promoTicks=0;
function promoCfg(P,it){const p=prod(it.pid);return newCfg(it.pid,{qty:it.min,sizes:p.sizes?defaultSizes(it.min):null,promo:P.id,tech:it.tech||p.techs[0],color:it.cor||p.cores[0]})}
const fdm=d=>new Date(d).toLocaleDateString('pt-PT',{day:'numeric',month:'long'});
function renderPromo(){
  const P=PROMOS[S.promoI],el=$('promo');el.style.setProperty('--pc',P.cor);S.promoHi=0;
  el.innerHTML=`<div class="pr-head"><div><span class="pr-tag">Promoção</span><h2 class="pr-title">${esc(P.nome)}</h2><p>${esc(P.sub)}${P.inicio?` · de ${fdm(P.inicio)} a ${fdm(P.fim)}`:''}</p></div><div class="pr-count" id="prCount"></div></div>
  <div class="pr-grid ${P.itens.length===3?'n3':''}">${P.itens.map((it,i)=>{const p=prod(it.pid),cf=promoCfg(P,it),normal=calc({...cf,promo:null}).unit,off=Math.round((1-it.preco/normal)*100);
    return `<div class="pr-card ${i===0?'hi':''}" data-promo="${i}"><span class="pr-off">−${off}%</span><div class="pr-img">${visual(it.pid,cf,'f')}</div>
      <div class="pr-bd"><b>${esc(p.n)}</b><span class="pr-old">${eur(normal)}</span><span class="pr-new">${eur(it.preco)}<small>/un.</small></span><span class="pr-min">mín. ${it.min} un. · ${TECH[cf.tech].n}</span><button class="btn pri sm">Quero este</button></div></div>`}).join('')}</div>
  <div class="pr-foot"><div class="pr-dots">${PROMOS.map((x,i)=>`<button class="${i===S.promoI?'on':''}" data-promo-i="${i}">${esc(x.nome)}</button>`).join('')}</div><span class="faint">Preço por peça personalizada, sem IVA · valores de exemplo</span></div>`;
  tickCount();
}
function tickCount(){
  const P=PROMOS[S.promoI],el=$('prCount');if(!el)return;
  if(!P.inicio){el.innerHTML='<span class="lb">Campanha</span><div><b>∞</b><span>sempre</span></div>';return}
  const now=Date.now(),st=new Date(P.inicio).getTime(),en=new Date(P.fim).getTime();
  const lbl=now<st?'Começa em':now<en?'Termina em':'Terminou';let ms=Math.max(0,(now<st?st:en)-now);
  const d=Math.floor(ms/864e5),hh=Math.floor(ms/36e5)%24,mm=Math.floor(ms/6e4)%60,ss=Math.floor(ms/1e3)%60,z=n=>String(n).padStart(2,'0');
  el.innerHTML=`<span class="lb">${lbl}</span><div><b>${d}</b><span>dias</span></div><div><b>${z(hh)}</b><span>horas</span></div><div><b>${z(mm)}</b><span>min</span></div><div><b>${z(ss)}</b><span>seg</span></div>`;
}
setInterval(tickCount,1000);
setInterval(()=>{
  if(S.promoPause||!$('t-inicio').classList.contains('on'))return;
  const cards=document.querySelectorAll('#promo .pr-card');if(!cards.length)return;
  S.promoHi=(S.promoHi+1)%cards.length;
  if(S.promoHi===0&&++promoTicks>=2){promoTicks=0;S.promoI=(S.promoI+1)%PROMOS.length;renderPromo();return}
  cards.forEach((c,i)=>c.classList.toggle('hi',i===S.promoHi));
},2600);
$('promo').addEventListener('mouseenter',()=>S.promoPause=true);
$('promo').addEventListener('mouseleave',()=>S.promoPause=false);
$('promo').addEventListener('click',e=>{
  const d=e.target.closest('[data-promo-i]');if(d){S.promoI=+d.dataset.promoI;promoTicks=0;renderPromo();return}
  const c=e.target.closest('[data-promo]');if(!c)return;
  const P=PROMOS[S.promoI],it=P.itens[+c.dataset.promo];S.editing=null;go('loja');selectProduct(it.pid,promoCfg(P,it));
  setTimeout(()=>$('stage').scrollIntoView({behavior:'smooth',block:'center'}),80);
  toast(`★ Preço ${esc(P.nome)} aplicado: ${eur(it.preco)}/un. a partir de ${it.min} peças`);
});


/* =========================================================
   CARROSSÉIS COM SETAS (Reels e seletor de produtos)
   ========================================================= */
function makeRail(el){
  if(!el||el._upd)return;
  const w=document.createElement('div');w.className='rail';el.parentNode.insertBefore(w,el);w.appendChild(el);
  const mk=d=>{const b=document.createElement('button');b.type='button';b.className='rail-btn '+(d<0?'l':'r');b.setAttribute('aria-label',d<0?'Anterior':'Seguinte');
    b.innerHTML=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${d<0?'M15 5l-7 7 7 7':'M9 5l7 7-7 7'}"/></svg>`;
    b.addEventListener('click',()=>el.scrollBy({left:d*Math.max(200,el.clientWidth*.8),behavior:'smooth'}));w.appendChild(b);return b};
  const l=mk(-1),r=mk(1);
  el._upd=()=>{l.classList.toggle('off',el.scrollLeft<=4);r.classList.toggle('off',el.scrollLeft+el.clientWidth>=el.scrollWidth-4)};
  el.addEventListener('scroll',el._upd,{passive:true});
  if(window.ResizeObserver)new ResizeObserver(el._upd).observe(el);
  setTimeout(el._upd,60);
}
const railUpd=id=>{const el=$(id);if(el&&el._upd)setTimeout(el._upd,30)};

/* =========================================================
   LOJA · catálogo, pesquisa, favoritos, página de produto
   ========================================================= */
const SKU={polo:'BDS-TX210',tshirt:'BDS-TX150',hoodie:'BDS-SW280',vest:'BDS-CL300',shirt:'BDS-FD120',apron:'BDS-FD045',cap:'BDS-BN005',cooler:'BDS-BT010',tote:'BDS-SC140',mug:'BDS-CN330',bottle:'BDS-GT500',keychain:'BDS-PC030',pen:'BDS-CT020'};
const SUB={tshirt:'T-shirts',polo:'Polos',hoodie:'Sweats',shirt:'Camisas',apron:'Aventais',vest:'Coletes',cap:'Bonés',mug:'Canecas',bottle:'Garrafas',tote:'Sacos de pano',cooler:'Bolsas térmicas',pen:'Canetas',keychain:'Porta-chaves'};
const SUB_ORDER=['tshirt','polo','hoodie','shirt','apron','vest','cap','mug','bottle','tote','cooler','pen','keychain'];
const INFO={
  polo:{d:'Polo em piqué de algodão com gola e punhos em malha canelada e três botões. O clássico do fardamento corporativo.',m:'Piqué 100% algodão, 210 g/m²',t:'XS a XXL'},
  tshirt:{d:'T-shirt de algodão com gola redonda. A base ideal para eventos, equipas e merchandising.',m:'Jersey 100% algodão, 150 g/m²',t:'XS a XXL'},
  hoodie:{d:'Sweat com capuz e bolso canguru, interior cardado. Conforto e muita área para marcar.',m:'80% algodão / 20% poliéster, 280 g/m²',t:'XS a XXL'},
  vest:{d:'Colete acolchoado com fecho, leve e quente. Muito usado por equipas no terreno.',m:'Exterior em poliéster com enchimento acolchoado',t:'XS a XXL'},
  shirt:{d:'Camisa de manga comprida para fardamento de sala e receção. Fácil de lavar e engomar.',m:'65% poliéster / 35% algodão',t:'XS a XXL'},
  apron:{d:'Avental de cintura com três bolsos, pensado para restauração e cafetaria.',m:'Sarja poliéster/algodão, 240 g/m²',t:'70 × 35 cm'},
  cap:{d:'Boné de 5 painéis com fecho ajustável. Fica perfeito com bordado frontal.',m:'100% algodão escovado',t:'Tamanho único ajustável'},
  cooler:{d:'Saco térmico para refeições, com fecho e alças. Ótimo brinde para campanhas.',m:'Poliéster com interior térmico',t:'26 × 16 × 18 cm'},
  tote:{d:'Saco de algodão com alças longas: o brinde reutilizável mais pedido.',m:'Algodão 140 g/m²',t:'38 × 42 cm'},
  mug:{d:'Caneca de cerâmica de 330 ml com impressão resistente à máquina de lavar loiça.',m:'Cerâmica',t:'330 ml · Ø 8 × 9,5 cm'},
  bottle:{d:'Garrafa transparente com tampa metálica e pega, reutilizável. O logótipo fica em destaque no corpo.',m:'Corpo transparente e tampa em aço inoxidável',t:'500 ml'},
  keychain:{d:'Porta-chaves redondo em vinil com argola metálica, impresso a cores.',m:'Vinil e argola metálica',t:'Ø 5 cm'},
  pen:{d:'Caneta metálica com ponteira touch para ecrãs e escrita azul.',m:'Alumínio',t:'13,5 cm'}
};
const FEATURED=['polo','bottle','mug','shirt','cap','keychain'];
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const fromPrice=(id,q=100)=>{const p=prod(id);return calc(newCfg(id,{qty:q,sizes:p.sizes?defaultSizes(q):null,logo:null})).unit};
const inPromo=id=>PROMOS[0].itens.some(i=>i.pid===id);
S.fav=new Set();S.cf={q:'',cats:[],max:25,tech:[],fav:false,sort:'rel'};S.reviews={};S.ptab='desc';
const HEART_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.3 3.3 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.7 0 5.8 3.8 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>';
const thumb=(id)=>{const p=prod(id);if(PHOTO[id])return photoMock(id,newCfg(id));return p.img?`<img src="${IMG[p.img]}" alt="" loading="lazy">`:mock(id,p.cores[0],'f',newCfg(id)).replace('<svg ','<svg class="mk" ')};
function pcard(id){
  const p=prod(id),badge=inPromo(id)?'<span class="pbadge promo">Promo</span>':id==='keychain'?'<span class="pbadge novo">Novo</span>':FEATURED.includes(id)?'<span class="pbadge">Destaque</span>':'';
  return `<div class="pcard" data-pick="${id}"><div class="pimg">${badge}<button class="fav ${S.fav.has(id)?'on':''}" data-fav="${id}" aria-label="Favorito">${HEART_SVG}</button>${thumb(id)}</div>
  <div class="pbd"><span class="pcat">${esc(p.cat)} · ${esc(SUB[id])}</span><b>${esc(p.n)}</b><span class="sku">Ref.: ${SKU[id]}</span>
  <div class="pp"><strong>${eur(fromPrice(id))}</strong>por unidade</div><span class="pn">Valor para 100 peças · <em>já com personalização</em></span>
  <button class="btn gho sm">Personalizar</button></div></div>`;
}
function updFav(){
  $('favN').textContent=S.fav.size;
  document.querySelectorAll('[data-fav]').forEach(b=>b.classList.toggle('on',S.fav.has(b.dataset.fav)));
  if(S.cfg&&$('pgFav')){const on=S.fav.has(S.cfg.pid);$('pgFav').classList.toggle('on',on);$('pgFav').textContent=on?'♥ Nos seus favoritos':'♡ Adicionar aos favoritos'}
}
document.addEventListener('click',e=>{
  const f=e.target.closest('[data-fav]');if(!f)return;e.stopPropagation();e.preventDefault();
  const id=f.dataset.fav;S.fav.has(id)?S.fav.delete(id):S.fav.add(id);updFav();toast(S.fav.has(id)?'♥ Adicionado aos favoritos':'Removido dos favoritos');
},true);

/* ---------- Início: slider, categorias, buscador, destaques ---------- */
S.hs=0;let hsT=null;
function hsGo(i){const sl=document.querySelectorAll('#hs .slide');S.hs=(i+sl.length)%sl.length;sl.forEach((s,k)=>s.classList.toggle('on',k===S.hs));document.querySelectorAll('#hsDots button').forEach((d,k)=>d.classList.toggle('on',k===S.hs));clearInterval(hsT);hsT=setInterval(()=>hsGo(S.hs+1),6500)}
function initHome(){
  $('hsDots').innerHTML=[...document.querySelectorAll('#hs .slide')].map((_,i)=>`<button data-hsi="${i}" aria-label="Slide ${i+1}"></button>`).join('');
  $('hs').addEventListener('click',e=>{const a=e.target.closest('[data-hs]');if(a)hsGo(S.hs+ +a.dataset.hs);const d=e.target.closest('[data-hsi]');if(d)hsGo(+d.dataset.hsi)});
  hsGo(0);
  $('catRail').innerHTML=SUB_ORDER.map(id=>`<button class="circ" data-pick="${id}"><div class="ring"><div class="in">${thumb(id).replace(' class="mk"','')}</div></div><span>${SUB[id]}</span></button>`).join('');
  const cats=[...new Set(PRODUCTS.map(p=>p.cat))];
  $('fCat').innerHTML='<option value="">Todas as categorias</option>'+cats.map(c=>`<option>${c}</option>`).join('');
  $('fTech').innerHTML='<option value="">Todas as técnicas</option>'+Object.keys(TECH).map(t=>`<option value="${t}">${TECH[t].n}</option>`).join('');
  $('fMax').addEventListener('input',e=>$('fMaxL').textContent=`até ${e.target.value} €`);
  $('fGo').addEventListener('click',()=>{S.cf={q:'',cats:$('fCat').value?[$('fCat').value]:[],max:+$('fMax').value,tech:$('fTech').value?[$('fTech').value]:[],fav:false,sort:'pa'};go('catalogo')});
  $('destGrid').innerHTML=FEATURED.map(pcard).join('');
}
document.addEventListener('click',e=>{
  const j=e.target.closest('[data-jump]');if(j){e.preventDefault();closeDD();const id=j.dataset.jump;if(!$('t-inicio').classList.contains('on'))go('inicio');setTimeout(()=>{const el=$(id);if(el)window.scrollTo({top:el.getBoundingClientRect().top+scrollY-140,behavior:'smooth'})},60);return}
  const q=e.target.closest('[data-quote]');if(q){e.preventDefault();openQuote(false)}
});

/* ---------- Menu de categorias ---------- */
function closeDD(){$('dd').classList.remove('on')}
function buildDD(){
  const cats=[...new Set(PRODUCTS.map(p=>p.cat))];
  $('ddMenu').innerHTML=cats.map(c=>`<div class="grp2"><button class="gh" data-ccat="${c}">${c} →</button>${PRODUCTS.filter(p=>p.cat===c).map(p=>`<button class="it" data-pick="${p.id}"><span class="sm">${mock(p.id,p.cores[0])}</span>${esc(p.n)}</button>`).join('')}</div>`).join('');
}
$('ddBtn').addEventListener('click',e=>{e.stopPropagation();const dd=$('dd'),on=!dd.classList.contains('on');dd.classList.toggle('on',on);if(on){const r=$('ddBtn').getBoundingClientRect(),m=$('ddMenu');m.style.left=Math.min(r.left,innerWidth-340)+'px';m.style.top=r.bottom+'px';m.style.maxHeight=(innerHeight-r.bottom-20)+'px';m.style.overflowY='auto'}});
document.addEventListener('click',e=>{if(!e.target.closest('#dd'))closeDD();const c=e.target.closest('[data-ccat]');if(c){closeDD();S.cf={q:'',cats:[c.dataset.ccat],max:25,tech:[],fav:false,sort:'rel'};go('catalogo')}if(e.target.closest('#ddMenu [data-pick]'))closeDD()});
addEventListener('scroll',()=>closeDD(),{passive:true});

/* ---------- Pesquisa ---------- */
function searchHits(q){const n=norm(q).trim();if(!n)return [];return PRODUCTS.filter(p=>norm(p.n+' '+p.cat+' '+SUB[p.id]+' '+p.techs.join(' ')).includes(n))}
$('q').addEventListener('input',()=>{const hits=searchHits($('q').value).slice(0,6),s=$('sugg');
  if(!$('q').value.trim()){s.classList.remove('on');return}
  s.innerHTML=(hits.length?hits.map(p=>`<button data-pick="${p.id}"><span class="sm">${thumb(p.id).replace(' class="mk"','')}</span><span>${esc(p.n)}<small>desde ${eur(fromPrice(p.id,500))}/un.</small></span></button>`).join(''):'<button disabled>Nenhum produto encontrado</button>')+`<button class="all" id="qAll">Ver todos os resultados →</button>`;
  s.classList.add('on')});
const doSearch=()=>{S.cf={q:$('q').value.trim(),cats:[],max:25,tech:[],fav:false,sort:'rel'};$('sugg').classList.remove('on');go('catalogo')};
$('q').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch();if(e.key==='Escape')$('sugg').classList.remove('on')});
$('qGo').addEventListener('click',doSearch);
document.addEventListener('click',e=>{if(e.target.id==='qAll'){doSearch();return}if(!e.target.closest('.search'))$('sugg').classList.remove('on');if(e.target.closest('#sugg [data-pick]')){$('sugg').classList.remove('on');$('q').value=''}});
/* ---------- Funcionalidades ainda não ativas: aviso "Brevemente" ---------- */
const SOON={acc:{t:'Área de cliente',d:'Estamos a preparar a sua área de cliente: histórico de encomendas, logótipos guardados e repetir encomendas com um clique.'}};
function openSoon(k){const x=SOON[k]||{t:'Nova funcionalidade',d:'Esta área está em desenvolvimento.'};$('soonT').textContent=x.t;$('soonD').textContent=x.d;$('soon').classList.add('on')}
function closeSoon(){$('soon').classList.remove('on')}
$('hAcc').addEventListener('click',()=>openSoon('acc'));
document.addEventListener('click',e=>{const d=e.target.closest('[data-soon]');if(d){e.preventDefault();openSoon(d.dataset.soon);return}if(e.target.id==='soon'||e.target.closest('[data-soon-x]'))closeSoon();if(e.target.closest('#soonQ')){closeSoon();openQuote(false)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSoon()});
$('hFav').addEventListener('click',()=>{S.cf={q:'',cats:[],max:25,tech:[],fav:true,sort:'rel'};go('catalogo')});
$('quickQ').addEventListener('click',()=>openQuote($('t-loja').classList.contains('on')));

/* ---------- Catálogo ---------- */
function renderCatalog(){
  const cf=S.cf,cats=[...new Set(PRODUCTS.map(p=>p.cat))];
  $('cQ').value=cf.q;$('cMax').value=cf.max;$('cMaxL').textContent=`até ${cf.max} €`;$('cFav').checked=cf.fav;$('cSort').value=cf.sort;
  $('cCats').innerHTML=cats.map(c=>`<label><input type="checkbox" value="${c}" ${cf.cats.includes(c)?'checked':''}>${c}<small>${PRODUCTS.filter(p=>p.cat===c).length}</small></label>`).join('');
  $('cTech').innerHTML=Object.keys(TECH).map(t=>`<label><input type="checkbox" value="${t}" ${cf.tech.includes(t)?'checked':''}>${TECH[t].n}</label>`).join('');
  let list=PRODUCTS.filter(p=>(!cf.q||searchHits(cf.q).includes(p))&&(!cf.cats.length||cf.cats.includes(p.cat))&&fromPrice(p.id)<=cf.max&&(!cf.tech.length||p.techs.some(t=>cf.tech.includes(t)))&&(!cf.fav||S.fav.has(p.id)));
  if(cf.sort==='pa')list.sort((a,b)=>fromPrice(a.id)-fromPrice(b.id));
  if(cf.sort==='pd')list.sort((a,b)=>fromPrice(b.id)-fromPrice(a.id));
  if(cf.sort==='az')list.sort((a,b)=>a.n.localeCompare(b.n,'pt'));
  const title=cf.fav?'Os seus favoritos':cf.q?`Resultados para "${cf.q}"`:cf.cats.length===1?cf.cats[0]:'Todos os produtos';
  $('cTitle').textContent=title;$('cCrumb').textContent=title;$('cCount').textContent=`${list.length} produto${list.length===1?'':'s'}`;
  $('cGrid').innerHTML=list.length?list.map(p=>pcard(p.id)).join(''):`<div class="noprod">${cf.fav?'Ainda não tem favoritos. Toque no ♡ de um produto para o guardar.':'Nenhum produto corresponde aos filtros.'}<br><button class="btn gho sm" id="cClear2" style="margin-top:12px">Limpar filtros</button></div>`;
}
const cfRead=()=>{S.cf.q=$('cQ').value.trim();S.cf.max=+$('cMax').value;S.cf.fav=$('cFav').checked;S.cf.sort=$('cSort').value;
  S.cf.cats=[...document.querySelectorAll('#cCats input:checked')].map(i=>i.value);S.cf.tech=[...document.querySelectorAll('#cTech input:checked')].map(i=>i.value);renderCatalog()};
['cQ','cMax'].forEach(id=>$(id).addEventListener('input',()=>{clearTimeout(cfRead._t);cfRead._t=setTimeout(cfRead,150)}));
['cCats','cTech','cFav','cSort'].forEach(id=>$(id).addEventListener('change',cfRead));
document.addEventListener('click',e=>{if(e.target.id==='cClear'||e.target.id==='cClear2'){S.cf={q:'',cats:[],max:25,tech:[],fav:false,sort:'rel'};renderCatalog()}});

/* ---------- Página de produto ---------- */
function renderPP(full){
  const c=S.cfg,p=prod(c.pid);
  if(full){
    $('pgName').textContent=p.n;$('pgCat').textContent=p.cat;$('pgSku').textContent=SKU[p.id];
    const b=inPromo(p.id)?'Promoção':p.id==='keychain'?'Novidade':FEATURED.includes(p.id)?'Destaque':'';$('pgBadge').textContent=b;$('pgBadge').style.display=b?'':'none';
    renderPTabs();
  }
  const base={...c,logo:null};
  $('pgFrom').textContent=eur(calc({...base,qty:500}).unit);$('pgFromQ').textContent='500';
  const cur=calc(c).q;
  $('tierTbl').innerHTML=TIERS.map((t,i)=>{const nx=TIERS[i+1],on=cur>=t.min&&(!nx||cur<nx.min);const r=calc({...base,qty:t.min});
    return `<button class="tr ${on?'on':''}" data-tq="${t.min}"><span class="tq">${t.min}+ unidades</span>${t.min===100?'<span class="hot">Mais pedido</span>':''}<span class="tp">${eur(r.unit)}</span><span class="tu">/ un.</span></button>`}).join('');
  $('b3d').textContent=S.is3d?'Ver 2D':'Ver 3D';
  updFav();
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-tq]');if(t){const n=+t.dataset.tq,c=S.cfg,p=prod(c.pid);c.qty=n;if(p.sizes)c.sizes=defaultSizes(n);renderBuilder(true);return}
  if(e.target.id==='pgFav'){const id=S.cfg.pid;S.fav.has(id)?S.fav.delete(id):S.fav.add(id);updFav();return}
});
$('pgCat').addEventListener('click',()=>{S.cf={q:'',cats:[prod(S.cfg.pid).cat],max:25,tech:[],fav:false,sort:'rel'}},true);
$('b3d').addEventListener('click',()=>{S.pref3d=S.is3d;$('b3d').textContent=S.is3d?'Ver 2D':'Ver 3D'});
const _selectProduct=selectProduct;
// com fotografia-modelo disponível, o personalizador abre na fotografia (2D); o 3D fica no botão
selectProduct=function(pid,cfg){const sh=prod(pid).shape;if(PHOTO_OK.has(pid)&&S.pref3d!==true)S.is3d=false;else if(S.pref3d!==false&&V3.ok&&can3D(sh))S.is3d=true;V3.key='';S.ptab='desc';_selectProduct(pid,cfg)};
function renderPTabs(){
  const p=prod(S.cfg.pid),rv=S.reviews[p.id]||[],info=INFO[p.id];
  const tabs=[['desc','Descrição'],['spec','Especificações'],['pers','Personalização'],['rev',`Avaliações (${rv.length})`]];
  $('ptNav').innerHTML=tabs.map(([k,l])=>`<button class="${S.ptab===k?'on':''}" data-pt="${k}">${l}</button>`).join('');
  let h='';
  if(S.ptab==='desc')h=`<h3>${esc(p.n)}</h3><p>${esc(info.d)}</p><ul class="vlist" style="max-width:720px"><li><b>Preço já com personalização:</b> o valor por peça inclui a técnica escolhida.</li><li><b>Prova de arte digital</b> antes de produzirmos.</li><li><b>Recolha grátis em Rio Tinto</b> ou envio para todo o país.</li></ul>`;
  if(S.ptab==='spec')h=`<h3>Especificações</h3><div class="spec"><div>Referência</div><div>${SKU[p.id]}</div><div>Material</div><div>${esc(info.m)}</div><div>${p.sizes?'Tamanhos':'Dimensões'}</div><div>${esc(info.t)}</div><div>Cores disponíveis</div><div class="swatches" style="gap:6px">${p.cores.map(c=>`<span class="dot" title="${CN[c]||c}" style="background:${c};width:18px;height:18px"></span>`).join('')}</div><div>Técnicas</div><div>${p.techs.map(t=>TECH[t].n).join(', ')}</div><div>Posições de marcação</div><div>${Object.keys(POS[p.shape]).join(', ')}</div><div>Origem</div><div>${esc(p.src)}</div></div><p class="faint" style="font-size:12.5px">Especificações de exemplo, a confirmar com o fornecedor.</p>`;
  if(S.ptab==='pers')h=`<h3>Personalização</h3><div class="spec">${p.techs.map(t=>`<div>${TECH[t].n}</div><div>${TECH[t].desc} · produção em ${TECH[t].days} dias úteis${TECH[t].setup?` · preparação ${eur(TECH[t].setup)} por posição`:' · sem custo de preparação'}</div>`).join('')}</div><p style="margin-top:14px">Carregue o logótipo no painel da imagem: o fundo branco é removido automaticamente e a arte fica posicionada na peça. A nossa equipa valida tudo antes de produzir.</p>`;
  if(S.ptab==='rev')h=`<h3>Avaliações</h3>${rv.length?rv.map(r=>`<div class="rev"><span class="st">${'★'.repeat(r.s)}${'☆'.repeat(5-r.s)}</span> · <b>${esc(r.n)}</b><p style="margin:6px 0 0">${esc(r.t)}</p></div>`).join(''):`<p>Ainda não há avaliações. Seja o primeiro a avaliar “${esc(p.n)}”.</p>`}
    <form id="revForm" style="max-width:640px;margin-top:16px"><label class="fl">A sua avaliação *</label><div class="stars" id="revStars">${[1,2,3,4,5].map(i=>`<button type="button" data-st="${i}">★</button>`).join('')}</div>
    <label class="fl" for="revT">Comentário *</label><textarea id="revT"></textarea><div class="fgrid" style="margin-top:12px"><div><label class="fl" for="revN">Nome *</label><input type="text" id="revN"></div><div><label class="fl" for="revE">Email *</label><input type="email" id="revE"></div></div>
    <div class="fhint err" id="revErr"></div><button class="btn pri" style="margin-top:6px">Enviar avaliação</button></form>`;
  $('ptBody').innerHTML=h;S.revStars=0;
}
$('ptNav').addEventListener('click',e=>{const b=e.target.closest('[data-pt]');if(!b)return;S.ptab=b.dataset.pt;renderPTabs()});
$('ptBody').addEventListener('click',e=>{const s=e.target.closest('[data-st]');if(!s)return;S.revStars=+s.dataset.st;document.querySelectorAll('#revStars button').forEach(b=>b.classList.toggle('on',+b.dataset.st<=S.revStars))});
$('ptBody').addEventListener('submit',e=>{e.preventDefault();const t=$('revT').value.trim(),n=$('revN').value.trim(),m=$('revE').value.trim();
  if(!S.revStars||t.length<3||!n||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)){$('revErr').textContent='Preencha a classificação, o comentário, o nome e um email válido.';return}
  (S.reviews[S.cfg.pid]??=[]).unshift({s:S.revStars,t,n});renderPTabs();toast('✓ Obrigado pela avaliação')});

/* ---------- Pedido de orçamento com logótipo e pré-visualização ---------- */
const svgURL=svg=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
let Q=null;
function openQuote(withProduct){
  closeDD();Q={files:[],prod:null};
  if(withProduct&&S.cfg){
    const c=S.cfg,p=prod(c.pid),r=calc(c),hasB=c.positions.some(k=>POS[p.shape][k].v==='b');
    Q.files.push({src:svgURL(mock(c.pid,c.color,'f',c)),label:'Pré-visualização (frente)'});
    if(hasB)Q.files.push({src:svgURL(mock(c.pid,c.color,'b',c)),label:'Pré-visualização (costas)'});
    if(S.is3d&&V3.r){try{V3.r.render(V3.scene,V3.cam);Q.files.push({src:V3.r.domElement.toDataURL('image/png'),label:'Vista 3D'})}catch(err){}}
    if(c.logo&&!isDef(c.logo))Q.files.push({src:c.logo,label:S.bgRemoved?'Logótipo (fundo removido)':'Logótipo',logo:true});
    Q.prod={n:p.n,q:r.q,total:r.total,unit:r.unit,txt:`${r.q} × ${p.n} · ${CN[c.color]||c.color} · ${TECH[c.tech].n} · ${c.positions.join(' + ')}${c.text?' · texto "'+c.text+'"':''}${c.names?' · com nomes':''}${c.express?' · expresso':''}`};
    $('qSum').innerHTML=`<div class="qsum">${Q.files.map(f=>`<div class="qi ${f.logo?'logo':''}"><img src="${f.src}" alt="">${esc(f.label)}</div>`).join('')}
      ${c.logo&&!isDef(c.logo)?'':'<div class="qi" style="display:flex;align-items:center;justify-content:center;color:var(--warn)">Sem logótipo: pode anexá-lo depois por email</div>'}
      <div class="qdet"><div class="rw"><span class="muted">Pedido</span><span style="text-align:right">${esc(Q.prod.txt)}</span></div><div class="rw"><span class="muted">Estimativa da loja</span><span>${eur(r.sub)} + IVA (${eur(r.unit)}/un.)</span></div></div></div>`;
  }else $('qSum').innerHTML=`<div class="qdet" style="margin-bottom:18px">Pedido geral: descreva o que precisa nas observações. Para anexar o logótipo e a pré-visualização automaticamente, abra um produto e use "Pedir orçamento com este logótipo".</div>`;
  $('qErr').textContent='';$('qmodal').classList.add('on');document.body.style.overflow='hidden';
}
function closeQuote(){$('qmodal').classList.remove('on');document.body.style.overflow=''}
$('qX').addEventListener('click',closeQuote);
$('qmodal').addEventListener('click',e=>{if(e.target.id==='qmodal')closeQuote();if(e.target.id==='qDone')closeQuote()});
$('qForm').addEventListener('submit',e=>{
  e.preventDefault();const v=id=>$(id).value.trim();
  if(v('qNome').length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('qEmail'))||!$('qRgpd').checked){$('qErr').textContent='Indique o nome, um email válido e aceite o tratamento de dados.';return}
  const ref='ORC-'+String(Date.now()).slice(-5);
  S.leads.unshift({ref,nome:v('qNome'),emp:v('qEmp'),serv:Q.prod?Q.prod.txt:'Pedido geral',qtd:Q.prod?String(Q.prod.q):'—',hora:new Date().toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'}),files:Q.files});
  $('qSum').innerHTML='';
  $('qForm').insertAdjacentHTML('beforebegin',`<div class="okmsg" id="qOk"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></div><h2 style="font-size:40px">Pedido <span class="gt">${ref}</span> enviado</h2><p class="muted">Recebe a confirmação em ${esc(v('qEmail'))}. ${Q.files.length?`Seguiram ${Q.files.length} anexo(s): pré-visualização${Q.files.some(f=>f.logo)?' e logótipo':''}.`:''}</p><p class="faint" style="font-size:12.5px">No site real: o pedido e os anexos ficam guardados na base de dados e a equipa recebe o alerta por email.</p><button class="btn gho" id="qDone">Fechar</button></div>`);
  $('qForm').style.display='none';renderPanel();toast('✓ Pedido de orçamento enviado');
  const reset=()=>{const ok=$('qOk');if(ok)ok.remove();$('qForm').style.display='';$('qForm').reset()};
  const obs=new MutationObserver(()=>{if(!$('qmodal').classList.contains('on')){reset();obs.disconnect()}});obs.observe($('qmodal'),{attributes:true});
});
document.addEventListener('click',e=>{const im=e.target.closest('.thumbs img');if(!im)return;$('lbImg').src=im.src;$('lbCap').textContent=im.alt;$('lb').classList.add('on')});

/* =========================================================
   3D MELHORADO: peças com volume, detalhes e sombra
   ========================================================= */
const DET={
  tshirt:{f:['M86 22 Q100 36 114 22','M44 86 L56 76','M156 86 L144 76'],b:['M86 22 Q100 28 114 22']},
  polo:{f:['M86 22 L93 45 L100 38 L107 45 L114 22','M100 38 V68','M44 86 L56 76','M156 86 L144 76'],b:['M86 22 Q100 30 114 22']},
  hoodie:{f:['M80 44 Q100 64 120 44','M92 58 V76','M108 58 V76','M72 140 L128 140 L122 168 L78 168 Z'],b:['M68 38 Q100 74 132 38']},
  vest:{f:['M100 50 V182','M54 96 H146','M54 118 H146','M54 140 H146','M54 162 H146'],b:['M54 96 H146','M54 118 H146','M54 140 H146','M54 162 H146']},
  shirt:{f:['M86 22 L92 40 L100 34 L108 40 L114 22','M100 36 V184','M116 66 H140 V92 Q128 96 116 92 Z'],b:['M50 54 Q100 64 150 54']},
  keychain:{f:[],b:[]}
};
V3.geo={};let NOISE=null;
function noiseTex(){if(NOISE)return NOISE;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),d=x.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const v=112+Math.random()*32;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);NOISE=new THREE.CanvasTexture(c);NOISE.wrapS=NOISE.wrapT=THREE.RepeatWrapping;NOISE.repeat.set(16,16);return NOISE}
function texCanvas(sh,cfg,view){
  const W=1024,k=W/200,cv=document.createElement('canvas');cv.width=cv.height=W;const x=cv.getContext('2d');
  x.fillStyle=cfg.color;x.fillRect(0,0,W,W);
  const g=x.createLinearGradient(0,0,0,W);g.addColorStop(0,'rgba(255,255,255,.06)');g.addColorStop(1,'rgba(0,0,0,.1)');x.fillStyle=g;x.fillRect(0,0,W,W);
  x.save();x.scale(k,k);x.strokeStyle=isDark(cfg.color)?'rgba(255,255,255,.3)':'rgba(0,0,0,.26)';x.lineWidth=1.3;x.lineJoin='round';x.lineCap='round';
  ((DET[sh]||{})[view]||[]).forEach(d=>x.stroke(new Path2D(d)));
  x.fillStyle=x.strokeStyle;
  if(sh==='polo'&&view==='f')[51,60].forEach(y=>{x.beginPath();x.arc(100,y,1.7,0,7);x.fill()});
  if(sh==='shirt'&&view==='f')[56,80,104,128,152].forEach(y=>{x.beginPath();x.arc(104,y,1.8,0,7);x.fill()});
  if(sh==='vest'&&view==='f'){x.fillStyle='#ffc832';x.fillRect(97,118,6,12)}
  x.restore();x.drawImage(flatCanvas(sh,cfg,view),0,0);return cv;
}
const plainCanvas=col=>{const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');x.fillStyle=col;x.fillRect(0,0,16,16);return c};
function garmentGeo(sh){
  if(V3.geo[sh])return V3.geo[sh];
  const poly=pathShape(SIL[sh]).getSpacedPoints(360).map(p=>[p.x,p.y]);
  let minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9;poly.forEach(([x,y])=>{minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)});
  const N=110,sx=(maxX-minX)/N,sy=(maxY-minY)/N,M=poly.length;
  const inside=(x,y)=>{let c=false;for(let i=0,j=M-1;i<M;j=i++){const a=poly[i],b=poly[j];if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))c=!c}return c};
  const near=(x,y)=>{let best=1e18,bx=x,by=y;for(let i=0,j=M-1;i<M;j=i++){const x1=poly[j][0],y1=poly[j][1],dx=poly[i][0]-x1,dy=poly[i][1]-y1,L=dx*dx+dy*dy||1;let t=((x-x1)*dx+(y-y1)*dy)/L;t=t<0?0:t>1?1:t;const px=x1+t*dx,py=y1+t*dy,d=(x-px)*(x-px)+(y-py)*(y-py);if(d<best){best=d;bx=px;by=py}}return [Math.sqrt(best),bx,by]};
  const idx=new Int32Array((N+1)*(N+1)).fill(-1),P=[];
  for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const x=minX+i*sx,y=minY+j*sy;if(inside(x,y)){idx[j*(N+1)+i]=P.length;P.push([x,y])}}
  const id=(i,j)=>idx[j*(N+1)+i],tris=[];
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=id(i,j),b=id(i+1,j),c=id(i+1,j+1),d=id(i,j+1);
    if(a>=0&&b>=0&&c>=0&&d>=0)tris.push([a,b,c],[a,c,d]);
    else if(a>=0&&b>=0&&c>=0)tris.push([a,b,c]);else if(a>=0&&c>=0&&d>=0)tris.push([a,c,d]);else if(a>=0&&b>=0&&d>=0)tris.push([a,b,d]);else if(b>=0&&c>=0&&d>=0)tris.push([b,c,d])}
  const ec=new Map();tris.forEach(t=>{for(let k=0;k<3;k++){const u=t[k],v=t[(k+1)%3],key=u<v?u*1e6+v:v*1e6+u,e=ec.get(key);if(e)e.n++;else ec.set(key,{u,v,n:1})}});
  const bnd=[...ec.values()].filter(e=>e.n===1),isB=new Uint8Array(P.length);bnd.forEach(e=>{isB[e.u]=1;isB[e.v]=1});
  const D=new Float32Array(P.length);P.forEach((p,k)=>{const r=near(p[0],p[1]);if(isB[k]){p[0]=r[1];p[1]=r[2];D[k]=0}else D[k]=r[0]});
  const T=2.5,B=sh==='keychain'?2:16,R=sh==='keychain'?6:34,zf=d=>T+B*Math.sin(Math.min(1,d/R)*Math.PI/2);
  const n=P.length,pos=new Float32Array(n*6),uv=new Float32Array(n*4);
  P.forEach((p,k)=>{const z=zf(D[k]);pos[k*3]=p[0];pos[k*3+1]=p[1];pos[k*3+2]=z;pos[(n+k)*3]=p[0];pos[(n+k)*3+1]=p[1];pos[(n+k)*3+2]=-z;
    uv[k*2]=(p[0]+100)/200;uv[k*2+1]=(p[1]+100)/200;uv[(n+k)*2]=(100-p[0])/200;uv[(n+k)*2+1]=(p[1]+100)/200});
  const front=[],back=[],side=[];tris.forEach(t=>{front.push(t[0],t[1],t[2]);back.push(n+t[0],n+t[2],n+t[1])});
  bnd.forEach(e=>side.push(e.u,e.v,n+e.v,e.u,n+e.v,n+e.u));
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  g.setIndex([...front,...back,...side]);g.addGroup(0,front.length,0);g.addGroup(front.length,back.length,1);g.addGroup(front.length+back.length,side.length,2);
  g.computeVertexNormals();g.userData.keep=true;V3.geo[sh]=g;return g;
}
init3D=function(){
  if(V3.r)return true;if(!V3.ok)return false;
  const el=$('stage3d');
  try{V3.r=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true})}catch(err){V3.ok=false;return false}
  V3.r.setPixelRatio(Math.min(devicePixelRatio||1,2));V3.r.outputEncoding=THREE.sRGBEncoding;el.appendChild(V3.r.domElement);
  V3.scene=new THREE.Scene();V3.cam=new THREE.PerspectiveCamera(30,1,.1,100);V3.cam.position.set(0,.55,6.6);V3.cam.lookAt(0,-.08,0);
  V3.scene.add(new THREE.HemisphereLight(0xffffff,0x8d96a8,.8));
  const k1=new THREE.DirectionalLight(0xffffff,.85);k1.position.set(3,4,6);V3.scene.add(k1);
  const k2=new THREE.DirectionalLight(0xbfd6ff,.5);k2.position.set(-5,3,-5);V3.scene.add(k2);
  const k3=new THREE.DirectionalLight(0xffffff,.25);k3.position.set(-5,-1,3);V3.scene.add(k3);
  const sc=document.createElement('canvas');sc.width=sc.height=128;const sx=sc.getContext('2d'),gr=sx.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(0,0,0,.6)');gr.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=gr;sx.fillRect(0,0,128,128);
  const shd=new THREE.Mesh(new THREE.PlaneGeometry(2.8,2.8),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc),transparent:true,depthWrite:false}));shd.rotation.x=-Math.PI/2;shd.position.y=-1.18;V3.scene.add(shd);
  V3.grp=new THREE.Group();V3.scene.add(V3.grp);
  el.addEventListener('pointerdown',e=>{V3.drag={x:e.clientX,y:e.clientY,ry:V3.rotY,rx:V3.rotX};V3.target=null;el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',e=>{if(!V3.drag)return;V3.rotY=V3.drag.ry+(e.clientX-V3.drag.x)*.011;V3.rotX=Math.max(-.45,Math.min(.45,V3.drag.rx+(e.clientY-V3.drag.y)*.006))});
  const up=()=>{V3.drag=null;V3.idle=performance.now()};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  if(window.ResizeObserver)new ResizeObserver(size3D).observe(el);
  return true;
};
clear3D=function(){while(V3.grp.children.length){const o=V3.grp.children.pop();o.traverse(m=>{if(m.geometry&&!m.geometry.userData.keep)m.geometry.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(mt=>{if(mt.map)mt.map.dispose();mt.dispose()})})}};
build3D=function(){
  if(!V3.r)return;const c=S.cfg,p=prod(c.pid),sh=p.shape;
  const key=[c.pid,c.color,c.positions.join(),c.scale,c.text,c.textColor,(c.logo||'').length,(c.logo||'').slice(-40)].join('|');
  if(key===V3.key)return;V3.key=key;clear3D();V3.grp.position.set(0,0,0);
  if(SIL[sh]){
    const g=garmentGeo(sh),kc=sh==='keychain';
    const fm=new THREE.MeshStandardMaterial({map:tex(texCanvas(sh,c,'f')),roughness:kc?.2:.92,bumpMap:kc?null:noiseTex(),bumpScale:.035});
    const bm=new THREE.MeshStandardMaterial({map:tex(BACKS.includes(sh)?texCanvas(sh,c,'b'):plainCanvas(c.color)),roughness:kc?.2:.92,bumpMap:kc?null:noiseTex(),bumpScale:.035});
    const sm=new THREE.MeshStandardMaterial({color:linCol(c.color),roughness:kc?.2:.95,side:THREE.DoubleSide});
    V3.grp.add(new THREE.Mesh(g,[fm,bm,sm]));
    if(kc){const mt=new THREE.MeshStandardMaterial({color:linCol('#d7dde8'),metalness:.85,roughness:.22});const ring=new THREE.Mesh(new THREE.TorusGeometry(15,2.6,16,48),mt);ring.position.set(0,64,0);V3.grp.add(ring)}
    V3.grp.scale.setScalar(kc?.0135:.0115);if(kc)V3.grp.position.y=-.2;
  }else if(sh==='mug'){
    const R=48,H=110,col=linCol(c.color),inCol=new THREE.Color(c.color).multiplyScalar(.82).convertSRGBToLinear();
    V3.grp.add(new THREE.Mesh(new THREE.CylinderGeometry(R,R-2,H,96,1,true,Math.PI,Math.PI*2),new THREE.MeshStandardMaterial({map:tex(wrapCanvas(c,2*Math.PI*R,H,58,56)),roughness:.25})));
    const inner=new THREE.Mesh(new THREE.CylinderGeometry(R-3.5,R-5.5,H-4,72,1,true),new THREE.MeshStandardMaterial({color:inCol,roughness:.3,side:THREE.BackSide}));inner.position.y=2;V3.grp.add(inner);
    const inb=new THREE.Mesh(new THREE.CircleGeometry(R-5.5,48),new THREE.MeshStandardMaterial({color:inCol,roughness:.3}));inb.rotation.x=-Math.PI/2;inb.position.y=-H/2+4;V3.grp.add(inb);
    const gm=new THREE.MeshStandardMaterial({color:col,roughness:.25});
    const rim=new THREE.Mesh(new THREE.TorusGeometry(R-1.75,1.9,12,96),gm);rim.rotation.x=Math.PI/2;rim.position.y=H/2;V3.grp.add(rim);
    const bot=new THREE.Mesh(new THREE.CircleGeometry(R-2,48),gm);bot.rotation.x=Math.PI/2;bot.position.y=-H/2;V3.grp.add(bot);
    const h=new THREE.Mesh(new THREE.TorusGeometry(27,7.5,20,48,Math.PI),gm);h.rotation.z=-Math.PI/2;h.position.x=R-3;V3.grp.add(h);
    V3.grp.scale.setScalar(.0135);
  }else if(sh==='bottle'){
    const col=linCol(c.color),glass=c.color==='#e8f1f8',met=new THREE.MeshStandardMaterial(glass?{color:col,roughness:.08,transparent:true,opacity:.35,depthWrite:false}:{color:col,roughness:.3,metalness:.35});
    const body=new THREE.Mesh(new THREE.CylinderGeometry(22,22,118,72,1,true,Math.PI,Math.PI*2),new THREE.MeshStandardMaterial(c.color==='#e8f1f8'?{map:tex(wrapCanvas(c,2*Math.PI*22,118,34,54)),roughness:.08,metalness:0,transparent:true,side:THREE.DoubleSide,depthWrite:false}:{map:tex(wrapCanvas(c,2*Math.PI*22,118,34,54)),roughness:.3,metalness:.35}));body.position.y=-12;V3.grp.add(body);
    const sh2=new THREE.Mesh(new THREE.LatheGeometry([[22,0],[21.6,5],[19.5,10],[16.5,14],[14.5,17],[14,23]].map(([x,y])=>new THREE.Vector2(x,y)),72),met);sh2.position.y=47;V3.grp.add(sh2);
    const bot=new THREE.Mesh(new THREE.CircleGeometry(22,48),met);bot.rotation.x=Math.PI/2;bot.position.y=-71;V3.grp.add(bot);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(15.5,15.5,26,48),new THREE.MeshStandardMaterial({color:linCol('#aab2bf'),metalness:.75,roughness:.25}));cap.position.y=83;V3.grp.add(cap);
    V3.grp.scale.setScalar(.0135);
  }
};

/* =========================================================
   INFORMAÇÃO LEGAL · RGPD · COOKIES · LIVRO DE RECLAMAÇÕES
   Os campos marcados [a preencher] têm de ser completados
   com os dados reais da empresa antes de publicar.
   ========================================================= */
const EMPRESA={
  marca:'BDS · Blue Digital Store',
  denominacao:'Arrobas Enérgicas, Lda.',
  nif:'[a preencher]',
  morada:'Rua do Casal 106, Rio Tinto',
  cp:'[código postal a preencher] Rio Tinto (Gondomar)',
  email:'sales@bluedigital.store',
  tel:'+351 910 377 586',
  horario:'segunda a sexta, das 09:30 às 18:30 (sábado e domingo encerrado)',
  capital:'[a preencher]',
  registo:'[Conservatória do Registo Comercial a preencher]'
};
const PH=s=>s.startsWith('[')?`<span class="ph">${s}</span>`:s;
const PAG_TXT=MODO==='orcamento'
  ?'<p>Nesta fase, as encomendas são feitas por pedido de orçamento. Depois de o cliente aprovar a proposta e a prova de arte, a BDS envia um link de pagamento seguro (MB WAY, Multibanco ou cartão) ou os dados para transferência bancária. A produção começa após a confirmação do pagamento ou do adiantamento acordado.</p>'
  :'<p>Os pagamentos online são processados pela Viva (viva.com), através de uma página segura: MB WAY, referência Multibanco, cartão de crédito ou débito, Apple Pay e Google Pay. A BDS não tem acesso aos dados do seu cartão. Empresas podem pagar por transferência bancária, com adiantamento de 50% e o restante na entrega.</p>';
const LEGAL={
  termos:{t:'Termos e Condições',h:()=>`
    <p class="upd">Última atualização: ${PH('[data a preencher]')}</p>
    <h4>1. Identificação</h4><p>Este site é explorado por ${EMPRESA.denominacao}, com a marca ${EMPRESA.marca}, NIF ${PH(EMPRESA.nif)}, com sede em ${EMPRESA.morada}, ${PH(EMPRESA.cp)}. Contactos: ${EMPRESA.email} · ${EMPRESA.tel}.</p>
    <h4>2. Âmbito</h4><p>Estes termos aplicam-se aos pedidos de orçamento e às encomendas de produtos personalizados (têxteis, fardamento, brindes e estampagens) feitos através deste site, por clientes particulares e empresariais.</p>
    <h4>3. Produtos personalizados e prova de arte</h4><p>As pré-visualizações do site (incluindo a vista 3D) são indicativas. Antes de produzir, a BDS envia uma prova de arte, e a produção só começa após a aprovação do cliente. Pequenas variações de cor e de posição, próprias de cada técnica (DTF, bordado, serigrafia, laser, UV), não constituem defeito.</p><p>O cliente declara ter o direito de utilizar os logótipos, marcas e imagens que envia, e assume a responsabilidade por eventuais violações de direitos de terceiros.</p>
    <h4>4. Preços</h4><p>Os preços por peça são apresentados sem IVA. O total da encomenda mostra o IVA à taxa legal em vigor. Os orçamentos são válidos por ${PH('[n.º de dias a preencher]')} dias. Os portes e os custos de preparação (digitalização do bordado, telas de serigrafia) são indicados antes da confirmação.</p>
    <h4>5. Pagamento</h4>${PAG_TXT}
    <h4>6. Prazos de produção e entrega</h4><p>Os prazos indicados no site são estimativas em dias úteis e contam a partir da aprovação da arte e da confirmação do pagamento. A entrega é feita por recolha nas instalações em Rio Tinto ou por transportadora para todo o país.</p>
    <h4>7. Direito de livre resolução</h4><p>Os consumidores dispõem de 14 dias para resolver o contrato de produtos <b>não personalizados</b>, nos termos do Decreto-Lei n.º 24/2014. Esse direito não se aplica a bens produzidos segundo as especificações do cliente ou claramente personalizados (artigo 17.º do mesmo diploma), como é o caso das peças com logótipo, texto ou nomes.</p>
    <h4>8. Garantia e defeitos</h4><p>Os produtos beneficiam da garantia legal aplicável (Decreto-Lei n.º 84/2021, para consumidores). Qualquer defeito de produção deve ser comunicado após a receção, com fotografias. A BDS repõe as peças defeituosas ou reembolsa o valor correspondente.</p>
    <h4>9. Reclamações e litígios</h4><p>Pode reclamar através do <a href="https://www.livroreclamacoes.pt/Inicio/" target="_blank" rel="noopener">Livro de Reclamações Eletrónico</a> ou recorrer a uma entidade de resolução alternativa de litígios (ver a página <a href="#" data-legal="reclamacoes">Livro de Reclamações e litígios</a>).</p>
    <h4>10. Lei aplicável</h4><p>Aplica-se a lei portuguesa.</p>`},
  privacidade:{t:'Política de Privacidade (RGPD)',h:()=>`
    <p class="upd">Última atualização: ${PH('[data a preencher]')}</p>
    <h4>1. Responsável pelo tratamento</h4><p>${EMPRESA.denominacao} (${EMPRESA.marca}), NIF ${PH(EMPRESA.nif)}, ${EMPRESA.morada}. Para questões sobre dados pessoais: <b>${EMPRESA.email}</b>.</p>
    <h4>2. Que dados recolhemos</h4><ul><li>Identificação e contacto: nome, empresa, email, telefone.</li><li>Faturação e entrega: NIF, morada.</li><li>Ficheiros que envia: logótipos, imagens e textos para personalização.</li><li>Dados da encomenda e da comunicação connosco (formulários, email, WhatsApp).</li></ul>
    <h4>3. Para que usamos e com que fundamento</h4><ul><li>Responder a pedidos de orçamento e executar encomendas: diligências pré-contratuais e execução do contrato (art. 6.º, n.º 1, al. b) do RGPD).</li><li>Emitir faturas e cumprir obrigações fiscais: obrigação legal (al. c)).</li><li>Enviar novidades e promoções, apenas se der o seu consentimento, que pode retirar a qualquer momento (al. a)).</li></ul>
    <h4>4. Durante quanto tempo</h4><p>Os pedidos de orçamento que não resultem em encomenda são apagados ao fim de ${PH('[prazo a preencher]')}. Os documentos de faturação são guardados pelo prazo legal de 10 anos. Os ficheiros de arte são guardados enquanto forem úteis para repetir encomendas, salvo pedido de eliminação.</p>
    <h4>5. Quem tem acesso</h4><p>Apenas a equipa BDS e prestadores de serviços que tratam dados por nossa conta, com contrato e garantias adequadas: alojamento do site, email, programa de faturação${MODO==='completo'?' e a Viva, para os pagamentos':''}, e transportadoras, quando há envio. Não vendemos dados pessoais.</p>
    <h4>6. Os seus direitos</h4><p>Pode pedir o acesso, a retificação, o apagamento, a limitação, a portabilidade e opor-se ao tratamento dos seus dados, bem como retirar o consentimento, escrevendo para ${EMPRESA.email}. Respondemos no prazo máximo de um mês. Tem também o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (<a href="https://www.cnpd.pt" target="_blank" rel="noopener">www.cnpd.pt</a>).</p>
    <h4>7. Segurança</h4><p>O site usa ligação cifrada (HTTPS), e o acesso aos dados é restrito e protegido por palavra-passe.</p>`},
  cookies:{t:'Política de Cookies',h:()=>`
    <p class="upd">Última atualização: ${PH('[data a preencher]')}</p>
    <p>Cookies são pequenos ficheiros guardados no seu navegador. Este site usa apenas:</p>
    <ul><li><b>Essenciais:</b> guardam a sua escolha sobre cookies e o funcionamento do carrinho e dos formulários. Não precisam de consentimento.</li><li><b>Serviços externos:</b> os tipos de letra são carregados a partir do Google Fonts, o que implica o envio do seu endereço IP à Google.</li></ul>
    <p>Não usamos cookies de publicidade. Se, no futuro, forem usadas ferramentas de estatística, só serão ativadas com o seu consentimento.</p>
    <p><button class="btn gho sm" id="ckReopen">Alterar a minha escolha</button></p>`},
  envios:{t:'Envios, trocas e devoluções',h:()=>`
    <h4>Recolha e envio</h4><ul><li><b>Recolha grátis</b> nas nossas instalações: ${EMPRESA.morada}, ${PH(EMPRESA.horario)}.</li><li><b>Transportadora</b> para Portugal continental em 24 a 48 horas após a expedição. Portes indicados no resumo da encomenda${MODO==='completo'?', grátis acima de 150 €':''}.</li></ul>
    <h4>Ao receber</h4><p>Confira as peças assim que as receber. Se houver um defeito de produção ou uma diferença face à prova de arte aprovada, contacte-nos com fotografias para ${EMPRESA.email} ou pelo WhatsApp ${EMPRESA.tel}.</p>
    <h4>Trocas e devoluções</h4><p>Artigos <b>não personalizados</b>: 14 dias para devolução, em estado novo e na embalagem original. Artigos <b>personalizados</b>: não admitem devolução por arrependimento (artigo 17.º do Decreto-Lei n.º 24/2014), mas defeitos de produção são sempre corrigidos pela BDS.</p>`},
  reclamacoes:{t:'Livro de Reclamações e resolução de litígios',h:()=>`
    <h4>Livro de Reclamações Eletrónico</h4><p>Pode apresentar uma reclamação no Livro de Reclamações Eletrónico, disponível em <a href="https://www.livroreclamacoes.pt/Inicio/" target="_blank" rel="noopener">www.livroreclamacoes.pt</a>. Nas nossas instalações existe também o livro em formato físico.</p>
    <p><a class="lrimg big" href="https://www.livroreclamacoes.pt/Inicio/" target="_blank" rel="noopener"><img src="img/livro_reclamacoes.png" alt="Livro de Reclamações Eletrónico" onerror="this.parentNode.classList.add(\'lrbadge\');this.parentNode.innerHTML=\'<span>Livro de</span><b>Reclamações</b>\'"></a></p>
    <h4>Resolução alternativa de litígios (RAL)</h4><p>Em caso de litígio de consumo, o consumidor pode recorrer à entidade de resolução alternativa de litígios competente:</p>
    <div class="ral"><b>CICAP – Centro de Informação de Consumo e Arbitragem do Porto</b><br>Rua Damião de Góis, 31, Loja 6, 4050-225 Porto<br>Tel.: 22 550 83 49 · cicap@cicap.pt · <a href="https://cicap.pt" target="_blank" rel="noopener">cicap.pt</a></div>
    <p>Mais informação e a lista de entidades RAL em <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener">www.consumidor.gov.pt</a>.</p>`},
  empresa:{t:'Informação legal',h:()=>`
    <div class="spec"><div>Marca</div><div>${EMPRESA.marca}</div><div>Denominação social</div><div>${EMPRESA.denominacao}</div><div>NIF</div><div>${PH(EMPRESA.nif)}</div><div>Sede</div><div>${EMPRESA.morada}, ${PH(EMPRESA.cp)}</div><div>Capital social</div><div>${PH(EMPRESA.capital)}</div><div>Registo</div><div>${PH(EMPRESA.registo)}</div><div>Email</div><div>${EMPRESA.email}</div><div>Telefone / WhatsApp</div><div>${EMPRESA.tel}</div><div>Horário</div><div>${PH(EMPRESA.horario)}</div></div>`}
};
function openLegal(doc){
  if(!LEGAL[doc])doc='termos';
  $('legNav').innerHTML=Object.entries(LEGAL).map(([k,v])=>`<button class="${k===doc?'on':''}" data-legal="${k}">${v.t}</button>`).join('');
  $('legBody').innerHTML=`<h2>${LEGAL[doc].t}</h2>${LEGAL[doc].h()}`;
  if(!$('t-legal').classList.contains('on'))go('legal');else window.scrollTo(0,0);
  try{history.replaceState(null,'','#legal-'+doc)}catch(e){}
}
document.addEventListener('click',e=>{const l=e.target.closest('[data-legal]');if(!l)return;e.preventDefault();closeQuote&&$('qmodal').classList.contains('on')&&closeQuote();openLegal(l.dataset.legal)});

/* ---------- Aviso de cookies ---------- */
function ckGet(){try{return localStorage.getItem('bds_cookies')}catch(e){return null}}
function ckSet(v){try{localStorage.setItem('bds_cookies',v)}catch(e){}$('ck').classList.remove('on')}
$('ckAll').addEventListener('click',()=>ckSet('todos'));
$('ckEss').addEventListener('click',()=>ckSet('essenciais'));
document.addEventListener('click',e=>{if(e.target.id==='ckReopen')$('ck').classList.add('on')});
if(!ckGet())setTimeout(()=>$('ck').classList.add('on'),600);

/* ---------- Modo do site (fase 1: orçamentos · completo: pagamentos) ---------- */
function applyMode(){
  if(MODO==='orcamento'){
    $('cartTitle').innerHTML='O seu <span class="gt">pedido de orçamento</span>';$('cartEye').textContent='Orçamento';
    $('cartBtn').setAttribute('aria-label','Pedido de orçamento');
    const t=document.querySelector('.trustbar>div:first-child p');if(t)t.innerHTML='<b>Pague só depois</b><small>Após aprovar o orçamento e a arte</small>';
  }
  $('payBadges').innerHTML=MODO==='orcamento'
    ?'<span class="pb-note">Pagamento após aprovação do orçamento: MB WAY · Multibanco · Transferência</span>'
    :['MB WAY','Multibanco','Visa','Mastercard','Apple Pay','Google Pay'].map(p=>`<span class="pay">${p}</span>`).join('');
}

/* ---------- Pedido de orçamento a partir da lista (fase 1) ---------- */
function confirmQuoteList(){
  const t=totals(),ref='ORC-'+String(Date.now()).slice(-5),files=[];
  S.cart.forEach(i=>{files.push({src:svgURL(mock(i.pid,i.color,'f',i)),label:prod(i.pid).n+' (frente)'});if(i.positions.some(k=>POS[prod(i.pid).shape][k].v==='b'))files.push({src:svgURL(mock(i.pid,i.color,'b',i)),label:prod(i.pid).n+' (costas)'})});
  const lg=S.cart.find(i=>i.logo&&!isDef(i.logo));if(lg)files.push({src:lg.logo,label:'Logótipo',logo:true});
  S.leads.unshift({ref,nome:S.bill.nome,emp:S.bill.emp,serv:S.cart.map(i=>`${calc(i).q} × ${prod(i.pid).n}`).join(' + '),qtd:String(t.pieces),hora:new Date().toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'}),files});
  S.step=5;renderStepper();document.querySelectorAll('.stp').forEach(s=>{s.classList.remove('on');s.classList.add('done');s.querySelector('i').textContent='✓'});
  const st=['Pedido recebido','Proposta enviada','Arte aprovada','Em produção','Entregue'];
  $('cartView').innerHTML=`<div class="card confirm"><div class="check"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></div>
    <h2 style="margin:0">Pedido <span class="gt">${ref}</span> enviado</h2>
    <p class="muted">Obrigado, ${esc((S.bill.nome||'').split(' ')[0])}! Enviámos a confirmação para <b>${esc(S.bill.email||'')}</b>. Recebe a proposta final e a prova de arte em até 24 horas úteis.</p>
    <div class="payinfo"><span class="muted">Artigos</span><b>${S.cart.length}</b><span class="muted">Peças</span><b>${t.pieces}</b><span class="muted">Estimativa</span><b>${eur(t.total)}</b></div>
    <div class="timeline">${st.map((s,i)=>`<div class="tl ${i===0?'on':''}"><i>${i===0?'✓':i+1}</i>${s}</div>`).join('')}</div>
    <p class="faint" style="font-size:12.5px;max-width:560px;margin:14px auto 0">Depois de aprovar a proposta, recebe um link de pagamento seguro. A produção começa após a confirmação do pagamento.</p>
    <div class="cta" style="justify-content:center;margin-top:20px"><button class="btn pri" id="newOrder2">Voltar à loja</button></div></div>`;
  S.cart=[];S.art={};updateCartN();renderPanel();
  $('newOrder2').onclick=()=>{S.step=1;go('catalogo')};
}

/* ---------- Links diretos por endereço (#painel, #legal-termos…) ---------- */
function routeHash(){const h=decodeURIComponent(location.hash.slice(1));if(!h)return;
  if(h.startsWith('legal-'))return openLegal(h.slice(6));
  if(document.getElementById('t-'+h))go(h);}
addEventListener('hashchange',routeHash);

/* =========================================================
   LOGÓTIPO DE EXEMPLO E FOTOGRAFIAS-MODELO (funções)
   ========================================================= */
S.defLogo=DEFAULT_LOGO;
function isDef(src){return !!src&&(src===DEFAULT_LOGO||src===S.defLogo)}
function photoMock(id,cfg){
  const ph=PHOTO[id],lg=cfg&&cfg.logo,sc=(cfg&&cfg.scale)||1;
  // se a fotografia ainda não existir na pasta img/, mostra o desenho do produto no lugar
  return `<div class="phm"><div class="phm-alt">${mock(id,ph.color,'f',cfg)}</div><img class="phb" src="${ph.src}" alt="${esc(prod(id).n)}" loading="lazy" onerror="this.parentNode.classList.add('noimg')">${lg?`<img class="phl" src="${lg}" alt="" style="left:${ph.x}%;top:${ph.y}%;width:${ph.w*sc}%">`:''}</div>`;
}
function visual(id,cfg,view){
  const ph=PHOTO[id];
  if(ph&&view==='f'&&cfg.color===ph.color&&cfg.positions.some(k=>POS[prod(id).shape][k]&&POS[prod(id).shape][k].v==='f'))return photoMock(id,cfg);
  return mock(id,cfg.color,view,cfg);
}
/* converte o logótipo de exemplo em imagem embutida (para anexos e 3D) */
fetch(DEFAULT_LOGO).then(r=>r.ok?r.blob():Promise.reject()).then(b=>new Promise(res=>{const f=new FileReader();f.onload=()=>res(f.result);f.readAsDataURL(b)})).then(d=>{
  S.defLogo=d;if(S.cfg&&S.cfg.logo===DEFAULT_LOGO){S.cfg.logo=d}
  S.cart.forEach(i=>{if(i.logo===DEFAULT_LOGO)i.logo=d});
  if(typeof renderPromo==='function')renderPromo();if(S.cfg)renderBuilder(true);
}).catch(()=>{});

/* =========================================================
   ARRANQUE
   ========================================================= */
initHome();buildDD();renderHome();renderPromo();renderKits();renderBest();selectProduct('polo');updateCartN();loadVideos();renderReels();renderIntegr();['reelsHome','reelsPf','picker','catRail'].forEach(id=>makeRail($(id)));applyMode();observe();routeHash();