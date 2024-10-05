"use client";
import { group } from "console";
import Image from "next/image";
import {
  LightgalleryProvider,
  LightgalleryItem,
  withLightgallery,
  useLightgallery,
} from "react-lightgallery";

const GROUP2 = [
  "https://images.unsplash.com/photo-1594818898109-44704fb548f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  "https://images.unsplash.com/photo-1594818896795-35ad7bcf3c6a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  "https://images.unsplash.com/photo-1594818896744-57eca4d47b07?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
  "https://images.unsplash.com/photo-1594818897077-aec41f55241f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80",
];

const PhotoItem = ({ image, thumb, group }) => (
  <div style={{ maxWidth: "250px", width: "200px", padding: "5px" }}>
    <LightgalleryItem group={group} src={image} thumb={thumb}>
      <Image
        src="/images/about/project-group.png"
        alt="about image"
        fill
        className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
      />
    </LightgalleryItem>
  </div>
);

const OpenButtonWithHook = (props) => {
  const { openGallery } = useLightgallery();
  return (
    <>
      <Image
        src="/images/about/project-group.png"
        alt="about image"
        fill
        className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
        onClick={() => openGallery("group2")}
      />
    </>
  );
};

const AboutSectionTwo = () => {
  return (
    <>
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
            Latest Project{" "}
            <p className="text-primary">1 Stop Maintanence LLC</p>
          </h2>
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div
                className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
                data-wow-delay=".15s"
              >
                <LightgalleryProvider>
                  {/* <OpenButtonWithHook /> */}
                  {/* <Image
                    src="/images/about/project-group.png"
                    alt="about image"
                    fill
                    className="drop-shadow-three dark:hidden dark:drop-shadow-none"
                    onClick={() => openGallery("group2")}
                  />
                  <Image
                    src="/images/about/project-group.png"
                    alt="about image"
                    fill
                    className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
                    onClick={() => openGallery("group2")}
                  /> */}

                  <PhotoItem
                    image={"/images/about/project-group.png"}
                    group="group2"
                    thumb={""}
                  />
                </LightgalleryProvider>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="max-w-[470px]">
                <div className="mb-9">
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Design, Develop, Market, Grow
                  </h3>

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
                      Responsive Website Design & Development:
                    </strong>
                    Created a fully responsive website that delivers seamless
                    user experiences across all devices, ensuring optimal
                    performance and accessibility for both desktop and mobile
                    users.
                  </p>
                  <p className="my-3">
                    <strong className="text-primary">SEO Optimization:</strong>{" "}
                    Implemented a comprehensive SEO strategy, including keyword
                    optimization, on-page SEO, and performance enhancements, to
                    increase organic traffic and improve search engine rankings.
                  </p>
                </div>
                {/* <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Bridging Innovation, Design, and Growth
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Center Point Digital offers a complete suite of services—from
                  custom software solutions to engaging UI/UX design and digital
                  marketing strategies. We’re here to help you not only meet
                  your business objectives but exceed them, delivering results
                  that make an impact.
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Innovative Solutions for the Modern Business
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Whether it's developing robust software, designing
                  user-focused interfaces, or driving targeted marketing
                  campaigns, our team is dedicated to delivering solutions that
                  boost efficiency, engage customers, and grow your brand. Let's
                  build something extraordinary together.
                </p>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSectionTwo;
