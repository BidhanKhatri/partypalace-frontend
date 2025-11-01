import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setMyPartyPalace } from "../redux/features/partypalaceSlice";

const adminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {
  const { token, userId } = useSelector((state) => state?.user);
  const [loading, setLoading] = useState(false);
  const [myPartyPalaceData, setMyPartyPalaceData] = useState([]);
  const [userBookingData, setUserBookingData] = useState({});
  const [leftSideChatData, setLeftSideChatData] = useState([]);
  const dispatch = useDispatch();

  //function to create partypalace
  const addPartyPalace = async (data) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);

      const res = await axios.post(
        "/proxy/api/partypalace/create",
        data,
        config
      );
      if (res.data && res.data.success) {
        toast.success(res.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  //function to get my party palace
  const getMyPartyPalace = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);

      const res = await axios.post(
        "/proxy/api/admin/get-my-partypalace",
        { createdBy: userId },
        config
      );
      if (res.data && Array.isArray(res.data.data)) {
        setMyPartyPalaceData(res.data.data);
        dispatch(setMyPartyPalace(res.data.data));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  //function to delete party palace
  const deletePartyPalace = async (partyPalaceId) => {
    console.log(partyPalaceId);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);

      const res = await axios.delete(
        `/proxy/api/partypalace/delete?partyPalaceId=${partyPalaceId}`,
        config
      );
      if (res.data && res.data.success) {
        toast.success(res.data.msg);
        getMyPartyPalace();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  //function to update party palace
  const updatePartyPalace = async (data) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const res = await axios.patch(
        "/proxy/api/partypalace/update",
        data,
        config
      );
      if (res.data && res.data.success) {
        toast.success(res.data.msg);
        getMyPartyPalace();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  // function to get user booking data
  const fetchUserBookingData = async (partyPalaceId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `/proxy/api/admin/get-bookings?partyPalaceId=${partyPalaceId}`,
        config
      );

      if (res.data && res.data.success) {
        setUserBookingData((prev) => ({
          ...prev,
          [partyPalaceId]: res.data.data, // store bookings under that palaceId
        }));
      }
    } catch (error) {
      // console.log(error);
      // toast.error(error?.response?.data?.msg);
    }
  };

  //function to update user booking status

  const updateUserBookingStatus = async (data) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { bookingId, status } = data;
      const res = await axios.put(
        "/proxy/api/admin/update-status",
        { bookingId, status },
        config
      );
      if (res.data && res.data.success) {
        toast.success(res.data.msg);
        fetchUserBookingData(data.partyPalaceId);
      }
      // console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  //fucntio to get left side chat bar
  const getLeftSideChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `/proxy/api/message/getLeftMessagesAdmin?createdBy=${userId}`,
        config
      );
      if (res.data && res.data.success) {
        setLeftSideChatData(res.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };

  const value = {
    loading,
    myPartyPalaceData,
    userBookingData,
    leftSideChatData,
    addPartyPalace,
    getMyPartyPalace,
    setMyPartyPalaceData,
    deletePartyPalace,
    updatePartyPalace,
    fetchUserBookingData,
    setUserBookingData,
    updateUserBookingStatus,
    getLeftSideChat,
  };
  return (
    <adminContext.Provider value={value}>{children}</adminContext.Provider>
  );
};

export default adminContext;
