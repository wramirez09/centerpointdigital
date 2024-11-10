import Breadcrumb from '@/components/Common/Breadcrumb';
import { Container, Text, Button, Group } from '@mantine/core';
import { GithubIcon } from '@mantinex/dev-icons';
import { Metadata } from 'next';
import classes from './HeroTitle.module.css';
import { HeroWithImage } from '@/components/HeroWithImage';

export const metadata: Metadata = {
  title:
    'About Page | Custom Software Development, Design & Digital Marketing Solutions',
  description: 'Software | Marketing',
  // other metadata
};

const ServicesPage = () => {
  return (
    <>
      {/* <Breadcrumb
        pageName="About Page"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      /> */}
      <div className={classes.wrapper}>
        <HeroWithImage />
      </div>
      );
    </>
  );
};

export default ServicesPage;
