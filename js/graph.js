// ===========================================================
// Knowledge Graph — hybrid force-directed graph with a pinned
// career spine, category clustering, and collapsible branches
// (Home page signature element)
// ===========================================================

const KG_COLORS = {
  degree:  '#4C5FD5',
  role:    '#0B7285',
  area:    '#E8590C',
  pub:     '#1C7ED6',
  patent:  '#D6336C',
  cert:    '#2F9E44',
  media:   '#AE3EC9',
  talk:    '#5C677D'
};

const KG_CAT_LABEL = {
  degree: 'Degree', role: 'Role', area: 'Research area', pub: 'Publication',
  patent: 'Patent', cert: 'Certification', media: 'Media coverage', talk: 'Conference talk'
};

// Node radius by category
const KG_R = { degree: 26, role: 24, area: 18, pub: 12, patent: 13, cert: 10, media: 15, talk: 12 };

// Vertical cluster band per category, relative to its spine parent: -1 = above, 1 = below, small = close
const KG_BAND = { area: -0.45, cert: -1, pub: 1, patent: 1, talk: 1, media: 1 };

// ===== Node data: id, category, short label (on graph), parent (spine id, for clustering + collapse), and detail info =====
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
    body:'"Graph and Machine Learning Solutions for Smart Grid and Mobile Network Security" — University of Florida. Authored 15+ publications (200+ citations) on ML for network security.',
    url:'https://iot.institute.ufl.edu/2020/12/graduate-student-wins-awards-in-coding-and-hack-a-thon-competitions/', urlLabel:'Featured — UF IoT Institute' },
  { id:'staffds', cat:'role', label:'Staff DS', spine:3,
    period:'Jun 2022 — May 2025', title:'Staff Data Scientist, Palo Alto Networks',
    body:'Web Security Research team. Built graph learning, ML, and GenAI-based solutions for Advanced URL Filtering (AURL), part of Cloud-Delivered Security Services.' },
  { id:'srstaff', cat:'role', label:'Sr Staff AI Sci.', spine:4,
    period:'May 2025 — Present', title:'Sr Staff AI Scientist, Palo Alto Networks',
    body:'Leading agentic AI systems combining LLMs, tools, and knowledge graphs for cybersecurity decision-making. Architecting AI to anticipate and neutralize novel LLM-generated URL threats.' },

  // ---- Branch: internship ----
  { id:'intern', cat:'role', label:"PAN Intern '21", parent:'phd',
    period:'May 2021 — Aug 2021', title:'Data Scientist Intern, Palo Alto Networks',
    body:"PanDB (Advanced URL Filtering) Data Science team. Engineered URL-based features and trained XGBoost models on millions of samples for phishing detection. Presented findings at PAN's 2021 Annual Threat Summit." },

  // ---- Research areas ----
  { id:'smartgrid', cat:'area', label:'Smart Grid', parent:'phd',
    period:'Research area', title:'Smart Grid Security',
    body:'Graph/ML-based bad-data detection, false data injection (FDI) diagnosis, and cyber-physical state estimation for smart grid infrastructure. Core of PhD dissertation work.' },
  { id:'mobilenet', cat:'area', label:'Mobile Nets', parent:'phd',
    period:'Research area', title:'Mobile & Tactical Network Security',
    body:'Vulnerability assessment via influence metrics in mobile social networks, and graph ML-based cyber-attack detection for mobile tactical networks (MILCOM 2023).' },
  { id:'gnn', cat:'area', label:'GNNs', parent:'phd',
    period:'Research area', title:'Graph Neural Networks',
    body:'GLASS (SDN-based smart grid DDoS defense) through patented GNN methods for mapping attacker campaign infrastructure at Palo Alto Networks.' },
  { id:'threatintel', cat:'area', label:'Threat Intel', parent:'staffds',
    period:'Research area', title:'Threat Intelligence',
    body:'Unit 42 published research on phishing infrastructure, hallucinated AI domains, and malware campaigns — plus timely threat intel IOC releases with global media coverage.' },
  { id:'genai', cat:'area', label:'GenAI / Agentic', parent:'srstaff',
    period:'Research area', title:'GenAI & Agentic AI Systems',
    body:'GraphSeek — a GraphRAG-powered agentic system automating threat-insight extraction and campaign discovery across large threat intel feeds.' },

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
    period:'Unit 42 Research + Patent Filed Oct 2025', title:'Phantom Squatting — AI-Hallucinated Domain Research',
    body:'Attackers pre-register LLM-hallucinated domain names to intercept AI-driven traffic before it happens. Flagship Unit 42 research, patent pending Oct 2025.',
    url:'https://unit42.paloaltonetworks.com/phantom-squatting-hallucinated-web-domains/', urlLabel:'Read Unit 42 article' },
  { id:'media_coverage', cat:'media', label:'Media · 9 outlets', parent:'srstaff',
    period:'Jul 2025 — Jul 2026', title:'Media coverage of Phantom Squatting',
    body:'Independent coverage across 9 security trade outlets: Dark Reading, The Hacker News, SC Media, Cybernews, Cybersecurity Insiders, Tech.News.Am, GBHackers, Quasa, and IBTimes Singapore.',
    url:'research.html#phantom-squatting', urlLabel:'See all coverage' },

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

