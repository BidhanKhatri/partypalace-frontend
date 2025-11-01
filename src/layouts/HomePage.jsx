import React, { useEffect } from "react";
import HeroSection from "../pages/HeroSection";
import RecentPalace from "../pages/RecentPalace";
import SubHeroSection from "../pages/SubHeroSection";
import TopLikedPalace from "../pages/TopLikedPalace";
import CategoryLayout from "./CategoryLayout";
import Category from "../components/Category";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigation = useNavigate();

  //function to redirect the user if the token is missing, the user will redirect to the login page

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigation("/login");
    } else {
      navigation("/", { replace: true });
    }
  }, []);

  return (
    <div>
      <HeroSection />
      <SubHeroSection />
      {/* <Category /> */}
      <RecentPalace />
      <TopLikedPalace />
      <CategoryLayout />
    </div>
  );
};

export default HomePage;
