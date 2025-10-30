import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';


const EditProfile  = ({ onBack }) => {
  return (
    <div className="flex items-center justify-center">
{/* Back Button */}
<div className="absolute top-6 left-6 z-50">
  <button
    className="flex items-center text-[white] text-sm -ml-24 cursor-pointer"
    onClick={onBack}
  >
    <FaArrowLeft className="w-4 h-4 mr-2" />
  </button>
</div>

      <div className="p-6 rounded-lg shadow-lg w-full">
        <form className="space-y-6">
          <div>
            <h3 className="text-left text-gray-700 font-medium mb-4">Personal details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Re-enter first name"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Add GST (Optional)"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Re-enter middle name"
                />
              </div>
                <h3 className="text-left text-gray-700 font-medium">Change password</h3>
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Re-enter last name"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Enter your current password"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Country/State"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Enter your new password"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="City"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Re-confirm your new password"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-left text-gray-700 font-medium mb-4">Company/covt. details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  className="w-full mb-[1rem] p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Re-enter company/covt.name"
                />
                <input
                  type="text"
                  className="w-full p-3 bg-[#F5F5F5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A2C2A]"
                  placeholder="Re-enter designation"
                />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <button
                  type="button"
                  className="bg-[#AD8051] text-white py-3 cursor-pointer rounded transition"
                  style={{ background: 'linear-gradient(to right, #AD8051, #473521)' }}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="bg-[#AA2C28] text-white py-3 cursor-pointer rounded transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;