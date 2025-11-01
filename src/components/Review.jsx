import React, { useContext, useEffect, useState } from "react";
import { FaArrowAltCircleRight, FaStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import userContext from "../context/userContext";
import { toast } from "react-toastify";
import { socket } from "../../socket";
import { setReviews } from "../redux/features/partypalaceSlice";
import { useDispatch, useSelector } from "react-redux";

const Review = () => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [reviewData, setReviewData] = useState({});
  const { id: partyPalaceId } = useParams() || {};
  const { createReview, getReviews, loading, error } =
    useContext(userContext) || {};
  const { reviews } = useSelector((state) => state?.partypalace);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    getReviews(partyPalaceId);
  }, [location.pathname.includes("booking")]);

  const handleReviewData = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value, partyPalaceId });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewData.comment || !reviewData.ratings) {
      toast.error("Provide both a comment and rating.");
      return;
    }
    createReview(reviewData);
    setReviewData({ comment: "", ratings: null });
    setRating(null);
  };

  useEffect(() => {
    const getRealTimeReview = (data) => {
      const exists = reviews.some((el) => el._id === data._id);
      if (!exists) {
        dispatch(setReviews([data, ...reviews]));
      }
    };

    socket.on("createReview", getRealTimeReview);
    return () => socket.off("createReview", getRealTimeReview);
  }, [dispatch]);

  return (
    <section className="bg-neutral-900 w-full rounded-2xl p-6 max-w-7xl mx-auto shadow-lg border border-neutral-800">
      <p className="font-bold text-2xl tracking-wider text-white">
        Customer Reviews
      </p>

      {/* No Reviews */}
      {reviews?.length === 0 && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-neutral-500">{error || "No reviews yet."}</p>
        </div>
      )}

      {/* Reviews List */}
      {reviews?.length > 0 &&
        reviews.map((review, index) => (
          <div
            key={index}
            className="flex gap-4 mt-8 bg-neutral-800 rounded-xl p-4 border border-neutral-700 hover:border-[#FBAD34]/40 transition"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-700">
              <img
                src={review.reviewBy?.profilePic || "/placeholder.svg"}
                className="w-full h-full object-cover"
                alt="User avatar"
              />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">
                  {review.reviewBy.username}
                </span>
                <span className="text-sm text-neutral-400">2 days ago</span>
              </div>
              <span className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < review.reviews.ratings
                        ? "text-[#FBAD34]"
                        : "text-neutral-600"
                    }
                    size={18}
                  />
                ))}
              </span>
              <p className="mt-2 text-neutral-300 break-words leading-relaxed">
                {review.reviews.comment}
              </p>
            </div>
          </div>
        ))}

      {/* Review Form */}
      <form className="bg-neutral-800 w-full mt-8 rounded-xl p-5 border border-neutral-700">
        <p className="font-semibold text-xl tracking-wide text-white mb-3">
          Write a Review
        </p>
        <textarea
          className="w-full bg-neutral-900 rounded-lg p-3 text-white border border-neutral-700 resize-none outline-none focus:border-[#FBAD34] focus:ring-1 focus:ring-[#FBAD34]"
          rows={4}
          maxLength={200}
          placeholder="Share your thoughts about this place..."
          value={reviewData.comment || ""}
          name="comment"
          onChange={handleReviewData}
        />

        {/* Star Rating + Submit */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex gap-2">
            {[...Array(5)].map((_, index) => {
              const currentRating = index + 1;
              return (
                <React.Fragment key={currentRating}>
                  <input
                    type="radio"
                    id={`star-${currentRating}`}
                    onClick={() => {
                      setRating(currentRating);
                      setReviewData((prev) => ({
                        ...prev,
                        ratings: currentRating,
                      }));
                    }}
                    value={currentRating}
                    hidden
                    name="ratings"
                    onChange={handleReviewData}
                  />
                  <label htmlFor={`star-${currentRating}`}>
                    <FaStar
                      color={
                        currentRating <= (hover || rating) ? "#FBAD34" : "#444"
                      }
                      onMouseEnter={() => setHover(currentRating)}
                      onMouseLeave={() => setHover(null)}
                      size={26}
                      className="cursor-pointer transition-transform hover:scale-110"
                    />
                  </label>
                </React.Fragment>
              );
            })}
          </div>

          <button
            type="submit"
            onClick={handleReviewSubmit}
            className={`p-3 rounded-lg font-semibold tracking-wide flex items-center gap-2 transition transform hover:scale-105 ${
              loading
                ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                : "bg-[#FBAD34] text-black hover:bg-[#E99D23]"
            }`}
            disabled={loading}
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                <FaArrowAltCircleRight />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Review;
