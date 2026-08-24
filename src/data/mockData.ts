export interface EventItem {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  address?: string;
  category: string;
  description: string;
  image: string;
  isFeatured?: boolean;
  registerUrl?: string;
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
// Comprehensive Business & Industry Categories
// ----------------------------------------------------
export const BUSINESS_CATEGORIES: string[] = [
  "Advertising, Marketing & PR",
  "Automotive & Transportation",
  "Banking, Accounting & Finance",
  "Construction, Roofing & Contractors",
  "Education, Childcare & Tutoring",
  "Event Planning, Photography & Entertainment",
  "Government, Civic & Non-Profit",
  "Health, Medical & Wellness",
  "Home Services, HVAC & Landscaping",
  "Hospitality, Dining & Catering",
  "Insurance Services",
  "IT, Web Design & Technology",
  "Legal, Law Practice & Title",
  "Manufacturing & Industrial",
  "Personal Care, Salons & Spas",
  "Pet Care & Veterinary Services",
  "Professional & Business Consulting",
  "Real Estate & Property Management",
  "Retail, Boutiques & Shopping",
  "Security & Smart Home Systems",
  "Sports, Fitness & Recreation",
  "General Business / Other"
];

// ----------------------------------------------------
// Mock Data for Community Commerce Melissa
// ----------------------------------------------------

export const MOCK_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    title: "Meet & Greet Networking Mixer",
    date: "2026-08-24",
    month: "AUG",
    day: "24",
    time: "6:00 PM - 8:00 PM",
    location: "The Red Feather",
    address: "3400 Red Feather Way, Melissa, TX 75454",
    category: "Monthly Networking Mixers",
    description: "Join local Melissa business owners, founders, and community leaders for our August Meet & Greet Networking Mixer! Connect with fellow entrepreneurs, build strategic partnerships, and enjoy complimentary refreshments in a relaxed setting.",
    image: "/events/meet-and-greet-aug-24-26-v2.jpg",
    isFeatured: true,
    registerUrl: "https://www.eventbrite.com/e/community-commerce-melissa-meet-greet-networking-night-tickets-1995479705516?utm_experiment=test_share_listing&aff=ebdsshios"
  },
  {
    id: "evt-2",
    title: "Lunch & Learn: Building A Stronger Community",
    date: "2026-09-14",
    month: "SEP",
    day: "14",
    time: "11:00 AM - 12:30 PM",
    location: "First United Bank",
    address: "1700 Redbud Blvd, Suite 130, McKinney, TX 75069",
    category: "Lunch and Learn",
    description: "Be Involved. Make an Impact! Discover what Community Commerce Melissa is all about, connect with fellow business owners, share ideas, and explore committees and volunteer opportunities. FREE Lunch included for attendees sponsored by First United Bank!",
    image: "/events/lunch-and-learn-9-14-26.jpg",
    isFeatured: true,
    registerUrl: "https://www.eventbrite.com/e/1998600679433?aff=oddtdtcreator"
  },
  {
    id: "evt-3",
    title: "CCM Networking Night at Mountain Mike's Pizza",
    date: "2026-09-21",
    month: "SEP",
    day: "21",
    time: "6:00 PM - 8:00 PM",
    location: "Mountain Mike's Pizza",
    address: "3031 Washington Drive, Melissa, TX 75454",
    category: "Monthly Networking Mixers",
    description: "One Community, Endless Connections! A fresh local non-profit networking evening to connect, support, and grow Melissa businesses together. Enjoy complimentary appetizers, door prizes & giveaways, and community collaboration. Free event — space is limited, please register in advance!",
    image: "/events/networking-night-mountain-mikes-9-21-26.jpg",
    isFeatured: true,
    registerUrl: "https://www.eventbrite.com/e/1998545201497?aff=oddtdtcreator"
  }
];

