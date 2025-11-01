import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import VenueCard from "../components/VenueCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import userContext from "../context/userContext";

const QuickSearchPage = () => {
  const { state } = useLocation();
  const [receivedData, setReceivedData] = useState(() => state || null);
  const [page, setPage] = useState(1);
  const {
    getPartyPalaceByCategoryAndAvailableDates,
    quickSearchPaginationData,
  } = useContext(userContext);

  console.log(receivedData);
  // console.log("state", state.data);
  // console.log("searchData", state.searchData);
  // console.log("totalCount", state.totalCount);
  // console.log("totalPage", state.totalPage);

  if (quickSearchPaginationData.length > 0) {
    return setReceivedData((prev) => [...prev, ...quickSearchPaginationData]);
  }

  useEffect(() => {
    setReceivedData(state.data || null);
  }, [state]);

  return (
    <section className="min-h-[calc(80vh-64px)] bg-slate-50 py-20 px-4 md:px-8">
      {Array.isArray(receivedData) && receivedData.length > 0 ? (
        <div
          className="
            mx-auto max-w-6xl
            grid gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {receivedData.map((el) => (
            <VenueCard key={el?._id ?? el?.name} {...el} />
          ))}
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
          {page}/{state.totalPage}
        </span>

        <button
          className={`px-4 py-2 ${
            page === state.totalPage && "opacity-50 cursor-not-allowed"
          } bg-black text-white rounded-lg hover:bg-black/80 transition-colors`}
          onClick={() => {
            setPage((prev) => prev + 1);
            getPartyPalaceByCategoryAndAvailableDates(
              state.searchData,
              page + 1
            );
          }}
          disabled={page === state.totalPage}
        >
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default QuickSearchPage;
