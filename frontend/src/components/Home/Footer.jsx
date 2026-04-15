import { ChefHat, Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 font-sans text-gray-300">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-green-600 p-2 text-white rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white">
                Mess<span className="text-green-500">Manager</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              The smartest way to automate meal tracking and expense calculation
              for students and bachelor messes across Bangladesh.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#features"
                  className="text-sm font-medium hover:text-green-400 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium hover:text-green-400 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm font-medium hover:text-green-400 transition-colors"
                >
                  Create Mess
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-green-400 transition-colors"
                >
                  Login to Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-sm font-medium hover:text-green-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-medium hover:text-green-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-medium hover:text-green-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Support</h4>
            <ul className="space-y-4">
              <li className="flex items-center text-sm font-medium">
                <Mail className="w-4 h-4 mr-3 text-gray-500" />
                <a
                  href="mailto:hello@messmanager.com"
                  className="hover:text-green-400 transition-colors"
                >
                  hello@messmanager.com
                </a>
              </li>
              <li className="text-sm text-gray-400 font-medium">
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © 2026 MessManager. Made with ❤️ for varsity students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
