import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSharedTrip } from "@/lib/kv";
import { SharedTripView } from "./SharedTripView";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for shared trips
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sharedTrip = await getSharedTrip(id);

  if (!sharedTrip) {
    return {
      title: "Trip Not Found - Tripper",
    };
  }

  return {
    title: `${sharedTrip.plan.tripName} - Tripper`,
    description: `Check out this trip plan for ${sharedTrip.plan.location.name}!`,
    openGraph: {
      title: sharedTrip.plan.tripName,
      description: `A ${sharedTrip.plan.days.length}-day trip to ${sharedTrip.plan.location.name}`,
      type: "website",
    },
  };
}

export default async function SharedTripPage({ params }: PageProps) {
  const { id } = await params;
  const sharedTrip = await getSharedTrip(id);

  if (!sharedTrip) {
    notFound();
  }

  return <SharedTripView sharedTrip={sharedTrip} />;
}
