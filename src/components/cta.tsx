"use client";

import { Button } from "@/components/ui/button";
import { BadgeDollarSign, ArrowRight, Gift } from "lucide-react";

export function CTA() {
  return (
    <section className="py-16 relative overflow-hidden w-full">
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-grid-white/5 -z-10" />

      {/* Purple gradient blob */}
      <div className="absolute top-0 left-1/4 -z-10">
        <div className="h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-purple-600/20 to-transparent blur-3xl" />
      </div>

      {/* Blue gradient blob */}
      <div className="absolute bottom-0 right-1/4 -z-10">
        <div className="h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-blue-600/20 to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40 border border-white/10 backdrop-blur-sm p-8 md:p-12 lg:p-16">
          {/* Inner shine effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
          <div className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to Experience Premium Digital Products?
              </h2>
              <p className="text-muted-foreground">
                Join thousands of satisfied customers enjoying premium digital
                services at unbeatable prices. Get started today!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity btn-hover-effect"
              >
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="btn-hover-effect">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
