// here i will define the header and also make them show or  not show based on the width of the screen
import BlogSidebar from "./components/navs/SideBar";
import MobileNav from "./components/navs/MobileNav";
import HeroSection from "./components/Hero";
import { SubscribeSection } from "./components/SubscribeSection";
import Footer from "./components/Footer";
import FuturisticCard from "./components/BlogBodey";

const Layout = () => {
  return (
    <>
      {/* <div className="flex">
        <div className="">
          <div className="hidden xs:block ">
            <BlogSidebar />
          </div>
          <div className="block xs:hidden">
            <MobileNav />
          </div>
        </div>
        <div className="h-[100vh] w-full custom-scrollbar  overflow-auto">
          <HeroSection></HeroSection>
          <SubscribeSection></SubscribeSection>
          <Footer></Footer>
        </div>
      </div> */}
      <FuturisticCard></FuturisticCard>
    </>
  );
};

export default Layout;
