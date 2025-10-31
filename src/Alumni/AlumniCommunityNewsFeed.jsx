import React, { useMemo, useState } from "react";

// Utility: time ago formatter
const formatTimeAgo = (dateOrString) => {
  const date = new Date(dateOrString);
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const mon = Math.floor(day / 30);
  const yr = Math.floor(day / 365);

  if (sec < 60) return "just now";
  if (min < 60) return `${min} min${min > 1 ? "s" : ""} ago`;
  if (hr < 24) return `${hr} hour${hr > 1 ? "s" : ""} ago`;
  if (day < 30) return `${day} day${day > 1 ? "s" : ""} ago`;
  if (mon < 12) return `${mon} month${mon > 1 ? "s" : ""} ago`;
  return `${yr} year${yr > 1 ? "s" : ""} ago`;
};

const NewsItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const previewChars = 120;
  const needsTrim = (item.summary || "").length > previewChars;

  const text = useMemo(() => {
    if (expanded || !needsTrim) return item.summary;
    return `${item.summary.slice(0, previewChars)}...`;
  }, [expanded, needsTrim, item.summary]);

  return (
    <div className="flex gap-4 p-3 rounded-xl hover:bg-amber-50 transition-colors">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-28 h-24 md:w-36 md:h-28 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] md:text-base font-semibold text-gray-900 leading-snug mb-1">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm">
          {text}
          {needsTrim && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-amber-600 font-medium ml-1"
            >
              Read more
            </button>
          )}
        </p>
        <div className="mt-2 flex items-center text-xs text-gray-500">
          {item.clientAvatar ? (
            <img
              src={item.clientAvatar}
              alt={`${item.clientName} avatar`}
              className="w-6 h-6 rounded-full object-cover mr-2"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center mr-2 text-[11px] font-semibold">
              {item.clientName?.[0]?.toUpperCase() || "C"}
            </div>
          )}
          <span className="truncate">Client – {item.clientName || "—"}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span>{formatTimeAgo(item.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
};

const SkeletonItem = () => (
  <div className="flex gap-4 p-3">
    <div className="w-28 h-24 md:w-36 md:h-28 bg-gray-200 rounded-xl animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
    </div>
  </div>
);

const AlumniCommunityNewsFeed = () => {
  const [loading] = useState(false);

  const fakeNews = [
    {
      id: "1",
      title: "Primus Partners featured in Top Financial News",
      summary:
        "Our latest advisory report on emerging market trends was covered in major publications. This highlights our continuous commitment to excellence in financial consulting and insights.",
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop",
      clientName: "Financial Times",
      clientAvatar: "",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "2",
      title: "Healthcare Innovations Whitepaper Released",
      summary:
        "Primus Partners released a whitepaper outlining key innovations in healthcare technology. The paper focuses on improving patient outcomes and operational efficiency in hospitals.",
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop",
      clientName: "HealthTech Journal",
      clientAvatar: "",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: "3",
      title: "New Research Paper on Aerospace Industry Trends",
      summary:
        "Our research paper delves into the latest trends in aerospace technology and defense strategies. Key insights include the shift towards sustainable fuels and AI integration.",
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop",
      clientName: "AeroInsights",
      clientAvatar: "",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: "4",
      title: "Primus Partners Recognized for Sustainability Initiatives",
      summary:
        "Our initiatives in sustainable finance and environmental projects have been recognized by industry leaders. The recognition emphasizes our commitment to responsible investment practices.",
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop",
      clientName: "GreenFinance Weekly",
      clientAvatar: "",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
  ];

  const maxItems = 10;

  const visibleItems = useMemo(
    () => (typeof maxItems === "number" ? fakeNews.slice(0, maxItems) : fakeNews),
    [fakeNews, maxItems]
  );

  return (
    <section className="w-[41.5rem] -mt-[22.5rem] -ml-[0.4rem] rounded-3xl p-4 md:p-6 bg-white/80 backdrop-blur ring-1 ring-black/5 h-[457px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">
          Community News Feed
        </h2>
        <a
          href="#"
          className="text-amber-700 hover:text-amber-800 text-sm font-medium"
        >
          View All
        </a>
      </div>
      <div className="divide-y divide-gray-100">
        {loading ? (
          <>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </>
        ) : visibleItems.length ? (
          visibleItems.map((item) => <NewsItem key={item.id} item={item} />)
        ) : (
          <div className="text-sm text-gray-500 p-4">No news to display.</div>
        )}
      </div>
    </section>
  );
};
export default AlumniCommunityNewsFeed;