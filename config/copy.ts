// By Mosaic — marketing copy (verbatim from bymosaic.com where quoted)
// Long-form About/Services paragraphs are re-captured exactly in their own steps.

// Real, attributed testimonials (verbatim fragments from bymosaic.com).
export const TESTIMONIALS = [
  {
    quote: "Our wedding would not have happened if it wasn't for Kristina.",
    name: "Lauren & Brendan",
    detail: "Arcadia, California",
  },
  {
    quote: "We were both able to be present on our day because Kristina and team handled everything!",
    name: "Samantha & Luis",
    detail: "Rome, Italy",
  },
  {
    quote: "I couldn't have picked a better company to help with my proposal.",
    name: "Francisco & Jocelyne",
    detail: "Santa Monica, California",
  },
] as const;

// Factual trust stats (no invented numbers — all sourced from the About page).
export const PROOF_STATS = [
  { value: "2012", label: "Planning since" },
  { value: "Est. 2022", label: "By Mosaic" },
  { value: "LA → Rome", label: "Weddings from" },
  { value: "One/day", label: "Events booked" },
] as const;

export const HOME = {
  // §1 Hero (video)
  heroBrand: "By Mosaic",
  heroBrandSub: "Events",
  heroEst: "Est 2022",
  heroEyebrow: "Los Angeles-based wedding & social event planner",

  // §2 Brand intro
  introTitle: "Crafting events as unique as mosaics",
  introQuote: "Every celebration is a masterpiece in the making.",
  introBody:
    "Just like a mosaic, every detail—big or small—comes together to create something truly special. With a personal touch and heartfelt dedication, I craft events as unique and beautiful as the people behind them. My goal is to bring your vision, personality, and story to life, turning your special moments into memories you'll cherish forever.",
  introCta: "View the services",

  // §3 "Creating mosaic events since 2022" collage
  collageCaptionLeft: "Los Angeles-based event planner",
  collageCaptionRight: "Creating mosaic events since 2022",

  // §4 Portfolio — living mosaics
  portfolioTitle: "Events are living mosaics",
  portfolioBody:
    "Your event should reflect your unique story and style, and I'd be honored to be part of yours. Browse through the events and weddings I've brought to life—you might just find some inspiration for your own celebration!",
  portfolioCta: "Browse the portfolio",

  // §6 Meet the Planner
  plannerEyebrow: "Meet the Planner",
  plannerName: "Kristina Luu",
  plannerBody:
    "As the owner and lead planner, my greatest passion is creating experiences that bring people together to celebrate life's most meaningful moments. Planning is my love language, and I pour my heart into every event because it's not just about the celebration—it's about telling your story. I take the time to truly listen, collaborate, and understand your vision, ensuring every detail reflects your unique personality and what matters most to you. I can't wait to connect and bring your event to life!",
  plannerCta: "Get to know me",

  // §7 Testimonial
  testimonialQuote: "We were both able to be present on our day",
  testimonialAttribution: "Samantha and Luis",

  // §8 Closing CTA
  closingEyebrow: "Ready to get started?",
  closingTitle: "Let's create your masterpiece",
  closingBody:
    "Your event should feel like you, which is why I take a personalized approach to planning. Whether you're celebrating a birthday, wedding, baby shower, anniversary, or another meaningful milestone, my goal is to create an experience that reflects your unique style and story. Together, we'll craft unforgettable moments, weaving thoughtful details into a masterpiece you'll cherish forever. Schedule a free 15 minute consultation, and let's start bringing your vision to life!",
  closingCta: "Schedule a consultation",
} as const;

