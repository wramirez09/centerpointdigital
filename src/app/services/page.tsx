'use client';

import Breadcrumb from '@/components/Common/Breadcrumb';
import { Card, Container, Grid, rem, Text, Title } from '@mantine/core';

import { Metadata } from 'next';
import classes from './HeroTitle.module.css';
import { HeroWithImage } from '@/components/HeroWithImage';
import { Service, serviceData } from './servicesData';

const metadata: Metadata = {
  title:
    'About Page | Custom Software Development, Design & Digital Marketing Solutions',
  description: 'Software | Marketing',
  // other metadata
};

const PRIMARY_COL_HEIGHT = rem(300);

const Services: React.FC<{ data: Service[] }> = ({ data }) => {
  return data.map(service => {
    return (
      <Container my="md" className="py-10" size={'lg'} id="">
        <Title size="h1" c="#FFF">
          {service.header}
        </Title>
        <hr style={{ opacity: 0.3 }} className="block my-4" />
        <Text c="#FFF" size="lg">
          {service.desc}
        </Text>

        <Grid className="mt-6">
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Card
              shadow="md"
              radius="md"
              padding="xl"
              style={{ backgroundColor: '#1e222e', minHeight: '400px' }}
            >
              <div className="flex gap-5 mb-5">
                {service.icons.map(icon => {
                  return icon;
                })}
              </div>
              <Title size={'h3'} c="#FFF">
                {service.subheader}
              </Title>
              <Text fz="md" c="dimmed" mt="sm">
                {service.subDesc}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Card
              shadow="md"
              radius="md"
              padding="xl"
              style={{ backgroundColor: '#1e222e', minHeight: '400px' }}
            >
              {service.icons2 && (
                <div className="flex gap-5 mb-5">
                  {service.icons2.map(icon => {
                    return icon;
                  })}
                </div>
              )}
              {service.subheader2 && (
                <Title size={'h3'} c="#FFF">
                  {service.subheader2}
                </Title>
              )}
              {service.subDesc2 && (
                <Text fz="md" c="dimmed" mt="sm">
                  {service.subDesc2}
                </Text>
              )}
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    );
  });
};

const ServicesPage = () => {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;
  return (
    <>
      <div className={classes.wrapper}>
        <HeroWithImage />
      </div>
      {<Services data={serviceData} />}
    </>
  );
};

export default ServicesPage;
