import { rem } from '@mantine/core';
import {
  IconBrandFigma,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandReact,
  IconBrandTypescript,
  IconBrandVscode,
  IconDatabase,
  IconJson,
  IconRuler,
} from '@tabler/icons-react';

export type Service = {
  scrollId?: string;
  header: string;
  desc: string;
  icons: React.ReactElement<any, any>[];
  subheader: string;
  subDesc?: string;
  subheader2?: string;
  subDesc2?: string;
  icons2?: React.ReactElement<any, any>[];
};

export const serviceData: Service[] = [
  {
    header:
      'Full-Stack Development: Building Scalable, Secure, Custom Solutions',
    desc: ' Our Full-Stack Development services offer complete, end-to-end solutions that bring your vision to life, from front-end interfaces to back-end systems and databases. We specialize in crafting responsive, high-performance applications tailored to meet the unique needs of your business, using the latest technologies to ensure functionality scalability, and a seamless user experience.',
    subheader: ' Front-End Development',
    subDesc:
      '  The front-end is where users interact with your brand, and we make sure it’s engaging, intuitive, and visually appealing. Using frameworks like React, Angular, and Next.js, we buil responsive interfaces that adapt perfectly to any device. We emphasize performance and accessibility, optimizing load times and ensuring a smooth, consistent experience across platforms. By closely following your design and branding requirements, we deliver interfaces that captivate users and enhance usability.',
    icons: [
      <IconBrandReact
        stroke={1}
        style={{
          width: rem(50),
          height: rem(50),
          color: 'rgb(74 108 247)',
        }}
      />,
      <IconBrandNextjs
        stroke={1}
        style={{
          width: rem(50),
          height: rem(50),
          color: 'rgb(74 108 247)',
        }}
      />,
      <IconBrandTypescript
        stroke={1}
        style={{
          width: rem(50),
          height: rem(50),
          color: 'rgb(74 108 247)',
        }}
      />,
    ],
    subheader2: 'Back-End Development',
    subDesc2:
      '  Our backend development services focus on building secure, high-performance architectures that support seamless user experiences and scale with your business. We design and implement efficient server-side solutions, databases, and APIs tailored to your unique requirements. Whether you need a robust backend for a web application, a data-driven API, or cloud-based infrastructure, we have you covered.',
    icons2: [
      <IconBrandNodejs
        stroke={1}
        style={{
          width: rem(50),
          height: rem(50),
          color: 'rgb(74 108 247)',
        }}
      />,
      <IconJson
        stroke={1}
        style={{
          width: rem(50),
          height: rem(50),
          color: 'rgb(74 108 247)',
        }}
      />,
      <IconDatabase
        stroke={1}
        style={{
          width: rem(50),
          height: rem(50),
          color: 'rgb(74 108 247)',
        }}
      />,
    ],
  },

  {
    header: 'Design-to-Code Services',
    desc: 'Your company’s Design-to-Code services transform creative concepts into fully functional websites, web applications, and other digital products. Leveraging expertise in HTML, CSS, JavaScript, and frameworks like React or Angular, your team converts design assets—such as Figma, Sketch, or Adobe XD files—into pixel-perfect, responsive code. These services ensure that every detail from the original design translates smoothly across devices, preserving UX/UI integrity and delivering high-quality digital experiences that align with your clients’ vision and brand standards.',
    subheader: 'Pixel-Perfect & Responsive Development',
    subDesc:
      'Our Design-to-Code services meticulously convert your Figma, Sketch, or Adobe XD designs into flawless, responsive code. We ensure pixel-perfect accuracy, bringing every element—from spacing to typography—to life across all devices. With a strong focus on performance, we write optimized HTML, CSS, and JavaScript that deliver quick load times and seamless navigation for an outstanding user experience.',
    subheader2: 'Built for Modern Frameworks & Future Growth',
    subDesc2:
      'Our skilled team uses frameworks like React, Angular, and Vue.js to create scalable, interactive applications. We prioritize accessibility and SEO, using best practices for inclusive access and search engine visibility. From fast deployment on AWS or Azure to ongoing support, we help your project launch smoothly and scale confidently as your business grows.',
    icons: [
      <IconBrandFigma
        stroke={1}
        style={{
          width: rem(50),
          height: rem(50),
          color: 'rgb(74 108 247)',
        }}
      />,
      <IconRuler
        stroke={1}
        style={{
          width: rem(50),
          height: rem(50),
          color: 'rgb(74 108 247)',
        }}
      />,
      <IconBrandVscode
        stroke={1}
        style={{
          width: rem(50),
          height: rem(50),
          color: 'rgb(74 108 247)',
        }}
      />,
    ],
  },
];
