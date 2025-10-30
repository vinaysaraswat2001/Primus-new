import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaDownload, FaUser, FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import bgImageds from "./bgImageds.jpg";

// API endpoint (FastAPI from previous step)
// const API = " http://127.0.0.1:8000/primus/in-news/json";
const API = `${import.meta.env.VITE_BACKEND_URL}/primus/in-news`;
console.log(API, "this is api")

// Badge colors (added In News)
const badgeColors = {
  "In News": "bg-blue-600",
  Whitepaper: "bg-green-600",
  Guidelines: "bg-purple-600",
  "Research Paper": "bg-orange-600",
  Article: "bg-blue-600",
  "Success Story": "bg-red-600",
  Announcement: "bg-teal-600",
};

// Helpers
const clean = (s) => (s || "").trim();

const toRelativeTime = (isoOrText) => {
  if (!isoOrText) return "";
  try {
    const dt = new Date(isoOrText);
    if (isNaN(dt.getTime())) return isoOrText;
    const diff = (Date.now() - dt.getTime()) / 1000;
    if (diff < 60) return "just now";
    const mins = diff / 60;
    if (mins < 60) return `${Math.floor(mins)} min ago`;
    const hrs = mins / 60;
    if (hrs < 24) return `${Math.floor(hrs)} hrs ago`;
    const days = hrs / 24;
    if (days < 30) return `${Math.floor(days)} days ago`;
    const months = days / 30;
    if (months < 12) return `${Math.floor(months)} months ago`;
    const years = months / 12;
    return `${Math.floor(years)} years ago`;
  } catch {
    return isoOrText;
  }
};

const mapItemsToPublications = (items) => {
  return (items || []).map((it, idx) => {
    const title = clean(it.title);
    const description = clean(it.excerpt) || title;
    const publisher = clean(it.source) || "Primus Partners";
    const vendor = clean(it.source) || "Primus Partners";
    const time = toRelativeTime(it.published_at || it.date_text || "");
    const image =
      it.img ||
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=800&fit=crop";
    const sector = clean(it.sector) || "General";

    return {
      id: it.id || it.link || `${idx}`,
      type: "In News",
      title,
      description,
      publisher,
      vendor,
      time,
      image,
      link: it.link || "#",
      featured: idx === 0, // first item as featured
      sector,
    };
  });
};

