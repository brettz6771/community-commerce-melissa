export interface EventItem {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  isFeatured?: boolean;
}

export interface BusinessItem {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  socials: { facebook?: string; instagram?: string; linkedin?: string };
  logo: string;
  image: string;
  badge: 'Founding Member' | 'Business Member' | 'Sponsor' | 'New Member';
  rating: number;
  featured?: boolean;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  business: string;
  bio: string;
  headshot: string;
  videoUrl?: string;
  funFact: string;
  email: string;
  phone: string;
  objectPosition?: string;
}

export interface FoundingMember {
  name: string;
  category: string;
  logo?: string;
  website?: string;
  logoText?: string;
  highlight?: string;
}

export interface SponsorshipTier {
  id: string;
  name: string;
  price: string;
  billing: string;
  color: string;
  popular?: boolean;
  benefits: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  author: string;
  summary: string;
  image: string;
  content: string;
}

// ----------------------------------------------------
// Mock Data for Community Commerce Melissa
// ----------------------------------------------------

export const MOCK_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    title: "Meet & Greet Networking Mixer",
    date: "2026-05-24",
    month: "MAY",
    day: "24",
    time: "6:00 PM - 8:00 PM",
    location: "Red Feather Golf & Social, Melissa TX",
    category: "Monthly Networking Mixers",
    description: "Join local business owners and leaders for an evening of structured networking, complimentary appetizers, and community building.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    isFeatured: true
  },
  {
    id: "evt-2",
    title: "Melissa Business Expo & Showcase",
    date: "2026-06-05",
    month: "JUN",
    day: "05",
    time: "4:00 PM - 8:00 PM",
    location: "Melissa Z-Plex Sports Center",
    category: "Business Expo",
    description: "The premier local showcase! Over 60 Melissa businesses presenting products, services, and live demonstrations to the community.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    isFeatured: true
  },
  {
    id: "evt-3",
    title: "Coffee & Connections Morning Briefing",
    date: "2026-06-18",
    month: "JUN",
    day: "18",
    time: "8:30 AM - 10:00 AM",
    location: "Daily Grind Coffee Shop, Melissa TX",
    category: "Coffee & Connections",
    description: "Start your morning with freshly brewed coffee and high-value conversations with fellow Melissa entrepreneurs.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    isFeatured: true
  },
  {
    id: "evt-4",
    title: "Lunch & Learn: Digital Marketing Tactics for 2026",
    date: "2026-07-08",
    month: "JUL",
    day: "08",
    time: "11:45 AM - 1:15 PM",
    location: "Melissa City Hall Community Room",
    category: "Lunch & Learns",
    description: "Learn practical SEO, social media strategies, and AI tools to convert local online searches into loyal customers.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "evt-5",
    title: "Women in Business Leadership Summit",
    date: "2026-07-22",
    month: "JUL",
    day: "22",
    time: "1:00 PM - 4:30 PM",
    location: "Landmark Event Center",
    category: "Women in Business",
    description: "Empowering female business founders in Melissa with inspiring keynote speakers, roundtable discussions, and executive mentorship.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "evt-6",
    title: "Young Professionals Sunset Social",
    date: "2026-08-12",
    month: "AUG",
    day: "12",
    time: "6:30 PM - 8:30 PM",
    location: "Melissa Town Center Lawn",
    category: "Young Professionals",
    description: "Casual evening event designed for next-generation business leaders and emerging entrepreneurs in North Texas.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800"
  }
];

