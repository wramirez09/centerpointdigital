export interface ProjectResult  { num: string; lbl: string }
export interface ProcessStep    { period: string; title: string; body: string }
export interface FullImage      { src: string; width: number; height: number }
export interface PageCapture    extends FullImage { label: string }
export interface GalleryItem {
  bg: string; label: string; size: 'wide' | 'standard'; src?: string
  /** 'contain' for cut-outs (e.g. phone screens) that must not be cropped. */
  fit?: 'cover' | 'contain'
  /** Opens this full-page capture in the lightbox instead of the cropped thumbnail. */
  fullPage?: FullImage
}
export interface Highlight {
  eyebrow: string; heading: string; body: string; points: string[]; tags?: string[]
  /** width/height set the frame's proportions so the screen isn't cropped. */
  image: { src: string; label: string; width?: number; height?: number; fullPage?: FullImage }
}
export interface Comparison     { label: string; before: FullImage; after: FullImage; beforeNote?: string; afterNote?: string }

export interface Project {
  slug:           string
  featured:       boolean
  comingSoon?:    boolean  // badge on cards; hides sections that need a shipped product
  category:       string
  tag:            string
  name:           string
  year:           string
  desc:           string
  imgBg:          string
  imgSrc?:        string   // card + featured card image
  imgObjectFit?:  'cover' | 'contain'
  wideImgSrc?:    string   // banner for a full-row card (coming-soon cards span the grid)
  imgLabel:       string
  hoverName:      string
  tall:           boolean
  // featured card (only used when featured === true)
  featuredTitle?: string
  featuredDesc?:  string
  featuredResults?: ProjectResult[]
  // detail page
  title:          string[]
  client:         string
  timeline?:      string   // omitted when unknown; hidden on the page
  services:       string[]
  scope?:         string[]  // work card: what we did
  stack?:         string[]  // work card: tech used to build and deploy
  heroImgAlt:     string
  heroImgSrc?:    string   // detail page hero image
  heroPages?:     PageCapture[]  // full-page captures of every page, opened from the hero
  status?:        string     // shown in the hero meta, e.g. for spec work
  comparisons?:   Comparison[]  // before/after full-page captures
  highlights?:    { label: string; heading: string; items: Highlight[] }  // callout section after the overview
  results?:       ProjectResult[]
  overview:       { sidebar: string; heading: string; body: string[] }
  challenge?:     { sidebar: string; heading: string; body: string[] }
  gallery:        GalleryItem[]
  process?:       ProcessStep[]
  testimonial?:   { quote: string; name: string; role: string; company: string }
  nextProject?:   { slug: string; tag: string; title: string; desc: string; imgBg: string }
}