// About page — verbatim from /about, structured to mirror the original layout
export const ABOUT = {
  // Section 1 — image left, text right
  s1Eyebrow: "I do it for..",
  s1Title: "The love of bringing people together",
  s1Body:
    "Life's most important moments deserve to be celebrated in style and surrounded by the people you love. A truly memorable event isn't just beautiful — it's thoughtfully designed to create an exceptional experience for you and your guests. You deserve to savor every moment, and I'm here to ensure it all comes together seamlessly. Hosting with care and intention is at the heart of what I do.",

  // Section 2 — full-bleed dark band
  s2Title: "Personalized service, heartfelt dedication",
  s2Sub:
    "I'm here to ensure every detail of your event is crafted with care and intention, so you can relax and fully enjoy each moment.",
  s2Cta: "Begin your journey",

  // Section 3 — "Hi, I'm Kristina!"
  greeting: "Hi, I'm Kristina!",
  kristinaIntro:
    "I'm a wedding and social event planner based in Los Angeles, with a love for lists and all things organized.",
  story1:
    "My love for event planning began in 2012 while volunteering for a nonprofit, where I discovered my passion for bringing people together through meaningful experiences. After gaining hands-on experience in catering and working alongside other planners, I launched By Mosaic Events in 2022 to create celebrations that feel personal, intentional, and uniquely yours.",
  story2:
    "Originally from Texas, I now call Los Angeles home with my husband, our daughter, Aria, and our goldendoodle, Sadie. When I'm not planning events, you can usually find me hosting one of my own — because bringing people together has always been what I love most.",
  philosophy:
    "For me, event planning is about more than logistics; it's about creating moments you can truly savor. My goal is to make your celebration seamless and stress-free, so you can be fully present in the memories you're making.",
  signoff: "Xoxo, Kristina",

  // Section 4 — testimonial band
  testimonialQuote: "Our wedding would not have happened if it wasn't for Kristina.",
  testimonialAttribution: "Lauren and Brendan",
  testimonialCta: "Browse the portfolio",
} as const;

// Section 5 — three "explore" cards on sage (images match bymosaic.com/about)
export const ABOUT_EXPLORE = [
  { label: "Let's be friends on Instagram", href: "https://www.instagram.com/bymosaicevents/", image: "/photos/kg003815.jpg", external: true },
  { label: "Inquire with Kristina", href: "/contact", image: "/photos/kristina_luu3468.jpg", external: false },
] as const;

// Three services (verbatim descriptions from /services)
// `summary` = short version for Home teaser; `full` = verbatim long copy for the Services page.
export const SERVICES = [
  {
    slug: "full-service-wedding-planning",
    name: "Full-Service Wedding Planning",
    label: "Full-Service Wedding Planning",
    summary:
      "From the initial concept and design to bringing it to life on your wedding day, I will handle every aspect of the planning process.",
    full:
      "This all-inclusive service is designed to bring your wedding to life from start to finish. From budget management and timeline creation to thoughtful décor and design details, every element is thoughtfully planned and executed to create a seamless, beautiful, and stress-free wedding experience.",
    bestFor: "Couples who want a true partner from day one — hands-off, concept to wedding day.",
    included: [
      "Unlimited planning support & communication throughout",
      "Full design & styling concept",
      "Vendor sourcing, referrals & contract review",
      "Budget creation & management",
      "Detailed timeline & floor-plan development",
      "Guest logistics — seating, accommodations & transport guidance",
      "Rehearsal coordination",
      "Full wedding-day management",
    ],
    investment: "Starting at $6,000",
    timeline: "Best booked 8–16 months before the wedding.",
    image: "/photos/samantha_and_luis-425.jpg",
  },
  {
    slug: "partial-wedding-planning",
    name: "Partial Wedding Planning",
    label: "Partial Wedding Planning",
    summary:
      "Perfect for couples who want to take the lead on planning while having a trusted partner by your side.",
    full:
      "Perfect for couples who want to take the lead on planning while having a trusted partner by your side. With guidance, organization, and creative support along the way, I'll help bring your wedding vision to life.",
    bestFor: "Couples planning it themselves who want expert guidance and a pro to run the wedding day.",
    included: [
      "Ongoing guidance & consultation throughout the planning process",
      "Vendor referrals/recommendations & contract review",
      "Venue walk-through to assist with the planning of the event space and logistics",
      "Vendor coordination of all of the details for your big day",
      "Rehearsal coordination",
      "Full wedding-day management",
    ],
    investment: "Starting at $4,000",
    timeline: "Best booked 6–12 months before the wedding.",
    image: "/photos/280064311.jpg",
  },
  {
    slug: "event-management",
    name: "Event Management (Day-of Coordination)",
    label: 'Event Management — sometimes called "Day of Coordination"',
    summary:
      "Perfect for clients who have handled the majority of the planning but want professional support to oversee the logistics and final details.",
    full:
      "Perfect for clients who have handled the majority of the planning but want professional support to oversee the logistics and final details. Starting 60 days before your event, I'll take the lead to ensure every element comes together seamlessly.",
    bestFor: "Couples who've done the planning and want a pro to run the day flawlessly.",
    included: [
      "Planning handoff starting ~60 days before",
      "Final-weeks vendor confirmation & communication",
      "Detailed day-of timeline",
      "Floor-plan & layout review",
      "Rehearsal coordination",
      "Full day-of management + setup/teardown oversight with assistant",
      "Single point of contact for all vendors on the day",
    ],
    investment: "Starting at $2,200",
    timeline: "Best booked 4–12 months prior to your event date.",
    image: "/photos/l_and_b-396.jpg",
  },
  {
    slug: "social-event-planning",
    name: "Social Event Planning",
    label: "Social Event Planning",
    summary:
      "This package is tailored to meet your event needs because no two celebrations are the same.",
    full:
      "Similar to the Full-Service Wedding Planning package, but designed for private events like birthdays, proposals, and any other special occasion you envision. This package is tailored to meet your event needs because no two celebrations are the same.",
    bestFor: "Birthdays, proposals, showers, dinner parties & milestone celebrations.",
    included: [
      "Custom scope — planning, design, and/or coordination",
      "Concept & design direction",
      "Vendor sourcing & coordination",
      "Timeline & logistics",
      "On-site event management",
    ],
    investment: "Custom quote — tailored to each celebration",
    timeline: "For birthdays, proposals, showers, and special occasions.",
    image: "/photos/kristina_luu3579.jpg",
  },
] as const;

