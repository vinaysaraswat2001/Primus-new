import Team from "../../assets/Team.png";
import Primuslogo from "../../assets/primuslogo.png";

const Research = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="-mt-[10rem] md:h-[38rem] bg-gradient-to-r h-auto from-[#142434] to-[#142434] px-4 sm:px-8 text-white">
                <div className="pt-[10rem] max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Left Content */}
                    <div className="md:w-1/2 w-full text-center md:text-left px-2 md:px-0">
                        <h1 className="text-[32px] sm:text-[40px] md:text-[47px] leading-snug md:leading-[3.7rem] font-semibold mb-4 md:w-[40.9rem]">
                            Our Expertise on Research backs us with winning results! Primus Focuses on Research & Publications.
                        </h1>
                        <p className="mb-2 text-[15px] md:text-[16px] leading-relaxed font-medium md:w-[31rem] mx-auto md:mx-0">
                            Beyond consulting, we are a force united, shaping tomorrow's world with solutions that resonate for generations.
                        </p>
                        <button className="bg-[#AD8051] text-white px-6 py-2 rounded mt-4 md:mt-2">
                            Visit Our Website
                        </button>
                    </div>

                    {/* Right Image */}
                    <div className="md:w-1/2 w-full flex justify-center">
                        <img
                            src={Team}
                            alt="Team"
                            loading="lazy"
                            className="w-full max-w-xs sm:max-w-md md:max-w-full mt-8 md:mt-[2.7rem]"
                        />
                    </div>
                </div>
            </section>

            {/* Primus Partner Section */}
            <section className="py-16 bg-white px-4 sm:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-black">
                    Primus Partners <br />
                    <span className="text-sm font-normal">The shapers of tomorrow.</span>
                </h2>

                <p className="text-base sm:text-lg font-medium italic text-center text-[#AD8051] mx-auto max-w-4xl">
                    “We partner with organizations to navigate complex challenges, driving transformative change. Our commitment to innovation and excellence empowers us to drive meaningful change that enhances success and benefits communities.”
                </p>
                <br />
                <p className="text-base sm:text-lg text-[#AD8051] font-medium italic text-right px-4 sm:px-6 mx-auto max-w-3xl">
                    ~ Primus Leadership Architects
                </p>
            </section>

            {/* Who We Are Section */}
            <section className="py-16 px-4 bg-gray-800">
                <p className="text-base sm:text-lg text-center max-w-7xl mx-auto leading-relaxed">
                    Since its inception, Primus Partners has given a strong impetus to research as a practice, believing in the critical role
                    <br className="hidden sm:block" />
                    data and research-driven consulting have in shaping the industry’s future. We strongly believe in leveraging our vast
                    <br className="hidden sm:block" />
                    experience of over 300+ consultants, to shape a future with visionary insights and adaptive solutions. As part of this
                    <br className="hidden sm:block" />
                    approach, we strive to create knowledge products that offer detailed industry insights, recognizing that in this new
                    <br className="hidden sm:block" />
                    landscape, success depends on the ability to effectively translate data into insights and insights into actionable
                    <br className="hidden sm:block" />
                    strategies that drive tangible business outcomes.
                </p>
                <br />
                <p className="text-base sm:text-lg text-center max-w-7xl mx-auto leading-relaxed">
                    When we started with our research practice, the idea was multi-fold. While we strongly believe that research-backed
                    <br className="hidden sm:block" />
                    consulting models are the answer to this forever-changing dynamic world, our vision was to create a team that is
                    <br className="hidden sm:block" />
                    visionary and has subject expertise. So, at Primus Partners, it comes as a part of the job. In FY 2023-24, we spent close to
                    <br className="hidden sm:block" />
                    8.5% of our revenue on research. We try to inculcate a strong writing practice within the organisation, to inspire our
                    <br className="hidden sm:block" />
                    teams to be positioned to create value for the client. With an average of 0.65 publications per employee, we collectively
                    <br className="hidden sm:block" />
                    published 110+ publications spread over newsletters, reports, thought leadership and op-eds. In addition, 280+ published
                    <br className="hidden sm:block" />
                    articles had insights from our senior leadership team.
                </p>
            </section>

            {/* What We Do Section */}
            <section className="py-16 px-4 bg-white">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-black">
                    What We Do?
                </h2>

                <p className="text-base sm:text-lg text-center text-[#AD8051] font-medium italic mx-auto max-w-4xl">
                    From the C-suite to the front line, we partner with clients to help them innovate more sustainably, achieve lasting gains in performance, and build workforces that will thrive for this generation and the next.
                </p>

                {/* Learn More Button */}
                <div className="flex flex-col sm:flex-row justify-center items-center mt-10 sm:mt-12 gap-4">
                    <button className="bg-[#441410] text-white px-6 py-3 rounded-md font-bold">
                        Learn more about Primus
                    </button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#441410"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center mt-12 space-x-6">
                    {/* Facebook */}
                    <a href="#" className="text-black hover:text-[#AD8051]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                    </a>

                    {/* Twitter (X) */}
                    <a href="#" className="text-black hover:text-[#AD8051]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.85 12.65L21.8 4H20.16L14.05 11.3L9.03 4H2L9.32 14.31L2 22H3.64L10.09 14.98L15.36 22H22L14.85 12.65ZM11.01 13.94L10.2 12.75L4.07 5.5H7.99L12.41 11.61L13.22 12.8L19.99 20.5H16.08L11.01 13.94Z" />
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a href="#" className="text-black hover:text-[#AD8051]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                        </svg>
                    </a>

                    {/* YouTube */}
                    <a href="#" className="text-black hover:text-[#AD8051]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                        </svg>
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#441410] text-center py-6">
                <img
                    src={Primuslogo}
                    alt="Primuspartner logo"
                    className="inline-block h-24 w-auto mx-auto"
                    style={{ maxWidth: '100%' }}
                />
            </footer>
        </div>
    );
};

export default Research;