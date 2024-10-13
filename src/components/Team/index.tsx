import SectionTitle from "../Common/SectionTitle";
import SectionTitle2 from "../Common/SectionTitle2";
import SingleTeam from "./SingleTeam";

export type TeamType = {
  id: number;
  name: string;
  designation: string;
  image: string;
  facebookLink: string;
  twitterLink: string;
  instagramLink: string;
};
const teamData: TeamType[] = [
  {
    id: 1,
    name: "William Ramirez",
    designation: "Founder | President | Lead Engineer",
    image: "/images/team/wr.jpeg",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  // {
  //   id: 2,
  //   name: "Jezmin uniya",
  //   designation: "Foreman",
  //   image: "/images/team/team-02.png",
  //   facebookLink: "/#",
  //   twitterLink: "/#",
  //   instagramLink: "/#",
  // },
  // {
  //   id: 3,
  //   name: "Andrieo Gloree",
  //   designation: "Project Manager",
  //   image: "/images/team/team-03.png",
  //   facebookLink: "/#",
  //   twitterLink: "/#",
  //   instagramLink: "/#",
  // },
  // {
  //   id: 4,
  //   name: "Jackie Sanders",
  //   designation: "Client Services",
  //   image: "/images/team/team-04.png",
  //   facebookLink: "/#",
  //   twitterLink: "/#",
  //   instagramLink: "/#",
  // },
];

const Team = () => {
  return (
    <section
      id="team"
      className="overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle2
            subtitle=""
            title="Meet the Founder: Will Ramirez"
            paragraph="Will, the founder of Center Point Digital, is a seasoned Fullstack Software Developer with a passion for building innovative digital products. With over 10 years of experience in front-end, back-end, and cloud-based solutions, Will has helped ad agencies and their clients bring their visions to life through custom web, mobile, and software development. His hands-on approach, dedication to excellence, and deep understanding of both technology and business needs have made Center Point Digital a trusted partner for delivering scalable, high-quality digital solutions."
            width="740px"
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {teamData.map((team, i) => (
            <SingleTeam key={i} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
