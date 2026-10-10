'use client';
import Image from 'next/image';
import SectionTitle from '../Common/SectionTitle';
import { motion } from 'framer-motion';
import { Container } from '@mantine/core';

const checkIcon = (
  <svg width="12" height="12" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutSectionOne = () => {
  const List = ({ text }) => (
    <p className="mb-5 flex items-center text-sm font-medium text-body-color">
      <span className="mr-4 flex h-[20px] w-[20px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <Container size={'xl'}>
        <div className="border-b border-body-color/[.15] dark:border-white/[.15] md:pt-20 lg:pt-28">
          <SectionTitle
            width="100%"
            title={'Digital Solutions for Businesses of Any Size and Type'}
            paragraph={
              "Whether you're a startup or an established enterprise, Center Point Digital provides comprehensive digital solutions to help you achieve your business objectives. From building scalable websites and web apps to implementing targeted digital marketing campaigns, we are here to help your business grow."
            }
          ></SectionTitle>
        </div>
      </Container>
      <Container size={'xl'}>
        <section id="about" className="pt-16 md:pt-20 lg:pt-25">
          <div className="container">
            <div className="border-b border-body-color/[.15] dark:border-white/[.15] md:pb-20 lg:pb-28">
              <div className="-mx-4 flex flex-wrap items-center">
                <div className="w-full px-4 lg:w-1/2">
                  <SectionTitle
                    title="Our Robust Tech Stack & Expertise"
                    paragraph="Our full-stack development team utilizes a robust tech stack including Angular, Next.js, Node, and more to build scalable websites, web apps, and mobile solutions. Specific Services Include:"
                    mb="35px"
                    size="35"
                  />

                  <div
                    className="mb-12 max-w-[570px] lg:mb-0"
                    data-wow-delay=".15s"
                  >
                    <div className="mx-[-12px] flex flex-wrap">
                      <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                        <List text="CMS development (Wordpress)" />
                        <List text="API development and integration" />
                        <List text="Tailored SEO and engaging, targeted content" />
                        <List text="Develop brand presence and engagement across social platforms" />
                      </div>

                      <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                        <List text="Targeted traffic through Google Ads, social media ads, and retargeting" />
                        <List text="Develop brand presence and engagement across social platforms." />
                        <List text="Email Marketing & CRM Integration" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full px-4 lg:w-1/2">
                  <div className="relative mx-auto aspect-[25/24] max-w-[500px] lg:mr-0">
                    <Image
                      src="/images/about/device.svg"
                      alt="about-image"
                      fill
                      className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </motion.div>
  );
};

export default AboutSectionOne;
