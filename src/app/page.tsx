import AboutSectionOne from '@/components/About/AboutSectionOne';
import AboutSectionTwo from '@/components/About/AboutSectionTwo';
import Blog from '@/components/Blog';
import Brands from '@/components/Brands';
import ScrollUp from '@/components/Common/ScrollUp';
import Contact from '@/components/Contact';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Video from '@/components/Video';
import { Metadata } from 'next';
import 'lightgallery.js/dist/css/lightgallery.css';
import Team from '@/components/Team';
import NewsLatterBox from '../components/Contact/NewsLetterBox';
import { Container, Space } from '@mantine/core';

export const metadata: Metadata = {
  title:
    'Center Point Digital | Custom Software Development, Design & Digital Marketing Solutions',
  description:
    'Center Point Digital | Custom Software Development, Design & Digital Marketing Solutions',
  openGraph: {
    images: ['./images/hero/draw.svg'],
  },
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />

      <Features />
      <Space h="xl" />
      <Container size={'xl'}>
        <NewsLatterBox />
      </Container>
      <Space h="xl" />
      {/* <Video /> */}
      {/* <Brands /> */}
      <AboutSectionOne />
      {/* <Team /> */}
      {/* <AboutSectionTwo /> */}
      {/* <Testimonials /> */}
      {/*<Pricing /> */}
      {/* <Blog /> */}
      <Contact showNewsLetter={false} />
    </>
  );
}
