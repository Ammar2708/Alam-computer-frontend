import React from "react";
import { Monitor, Cpu, ShieldCheck, Users, Award, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { externalLinkProps, storeContact } from "@/config/contact";

const About = () => {
  const stats = [
    { label: "Years Experience", value: "15+", icon: <Award className="w-5 h-5" /> },
    { label: "Products in Stock", value: "5000+", icon: <Cpu className="w-5 h-5" /> },
    { label: "Happy Clients", value: "10k+", icon: <Users className="w-5 h-5" /> },
    { label: "Service Centers", value: "2", icon: <Monitor className="w-5 h-5" /> },
  ];

  const features = [
    {
      title: "Genuine Parts",
      description: "We only source 100% original hardware from authorized distributors.",
      icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
    },
    {
      title: "Fast Delivery",
      description: "Quick shipping across Sharjah and the UAE for all computer components.",
      icon: <Truck className="w-8 h-8 text-red-600" />,
    },
    {
      title: "Expert Support",
      description: "Our technicians don't just sell; they understand the hardware inside out.",
      icon: <Cpu className="w-8 h-8 text-red-600" />,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-red-600 px-4 py-16 md:px-16 md:py-20">
        <div className="absolute top-0 right-0 opacity-10">
          <Cpu size={400} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            YOUR TRUSTED TECH <br /> PARTNER SINCE 2005
          </h1>
          <p className="text-lg md:text-xl text-red-100 max-w-2xl font-light">
            Alam Computer is Sharjah's leading destination for high-performance 
            laptops, custom PC builds, and essential networking peripherals. 
            We bridge the gap between complex technology and your needs.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto -mt-6 px-4">
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-2xl sm:p-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="flex justify-center text-red-600">{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{stat.value}</p>
              <p className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Empowering Sharjah's Digital Future
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Located in the heart of{" "}
                <a
                  href={storeContact.directionsHref}
                  className="font-semibold text-red-600 hover:text-red-700 hover:underline"
                  aria-label="Get directions to Industrial Area 3 on Google Maps"
                  {...externalLinkProps}
                >
                  Industrial Area 3
                </a>
                , Alam Computer started as 
                a small repair shop. Today, we have grown into a major hub for 
                individuals and businesses looking for reliable computing solutions.
              </p>
              <p>
                Whether you are a professional gamer looking for the latest RTX 
                GPUs, a student needing a budget-friendly laptop, or a company 
                setting up a server room, we have the inventory and the expertise 
                to support you.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="space-y-3">
                  <div className="p-2 bg-red-50 rounded-lg w-fit">{f.icon}</div>
                  <h4 className="font-bold text-gray-800">{f.title}</h4>
                  <p className="text-xs text-gray-500">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Image/Box */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-red-600/10 rounded-xl group-hover:bg-red-600/20 transition-all"></div>
            <div className="relative   bg-gray-200 aspect-video rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                <img src="/logo1.webp" alt="Store" />
               <Monitor size={100} className="text-gray-400 " />
              
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16 text-center px-4">
        <h3 className="text-white text-2xl md:text-3xl font-bold mb-6">
          Need a Custom Solution for your Business
        </h3>
        <Link
          to="/shop/contact"
          className="inline-flex rounded-full bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-red-900/20 transition-all hover:scale-105 hover:bg-red-700 sm:px-10 sm:text-base"
        >
          CONTACT OUR SALES TEAM
        </Link>
      </section>
    </div>
  );
};

export default About;
