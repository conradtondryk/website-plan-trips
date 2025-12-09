import Link from "next/link";
import { WatercolorBackground } from "@/components/layout/WatercolorBackground";
import { Header } from "@/components/layout/Header";

export default function TripNotFound() {
  return (
    <WatercolorBackground>
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-watercolor-coral/10 flex items-center justify-center">
            <span className="text-5xl">🗺️</span>
          </div>

          <h1 className="font-display text-4xl text-ink-dark mb-4">
            Trip Not Found
          </h1>

          <p className="text-ink-medium mb-8">
            This trip link has expired or doesn&apos;t exist. Trip links are valid
            for 30 days after creation.
          </p>

          <Link
            href="/"
            className="btn-watercolor inline-block px-8"
          >
            Plan a New Trip
          </Link>
        </div>
      </main>
    </WatercolorBackground>
  );
}
