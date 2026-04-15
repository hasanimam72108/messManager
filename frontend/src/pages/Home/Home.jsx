import About from "../../components/Home/About";
import Footer from "../../components/Home/Footer";
import Hero from "../../components/Home/Hero";
import Navbar from "../../components/Home/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Footer />
    </div>
  );
};

export default Home;
