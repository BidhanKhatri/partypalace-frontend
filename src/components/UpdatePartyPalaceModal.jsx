import React, { useContext, useState } from "react";
import adminContext from "../context/adminContext";
import { useSelector } from "react-redux";

const UpdatePartyPalaceModal = ({ close, prevPPData }) => {
  const { updatePartyPalace, loading } = useContext(adminContext);
  const { token, userId } = useSelector((state) => state?.user);

  const [newPPData, setNewPPData] = useState({
    partyPalaceId: prevPPData?._id,
    name: prevPPData?.name,
    location: prevPPData?.location,
    pricePerHour: prevPPData?.pricePerHour,
    capacity: prevPPData?.capacity,
  });

  //   console.log(newPPData);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    const newValue = type === "number" ? parseInt(value) : value;

    setNewPPData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token && userId) {
      updatePartyPalace(newPPData);
      close();
    }
    return;
  };

  return (
    <section
      onClick={close}
      className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-w-lg 2xl:max-w-xl bg-white rounded-md shadow-md p-4 mx-auto w-full space-y-4"
      >
        <div>
          <label htmlFor="name"> Party Palace Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="change party palace name"
            className="w-full border rounded-md px-2 py-1 mt-2"
            value={newPPData?.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="location"> Location</label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="change party palace location"
            className="w-full border rounded-md px-2 py-1 mt-2"
            value={newPPData?.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price">Price Per Hour (NPR)</label>
          <input
            type="number"
            name="pricePerHour"
            id="price"
            placeholder="change party palace price"
            className="w-full border rounded-md px-2 py-1 mt-2"
            value={newPPData?.pricePerHour}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            name="capacity"
            id="capacity"
            placeholder="change party palace capacity"
            className="w-full border rounded-md px-2 py-1 mt-2"
            value={newPPData?.capacity}
            onChange={handleChange}
          />
        </div>

        <button className="text-white bg-sky-500 rounded-md mt-2 p-2 hover:bg-sky-600 transition-all duration-500 ease-in-out w-full cursor-pointer">
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </section>
  );
};

export default UpdatePartyPalaceModal;
