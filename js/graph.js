// ===========================================================
// Knowledge Graph — 3-level force-directed graph: 5 pinned career
// nodes -> category nodes (Publications, Patents, Certifications,
// Conference Talks) -> individual items, revealed on click.
// Explore page signature element.
// ===========================================================

const KG_COLORS = {
  degree:  '#4C5FD5',
  role:    '#0B7285',
  pub:     '#1C7ED6',
  patent:  '#D6336C',
  cert:    '#2F9E44',
  media:   '#AE3EC9',
  talk:    '#5C677D',
  panel:   '#E8590C'
};

const KG_CAT_LABEL = {
  degree: 'Degree', role: 'Role', pub: 'Publication',
  patent: 'Patent', cert: 'Certification', media: 'Media coverage', talk: 'Conference talk',
  panel: 'Invited Talk/Panel'
};

// Node radius by category (leaf items + spine)
const KG_R = { degree: 26, role: 24, pub: 12, patent: 13, cert: 10, media: 15, talk: 12, panel: 13 };
const KG_R_CATEGORY = 22; // flat radius for auto-generated category (Level-1) nodes

// Shape per category — d3.symbol() types. Spine (degree/role) always renders as a circle.
const KG_SHAPE = {
  degree: d3.symbolCircle, role: d3.symbolCircle,
  pub:    d3.symbolCircle,
  patent: d3.symbolDiamond,
  cert:   d3.symbolSquare,
  media:  d3.symbolStar,
  talk:   d3.symbolTriangle,
  panel:  d3.symbolWye
};
// d3.symbol size is area, not radius — visually different shapes need a fudge factor
// to read as roughly the same size as a circle of the same nominal radius.
const KG_SHAPE_CORRECTION = { patent: 1.3, cert: 1.1, media: 1.7, talk: 1.4, panel: 1.6 };

