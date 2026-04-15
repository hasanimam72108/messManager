const About = () => {
  return (
    <section
      id="features"
      className="py-24 px-8 bg-white font-sans text-center"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-16">
        Everything You Need to Manage Your Mess
      </h2>
      <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8 max-w-6xl mx-auto">
        {/* Feature 1 */}
        <div className="bg-white border text-left p-8 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="bg-green-100 text-green-600 w-12 h-12 flex items-center justify-center rounded-lg mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4 text-[#1a202c]">
            Meal Tracking
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Easily track your daily meals with our simple interface. Record
            breakfast, lunch, and dinner with just a few clicks.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white border text-left p-8 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="bg-green-100 text-green-600 w-12 h-12 flex items-center justify-center rounded-lg mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4 text-[#1a202c]">
            Expense Management
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Keep track of all mess expenses including bazaar, gas, electricity,
            and other costs. Transparent and organized.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white border text-left p-8 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="bg-green-100 text-green-600 w-12 h-12 flex items-center justify-center rounded-lg mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4 text-[#1a202c]">
            Monthly Report
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Get detailed monthly reports with automatic bill calculation based
            on your meal count. Fair and accurate billing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
