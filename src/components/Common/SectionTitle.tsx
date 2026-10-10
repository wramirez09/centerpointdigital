const SectionTitle: React.FC<{
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
  size?: string;
}> = ({ title, paragraph, width = '570px', center, size = '3rem' }) => {
  return (
    <>
      <div
        className={`w-full ${center ? 'mx-auto text-center' : ''} lg:mb-[100px] mb-12 xs:mb-9`}
        style={{ maxWidth: width }}
      >
        <h2
          className={`mb-4 font-bold !leading-tight text-black dark:text-white text-[1.5rem] sm:text-[2.5rem]`}
        >
          {title}
        </h2>

        <p className="text-base !leading-relaxed text-body-color text-md">
          {paragraph}
        </p>
      </div>
    </>
  );
};

export default SectionTitle;
