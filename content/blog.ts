// By Mosaic — "Wedding Wisdom" blog content (verbatim from bymosaic.com/blog)

export interface BlogSection {
  heading: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string; // ISO date
  excerpt: string;
  intro?: string;
  sections: BlogSection[];
  closing: string;
  coverImage: string;
}

export const AUTHOR_BIO =
  "I'm a wedding and social event planner based in Los Angeles. In my Wedding Wisdom blog, I share expert tips, creative ideas, and insider advice to help you plan not just your wedding, but any special event with confidence and ease.";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "5-things-to-consider-when-choosing-your-wedding-venue",
    title: "5 things to consider when choosing your wedding venue",
    category: "Wedding Wisdom",
    author: "Kristina",
    publishedAt: "2025-01-31",
    excerpt:
      "From capacity and ambiance to cost and flexibility — the five things every couple should weigh before booking a wedding venue.",
    coverImage: "/photos/l_and_b-168.jpg",
    sections: [
      {
        heading: "1) Capacity & Layout",
        body: "Start with your guest list to determine the capacity you'll need. Choose a venue that fits your guests comfortably and offers a flexible layout. Think like a guest — consider how the space flows from ceremony to reception to ensure seamless transitions. Also request floor plans from the venue to help visualize the event flow and explore layout options.",
      },
      {
        heading: "2) Ambiance & Aesthetic",
        body: "Choose a venue with an ambiance and aesthetic that aligns with your theme and vision. From architecture to lighting, the right venue will set the tone and elevate the atmosphere — whether you're dreaming of elegance, modern styles, or rustic charm. Don't forget to browse the venue's website or Instagram to see photos and videos from past weddings for inspiration!",
      },
      {
        heading: "3) Location",
        body: "Location and accessibility is key! Choose a venue that's accessible for your guests. For local weddings, ensure it's within a reasonable distance with convenient parking. For destination weddings, prioritize proximity to airports and hotels. Don't overlook the safety and charm of the neighborhood — it sets the tone for your guests' experience. Include clear directions and transportation details on your invitations and event website.",
      },
      {
        heading: "4) Services & Amenities",
        body: "Find out what amenities and services are included with the venue rental. Key considerations include audio-visual equipment, catering services, furniture and decor, and staffing. Always ask for a detailed list of what's included in the venue package to avoid hidden costs or last-minute surprises.",
      },
      {
        heading: "5) Cost & Flexibility",
        body: "Ensure the venue fits your budget while offering good value. Compare pricing, what's included, and flexibility with vendors and packages. Sometimes, a slightly higher cost provides better overall value. Always review the contract — know deposit schedules, cancellation policies, and extra fees.",
      },
    ],
    closing: "Above all, enjoy the venue hunt — it's one of the most exciting parts of planning!",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
