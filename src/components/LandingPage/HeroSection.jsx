import { useState, useEffect, useRef } from "react";
import herobg from "../../assets/herobg.png";
import { FaStar } from "react-icons/fa";
import { FaCalendarAlt, FaUsersCog, FaSyncAlt, FaComments } from "react-icons/fa";

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);

    // Replace these with your actual company logos
    const companyLogos = [
        { src: "https://cdn.logo.com/hotlink-ok/logo-social.png", alt: "Company 1" },
        { src: "https://cdn.logo.com/hotlink-ok/logo-social.png", alt: "Company 2" },
        { src: "https://cdn.logo.com/hotlink-ok/logo-social.png", alt: "Company 3" },
        { src: "https://cdn.logo.com/hotlink-ok/logo-social.png", alt: "Company 4" },
        { src: "https://cdn.logo.com/hotlink-ok/logo-social.png", alt: "Company 5" },
        { src: "https://cdn.logo.com/hotlink-ok/logo-social.png", alt: "Company 6" },
    ];

    // Duplicate logos for seamless infinite loop
    const duplicatedLogos = [...companyLogos, ...companyLogos];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => {
                if (prev >= companyLogos.length - 1) {
                    // Reset to 0 without animation for seamless loop
                    setTimeout(() => {
                        setCurrentSlide(0);
                    }, 50);
                    return 0;
                }
                return prev + 1;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [companyLogos.length]);

    return (
        <section
            style={{
                backgroundImage: `url(${herobg})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
            }}
            className="w-full min-h-screen flex flex-col justify-between text-gray-900"
        >
            {/* ---- HERO MAIN CONTENT ---- */}
            <div className="w-full px-6 lg:px-8 py-20 flex flex-col items-center text-center space-y-8 mt-[3rem]">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
                    Your Trusted <span className="text-[#1d4ed8]">Partner</span> in
                    <br /> Nation-Building &amp; Strategic Growth
                </h1>

                <p className="text-gray-700 text-base sm:text-lg max-w-3xl">
                    PRIMUS is a global management consulting firm helping clients, partners,
                    and advisors drive transformative impact across public and private sectors.
                </p>

                {/* Rating row */}
                <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                        <img
                            src="https://i.pravatar.cc/40?img=1"
                            alt="leader1"
                            className="w-8 h-8 rounded-full border-2 border-white"
                        />
                        <img
                            src="https://i.pravatar.cc/40?img=2"
                            alt="leader2"
                            className="w-8 h-8 rounded-full border-2 border-white"
                        />
                        <img
                            src="https://i.pravatar.cc/40?img=3"
                            alt="leader3"
                            className="w-8 h-8 rounded-full border-2 border-white"
                        />
                        <FaStar className="text-yellow-500 ml-4" />
                    </div>
                    <span className="flex items-center text-sm text-gray-800">
                        4.9 / 5 Rated by Leaders Across 100+ Companies
                    </span>
                </div>

                {/* Feature buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-5">
                    <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition">
                        <FaCalendarAlt className="text-[#1d4ed8]" />
                        <span>Meeting Scheduler</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition">
                        <FaUsersCog className="text-[#1d4ed8]" />
                        <span>Verified Project Teams</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition">
                        <FaSyncAlt className="text-[#1d4ed8]" />
                        <span>D365 Integration</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition">
                        <FaComments className="text-[#1d4ed8]" />
                        <span>Escalation & Feedback</span>
                    </button>
                </div>

                {/* Trusted by note */}
                <p className="text-gray-700 text-sm sm:text-base mt-8">
                    Trusted by <span className="font-semibold">1,000+ businesses</span> for innovative design and growth.
                </p>
            </div>

            {/* logo animation component */}
            <div className="relative -mt-[4rem]">
                <div className="mx-auto relative ">
                    <div className="relative w-full overflow-hidden">
                        <div
                            ref={sliderRef}
                            className="flex transition-transform duration-1000 ease-in-out"
                            style={{
                                transform: `translateX(-${currentSlide * (100 / companyLogos.length)}%)`,
                                width: `${duplicatedLogos.length * (100 / companyLogos.length)}%`
                            }}
                        >
                            {duplicatedLogos.map((logo, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 p-4 flex justify-center items-center"
                                    style={{ width: `${100 / duplicatedLogos.length}%` }}
                                >
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        className="h-10 sm:h-14 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Slider indicators */}
                    {/* <div className="flex justify-center mt-6 space-x-2">
            {companyLogos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-[#1d4ed8] w-6' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;