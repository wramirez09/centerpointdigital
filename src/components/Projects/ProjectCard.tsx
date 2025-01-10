'use client';

import { Project } from '@/types/project';
import { IconBrandFigma, IconBrandHtml5, IconLink } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';



const ProjectCard = ({project}: {project: Project}) => {
  const [isShow, setIsShow] = React.useState<boolean>(false);

  const showContent = () => {
    setIsShow(!isShow);
  }
  return (
    <div className="flex flex-col items-center gap-5 sm:gap-12 p-3 sm:p-12 border border-[#2b2b2b] rounded-3xl">
      <div className="relative w-full">
        <img
          className="w-full rounded-[20px]"
          src={project.image}
          alt=""
        />
        <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-transparent to-[#0f0f0f] rounded-[20px]"></div>
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <Link href={project.link}>
          <div className="flex font-semibold text-white capitalize ftext-lg sm:text-3xl">
            {project.title}
            <div className=''>
              <IconLink className='h-4 sm:h-6'/>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden text-lg text-gray-600 sm:block">Show<span> {isShow ? 'Less' : 'More'}</span></div>
          <div className="p-[1px] rounded-full bg-gradient-to-t from-transparent to-[#29334a] cursor-pointer" onClick={showContent}>
            <div className="flex items-center justify-center p-1 sm:p-5 rounded-full bg-gradient-to-t to-[#141a29] from-transparent">
              <img className={`${isShow ? '' : 'rotate-180'}`} src="/images/icon/arrow-up.svg" alt="arrow" />
            </div>
          </div>
        </div>
      </div>
      {isShow && (
        <>
          <div className="flex flex-col items-start w-full gap-3 md:items-center md:flex-row md:flex-wrap">
            {project.tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 rounded-[100px] border border-[#2b2b2b] py-4 px-[18px]">
                <img src="/images/icon/chart.svg" alt="chart_icon" />
                <div className="text-sm sm:text-lg text-[#A6A6A6]">{tag}</div>
              </div>
            ))}
          </div>
          {/* Project Description */}
          <div className="flex flex-col items-center w-full gap-12 p-5 sm:p-12 border border-[#2b2b2b] rounded-3xl">
            <div className="flex flex-col w-full gap-3">
              <div className="flex justify-center text-xl font-medium text-white lg:justify-start">
                Project Description
              </div>
              <div className="flex justify-center sm:justify-start text-sm sm:text-lg text-[#A6A6A6]">
                {project.description}
              </div>
            </div>
            <div className="flex flex-col items-center w-full gap-7">
              {/* Category and period */}
              {/* <div className="flex flex-wrap items-center py-7 border border-[#2b2b2b] rounded-xl w-full">
                <div className="flex flex-col w-1/2 sm:w-1/4 gap-1 border-r border-[#2b2b2b] pl-5 lg:pl-12 mb-5 sm:mb-0">
                  <div className="text-[#A6A6A6] text-xs md:text-base lg:text-lg">
                    Category
                  </div>
                  <div className="text-xs text-white md:text-base lg:text-lg">
                    E-commerce
                  </div>
                </div>
                <div className="flex flex-col w-1/2 sm:w-1/4 gap-1 border-r border-[#2b2b2b] pl-5 lg:pl-12 mb-5 sm:mb-0">
                  <div className="text-[#A6A6A6] text-xs md:text-base lg:text-lg">
                    Time Taken
                  </div>
                  <div className="text-xs text-white md:text-base lg:text-lg">
                    4 Months
                  </div>
                </div>
                <div className="flex flex-col w-1/2 sm:w-1/4 gap-1 border-r border-[#2b2b2b] pl-5 lg:pl-12">
                  <div className="text-[#A6A6A6] text-xs md:text-base lg:text-lg">
                    Start Date
                  </div>
                  <div className="text-xs text-white md:text-base lg:text-lg">
                    January 15, 2023
                  </div>
                </div>
                <div className="flex flex-col w-1/2 sm:w-1/4 gap-1 border-r border-[#2b2b2b] pl-5 lg:pl-12">
                  <div className="text-[#A6A6A6] text-xs md:text-base lg:text-lg">
                    Completed Date
                  </div>
                  <div className="text-xs text-white md:text-base lg:text-lg">
                    May 15, 2023
                  </div>
                </div>
              </div> */}
              {/* Technology Used */}
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-12 px-5 sm:px-12 py-3 sm:py-8 border border-[#2b2b2b] rounded-xl w-full">
                <div className="text-lg text-white">Technologies Used</div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-12">
                  {project.stacks.map((stack, index) => (
                    <div key={index} className="p-[1px] rounded-full bg-gradient-to-t from-transparent to-[#29334a] cursor-pointer">
                      <div className="flex items-center justify-center p-1 sm:p-3 rounded-full bg-gradient-to-t to-[#141a29] from-transparent">
                        {stack}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Methods Used */}
              <div className="w-full flex flex-col p-5 sm:p-12 gap-3 sm:gap-7 border border-[#2b2b2b] rounded-xl">
                <div className="text-lg text-white">Methods Used</div>
                <div className="flex flex-wrap lg:justify-between gap-1 sm:gap-0 md:gap-5 border-0 sm:border border-[#2b2b2b] rounded-xl sm:py-7 sm:px-12">
                  {project.methods.map((method, index) => (
                    <div key={index} className="py-2 sm:py-4 px-2 sm:px-8 border border-[#2b2b2b] rounded-3xl text-white text-xs sm:text-base">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectCard;
