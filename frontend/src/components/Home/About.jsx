import { LineChart, Receipt, Utensils } from "lucide-react";

const About = () => {
  const features = [
    {
      title: "Meal Tracking",
      description:
        "Easily track your daily meals with our simple interface. Record breakfast, lunch, and dinner with just a few clicks.",
      icon: <Utensils className="w-7 h-7" />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      title: "Expense Management",
      description:
        "Keep track of all mess expenses including bazaar, gas, electricity, and other costs. Transparent and organized.",
      icon: <Receipt className="w-7 h-7" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Monthly Report",
      description:
        "Get detailed monthly reports with automatic bill calculation based on your meal count. Fair and accurate billing.",
      icon: <LineChart className="w-7 h-7" />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 px-8 bg-gray-50 font-sans text-center relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-20">
          <h2 className="text-sm font-bold tracking-widest text-green-600 uppercase mb-3">
            Features
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Everything You Need <br className="hidden md:block" /> to Manage
            Your Mess
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 text-left p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div
                className={`${feature.bgColor} ${feature.textColor} w-16 h-16 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
