export interface ClubData {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  longDescription?: string;
  leadName: string;
  leadEmail: string;
  leadRole?: string;
  facultyCoordinator?: string;
  memberCount: number;
  logoUrl: string;
  bannerUrl: string;
  isFeatured?: boolean;
  achievements?: string[];
  upcomingEventsCount?: number;
  socialLinks?: {
    website?: string;
    github?: string;
    linkedin?: string;
    discord?: string;
  };
  leadershipTeam?: Array<{
    name: string;
    role: string;
    avatar: string;
  }>;
}

export interface EventData {
  _id: string;
  title: string;
  slug: string;
  category: 'Coding' | 'AI & ML' | 'Hackathons' | 'Robotics' | 'Design' | 'Cultural' | 'Technical' | 'Workshop';
  shortDescription: string;
  description: string;
  club: {
    _id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  locationType: 'In-Person' | 'Virtual' | 'Hybrid';
  bannerUrl: string;
  capacity: number;
  registeredCount: number;
  status: 'published' | 'draft' | 'completed' | 'cancelled';
  featured?: boolean;
  tags: string[];
  requirements?: string[];
  speakers?: Array<{
    name: string;
    role: string;
    company: string;
    avatar: string;
  }>;
  schedule?: Array<{
    time: string;
    title: string;
    description: string;
  }>;
}

export const MOCK_CLUBS: ClubData[] = [
  {
    _id: 'club-codechef',
    name: 'CodeChef Campus Chapter',
    slug: 'codechef-chapter',
    category: 'Coding',
    description: 'Premier competitive programming and algorithmic problem-solving community organizing bi-weekly contests and DSA bootcamps.',
    longDescription: 'CodeChef Campus Chapter at ABES Engineering College is dedicated to fostering a strong culture of competitive programming, data structures, and algorithms. We mentor students from first year to placement seasons with mock interviews and live contests.',
    leadName: 'Aryan Sharma',
    leadEmail: 'codechef@abes.ac.in',
    leadRole: 'President & Contest Lead',
    facultyCoordinator: 'Dr. R. K. Singhal (Professor, Dept of CSE)',
    memberCount: 840,
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    achievements: [
      'Top 10 Global Finalists in ICPC Asia-Amritapuri Regionals',
      'Over 450 students active on CodeChef and LeetCode ladders',
      'Hosted ABES AlgoWar with 1,200+ participants nationwide'
    ],
    upcomingEventsCount: 3,
    socialLinks: {
      github: 'https://github.com/abes-codechef',
      linkedin: 'https://linkedin.com/company/abes-codechef',
      discord: 'https://discord.gg/codechef-abes'
    },
    leadershipTeam: [
      { name: 'Aryan Sharma', role: 'President', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
      { name: 'Neha Gupta', role: 'CP Head', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
      { name: 'Tanmay Verma', role: 'Event Coordinator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' }
    ]
  },
  {
    _id: 'club-webdev',
    name: 'Web Development Club',
    slug: 'web-dev-club',
    category: 'Coding',
    description: 'Building full-stack web and cloud applications, mastering modern frameworks like React, Next.js, and serverless backends.',
    longDescription: 'The Web Development Club brings together frontend designers, backend engineers, and DevOps enthusiasts to build real-world campus tools and production-grade software.',
    leadName: 'Priya Verma',
    leadEmail: 'webdev@abes.ac.in',
    leadRole: 'Lead Architect',
    facultyCoordinator: 'Prof. Anjali Mittal (Dept of IT)',
    memberCount: 620,
    logoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    achievements: [
      'Built and deployed the official ABES Hostel & Mess Portal',
      'Conducted 36-hour Full-Stack React & Node Bootcamp',
      'Won Best Open Source Project at Smart India Hackathon'
    ],
    upcomingEventsCount: 2,
    socialLinks: {
      github: 'https://github.com/abes-webdev',
      linkedin: 'https://linkedin.com/company/abes-webdev',
      discord: 'https://discord.gg/webdev-abes'
    },
    leadershipTeam: [
      { name: 'Priya Verma', role: 'Lead Architect', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' },
      { name: 'Rohan Joshi', role: 'Backend Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' }
    ]
  },
  {
    _id: 'club-aiml',
    name: 'AI & Machine Learning Club',
    slug: 'aiml-club',
    category: 'AI & ML',
    description: 'Deep diving into neural networks, computer vision, generative AI, LLM fine-tuning, and PyTorch research projects.',
    longDescription: 'Exploring foundational and bleeding-edge machine learning research. We organize paper discussions, Kaggle competitions, and build automated agents using LLMs and vision models.',
    leadName: 'Kabir Sengupta',
    leadEmail: 'aiml@abes.ac.in',
    leadRole: 'Research Head',
    facultyCoordinator: 'Dr. Vivek Sharma (Associate Dean, AI & Research)',
    memberCount: 750,
    logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    achievements: [
      'Published 4 undergraduate research papers in IEEE conferences',
      'Ranked #3 nationwide in AI for Good Healthcare Datathon',
      'Trained custom multilingual campus assist LLM'
    ],
    upcomingEventsCount: 4,
    socialLinks: {
      github: 'https://github.com/abes-aiml',
      linkedin: 'https://linkedin.com/company/abes-aiml',
      discord: 'https://discord.gg/aiml-abes'
    },
    leadershipTeam: [
      { name: 'Kabir Sengupta', role: 'Lead Researcher', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80' },
      { name: 'Ananya Roy', role: 'Data Scientist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' }
    ]
  },
  {
    _id: 'club-robotics',
    name: 'Robotics Club',
    slug: 'robotics-club',
    category: 'Robotics',
    description: 'Hardware prototyping, embedded IoT systems, autonomous rovers, and mechanical combat robot engineering.',
    longDescription: 'The Robotics Club empowers engineers to bridge software with mechanical reality. From microcontrollers and ROS2 to CAD modeling and 3D fabrication, our lab is the center of hands-on engineering.',
    leadName: 'Aditya Mathur',
    leadEmail: 'robotics@abes.ac.in',
    leadRole: 'Hardware Lead',
    facultyCoordinator: 'Prof. S. P. Tiwari (Dept of ECE)',
    memberCount: 430,
    logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1563968743333-044cef800494?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    achievements: [
      'Gold Medalists at Robowars IIT Kanpur Techkriti',
      'Developed Autonomous Line Follower and Quadcopter delivery drone',
      'Organized annual RoboMaze with 80+ robot teams'
    ],
    upcomingEventsCount: 2,
    socialLinks: {
      github: 'https://github.com/abes-robotics',
      linkedin: 'https://linkedin.com/company/abes-robotics'
    },
    leadershipTeam: [
      { name: 'Aditya Mathur', role: 'Hardware Lead', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' }
    ]
  },
  {
    _id: 'club-cybersec',
    name: 'Cybersecurity Club',
    slug: 'cybersecurity-club',
    category: 'Coding',
    description: 'Ethical hacking, binary exploitation, digital forensics, defensive security, and Capture The Flag (CTF) challenges.',
    longDescription: 'Building campus cyber defenses. We host regular workshops on web app penetration testing, network defense, reverse engineering, and participate in national CTF tournaments.',
    leadName: 'Harsh Vardhan',
    leadEmail: 'cybersec@abes.ac.in',
    leadRole: 'Security Lead',
    facultyCoordinator: 'Dr. Meena Rawat (Dept of CSE)',
    memberCount: 380,
    logoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    isFeatured: false,
    achievements: [
      'Top 5 ranking in DefCon University Capture The Flag',
      'Discovered & responsibly disclosed 6 CVE vulnerabilities',
      'Trained 200+ students in Certified Ethical Hacking basics'
    ],
    upcomingEventsCount: 1,
    socialLinks: {
      github: 'https://github.com/abes-cybersec',
      linkedin: 'https://linkedin.com/company/abes-cybersec'
    },
    leadershipTeam: [
      { name: 'Harsh Vardhan', role: 'Security Lead', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80' }
    ]
  },
  {
    _id: 'club-design',
    name: 'Design & Creative Club',
    slug: 'design-creative-club',
    category: 'Design',
    description: 'UI/UX design, product branding, 3D motion design, graphic arts, and visual storytelling for digital media.',
    longDescription: 'Where creativity meets product thinking. We craft user experiences, design systems, event identities, and digital art using Figma, Spline 3D, and Blender.',
    leadName: 'Simran Kaur',
    leadEmail: 'design@abes.ac.in',
    leadRole: 'Creative Director',
    facultyCoordinator: 'Prof. Rashmi Saxena (Dept of Humanities & Design)',
    memberCount: 490,
    logoUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    isFeatured: false,
    achievements: [
      'Designed branding and merchandise for TechFest 2026',
      'Winner of Adobe Creative Jam Inter-College Round',
      'Trained 350+ students in Figma design systems'
    ],
    upcomingEventsCount: 2,
    socialLinks: {
      website: 'https://dribbble.com/abes-design',
      linkedin: 'https://linkedin.com/company/abes-design'
    },
    leadershipTeam: [
      { name: 'Simran Kaur', role: 'Creative Director', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' }
    ]
  }
];

export const MOCK_EVENTS: EventData[] = [
  {
    _id: 'event-techfest-2026',
    title: 'TechFest 2026: Annual National Innovation Summit',
    slug: 'techfest-2026',
    category: 'Hackathons',
    shortDescription: 'The flagship national technology summit featuring a 36-hour hackathon, robotics arena, venture pitch desk, and guest keynotes from top tech leaders.',
    description: 'TechFest 2026 is ABES Engineering College’s premier annual technology festival. Bringing together over 2,000 developers, creators, roboticists, and entrepreneurs from across India for 3 packed days of coding, hardware building, competitive gaming, and venture pitching.\n\nTracks include AI/ML, Decentralized Web, HealthTech, Sustainable Energy, and Smart Robotics. Winners take home INR 5,00,000+ in cash prizes, incubation grants, and direct interview fast-tracks.',
    club: {
      _id: 'club-codechef',
      name: 'CodeChef Campus Chapter',
      slug: 'codechef-chapter',
      logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80'
    },
    date: '2026-10-18',
    startTime: '09:00 AM',
    endTime: '08:00 PM',
    venue: 'Bhabha Auditorium & Main Innovation Labs, ABES Campus',
    locationType: 'In-Person',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
    capacity: 500,
    registeredCount: 384,
    status: 'published',
    featured: true,
    tags: ['Hackathon', 'TechFest', 'Robotics', 'Innovation', 'Prizes'],
    requirements: [
      'Valid College / University Student Identity Card',
      'Laptop with required development environment setup',
      'Teams of 2 to 4 members permitted for the 36-hour hackathon track'
    ],
    speakers: [
      { name: 'Dr. Sameer Malhotra', role: 'Head of Engineering', company: 'Google DeepMind', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
      { name: 'Ritika Sen', role: 'VP of Product', company: 'Razorpay', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' }
    ],
    schedule: [
      { time: '09:00 AM', title: 'Grand Opening & Keynote', description: 'Inauguration address by Director & keynote speech on Generative Intelligence' },
      { time: '11:00 AM', title: 'Hackathon Problem Statements Release', description: 'Problem tracks revealed; hacking clocks initiate' },
      { time: '02:00 PM', title: 'Robotics Combat & Line Follower Prelims', description: 'Live combat rounds in the central indoor arena' },
      { time: '06:00 PM', title: 'Mentorship Sprint 1', description: 'Industry mentors review architecture and technical feasibility' }
    ]
  },
  {
    _id: 'event-react-bootcamp',
    title: 'Full-Stack React 19 & Next.js Masterclass',
    slug: 'react-masterclass-2026',
    category: 'Coding',
    shortDescription: 'Hands-on intensive masterclass on Server Components, Actions, optimistic UI patterns, and building production-ready apps.',
    description: 'Learn modern full-stack web engineering with React 19, Next.js App Router, Tailwind CSS, and serverless databases. Build and deploy a real-time collaborative workspace by the end of the day.',
    club: {
      _id: 'club-webdev',
      name: 'Web Development Club',
      slug: 'web-dev-club',
      logoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80'
    },
    date: '2026-10-24',
    startTime: '10:00 AM',
    endTime: '04:30 PM',
    venue: 'Computer Center Lab 4, Block B',
    locationType: 'In-Person',
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    capacity: 120,
    registeredCount: 98,
    status: 'published',
    featured: false,
    tags: ['React19', 'NextJS', 'WebDev', 'TypeScript'],
    requirements: ['Basic understanding of JavaScript and HTML', 'Laptop with Node.js 20+ installed']
  },
  {
    _id: 'event-ai-agents-workshop',
    title: 'Autonomous AI Agents with PyTorch & LLMs',
    slug: 'ai-agents-workshop',
    category: 'AI & ML',
    shortDescription: 'Build self-reasoning AI agents, tool-calling pipelines, and multimodal vision models using state-of-the-art open source frameworks.',
    description: 'Step into the frontier of agentic AI. We cover ReAct prompting, LangChain/LlamaIndex pipelines, vector search with embeddings, and fine-tuning open source weights for domain tasks.',
    club: {
      _id: 'club-aiml',
      name: 'AI & Machine Learning Club',
      slug: 'aiml-club',
      logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&auto=format&fit=crop&q=80'
    },
    date: '2026-11-02',
    startTime: '11:00 AM',
    endTime: '05:00 PM',
    venue: 'AI Research Center, 3rd Floor',
    locationType: 'Hybrid',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    capacity: 150,
    registeredCount: 142,
    status: 'published',
    featured: false,
    tags: ['AI', 'LLM', 'Agents', 'PyTorch'],
    requirements: ['Python fundamentals', 'Google Colab / Kaggle account setup']
  },
  {
    _id: 'event-robowars-2026',
    title: 'RoboWars & Combat Arena Championship',
    slug: 'robowars-championship-2026',
    category: 'Robotics',
    shortDescription: 'High-voltage combat robotics face-off with custom 15kg and 30kg metal warriors in an armored Lexan cage.',
    description: 'Sparks will fly! Experience the ultimate engineering battleground where combat bots with high-speed spinning drums, flippers, and wedge chassis battle for destruction and glory.',
    club: {
      _id: 'club-robotics',
      name: 'Robotics Club',
      slug: 'robotics-club',
      logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&auto=format&fit=crop&q=80'
    },
    date: '2026-11-10',
    startTime: '01:00 PM',
    endTime: '07:30 PM',
    venue: 'Central Amphitheatre & Sports Arena',
    locationType: 'In-Person',
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
    capacity: 350,
    registeredCount: 280,
    status: 'published',
    featured: false,
    tags: ['Robotics', 'RoboWars', 'Combat', 'Engineering'],
    requirements: ['Pre-cleared robot safety compliance for participating teams', 'General spectator pass for students']
  },
  {
    _id: 'event-uiux-designathon',
    title: 'DesignSprint 2026: 24-Hour Product UI/UX Hack',
    slug: 'designsprint-2026',
    category: 'Design',
    shortDescription: 'Solve urgent real-world digital experience problems in 24 hours with user research, wireframing, interactive Figma prototypes, and jury pitches.',
    description: 'Transform user pain points into elegant, delightful interface systems. Compete in teams to deliver end-to-end design artifacts, design systems, and animated micro-interactions evaluated by top design agency directors.',
    club: {
      _id: 'club-design',
      name: 'Design & Creative Club',
      slug: 'design-creative-club',
      logoUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&auto=format&fit=crop&q=80'
    },
    date: '2026-11-18',
    startTime: '10:00 AM',
    endTime: '10:00 AM (Next Day)',
    venue: 'Media Studio & Innovation Gallery, Block C',
    locationType: 'In-Person',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    capacity: 100,
    registeredCount: 76,
    status: 'published',
    featured: false,
    tags: ['UIUX', 'Figma', 'ProductDesign', 'Designathon'],
    requirements: ['Laptop with Figma installed', 'Teams of 2 to 3 designers']
  },
  {
    _id: 'event-dhwani-fest',
    title: 'Dhwani 2026: Inter-Collegiate Cultural Festival & Band War',
    slug: 'dhwani-cultural-fest',
    category: 'Cultural',
    shortDescription: 'A pulsating night of acoustic sets, rock bands, live theatrical performances, street dances, and street food stalls under the open sky.',
    description: 'Celebrate collegiate arts and musical talent at Dhwani 2026. Featuring performances from top collegiate bands across Delhi-NCR, open mic spoken poetry, and an electric celebrity DJ performance.',
    club: {
      _id: 'club-design',
      name: 'Design & Creative Club',
      slug: 'design-creative-club',
      logoUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&auto=format&fit=crop&q=80'
    },
    date: '2026-11-28',
    startTime: '04:00 PM',
    endTime: '10:30 PM',
    venue: 'Main Campus Stadium Ground, ABES',
    locationType: 'In-Person',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
    capacity: 1000,
    registeredCount: 840,
    status: 'published',
    featured: false,
    tags: ['Cultural', 'Music', 'Concert', 'CollegeLife'],
    requirements: ['Official College ID card required at entry gates']
  }
];

// Helper to get or initialize stored user state
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  department: string;
  academicYear: string;
  studentId: string;
  phone: string;
  avatar: string;
  bio: string;
  interests: string[];
  joinedClubIds: string[];
  registeredEvents: Array<{
    eventId: string;
    registeredAt: string;
    registrationId: string;
    status: 'Confirmed' | 'Waitlisted';
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'event' | 'club' | 'system';
  }>;
}

export const DEFAULT_STUDENT: StudentProfile = {
  id: 'std-2026-889',
  name: 'Devansh Saxena',
  email: 'devansh.22bcs104@abes.ac.in',
  college: 'ABES Engineering College',
  department: 'Computer Science & Engineering',
  academicYear: '3rd Year',
  studentId: '2200320100088',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: 'Full-stack builder, open source contributor, and competitive coder. Passionate about AI agents and distributed systems.',
  interests: ['Hackathons', 'Full-Stack Development', 'AI/ML', 'Competitive Programming'],
  joinedClubIds: ['club-codechef', 'club-webdev', 'club-aiml'],
  registeredEvents: [
    {
      eventId: 'event-techfest-2026',
      registeredAt: '2026-09-28T14:32:00.000Z',
      registrationId: 'ABES-TF26-9042',
      status: 'Confirmed'
    },
    {
      eventId: 'event-react-bootcamp',
      registeredAt: '2026-09-29T10:15:00.000Z',
      registrationId: 'ABES-RC26-1184',
      status: 'Confirmed'
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      title: 'TechFest 2026 Admission Pass Ready',
      message: 'Your gate entry credential for TechFest 2026 is confirmed. Check in at Bhabha Auditorium.',
      time: '2 hours ago',
      read: false,
      type: 'event'
    },
    {
      id: 'notif-2',
      title: 'CodeChef Campus Chapter Announcement',
      message: 'Bi-weekly AlgoSprint contest goes live this Thursday at 8:00 PM on CodeChef platform.',
      time: '1 day ago',
      read: false,
      type: 'club'
    },
    {
      id: 'notif-3',
      title: 'Welcome to ABES CampusConnect',
      message: 'Your collegiate account is linked. Explore student societies and reserve event seats.',
      time: '3 days ago',
      read: true,
      type: 'system'
    }
  ]
};

// Local storage management helpers
const STUDENT_STORAGE_KEY = 'campusconnect_student_profile';

export const getStoredStudent = (): StudentProfile => {
  try {
    const raw = localStorage.getItem(STUDENT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored student profile:', e);
  }
  return DEFAULT_STUDENT;
};

export const saveStoredStudent = (student: StudentProfile) => {
  try {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));
  } catch (e) {
    console.error('Failed to save student profile:', e);
  }
};
