import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import VenueCard from "../components/VenueCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import userContext from "../context/userContext";

const QuickSearchPage = () => {
  const { state } = useLocation();
  const [receivedData, setReceivedData] = useState([]);
  const [page, setPage] = useState(1);
  const {
    getPartyPalaceByCategoryAndAvailableDates,
    quickSearchPaginationData,
  } = useContext(userContext);

  console.log(receivedData);

  // Fix: Update receivedData when pagination data changes
  useEffect(() => {
    if (quickSearchPaginationData && quickSearchPaginationData.length > 0) {
      setReceivedData(quickSearchPaginationData);
    }
  }, [quickSearchPaginationData]);

  // Initialize receivedData from state
  useEffect(() => {
    if (state?.data) {
      setReceivedData(state.data);
    }
  }, [state]);

  return (
    <section className="min-h-[calc(80vh-64px)] h-[85vh] overflow-y-auto bg-slate-950 py-20 px-4 md:px-8">
      {Array.isArray(receivedData) && receivedData.length > 0 ? (
        <div
          className="
            mx-auto max-w-6xl
            grid gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            2xl:grid-cols-4
          "
        >
          {receivedData.map((el) => (
            <VenueCard
              key={el?._id}
              name={el?.name}
              description={el?.description}
              location={el?.location}
              capacity={el?.capacity}
              pricePerHour={el?.pricePerHour}
              images={el?.images}
              toggleLike={() => {}}
              partyPalaceId={el?._id}
              likedBy={el?.likedBy || []}
              userId={el?.createdBy}
              totalLikes={el?.likes || 0}
              category={el?.category}
            />
          ))}
          {console.log("Rendering Quick Search Results", receivedData)}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500">No results found</p>
      )}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          className={`px-4 py-2 ${
            page === 1 && "opacity-50 cursor-not-allowed"
          } bg-black text-white rounded-lg hover:bg-black/80 transition-colors`}
          disabled={page === 1}
          onClick={() => {
            setPage((prev) => prev - 1);
            getPartyPalaceByCategoryAndAvailableDates(
              state.searchData,
              page - 1
            );
          }}
        >
          <FaArrowLeft />
        </button>
        <span>
          {page}/{state?.totalPage || 1}
        </span>
        <button
          className={`px-4 py-2 ${
            page === state?.totalPage && "opacity-50 cursor-not-allowed"
          } bg-black text-white rounded-lg hover:bg-black/80 transition-colors`}
          onClick={() => {
            setPage((prev) => prev + 1);
            getPartyPalaceByCategoryAndAvailableDates(
              state.searchData,
              page + 1
            );
          }}
          disabled={page === state?.totalPage}
        >
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default QuickSearchPage;
