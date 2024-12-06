const ProjectCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-12 p-12">
      <div className="relative w-full">
        <img className="w-full rounded-[20px]" src="/images/blog/blog-01.jpg" alt="" />
        <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-transparent to-[#0f0f0f] rounded-[20px]"></div>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="text-3xl font-semibold text-white capitalize">
          E-commerce Revolution
        </div>
        <div className="flex items-center gap-3">
          <div className="text-lg text-gray-600">Show Less</div>
          <div className="p-[1px] rounded-full bg-gradient-to-t from-transparent to-[#29334a] cursor-pointer">
            <div className="flex items-center justify-center p-5 rounded-full bg-gradient-to-t to-[#141a29] from-transparent">
              <img src="/images/icon/arrow-up.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
