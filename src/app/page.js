"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  PieChart,
  Users,
  ClipboardList,
  Bell,
  ArrowRight,
  Download,
} from "lucide-react";
import Link from "next/link";

const MedPulsLogo = () => (
  <div className="flex items-center text-emerald-600">
    <Heart className="w-8 h-8 fill-emerald-500 stroke-2" />
    <span className="text-2xl font-bold">MedPuls</span>
  </div>
);

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -inset-[10px] opacity-50">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
    </div>
  </div>
);

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      title: "Smart Patient Management",
      description:
        "Revolutionary patient tracking with AI-powered insights and real-time updates.",
      icon: Users,
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      title: "Digital Prescriptions",
      description:
        "Generate and manage digital prescriptions with our intelligent system.",
      icon: ClipboardList,
      gradient: "from-teal-400 to-emerald-500",
    },
    {
      title: "Advanced Analytics",
      description:
        "Transform your practice with powerful insights and predictive analytics.",
      icon: PieChart,
      gradient: "from-emerald-500 to-green-500",
    },
    {
      title: "Real-time Notifications",
      description: "Stay updated with intelligent alerts and reminders.",
      icon: Bell,
      gradient: "from-green-400 to-emerald-500",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "50K+", label: "Active Users" },
    { value: "24/7", label: "Support" },
    { value: "128-bit", label: "Encryption" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <MedPulsLogo />

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Contact
              </a>
              <div className="flex gap-2 items-center">
                <Link
                  href="/login"
                  className="px-6 py-2 rounded-full font-semibold border border-emerald-600 text-emerald-600 relative overflow-hidden transition-colors duration-300 group hover:text-white"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 rounded-full font-semibold border border-emerald-600 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-emerald-50"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md">
            <div className="px-4 pt-2 pb-3 space-y-2">
              <a
                href="#features"
                className="block px-4 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg"
              >
                Features
              </a>
              <a
                href="#about"
                className="block px-4 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg"
              >
                About
              </a>
              <a
                href="#contact"
                className="block px-4 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg"
              >
                Contact
              </a>
              <Link
                href="/login"
                className="block w-full mt-4 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>
      <section className="relative min-h-screen flex items-center">
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-sm font-medium">
                Revolutionizing Healthcare Management
              </span>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Medical Practice with
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
                {" "}
                Intelligent Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Empower your healthcare facility with our state-of-the-art
              dashboard system. Experience seamless patient management, smart
              prescriptions, and real-time analytics.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={"/signup"}
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 rounded-full border-2 border-emerald-500 text-emerald-600 text-lg font-medium hover:bg-emerald-50 transition-all flex items-center justify-center">
                Download
                <Download className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience a complete suite of tools designed to streamline your
              medical practice
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group h-full">
                <div className="h-full relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <div
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <MedPulsLogo />
              <p className="mt-4 text-gray-600">
                Making healthcare management smarter and more efficient.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Connect
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            © {new Date().getFullYear()} MedPuls. All rights reserved.
          </div>
        </div>
      </footer>
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
