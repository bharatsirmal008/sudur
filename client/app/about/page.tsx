"use client";

import React from "react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-6 py-20">

      {/* Page Title */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About Our Community
        </h1>
        <p className="text-lg text-gray-600">
          We are a group of passionate individuals working together
          to support society through education, health, agriculture,
          and youth leadership programs.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* Mission */}
        <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to create opportunities for underprivileged
            communities by organizing events, providing support,
            and building awareness programs that bring real change.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a society where every individual has access
            to basic needs, education, and opportunities to grow and succeed.
          </p>
        </div>

      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto mt-20 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Leadership Team</h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Founder Name</h3>
            <p className="text-gray-500">Founder & President</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Member Name</h3>
            <p className="text-gray-500">Vice President</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Member Name</h3>
            <p className="text-gray-500">Coordinator</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default About;
