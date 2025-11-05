import { createBrowserRouter } from "react-router-dom";
import HeroSection from "../pages/HeroSection";
import RecentPalace from "../pages/RecentPalace";
import App from "../App";
import Layout from "../layouts/Layout";
import HomePage from "../layouts/HomePage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import BookingPage from "../pages/BookingPage";
import SearchPage from "../pages/SearchPage";
import IsAdminRoute from "./IsAdminRoute";
import PageNotFound from "../pages/PageNotFound";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../adminPages/Dashboard";
import CreatePartyPalace from "../adminPages/CreatePartyPalace";
import DisplayMyPartyPalaces from "../adminPages/DisplayMyPartyPalaces";
import NotificationPage from "../adminPages/NotificationPage";
import UserStatusListPage from "../adminPages/UserStatusListPage";
import ChatPage from "../pages/ChatPage";
import AdminChatPage from "../adminPages/AdminChatPage";
import CameraManPage from "../pages/CameraManPage";
import NearestCameraMan from "../pages/NearestCameraMan";
import CameraManMapView from "../components/CameraManMapView";
import QuickSearchPage from "../pages/QuickSearchPage";
import Signup from "../pages/Signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PartypalaceMapLayout from "../layouts/PartypalaceMapLayout";
import PartyPalaceMap from "../components/PartyPalaceMap";

const GoogleAuthWrapper = () => {
  return (
    <GoogleOAuthProvider clientId="167093378818-8317gl84e1joi0md89jta9tu7fek4mtm.apps.googleusercontent.com">
      <LoginPage />
    </GoogleOAuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "booking/:id",
        element: <BookingPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "chat/:receiverId/:partyPalaceId",
        element: <ChatPage />,
      },
      {
        path: "/cameraman",
        element: <CameraManPage />,
      },
      {
        path: "/nearest-cameraman",
        element: <NearestCameraMan />,
      },
      {
        path: "/quick-search",
        element: <QuickSearchPage />,
      },
      {
        path: "/map",
        element: <PartypalaceMapLayout />,
        children: [{ path: "", element: <PartyPalaceMap /> }],
      },
    ],
  },

  {
    path: "/login",
    element: <GoogleAuthWrapper />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/cameraman-mapview",
    element: <CameraManMapView />,
  },

  {
    path: "/admin",
    element: <IsAdminRoute />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "create-partypalace",
            element: <CreatePartyPalace />,
          },
          {
            path: "display-partypalace",
            element: <DisplayMyPartyPalaces />,
          },
          {
            path: "booking-userstatus",
            element: <NotificationPage />,
            children: [
              {
                path: "list",
                element: <UserStatusListPage />,
              },
            ],
          },
          {
            path: "chat",
            element: <AdminChatPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
