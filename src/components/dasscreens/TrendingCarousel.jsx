import React from "react";

import trending1 from "../../assets/trending1.webp";
import trending2 from "../../assets/trending2.webp";

const TrendingCarousel = () => {
  const newsItems = [
    {
      id: 1,
      img: trending1,
      label: "Article",
      title: "Primus expands advisory network...",
      description:
        "This whitepaper explores how AI strategies...",
      buttonText: "Read more",
    },
    {
      id: 2,
      img: trending2,
      label: "Article",
      title: "Primus expands advisory network...",
      description:
        "This whitepaper explores how AI is strategies...",
      buttonText: "Read more",
    },
  ];

  const handleReadMore = (id) => {
    console.log(`Read more clicked for item ${id}`);
    // Navigate or open modal as needed
  };

  return (
    <div className="py-8 w-[24rem] bg-white px-[1rem] rounded-xl ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">News & Updates</h2>
        <a
          href="#"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All
        </a>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
        {newsItems.map(({ id, img, label, title, description, buttonText }) => (
          <div
            key={id}
            className="bg-white h-[8.9rem] rounded-lg overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Side: Image */}
            <div className="w-full md:w-1/2 h-48 md:h-auto bg-gray-200 flex items-center justify-center">
              <img
                src={img}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) =>
                  console.log(`Image load failed for item ${id}:`, e)
                }
              />
            </div>

            {/* Right Side: Content */}
            <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2">
                  {label}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                  {title}
                </h3>
                <p className="text-xs text-gray-600 mb-4 line-clamp-3">
                  {description}
                </p>
              </div>
              <button
                onClick={() => handleReadMore(id)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium underline self-start"
              >
                {buttonText}
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCarousel;