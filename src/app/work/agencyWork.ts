// Earlier agency work, as published on Behance (behance.net/wramirez09).
// Images are the full-size project covers Behance serves; the 2013–2015 covers only exist at 404×316.

export const BEHANCE_PROFILE = 'https://www.behance.net/wramirez09';

export interface AgencyWork {
  slug:       string
  name:       string
  year:       string
  src:        string
  width:      number
  height:     number
  behanceUrl: string
}

export const AGENCY_WORK: AgencyWork[] = [
  { slug: 'blackbook-studio', name: 'Blackbook Studio', year: '2018', src: '/images/projects/agency/blackbook-studio.webp', width: 1400, height: 675, behanceUrl: 'https://www.behance.net/gallery/66761229/Blackbook-Studio' },
  { slug: 'prep4love-microsite', name: 'Prep4Love Microsite', year: '2016', src: '/images/projects/agency/prep4love-microsite.webp', width: 1027, height: 738, behanceUrl: 'https://www.behance.net/gallery/35691165/Prep4Love-Microsite' },
  { slug: 'cordova-ios-app-prototypes', name: 'Cordova - iOS app prototypes', year: '2015', src: '/images/projects/agency/cordova-ios-app-prototypes.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/24019173/Cordova-iOS-app-prototypes' },
  { slug: 'unitedhealthcare-microsite', name: 'UnitedHealthcare Microsite', year: '2015', src: '/images/projects/agency/unitedhealthcare-microsite.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/24018859/UnitedHealthcare-mIcrosite' },
  { slug: 'wordpress-development-trisect-digital', name: 'WordPress Development - Trisect Digital', year: '2015', src: '/images/projects/agency/wordpress-development-trisect-digital.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/22472901/WordPress-Development-Trisect-Digital-' },
  { slug: 'who-is-the-7th-man', name: 'Who Is the 7th Man', year: '2015', src: '/images/projects/agency/who-is-the-7th-man.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/22471391/Who-Is-the-7th-Man' },
  { slug: 'high-fidelity-prototypes-slimjim-com', name: 'High Fidelity Prototypes - SlimJim.com', year: '2015', src: '/images/projects/agency/high-fidelity-prototypes-slimjim-com.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/22469481/High-Fidelity-Prototypes-SlimJimcom' },
  { slug: 'facebook-tab-app', name: 'Facebook Tab App', year: '2014', src: '/images/projects/agency/facebook-tab-app.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/17314627/Facebook-Tab-App' },
  { slug: 'micro-site', name: 'micro-site', year: '2014', src: '/images/projects/agency/micro-site.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/13677463/micro-site' },
  { slug: 'acallfromsanta-packagefromsanta-com', name: 'acallfromsanta.packagefromsanta.com', year: '2013', src: '/images/projects/agency/acallfromsanta-packagefromsanta-com.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/12137571/acallfromsantapackagefromsantacom' },
  { slug: 'aris-at-home', name: 'ARIS at home.', year: '2013', src: '/images/projects/agency/aris-at-home.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/10179777/ARIS-at-home' },
  { slug: 'alex-siegel-gray-spear-society-series', name: 'Alex Siegel: Gray Spear Society Series', year: '2013', src: '/images/projects/agency/alex-siegel-gray-spear-society-series.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/10180125/Alex-Siegel-Gray-Spear-Society-Series' },
];
