"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  console.log("Page render");
  return (
    <div className="h-screen bg-gradient-to-b md:bg-gradient-to-r from-[#3A0909] to-black flex items-center justify-center px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full items-center gap-10">
        {/* Left Content */}
        <div className="text-white text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Play <span className="text-red-500">Chess</span> Like a Grandmaster
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-300">
            Challenge your mind with the best online chess experience. Play
            against AI or real players.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-center md:justify-start gap-4">
            <Link
              href="/play"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-lg transition"
            >
              Play Online
            </Link>

            <Link
              href="/playmachine"
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-semibold rounded-lg transition"
            >
              Play with Machine
            </Link>
            <Link
              href="/playfriend"
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold rounded-lg transition"
            >
              Play 2 members
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <div className="hidden md:block">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square mx-auto">
            <Image
              src="/game1.png"
              fill
              alt="Chess Game"
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
