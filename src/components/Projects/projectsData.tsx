import { Blog } from "@/types/blog";
import { Project } from "@/types/project";
import { IconAi, IconBrandCloudflare, IconBrandCss3, IconBrandFigma, IconBrandFramerMotion, IconBrandHtml5, IconBrandJavascript, IconBrandMantine, IconBrandNextjs, IconBrandReact, IconBrandTailwind, IconSitemap } from "@tabler/icons-react";

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
    title: "NoteDoctor AI",
    description: "Discover NoteDoctorAI, the premier provider of AI-driven solutions for healthcare. Revolutionizing medical coding with advanced technology to improve accuracy, efficiency, and profitability for healthcare organizations worldwide.",
    image: "/images/projects/notedoctor.png",
    link: "https://www.notedoctor.ai/",
    tags: ["AI", "Healthcare"],
    stacks: [
      <IconBrandHtml5 color="white"/>,
      <IconBrandFigma color="white"/>,
      <IconBrandMantine color="white"/>,
      <IconBrandNextjs color="white"/>,
      <IconBrandReact color="white"/>,
      <IconBrandJavascript color="white"/>,
      <IconSitemap color="white"/>,
      <IconAi color="white"/>
    ],
    methods: ['Agile Development', 'Unit Testing', 'A/B Testing', 'SEO']
  },
  {
    title: "Reaps Ink - Mobile Tattoo Studio",
    description: "Ink On the Go: Professional Tattooing Wherever You Are – Bold, Safe, and Personalized Art Delivered to You.",
    image: "/images/projects/reaps.png",
    link: "https://www.notedoctor.ai/",
    tags: ["E-commerce", "Art", "Gallery"],
    stacks: [
      <IconBrandHtml5 color="white"/>,
      <IconBrandCss3 color="white"/>,
      <IconBrandJavascript color="white"/>,
      <IconBrandReact color="white"/>,
      <IconBrandNextjs color="white"/>,
      <IconBrandMantine color="white"/>,
      <IconBrandTailwind color="white"/>,
      <IconBrandFramerMotion color="white"/>,
      <IconBrandCloudflare color="white"/>,
    ],
    methods: ['Agile Development', 'Unit Testing', 'A/B Testing', 'Edge Development']
  }
];
export default projectsData;
