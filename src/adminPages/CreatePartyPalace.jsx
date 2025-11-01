import React, { useContext, useEffect, useRef, useState } from "react";
import adminContext from "../context/adminContext";
import userContext from "../context/userContext";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const CreatePartyPalace = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: "",
    pricePerHour: "",
    category: [],
  });

  console.log("create pp", data);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Success feedback
  const [isLoading, setIsLoading] = useState(false);

  // console.log(data);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState([]);

  const { addPartyPalace, loading } = useContext(adminContext);
  const { getAllCategory, allCategory } = useContext(userContext);
  const { token } = useSelector((state) => state?.user);

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    const newValue = type === "number" ? parseInt(value) : value;
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const isAllFills = Object.values(data).every(
    (el) => el !== "" && el.length !== 0
  );

  const handleCategoryChange = (e) => {
    const { value } = e.target;

    // Find the selected category object by its ID
    const foundData = allCategory.find((el) => el._id === value);

    // Update selectedCategory, checking for duplicates
    setSelectedCategory((prev) => {
      const isAlreadySelected = prev.some((el) => el._id === foundData._id);
      if (isAlreadySelected) return prev; // Skip if duplicate
      return [...prev, foundData]; // Add the new category
    });

    // Update the `data.category` field
    setData((prev) => {
      const isAlreadyInData = prev.category.includes(foundData.name);
      if (isAlreadyInData) return prev; // Skip if duplicate
      return {
        ...prev,
        category: [...prev.category, foundData.name],
      };
    });
  };

  const removeCategory = (id, name) => {
    setSelectedCategory((prev) => prev.filter((el) => el._id !== id));
    setData((prev) => ({
      ...prev,
      category: prev.category.filter((cat) => cat !== name),
    }));
  };

  //new logic from here
  function handleBrowseClick() {
    fileInputRef.current.click();
  }

  function handleFlieChange(e) {
    const { files } = e.target;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!image.some((e) => e.name === files[i].name)) {
        setImage((prevImg) => {
          const updatedImages = [
            ...prevImg,
            {
              name: files[i].name,
              url: URL.createObjectURL(files[i]), // This is for displaying image in frontend
              imgFile: files[i], // This is for sending image to backend
            },
          ];
          return updatedImages;
        });
      }
    }
  }

  function handleRemove(index) {
    setImage((prevImg) => prevImg.filter((_, i) => i !== index));
  }

  //drag events to handle drag and drop image feature (core JS concept)
  function onDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;

    //same logic copy pasted from handleFlieChange
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!image.some((e) => e.name === files[i].name)) {
        setImage((prevImg) => [
          ...prevImg,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
            imgFile: files[i],
          },
        ]);
      }
    }
  }
  // const handleImageUpload = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const formData = new FormData();

  //     formData.append("partyPalaceId", partyPalaceId);
  //     image.length > 0 &&
  //       image.map((im, i) => formData.append("images", im.imgFile));

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };

  //     setLoading(true);

  //     const res = await axios.put(
  //       "/proxy/api/partypalace/updateImages",
  //       formData,
  //       config
  //     );

  //     if (res.data && res.data.success) {
  //       toast.success(res.data.msg);
  //       getMyPartyPalace();
  //       close();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error?.response?.data?.msg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("name", data.name);
      image.length > 0 &&
        image.map((im, i) => formData.append("images", im.imgFile));
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("capacity", data.capacity);
      formData.append("pricePerHour", data.pricePerHour);
      formData.append("category", JSON.stringify(data.category));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        "/proxy/api/partypalace/create",
        formData,
        config
      );

      if (res && res.data && res.data.success) {
        toast.success(res.data.msg);
        setSuccessMessage("Party Palace created successfully!");
      }

      // addPartyPalace(data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Something went wrong!");
    } finally {
      setData({
        name: "",
        description: "",
        location: "",
        capacity: "",
        pricePerHour: "",
        category: [],
      });
      setImage([]);
      setSelectedCategory([]);
      setIsLoading(false);
    }
  };

  return (
    <section className=" w-full 2xl:items-start  overflow-x-hidden overflow-y-auto bg-white">
      <form
        onSubmit={handleSubmit}
        className=" py-4 px-10 w-full space-y-4 2xl:max-w-7xl 2xl:mx-auto 2xl:mt-4 h-[calc(100vh)]  overflow-x-hidden overscroll-y-auto"
      >
        <p className="text-sky-500 text-2xl tracking-wider font-bold uppercase">
          Create Party Palace
        </p>

        {/* {successMessage && (
          <p className="text-green-500 font-medium mb-4">{successMessage}</p>
        )} */}

        <div>
          <label htmlFor="name">Party Palace Name</label>
          <input
            type="text"
            className="w-full outline-none p-2 rounded-md border border-neutral-400 mt-2 focus:border-sky-500"
            placeholder="Enter party palace name"
            id="name"
            name="name"
            value={data.name}
            onChange={handleChange}
            required
          />
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className=" mx-auto bg-white rounded-md  w-full "
        >
          <p className=" text-neutral-600 font-semibold text-2xl">
            Drag and Drop Image For Upload
          </p>

          <div
            className=" h-44 max-h-56 w-full rounded-xl border-2 border-dashed border-sky-500 mt-4"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {isDragging ? (
              <span className=" text-2xl text-sky-500 text-center h-full flex flex-col items-center justify-center font-semibold">
                Drop Image Here !
              </span>
            ) : (
              <>
                <div className="text-xl text-neutral-500 text-center h-full flex flex-col items-center justify-center">
                  Drag and Drop Image or
                  <span
                    className="font-semibold text-sky-500 select-none cursor-pointer"
                    onClick={handleBrowseClick}
                  >
                    {" "}
                    Browse
                  </span>
                  <input
                    name="file"
                    type="file"
                    multiple
                    ref={fileInputRef}
                    hidden
                    onChange={handleFlieChange}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {image.length > 0 &&
              image.map((im, i) => (
                <div
                  className="w-20 h-20 border border-neutral-400 rounded-md relative"
                  key={i}
                >
                  <img
                    src={im.url}
                    className="w-full h-full object-scale-down"
                  />
                  <span
                    onClick={() => handleRemove(i)}
                    className="absolute -top-1 right-1 text-xl text-red-500 select-none cursor-pointer hover:text-neutral-600"
                  >
                    &times;
                  </span>
                </div>
              ))}
          </div>
          {/* <button className="mt-4 text-white tracking-wider bg-sky-500 px-4 py-2 rounded-md w-full cursor-pointer">
            {loading ? "Uploading..." : "Upload"}
          </button> */}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            maxLength="200"
            className="w-full outline-none p-2 rounded-md border border-neutral-400 mt-2 focus:border-sky-500 resize-none"
            placeholder="Add some description"
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="categorySelect">Select a Category</label>
          <select
            onChange={handleCategoryChange}
            id="categorySelect"
            name="category"
            className="block w-full px-4 py-2 mt-2 text-neutral-500 bg-white border border-neutral-400 rounded-lg focus:outline-none focus:border-sky-500"
          >
            <option value="" disabled selected>
              -- Choose a Category --
            </option>
            {allCategory.map((cat) => (
              <option
                key={cat._id}
                value={cat._id}
                className="hover:bg-sky-200 focus:bg-sky-300"
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory.length > 0 && (
          <div className="bg-neutral-200 rounded-md px-4 py-2 flex gap-4 flex-wrap">
            {selectedCategory.map((el) => (
              <span
                key={el._id}
                className="bg-neutral-50 w-fit px-2 py-0.5 rounded-md select-none"
              >
                <span>{el.name}</span>{" "}
                <span
                  onClick={() => removeCategory(el._id, el.name)}
                  className="cursor-pointer text-red-500 hover:text-neutral-500 transition-all ease-in-out duration-300"
                >
                  &times;
                </span>
              </span>
            ))}
          </div>
        )}

        <div>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            className="w-full outline-none p-2 rounded-md border border-neutral-400 mt-2 focus:border-sky-500"
            placeholder="Enter location"
            id="location"
            name="location"
            value={data.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            className="w-full outline-none p-2 rounded-md border border-neutral-400 mt-2 focus:border-sky-500"
            placeholder="Enter total capacity like 100"
            id="capacity"
            name="capacity"
            value={data.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price per Hour</label>
          <input
            type="number"
            className="w-full outline-none p-2 rounded-md border border-neutral-400 mt-2 focus:border-sky-500"
            placeholder="Enter price per hour"
            id="price"
            name="pricePerHour"
            value={data.pricePerHour}
            onChange={handleChange}
            required
          />
        </div>

        <button
          disabled={!isAllFills || loading}
          className={`relative flex items-center justify-center w-full gap-2 rounded-xl py-3 font-medium tracking-wide transition-all duration-300
    ${
      !isAllFills || isLoading
        ? "bg-gray-400 cursor-not-allowed text-white"
        : "bg-sky-500 hover:bg-sky-600 active:scale-[0.98] text-white shadow-md hover:shadow-lg"
    }
  `}
        >
          {isLoading && (
            <svg
              className="animate-spin h-5 w-5 text-white absolute left-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          <span>{isLoading ? "Creating..." : "Create"}</span>
        </button>
      </form>
    </section>
  );
};

export default CreatePartyPalace;