// Services page surround copy (verbatim from /services)
export const SERVICES_PAGE = {
  heroTitle: "Let's create your mosaic event",
  heroTagline:
    "Whether you're celebrating a birthday, wedding, baby shower, anniversary, or another special milestone, I'm here to bring your event to life. With thoughtful details, creative design, and a genuine passion for bringing people together, I create meaningful celebrations that feel uniquely yours.",
  effortlessEyebrow: "Planning an event?",
  title: "Let's make it effortless",
  intro:
    "Whether you're saying “I do” or hosting an intimate dinner party, planning should be exciting — not overwhelming. That's where I come in. I take the stress off your plate by understanding your vision and handling the details so everything runs smoothly. All you have to do is show up, be present, and enjoy every moment with your loved ones. Let's bring your celebration to life — beautifully and effortlessly.",
  effortlessCta: "Begin your journey",
  servicesHeader: "My Services",
  faqHeader: "FAQs",
  testimonialQuote: "Never a moment in which I had to panic about the details.",
  testimonialBody:
    "Kristina is a phenomenal event planner and always ensures that the wedding day you have is everything you could have dreamed and envisioned.",
  testimonialAttribution: "Abigail and Caio",
  ctaTitle: "Let's bring your event to life",
  ctaBody:
    "Expect personalized attention, thoughtful planning, and a stress-free celebration. Reach out today — I'd love to help bring your dream event to life!",
  cta: "Schedule your consultation",
} as const;

