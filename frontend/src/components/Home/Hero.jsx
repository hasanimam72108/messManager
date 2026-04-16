import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-green-50/50 to-white overflow-hidden flex flex-col md:flex-row items-center justify-between px-8 py-20 min-h-[calc(100vh-80px)] font-sans">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-200/50 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl opacity-50"></div>

      <div className="relative z-10 md:w-1/2 md:pr-12 lg:pr-24 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          MessManager v2.0 is here
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Manage Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
            Mess Costs
          </span>{" "}
          <br className="hidden md:block" />
          Smartly
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed">
          Automatic meal calculation, expense tracking, and transparent billing
          for university students in Bangladesh.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center transition-all hover:shadow-lg hover:-translate-y-1"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 border border-gray-200 rounded-xl flex items-center justify-center transition-all hover:border-green-600 hover:text-green-600"
          >
            Sign In
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Free for
            students
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> No hidden
            charges
          </div>
        </div>
      </div>

      <div className="relative z-10 md:w-1/2 mt-16 md:mt-0">
        <div className="relative rounded-2xl p-2 bg-gradient-to-tr from-green-100 to-white shadow-2xl transform transition hover:scale-[1.02] duration-500">
          <img
            src="https://www.mealpe.app/UseCaseImages/hostel%20mess.webp"
            alt="Students eating"
            className="rounded-xl w-full h-auto object-cover max-h-[500px]"
          />
          {/* Floating review card */}
          <div
            className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-800">
                1K+
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Happy Users</p>
              <p className="text-xs text-gray-500">Across Bangladesh</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
