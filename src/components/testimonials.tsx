"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/avatars/avatar-1.jpg",
    role: "Netflix Premium User",
    rating: 5,
    testimonial:
      "I've been using PrimeSpot for my streaming needs for over a year now. The service has been impeccable with zero downtime. Customer support is responsive and helpful when needed.",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/avatars/avatar-2.jpg",
    role: "VPN Subscriber",
    rating: 5,
    testimonial:
      "The NordVPN account I purchased has been a game-changer for my online security. Fast servers, reliable connection, and the price was unbeatable.",
  },
  {
    id: 3,
    name: "Jessica Smith",
    avatar: "/avatars/avatar-3.jpg",
    role: "LinkedIn Premium User",
    rating: 4,
    testimonial:
      "LinkedIn Premium through PrimeSpot saved me over 40% compared to regular prices. The account works flawlessly and I've been able to secure two job interviews already!",
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/avatars/avatar-4.jpg",
    role: "Prime Video User",
    rating: 5,
    testimonial:
      "Amazing service! My Prime Video account was delivered instantly, and I've been enjoying all the content without any issues. Will definitely purchase more subscriptions.",
  },
  {
    id: 5,
    name: "Emma Thompson",
    avatar: "/avatars/avatar-5.jpg",
    role: "Multiple Services User",
    rating: 5,
    testimonial:
      "I've purchased multiple accounts from PrimeSpot and the quality of service is consistent across all of them. The warranty policy gives me peace of mind, and the pricing is excellent.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 relative w-full">
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-background/80 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-purple-900/10 to-transparent -z-10"></div>

      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-block rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-4 py-1.5 text-sm text-purple-600 mb-4">
            Customer Reviews
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Trusted by thousands of customers worldwide for premium digital
            accounts.
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="md:basis-1/2 lg:basis-1/3 pl-4"
              >
                <Card className="h-full bg-card/30 backdrop-blur-sm border-border/40 hover:shadow-lg hover:shadow-purple-600/5 transition-all duration-300">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground flex-1 mb-4">
                      "{testimonial.testimonial}"
                    </p>
                    <div className="flex items-center mt-auto">
                      <Avatar className="h-10 w-10 mr-3 border-2 border-purple-600/20">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="mr-2 static transform-none" />
            <CarouselNext className="ml-2 static transform-none" />
          </div>
        </Carousel>

        <div className="flex justify-center items-center mt-12 gap-8 flex-wrap">
          <div className="flex items-center">
            <div className="text-4xl font-bold text-purple-600 mr-3">10k+</div>
            <div className="text-sm text-muted-foreground">
              Happy
              <br />
              Customers
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-border/40"></div>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-blue-600 mr-3">99%</div>
            <div className="text-sm text-muted-foreground">
              Satisfaction
              <br />
              Rate
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-border/40"></div>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-teal-600 mr-3">24/7</div>
            <div className="text-sm text-muted-foreground">
              Premium
              <br />
              Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
