import React, { useContext, useEffect, useState } from "react";
import adminContext from "../context/adminContext";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaImages, FaTrash } from "react-icons/fa";
import { GrDocumentUpdate } from "react-icons/gr";
import UpdatePartyPalaceModal from "../components/UpdatePartyPalaceModal";
import UpdatePPImgModal from "../components/UpdatePPImgModal";

const DisplayMyPartyPalaces = () => {
  const { getMyPartyPalace, myPartyPalaceData, deletePartyPalace } =
    useContext(adminContext);
  const { myPartyPalace } = useSelector((state) => state?.partypalace);
  const { token, userId } = useSelector((state) => state?.user);
  const location = useLocation();

  const [isUpdatePartyPalaceOpen, setIsUpdatePartyPalaceOpen] = useState(false);
  const [isUpdatePPImgOpen, setIsUpdatePPImgOpen] = useState(false);
  const [prevPPData, setPrevPPData] = useState(null);
  const [ppId, setPpId] = useState(null); // here is the partyPalaceId id when clicking on the update icon

  const toggleUpdatePP = (prevData) => {
    setIsUpdatePartyPalaceOpen(!isUpdatePartyPalaceOpen);
    if (!prevData) return;
    setPrevPPData(prevData);
  };

  const toggleUpdatePPImg = (partyPalaceId) => {
    setIsUpdatePPImgOpen(!isUpdatePPImgOpen);
    setPpId(partyPalaceId);
  };

  // console.log("my pp data from redux", myPartyPalace);

  useEffect(() => {
    // console.log("Token:", token);
    // console.log("UserId:", userId);
    if (token && userId) {
      getMyPartyPalace();
    }
  }, [token, userId, location.pathname]);

  const handleDeletePartyPalace = (partyPalaceId) => {
    deletePartyPalace(partyPalaceId);
  };

  return (
    <div className="container mx-auto p-4 bg-white ">
      <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider text-sky-500">
        My Party Palaces
      </h2>
      <div className="overflow-x-auto max-h-[calc(98vh-64px)]">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Capcity</th>
              <th className="py-2 px-4 border-b">Likes</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {myPartyPalaceData.length > 0 ? (
              myPartyPalaceData.map((palace, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <img
                      src={palace.images[0]}
                      alt={palace.name}
                      className="w-16 h-16 object-cover rounded-md border text-xs flex items-center justify-center text-center"
                    />
                  </td>
                  <td className="py-2 px-4">{palace.name}</td>
                  <td className="py-2 px-4">{palace.location}</td>
                  <td className="py-2 px-4">NPR {palace.pricePerHour}</td>
                  <td className="py-2 px-4"> {palace.capacity}</td>
                  <td className="py-2 px-4"> {palace.likedBy.length}</td>

                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleUpdatePP(palace)}
                        className="text-green-500 cursor-pointer"
                      >
                        <GrDocumentUpdate size={20} />
                      </button>
                      <button
                        onClick={() => toggleUpdatePPImg(palace._id)}
                        className="text-sky-500 cursor-pointer "
                      >
                        <FaImages size={20} />
                      </button>
                      <button
                        onClick={() => handleDeletePartyPalace(palace._id)}
                        className="text-red-500 cursor-pointer"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No party palaces found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isUpdatePartyPalaceOpen && (
        <UpdatePartyPalaceModal
          close={toggleUpdatePP}
          prevPPData={prevPPData}
        />
      )}

      {isUpdatePPImgOpen && <UpdatePPImgModal partyPalaceId={ppId} close={() => setIsUpdatePPImgOpen(false)} />}
    </div>
  );
};

export default DisplayMyPartyPalaces;
