const SectionTitle = ({
  title,
  paragraph,
  width = '570px',
  center,
  mb = '100px',
  size = '45px',
}: {
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
  size?: string;
}) => {
  return (
    <>
      <div
        className={`w-full ${center ? 'mx-auto text-center' : ''}`}
        style={{ maxWidth: width, marginBottom: mb }}
      >
        <h2
          className={`mb-4 text-${size} font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[${size}]`}
        >
          {title}
        </h2>
        <p className="text-base !leading-relaxed text-body-color md:text-lg">
          {paragraph}
        </p>
      </div>
    </>
  );
};

export default SectionTitle;