// ===== Node data: id, category, short label (on graph), parent (for clustering + collapse), and detail info =====
const KG_NODES = [
  // ---- Career spine (pinned left to right) ----
  { id:'be', cat:'degree', label:"B.E. '15", spine:0,
    period:'2011 — 2015', title:'BE, Electronics & Communication Engineering',
    body:'PES University, Bengaluru. Research assistant under Dr. Sangeetha J, working on nature-inspired and genetic-algorithm optimization for WiMAX networks.' },
  { id:'ms', cat:'degree', label:"M.S. '17", spine:1,
    period:'2015 — 2017', title:'MS, Computer Engineering',
    body:'University of Florida, Dept. of Electrical & Computer Engineering. GPA 3.96/4.0. Began research at the Wireless and Mobile Systems Laboratory under Dr. Janise McNair.' },
  { id:'phd', cat:'degree', label:"Ph.D. '22", spine:2,
    period:'2017 — 2022', title:'PhD, Electrical & Computer Engineering',
    body:'"Graph and Machine Learning Solutions for Smart Grid and Mobile Network Security" — University of Florida. Authored 15+ publications (200+ citations) on ML for network security. Includes a Data Scientist internship at Palo Alto Networks (May–Aug 2021), engineering URL-based features and training XGBoost models for phishing detection on PanDB.',
    url:'https://iot.institute.ufl.edu/2020/12/graduate-student-wins-awards-in-coding-and-hack-a-thon-competitions/', urlLabel:'Featured — UF IoT Institute' },
  { id:'staffds', cat:'role', label:'Staff DS', spine:3,
    period:'Jun 2022 — May 2025', title:'Staff Data Scientist, Palo Alto Networks',
    body:'Web Security Research team. Built graph learning, ML, and GenAI-based solutions for Advanced URL Filtering (AURL), part of Cloud-Delivered Security Services.' },
  { id:'srstaff', cat:'role', label:'Sr Staff AI Sci.', spine:4,
    period:'May 2025 — Present', title:'Sr Staff AI Scientist, Palo Alto Networks',
    body:'Web Security Research team, leading agentic AI systems combining LLMs, tools, and knowledge graphs for cybersecurity decision-making. Architecting AI to anticipate and neutralize novel LLM-generated URL threats — research published in collaboration with the Unit 42 publishing team.' },

  // ---- BE-era publications ----
  { id:'pub_wimax_relay', cat:'pub', label:'WiMAX Relay', parent:'be',
    period:'IJAMC 10(3) · 2019', title:'Placement of Relay Stations in WiMAX Network Using Glowworm Swarm Optimization',
    body:'Nature-inspired relay placement optimization for WiMAX network coverage, published from undergraduate research at PES University.' },
  { id:'pub_wimax_gep', cat:'pub', label:'WiMAX GEP', parent:'be',
    period:'IJAMC 7(2) · 2016', title:'A New Approach for Analyzing the Performance of the WiMAX Networks based on QoS Traffic Prediction Routing Protocol using Gene Expression Programming',
    body:'Gene Expression Programming applied to QoS-aware traffic prediction and routing for WiMAX networks.' },
  { id:'pub_wimax_qos', cat:'pub', label:'WiMAX QoS', parent:'be',
    period:'Book chapter · IGI Global · 2018', title:'Analyzing and Predicting the QoS of Traffic in WiMAX Network Using Gene Expression Programming',
    body:'Book chapter in "Advancements in Applied Metaheuristic Computing," extending the GEP-based WiMAX QoS prediction work.' },

  // ---- PhD-era publications ----
  { id:'pub_hybridiet', cat:'pub', label:"Hybrid IET '20", parent:'phd',
    period:'IET Smart Grid 2020 · 53 citations', title:'Hybrid Data-Driven Physics Model for Smart Grid Security',
    body:'Highest-cited work. Combines physics-based state estimation with data-driven ML to detect and diagnose false data injection attacks in smart grids.' },
  { id:'pub_corrdet', cat:'pub', label:'CorrDet', parent:'phd',
    period:'IET Smart Grid 2020 · 28 citations', title:'Ensemble CorrDet with Adaptive Statistics for Bad Data Detection',
    body:'Ensemble statistical correlation-based detection framework for identifying bad data injections in smart grid measurement streams.' },
  { id:'pub_glass', cat:'pub', label:"GLASS '21", parent:'phd',
    period:'IEEE ICC 2021 · 23 citations', title:'GLASS — Graph Learning for Smart Grid DDoS Security',
    body:'Graph Learning Approach for Software Defined Network based Smart Grid DDoS Security. Bridges PhD smart-grid work into graph neural networks — the seed of later GNN work at PAN.' },
  { id:'pub_naps', cat:'pub', label:'NAPS', parent:'phd',
    period:'NAPS 2020 · 14 citations', title:'State Estimator and Machine Learning Analysis of Residual Differences to Detect and Identify FDI and Parameter Errors in Smart Grids',
    body:'Residual-analysis framework combining state estimation and ML to distinguish FDI attacks from benign parameter errors.' },
  { id:'pub_pesgm2021', cat:'pub', label:'PESGM 21', parent:'phd',
    period:'IEEE PESGM 2021 · 9 citations', title:'Smart FDI Attack Design and Detection with Data Transmutation Framework for Smart Grids',
    body:'A data transmutation framework for designing and detecting sophisticated false data injection attacks.' },
  { id:'pub_appsci2021', cat:'pub', label:'AppSci 21', parent:'phd',
    period:'Applied Sciences 2021 · 8 citations', title:'A Network Parameter Database False Data Injection Correction Physics-Based Model',
    body:'A synthetic measurement-based ML approach for correcting network parameter database errors that mimic FDI attacks.' },
  { id:'pub_mobiwac', cat:'pub', label:'MobiWac', parent:'phd',
    period:"ACM MobiWac '19 · 10 citations", title:'Vulnerability Assessment and Classification based on Influence Metrics in Mobile Social Networks',
    body:'Influence-metric based vulnerability assessment framework for mobile social networks.' },
  { id:'pub_pesgm2019', cat:'pub', label:'PESGM 19', parent:'phd',
    period:'IEEE PESGM 2019 · 33 citations', title:'Data-Driven Physics-Based Solution for False Data Injection Diagnosis in Smart Grids',
    body:'Combines physics-based modeling with data-driven diagnosis for identifying FDI attacks in smart grid state estimation.' },
  { id:'pub_pesgm2022', cat:'pub', label:'PESGM 22', parent:'phd',
    period:'IEEE PESGM 2022 · 8 citations', title:'Cross-Layered Cyber-Physical Power System State Estimation Towards a Secure Grid Operation',
    body:'A cross-layered state estimation approach spanning cyber and physical layers of grid operation.' },
  { id:'pub_appsci2022', cat:'pub', label:'AppSci 22', parent:'phd',
    period:'Applied Sciences 2022 · 25 citations', title:'Implementation Aspects of Smart Grids Cyber-Security Cross-Layered Framework for Critical Infrastructure Operation',
    body:'Practical implementation considerations for deploying a cross-layered cyber-security framework in critical infrastructure.' },
  { id:'pub_ietsg2022', cat:'pub', label:'IET SG 22', parent:'phd',
    period:'IET Smart Grid 2022 · 27 citations', title:'Cross-Layered Distributed Data-Driven Framework for Enhanced Smart Grid Cyber-Physical Security',
    body:'Distributed, cross-layered framework combining data-driven detection across cyber and physical grid layers.' },
  { id:'pub_dissertation', cat:'pub', label:'Dissertation', parent:'phd',
    period:'University of Florida · 2022', title:'PhD Dissertation — Graph and Machine Learning Solutions for Smart Grid and Mobile Network Security',
    body:'Culmination of PhD research spanning smart grid bad-data detection, FDI diagnosis, and graph-learning based mobile/SDN network security.' },

  // ---- Staff DS-era publication, talk, patents ----
  { id:'pub_milcom', cat:'pub', label:"MILCOM '23", parent:'staffds',
    period:'IEEE MILCOM 2023 · 1 citation', title:'Graph Machine Learning based Cyber Attack Detection for Mobile Tactical Networks',
    body:'Extends graph-ML attack detection from smart grid work into mobile tactical network settings, published while at Palo Alto Networks.' },
  { id:'talk_vb2024', cat:'talk', label:'VB2024 Talk', parent:'staffds',
    period:'Virus Bulletin 2024 · Dublin', title:'Talk — Proactively Hunting Low-Reputed Infrastructure',
    body:'Presented an approach using smart crawling and Graph AI to proactively discover stealthy malicious domains, files, and low-reputation IPs ahead of VirusTotal detection. Case studies on Gamaredon, FIN7, and a large postal-impersonation campaign.',
    url:'https://www.virusbulletin.com/conference/vb2024/abstracts/proactively-hunting-low-reputed-infrastructure-used-large-cybercrimes-and-apts/', urlLabel:'Talk abstract' },
  { id:'patent_gnn', cat:'patent', label:"GNN Patent '26", parent:'staffds',
    period:'US Patent App. 18/890,630 · Filed May 2024 · Published 2026', title:'GNN-based Malicious Website Campaign Discovery (Patent)',
    body:'Patented method for automated discovery of malicious website campaign infrastructure using graph neural networks — the core of the GraPhish system built at PAN.' },
  { id:'patent_crawl', cat:'patent', label:'Crawl Patent', parent:'staffds',
    period:'US Patent App. 18/758,234 · Filed Jan 2024 · Published 2026', title:'Proactively Discovering Malicious Domains Through Guided Crawling (Patent)',
    body:'Patented guided-crawling method for proactively discovering malicious domains ahead of attacker deployment.' },

  // ---- Sr Staff-era patents & media ----
  { id:'patent_graphseek', cat:'patent', label:"GraphSeek '25", parent:'srstaff',
    period:'Filed Apr 2025 · Palo Alto Networks', title:'GraphSeek — GraphRAG-powered Threat Intelligence (Patent)',
    body:'Agentic AI system combining GraphRAG, LLMs, and knowledge graphs for automated detection and attribution of malicious campaign IoCs.' },
  { id:'patent_phantom', cat:'patent', label:'Phantom Sq.', parent:'srstaff',
    period:'Patent Filed Oct 2025', title:'Phantom Squatting — AI-Hallucinated Domain Research',
    body:'Attackers pre-register LLM-hallucinated domain names to intercept AI-driven traffic before it happens. Flagship research published in collaboration with Unit 42, patent pending Oct 2025.',
    url:'https://unit42.paloaltonetworks.com/phantom-squatting-hallucinated-web-domains/', urlLabel:'Read the article' },
  { id:'media_coverage', cat:'media', label:'Media Coverage', parent:'srstaff',
    period:'Jul 2025 — Present', title:'Media coverage of Phantom Squatting',
    body:'Independent coverage of the Phantom Squatting research across security trade press — click through for the full, continually updated list.',
    url:'research.html#phantom-squatting', urlLabel:'See all coverage' },
  { id:'panel_wicys', cat:'panel', label:'WiCyS Panel', parent:'srstaff',
    period:'Jul 2026 · WiCyS Webinar', title:'Panelist — "Can AI Agents Make You Cyber-Smarter?"',
    body:'Invited panelist for the Women in CyberSecurity (WiCyS) webinar exploring how autonomous AI agents are reshaping security operations — from automation opportunities to emerging risks.',
    url:'https://www.wicys.org/event/webinar-can-ai-agents-make-you-cyber-smarter/', urlLabel:'Event page' },

  // ---- Certifications — PhD era ----
  { id:'cert_gcp_bigdata', cat:'cert', label:'GCP Big Data', parent:'phd',
    period:'Coursera · May 2019', title:'Google Cloud Platform Big Data and Machine Learning Fundamentals',
    body:'Issuer: Coursera (Google Cloud). Credential ID PGWEHHEL7J8Z.',
    url:'https://www.coursera.org/account/accomplishments/certificate/PGWEHHEL7J8Z', urlLabel:'Show credential' },
  { id:'cert_graph_analytics', cat:'cert', label:'Graph Analytics', parent:'phd',
    period:'Coursera · Jul 2019', title:'Graph Analytics for Big Data (UC San Diego)',
    body:'Issuer: Coursera. Credential ID ZH5RHJF42878.',
    url:'https://www.coursera.org/account/accomplishments/verify/ZH5RHJF42878', urlLabel:'Show credential' },
  { id:'cert_neo4j', cat:'cert', label:'Neo4j', parent:'phd',
    period:'Neo4j · Aug 2019', title:'Introduction to Neo4j (online)',
    body:'Issuer: Neo4j. Credential ID 98127351.' },
  { id:'cert_tf_intro', cat:'cert', label:'TF Intro', parent:'phd',
    period:'Coursera · Jul 2020', title:'Introduction to TensorFlow for AI, ML, and Deep Learning',
    body:'Issuer: Coursera (DeepLearning.AI). Credential ID ZY7BAZERY68S.',
    url:'https://www.coursera.org/account/accomplishments/certificate/ZY7BAZERY68S', urlLabel:'Show credential' },
  { id:'cert_dl_cv', cat:'cert', label:'DLI Vision', parent:'phd',
    period:'NVIDIA DLI · Jul 2020', title:'Fundamentals of Deep Learning for Computer Vision',
    body:'Issuer: NVIDIA Deep Learning Institute. Credential ID bfbcb5c75eaa4a2095274b95d218baf6.',
    url:'https://courses.nvidia.com/certificates/bfbcb5c75eaa4a2095274b95d218baf6', urlLabel:'Show credential' },
  { id:'cert_cnn_tf', cat:'cert', label:'CNN in TF', parent:'phd',
    period:'Coursera · Aug 2020', title:'Convolutional Neural Networks in TensorFlow',
    body:'Issuer: Coursera (DeepLearning.AI). Credential ID 3M3VLCWVR7W7.',
    url:'https://www.coursera.org/account/accomplishments/certificate/3M3VLCWVR7W7', urlLabel:'Show credential' },
  { id:'cert_nlp_tf', cat:'cert', label:'NLP in TF', parent:'phd',
    period:'Coursera · Aug 2020', title:'Natural Language Processing in TensorFlow',
    body:'Issuer: Coursera (DeepLearning.AI). Credential ID EETXM6BQPMNY.',
    url:'https://www.coursera.org/account/accomplishments/certificate/EETXM6BQPMNY', urlLabel:'Show credential' },
  { id:'cert_seq_ts', cat:'cert', label:'Time Series', parent:'phd',
    period:'Coursera · Aug 2020', title:'Sequences, Time Series and Prediction',
    body:'Issuer: Coursera (DeepLearning.AI). Credential ID CHLS5KLG6PNA.',
    url:'https://www.coursera.org/account/accomplishments/certificate/CHLS5KLG6PNA', urlLabel:'Show credential' },
  { id:'cert_tf_specialization', cat:'cert', label:'TF Specialization', parent:'phd',
    period:'Coursera · Aug 2020', title:'DeepLearning.AI TensorFlow Developer Specialization',
    body:'Issuer: Coursera (DeepLearning.AI). Credential ID TCQ3XXRFCH73.',
    url:'https://www.coursera.org/account/accomplishments/specialization/certificate/TCQ3XXRFCH73', urlLabel:'Show credential' },
  { id:'cert_ibm_quantum', cat:'cert', label:'IBM Quantum', parent:'phd',
    period:'IBM · Dec 2020', title:'IBM Quantum Challenge — Fall 2020 — Advanced',
    body:'Issuer: IBM. Top-tier badge from the Fall 2020 IBM Quantum Challenge.',
    url:'https://www.youracclaim.com/badges/22143216-fa57-42b7-935f-06fff4fc5ff0', urlLabel:'Show credential' },
  { id:'cert_quantum_intro', cat:'cert', label:'Quantum Intro', parent:'phd',
    period:'Frontier Technology Institute · May 2021', title:'Introduction to Quantum Computing — Certificate of Completion',
    body:'Issuer: Frontier Technology Institute.' },
  { id:'cert_nvidia_anomaly', cat:'cert', label:'Anomaly Detection', parent:'phd',
    period:'NVIDIA DLI · Feb 2022', title:'Applications of AI for Anomaly Detection',
    body:'Issuer: NVIDIA Deep Learning Institute. Credential ID 4b1c50d66b064d8890b7733ef92638bf.',
    url:'https://courses.nvidia.com/certificates/4b1c50d66b064d8890b7733ef92638bf', urlLabel:'Show credential' },

  // ---- Certifications — Staff DS era ----
  { id:'cert_genai_intro', cat:'cert', label:'GenAI Intro', parent:'staffds',
    period:'Coursera · Jun 2023', title:'Introduction to Generative AI',
    body:'Issuer: Coursera. Credential ID HTQ9J92FMSJQ.',
    url:'https://www.coursera.org/account/accomplishments/certificate/HTQ9J92FMSJQ', urlLabel:'Show credential' },
  { id:'cert_gemini_multimodal', cat:'cert', label:'Gemini Multimodal', parent:'staffds',
    period:'Google Cloud Education · Mar 2025', title:'Palo Alto Networks: Exploring Gemini Multimodality',
    body:'Issuer: Google Cloud Education, via Palo Alto Networks.' },
  { id:'cert_kg_rag', cat:'cert', label:'KG for RAG', parent:'staffds',
    period:'DeepLearning.AI · Mar 2025', title:'Knowledge Graphs for RAG',
    body:'Issuer: DeepLearning.AI.',
    url:'https://learn.deeplearning.ai/accomplishments/e61b5b97-2042-4fd2-bfc6-5eed274d8efc', urlLabel:'Show credential' }
];

