'use client';
import { Feature } from '@/types/feature';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph, moreLink } = feature;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="w-full">
        <div className="wow fadeInUp" data-wow-delay=".15s">
          <div className="mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
            {icon}
          </div>
          <h3 className="mb-5 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
            {title}
          </h3>

          <p className="pr-[10px] text-base font-medium leading-relaxed text-body-color ellipsis-js">
            <span className="text">{paragraph}</span>{' '}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SingleFeature;
