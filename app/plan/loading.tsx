import { WatercolorBackground } from "@/components/layout/WatercolorBackground";
import { Header } from "@/components/layout/Header";

export default function PlanLoading() {
  return (
    <WatercolorBackground>
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Map Skeleton */}
        <div className="mb-6 h-[300px] md:h-[400px] skeleton-watercolor rounded-xl" />

        {/* Trip Info Skeleton */}
        <div className="mb-6 space-y-3">
          <div className="h-10 w-3/4 skeleton-watercolor rounded-lg" />
          <div className="flex gap-4">
            <div className="h-5 w-32 skeleton-watercolor rounded" />
            <div className="h-5 w-40 skeleton-watercolor rounded" />
            <div className="h-5 w-24 skeleton-watercolor rounded" />
          </div>
        </div>

        {/* Day Tabs Skeleton */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-24 skeleton-watercolor rounded-lg" />
          ))}
        </div>

        {/* Timeline Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-watercolor p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-20 skeleton-watercolor rounded" />
              </div>
              <div className="h-7 w-2/3 skeleton-watercolor rounded" />
              <div className="h-4 w-full skeleton-watercolor rounded" />
              <div className="flex justify-between">
                <div className="h-6 w-24 skeleton-watercolor rounded-full" />
                <div className="h-4 w-12 skeleton-watercolor rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </WatercolorBackground>
  );
}
