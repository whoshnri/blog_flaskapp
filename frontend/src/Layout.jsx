// here i will define the header and also make them show or  not show based on the width of the screen
import BlogSidebar from "./components/navs/SideBar";
import MobileNav from "./components/navs/MobileNav";
import HeroSection from "./components/Hero";
import { SubscribeSection } from "./components/SubscribeSection";
import Footer from "./components/Footer";
import Loader from './components/Loader'
import SearchPage from "./components/Search";
import CreateBlogCard from './components/CreateBlog'
import SignupForm from "./components/Users/SignUp";
import LoginForm from "./components/Users/Login";
import FuturisticCard from "./components/BlogBodey"


import { useRef, useState } from "react";
const Layout = () => {
  const [searchPage, setSearchPage] = useState(false);
  const [showSearchPageLoader, setShowSearchPageLoader] = useState(false)

  const scrollToTarget = (e) => {
    e.preventDefault();
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showSearchPage = (e) => {
    e.preventDefault();
    setShowSearchPageLoader(true)
    setSearchPage(!searchPage);
  };

  
  const targetRef = useRef(null);
  return (

      <> 
      </>


    // <>
    //   <div className="flex">
    //     <div className="">
    //       <div className="hidden xs:block ">
    //         <BlogSidebar
    //           scrollToTarget={scrollToTarget}
    //           showSearchPage={showSearchPage}
    //         />
    //       </div>
    //       <div className="block xs:hidden">
    //         <MobileNav />
    //       </div>
    //     </div>

    //     {searchPage ? (
    //       <div className={`h-[100vh]  bg-black relative w-full custom-scrollbar  overflow-auto ${!showSearchPageLoader ? 'overflow-hidden' : ''}`}>
    //         {" "}
    //        <SearchPage></SearchPage>
    //        <div className="mt-7"></div>
    //        <Footer></Footer>
    //         {/* {showSearchPageLoader && (<Loader></Loader>)} */}
    //        {" "}
    //       </div>
    //     ) : (
    //       <div className="h-[100vh] w-full custom-scrollbar  overflow-auto">
    //         {" "}
    //         <HeroSection></HeroSection>
    //         <SubscribeSection targetRef={targetRef}></SubscribeSection>
    //         <Footer></Footer>{" "}
    //       </div>
    //     )}
    //   </div>

    //   {/* <CreateBlogCard></CreateBlogCard> */}
    // </>
  );
};



export default Layout;
