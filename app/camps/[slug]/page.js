import { notFound } from "next/navigation";
import { placeholderCamps } from "@/lib/camps";
import EventDetails from "@/components/event-details";
export const dynamicParams = false;
export function generateStaticParams() {
  return placeholderCamps.map((camp) => ({ slug: camp.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const camp = placeholderCamps.find((camp) => camp.slug === slug);
  return {
    title: camp
      ? `${camp.title} | Elevate Basketball`
      : "Event not found | Elevate Basketball",
    description: camp?.description,
  };
}
export default async function EventPage({ params }) {
  const { slug } = await params;
  const camp = placeholderCamps.find((camp) => camp.slug === slug);
  if (!camp) notFound();
  return <EventDetails camp={camp} />;
}
