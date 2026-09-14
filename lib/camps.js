// Edit these cards freely. Live camps come from Supabase once configured.
export const placeholderCamps = [
  {
    id: "preview-1",
    slug: "discover-the-game",
    description:
      "Explore physical literacy through basketball: discovering movement skills and the joy of taking part. Full details of this event will be announced here.",
    title: "Discover the game",
    subtitle: "Discover movement through basketball.",
    tag: "PLAY & DISCOVER",
    tone: "peach-card",
  },
  {
    id: "preview-2",
    slug: "build-your-confidence",
    description:
      "Develop physical literacy through basketball, with a focus on feeling capable, making decisions and having the confidence to try. The programme and event details will be announced here.",
    title: "Build your confidence",
    subtitle: "Build confidence through movement and play.",
    tag: "LEARN & GROW",
    tone: "green-card",
  },
  {
    id: "preview-3",
    slug: "keep-the-fun-going",
    description:
      "Build a positive relationship with movement through basketball and shared play — the enjoyment and motivation at the heart of physical literacy. The full event programme will be announced here.",
    title: "Keep the fun going",
    subtitle: "Find the joy that keeps them moving.",
    tag: "CONNECT & PLAY",
    tone: "yellow-card",
  },
];
export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(value));
export const formatPrice = (pennies) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(pennies / 100);

export const campHref = (camp) =>
  camp.slug
    ? `/camps/${camp.slug}/`
    : `/camp/?id=${encodeURIComponent(camp.id)}`;
