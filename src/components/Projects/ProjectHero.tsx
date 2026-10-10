import SectionTitle from '../Common/SectionTitle';

const ProjectHero: React.FC = () => {
  return (
    <div className="flex flex-col justify-center w-full gap-5 mb-10 sm:mb-20 xl:px-60">
      <div className="text-3xl text-center text-white sm:text-5xl">
        <SectionTitle
          size="25px"
          width="950px"
          mb="3rem"
          title={'Some of Our Latest Work'}
          paragraph={
            "Witness the brilliance of our previous projects. Our portfolio showcases the successful collaborations we've had with diverse clients across various industries. Let our work speak for itself."
          }
          center
        />
      </div>
    </div>
  );
};

export default ProjectHero;