// ===== Edges: [source, target, optional label] =====
const KG_LINKS = [
  // Career spine
  ['be','ms',''], ['ms','phd',''], ['phd','staffds','promoted'], ['staffds','srstaff','promoted'],
  // Internship (concurrent with PhD)
  ['phd','intern','interned'],
  // Research areas
  ['phd','smartgrid',''], ['phd','mobilenet',''], ['phd','gnn',''],
  ['staffds','gnn',''], ['staffds','threatintel',''], ['srstaff','genai',''],
  // BE-era publications
  ['be','pub_wimax_relay','published'], ['be','pub_wimax_gep','published'], ['be','pub_wimax_qos','published'],
  // PhD-era publications
  ['phd','pub_dissertation','authored'],
  ['phd','pub_hybridiet','published'], ['smartgrid','pub_hybridiet',''],
  ['phd','pub_corrdet','published'], ['smartgrid','pub_corrdet',''],
  ['phd','pub_glass','published'], ['gnn','pub_glass',''], ['smartgrid','pub_glass',''],
  ['phd','pub_naps','published'], ['smartgrid','pub_naps',''],
  ['phd','pub_pesgm2021','published'], ['smartgrid','pub_pesgm2021',''],
  ['phd','pub_appsci2021','published'], ['smartgrid','pub_appsci2021',''],
  ['phd','pub_mobiwac','published'], ['mobilenet','pub_mobiwac',''],
  ['phd','pub_pesgm2019','published'], ['smartgrid','pub_pesgm2019',''],
  ['phd','pub_pesgm2022','published'], ['smartgrid','pub_pesgm2022',''],
  ['phd','pub_appsci2022','published'], ['smartgrid','pub_appsci2022',''],
  ['phd','pub_ietsg2022','published'], ['smartgrid','pub_ietsg2022',''],
  // Staff DS-era pub, talk, patents
  ['staffds','pub_milcom','published'], ['mobilenet','pub_milcom',''],
  ['staffds','talk_vb2024','presented'],
  ['staffds','patent_gnn','filed'], ['gnn','patent_gnn',''], ['threatintel','patent_gnn',''],
  ['staffds','patent_crawl','filed'], ['threatintel','patent_crawl',''],
  // Sr Staff-era patents & media
  ['srstaff','patent_graphseek','filed'], ['genai','patent_graphseek',''],
  ['srstaff','patent_phantom','filed'], ['genai','patent_phantom',''], ['threatintel','patent_phantom',''],
  ['patent_phantom','media_coverage','covered by'],
  // Certifications — PhD era
  ['phd','cert_gcp_bigdata','earned'], ['phd','cert_graph_analytics','earned'], ['phd','cert_neo4j','earned'],
  ['phd','cert_tf_intro','earned'], ['phd','cert_dl_cv','earned'], ['phd','cert_cnn_tf','earned'],
  ['phd','cert_nlp_tf','earned'], ['phd','cert_seq_ts','earned'], ['phd','cert_tf_specialization','earned'],
  ['phd','cert_ibm_quantum','earned'], ['phd','cert_quantum_intro','earned'], ['phd','cert_nvidia_anomaly','earned'],
  // Certifications — Staff DS era
  ['staffds','cert_genai_intro','earned'], ['staffds','cert_gemini_multimodal','earned'], ['staffds','cert_kg_rag','earned']
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
  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

  const W = wrap.clientWidth || 900;
  const H = wrap.clientHeight || 620;
  const spineNodes = nodes.filter(n => n.spine !== undefined);
  const spineIds = spineNodes.map(n => n.id);
  const spineCount = spineNodes.length;
  spineNodes.forEach(n => {
    n.fx = 80 + (n.spine / (spineCount - 1)) * (W - 160);
    n.fy = H / 2;
  });

  // ----- Group non-spine nodes by (parent, category) for clustering layout -----
  const groups = {};
  nodes.forEach(n => {
    if (!n.parent) return;
    const key = n.parent + '|' + n.cat;
    (groups[key] = groups[key] || []).push(n);
  });
  Object.values(groups).forEach(group => {
    const cols = Math.max(2, Math.ceil(Math.sqrt(group.length * 1.8)));
    group.forEach((node, i) => {
      node._col = (i % cols) - (cols - 1) / 2;
      node._row = Math.floor(i / cols);
    });
  });

  // ----- Collapsible spine branches: collapsed by default except the current role -----
  const collapsedSpines = new Set(spineIds.filter(id => id !== 'srstaff'));
  const childCount = id => nodes.filter(n => n.parent === id).length;

  // ----- Category legend filter state -----
  const activeCats = new Set(Object.keys(KG_CAT_LABEL));

  function isVisible(n) {
    if (!activeCats.has(n.cat)) return false;
    if (n.parent && collapsedSpines.has(n.parent)) return false;
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

  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => (d.source.spine !== undefined && d.target.spine !== undefined) ? 230 : 55).strength(0.6))
    .force('charge', d3.forceManyBody().strength(d => d.spine !== undefined ? -1000 : -90))
    .force('collide', d3.forceCollide(d => (KG_R[d.cat] || 12) + 20))
    .force('clusterX', d3.forceX(d => {
      if (!d.parent) return d.fx;
      const p = nodeById[d.parent];
      const spacing = d.cat === 'cert' ? 32 : 42;
      return (p.x !== undefined ? p.x : p.fx) + (d._col || 0) * spacing;
    }).strength(d => d.parent ? 0.3 : 0))
    .force('clusterY', d3.forceY(d => {
      if (!d.parent) return d.fy;
      const band = KG_BAND[d.cat] !== undefined ? KG_BAND[d.cat] : 1;
      const base = Math.abs(band) < 1 ? 75 : 115;
      return H / 2 + Math.sign(band) * (base + (d._row || 0) * 30);
    }).strength(d => d.parent ? 0.28 : 0));

  const linkSel = g.append('g').selectAll('line').data(links).join('line').attr('class', 'kg-link');
  const linkLabelSel = g.append('g').selectAll('text').data(links.filter(l => l.label)).join('text')
    .attr('class', 'kg-link-label').attr('text-anchor', 'middle').text(d => d.label);

  const nodeSel = g.append('g').selectAll('g').data(nodes).join('g')
    .attr('class', d => `kg-node cat-${d.cat}`)
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.25).restart(); if (d.spine === undefined) { d.fx = d.x; d.fy = d.y; } })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = d.spine !== undefined ? d.fy : e.y; })
      .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); if (d.spine === undefined) { d.fx = null; d.fy = null; } }));

  nodeSel.append('circle')
    .attr('r', d => KG_R[d.cat] || 12)
    .attr('fill', 'var(--paper-raised)')
    .attr('stroke', d => KG_COLORS[d.cat]);

  nodeSel.append('text')
    .attr('class', 'kg-label')
    .attr('text-anchor', 'middle')
    .attr('y', d => (KG_R[d.cat] || 12) + 13)
    .text(d => labelFor(d));

  function labelFor(d) {
    const n = childCount(d.id);
    if (n === 0) return d.label;
    return d.label + (collapsedSpines.has(d.id) ? ` (+${n})` : ' (–)');
  }

  function renderDetail(d) {
    const links2 = [d.url ? `<a href="${d.url}" target="_blank" rel="noopener">${d.urlLabel || 'View'} ↗</a>` : '',
                    d.url2 ? `<a href="${d.url2}" target="_blank" rel="noopener">${d.url2Label || 'View'} ↗</a>` : '']
      .filter(Boolean).join(' &nbsp; ');
    detail.innerHTML = `
      <div class="gd-period">${d.period} · ${KG_CAT_LABEL[d.cat]}</div>
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
      // Spine (or any parent) node: toggle expand/collapse for its branch
      if (collapsedSpines.has(d.id)) collapsedSpines.delete(d.id);
      else collapsedSpines.add(d.id);
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
      // Auto-expand any collapsed spine that contains a match
      let changed = false;
      nodes.forEach(n => { if (matched.has(n.id) && n.parent && collapsedSpines.has(n.parent)) { collapsedSpines.delete(n.parent); changed = true; } });
      if (changed) { updateVisibility(); sim.alpha(0.4).restart(); }
      nodeSel.classed('dim', n => !matched.has(n.id));
      linkSel.classed('dim', l => !(matched.has(l.source.id || l.source) || matched.has(l.target.id || l.target)));
    });
  }

  // Default view
  renderDetail(byId.srstaff);
});