export const MOCK_BUSINESSES: BusinessItem[] = [
  {
    id: "biz-1",
    name: "Melissa Family Dental & Orthodontics",
    category: "Health & Wellness",
    description: "Comprehensive family dental care, cosmetic dentistry, and clear aligner orthodontics in a state-of-the-art Melissa facility.",
    address: "2100 Fannin Rd, Suite 100, Melissa, TX",
    phone: "(972) 837-5500",
    website: "https://example.com/melissa-dental",
    socials: { facebook: "https://facebook.com", instagram: "https://instagram.com" },
    logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=600",
    badge: "Founding Member",
    rating: 5.0,
    featured: true
  },
  {
    id: "biz-2",
    name: "Red Feather Golf & Social Club",
    category: "Hospitality & Dining",
    description: "Premier private golf club and event lawn offering world-class dining, corporate events, and networking spaces.",
    address: "3400 Red Feather Way, Melissa, TX",
    phone: "(972) 837-1234",
    website: "https://example.com/red-feather",
    socials: { facebook: "https://facebook.com", linkedin: "https://linkedin.com" },
    logo: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=600",
    badge: "Sponsor",
    rating: 4.9,
    featured: true
  },
  {
    id: "biz-3",
    name: "North Texas Appliance Repair & Services",
    category: "Home Services",
    description: "Trusted local residential and commercial appliance repair, HVAC maintenance, and emergency service technicians.",
    address: "1405 Central Expy, Melissa, TX",
    phone: "(972) 837-9911",
    website: "https://example.com/ntx-appliance",
    socials: { facebook: "https://facebook.com" },
    logo: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
    badge: "Founding Member",
    rating: 4.8,
    featured: true
  },
  {
    id: "biz-4",
    name: "Heartland Real Estate Group",
    category: "Real Estate",
    description: "Specializing in Melissa residential homes, land development, and commercial leasing throughout Collin County.",
    address: "1800 Sam Rayburn Hwy, Melissa, TX",
    phone: "(972) 837-4400",
    website: "https://example.com/heartland-re",
    socials: { instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
    logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600",
    badge: "Founding Member",
    rating: 4.9,
    featured: true
  },
  {
    id: "biz-5",
    name: "Melissa Little Explorers Academy",
    category: "Daycare & Retail",
    description: "Premier early childhood education, infant care, and after-school STEM enrichment programs in Melissa.",
    address: "2901 Cooper St, Melissa, TX",
    phone: "(972) 837-3322",
    website: "https://example.com/little-explorers",
    socials: { facebook: "https://facebook.com", instagram: "https://instagram.com" },
    logo: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600",
    badge: "Business Member",
    rating: 4.9,
    featured: false
  },
  {
    id: "biz-6",
    name: "Landmark Title & Escrow Melissa",
    category: "Legal & Financial",
    description: "Local title closing services, escrow solutions, and real estate legal support for Melissa buyers and commercial developers.",
    address: "1902 Fannin Rd, Melissa, TX",
    phone: "(972) 837-7788",
    website: "https://example.com/landmark-title",
    socials: { linkedin: "https://linkedin.com" },
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
    badge: "Founding Member",
    rating: 5.0,
    featured: false
  }
];

export const MOCK_BOARD_MEMBERS: BoardMember[] = [
  {
    id: "board-1",
    name: "Chauntel Busche",
    role: "President",
    business: "Community Commerce Melissa",
    bio: "Dedicated community leader and passionate advocate for local Melissa business owners. With years of executive experience in community development and commercial growth, Chauntel leads Community Commerce Melissa with a clear mission: uniting local entrepreneurs, fostering high-impact strategic relationships, and building sustainable economic momentum throughout Collin County.",
    headshot: "/ccm-leaders/chauntel-busche.jpg",
    funFact: "Enjoys spearheading local community initiatives and supporting Melissa businesses!",
    email: "chauntel@communitycommercemelissa.com",
    phone: "(972) 837-1001",
    objectPosition: "top"
  },
  {
    id: "board-2",
    name: "Joey Mitnick",
    role: "Vice President",
    business: "Buffalo Joe’s Barber Lounge",
    bio: "Joey Mitnick is an entrepreneur with a passion for building businesses, developing leaders, and creating opportunities for others to succeed. As the owner of Buffalo Joe’s Barber Lounge, he has focused on growing a business rooted in exceptional customer experience, strong company culture, and community involvement.\n\nJoey is passionate about mentoring the next generation of conscientious business owners, fostering meaningful connections, and helping build a thriving local business community through collaboration, education, and service.",
    headshot: "/ccm-leaders/joey-mitnick.jpg",
    funFact: "Passionate about local business growth and community development.",
    email: "joey@communitycommercemelissa.com",
    phone: "(972) 837-1002",
    objectPosition: "top"
  },
  {
    id: "board-3",
    name: "Jana Scarpati Martinez",
    role: "Board Member & Treasurer",
    business: "Community Commerce Melissa",
    bio: "Jana Scarpati Martinez is a financial strategist and business owner leading a financial planning practice in Collin County. Holding an MBA and advanced certifications in financial planning and emerging tech, she works closely with entrepreneurs and families to navigate complex financial decisions, manage risk, and plan for long-term goals.\n\nAs Board Member & Treasurer, Jana supports Community Commerce Melissa through thoughtful financial oversight, transparency, and responsible stewardship. She is passionate about strengthening local business connections and keeping our organization community-focused, financially sound, and well-positioned for continued growth.",
    headshot: "/ccm-leaders/jana.jpg",
    funFact: "Enjoys financial planning and active involvement in local Melissa events.",
    email: "jana@communitycommercemelissa.com",
    phone: "(972) 837-1003",
    objectPosition: "center 18%"
  },
  {
    id: "board-4",
    name: "Alta Simmons",
    role: "Board Member",
    business: "National University",
    bio: "Alta Simmons is the Strategic Partnerships Manager at National University, strengthening workforce development and educational partnerships across Texas. A first-generation college graduate with an M.A. in Education (4.0 GPA) with Distinction, she is a strong advocate for servant leadership and lifelong learning.\n\nWithin CCM, Alta serves as a founding member committed to building meaningful relationships, supporting business owners, and teaching entrepreneurship, financial literacy, and community impact.",
    headshot: "/ccm-leaders/alta-simmons.jpg",
    funFact: "Passionate about community involvement and local networking.",
    email: "alta@communitycommercemelissa.com",
    phone: "(972) 837-1004",
    objectPosition: "top"
  },
  {
    id: "board-5",
    name: "Brett Zenker",
    role: "Board Member",
    business: "Community Commerce Melissa",
    bio: "Technology and marketing leader dedicated to innovating digital platforms, driving local business discovery, and expanding community outreach. Brett spearheads our web infrastructure, member directory technology, and digital promotion campaigns to keep Melissa businesses at the forefront of local commerce.",
    headshot: "/ccm-leaders/brett-zenker.jpg",
    funFact: "Enjoys building digital solutions and supporting local entrepreneurs.",
    email: "brett@communitycommercemelissa.com",
    phone: "(972) 837-1005",
    objectPosition: "top"
  },
  {
    id: "board-6",
    name: "Cindy Karman",
    role: "Board Member",
    business: "Community Commerce Melissa",
    bio: "Enthusiastic community champion focused on member engagement, local business partnerships, and organizing impactful events throughout Melissa. Cindy is passionate about building genuine business relationships, welcoming new members, and creating memorable networking experiences for our town.",
    headshot: "/ccm-leaders/cindy-karman.jpg",
    funFact: "Loves organizing community gatherings and supporting small business owners.",
    email: "cindy@communitycommercemelissa.com",
    phone: "(972) 837-1006",
    objectPosition: "center 5%"
  }
];

export const MOCK_FOUNDING_MEMBERS: FoundingMember[] = [
  { 
    name: "Makor Agency", 
    category: "Business Development", 
    logo: "/ccm-companies/makor-agency.png",
    website: "https://makoragency.com",
    highlight: "Founding Partner" 
  }
];

export const MOCK_SPONSORSHIPS: SponsorshipTier[] = [
  {
    id: "sp-platinum",
    name: "Community Champion (Platinum)",
    price: "$5,000",
    billing: "per year",
    color: "#A81C24",
    popular: true,
    benefits: [
      "Exclusive title sponsor placement on Homepage & Events Portal",
      "Full 2-minute video presentation at annual Business Expo",
      "Dedicated quarterly Business Spotlight email blast to all members",
      "VIP Table for 10 at all Monthly Mixers and Summits",
      "Permanent logo badge on Founding Members Wall",
      "Direct link back to your business domain for top SEO authority"
    ]
  },
  {
    id: "sp-gold",
    name: "Commerce Partner (Gold)",
    price: "$2,500",
    billing: "per year",
    color: "#CBD5E1",
    benefits: [
      "Featured logo placement on Event Banners & Directory header",
      "Opportunity to host 1 Coffee & Connections morning mixer",
      "Monthly social media spotlight across all platforms",
      "4 complimentary tickets to all paid workshops & mixers",
      "Enhanced business directory card with video embed"
    ]
  },
  {
    id: "sp-silver",
    name: "Community Supporter (Silver)",
    price: "$1,000",
    billing: "per year",
    color: "#64748B",
    benefits: [
      "Logo listed on Sponsorship Wall and print event signage",
      "Recognition at all Monthly Networking Mixers",
      "2 tickets to all paid workshops",
      "Featured logo in monthly community newsletter"
    ]
  }
];

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "Community Commerce Melissa Officially Launches Founding Member Campaign",
    date: "May 10, 2026",
    category: "Community Announcement",
    author: "Melissa Commerce Team",
    summary: "Local business owners gather to announce a fresh, modern approach to business growth and networking in Melissa, Texas.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    content: "Melissa, TX — Community Commerce Melissa is excited to introduce a new business organization built specifically for local entrepreneurs..."
  },
  {
    id: "news-2",
    title: "5 Proven Local Marketing Strategies for Melissa Small Businesses",
    date: "May 02, 2026",
    category: "Small Business Tips",
    author: "Elena Rodriguez",
    summary: "How to capture local search traffic, leverage community partnerships, and host memorable ribbon cutting celebrations.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    content: "Growing a business in a rapidly expanding town like Melissa requires localized digital presence and genuine relationship building..."
  },
  {
    id: "news-3",
    title: "Spotlight on New Commercial Development Along Central Expressway",
    date: "April 24, 2026",
    category: "Economic Development",
    author: "Marcus Vance",
    summary: "New retail centers, dining options, and medical offices planned to open in Melissa later this year.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    content: "The City of Melissa continues its historic commercial expansion with over $45M in new development scheduled for 2026..."
  }
];
