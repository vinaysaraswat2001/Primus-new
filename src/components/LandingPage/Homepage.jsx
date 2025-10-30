import HeroSection from "./HeroSection";
import Information from "./Information";
import Services from "./Services";
import Footer from "../navbars/Footer/Footer";
import HomeNav from "../navbars/HomeNav";


const Homepage = () => {
  return (
    <div className="bg-gray-100 text-white">
      {/* Homenavbar Section */}
      <section>
        <HomeNav />
      </section>

      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* About */}
      <section id="about">
        <Information />
      </section>

      {/* Who We Are */}
      {/* Services Section */}
      <section id="services" className="bg-white">
        <Services />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
