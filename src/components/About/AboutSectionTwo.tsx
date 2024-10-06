"use client";

import Link from "next/link";
import { LightgalleryProvider, LightgalleryItem } from "react-lightgallery";

const GROUP2 = [
  "/images/about/gallery/ss0.png",
  "/images/about/gallery/ss1.png",
  "/images/about/gallery/ss2.png",
  "/images/about/gallery/ss3.png",
];

const PhotoItem = ({ image, thumb, group }) => (
  <LightgalleryItem group={group} src={image} thumb={thumb}>
    <img
      src={image}
      className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
    />
  </LightgalleryItem>
);

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
          Our Latest Project
        </h2>

        <p className="text-primary">1 Stop Maintanence LLC</p>

        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12  text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <LightgalleryProvider>
                <div
                  className="grid grid-cols-2 gap-4"
                  style={{ cursor: "pointer" }}
                >
                  {GROUP2.map((p, idx) => (
                    <PhotoItem key={idx} image={p} group="group2" thumb={p} />
                  ))}
                </div>
              </LightgalleryProvider>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                {/* <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Design, Develop, Market, Grow
                </h3> */}

                <p className="my-3">
                  <strong className="text-primary">
                    Branding & Visual Identity:
                  </strong>{" "}
                  Developed a cohesive brand identity, including logo design,
                  color schemes, and typography, that reflects the client's
                  vision and resonates with their target audience.
                </p>
                <p className="my-3">
                  <strong className="text-primary">
                    Responsive Website Design & Development:{" "}
                  </strong>
                  Created a fully responsive website that delivers seamless user
                  experiences across all devices, ensuring optimal performance
                  and accessibility for both desktop and mobile users.
                </p>
                <p className="my-3">
                  <strong className="text-primary">SEO Optimization:</strong>{" "}
                  Implemented a comprehensive SEO strategy, including keyword
                  optimization, on-page SEO, and performance enhancements, to
                  increase organic traffic and improve search engine rankings.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full flex mt-10 mb-0 items-center justify-center">
            <Link
              href={"projects/one-stop"}
              className="rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
            >
              learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
