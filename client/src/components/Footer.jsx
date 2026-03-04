import { Link } from "react-router-dom";
import { FaHome, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa6";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Browse Properties", to: "/search" },
  { label: "About Us", to: "/about" },
];

const ACCOUNT_LINKS = [
  { label: "Sign In", to: "/sign-in" },
  { label: "Create Account", to: "/sign-up" },
  { label: "My Profile", to: "/profile" },
];

const SOCIAL_LINKS = [
  { icon: FaInstagram, href: "https://www.instagram.com/amiz_778", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com/in/abduselam-dev", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-estate-950 text-estate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="bg-gold-400 p-2 rounded-lg group-hover:scale-105 transition-transform">
                <FaHome className="h-4 w-4 text-estate-950" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Amiz<span className="text-gold-400">Estate</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-estate-300 max-w-xs">
              Your trusted partner in finding the perfect property. We make
              buying, selling, and renting simple and transparent.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-estate-800/60 hover:bg-gold-400 flex items-center justify-center text-estate-300 hover:text-estate-950 transition-all duration-200"
                >
                  <s.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-estate-300 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-estate-300 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="h-3.5 w-3.5 text-gold-400 mt-0.5 shrink-0" />
                <span className="text-sm text-estate-300">
                  Addis Ababa, Ethiopia
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <FaPhone className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                <a
                  href="tel:+251920213573"
                  className="text-sm text-estate-300 hover:text-gold-400 transition-colors"
                >
                  +251920213573
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FaEnvelope className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                <a
                  href="mailto:abduselammiz6@gmail.com"
                  className="text-sm text-estate-300 hover:text-gold-400 transition-colors"
                >
                  abduselammiz6@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-estate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-estate-400">
            &copy; {new Date().getFullYear()} AmizEstate. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/about"
              className="text-xs text-estate-400 hover:text-estate-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-estate-700 text-xs">|</span>
            <Link
              to="/about"
              className="text-xs text-estate-400 hover:text-estate-200 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