const PROJECTS: Project[] = [
  /* ─── FEATURED ─────────────────────────────────────────── */
  {
    slug: 'notedoctor-prior-auth',
    featured: true,
    category: 'ai',
    tag: 'AI · API · MCP',
    name: 'NoteDoctor.AI — Prior Auth Engine',
    year: '2025',
    desc: 'RAG-powered prior authorization readiness app built with Next.js, LangChain, and OpenAI, plus a public screening API and an MCP server that puts the engine inside Claude, Cursor, and ChatGPT.',
    imgBg: '#0d1017',
    imgSrc: '/images/projects/noteDoctorAi_webApp/request-summary.webp',
    imgLabel: 'Prior auth interface',
    hoverName: 'Prior Auth Engine',
    tall: true,
    featuredTitle: 'NoteDoctor.AI —\nPrior Auth Engine.',
    featuredDesc: 'A RAG-powered prior authorization readiness app, plus the developer platform around it: a public screening API with a playground and self-serve keys, and an MCP server that runs screenings inside Claude and ChatGPT.',
    featuredResults: [
      { num: '8wk', lbl: 'concept to production' },
      { num: 'API', lbl: 'public REST API with scoped keys' },
      { num: 'MCP', lbl: 'screenings inside Claude and ChatGPT' },
    ],
    title: ['NoteDoctor.AI', 'Prior Auth Engine.'],
    client: 'NoteDoctor.AI',
    timeline: '8 weeks',
    services: ['RAG Architecture', 'Next.js Development', 'LangChain', 'OpenAI Integration', 'Public REST API', 'MCP Server', 'OAuth 2.1', 'Authentication', 'Stripe Payments', 'UI/UX Design', 'Deployment'],
    scope:    ['RAG pipeline', 'Public REST API', 'MCP server', 'Auth & billing', 'UI/UX design', 'Deployment'],
    stack:    ['Next.js', 'LangChain', 'OpenAI', 'OAuth 2.1', 'Stripe'],
    heroImgAlt: 'NoteDoctor.AI request form beside an AI-generated prior authorization summary',
    heroImgSrc: '/images/projects/noteDoctorAi_webApp/request-summary.webp',
    results: [
      { num: '8wk',  lbl: 'concept to production deployment' },
      { num: 'RAG',  lbl: 'retrieval-augmented generation with LangChain + OpenAI' },
      { num: 'PDF',  lbl: 'branded export of every generated authorization' },
      { num: 'API',  lbl: 'public REST API and MCP server on the same engine' },
    ],
    overview: {
      sidebar: 'A full-stack RAG application that generates prior authorization summaries from clinical inputs — with a split-panel UI, swappable layout, PDF export, authentication, and Stripe billing.',
      heading: 'AI that reads the rules so physicians don\'t have to.',
      body: [
        "Prior authorization is one of healthcare's most expensive administrative burdens — 80M+ requests processed annually, with 40% of denials ultimately overturned on appeal. Physicians waste hours each week navigating payer-specific medical necessity guidelines. NoteDoctor.AI asked us to build the engine that changes that.",
        "We designed and built a production RAG application from scratch. Clinicians enter a diagnosis, CPT codes, and patient history; the system retrieves the exact payer guidelines for that case, runs them through an OpenAI-powered generation layer via LangChain, and surfaces a structured prior authorization summary with cited medical necessity criteria — all in seconds.",
        "Every request produces a structured readiness report: a request overview, clinical context, authorization and medical-necessity criteria, relevant codes, and a required-documentation checklist that marks what the note already covers, with a clear determination such as \"More information needed\". Reports can be saved, reopened, and exported as branded PDFs. The application also ships with full user authentication, Stripe subscription billing, light and dark themes, a fully responsive layout, and a swappable split-panel interface (Request/Report tabs with a Swap Layout toggle).",
      ],
    },
    challenge: {
      sidebar: 'Building a RAG system accurate enough for clinical decision support — where retrieval errors have real patient and billing consequences — while delivering a polished, full-featured SaaS product.',
      heading: 'Clinical accuracy and product quality at the same time.',
      body: [
        "Most RAG demos fall apart under real-world use. Healthcare is less forgiving than most — payer guidelines span hundreds of pages, update frequently, and vary by plan and state. A hallucinated medical necessity criterion or a missed CPT requirement isn't just a bad answer; it's a delayed or denied treatment. We built a multi-layer retrieval strategy (dense + sparse search, reranking before generation) and enforced strict source citation on every output. The system declines to answer rather than guess.",
        "On the product side, the challenge was delivering a full SaaS application — auth, billing, responsive design, adaptive UI, and PDF generation — within the same eight-week timeline as the AI work. We used Next.js throughout, integrated Stripe for subscription management, and built the swappable split-panel layout to give clinicians flexibility in how they use the tool across different screen sizes and workflows.",
      ],
    },
    highlights: {
      label: 'Developer platform',
      heading: 'The engine, opened up to other software and to AI assistants.',
      items: [
        {
          eyebrow: 'Screening API · public beta',
          heading: 'The screening engine, as an API.',
          body: 'The same engine clinicians use in the app, exposed as a versioned REST API, so a health system can send a case from its EHR or internal tools and get an authorization-readiness determination back.',
          points: [
            'Two scoped APIs: Agents runs a full prior-auth screening (45–65 seconds); Chat answers questions grounded in the note, the payer policy and the run.',
            'An in-app API Playground: pick an endpoint, edit the JSON, send it with a short-lived test key that never reaches the browser, and copy the call as cURL, JavaScript or Python.',
            'Idempotency keys, so a retried request replays the same response instead of running (and billing) twice.',
            'Per-key rate limits and /me and /usage endpoints, with usage metered straight into Stripe billing.',
          ],
          tags: ['REST', 'API Playground', 'Idempotency', 'Stripe metering'],
          image: { src: '/images/projects/noteDoctorAi_webApp/platform/playground-response.webp', label: 'API Playground: a live /agents screening and its response', width: 1807, height: 1024 },
        },
        {
          eyebrow: 'API keys · self-serve',
          heading: 'Keys you can govern.',
          body: 'Organizations issue their own keys from the dashboard. Each key is a server-side secret scoped to the organization, and it is shown once, at creation.',
          points: [
            'Live and Test environments, labelled on every usage row; test keys run against a sandbox with simulated cases.',
            'Scopes per key (agents, chat), granted at the minimum needed and never widened later: a new need means a new key.',
            'A rate limit and an optional expiry (30 days, 90 days, 1 year or none) on every key.',
            'Rotate by creating a replacement and revoking the old key; revoked and expired keys stop working immediately.',
          ],
          tags: ['Scoped keys', 'Live / Test', 'Rotation', 'Expiry'],
          image: { src: '/images/projects/noteDoctorAi_webApp/platform/keys.webp', label: 'API key management', width: 1248, height: 796 },
        },
        {
          eyebrow: 'MCP server · available now',
          heading: 'Prior auth inside Claude, Cursor and ChatGPT.',
          body: 'The same engine, published over the Model Context Protocol. A provider adds one URL to Claude, ChatGPT or Cursor, signs in with their NoteDoctor.AI account through OAuth, and can run a full screening from the assistant they already use. No API key to copy.',
          points: [
            'A remote server: one HTTPS endpoint, nothing to install, host or keep up to date.',
            'Five tools, from run_prior_auth_screening for the whole determination to Medicare and commercial guideline search, a policy extractor and key usage.',
            'The same scopes, plan checks and rate limits as the REST API, and a tool the connection can\'t use is never listed.',
            'OAuth 2.1 sign-in makes it a claude.ai or ChatGPT connector, including ChatGPT deep research; clients set up by config file can still connect with an API key.',
          ],
          tags: ['MCP', 'OAuth 2.1', 'Claude', 'Cursor', 'ChatGPT'],
          image: {
            src: '/images/projects/noteDoctorAi_webApp/platform/mcp.webp',
            label: 'Developer platform: the MCP server and its tools',
            fullPage: { src: '/images/projects/noteDoctorAi/pages/developers-mcp.webp', width: 1600, height: 6234 },
          },
        },
      ],
    },
    gallery: [
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi_webApp/request-summary.webp',      label: 'Request form beside the AI-generated authorization summary', size: 'wide' },
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi_webApp/report-checklist.webp', label: 'Report view: required-documentation checklist and determination', size: 'standard' },
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi_webApp/pdf-summary.png',            label: 'Branded PDF export of the summary', size: 'standard' },
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi_webApp/assistant.webp',      label: 'AI assistant with guided starter questions', size: 'standard' },
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi_webApp/sign-in-screen.webp',              label: 'Secure sign-in with light and dark themes', size: 'standard' },
    ],
    process: [
      { period: 'Week 01–02', title: 'Architecture & design',    body: 'RAG pipeline design, vector store selection, UI/UX for the split-panel interface, auth flow, and Stripe integration planning.' },
      { period: 'Week 02–05', title: 'Core build',               body: 'LangChain + OpenAI RAG pipeline, Next.js application, authentication, Stripe billing, responsive layout, and Swap Layout feature.' },
      { period: 'Week 05–07', title: 'PDF export & QA',          body: 'PDF generation with branded templates, accuracy benchmarking against real prior auth scenarios, cross-device QA, and HIPAA compliance review.' },
      { period: 'Week 07–08', title: 'Deploy',                   body: 'Production deployment, monitoring, documentation, and handoff to the NoteDoctor team.' },
    ],
    testimonial: {
      quote: '"CenterPoint built the entire product — the RAG pipeline, the UI, auth, billing, and PDF export — in eight weeks. They understood the clinical accuracy requirements from day one and the application they shipped is exactly what we envisioned."',
      name: 'NoteDoctor.AI Team',
      role: 'Founding Team',
      company: 'NoteDoctor.AI',
    },
    nextProject: { slug: 'one-stop', tag: 'Web Design & Development', title: '1 Stop Property Maintenance', desc: 'Full website design, development, content creation, SEO, and deployment for a property maintenance company.', imgBg: '#0c0e0b' },
  },

  {
    slug: 'notedoctor-ai',
    featured: false,
    category: 'web',
    tag: 'Web Design & Development',
    name: 'NoteDoctor.AI Marketing Site',
    year: '2025',
    desc: 'Full marketing site for an AI-powered prior authorization platform — design, development, content, and end-to-end deployment.',
    imgBg: '#0d1017',
    imgSrc: '/images/projects/noteDoctorAi/home-hero.webp',
    imgLabel: 'NoteDoctor.AI homepage',
    hoverName: 'NoteDoctor.AI',
    tall: false,
    featuredTitle: 'NoteDoctor.AI —\nCut the Red Tape.',
    featuredDesc: 'A full marketing site for an AI-powered prior authorization platform — we handled everything from content strategy and visual design through Next.js development, server configuration, domain transfer, and live deployment.',
    featuredResults: [
      { num: '3wk',  lbl: 'kickoff to live deployment' },
      { num: '100%', lbl: 'content written from scratch' },
      { num: '3',    lbl: 'distinct audience segments addressed' },
    ],
    title: ['NoteDoctor.AI', 'Marketing Site.'],
    client: 'NoteDoctor.AI',
    timeline: '3 weeks',
    services: ['Web Design', 'Next.js Development', 'Content Development', 'Server Configuration', 'Domain Transfer', 'Deployment'],
    scope:    ['Web design', 'Content & copy', 'Server configuration', 'Domain transfer', 'Deployment'],
    stack:    ['Next.js'],
    heroImgAlt: 'NoteDoctor.AI homepage hero',
    heroImgSrc: '/images/projects/noteDoctorAi/home-hero.webp',
    heroPages: [
      { label: 'Home', src: '/images/projects/noteDoctorAi/pages/home.webp', width: 1600, height: 6649 },
      { label: 'For You', src: '/images/projects/noteDoctorAi/pages/for-you.webp', width: 1600, height: 3704 },
      { label: 'Pricing', src: '/images/projects/noteDoctorAi/pages/pricing.webp', width: 1600, height: 1893 },
      { label: 'Developers', src: '/images/projects/noteDoctorAi/pages/developers.webp', width: 1600, height: 4910 },
      { label: 'Developers · MCP', src: '/images/projects/noteDoctorAi/pages/developers-mcp.webp', width: 1600, height: 6234 },
      { label: 'Contact', src: '/images/projects/noteDoctorAi/pages/contact.webp', width: 1600, height: 1188 },
    ],
    results: [
      { num: '3wk',  lbl: 'kickoff to live deployment' },
      { num: '100%', lbl: 'content written from scratch' },
      { num: '3',    lbl: 'audience segments: physicians, admins, health systems' },
      { num: '98',   lbl: 'Lighthouse performance score' },
    ],
    overview: {
      sidebar: 'A complete marketing site for an AI-powered prior authorization screening platform — designed, built, written, and deployed end-to-end by CenterPoint.',
      heading: 'Making a complex clinical problem feel solvable.',
      body: [
        "NoteDoctor.AI automates prior authorization screening for healthcare providers — a process that wastes physician time, delays patient care, and costs the healthcare system billions every year. The product was excellent. What they needed was a site that communicated its value clearly, quickly, and to the right people.",
        "We built the full marketing site from scratch: visual design, Next.js development, and every word of copy. The site speaks to three distinct audiences — physicians, practice administrators, and health system leaders — each with different pain points, different vocabulary, and different decision-making criteria.",
        "Beyond design and development, we handled the complete technical stack: server configuration, DNS management, domain transfer from their previous provider, and live deployment. On launch day, the team received a fully documented, production-ready site with nothing left to set up.",
      ],
    },
    challenge: {
      sidebar: 'Translating a deeply technical healthcare compliance workflow into compelling, accessible marketing copy — without losing accuracy or alienating clinical audiences.',
      heading: 'The hardest brief is "make this simple without dumbing it down."',
      body: [
        "Prior authorization is genuinely complex. It involves insurance policies, clinical necessity criteria, payer-specific rules, and multi-step submission workflows. Healthcare audiences are expert readers who instantly detect oversimplification — but the site also needed to convert non-clinical decision-makers like practice managers and health system executives.",
        "We solved this with an audience-segmented content architecture. The homepage speaks in broad outcome language — cut delays, reduce burnout, deliver care faster. A dedicated 'For You' page lets each stakeholder self-select between For Healthcare, For Physicians, and For Health Systems views, each with tailored copy and feature highlights. Every claim is backed by sourced data — the problem section cites KFF's 2023 Medicare Advantage figures (nearly 50M prior-auth requests a year, 80% of denials overturned on appeal) rather than vague marketing stats.",
      ],
    },
    gallery: [
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi/home-hero.webp',     label: 'Homepage hero — Cut the Red Tape', size: 'wide' },
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi/for-you.png',  label: 'Built for every role', size: 'standard' },
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi/problem.png',  label: 'The problem, backed by data', size: 'standard' },
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi/features.png', label: 'How NoteDoctor helps', size: 'standard' },
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi/pricing.png',  label: 'Transparent, usage-based pricing', size: 'standard' },
    ],
    process: [
      { period: 'Week 01',    title: 'Discovery & content strategy', body: 'Audience mapping, pain point research, competitive analysis, sitemap architecture, and content brief for all pages.' },
      { period: 'Week 01–02', title: 'Design & copywriting',         body: 'Visual design for all pages, component system, and full copy development — hero, problem framing, feature sections, FAQ, and lead capture.' },
      { period: 'Week 02–03', title: 'Development',                  body: 'Next.js build, responsive implementation, HIPAA-compliant lead capture form, animation, and cross-browser QA.' },
      { period: 'Week 03',    title: 'Deploy & handoff',             body: 'Server configuration, DNS setup, domain transfer, SSL, production deployment, and full technical documentation handoff.' },
    ],
    testimonial: {
      quote: '"CenterPoint handled everything — design, copy, code, and deployment. We handed them a brief and received a fully live, production-ready site three weeks later. The content they wrote represents our product better than anything we had written ourselves."',
      name: 'NoteDoctor.AI Team',
      role: 'Founding Team',
      company: 'NoteDoctor.AI',
    },
    nextProject: { slug: 'notedoctor-prior-auth', tag: 'AI · API · MCP', title: 'NoteDoctor.AI — Prior Auth Engine', desc: 'RAG-powered prior authorization app with a public screening API and an MCP server for Claude, Cursor, and ChatGPT.', imgBg: '#0d1017' },
  },

  {
    slug: 'one-stop',
    featured: false,
    category: 'web',
    tag: 'Web Design & Development',
    name: '1 Stop Property Maintenance',
    year: '2025',
    desc: 'Full website design, development, content creation, SEO, and deployment for a local property maintenance company. Built with Next.js and Tailwind CSS.',
    imgBg: '#3a2e25',
    imgSrc: '/images/projects/oneStop/hero.webp',
    imgLabel: 'Website homepage',
    hoverName: '1 Stop Property Maintenance',
    tall: false,
    title: ['1 Stop Property', 'Maintenance.'],
    client: '1 Stop Property Maintenance Inc.',
    timeline: '4 weeks',
    services: ['Web Design', 'Next.js Development', 'Tailwind CSS', 'Content Creation', 'SEO', 'Server Configuration', 'Deployment'],
    scope:    ['Web design', 'Content creation', 'SEO', 'Server configuration', 'Deployment'],
    stack:    ['Next.js', 'Tailwind CSS'],
    heroImgAlt: '1 Stop Property Maintenance website',
    heroImgSrc: '/images/projects/oneStop/hero.webp',
    heroPages: [
      { label: 'Home', src: '/images/projects/oneStop/full-page.webp', width: 1600, height: 6058 },
    ],
    results: [
      { num: '4wk',  lbl: 'brief to live site' },
      { num: '100%', lbl: 'content written from scratch' },
      { num: 'A+',   lbl: 'PageSpeed score' },
      { num: 'Full', lbl: 'SEO foundation built in' },
    ],
    overview: {
      sidebar: 'A full website build for a local property maintenance company — design, development, all written content, on-page SEO, and deployment handled end-to-end by CenterPoint.',
      heading: 'A professional web presence built to generate local leads.',
      body: [
        '1 Stop Property Maintenance had the skills and reputation to win any job — but their online presence wasn\'t keeping pace. Without a professional website, potential customers couldn\'t easily find them, understand their services, or reach out.',
        'We built everything from scratch: a fast, mobile-first Next.js site styled with Tailwind CSS, with clear service pages, a contact flow designed to convert, and all written content developed in-house. We handled domain configuration, server setup, and live deployment — so the client received a production-ready site with nothing left to set up.',
      ],
    },
    challenge: {
      sidebar: 'Communicating a broad range of property maintenance services clearly and convincingly to local homeowners and property managers.',
      heading: 'Making every service easy to find and easy to trust.',
      body: [
        'Property maintenance covers a wide range of work — and potential customers arrive with very specific needs. The site architecture needed to surface the right service quickly for every visitor, while also building overall trust in the company\'s professionalism and reliability.',
        'We structured the site around four clear value pillars — free estimates, expert craftsmanship, timely project completion, and comprehensive maintenance — each surfaced with its own icon and plain-language description. Trust signals run throughout: transparent "no hidden costs" pricing, client testimonials, an FAQ that answers real objections, and a straightforward contact flow. The SEO foundation was built in from the start — structured metadata, local schema markup, and content written around the search terms real customers use.',
      ],
    },
    gallery: [
      { bg: '#3a2e25', src: '/images/projects/oneStop/hero.webp',         label: 'Homepage hero', size: 'wide' },
      { bg: '#0f1722', src: '/images/projects/oneStop/pricing.webp',       label: 'Transparent pricing', size: 'standard' },
      { bg: '#0f1722', src: '/images/projects/oneStop/services.webp',      label: 'Services overview', size: 'standard' },
      { bg: '#1a2230', src: '/images/projects/oneStop/trust.webp',         label: 'Building trust', size: 'standard' },
      { bg: '#141b27', src: '/images/projects/oneStop/contact.webp',       label: 'Contact & enquiry form', size: 'standard' },
    ],
    process: [
      { period: 'Week 01',    title: 'Discovery & content strategy', body: 'Service audit, target audience mapping, keyword research, sitemap, and content brief for all pages.' },
      { period: 'Week 01–02', title: 'Design & copywriting',         body: 'Visual design, component system, and all written content — homepage, service pages, about, and contact.' },
      { period: 'Week 02–03', title: 'Development',                  body: 'Next.js build with Tailwind CSS, responsive implementation, contact form, and on-page SEO.' },
      { period: 'Week 03–04', title: 'Config & deployment',          body: 'Domain configuration, DNS setup, server provisioning, SSL, production deployment, and handoff.' },
    ],
    testimonial: {
      quote: '"CenterPoint handled everything — the design, all the content, and getting the site live. We didn\'t have to worry about a thing. The site looks professional and we\'ve already had enquiries come through it."',
      name: '1 Stop Property Maintenance',
      role: 'Owner',
      company: '1 Stop Property Maintenance Inc.',
    },
    nextProject: { slug: 'spotless-carwash', tag: 'Web Design & Development', title: 'Spotless Carwash', desc: 'Website for a Forest Park car wash: touchless wash packages, two locations, a self-serve guide, and online wash-token sales with Stripe checkout.', imgBg: '#1d4ed8' },
  },

  {
    slug: 'spotless-carwash',
    featured: false,
    category: 'web',
    tag: 'Web Design & Development',
    name: 'Spotless Carwash',
    year: '2026',
    desc: 'Website for a Forest Park car wash: touchless wash packages, two locations, a self-serve guide, and online wash-token sales with Stripe checkout. Built with Next.js and Sanity.',
    imgBg: '#1d4ed8',
    imgSrc: '/images/projects/spotless/hero.webp',
    imgLabel: 'Homepage hero',
    hoverName: 'Spotless Carwash',
    tall: false,
    title: ['Spotless', 'Carwash.'],
    client: 'Spotless Carwash',
    services: ['Web Design', 'Next.js Development', 'Sanity CMS', 'Stripe Checkout', 'Local SEO'],
    scope:    ['Web design', 'Online token sales', 'Local SEO'],
    stack:    ['Next.js', 'Sanity CMS', 'Stripe Checkout'],
    heroImgAlt: 'Spotless Carwash homepage hero',
    heroImgSrc: '/images/projects/spotless/hero.webp',
    heroPages: [
      { label: 'Home', src: '/images/projects/spotless/pages/home.webp', width: 1600, height: 10424 },
      { label: 'Buy tokens', src: '/images/projects/spotless/pages/buy-tokens.webp', width: 1600, height: 2949 },
      { label: 'Roosevelt Rd location', src: '/images/projects/spotless/pages/locations-roosevelt-rd.webp', width: 1600, height: 7836 },
      { label: 'Madison St location', src: '/images/projects/spotless/pages/locations-madison-st.webp', width: 1600, height: 7867 },
      { label: 'FAQ', src: '/images/projects/spotless/pages/faq.webp', width: 1600, height: 3108 },
      { label: 'Privacy policy', src: '/images/projects/spotless/pages/privacy.webp', width: 1600, height: 2219 },
      { label: 'Terms of service', src: '/images/projects/spotless/pages/terms.webp', width: 1600, height: 2161 },
    ],
    results: [
      { num: '2',   lbl: 'locations, one site' },
      { num: '4',   lbl: 'touchless wash packages' },
      { num: '9',   lbl: 'self-serve settings explained' },
      { num: '$5',  lbl: 'off every token 4-pack, sold online' },
    ],
    overview: {
      sidebar: 'A new website for a Forest Park car wash, open since 1995, with two locations and ten bays. It covers wash packages, locations, a self-serve guide, and online wash-token sales.',
      heading: 'A 30-year local business, explained in one scroll.',
      body: [
        'Spotless Carwash runs touchless automatic bays and self-serve wand bays across two Forest Park locations. The site has to answer a driver\'s questions fast: which wash, which location, what it costs, and how the bay works once you pull in.',
        'We built it on Next.js with Sanity as the CMS. The homepage walks through the four color-coded wash packages, a "watch the lights" guide to the bay signal, both locations with bay counts and hours, the nine self-serve dial settings, and everything else on the lot. Wash tokens are sold online in discounted 4-packs through a Stripe checkout and mailed to the customer.',
      ],
    },
    challenge: {
      sidebar: 'Turning a pay-at-the-station, watch-the-lights business into something a first-time visitor understands before they arrive, and that can take money online.',
      heading: 'Teaching the bay before the car is in it.',
      body: [
        'Most of a car wash\'s questions happen in the bay: when to pull in, where to stop, when to leave. The site shows the traffic-light signal as a live-looking panel and breaks the visit into four numbered steps, so drivers know the routine before they arrive.',
        'Selling tokens added a real checkout. Customers choose a pack, enter a mailing address for the physical tokens, and pay through Stripe, so no card details are stored on the site. Local SEO runs throughout, from location pages to a footer that names the surrounding communities.',
      ],
    },
    gallery: [
      { bg: '#1d4ed8', src: '/images/projects/spotless/hero.webp',            label: 'Homepage hero with the bay-signal card', size: 'wide' },
      { bg: '#1d4ed8', src: '/images/projects/spotless/buy-tokens.webp',      label: 'Wash-token checkout with Stripe', size: 'standard',
        fullPage: { src: '/images/projects/spotless/pages/buy-tokens.webp', width: 1600, height: 2949 } },
      { bg: '#f3f6fb', src: '/images/projects/spotless/packages.webp',        label: 'Four color-coded wash packages', size: 'standard' },
      { bg: '#0b1b4d', src: '/images/projects/spotless/how-it-works.webp',    label: 'How it works: watch the lights', size: 'standard' },
      { bg: '#e6edf8', src: '/images/projects/spotless/locations.webp',       label: 'Two locations, ten bays', size: 'standard' },
      { bg: '#0b1b4d', src: '/images/projects/spotless/self-serve-dial.webp', label: 'Self-serve dial: nine settings', size: 'standard' },
      { bg: '#f3f6fb', src: '/images/projects/spotless/services.webp',        label: 'Everything else on the lot', size: 'standard' },
      { bg: '#f3f6fb', src: '/images/projects/spotless/tokens.webp',          label: 'Token 4-packs: save $5 every wash', size: 'standard' },
    ],
    nextProject: { slug: 'runaway-cow', tag: 'Case Study · Web Redesign', title: 'Runaway Cow — Redesign Pitch', desc: 'Spec redesign pitched to a Chicago vegan ice cream shop: a Google Sites page with an image-only menu, rebuilt as a bold, fast site with a real text menu and a weekly flavor calendar.', imgBg: '#ee3d8b' },
  },

  {
    slug: 'runaway-cow',
    featured: false,
    category: 'web',
    tag: 'Case Study · Web Redesign',
    name: 'Runaway Cow — Redesign Pitch',
    year: '2026',
    desc: 'Spec redesign pitched to a Chicago vegan ice cream shop: a Google Sites page with an image-only menu, rebuilt as a bold, fast site with a real text menu and a weekly flavor calendar.',
    imgBg: '#ee3d8b',
    imgSrc: '/images/projects/runawayCow/hero.webp',
    imgLabel: 'Redesigned homepage hero',
    hoverName: 'Runaway Cow',
    tall: false,
    title: ['Runaway Cow.', 'A redesign pitch.'],
    client: 'Runaway Cow',
    status: 'Unsolicited pitch, not engaged',
    services: ['Web Design', 'Menu Design', 'Content Structure', 'React', 'Tailwind CSS', 'Cloudflare Pages'],
    scope:    ['Web design', 'Menu design', 'Content structure'],
    stack:    ['React', 'Tailwind CSS', 'Cloudflare Pages'],
    heroImgAlt: 'Runaway Cow redesign homepage hero',
    heroImgSrc: '/images/projects/runawayCow/hero.webp',
    heroPages: [
      { label: 'Home', src: '/images/projects/runawayCow/pages/home.webp', width: 1600, height: 6114 },
      { label: 'Menu', src: '/images/projects/runawayCow/pages/menu.webp', width: 1600, height: 9063 },
    ],
    results: [
      { num: '1→9',  lbl: 'menu image to nine text sections' },
      { num: '4',    lbl: 'weekly flavor drops on a calendar' },
      { num: 'Live', lbl: 'working pitch site, not a mockup' },
      { num: 'Spec', lbl: 'unsolicited; the shop didn\'t sign on' },
    ],
    overview: {
      sidebar: 'A speculative redesign I built and pitched to Runaway Cow, a vegan ice cream shop and deli in Bridgeport, Chicago. They didn\'t sign on; this is the pitch, shown as built.',
      heading: 'A great little shop with a website that undersold it.',
      body: [
        'Runaway Cow\'s brand is loud in the best way: hot pink, lime green, a grinning cow, and a menu full of jokes. Their site is a Google Sites page. The logo banner is strong, but below it sit a poster image, a block of links, and a long empty gap.',
        'The bigger problem was the menu. It was a single image of the printed board, so none of it was text: hard to read on a phone, impossible to search, and invisible to screen readers and search engines. I rebuilt the site as a working pitch to show what the brand could look like online, rather than describe it in an email.',
      ],
    },
    challenge: {
      sidebar: 'Keep the brand\'s personality, and turn a picture of a menu into something people can actually use.',
      heading: 'Turning the menu board into a real menu.',
      body: [
        'The redesign leans into a zine look that fits the brand: big condensed type, pink-and-lime color blocks, monospaced labels, and a running ticker of what\'s new. The homepage puts the things a regular comes back for first: this month\'s features, a calendar of weekly flavor drops, hours and the address, and the two owners behind the counter.',
        'The menu is now nine sections of real text, with prices, jump links across the top, and the printable PDF kept as an option instead of the only way in. It\'s a React site styled with Tailwind and deployed on Cloudflare Pages, so it loads fast and costs next to nothing to host.',
      ],
    },
    comparisons: [
      {
        label: 'Homepage',
        before: { src: '/images/projects/runawayCow/old-home-full.webp', width: 1600, height: 3642 },
        after:  { src: '/images/projects/runawayCow/pages/home.webp', width: 1600, height: 6114 },
        beforeNote: 'Google Sites: a logo banner, a poster image, links, and a long empty gap.',
        afterNote: 'Features, the flavor calendar, hours and the owners, in one scroll.',
      },
      {
        label: 'Menu',
        before: { src: '/images/projects/runawayCow/old-menu-full.webp', width: 1600, height: 2604 },
        after:  { src: '/images/projects/runawayCow/pages/menu.webp', width: 1600, height: 9063 },
        beforeNote: 'The whole menu is one image of the printed board.',
        afterNote: 'Nine sections of real, searchable text with prices and jump links.',
      },
    ],
    gallery: [
      { bg: '#ee3d8b', src: '/images/projects/runawayCow/hero.webp',       label: 'Homepage hero', size: 'wide' },
      { bg: '#fbf6ea', src: '/images/projects/runawayCow/features.webp',   label: 'This month\'s features', size: 'standard' },
      { bg: '#fbf6ea', src: '/images/projects/runawayCow/calendar.webp',   label: 'Weekly flavor calendar', size: 'standard' },
      { bg: '#141414', src: '/images/projects/runawayCow/visit.webp',      label: 'Hours and address', size: 'standard' },
      { bg: '#fbf6ea', src: '/images/projects/runawayCow/owners.webp',     label: 'The owners\' story', size: 'standard' },
      { bg: '#fbf6ea', src: '/images/projects/runawayCow/menu.webp',       label: 'Menu header and section links', size: 'standard' },
      { bg: '#141414', src: '/images/projects/runawayCow/snowstorms.webp', label: 'Snowstorms: sizes and flavors as text', size: 'standard' },
      { bg: '#e6f2c8', src: '/images/projects/runawayCow/hot-food.webp',   label: 'Hot food and deli', size: 'standard' },
    ],
    nextProject: { slug: 'notedoctor-ios', tag: 'Mobile App · iOS', title: 'NoteDoctor.AI for iOS', desc: 'An iPhone app for the NoteDoctor.AI prior authorization platform, in development. Sign in or create an account, with the same clean, clinical look as the web app.', imgBg: '#0d1017' },
  },

  {
    slug: 'notedoctor-ios',
    featured: false,
    comingSoon: true,
    category: 'mobile',
    tag: 'Mobile App · iOS',
    name: 'NoteDoctor.AI for iOS',
    year: '2026',
    desc: 'An iPhone app for the NoteDoctor.AI prior authorization platform, in development. Sign in or create an account, with the same clean, clinical look as the web app.',
    imgBg: '#0d1017',
    imgSrc: '/images/projects/noteDoctorAi_ios/cover.webp',
    wideImgSrc: '/images/projects/noteDoctorAi_ios/banner.webp',
    imgLabel: 'Sign-in and sign-up screens',
    hoverName: 'NoteDoctor.AI for iOS',
    tall: false,
    title: ['NoteDoctor.AI', 'for iOS.'],
    client: 'NoteDoctor.AI',
    status: 'Coming soon · in development',
    services: ['iOS App', 'Mobile UI Design', 'Authentication'],
    scope:    ['iOS app', 'Mobile UI design', 'Authentication'],
    heroImgAlt: 'NoteDoctor.AI iOS sign-in and sign-up screens',
    heroImgSrc: '/images/projects/noteDoctorAi_ios/cover.webp',
    overview: {
      sidebar: 'A native iPhone app for NoteDoctor.AI, the prior authorization readiness platform. It\'s in development; these are the first screens.',
      heading: 'Prior authorization screening, coming to iPhone.',
      body: [
        'NoteDoctor.AI already runs on the web. The iOS app brings it to the phone, starting with the front door: signing in with an existing account and creating a new one.',
        'The screens carry over the web app\'s look: the NoteDoctor mark, soft clinical blues, roomy inputs and a single clear call to action. More screens will be added here as the app takes shape.',
      ],
    },
    gallery: [
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi_ios/sign-in.webp', label: 'Sign in', size: 'standard', fit: 'contain' },
      { bg: '#0d1017', src: '/images/projects/noteDoctorAi_ios/sign-up.webp', label: 'Create an account', size: 'standard', fit: 'contain' },
    ],
    nextProject: { slug: 'notedoctor-ai', tag: 'Web Design & Development', title: 'NoteDoctor.AI Marketing Site', desc: 'Full marketing site for an AI-powered prior authorization platform — design, development, content, and end-to-end deployment.', imgBg: '#0d1017' },
  },

]

export default PROJECTS
export const FEATURED_PROJECT = PROJECTS.find(p => p.featured)!
export const GRID_PROJECTS    = PROJECTS.filter(p => !p.featured)