export const SERVICES_FAQ = [
  {
    q: "Why should I hire an event planner?",
    a: "It's simple — planners take the stress out of the entire planning process. By working with a planner, you not only save time and money but also gain an expert to navigate the complexities of vendor coordination, logistics, and design. Let me handle the details, so you can focus on what matters most.",
  },
  {
    q: "How far in advance should we book?",
    a: "For full-service wedding planning, 8–16 months before the wedding to allow enough time for planning, vendor selection, and ensuring all the details are covered. Booking early also helps secure top vendors and venues! For event management, between 4–12 months prior to the event date.",
  },
  {
    q: "Do you travel outside the California area?",
    a: "While most of our events are in Southern California, we have had the pleasure of planning events across the country and abroad in Rome, Texas, and the DC/Maryland area. We got you covered no matter where it may be.",
  },
  {
    q: "Do you take on more than one event per day?",
    a: "We only take on one event per day. We believe in fully dedicating our time and attention to you, especially during the week of your event, whether it's for the rehearsal or helping you prepare for a seamless celebration.",
  },
] as const;

// Portfolio header (verbatim from /portfolio)
export const PORTFOLIO_HEADER = {
  eyebrow: "Featured Moments & Celebrations",
  intro: "Where every event is carefully curated and flawlessly executed. Explore our featured events.",
} as const;