// ===== Explicit edges: only the career spine chain. Everything else (spine->category,
// category->leaf, spine->media) is generated at runtime from each node's `parent`. =====
const KG_LINKS = [
  ['be','ms',''], ['ms','phd',''], ['phd','staffds','promoted'], ['staffds','srstaff','promoted'],
];

document.addEventListener('DOMContentLoaded', () => {
  const svgEl = document.getElementById('kg-svg');
  const detail = document.getElementById('graph-detail-content');
  const wrap = document.getElementById('kg-canvas-wrap');
  const legendEl = document.getElementById('kg-legend');
  const searchEl = document.getElementById('kg-search-input');
  if (!svgEl || !wrap || typeof d3 === 'undefined') return;

  const byId = Object.fromEntries(KG_NODES.map(n => [n.id, n]));
  const nodes = KG_NODES.map(n => ({ ...n }));
  const links = KG_LINKS.map(([s, t, label]) => ({ source: s, target: t, label: label || '' }));

  // ----- Generate Level-1 category nodes (Publications, Patents, Certifications, Talks) -----
  // by grouping leaf items by (parent spine, category). Media is excluded — it's a single
  // link-through node straight to the spine, not an expandable category.
  const CATEGORIZABLE = ['pub', 'patent', 'cert', 'talk'];
  const catGroups = {};
  nodes.forEach(n => {
    if (n.spine !== undefined || !CATEGORIZABLE.includes(n.cat)) return;
    const key = n.parent + '|' + n.cat;
    (catGroups[key] = catGroups[key] || []).push(n);
  });
  const categoryNodes = Object.entries(catGroups).map(([key, items]) => {
    const [spineId, cat] = key.split('|');
    const id = spineId + '__' + cat;
    items.forEach(it => { it.parent = id; }); // re-parent leaves onto the new category node
    return {
      id, cat, isCategory: true, parent: spineId,
      label: KG_CAT_LABEL[cat],
      period: '', title: `${KG_CAT_LABEL[cat]} (${items.length})`,
      body: `Click to view the ${items.length} item${items.length > 1 ? 's' : ''} in this category.`,
    };
  });
  nodes.push(...categoryNodes);

  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

  // ----- Generate links: spine->category, and every remaining parent->child edge -----
  categoryNodes.forEach(cn => links.push({ source: cn.parent, target: cn.id, label: '' }));
  nodes.forEach(n => {
    if (n.spine !== undefined || n.isCategory || !n.parent) return;
    links.push({ source: n.parent, target: n.id, label: '' });
  });

  const W = wrap.clientWidth || 900;
  const H = wrap.clientHeight || 620;
  // Below this width the canvas is taller than it is wide (phones) — a horizontal
  // spine has no room to spread (5 nodes crush into a single point) while there's
  // plenty of vertical space, so the spine runs top-to-bottom instead and fans
  // open sideways rather than upward.
  const MOBILE = W < 640;
  const spineNodes = nodes.filter(n => n.spine !== undefined);
  const spineIds = spineNodes.map(n => n.id);
  const spineCount = spineNodes.length;
  spineNodes.forEach(n => {
    if (MOBILE) {
      const margin = Math.max(50, Math.min(120, H * 0.12));
      n.fx = W / 2;
      n.fy = margin + (n.spine / (spineCount - 1)) * (H - margin * 2);
    } else {
      n.fx = 150 + (n.spine / (spineCount - 1)) * (W - 300);
      n.fy = H / 2;
    }
  });

  // ----- Fan layout: deterministic direction/radius for every non-spine node around its parent -----
  const siblingGroups = {};
  nodes.forEach(n => { if (n.parent) (siblingGroups[n.parent] = siblingGroups[n.parent] || []).push(n); });
  // Desktop: angle=0 is straight up (dx=sin, dy=-cos), so every fan is centered
  // above its parent. Mobile: angle=0 is sideways (dx=±cos, dy=sin) — alternating
  // left/right per spine node — since the spine itself now runs vertically.
  // Narrower spread for categories (tight to their spine), wider for leaves.
  Object.entries(siblingGroups).forEach(([parentId, group]) => {
    const parent = nodeById[parentId];
    const aroundSpine = parent.spine !== undefined;
    // More siblings need both a wider spread and more radius to keep labels from
    // colliding — this scales with group size instead of a single fixed fan.
    const spread = aroundSpine
      ? Math.min(Math.PI * 0.95, Math.PI * 0.55 + group.length * 0.12)
      : Math.PI * 1.1;
    const start = -spread / 2;
    const mobileFan = MOBILE && aroundSpine;
    const radius = aroundSpine
      ? (mobileFan ? 65 + Math.min(group.length, 6) * 8 : 100 + Math.min(group.length, 6) * 10)
      : (32 + Math.min(group.length, 14) * 5);
    const side = mobileFan && (parent.spine % 2 === 0) ? -1 : 1;
    group.forEach((n, i) => {
      const angle = group.length === 1 ? 0 : start + (i / (group.length - 1)) * spread;
      n._radius = radius;
      if (mobileFan) {
        n._dx = side * Math.cos(angle);
        n._dy = Math.sin(angle);
      } else {
        n._dx = Math.sin(angle);
        n._dy = -Math.cos(angle);
      }
    });
  });

  // ----- Collapsible category nodes: every category starts collapsed, spine + categories always visible -----
  const collapsedIds = new Set(categoryNodes.map(n => n.id));
  const childCount = id => nodes.filter(n => n.parent === id).length;

  // ----- Category legend filter state -----
  const activeCats = new Set(Object.keys(KG_CAT_LABEL));

  function isVisible(n) {
    if (!activeCats.has(n.cat)) return false;
    if (n.parent && collapsedIds.has(n.parent)) return false;
    return true;
  }
  function linkVisible(l) {
    const s = nodeById[l.source.id || l.source], t = nodeById[l.target.id || l.target];
    return s && t && isVisible(s) && isVisible(t);
  }

  const svg = d3.select(svgEl).attr('viewBox', [0, 0, W, H]);
  const g = svg.append('g');
  svg.call(d3.zoom().scaleExtent([0.3, 3]).on('zoom', e => g.attr('transform', e.transform)))
     .on('dblclick.zoom', null);

  function nodeRadius(d) { return d.isCategory ? KG_R_CATEGORY : (KG_R[d.cat] || 12); }
  function shapeFor(d) { return d.spine !== undefined ? d3.symbolCircle : (KG_SHAPE[d.cat] || d3.symbolCircle); }
  function sizeFor(d) {
    const r = nodeRadius(d);
    const correction = KG_SHAPE_CORRECTION[d.cat] || 1;
    return r * r * Math.PI * correction;
  }

  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => {
      if (d.source.spine !== undefined && d.target.spine !== undefined) return MOBILE ? 100 : 230;
      if (d.source.spine !== undefined || d.target.spine !== undefined) return MOBILE ? 80 : 130;
      return 50;
    }).strength(0.25))
    .force('charge', d3.forceManyBody().strength(d => d.spine !== undefined ? (MOBILE ? -400 : -1000) : -90))
    .force('collide', d3.forceCollide(d => nodeRadius(d) + (MOBILE ? 18 : 30)))
    .force('radialX', d3.forceX(d => {
      if (!d.parent) return d.fx;
      const p = nodeById[d.parent];
      return (p.x !== undefined ? p.x : p.fx) + (d._dx || 0) * (d._radius || 60);
    }).strength(d => d.parent ? 0.35 : 0))
    .force('radialY', d3.forceY(d => {
      if (!d.parent) return d.fy;
      const p = nodeById[d.parent];
      return (p.y !== undefined ? p.y : p.fy) + (d._dy || 0) * (d._radius || 60);
    }).strength(d => d.parent ? 0.35 : 0));

  const linkSel = g.append('g').selectAll('line').data(links).join('line').attr('class', 'kg-link');
  const linkLabelSel = g.append('g').selectAll('text').data(links.filter(l => l.label)).join('text')
    .attr('class', 'kg-link-label').attr('text-anchor', 'middle').text(d => d.label);

  const nodeSel = g.append('g').selectAll('g').data(nodes).join('g')
    .attr('class', d => `kg-node cat-${d.cat}${d.isCategory ? ' is-category' : ''}`)
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.25).restart(); if (d.spine === undefined) { d.fx = d.x; d.fy = d.y; } })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = d.spine !== undefined ? d.fy : e.y; })
      .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); if (d.spine === undefined) { d.fx = null; d.fy = null; } }));

  const symbolGenerator = d3.symbol().type(shapeFor).size(sizeFor);
  nodeSel.append('path')
    .attr('d', symbolGenerator)
    .attr('fill', 'var(--paper-raised)')
    .attr('stroke', d => KG_COLORS[d.cat]);

  nodeSel.append('text')
    .attr('class', 'kg-label')
    .attr('text-anchor', 'middle')
    .attr('y', d => nodeRadius(d) + 13)
    .text(d => labelFor(d));

  function labelFor(d) {
    const n = childCount(d.id);
    if (n === 0) return d.label;
    return d.label + (collapsedIds.has(d.id) ? ` (+${n})` : ' (–)');
  }

  function renderDetail(d) {
    const links2 = [d.url ? `<a href="${d.url}" target="_blank" rel="noopener">${d.urlLabel || 'View'} ↗</a>` : '',
                    d.url2 ? `<a href="${d.url2}" target="_blank" rel="noopener">${d.url2Label || 'View'} ↗</a>` : '']
      .filter(Boolean).join(' &nbsp; ');
    detail.innerHTML = `
      <div class="gd-period">${d.period}${d.period ? ' · ' : ''}${KG_CAT_LABEL[d.cat]}</div>
      <h4>${d.title}</h4>
      <p>${d.body}</p>
      ${links2 ? `<p>${links2}</p>` : ''}
    `;
  }

  function neighborsOf(id) {
    const set = new Set([id]);
    links.forEach(l => {
      const s = l.source.id || l.source, t = l.target.id || l.target;
      if (s === id) set.add(t);
      if (t === id) set.add(s);
    });
    return set;
  }

  function updateVisibility() {
    nodeSel.style('display', d => isVisible(d) ? null : 'none');
    linkSel.style('display', l => linkVisible(l) ? null : 'none');
    linkLabelSel.style('display', l => linkVisible(l) ? null : 'none');
    nodeSel.select('text.kg-label').text(d => labelFor(d));
  }

  nodeSel.on('click', (e, d) => {
    if (childCount(d.id) > 0) {
      // Category (or spine) node: toggle expand/collapse for its direct children
      if (collapsedIds.has(d.id)) collapsedIds.delete(d.id);
      else collapsedIds.add(d.id);
      updateVisibility();
      sim.alpha(0.5).restart();
      nodeSel.classed('dim', false).classed('active', n => n.id === d.id);
      linkSel.classed('dim', false).classed('active', false);
    } else {
      const connected = neighborsOf(d.id);
      nodeSel.classed('dim', n => !connected.has(n.id)).classed('active', n => n.id === d.id);
      linkSel.classed('dim', l => !(connected.has(l.source.id || l.source) && connected.has(l.target.id || l.target)))
             .classed('active', l => (l.source.id || l.source) === d.id || (l.target.id || l.target) === d.id);
    }
    renderDetail(d);
  });

  svg.on('click', (e) => {
    if (e.target === svgEl) {
      nodeSel.classed('dim', false).classed('active', false);
      linkSel.classed('dim', false).classed('active', false);
    }
  });

  sim.on('tick', () => {
    // Strong spine-node charge can shove edge-adjacent branches (e.g. B.E.'s lone
    // category) past the canvas boundary — clamp everything else back on-canvas.
    nodes.forEach(n => {
      if (n.spine !== undefined) return;
      const margin = nodeRadius(n) + (MOBILE ? 22 : 40);
      n.x = Math.max(margin, Math.min(W - margin, n.x));
      n.y = Math.max(margin, Math.min(H - margin, n.y));
    });
    linkSel.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
           .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    linkLabelSel.attr('x', d => (d.source.x + d.target.x) / 2).attr('y', d => (d.source.y + d.target.y) / 2 - 4);
    nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  updateVisibility();

  // ----- Legend / category filter -----
  if (legendEl) {
    const cats = Object.keys(KG_CAT_LABEL);
    cats.forEach(cat => {
      const chip = document.createElement('span');
      chip.className = 'kg-chip';
      chip.innerHTML = `<span class="sw" style="background:${KG_COLORS[cat]}"></span>${KG_CAT_LABEL[cat]}`;
      chip.addEventListener('click', () => {
        if (activeCats.has(cat)) { activeCats.delete(cat); chip.classList.add('off'); }
        else { activeCats.add(cat); chip.classList.remove('off'); }
        updateVisibility();
        sim.alpha(0.4).restart();
      });
      legendEl.appendChild(chip);
    });
  }

  // ----- Search filter -----
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      const q = searchEl.value.trim().toLowerCase();
      if (!q) { nodeSel.classed('dim', false); linkSel.classed('dim', false); return; }
      const matched = new Set(nodes.filter(n => (n.title + ' ' + n.label).toLowerCase().includes(q)).map(n => n.id));
      // Auto-expand every collapsed ancestor of a match, walking all the way up the chain
      let changed = false;
      nodes.forEach(n => {
        if (!matched.has(n.id)) return;
        let cur = n;
        while (cur.parent && collapsedIds.has(cur.parent)) {
          collapsedIds.delete(cur.parent);
          changed = true;
          cur = nodeById[cur.parent];
        }
      });
      if (changed) { updateVisibility(); sim.alpha(0.4).restart(); }
      nodeSel.classed('dim', n => !matched.has(n.id));
      linkSel.classed('dim', l => !(matched.has(l.source.id || l.source) || matched.has(l.target.id || l.target)));
    });
  }

  // Default view
  renderDetail(byId.srstaff);
});
