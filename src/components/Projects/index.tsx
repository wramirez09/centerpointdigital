import SectionTitle from "../Common/SectionTitle";
import ProjectCard from "./ProjectCard";
import SingleProject from "./SingleProject";

import projectsData from "./projectsData";

const Projects = () => {
  return (
    <section
      id="blog"
      className="py-16 bg-gray-light dark:bg-bg-color-dark md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Our Latest Projects"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {projectsData.map((project, index) => (
            <div key={index} className="w-full">
              {/* <SingleProject blog={blog} /> */}
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