// Featured portfolio events — couple, location, type, verbatim caption, full gallery,
// and vendor team, all taken directly from bymosaic.com/portfolio.
export const PORTFOLIO = [
  {
    slug: "samantha-luis-rome",
    couple: "Samantha & Luis",
    location: "Rome, Italy",
    type: "Wedding",
    initials: "S+L",
    caption:
      "A dream destination wedding brought to life. S + L chose to say “Ti amo” where the sky meets the city, with the eternal beauty of Rome—and their beloved dog—by their side. From the stunning views to the thoughtfully curated details, their celebration was elegant, heartfelt, and truly unforgettable. This was my first destination wedding, and I can only hope it’s the first of many!",
    cover: "/photos/samantha_and_luis-386.jpg",
    gallery: [
      "/photos/samantha_and_luis-386.jpg",
      "/photos/samantha_and_luis-202.jpg",
      "/photos/samantha_and_luis-143.jpg",
      "/photos/samantha_and_luis-296.jpg",
      "/photos/samantha_and_luis-427.jpg",
      "/photos/samantha_and_luis-169.jpg",
      "/photos/samantha_and_luis-448.jpg",
      "/photos/samantha_and_luis-418.jpg",
      "/photos/samantha_and_luis-460.jpg",
      "/photos/samantha_and_luis-013.jpg",
      "/photos/samantha_and_luis-487.jpg",
      "/photos/samantha_and_luis-506.jpg",
    ],
    vendors: [
      "Villa Miani",
      "Alberto Cosenza Photography",
      "Floral Studio M",
      "DJJezzyB",
      "Music Wedding Rome",
      "Relais Le Jardin",
      "Tecnoservice",
      "Grassini Bus",
    ],
  },
  {
    slug: "lauren-brendan-arcadia",
    couple: "Lauren & Brendan",
    location: "Arcadia, California",
    type: "Wedding",
    initials: "L+B",
    caption:
      "Santa Anita Park holds a special place in Lauren’s heart. As a child, she spent countless days at the racetrack with her grandpa, sharing in his love for the sport. Her favorite part? Picking horses for him based on the “most important” stats—like the coolest names or the prettiest saddle towel colors—all while savoring the iconic hand-carved turkey sandwiches (still available today). And in a place filled with so much nostalgia and cherished memories, she married her best friend.",
    cover: "/photos/l_and_b-377.jpg",
    gallery: [
      "/photos/l_and_b-377.jpg",
      "/photos/l_and_b-20.jpg",
      "/photos/l_and_b-393.jpg",
      "/photos/l_and_b-367.jpg",
      "/photos/l_and_b-251_1.jpg",
      "/photos/l_and_b-387.jpg",
      "/photos/l_and_b-396.jpg",
      "/photos/l_and_b-447.jpg",
      "/photos/l_and_b-394.jpg",
    ],
    vendors: [
      "Santa Anita Park",
      "Makito Umekita Photography",
      "Eveni Floral Design",
      "DJ Rose",
      "Luong Lasting Beauty",
      "Veronique Bridal",
      "Stay Lit Photobooth",
    ],
  },
  {
    slug: "abigail-caio-dallas",
    couple: "Abigail & Caio",
    location: "Dallas, Texas",
    type: "Wedding",
    initials: "A+C",
    caption:
      "Getting to travel back to my home state to manage this wedding was a full-circle moment for me. This summer wedding was vibrant and full of love, with every detail thoughtfully curated to reflect the couple’s joyful spirit. From the colorful florals to the heartfelt vows, the entire day felt like pure magic. It was an honor to bring their vision to life and celebrate in a place that holds so much meaning for me!",
    cover: "/photos/280064311.jpg",
    gallery: [
      "/photos/280064311.jpg",
      "/photos/280063808.jpg",
      "/photos/280064140.jpg",
      "/photos/280064253.jpg",
      "/photos/280064163.jpg",
      "/photos/280064243.jpg",
    ],
    vendors: ["W Dallas", "Cody Kurtz Photography", "Blushington Blooms"],
  },
  {
    slug: "olivia-tj-alexandria",
    couple: "Olivia & TJ",
    location: "Alexandria, Virginia",
    type: "Wedding",
    initials: "O+T",
    caption:
      "This multicultural wedding was an unforgettable celebration of love, traditions, and joy. O + T had the time of their lives, dancing the night away, surrounded by their closest family and friends. Every moment was filled with high energy, laughter, and memories they’ll cherish forever!",
    cover: "/photos/10.jpg",
    gallery: [
      "/photos/10.jpg",
      "/photos/i_do.jpg",
      "/photos/1.jpg",
      "/photos/bridal_bouquet.jpg",
      "/photos/9.jpg",
      "/photos/7.jpg",
      "/photos/5.jpg",
      "/photos/12.jpg",
      "/photos/11.jpg",
    ],
    vendors: [
      "Woodlawn",
      "Luck + Love Photography",
      "Rouge Catering",
      "Rocking Bird Flower Co",
      "Iron and Ivy Films",
      "Yisell Hair & Makeup",
      "Shutterbooth",
    ],
  },
  {
    slug: "julie-jorge-malibu",
    couple: "Julie & Jorge",
    location: "Malibu, California",
    type: "Proposal",
    initials: "J+J",
    caption:
      "This proposal holds a special place in my heart because Julie is a dear friend I met years ago while working together at a catering company in DC. Having the honor of helping plan this moment for her was so special. When her fiancé reached out to me, I couldn’t have been more excited—and truly grateful—to be part of their journey!",
    cover: "/photos/ldphotography75.jpg",
    gallery: [
      "/photos/ldphotography75.jpg",
      "/photos/ldphotography32.jpg",
      "/photos/ldphotography38.jpg",
      "/photos/ldphotography219.jpg",
      "/photos/ldphotography30.jpg",
      "/photos/ldphotography65.jpg",
      "/photos/ldphotography36.jpg",
    ],
    vendors: ["Lauren Dinh Photography", "Lady & Larder"],
  },
  {
    slug: "rhiannon-maddie-la",
    couple: "Rhiannon & Maddie",
    location: "Los Angeles, California",
    type: "Quinceañera",
    initials: "R+M",
    caption:
      "This event was originally set for 2020, but as we all know, plans had to change—so 2022 it was! A lot can happen in two years, and what was once meant to be a joint quinceañera for these sisters evolved into a graduation/ quinceañera celebration. It was a beautiful day filled with so much love, proving that no matter the timing, milestones are always worth celebrating!",
    cover: "/photos/nnn_5412.jpg",
    gallery: [
      "/photos/nnn_5412.jpg",
      "/photos/nnn_4788.jpg",
      "/photos/nnn_7921.jpg",
      "/photos/nnn_6972.jpg",
      "/photos/nnn_5338.jpg",
      "/photos/nnn_4819.jpg",
      "/photos/nnn_6783.jpg",
      "/photos/nnn_5502.jpg",
      "/photos/nnn_4896.jpg",
    ],
    vendors: [
      "Smogshoppe",
      "Blue 22 Photography",
      "White Studio Project",
      "Guelaguetza",
      "White Label Valet",
      "Tempoe Entertainment",
    ],
  },
] as const;
