import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gray-50 flex flex-col md:flex-row items-center justify-between px-8 py-20 min-h-[calc(100vh-80px)] font-sans">
      <div className="md:w-1/2 md:pr-12 lg:pr-24 space-y-6">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-[#1a202c] leading-tight">
          Manage Your <br className="hidden md:block" />
          Mess Costs <br className="hidden md:block" />
          Smartly
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-lg">
          Automatic meal calculation and expense tracking for university
          students in Bangladesh.
        </p>
        <div className="flex space-x-4 pt-4">
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md flex items-center transition"
          >
            Get Started <span className="ml-2">→</span>
          </Link>
          <Link
            to="/login"
            className="bg-transparent hover:bg-green-50 text-green-600 font-medium py-3 px-8 border border-green-600 rounded-md transition"
          >
            Login
          </Link>
        </div>
      </div>
      <div className="md:w-1/2 mt-12 md:mt-0">
        <img
          src="https://cdn.bdnews24.com/bdnews24/media/bdnews24-english/import/media/2017/06/05/bangladesh-cricket-at-red-fort-21.jpg"
          alt="Students eating"
          className="rounded-xl shadow-lg w-full h-auto object-cover max-h-[600px]"
        />
      </div>
    </section>
  );
};

export default Hero;
