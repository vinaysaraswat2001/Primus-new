import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginpageimg from "../../assets/loginpageimg.webp";
import slide2 from "../../assets/slide2.webp";
import slide3 from "../../assets/slide3.webp";
import slide4 from "../../assets/slide4.webp";

const slides = [
  {
    image: loginpageimg,
    heading: "Hi Samuel!",
    bio: "Welcome to the Primus Client Portal. Let’s learn a little bit about Primus & this Portal.",
  },
  {
    image: slide2,
    heading: "Check real-time progress on Dashboard",
    bio: "Here you can track your real-time progress on your project and get insights.",
  },
  {
    image: slide3,
    heading: "Connect directly with our PMs & SMEs",
    bio: "You can connect with the MDs, PMs & SMEs for the right guidance or any query.",
  },
  {
    image: slide4,
    heading: "Access to the Primus Community!",
    bio: "This portal is your personalised space for meeting, greeting & socialising all at one place.",
    isFinal: true,
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (current < slides.length - 1) {
      setCurrent((prev) => prev + 1);
    }
  };

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative w-full h-[100%] bg-white overflow-hidden pb-5">
      {/* Slide wrapper with transition */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full px-8 mt-4">
            {/* Image Section with Dots */}
            <div className="relative rounded-lg overflow-hidden h-[12rem] sm:h-[14rem] md:h-[20rem] lg:h-[28rem]">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Dots inside image */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-3 h-3 rounded-full transition ${
                      current === i ? "bg-[#441410]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="mt-6 text-center">
              <h2 className="text-[1.5rem] md:text-[2.5rem] font-semibold text-[#441410] mb-2">
                {slide.heading}
              </h2>
              <p className="text-[1rem] md:text-[1.25rem] text-[#102437] mb-6">
                {slide.bio}
              </p>

              {/* Button aligned to right but text stays centered */}
              <div className="flex justify-center md:justify-end">
                {slide.isFinal ? (
                  <button
                    onClick={handleGetStarted}
                    className="bg-[#441410] text-white px-6 cursor-pointer py-2 text-[0.875rem] md:text-[1rem] rounded-md flex items-center gap-2"
                  >
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-[1rem] w-[1rem]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={nextSlide}
                    className="bg-[#441410] text-white px-6 py-2 cursor-pointer text-[0.875rem] md:text-[1rem] rounded-md flex items-center gap-2"
                  >
                    Next
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-[1rem] w-[1rem]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;