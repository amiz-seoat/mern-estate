import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaHandshake,
  FaShieldAlt,
  FaUsers,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import useDocumentTitle from "../hooks/useDocumentTitle";

const VALUES = [
  {
    icon: FaShieldAlt,
    title: "Trust & Transparency",
    description:
      "We believe in clear pricing, honest communication, and no hidden fees. Every transaction is handled with full transparency.",
  },
  {
    icon: FaHandshake,
    title: "Expert Guidance",
    description:
      "Our experienced agents bring deep expertise in the local market, guiding you every step of the way toward your dream property.",
  },
  {
    icon: FaUsers,
    title: "Customer First",
    description:
      "Real estate is more than transactions — it's about building lasting relationships and turning your goals into reality.",
  },
];

export default function About() {
  useDocumentTitle("About Us");
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-estate-950 via-estate-900 to-estate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-estate-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-gold-400 text-sm font-medium mb-6">
            <FaHome className="h-3.5 w-3.5" />
            About AmizEstate
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight animate-fade-in-up">
            Your Trusted Partner
            <span className="block text-gold-400 mt-1">in Real Estate</span>
          </h1>
          <p className="text-estate-200 text-lg mt-6 leading-relaxed max-w-2xl mx-auto">
            We help clients find the perfect home or property investment with
            confidence. Whether you&apos;re buying, selling, or renting — we
            make real estate simple.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            At AmizEstate, we help clients find the perfect home or property
            investment with confidence. Our team brings deep expertise in the
            local market and a commitment to exceptional service. Whether
            you&apos;re buying, selling, or renting, we guide you every step of
            the way.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We provide a user-friendly platform where buyers, sellers, and
            renters can easily connect, explore listings, and make informed
            property decisions. We aim to simplify the real estate process
            through accessible tools, clear information, and expert support.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 text-center">
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((value, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-estate-50 dark:bg-estate-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <value.icon
                  className="h-5 w-5 text-estate-700"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-estate-50 dark:bg-estate-950 border-t border-estate-100 dark:border-estate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            Browse thousands of listings and connect with trusted agents today.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-estate-800 hover:bg-estate-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-estate-800/20 hover:shadow-xl"
          >
            <FaSearch className="h-4 w-4" />
            Browse Properties
            <FaArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