export const MOCK_BUSINESSES: BusinessItem[] = [
  {
    id: "biz-1",
    name: "Melissa Family Dental & Orthodontics",
    category: "Health, Medical & Wellness",
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
    name: "The Red Feather",
    category: "Hospitality, Dining & Catering",
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
    category: "Home Services, HVAC & Landscaping",
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
    category: "Real Estate & Property Management",
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
    category: "Education, Childcare & Tutoring",
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
    category: "Legal, Law Practice & Title",
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
    role: "President & Board Member",
    business: "Community Commerce Melissa",
    bio: "Chauntel is the Owner & Founder of Makor Agency, where she helps businesses grow through strategic marketing, branding, and business development. With more than 20 years of leadership experience, she has built a career around creating impactful marketing strategies, developing strong partnerships, and helping organizations achieve sustainable growth.\n\nPassionate about empowering businesses and entrepreneurs, Chauntel combines creativity with proven business strategy to deliver meaningful results. She is committed to building lasting relationships, mentoring others, and helping clients strengthen their brands, expand their reach, and create long-term success through innovation, collaboration, and exceptional marketing.",
    headshot: "/ccm-leaders/chauntel-busche.jpg",
    funFact: "Enjoys spearheading local community initiatives and supporting Melissa businesses!",
    email: "chauntel@communitycommercemelissa.org",
    phone: "(972) 837-1001",
    objectPosition: "center 15%"
  },
  {
    id: "board-2",
    name: "Joey Mitnick",
    role: "Vice President & Board Member",
    business: "Community Commerce Melissa",
    bio: "Joey Mitnick is an entrepreneur with a passion for building businesses, developing leaders, and creating opportunities for others to succeed. As the owner of Buffalo Joe’s Barber Lounge, he has focused on growing a business rooted in exceptional customer experience, strong company culture, and community involvement.\n\nJoey is passionate about mentoring the next generation of conscientious business owners, fostering meaningful connections, and helping build a thriving local business community through collaboration, education, and service.",
    headshot: "/ccm-leaders/joey-mitnick-v2.jpg",
    funFact: "Passionate about local business growth and community development.",
    email: "joey@communitycommercemelissa.org",
    phone: "(972) 837-1002",
    objectPosition: "center top"
  },
  {
    id: "board-3",
    name: "Jana Scarpati Martinez",
    role: "Treasurer & Board Member",
    business: "Community Commerce Melissa",
    bio: "Jana Scarpati Martinez is a financial strategist and business owner leading a financial planning practice in Collin County. Holding an MBA and advanced certifications in financial planning and emerging tech, she works closely with entrepreneurs and families to navigate complex financial decisions, manage risk, and plan for long-term goals.\n\nAs Treasurer & Board Member, Jana supports Community Commerce Melissa through thoughtful financial oversight, transparency, and responsible stewardship. She is passionate about strengthening local business connections and keeping our organization community-focused, financially sound, and well-positioned for continued growth.",
    headshot: "/ccm-leaders/jana-martinez-v2.jpg",
    funFact: "Enjoys financial planning and active involvement in local Melissa events.",
    email: "jana@communitycommercemelissa.org",
    phone: "(972) 837-1003",
    objectPosition: "center 15%"
  },
  {
    id: "board-5",
    name: "Brett Zenker",
    role: "Secretary & Board Member",
    business: "Community Commerce Melissa",
    bio: "Brett Zenker is the Co-Owner and Vice President of ZenTek USA, where he leads the company's technology initiatives with a focus on managed IT services, cybersecurity, website and software development. He is passionate about helping businesses leverage technology to improve efficiency, security, and long-term success.\n\nWith extensive expertise in information technology and web development, Brett is committed to solving complex challenges through innovative solutions and exceptional client service. He enjoys building lasting relationships with clients and helping organizations confidently navigate today's ever-changing technology landscape.",
    headshot: "/ccm-leaders/brett-zenker.jpg",
    funFact: "Enjoys building digital solutions and supporting local entrepreneurs.",
    email: "brett@communitycommercemelissa.org",
    phone: "(972) 837-1005",
    objectPosition: "center 18%"
  },
  {
    id: "board-4",
    name: "Alta Simmons",
    role: "Education & Partnerships Agent / Board Member",
    business: "Community Commerce Melissa",
    bio: "Alta Simmons is the Strategic Partnerships Manager at National University, strengthening workforce development and educational partnerships across Texas. A first-generation college graduate with an M.A. in Education (4.0 GPA) with Distinction, she is a strong advocate for servant leadership and lifelong learning.\n\nWithin CCM, Alta serves as a founding member committed to building meaningful relationships, supporting business owners, and teaching entrepreneurship, financial literacy, and community impact.",
    headshot: "/ccm-leaders/alta-simmons.jpg",
    funFact: "Passionate about community involvement and local networking.",
    email: "alta@communitycommercemelissa.org",
    phone: "(972) 837-1004",
    objectPosition: "center 18%"
  },
  {
    id: "board-6",
    name: "Cindy Karman",
    role: "Community Outreach Director / Board Member",
    business: "Community Commerce Melissa",
    bio: "Cindy Karman is the owner and founder of Barefoot Naturals, a luxury natural bath and body company dedicated to creating handcrafted products made with high-quality ingredients. After moving to the Melissa, Texas area in 2019, Cindy and her family quickly became active members of the community, with two of her children attending Melissa ISD schools.\n\nBeyond her business, she is passionate about serving others through her work at Melissa DAEP, where she supports students, and by teaching parenting classes for Real Options to help strengthen families. Cindy also volunteers alongside her certified therapy dog, providing comfort and emotional support to individuals in hospitals and during crisis situations. Whether through her business, her profession, or her volunteer work, Cindy is committed to making a positive impact by promoting stronger communities.",
    headshot: "/ccm-leaders/cindy-karman.jpg",
    funFact: "Loves organizing community gatherings and supporting small business owners.",
    email: "cindy@communitycommercemelissa.org",
    phone: "(972) 837-1006",
    objectPosition: "center 10%"
  },
  {
    id: "board-7",
    name: "Jax Edwards",
    role: "Executive Advisor / Board Member",
    business: "Community Commerce Melissa",
    bio: "Jax Edwards is a business advisor, tax strategist, and legal professional dedicated to helping entrepreneurs build stronger, more successful organizations. As the founder of Jaxes Taxes, he works with business owners on tax planning, accounting, business strategy, and organizational structure, helping clients make informed decisions that support long-term growth.\n\nJax is passionate about equipping entrepreneurs with practical knowledge that creates lasting value for their businesses and communities. Through his expertise in business, taxation, and law, he is committed to helping organizations build strong foundations while fostering responsible entrepreneurship and sustainable economic growth.",
    headshot: "/ccm-leaders/jax.jpg",
    funFact: "Passionate about helping entrepreneurs build strong foundations.",
    email: "jax@communitycommercemelissa.org",
    phone: "(972) 837-1007",
    objectPosition: "center 10%"
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
    id: "announcing-our-first-event",
    title: "Announcing Our Inaugural Event & The Foundation of Community Commerce Melissa",
    date: "July 31, 2026",
    category: "Official Announcement",
    author: "Community Commerce Team",
    summary: "We are thrilled to officially announce our inaugural Meet & Greet Networking Mixer on August 24, 2026! Discover the story behind the founding of Community Commerce Melissa and our mission to unite local entrepreneurs.",
    image: "/events/meet-and-greet-aug-24-26-v2.jpg",
    content: "We are thrilled to officially announce the launch of Community Commerce Melissa and invite our entire business community to our inaugural event: the Meet & Greet Networking Mixer on Monday, August 24, 2026, from 6:00 PM to 8:00 PM at The Red Feather!\n\nCommunity Commerce Melissa was founded with a clear, singular vision: to create a dedicated, modern platform built by local business leaders, for local business leaders. As Melissa continues its remarkable growth, we recognized the vital need for an organization focused entirely on empowering entrepreneurs, fostering meaningful professional relationships, and driving sustainable commercial momentum throughout Collin County.\n\nNow established as an official 501(c)(3) non-profit organization, Community Commerce Melissa is built on four core pillars: Connection, Education, Promotion, and Community Stewardship. We believe that when local businesses thrive, our entire town grows stronger. Through interactive networking events, workshops, and digital promotion tools, we are dedicated to ensuring every Melissa business owner has the resources, visibility, and support they need to succeed.\n\nOur first Meet & Greet Networking Mixer will bring together local founders, small business owners, corporate leaders, and community partners for an evening of warm connections, collaborative discussion, and complimentary refreshments in a relaxed setting at The Red Feather. Admission is completely free, and all local business owners and community members are warmly invited to attend!\n\nEvent Details:\n• Date: Monday, August 24, 2026\n• Time: 6:00 PM – 8:00 PM\n• Location: The Red Feather, Melissa TX\n• Admission: FREE Event — Open to All Local Entrepreneurs\n\nReserve your ticket today via Eventbrite and be a part of history as we kick off Community Commerce Melissa together!"
  }
];
