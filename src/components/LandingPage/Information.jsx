import React from "react";
import Team from "../../assets/Team.png";

const Information = () => {
  return (
    <section className="about-us flex flex-col md:flex-row items-center md:items-start  md:pl-[3rem] py-12 bg-white">
      {/* Left Content */}
      <div className="flex-1 md:pr-12">
        <span className="text-sm text-gray-500 uppercase">About Us</span>
        <h2 className="text-3xl md:text-4xl mt-2 mb-4 text-black">
          <span className="font-bold">Experience in Action,</span><br />
          <span className="font-normal">Strategy in Motion</span>
        </h2>

        <p className="text-gray-700 mb-4">
          PRIMUS Partners is a leading India-headquartered global management consulting firm, delivering innovative and practical solutions across sectors.
        </p>
        <p className="text-gray-700 mb-6">
          Backed by 200+ person-years of collective experience, our teams are trusted by both government and private sector leaders to solve complex challenges, drive transformation, and contribute to nation-building.
        </p>
        <p className="text-gray-700 mb-6">
          Whether you’re a client navigating business growth, a vendor contributing to delivery excellence, an advisor shaping impact, or an alumnus continuing the journey, Primus empowers you with purpose and partnership.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-20 mt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">98%</h3>
            <p className="text-gray-500 text-sm">Successful Engagements</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">200+</h3>
            <p className="text-gray-500 text-sm">Person-years</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">$1B+</h3>
            <p className="text-gray-500 text-sm">Project Value Advised</p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex-1 mt-8 md:mt-[0rem] flex items-center justify-center">
        <img
          src={Team}
          alt="Team"
          className="w-[100%] h-[27rem]"
        />
      </div>

    </section>
  );
};

export default Information;