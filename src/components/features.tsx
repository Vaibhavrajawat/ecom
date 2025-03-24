"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Zap, CreditCard, Clock, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Shield className="h-10 w-10 text-purple-600" />,
    title: "100% Secure",
    description:
      "All our accounts are legitimate and secure with 24/7 support in case of any issues.",
  },
  {
    icon: <Zap className="h-10 w-10 text-blue-600" />,
    title: "Instant Access",
    description:
      "Receive your account credentials instantly after purchase with our automated delivery system.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-teal-600" />,
    title: "Secure Payment",
    description:
      "Multiple secure payment options using Razorpay's industry-leading encryption protocols.",
  },
  {
    icon: <Clock className="h-10 w-10 text-amber-600" />,
    title: "Flexible Subscriptions",
    description:
      "Choose from monthly, quarterly, or annual subscriptions to suit your needs and budget.",
  },
  {
    icon: <RefreshCw className="h-10 w-10 text-green-600" />,
    title: "Warranty Included",
    description:
      "All accounts come with a warranty period. If any issues arise, we'll fix or replace your account.",
  },
  {
    icon: <Lock className="h-10 w-10 text-red-600" />,
    title: "Privacy Protected",
    description:
      "Your personal information is never shared with third parties and is protected by our privacy policy.",
  },
];

const faq = [
  {
    question: "Are these accounts legitimate?",
    answer:
      "Yes, all accounts are legitimate and obtained through official sources. We provide detailed instructions for usage and best practices to ensure your account remains active.",
  },
  {
    question: "How long will my account be valid?",
    answer:
      "Validity depends on the subscription plan you choose. We offer monthly, quarterly, and annual options for most services. Your account will remain active for the duration of your chosen plan.",
  },
  {
    question: "What happens if my account stops working?",
    answer:
      "All accounts come with a warranty. If your account stops working within the warranty period, we will replace it for free. Simply contact our 24/7 customer support.",
  },
  {
    question: "How will I receive my account details?",
    answer:
      "Account details are delivered instantly to your email after purchase. You'll also be able to access them in your account dashboard on our website.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 7-day money-back guarantee if you're not satisfied with your purchase. However, we cannot issue refunds if the account has been modified or credentials have been changed.",
  },
];

export function Features() {
  return (
    <section className="py-16 relative w-full">
      {/* Gradient background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-background/95 to-background/90"></div>

      {/* Gradient blob */}
      <div className="absolute bottom-0 right-0 -z-10 transform translate-x-1/3 translate-y-1/3">
        <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-600/10 to-transparent blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-block rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-4 py-1.5 text-sm text-purple-600 mb-4">
            Why Choose Us
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Premium Benefits for Premium Customers
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            We provide the best digital products with exceptional service and
            security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-600/5 transition-all duration-300"
            >
              <div className="mb-4 rounded-full p-3 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <div className="inline-block rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-4 py-1.5 text-sm text-purple-600 mb-4">
              FAQ
            </div>
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mb-6">
              Get answers to the most common questions about our digital
              products and services.
            </p>
            <Accordion type="single" collapsible className="w-full">
              {faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-blue-600/20 to-teal-600/20 animate-gradient-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="backdrop-blur-lg bg-background/30 p-8 rounded-lg border border-white/10 w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-2">
                    Experience Premium Digital Services
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of satisfied customers who trust PrimeSpot
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5">
                      <div className="text-3xl font-bold text-purple-600">
                        10k+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Happy Customers
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5">
                      <div className="text-3xl font-bold text-blue-600">
                        99%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Satisfaction
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5">
                      <div className="text-3xl font-bold text-teal-600">
                        24/7
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Support
                      </div>
                    </div>
                  </div>
                  <div className="w-full max-w-xl mx-auto text-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity mt-6"
                    >
                      Get Started Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
