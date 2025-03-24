"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Heart, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 md:pb-24 lg:py-32 w-full">
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-grid-white/10 -z-10 h-screen" />
      <div className="absolute left-0 right-0 top-0 -z-10 h-screen bg-[linear-gradient(to_bottom,var(--gradient-foreground)_0%,transparent_100%)] pointer-events-none" />

      {/* Purple gradient blob */}
      <div className="absolute -top-40 right-0 -z-10 transform translate-x-1/2">
        <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-purple-600/20 to-transparent blur-3xl" />
      </div>

      {/* Blue gradient blob */}
      <div className="absolute -top-20 left-0 -z-10 transform -translate-x-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-blue-600/20 to-transparent blur-3xl" />
      </div>

      {/* Brand logos background with blur and animation - First set */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Netflix logo */}
          <div className="absolute top-[15%] left-[10%] opacity-40 animate-float-slow filter blur-[2px]">
            <Image
              src="/logos/netflix.png"
              alt="Netflix"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>

          {/* LinkedIn logo */}
          <div className="absolute top-[65%] left-[20%] opacity-40 animate-float filter blur-[2px]">
            <Image
              src="/logos/linkedin.png"
              alt="LinkedIn"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Spotify logo */}
          <div className="absolute top-[40%] right-[15%] opacity-40 animate-float-medium filter blur-[2px]">
            <Image
              src="/logos/spotify.png"
              alt="Spotify"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Second set of logos with different positions */}
          {/* Netflix logo - Second */}
          <div className="absolute top-[70%] right-[8%] opacity-30 animate-float-medium filter blur-[3px]">
            <Image
              src="/logos/netflix.png"
              alt="Netflix"
              width={180}
              height={90}
              className="object-contain"
            />
          </div>

          {/* LinkedIn logo - Second */}
          <div className="absolute top-[30%] left-[5%] opacity-30 animate-float-medium filter blur-[3px]">
            <Image
              src="/logos/linkedin.png"
              alt="LinkedIn"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Spotify logo - Second */}
          <div className="absolute top-[15%] right-[25%] opacity-30 animate-float-slow filter blur-[3px]">
            <Image
              src="/logos/spotify.png"
              alt="Spotify"
              width={110}
              height={110}
              className="object-contain"
            />
          </div>

          {/* Netflix logo - Third */}
          <div className="absolute top-[50%] left-[50%] opacity-25 animate-float filter blur-[3px]">
            <Image
              src="/logos/netflix.png"
              alt="Netflix"
              width={160}
              height={80}
              className="object-contain"
            />
          </div>

          {/* LinkedIn logo - Third */}
          <div className="absolute top-[20%] right-[40%] opacity-25 animate-float-slow filter blur-[3px]">
            <Image
              src="/logos/linkedin.png"
              alt="LinkedIn"
              width={90}
              height={90}
              className="object-contain"
            />
          </div>

          {/* Spotify logo - Third */}
          <div className="absolute top-[55%] left-[35%] opacity-25 animate-float-medium filter blur-[3px]">
            <Image
              src="/logos/spotify.png"
              alt="Spotify"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 text-sm text-white animate-fade-in">
              Premium Digital Products
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none animate-gradient-text">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-white to-blue-300 animate-gradient-fast">
                Your Gateway to Premium <br />
                Digital Experiences
              </span>
            </h1>
            <p
              className="mx-auto max-w-[700px] text-gray-400 md:text-xl animate-fade-up opacity-0"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              Access exclusive Netflix, Prime Video, LinkedIn Premium, and VPN
              subscriptions at unbeatable prices.
            </p>
          </div>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up opacity-0"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <Link href="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity btn-hover-effect relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x"></span>
                <span className="relative z-10">Browse Products</span>
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="btn-hover-effect border-purple-500/50 hover:border-purple-500/80 hover:bg-purple-500/10 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>

          {/* Stats Section with Animated Gradients */}
          <div
            className="mt-16 w-full animate-fade-up opacity-0"
            style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative flex flex-col items-center justify-center p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                  <div className="p-3 rounded-full bg-gradient-to-br from-purple-600/80 to-blue-600/80 mb-3 transform hover:scale-110 transition-transform duration-300 animate-pulse-slow">
                    <div className="text-white text-2xl">🏆</div>
                  </div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 animate-gradient-x">
                    10k+
                  </div>
                  <div className="text-gray-400">Happy Customers</div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative flex flex-col items-center justify-center p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                  <div
                    className="p-3 rounded-full bg-gradient-to-br from-blue-600/80 to-teal-600/80 mb-3 transform hover:scale-110 transition-transform duration-300 animate-pulse-slow"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="text-white text-2xl">❤️</div>
                  </div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300 animate-gradient-x">
                    99%
                  </div>
                  <div className="text-gray-400">Satisfaction</div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative flex flex-col items-center justify-center p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-white/5 hover:border-teal-500/30 transition-all duration-300">
                  <div
                    className="p-3 rounded-full bg-gradient-to-br from-teal-600/80 to-purple-600/80 mb-3 transform hover:scale-110 transition-transform duration-300 animate-pulse-slow"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <div className="text-white text-2xl">⏰</div>
                  </div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-300 animate-gradient-x">
                    24/7
                  </div>
                  <div className="text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
