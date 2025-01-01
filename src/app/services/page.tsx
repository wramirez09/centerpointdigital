'use client';
import { Container, Grid, List, Space, Text, ThemeIcon } from '@mantine/core';

import { Metadata } from 'next';
import Image from 'next/image';

import SectionTitle from '@/components/Common/SectionTitle';
import { IconCircleCheck } from '@tabler/icons-react';

import Contact from '@/components/Contact';

const metadata: Metadata = {
  title:
    'About Page | Custom Software Development, Design & Digital Marketing Solutions',
  description: 'Software | Marketing',
  // other metadata
};

const ServicesPage = () => {
  return (
    <>
      {/* <div className={classes.wrapper}>
        <HeroWithImage />
      </div> */}
      <Space h="md" />
      <Container my="lg" size={'xl'}>
        <Grid className="mt-20" align="center">
          <Grid.Col span={{ base: 12 }} className="mt-20">
            <SectionTitle
              size="25px"
              width="950px"
              mb="3rem"
              title="Tired of Managing Multiple Development Teams? Get a Complete
              Solution with Our Full-Stack Expertise."
              paragraph=" Our full-stack developers provide comprehensive solutions,
              handling every aspect of your project from start to finish, saving
              you time, money, and headaches."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 5 }}>
            <Image
              src="./images/services/collabo.svg"
              width="500"
              height="500"
              alt="collaboration image"
              className="mb-9"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 5 }}>
            {/* <Text c={'white'} mb="1rem" size="lg">
              Managing separate front-end, back-end, and database teams is a
              recipe for communication breakdowns, delays, and cost overruns.
              Our full-stack development team offers a better way:
            </Text> */}
            <List
              center
              spacing="md"
              c="white"
              size="md"
              icon={
                <ThemeIcon color="#6b63ff" size={24} radius="xl">
                  <IconCircleCheck style={{ width: '3rem', height: '3rem' }} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <p className="text-base !leading-relaxed  text-body-color text-md">
                  <strong className="text-white">
                    Streamlined Communication & Reduced Management Overhead:
                  </strong>{' '}
                  One team, one point of contact, one efficient process. Say
                  goodbye to endless meetings and conflicting priorities.
                </p>
              </List.Item>
              <List.Item>
                <p className="text-base !leading-relaxed  text-body-color text-md">
                  <strong className="text-white">
                    Faster Time to Market & Reduced Development Costs:
                  </strong>{' '}
                  Our integrated expertise and streamlined workflows accelerate
                  development and reduce overall project costs.
                </p>
              </List.Item>
              <List.Item>
                <p className="text-base !leading-relaxed  text-body-color text-md">
                  <strong className="text-white">
                    Higher Quality & Long-Term Value:{' '}
                  </strong>{' '}
                  We build scalable solutions designed to grow with your
                  business, minimizing the need for costly re-writes and
                  maximizing your return on investment.
                </p>
              </List.Item>
            </List>
          </Grid.Col>
        </Grid>
      </Container>
      <Space h="md" />
      <Container my="lg" size={'xl'}>
        <Grid align="center">
          <Grid.Col span={{ base: 12 }} className="mt-20">
            <SectionTitle
              size="25px"
              width="950px"
              mb="3rem"
              title="UX/UI Design: Creating Exceptional Digital Experiences"
              paragraph="We craft intuitive and engaging user interfaces that drive conversions and delight your customers."
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, xs: 5 }}>
            {/* <Text variant="p" c="white" mb={'1rem'} size="lg">
              Great UX/UI design is the key to creating successful digital
              products. We focus on understanding your users' needs and
              behaviors to create seamless and enjoyable experiences that
              achieve your business goals.
            </Text> */}
            <List
              center
              spacing="md"
              size="md"
              c="white"
              icon={
                <ThemeIcon color="#6b63ff" size={24} radius="xl">
                  <IconCircleCheck style={{ width: '3rem', height: '3rem' }} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <p className="text-base !leading-relaxed  text-body-color text-md">
                  <strong className="text-white">
                    User-Centered Approach:{' '}
                  </strong>{' '}
                  We prioritize understanding your target audience to create
                  designs that resonate with them.
                </p>
              </List.Item>
              <List.Item>
                <p className="text-base !leading-relaxed  text-body-color text-md">
                  <strong className="text-white">Intuitive Interfaces: </strong>{' '}
                  We design interfaces that are easy to navigate and use,
                  ensuring a smooth and enjoyable user experience.
                </p>
              </List.Item>
              <List.Item>
                <p className="text-base !leading-relaxed  text-body-color text-md">
                  <strong className="text-white">
                    Increased Conversions:{' '}
                  </strong>{' '}
                  Our designs are optimized to drive conversions, helping you
                  achieve your business objectives.
                </p>
              </List.Item>
            </List>
          </Grid.Col>

          <Grid.Col span={{ base: 12, xs: 5 }}>
            <Image
              src="./images/services/ui.svg"
              width="600"
              height="600"
              alt="collaboration image"
              className="mb-9"
            />
          </Grid.Col>
        </Grid>
      </Container>
      <Space h="md" />
      <Container my="lg" size={'xl'}>
        <Grid align="center">
          <Grid.Col span={{ base: 12 }} className="mt-20">
            <SectionTitle
              size="25px"
              width="950px"
              mb="3rem"
              title="Struggling to Reach Your Target Audience and Grow Your Brand Online?"
              paragraph="Our digital marketing services provide the solutions you need to achieve sustainable brand growth."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 5 }}>
            <Image
              src="./images/services/branding.svg"
              width="525"
              height="525"
              alt="collaboration image"
              className="mb-9"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 5 }}>
            {/* <Text variant="p" c="white" mb={'1rem'} size="lg">
              In today's competitive digital landscape, it's crucial to have a
              strong online presence. We help you overcome common challenges,
              such as:
            </Text> */}
            <List
              center
              size="md"
              spacing="md"
              c="white"
              icon={
                <ThemeIcon color="#6b63ff" size={24} radius="xl">
                  <IconCircleCheck style={{ width: '3rem', height: '3rem' }} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <p className="text-base !leading-relaxed  text-body-color text-md">
                  <strong className="text-white">Low Brand Awareness:</strong>{' '}
                  We increase your visibility and reach through targeted digital
                  marketing campaigns.
                </p>
              </List.Item>
              <List.Item>
                <p className="text-base !leading-relaxed  text-body-color text-md">
                  <strong className="text-white">Lack of Engagement:</strong> We
                  create engaging content and experiences that connect with your
                  audience.
                </p>
              </List.Item>
              <List.Item>
                <p className="text-base !leading-relaxed  text-body-color text-md">
                  <strong className="text-white">
                    Difficulty Generating Leads:
                  </strong>{' '}
                  We implement strategies that attract qualified leads and drive
                  conversions.
                </p>
              </List.Item>
            </List>
          </Grid.Col>
        </Grid>
      </Container>
      <Space h="md" />
      <Container size="xl">
        <Contact
          showNewsLetter={false}
          header=" Unlock Your Digital Potential"
          copy="Discover how our services can help you reach new heights. Contact us for a free consultation."
        />
      </Container>
    </>
  );
};

export default ServicesPage;
