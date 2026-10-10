export interface ServiceOffering { title: string; body: string }
export interface ServiceStep     { period: string; title: string; body: string }
export interface ServiceFaq      { q: string; a: string }

export interface Service {
  slug:      string
  num:       string
  name:      string
  sub:       string     // one-liner on the home page list
  title:     string[]   // hero title lines; the last one is amber
  intro:     string
  bestFor:   string[]
  overview:  { sidebar: string; heading: string; body: string[] }
  offerings: ServiceOffering[]
  process:   ServiceStep[]
  stack:     string[]
  workSlugs: string[]   // related projects from /work
  faqs:      ServiceFaq[]
}

const SERVICES: Service[] = [
  {
    slug: 'web-design-development',
    num: '01',
    name: 'Web Design & Development',
    sub: 'Fast, beautiful sites that convert visitors into customers',
    title: ['Websites that', 'convert.'],
    intro: 'Custom-designed, hand-built websites that load fast, rank well, and turn visitors into leads, bookings, and sales.',
    bestFor: ['New businesses launching online', 'Outdated sites that need a rebuild', 'Sites that need payments or a CMS'],
    overview: {
      sidebar: 'Design, development, content, and deployment handled by one team, so nothing gets lost between handoffs.',
      heading: 'Your website is your hardest-working salesperson.',
      body: [
        'Most small-business sites are slow, hard to update, and built from a template that looks like everyone else’s. We design every site around your customers and what you need them to do — call, book, buy, or sign up — and build it on a modern stack that stays fast as you grow.',
        'We handle the whole job: design, copy and content structure, development, a CMS your team can actually use, payments where you need them, domain and hosting setup, and launch. When we hand it over, it’s live, indexed, and ready to bring in business.',
      ],
    },
    offerings: [
      { title: 'Custom design',           body: 'A design system built for your brand — no recycled templates — with layouts that guide visitors to act.' },
      { title: 'Next.js development',     body: 'Fast, accessible, mobile-first builds with excellent Core Web Vitals and clean, maintainable code.' },
      { title: 'Content management',      body: 'Sanity or another headless CMS so you can edit pages, menus, and posts without calling a developer.' },
      { title: 'Payments & checkout',     body: 'Stripe checkout for products, tokens, deposits, or subscriptions, wired straight into your site.' },
      { title: 'Technical SEO',           body: 'Semantic markup, metadata, sitemaps, structured data, and speed work so search engines can find you.' },
      { title: 'Launch & hosting',        body: 'Domain transfer, DNS, SSL, server configuration, and deployment on Vercel, Cloudflare, or AWS.' },
    ],
    process: [
      { period: 'Week 1',   title: 'Discovery',     body: 'We learn your business, customers, and goals, audit your current site, and map the pages and content you need.' },
      { period: 'Week 2',   title: 'Design',        body: 'Wireframes, then full designs for key pages. You review and we refine until it feels right.' },
      { period: 'Week 3–4', title: 'Build',         body: 'We develop the site, connect the CMS and integrations, and load in your content.' },
      { period: 'Week 5',   title: 'Launch',        body: 'QA across devices, SEO setup, analytics, and go-live — plus a walkthrough so your team can run it.' },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Sanity CMS', 'Stripe', 'Vercel', 'Cloudflare', 'AWS'],
    workSlugs: ['notedoctor-ai', 'one-stop', 'spotless-carwash'],
    faqs: [
      { q: 'How long does a website take?', a: 'Most small-business sites launch in four to six weeks. Larger sites with custom integrations or lots of content take longer, and we’ll give you a firm timeline after discovery.' },
      { q: 'Will I be able to update the site myself?', a: 'Yes. We set up a CMS for the content you change often and walk your team through it before launch.' },
      { q: 'Do you handle hosting and domains?', a: 'We do. We can transfer your domain, set up DNS and SSL, and deploy to a host that fits your budget and traffic.' },
      { q: 'Can you redesign my existing site?', a: 'Absolutely. We’ll audit what’s working, keep what you’ve earned in search, and rebuild the rest.' },
    ],
  },
  {
    slug: 'mobile-apps',
    num: '02',
    name: 'Mobile Apps',
    sub: 'Native-quality iOS & Android from MVP to full product',
    title: ['Apps people', 'keep using.'],
    intro: 'iOS and Android apps that feel native, launch fast, and grow with your product — from a first MVP to a full release.',
    bestFor: ['Founders validating an MVP', 'Web products going mobile', 'Teams that need a polished v1'],
    overview: {
      sidebar: 'We scope the smallest version worth shipping, then build it to a standard you won’t have to throw away.',
      heading: 'From idea to the App Store, without the bloat.',
      body: [
        'A mobile app is a big investment, and the riskiest part is building the wrong thing. We start by pinning down the core job your app does for users, then design and build a focused first version you can put in front of real people quickly.',
        'We build with native Swift for iOS or React Native when you need both platforms from one codebase, and we connect your app to the same backend, auth, and APIs as your web product so everything stays in sync.',
      ],
    },
    offerings: [
      { title: 'Product scoping',        body: 'We define the MVP feature set, user flows, and success metrics before a line of code is written.' },
      { title: 'Mobile UI design',       body: 'Interfaces that follow iOS and Android conventions, so your app feels at home on every device.' },
      { title: 'Native iOS (Swift)',     body: 'SwiftUI apps with native performance, offline support, and access to device features.' },
      { title: 'Cross-platform',         body: 'React Native when you need iOS and Android from one codebase without a second team.' },
      { title: 'Backend & auth',         body: 'Sign-in, accounts, push notifications, and APIs shared with your web product.' },
      { title: 'App Store launch',       body: 'TestFlight betas, store listings, screenshots, review submission, and release management.' },
    ],
    process: [
      { period: 'Week 1–2',  title: 'Scope',     body: 'User flows, feature priorities, and a technical plan for the MVP.' },
      { period: 'Week 3–4',  title: 'Design',    body: 'Clickable prototypes you can test with users before we build.' },
      { period: 'Week 5–10', title: 'Build',     body: 'Two-week sprints with a TestFlight or internal build at the end of each one.' },
      { period: 'Launch',    title: 'Ship',      body: 'Store submission, release, crash monitoring, and a roadmap for what comes next.' },
    ],
    stack: ['Swift', 'SwiftUI', 'React Native', 'Expo', 'TypeScript', 'Supabase', 'Firebase', 'TestFlight'],
    workSlugs: ['notedoctor-ios'],
    faqs: [
      { q: 'Native or cross-platform?', a: 'If you’re iOS-first or need deep device features, we recommend native Swift. If you need both platforms on a tighter budget, React Native gets you there with one codebase.' },
      { q: 'How long until we’re in the App Store?', a: 'A focused MVP typically takes eight to twelve weeks from kickoff to store submission.' },
      { q: 'Can the app share a backend with our website?', a: 'Yes — and it usually should. We connect both to the same APIs and accounts so users get one consistent product.' },
      { q: 'Do you help after launch?', a: 'We offer ongoing support for updates, OS releases, new features, and monitoring.' },
    ],
  },
  {
    slug: 'ai-rag-applications',
    num: '03',
    name: 'AI & RAG Applications',
    sub: 'Custom LLM-powered apps and retrieval pipelines built for production',
    title: ['AI that works', 'in production.'],
    intro: 'LLM-powered apps, retrieval pipelines, APIs, and MCP servers grounded in your own data — built to be accurate, secure, and ready for real users.',
    bestFor: ['Teams with deep domain knowledge', 'Products adding AI features', 'Workflows buried in documents'],
    overview: {
      sidebar: 'We built the NoteDoctor.AI Prior Auth Engine: a RAG app, a public API, and an MCP server running inside Claude and ChatGPT.',
      heading: 'Beyond the demo: AI your customers can rely on.',
      body: [
        'It’s easy to wire up a chatbot. It’s hard to build an AI product that gives correct, cited answers from your own documents, handles edge cases, and holds up under real traffic. That’s the work we do.',
        'We design retrieval pipelines around your data, choose the right models for cost and quality, add evaluation so you know how well it performs, and ship it as a web app, a public API, or an MCP server that plugs your product straight into Claude, Cursor, and ChatGPT.',
      ],
    },
    offerings: [
      { title: 'RAG pipelines',          body: 'Ingestion, chunking, embeddings, vector search, and reranking tuned to your documents.' },
      { title: 'LLM applications',       body: 'Full-stack apps built around Claude, OpenAI, or open models, with streaming and tool use.' },
      { title: 'Agents & workflows',     body: 'Multi-step agents that call your tools and APIs to finish real tasks, not just answer questions.' },
      { title: 'MCP servers',            body: 'Model Context Protocol servers with OAuth that put your product inside AI assistants.' },
      { title: 'Public APIs',            body: 'Documented REST APIs with scoped keys, a playground, rate limits, and usage-based billing.' },
      { title: 'Evaluation & guardrails', body: 'Test sets, quality metrics, and safety checks so you can improve the system with confidence.' },
    ],
    process: [
      { period: 'Week 1–2', title: 'Discovery',  body: 'We map your data, the decisions it supports, and what a correct answer looks like.' },
      { period: 'Week 3–4', title: 'Prototype',  body: 'A working retrieval and generation pipeline, measured against a real evaluation set.' },
      { period: 'Week 5–7', title: 'Build',      body: 'The production app, API, or MCP server — auth, billing, logging, and UI included.' },
      { period: 'Week 8',   title: 'Launch',     body: 'Deployment, monitoring, cost controls, and a plan to keep improving quality.' },
    ],
    stack: ['Claude', 'OpenAI', 'LangChain', 'pgvector', 'Pinecone', 'Next.js', 'Python', 'MCP', 'AWS Bedrock'],
    workSlugs: ['notedoctor-prior-auth'],
    faqs: [
      { q: 'Is our data safe?', a: 'We design for privacy from the start: your data stays in your infrastructure where possible, providers are configured not to train on it, and access is scoped and logged.' },
      { q: 'Which model should we use?', a: 'It depends on your accuracy, speed, and cost needs. We benchmark candidates on your own data during the prototype phase and recommend the best fit.' },
      { q: 'What is an MCP server?', a: 'The Model Context Protocol lets AI assistants like Claude and ChatGPT use your product’s tools directly. An MCP server makes your product available wherever your users already work with AI.' },
      { q: 'How do you prevent wrong answers?', a: 'Grounding every answer in retrieved sources, citing them, measuring quality with evaluation sets, and adding guardrails for the cases that matter most.' },
    ],
  },
  {
    slug: 'branding-identity',
    num: '04',
    name: 'Branding & Identity',
    sub: 'Logos, visual systems, and guidelines built to last',
    title: ['Brands people', 'remember.'],
    intro: 'Logos, color, type, and visual systems that make your business recognizable everywhere it shows up — with guidelines that keep it consistent.',
    bestFor: ['New businesses naming and launching', 'Brands that have outgrown a DIY logo', 'Teams that need consistency'],
    overview: {
      sidebar: 'A brand is more than a logo. We build the whole system so every touchpoint looks like it came from the same place.',
      heading: 'Look like the business you’re becoming.',
      body: [
        'First impressions happen in seconds. A clear, confident identity tells customers you’re established and trustworthy before they read a word. We start with your positioning — who you serve and why you’re different — and design an identity that expresses it.',
        'You get a complete visual system: logo suite, color palette, typography, and usage rules, plus the files and templates your team needs to apply it across your website, social media, print, and signage.',
      ],
    },
    offerings: [
      { title: 'Brand strategy',      body: 'Positioning, audience, and personality workshops that give the design a clear direction.' },
      { title: 'Logo design',         body: 'A primary logo plus alternate lockups and marks for every size and surface.' },
      { title: 'Visual system',       body: 'Color, typography, iconography, and imagery direction that work together.' },
      { title: 'Brand guidelines',    body: 'A clear guide showing how to use your brand correctly — and how not to.' },
      { title: 'Collateral',          body: 'Business cards, menus, signage, decks, and social templates ready to use.' },
      { title: 'Digital assets',      body: 'Favicons, social avatars, email signatures, and web-ready files in every format.' },
    ],
    process: [
      { period: 'Week 1', title: 'Discover',  body: 'Workshops and research on your market, competitors, and customers.' },
      { period: 'Week 2', title: 'Explore',   body: 'Two or three distinct creative directions presented with real-world mockups.' },
      { period: 'Week 3', title: 'Refine',    body: 'We develop your chosen direction into a complete identity system.' },
      { period: 'Week 4', title: 'Deliver',   body: 'Guidelines, final files, and templates packaged for your team and vendors.' },
    ],
    stack: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Brand guidelines', 'Print-ready files'],
    workSlugs: ['runaway-cow'],
    faqs: [
      { q: 'What files will I receive?', a: 'Vector and raster logo files (SVG, PDF, PNG) in full color, one-color, and reversed versions, plus your guidelines and any templates we create.' },
      { q: 'How many concepts do we see?', a: 'Two or three distinct directions, each shown in real-world mockups so you can picture them in use.' },
      { q: 'Can you refresh our existing brand?', a: 'Yes. Sometimes a refresh that keeps your recognition is better than starting over, and we’ll tell you which we recommend.' },
      { q: 'Do I own the brand?', a: 'Yes. You own full rights to the final identity once the project is complete.' },
    ],
  },
  {
    slug: 'seo-digital-marketing',
    num: '05',
    name: 'SEO & Digital Marketing',
    sub: 'Organic growth strategies that compound over time',
    title: ['Get found.', 'Get chosen.'],
    intro: 'Technical SEO, local search, content, and paid campaigns that bring the right customers to you — and reporting that shows what’s working.',
    bestFor: ['Local service businesses', 'Sites with traffic but no leads', 'Businesses invisible on Google'],
    overview: {
      sidebar: 'We fix the foundations first, then build the content and campaigns that grow your traffic month over month.',
      heading: 'Growth that compounds instead of disappearing.',
      body: [
        'Ads stop working the day you stop paying. Good SEO keeps paying off. We start with a technical audit to fix what’s holding your site back, then build local listings, content, and links that earn rankings for the searches your customers actually make.',
        'Where paid campaigns make sense, we run them alongside organic work and track every lead back to its source, so you always know which dollars are paying for themselves.',
      ],
    },
    offerings: [
      { title: 'Technical SEO audit',  body: 'Site speed, crawlability, indexing, structured data, and Core Web Vitals fixes.' },
      { title: 'Local SEO',            body: 'Google Business Profile optimization, citations, and review strategy for local searches.' },
      { title: 'Content strategy',     body: 'Keyword research and pages that answer the questions your customers are asking.' },
      { title: 'On-page optimization', body: 'Titles, headings, internal links, and copy tuned for both people and search engines.' },
      { title: 'Paid campaigns',       body: 'Google and Meta ads with tight targeting, clear budgets, and conversion tracking.' },
      { title: 'Analytics & reporting', body: 'GA4 and Search Console set up properly, with monthly reports in plain English.' },
    ],
    process: [
      { period: 'Month 1',   title: 'Audit',    body: 'Technical, content, and competitor audit with a prioritized roadmap.' },
      { period: 'Month 1–2', title: 'Fix',      body: 'We resolve technical issues and optimize your existing pages and listings.' },
      { period: 'Month 2+',  title: 'Grow',     body: 'New content, local signals, and campaigns that build authority over time.' },
      { period: 'Monthly',   title: 'Report',   body: 'Rankings, traffic, and leads tracked against goals — and the next steps.' },
    ],
    stack: ['Google Search Console', 'GA4', 'Google Business Profile', 'Google Ads', 'Meta Ads', 'Ahrefs', 'Semrush'],
    workSlugs: ['one-stop', 'spotless-carwash'],
    faqs: [
      { q: 'How long does SEO take to work?', a: 'Technical fixes can help within weeks, but meaningful ranking growth usually takes three to six months, and it compounds from there.' },
      { q: 'Do you guarantee first-page rankings?', a: 'No honest agency can. We do commit to clear goals, transparent reporting, and the work that gives you the best chance of ranking.' },
      { q: 'Should I run ads or focus on SEO?', a: 'Often both: ads bring leads now while SEO builds lasting traffic. We’ll recommend a mix based on your budget and timeline.' },
      { q: 'Is there a long-term contract?', a: 'We work month to month after the initial audit and setup. We’d rather keep you with results than with a contract.' },
    ],
  },
  {
    slug: 'ui-ux-design',
    num: '06',
    name: 'UI/UX Design',
    sub: 'Research-led design that reduces friction and lifts retention',
    title: ['Design that', 'gets out of the way.'],
    intro: 'User research, product design, and prototypes that make your software easier to learn, faster to use, and harder to leave.',
    bestFor: ['SaaS products with churn', 'Complex workflows and dashboards', 'Products heading into a redesign'],
    overview: {
      sidebar: 'Every design decision is backed by research and tested with real users before it reaches development.',
      heading: 'Less friction, more retention.',
      body: [
        'Users don’t leave products because of missing features — they leave because the features they need are hard to find and slow to use. We find where people get stuck, then redesign the flows that matter most to your business.',
        'We work from research to wireframes to high-fidelity, interactive prototypes, and hand off a component library and specs your developers can build from directly — or we build it ourselves.',
      ],
    },
    offerings: [
      { title: 'User research',        body: 'Interviews, analytics review, and usability testing to find where users struggle.' },
      { title: 'UX audits',            body: 'An expert review of your product with prioritized, actionable fixes.' },
      { title: 'Information architecture', body: 'Navigation and structure that match how your users think about their work.' },
      { title: 'Wireframes & prototypes', body: 'Clickable prototypes that let you test ideas before paying to build them.' },
      { title: 'Visual UI design',     body: 'Polished, accessible interfaces that reflect your brand and build trust.' },
      { title: 'Design systems',       body: 'Reusable components and tokens in Figma and code that keep your product consistent.' },
    ],
    process: [
      { period: 'Week 1',   title: 'Research',  body: 'Interviews, analytics, and a UX audit to find the biggest opportunities.' },
      { period: 'Week 2',   title: 'Structure', body: 'User flows, information architecture, and wireframes for key journeys.' },
      { period: 'Week 3–4', title: 'Design',    body: 'High-fidelity screens and an interactive prototype tested with users.' },
      { period: 'Week 5',   title: 'Handoff',   body: 'Design system, specs, and support for developers — or we build it.' },
    ],
    stack: ['Figma', 'FigJam', 'Maze', 'Hotjar', 'Storybook', 'WCAG 2.2'],
    workSlugs: ['notedoctor-prior-auth', 'runaway-cow'],
    faqs: [
      { q: 'Do you only design, or build too?', a: 'Both. We can hand off to your developers with a full spec, or build the design ourselves as part of a web or mobile engagement.' },
      { q: 'How do you test designs?', a: 'With clickable prototypes and real users — moderated sessions or unmoderated tests, depending on your timeline and audience.' },
      { q: 'Can you work with our existing design system?', a: 'Yes. We’ll extend and improve what you have rather than starting from scratch unless it’s holding you back.' },
      { q: 'Is accessibility included?', a: 'Always. We design to WCAG 2.2 AA standards for contrast, focus states, and keyboard and screen-reader use.' },
    ],
  },
  {
    slug: 'social-media-management',
    num: '07',
    name: 'Social Media Management',
    sub: 'On-brand content that builds community and drives leads',
    title: ['Show up,', 'every week.'],
    intro: 'Strategy, content creation, scheduling, and community management that keep your brand active, on-message, and bringing in leads.',
    bestFor: ['Owners without time to post', 'Brands with inconsistent feeds', 'Local businesses building a following'],
    overview: {
      sidebar: 'A content calendar built around your goals, created on-brand, and posted on schedule — every month.',
      heading: 'A steady presence, without the daily grind.',
      body: [
        'Social media rewards consistency, and that’s the hardest part for a busy business. We take it off your plate: we plan a monthly calendar around your promotions and seasons, create the posts, schedule them, and respond to your community.',
        'Everything stays on-brand and tied to a goal — calls, bookings, foot traffic, or followers — and you get a clear monthly report on what’s growing.',
      ],
    },
    offerings: [
      { title: 'Social strategy',       body: 'Channel selection, audience, content pillars, and goals that match your business.' },
      { title: 'Content calendar',      body: 'A monthly plan built around launches, promotions, and seasonal moments.' },
      { title: 'Content creation',      body: 'Graphics, short-form video, carousels, and captions written in your voice.' },
      { title: 'Scheduling & posting',  body: 'Consistent posting at the times your audience is most active.' },
      { title: 'Community management',  body: 'Replies to comments and messages so customers always hear back.' },
      { title: 'Paid social',           body: 'Boosted posts and targeted campaigns that turn followers into customers.' },
    ],
    process: [
      { period: 'Week 1',   title: 'Strategy',  body: 'Audit of your accounts and competitors, plus goals and content pillars.' },
      { period: 'Week 2',   title: 'Create',    body: 'Your first month of content designed, written, and sent for approval.' },
      { period: 'Ongoing',  title: 'Publish',   body: 'Scheduled posting and daily community management across your channels.' },
      { period: 'Monthly',  title: 'Review',    body: 'Performance report and next month’s calendar, adjusted to what works.' },
    ],
    stack: ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Google Business Profile', 'Canva', 'Meta Business Suite'],
    workSlugs: [],
    faqs: [
      { q: 'Which platforms should we be on?', a: 'Wherever your customers already spend time. For most local businesses that’s Instagram, Facebook, and Google Business Profile; B2B brands usually focus on LinkedIn.' },
      { q: 'Do I approve posts before they go live?', a: 'Yes. You review each month’s calendar before anything is scheduled.' },
      { q: 'Can you create video content?', a: 'Yes — short-form video and Reels from your footage, stock, or a shoot we plan together.' },
      { q: 'How many posts per month?', a: 'It depends on your plan and channels, typically three to five posts per week per platform.' },
    ],
  },
];

export default SERVICES;
