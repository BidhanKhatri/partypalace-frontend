import api from "../utils/apiInstance";
import React, { useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import adminContext from "../context/adminContext";

const UpdatePPImgModal = ({ partyPalaceId, close }) => {
  const [image, setImage] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { token } = useSelector((state) => state?.user);
  const { getMyPartyPalace } = useContext(adminContext);

  //   console.log(image);

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

  //handle Image upload logic
  const handleImageUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("partyPalaceId", partyPalaceId);
      image.length > 0 &&
        image.map((im, i) => formData.append("images", im.imgFile));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      setLoading(true);

      const res = await api.put(
        "/api/partypalace/updateImages",
        formData,
        config
      );

      if (res.data && res.data.success) {
        toast.success(res.data.msg);
        getMyPartyPalace();
        close();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      onClick={close}
      className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleImageUpload}
        className="max-w-xl 2xl:max-w-3xl mx-auto bg-white rounded-md  w-full p-4"
      >
        <p className="text-center text-sky-500 font-semibold text-2xl">
          Drag and Drop Image For Upload
        </p>

        <div
          className=" h-44 max-h-56 w-full border-2 border-dashed border-sky-500 mt-4"
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
                <img src={im.url} className="w-full h-full object-scale-down" />
                <span
                  onClick={() => handleRemove(i)}
                  className="absolute -top-1 right-1 text-xl text-red-500 select-none cursor-pointer hover:text-neutral-600"
                >
                  &times;
                </span>
              </div>
            ))}
        </div>
        <button className="mt-4 text-white tracking-wider bg-sky-500 px-4 py-2 rounded-md w-full cursor-pointer">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </section>
  );
};

export default UpdatePPImgModal;
