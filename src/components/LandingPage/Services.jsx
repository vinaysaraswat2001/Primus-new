import React from "react";
import servicesImage from "../../assets/services.png"; // replace with your image path

const Services = () => {
    return (
        <section className="py-12 px-6 md:px-20">
            <div className="text-center mb-10">
                <p className="text-sm text-gray-500">Services</p>
                <h2 className="text-3xl text-[#102437] md:text-4xl font-bold mt-2 mb-2">
                    Sectors We Serve
                </h2>
                <p className="text-gray-600">
                    Track active engagements and delivery milestones in real-time.
                </p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-start gap-6 md:gap-12">
                {/* Left Side Content */}
                <div className="relative flex-1">
                    {/* Vertical line */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-[#102437]"></div>

                    {/* Content */}
                    <div className="flex-1 space-y-6 text-left pl-4">
                        <div>
                            <h3 className="font-semibold text-lg text-[#102437]">Public Sector & Governance</h3>
                            <p className="text-gray-600">
                                Partnering with ministries and government bodies to enable efficient,
                                citizen-focused policies and digital transformation.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg text-[#102437]">Infrastructure & Urban Development</h3>
                            <p className="text-gray-600">
                                Driving large-scale infrastructure, smart cities, and sustainability
                                initiatives with actionable insights and strategy.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg text-[#102437]">Technology & Digital Innovation</h3>
                            <p className="text-gray-600">
                                Advising on digital transformation, emerging tech integration, and
                                modernization efforts for future-ready enterprises.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg text-[#102437]">Healthcare & Social Impact</h3>
                            <p className="text-gray-600">
                                Consulting across public health systems, life sciences, and social
                                programs to improve access and measurable outcomes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side Image */}
                <div className="flex-1 flex justify-center">
                    <img
                        src={servicesImage}
                        alt="Services"
                        className="w-full h-[22rem] cover mt-[1rem]"
                    />
                </div>
            </div>

        </section>
    );
};

export default Services;