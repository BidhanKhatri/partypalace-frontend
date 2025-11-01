import { createContext, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBookedPartyPalaceLength,
  setPartyPalace,
  setReviews,
} from "../redux/features/partypalaceSlice";
import axios from "axios";
import { toast } from "react-toastify";

const userContext = createContext();

export default userContext;

export const UserProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [message, setMessage] = useState([]);
  const [topLiked, setTopLiked] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [otherCategoryData, setOtherCategoryData] = useState({});
  const [quickSearchPaginationData, setQuickSearchPaginationData] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state?.user);
  const dispatch = useDispatch();

  //getting as a user booking data
  const getBookingData = useCallback(async () => {
    if (!token) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get("/proxy/api/booking/get", config);
      if (res && res.data.success) {
        setBookingData(res.data.data);
        dispatch(setBookedPartyPalaceLength(res.data.data.length));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  }, []);

  //getting party recently added palace state
  const fetchAllPartyPalace = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/proxy/api/partypalace/get-all");
      if (res && res.data.success) {
        dispatch(setPartyPalace(res.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // api to cancle the booking
  const handleCancel = async (bookingId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.delete(
        `/proxy/api/booking/cancel/${bookingId}`,
        config
      );
      if (res && res.data.success) {
        toast.success(res.data.msg);
        getBookingData();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  //api to get search data
  const getSearchData = async (search, page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/proxy/api/partypalace/get-all?page=${page}&limit=12`,
        {
          params: { search },
        }
      );
      if (res.data && res.data.success) {
        // console.log(res.data.data);
        setSearchData((prevData) => {
          return JSON.stringify(prevData) === JSON.stringify(res.data.data)
            ? prevData
            : res.data.data;
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //api to update the booking details
  const updateBooking = async (data) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const res = await axios.patch("/proxy/api/booking/update", data, config);
      if (res.data && res.data.success) {
        toast.success(res.data.msg);
        await getBookingData();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  //send message to admin
  const sendMessage = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/proxy/api/message/sendMyMessage", data);
      if (res.data && res.data.success) {
        toast.success(res.data.msg);
      }
    } catch (error) {
      toast.error(error.response.data.msg);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //get message from admin
  const getMessage = async (receiverId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/proxy/api/message/getMessage?receiverId=${receiverId}`
      );
      if (res.data && res.data.success) {
        setMessage(res.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  //api to get filtered min and max price party palace data
  const getPartyPalaceByFilter = async (payload) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      setLoading(true);
      const res = await axios.post(
        `/proxy/api/partypalace/byFilter`,
        payload,
        config
      );
      if (res.data && res.data.success) {
        setSearchData(res.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
      setSearchData([]);
    } finally {
      setLoading(false);
    }
  };

  //get by category  data
  const getPartyPalaceByCategory = async (category, page) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `/proxy/api/partypalace/getByCategory?category=${category}&page=${page}`,
        config
      );
      if (res.data && res.data.success) {
        // setCategoryData(res.data.data);
        setCategoryData((prev) => ({
          ...prev,
          [category]: res.data.data,
        }));
        setOtherCategoryData((prev) => ({
          ...prev,
          [category]: {
            totalPage: res.data.totalPage,
            totalCount: res.data.totalCount,
          },
        }));
      }
    } catch (error) {
      console.log(error);
      // toast.error(error?.response?.data?.msg);
    }
  };

  // get top liked partypalace
  const getTopLikedPartyPalace = async () => {
    if (!token) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const res = await axios.get("/proxy/api/partypalace/topLiked", config);
      if (res.data && res.data.success) {
        setTopLiked(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //get all category
  const getAllCategory = async () => {
    try {
      const res = await axios.get("/proxy/api/global/category/get");

      if (res.data && Array.isArray(res.data.data)) {
        setAllCategory(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //add the review
  const createReview = async (data) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("receving review data at context", data);

      setLoading(true);

      const res = await axios.post("/proxy/api/review/create", data, config);
      if (res.data && res.data.success) {
        toast.success(res.data.msg);
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //get all reviwes for specific partypalace
  const getReviews = async (partyPalaceId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      setLoading(true);
      const res = await axios.get(
        `/proxy/api/review/getReview?partyPalaceId=${partyPalaceId}`,
        config
      );
      if (res.data && res.data.success) {
        dispatch(setReviews(res.data.data));
      }
    } catch (error) {
      setError(error?.response?.data?.msg);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //get by category  data
  const getPartyPalaceByCategoryAndAvailableDates = async (
    searchData,
    page
  ) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        category: searchData.category,
        targetedDate: searchData.targetedDate,
        page,
      };

      const res = await axios.post(
        `/proxy/api/partypalace/get-by-category-date`,
        payload,
        config
      );

      if (res.data && res.data.success) {
        setQuickSearchPaginationData(res.data);
        // console.log("res.data", res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  const value = {
    bookingData,
    searchData,
    loading,
    message,
    topLiked,
    categoryData,
    otherCategoryData,
    allCategory,
    error,
    getBookingData,
    fetchAllPartyPalace,
    handleCancel,
    getSearchData,
    setLoading,
    updateBooking,
    sendMessage,
    getMessage,
    getPartyPalaceByFilter,
    getTopLikedPartyPalace,
    getPartyPalaceByCategory,
    getAllCategory,
    createReview,
    getReviews,
    setError,
    getPartyPalaceByCategoryAndAvailableDates,
    quickSearchPaginationData,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
