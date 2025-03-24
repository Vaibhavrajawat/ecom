import ProductShowcase from "./components/ProductShowcase";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />

        <ProductShowcase />

        <FeaturesSection />

        <TestimonialsSection />

        <StatsSection />

        <FAQ />
      </main>
    </div>
  );
}
