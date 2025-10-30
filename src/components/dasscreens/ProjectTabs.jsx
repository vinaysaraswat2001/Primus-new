import { useState } from 'react';

const ProjectTabs = () => {
  const [selectedTab, setSelectedTab] = useState('Project Planning');

  const pageLinks = {
    'Published RFP': '#',
    'Technical Presentation': '#',
    'Inception Report': '#',
    'Project Short Term Goals': '#',
    'Project Long Term Goals': '#',
  };

  const tabContent = {
    'Project Planning':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut pellentesque augue. Nam id imperdiet risus, a faucibus eros. Proin maximus, neque nec fringilla pellentesque.',
    'Project Initiation':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut pellentesqud e augue. Nam id imperdiet risus, a faucibus eros. Proin maximus, neque nec fringilla pellentesque.',
    'Project Execution':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut pellentesqud e augue. Nam id imperdiet risus, a faucibus eros. Proin maximus, neque nec fringilla pellentesque.',
    'Project Closure':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut pellentesqud e augue. Nam id imperdiet risus, a faucibus eros. Proin maximus, neque nec fringilla pellentesque.',
    'Legal Compliance':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut pellentesqud e augue. Nam id imperdiet risus, a faucibus eros. Proin maximus, neque nec fringilla pellentesque.',
  };

  const tabs = [
    'Project Planning',
    'Project Initiation',
    'Project Execution',
    'Project Closure',
    'Legal Compliance',
  ];

  return (
    <div className="container mx-auto p-2 sm:p-4">
      {/* Tabs Container */}
      <div
        className="
          grid grid-cols-2 gap-x-2 gap-y-2 mb-4 border-b border-gray-800 cursor-pointer
          sm:flex sm:flex-row sm:space-x-0 sm:gap-0
        "
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`
              px-4 py-2 border-b-4 focus:outline-none
              ${selectedTab === tab ? 'bg-white text-gray-800 border-white' : 'bg-[#441410] text-white border-transparent'}
              ${tab === 'Legal Compliance' ? 'col-span-2 sm:col-span-1 sm:justify-start' : ''}
            `}
            style={{
              marginLeft: 0,
              zIndex: selectedTab === tab ? 10 : 0,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-center sm:flex sm:flex-row sm:space-x-4 sm:text-left"
      >
        {Object.keys(pageLinks).map((page, index, arr) => (
          <a
            href={pageLinks[page]}
            key={page}
            className={`
        text-blue-500 text-sm hover:underline text-center
        ${index === arr.length - 1 ? 'col-span-2 justify-self-center sm:col-span-1 sm:justify-self-auto' : ''}
      `}
            style={{ cursor: 'pointer' }}
          >
            {page}
          </a>
        ))}
      </div>



      {/* Content Area */}
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">{`${selectedTab} Details`}</h2>
        <p>{tabContent[selectedTab]}</p>
      </div>
    </div>
  );
};

export default ProjectTabs;