const VendorPublications = () => {
  const [publications, setPublications] = useState([]); // from API
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.user);
  const [industryFilter, setIndustryFilter] = useState(""); // ✅ add this


  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching from:", API);

      const res = await fetch(API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.authToken}`, // include token
        },
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const json = await res.json();
      console.log(json, "Fetched JSON");

      const pubs = mapItemsToPublications(json.items);
      setPublications(pubs);
      setUpdatedAt(json.updated_at || new Date().toISOString());

      console.log(pubs, "Publications mapped");
    } catch (e) {
      console.error("Error fetching publications:", e);
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(false);
    const id = setInterval(() => load(false), 30 * 60 * 1000); // 30 min
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return publications.filter((p) => {
      // Filter by search query
      const matchesQuery =
        [p.title, p.description, p.publisher, p.vendor, p.type]
          .join(" ")
          .toLowerCase()
          .includes(s);

      // Filter by sector if selected
      const matchesIndustry = industryFilter
        ? p.sector === industryFilter
        : true;

      return matchesQuery && matchesIndustry;
    });
  }, [publications, q, industryFilter]);


  // Download as PDF
  const handleDownloadPDF = (pub) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(pub.title, 10, 20);
    doc.setFontSize(12);
    const text = `${pub.description}\n\nPublisher: ${pub.publisher}\nType: ${pub.type}\nTime: ${pub.time}\nLink: ${pub.link || "-"}`;
    doc.text(doc.splitTextToSize(text, 180), 10, 40);
    doc.save(`${pub.title}.pdf`);
  };

  return (
    <>
      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat -mt-[5rem]"
        style={{ backgroundImage: `url(${bgImageds})` }}
      >
        <div className="p-6 ">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-[5rem] gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Publications</h1>
            <div className="flex justify-end gap-5 items-center">

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-4xl bg-white text-black placeholder-black focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                </div>
              </div>
              {/* Dropdown filter */}
              <div className="relative w-full sm:w-72">
  <select
    value={industryFilter}
    onChange={(e) => setIndustryFilter(e.target.value)}
    className="w-full h-10 pl-3 pr-4 py-1 rounded-4xl bg-white border text-sm focus:outline-none overflow-y-auto"
    size={1} // keep normal select size
  >
    <option value="">All Industries</option>
    {[
      "Aerospace",
      "Defence",
      "Agriculture",
      "Automotive",
      "Chemicals",
      "Tourism",
      "Economy",
      "Education",
      "Healthcare",
      "Infrastructure",
      "Logistics",
      "Manufacturing",
      "Real Estate",
      "Technology",
      "Transportation",
    ].map((industry) => (
      <option
        key={industry}
        value={industry}
        className="h-8 px-2 text-sm" // smaller option height
      >
        {industry}
      </option>
    ))}
  </select>
</div>

            </div>

          </div>

          <div className="p-6 bg-white mt-[1rem] rounded-3xl min-h-[59vh] ">

            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500 text-lg font-medium animate-pulse">Loading...</p>
              </div>
            ) :
              error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  Error: {error}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-lg font-medium">No results found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Featured Large Card */}
                  {filtered
                    .filter((p) => p.featured)
                    .map((pub) => (
                      <div
                        key={pub.id}
                        className="lg:col-span-2 relative rounded-xl overflow-hidden shadow hover:shadow-lg transition h-94 cursor-pointer"
                        onClick={() => setSelectedPublication(pub)}
                      >
                        <img
                          src={pub.image}
                          alt={pub.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/60 to-transparent">
                          <span
                            className={`absolute top-4 left-4 ${badgeColors[pub.type] || "bg-blue-600"} text-white px-3 py-1 text-xs font-semibold rounded-full`}
                          >
                            {pub.type}
                          </span>

                          <h2 className="text-xl font-semibold text-white">{pub.title}</h2>
                          <p className="text-white text-sm mt-1">{pub.description}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-200">
                            <FaUser className="mr-2" />
                            {pub.publisher} • {pub.time}
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Smaller Cards */}
                  {filtered
                    .filter((p) => !p.featured)
                    .map((pub) => (
                      <div
                        key={pub.id}
                        className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                        onClick={() => setSelectedPublication(pub)}
                      >
                        <div className="relative">
                          <img
                            src={pub.image}
                            alt={pub.title}
                            className="w-full h-40 object-cover"
                          />
                          <span
                            className={`absolute top-3 left-3 ${badgeColors[pub.type] || "bg-blue-600"} text-white px-2 py-1 text-xs font-semibold rounded-full`}
                          >
                            {pub.type}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 text-sm">{pub.title}</h3>
                          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                            {pub.description}
                          </p>
                          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                            <span>
                              {pub.vendor} • {pub.time}
                            </span>
                            <FaDownload
                              className="cursor-pointer hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadPDF(pub);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>

        {/* Popup Modal */}
        {selectedPublication && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-100 backdrop-blur-sm z-30">
            <div className="bg-white py-6 rounded-xl w-full max-w-3xl h-[90vh] shadow-lg relative p-3 mx-4 overflow-y-auto hide-scrollbar">
              <button
                className="absolute top-3 left-3 text-gray-600 hover:text-black cursor-pointer"
                onClick={() => setSelectedPublication(null)}
              >
                <FaTimes size={20} />
              </button>
              <div className=" my-3">
                <img
                  src={selectedPublication.image}
                  alt={selectedPublication.title}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />

                <span
                  className={`inline-block ${badgeColors[selectedPublication.type] || "bg-blue-600"
                    } text-white px-3 py-1 text-xs font-semibold rounded-full mb-3`}
                >
                  {selectedPublication.type}
                </span>

                <h2 className="text-xl font-bold text-gray-900">{selectedPublication.title}</h2>
                <p className="text-gray-600 mt-2">{selectedPublication.description}</p>
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <FaUser className="mr-2" />
                  {selectedPublication.publisher} • {selectedPublication.time}
                </p>

                {selectedPublication.link && (
                  <div className="mt-4">
                    <a
                      href={selectedPublication.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-sm"
                    >
                      View Source
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </section>
    </>
  );
};

export default VendorPublications;
