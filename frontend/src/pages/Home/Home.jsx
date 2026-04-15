import About from "../../components/Home/About";
import Footer from "../../components/Home/Footer";
import Hero from "../../components/Home/Hero";
import HowItWorks from "../../components/Home/HowItWorks";
import Navbar from "../../components/Home/Navbar";

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
