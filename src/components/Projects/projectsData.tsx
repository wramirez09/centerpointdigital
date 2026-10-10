import { Project } from '@/types/project';
import {
  IconAi,
  IconBrandCloudflare,
  IconBrandCss3,
  IconBrandFigma,
  IconBrandFramerMotion,
  IconBrandHtml5,
  IconBrandJavascript,
  IconBrandMantine,
  IconBrandNextjs,
  IconBrandReact,
  IconBrandSass,
  IconBrandStripe,
  IconBrandTailwind,
  IconCodePlus,
  IconNewSection,
  IconSeo,
  IconSitemap,
} from '@tabler/icons-react';

// const projectsData: Blog[] = [
// {
//   id: 1,
//   title: "1 Stop Maintanence LLC",
//   paragraph:
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet dictum neque, laoreet dolor.",
//   image: "/images/blog/blog-01.jpg",
//   author: {
//     name: "Samuyl Joshi",
//     image: "/images/blog/author-01.png",
//     designation: "Graphic Designer",
//   },
//   tags: ["creative"],
//   publishDate: "2025",
// },
// {
//   id: 2,
//   title: "9 simple ways to improve your design skills",
//   paragraph:
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet dictum neque, laoreet dolor.",
//   image: "/images/blog/blog-02.jpg",
//   author: {
//     name: "Musharof Chy",
//     image: "/images/blog/author-02.png",
//     designation: "Content Writer",
//   },
//   tags: ["computer"],
//   publishDate: "2025",
// },
// {
//   id: 3,
//   title: "Tips to quickly improve your coding speed.",
//   paragraph:
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet dictum neque, laoreet dolor.",
//   image: "/images/blog/blog-03.jpg",
//   author: {
//     name: "Lethium Deo",
//     image: "/images/blog/author-03.png",
//     designation: "Graphic Designer",
//   },
//   tags: ["design"],
//   publishDate: "2025",
// },
// ];

const projectsData: Project[] = [
  {
    title: 'NoteDoctor.AI',
    description:
      "This project focuses on the creation of a modern, scalable, and maintainable static marketing website with a custom design and development approach. The core emphasis is on delivering exceptional performance, robust SEO, and a seamless user experience. The resulting website boasts blazing-fast page load times, significantly improving user engagement and reducing bounce rates. Enhanced SEO performance is achieved through static site generation and the implementation of structured data, making it easier for search engines to crawl and index the site. Furthermore, the website features a responsive design that adapts seamlessly to all screen sizes, ensuring optimal viewing on desktops, tablets, and mobile devices. A unique, custom-designed aesthetic reflects the brand's identity and provides a memorable online presence. Finally, integrated analytics provide valuable insights into user behavior, enabling data-driven decisions for future improvements and marketing strategies.",
    image: '/images/projects/notedoctor.png',
    link: 'https://notedoctor.ai/',
    tags: [
      { tag: 'Branding & Design', icon: <IconBrandFigma color={'#FFF'} /> },
      { tag: 'Custom Development', icon: <IconCodePlus color={'#FFF'} /> },
      { tag: 'Search Engine Optimization', icon: <IconSeo color={'#FFF'} /> },
      {
        tag: 'Component Architecture',
        icon: <IconNewSection color={'#FFF'} />,
      },
    ],
    stacks: [
      <IconBrandHtml5 color="white" />,
      <IconBrandFigma color="white" />,
      <IconBrandMantine color="white" />,
      <IconBrandNextjs color="white" />,
      <IconBrandReact color="white" />,
    ],
    methods: [
      'Agile Development',
      'Unit Testing',
      'Stakeholder Collaboration',
      'SEO',
    ],
  },
  {
    title: 'Reaps Ink',
    description:
      'Mobile Tattoo Studio: Professional Tattooing Wherever You Are – Bold, Safe, and Personalized Art Delivered to You.',
    image: '/images/projects/reaps.png',
    link: 'https://reaps-tattoo.pages.dev/',
    tags: [
      { tag: 'Branding & Design' },
      { tag: 'Custom Development' },
      { tag: 'Search Engine Optimization' },
      { tag: 'Component Architecture' },
    ],
    stacks: [
      <IconBrandHtml5 color="white" />,
      <IconBrandCss3 color="white" />,
      <IconBrandJavascript color="white" />,
      <IconBrandReact color="white" />,
      <IconBrandNextjs color="white" />,
      <IconBrandMantine color="white" />,
      <IconBrandTailwind color="white" />,
      <IconBrandFramerMotion color="white" />,
      <IconBrandCloudflare color="white" />,
    ],
    methods: [
      'Agile Development',
      'Responsive Design',
      'A/B Testing',
      'Edge Development',
    ],
  },
  {
    title: 'RG Maintanence',
    description:
      'RG Maintanence is your trusted partner for all construction needs. From residential homes to commercial spaces, we specialize in delivering high-quality, eco-friendly projects that combine innovation and functionality. With a team of skilled professionals and over a decade of industry experience, we ensure every project is completed on time and within budget. Explore our portfolio or contact us today to start your next project!',
    image: '/images/projects/rb.png',
    link: 'https://rb-construction.pages.dev/',
    tags: [
      { tag: 'Branding & Design' },
      { tag: 'Custom Development' },
      { tag: 'Search Engine Optimization' },
      { tag: 'Component Architecture' },
    ],
    stacks: [
      <IconBrandHtml5 color="white" />,
      <IconBrandCss3 color="white" />,
      <IconBrandJavascript color="white" />,
      <IconBrandSass color="white" />,
      <IconBrandNextjs color="white" />,
      <IconBrandTailwind color="white" />,
      <IconBrandStripe color="white" />,
      <IconBrandCloudflare color="white" />,
    ],
    methods: [
      'Agile Development',
      'Unit Testing',
      'A/B Testing',
      'Edge Development',
    ],
  },
];
export default projectsData;
