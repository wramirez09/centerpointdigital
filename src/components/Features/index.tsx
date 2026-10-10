'use client';

import { motion } from 'framer-motion';
import SectionTitle from '../Common/SectionTitle';
import SingleFeature from './SingleFeature';
import featuresData from './featuresData';
import { Container } from '@mantine/core';

const Features = () => {
  return (
    <Container size={'xl'}>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <SectionTitle
              width="100%"
              title="Comprehensive Digital Solutions for Businesses"
              paragraph="we specialize in providing full-scale digital solutions designed to help Businesses Grow"
              center
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(feature => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
};

export default Features;
