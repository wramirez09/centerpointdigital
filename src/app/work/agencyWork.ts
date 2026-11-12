// Earlier agency work, as published on Behance (behance.net/wramirez09).
// Covers are the full-size project covers Behance serves (the 2013–2015 ones only exist at 404×316);
// gallery images are each project's body images at their source size, in Behance's order.

export interface AgencyWork {
  slug:       string
  name:       string
  year:       string
  src:        string
  width:      number
  height:     number
  behanceUrl: string
  /** Project images after the cover, shown in this project's lightbox. */
  gallery?:   { src: string; width: number; height: number }[]
}

export const AGENCY_WORK: AgencyWork[] = [
  { slug: 'blackbook-studio', name: 'Blackbook Studio', year: '2018', src: '/images/projects/agency/blackbook-studio.webp', width: 1400, height: 675, behanceUrl: 'https://www.behance.net/gallery/66761229/Blackbook-Studio', gallery: [
    { src: '/images/projects/agency/blackbook-studio/01.webp', width: 1762, height: 849 },
    { src: '/images/projects/agency/blackbook-studio/02.webp', width: 402, height: 841 },
    { src: '/images/projects/agency/blackbook-studio/03.webp', width: 1755, height: 888 },
    { src: '/images/projects/agency/blackbook-studio/04.webp', width: 1754, height: 892 },
    { src: '/images/projects/agency/blackbook-studio/05.webp', width: 403, height: 893 },
  ] },
  { slug: 'prep4love-microsite', name: 'Prep4Love Microsite', year: '2016', src: '/images/projects/agency/prep4love-microsite.webp', width: 1027, height: 738, behanceUrl: 'https://www.behance.net/gallery/35691165/Prep4Love-Microsite', gallery: [
    { src: '/images/projects/agency/prep4love-microsite/01.webp', width: 1865, height: 960 },
    { src: '/images/projects/agency/prep4love-microsite/02.webp', width: 1864, height: 795 },
    { src: '/images/projects/agency/prep4love-microsite/03.webp', width: 380, height: 669 },
    { src: '/images/projects/agency/prep4love-microsite/04.webp', width: 374, height: 668 },
    { src: '/images/projects/agency/prep4love-microsite/05.webp', width: 374, height: 673 },
  ] },
  { slug: 'cordova-ios-app-prototypes', name: 'Cordova - iOS app prototypes', year: '2015', src: '/images/projects/agency/cordova-ios-app-prototypes.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/24019173/Cordova-iOS-app-prototypes', gallery: [
    { src: '/images/projects/agency/cordova-ios-app-prototypes/01.webp', width: 318, height: 513 },
    { src: '/images/projects/agency/cordova-ios-app-prototypes/02.webp', width: 316, height: 516 },
    { src: '/images/projects/agency/cordova-ios-app-prototypes/03.webp', width: 402, height: 585 },
    { src: '/images/projects/agency/cordova-ios-app-prototypes/04.webp', width: 401, height: 589 },
    { src: '/images/projects/agency/cordova-ios-app-prototypes/05.webp', width: 400, height: 585 },
    { src: '/images/projects/agency/cordova-ios-app-prototypes/06.webp', width: 395, height: 586 },
    { src: '/images/projects/agency/cordova-ios-app-prototypes/07.webp', width: 404, height: 586 },
  ] },
  { slug: 'unitedhealthcare-microsite', name: 'UnitedHealthcare Microsite', year: '2015', src: '/images/projects/agency/unitedhealthcare-microsite.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/24018859/UnitedHealthcare-mIcrosite', gallery: [
    { src: '/images/projects/agency/unitedhealthcare-microsite/01.webp', width: 1272, height: 642 },
    { src: '/images/projects/agency/unitedhealthcare-microsite/02.webp', width: 405, height: 674 },
    { src: '/images/projects/agency/unitedhealthcare-microsite/03.webp', width: 1215, height: 551 },
    { src: '/images/projects/agency/unitedhealthcare-microsite/04.webp', width: 1215, height: 669 },
    { src: '/images/projects/agency/unitedhealthcare-microsite/05.webp', width: 403, height: 667 },
    { src: '/images/projects/agency/unitedhealthcare-microsite/06.webp', width: 395, height: 547 },
    { src: '/images/projects/agency/unitedhealthcare-microsite/07.webp', width: 1217, height: 669 },
    { src: '/images/projects/agency/unitedhealthcare-microsite/08.webp', width: 1219, height: 663 },
    { src: '/images/projects/agency/unitedhealthcare-microsite/09.webp', width: 400, height: 669 },
  ] },
  { slug: 'wordpress-development-trisect-digital', name: 'WordPress Development - Trisect Digital', year: '2015', src: '/images/projects/agency/wordpress-development-trisect-digital.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/22472901/WordPress-Development-Trisect-Digital-', gallery: [
    { src: '/images/projects/agency/wordpress-development-trisect-digital/01.webp', width: 1256, height: 674 },
    { src: '/images/projects/agency/wordpress-development-trisect-digital/02.webp', width: 1245, height: 656 },
    { src: '/images/projects/agency/wordpress-development-trisect-digital/03.webp', width: 1246, height: 608 },
    { src: '/images/projects/agency/wordpress-development-trisect-digital/04.webp', width: 398, height: 675 },
    { src: '/images/projects/agency/wordpress-development-trisect-digital/05.webp', width: 1067, height: 598 },
    { src: '/images/projects/agency/wordpress-development-trisect-digital/06.webp', width: 401, height: 602 },
    { src: '/images/projects/agency/wordpress-development-trisect-digital/07.webp', width: 401, height: 684 },
    { src: '/images/projects/agency/wordpress-development-trisect-digital/08.webp', width: 397, height: 682 },
    { src: '/images/projects/agency/wordpress-development-trisect-digital/09.webp', width: 400, height: 680 },
    { src: '/images/projects/agency/wordpress-development-trisect-digital/10.webp', width: 402, height: 676 },
  ] },
  { slug: 'who-is-the-7th-man', name: 'Who Is the 7th Man', year: '2015', src: '/images/projects/agency/who-is-the-7th-man.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/22471391/Who-Is-the-7th-Man', gallery: [
    { src: '/images/projects/agency/who-is-the-7th-man/01.webp', width: 1280, height: 707 },
    { src: '/images/projects/agency/who-is-the-7th-man/02.webp', width: 1279, height: 620 },
    { src: '/images/projects/agency/who-is-the-7th-man/03.webp', width: 1277, height: 678 },
    { src: '/images/projects/agency/who-is-the-7th-man/04.webp', width: 402, height: 462 },
    { src: '/images/projects/agency/who-is-the-7th-man/05.webp', width: 403, height: 662 },
    { src: '/images/projects/agency/who-is-the-7th-man/06.webp', width: 402, height: 679 },
    { src: '/images/projects/agency/who-is-the-7th-man/07.webp', width: 1191, height: 682 },
  ] },
  { slug: 'high-fidelity-prototypes-slimjim-com', name: 'High Fidelity Prototypes - SlimJim.com', year: '2015', src: '/images/projects/agency/high-fidelity-prototypes-slimjim-com.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/22469481/High-Fidelity-Prototypes-SlimJimcom', gallery: [
    { src: '/images/projects/agency/high-fidelity-prototypes-slimjim-com/01.webp', width: 1394, height: 914 },
    { src: '/images/projects/agency/high-fidelity-prototypes-slimjim-com/02.webp', width: 1394, height: 914 },
    { src: '/images/projects/agency/high-fidelity-prototypes-slimjim-com/03.webp', width: 618, height: 674 },
    { src: '/images/projects/agency/high-fidelity-prototypes-slimjim-com/04.webp', width: 615, height: 640 },
    { src: '/images/projects/agency/high-fidelity-prototypes-slimjim-com/05.webp', width: 398, height: 683 },
    { src: '/images/projects/agency/high-fidelity-prototypes-slimjim-com/06.webp', width: 404, height: 682 },
  ] },
  { slug: 'facebook-tab-app', name: 'Facebook Tab App', year: '2014', src: '/images/projects/agency/facebook-tab-app.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/17314627/Facebook-Tab-App', gallery: [
    { src: '/images/projects/agency/facebook-tab-app/01.webp', width: 683, height: 692 },
    { src: '/images/projects/agency/facebook-tab-app/02.webp', width: 785, height: 579 },
    { src: '/images/projects/agency/facebook-tab-app/03.webp', width: 793, height: 579 },
    { src: '/images/projects/agency/facebook-tab-app/04.webp', width: 781, height: 578 },
    { src: '/images/projects/agency/facebook-tab-app/05.webp', width: 770, height: 575 },
    { src: '/images/projects/agency/facebook-tab-app/06.webp', width: 779, height: 572 },
    { src: '/images/projects/agency/facebook-tab-app/07.webp', width: 983, height: 581 },
  ] },
  { slug: 'micro-site', name: 'micro-site', year: '2014', src: '/images/projects/agency/micro-site.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/13677463/micro-site', gallery: [
    { src: '/images/projects/agency/micro-site/01.webp', width: 1577, height: 878 },
    { src: '/images/projects/agency/micro-site/02.webp', width: 1310, height: 927 },
    { src: '/images/projects/agency/micro-site/03.webp', width: 1198, height: 939 },
    { src: '/images/projects/agency/micro-site/04.webp', width: 1115, height: 946 },
    { src: '/images/projects/agency/micro-site/05.webp', width: 988, height: 926 },
    { src: '/images/projects/agency/micro-site/06.webp', width: 403, height: 797 },
    { src: '/images/projects/agency/micro-site/07.webp', width: 407, height: 794 },
  ] },
  { slug: 'acallfromsanta-packagefromsanta-com', name: 'acallfromsanta.packagefromsanta.com', year: '2013', src: '/images/projects/agency/acallfromsanta-packagefromsanta-com.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/12137571/acallfromsantapackagefromsantacom', gallery: [
    { src: '/images/projects/agency/acallfromsanta-packagefromsanta-com/01.webp', width: 896, height: 871 },
  ] },
  { slug: 'aris-at-home', name: 'ARIS at home.', year: '2013', src: '/images/projects/agency/aris-at-home.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/10179777/ARIS-at-home', gallery: [
    { src: '/images/projects/agency/aris-at-home/01.webp', width: 476, height: 851 },
    { src: '/images/projects/agency/aris-at-home/02.webp', width: 1063, height: 645 },
    { src: '/images/projects/agency/aris-at-home/03.webp', width: 793, height: 870 },
    { src: '/images/projects/agency/aris-at-home/04.webp', width: 479, height: 663 },
    { src: '/images/projects/agency/aris-at-home/05.webp', width: 478, height: 858 },
  ] },
  { slug: 'alex-siegel-gray-spear-society-series', name: 'Alex Siegel: Gray Spear Society Series', year: '2013', src: '/images/projects/agency/alex-siegel-gray-spear-society-series.webp', width: 404, height: 316, behanceUrl: 'https://www.behance.net/gallery/10180125/Alex-Siegel-Gray-Spear-Society-Series', gallery: [
    { src: '/images/projects/agency/alex-siegel-gray-spear-society-series/01.webp', width: 500, height: 822 },
    { src: '/images/projects/agency/alex-siegel-gray-spear-society-series/02.webp', width: 500, height: 625 },
    { src: '/images/projects/agency/alex-siegel-gray-spear-society-series/03.webp', width: 1369, height: 855 },
  ] },
];
