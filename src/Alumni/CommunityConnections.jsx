import React, { useState } from "react";
import {
  FaSearch,
  FaThumbsUp,
  FaCommentDots,
  FaPaperPlane,
  FaTimes,
  FaUpload,
  FaImage,
  FaVideo,
  FaLink,
  FaUsers,
  FaPlus,
} from "react-icons/fa";
import bgImageds from "./bgImageds.jpg";

export default function Community() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const [newPost, setNewPost] = useState({
    content: "",
    file: null,
    image: null,
    video: null,
    link: "",
  });

  const [groups, setGroups] = useState([
    { id: 1, name: "Frontend Developers", desc: "React, Vue, Angular discussions", joined: false },
    { id: 2, name: "AI Enthusiasts", desc: "Talk about AI, ML & Data Science", joined: false },
    { id: 3, name: "Cloud Architects", desc: "Everything about AWS, Azure & GCP", joined: false },
  ]);

  const [newGroup, setNewGroup] = useState({ name: "", desc: "" });

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Prashant Gautam",
      role: ".NET Full Stack Developer | ASP.NET Core, C#, Web API, EF Core",
      time: "21h",
      content: "The Primus pack is expanding — come work with us! 🚀",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      likes: 9,
      comments: 7,
    },
    {
      id: 2,
      author: "Prashant Gautam",
      role: ".NET Full Stack Developer | ASP.NET Core, C#, Web API, EF Core",
      time: "2d",
      content: "Excited to share our latest development updates and roadmap!",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
      likes: 14,
      comments: 11,
    },
  ]);

  const suggestions = [
    {
      name: "Rafik",
      role: "UI/UX Designer",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Vinay",
      role: "Data Analyst",
      img: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Shivani",
      role: "DevOps Engineer",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Harshita",
      role: "QA Tester",
      img: "https://randomuser.me/api/portraits/women/40.jpg",
    },
  ];

  // ✅ Create Post
  const handlePostNow = () => {
    if (!newPost.content.trim()) return alert("Please enter some text!");

    const newEntry = {
      id: Date.now(),
      author: "Prashant Gautam",
      role: ".NET Full Stack Developer | ASP.NET Core, C#, Web API, EF Core",
      time: "Just now",
      content: newPost.content,
      image: newPost.image ? URL.createObjectURL(newPost.image) : null,
      video: newPost.video ? URL.createObjectURL(newPost.video) : null,
      link: newPost.link,
      likes: 0,
      comments: 0,
    };

    setPosts((prev) => [newEntry, ...prev]);
    setNewPost({ content: "", file: null, image: null, video: null, link: "" });
    setShowPostModal(false);
  };

  // ✅ Join/Leave Group
  const toggleJoin = (id) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, joined: !g.joined } : g))
    );
  };

  // ✅ Create Group
  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) return alert("Enter a group name!");
    const newEntry = {
      id: Date.now(),
      name: newGroup.name,
      desc: newGroup.desc || "Newly created group",
      joined: true,
    };
    setGroups((prev) => [...prev, newEntry]);
    setNewGroup({ name: "", desc: "" });
    setShowCreateGroup(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col sm:flex-row p-4 sm:p-6 text-sm text-gray-700"
    >
      <div className="flex h-[19rem] w-[70rem] -ml-[2rem] -mt-[2rem]">
        {/* RIGHT SIDEBAR */}
        <aside className="w-full bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 mb-3 text-sm">
            People You May Know
          </h2>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between hover:bg-gray-100 transition p-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {s.name}
                    </p>
                    <p className="text-xs text-gray-500">{s.role}</p>
                  </div>
                </div>
                <button className="cursor-pointer text-[#B8854C] text-sm font-medium">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ✅ CREATE POST MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-[50rem] relative">
            <button
              className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowPostModal(false)}
            >
              <FaTimes size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://randomuser.me/api/portraits/men/48.jpg"
                alt="Prashant Gautam"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800">Prashant Gautam</p>
                <p className="text-sm text-gray-500">
                  .NET Full Stack Developer | ASP.NET Core, C#, Web API, EF Core
                </p>
              </div>
            </div>

            <textarea
              maxLength={800}
              placeholder="Share your thoughts, updates, or achievements..."
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="w-full border rounded-md p-3 text-sm h-28 focus:outline-none"
            />
            <p className="text-xs text-gray-400 text-right">
              {newPost.content.length}/800
            </p>

            <div className="flex flex-wrap gap-2 mt-3 text-sm">
              <label className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer hover:bg-gray-100">
                <FaUpload /> Upload File
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setNewPost({ ...newPost, file: e.target.files[0] })
                  }
                />
              </label>

              <label className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer hover:bg-gray-100">
                <FaImage /> Add Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setNewPost({ ...newPost, image: e.target.files[0] })
                  }
                />
              </label>

              <label className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer hover:bg-gray-100">
                <FaVideo /> Add Video
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) =>
                    setNewPost({ ...newPost, video: e.target.files[0] })
                  }
                />
              </label>

              <button
                onClick={() => {
                  const url = prompt("Enter link URL:");
                  if (url)
                    setNewPost((prev) => ({
                      ...prev,
                      link: url,
                    }));
                }}
                className=" cursor-pointer flex items-center gap-2 border px-3 py-1 rounded hover:bg-gray-100"
              >
                <FaLink /> Add Link
              </button>
            </div>

            {/* Preview */}
            {newPost.image && (
              <img
                src={URL.createObjectURL(newPost.image)}
                alt="preview"
                className="mt-3 rounded-md max-h-48 object-cover"
              />
            )}
            {newPost.video && (
              <video
                src={URL.createObjectURL(newPost.video)}
                controls
                className="mt-3 rounded-md max-h-48 object-cover"
              />
            )}
            {newPost.link && (
              <a
                href={newPost.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-blue-600 text-sm underline"
              >
                {newPost.link}
              </a>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowPostModal(false)}
                className="cursor-pointer px-4 py-1 border rounded-md text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePostNow}
                className="cursor-pointer px-5 py-1 bg-[#102437] text-white rounded-md text-sm hover:bg-[#1b3552]"
              >
                Post Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ JOIN GROUP MODAL */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowGroupModal(false)}
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUsers /> Available Groups
            </h2>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="border p-3 rounded-lg flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-gray-800">{g.name}</p>
                    <p className="text-xs text-gray-500">{g.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleJoin(g.id)}
                    className={`cursor-pointer px-3 py-1 rounded text-xs font-medium ${
                      g.joined
                        ? "bg-green-500 text-white"
                        : "bg-[#102437] text-white"
                    }`}
                  >
                    {g.joined ? "Joined" : "Join"}
                  </button>
                </div>
              ))}
            </div>

            {!showCreateGroup && (
              <button
                onClick={() => setShowCreateGroup(true)}
                className="cursor-pointer mt-5 flex items-center gap-2 text-sm text-[#102437] hover:underline"
              >
                <FaPlus /> Create New Group
              </button>
            )}

            {showCreateGroup && (
              <div className="mt-4 border-t pt-3">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  className="w-full border rounded-md p-2 mb-2 text-sm"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newGroup.desc}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, desc: e.target.value })
                  }
                  className="w-full border rounded-md p-2 mb-2 text-sm"
                />
                <button
                  onClick={handleCreateGroup}
                  className="cursor-pointer bg-[#102437] text-white px-4 py-1 rounded-md text-sm"
                >
                  Create Group
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}