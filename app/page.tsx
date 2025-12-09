import { WatercolorBackground } from "@/components/layout/WatercolorBackground";
import { Header } from "@/components/layout/Header";
import { TripForm } from "@/components/input/TripForm";

export default function Home() {
  return (
    <WatercolorBackground>
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl md:text-6xl text-ink-dark mb-4">
              Start Your Adventure
            </h1>
            <p className="text-lg text-ink-medium max-w-md mx-auto">
              Let AI craft your perfect trip plan. Enter your destination and
              preferences, and we&apos;ll create a personalized itinerary just for
              you.
            </p>
          </div>

          {/* Trip Form Card */}
          <div className="card-watercolor">
            <TripForm />
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-watercolor-coral/10 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-display text-xl text-ink-dark mb-1">
                AI-Powered
              </h3>
              <p className="text-sm text-ink-medium">
                Smart recommendations tailored to your style
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-watercolor-gold/10 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-display text-xl text-ink-dark mb-1">
                Hidden Gems
              </h3>
              <p className="text-sm text-ink-medium">
                Discover highly-rated local favorites
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-watercolor-sky/10 flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="font-display text-xl text-ink-dark mb-1">
                Interactive Maps
              </h3>
              <p className="text-sm text-ink-medium">
                Visualize your journey on beautiful maps
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-ink-light text-sm">
        <p>Made with ❤️ for travelers everywhere</p>
      </footer>
    </WatercolorBackground>
  );
}
