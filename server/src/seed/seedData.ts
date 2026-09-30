import bcrypt from 'bcryptjs';

export const getSeedData = async () => {
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@CampusConnect2026', salt);

  const admin = {
    _id: '674c10000000000000000001',
    username: 'superadmin',
    email: 'admin@campusconnect.edu',
    password: adminPasswordHash,
    name: 'Chief Student Affairs Admin',
    role: 'superadmin',
    createdAt: new Date('2026-01-10T08:00:00Z'),
  };

  const clubs = [
    {
      _id: '674c10000000000000000010',
      name: 'Google Developer Student Club',
      slug: 'gdsc-campus',
      category: 'Technology & Coding',
      description:
        'A vibrant university-based community group for students interested in Google developer technologies. From mobile development to AI and cloud engineering, we build solutions that impact our campus and local community.',
      logoUrl:
        'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=300&auto=format&fit=crop&q=80',
      bannerUrl:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      leadName: 'Aryan Sharma',
      leadEmail: 'aryan.sharma@gdsc.campusconnect.edu',
      memberCount: 340,
      isFeatured: true,
      socialLinks: {
        instagram: 'https://instagram.com/gdsc_campus',
        linkedin: 'https://linkedin.com/company/gdsc-campus',
        github: 'https://github.com/gdsc-campus',
        website: 'https://gdsc.campusconnect.edu',
      },
      createdAt: new Date('2026-01-12T10:00:00Z'),
      updatedAt: new Date('2026-01-12T10:00:00Z'),
    },
    {
      _id: '674c10000000000000000011',
      name: 'Robotics & AI Automation Society',
      slug: 'robotics-society',
      category: 'Robotics & AI',
      description:
        'Pioneering hardware hackers, micro-controller enthusiasts, and machine learning researchers designing autonomous drones, battle bots, and computer vision robotic arms.',
      logoUrl:
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&auto=format&fit=crop&q=80',
      bannerUrl:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
      leadName: 'Devika Nair',
      leadEmail: 'devika.n@robotics.campusconnect.edu',
      memberCount: 215,
      isFeatured: true,
      socialLinks: {
        instagram: 'https://instagram.com/robotics_campus',
        linkedin: 'https://linkedin.com/company/robotics-campus',
        github: 'https://github.com/robotics-campus',
        website: 'https://robotics.campusconnect.edu',
      },
      createdAt: new Date('2026-01-15T11:00:00Z'),
      updatedAt: new Date('2026-01-15T11:00:00Z'),
    },
    {
      _id: '674c10000000000000000012',
      name: 'E-Cell: Entrepreneurship & Ventures',
      slug: 'ecell-campus',
      category: 'Entrepreneurship & Business',
      description:
        'Fostering the spirit of innovation and startup culture across disciplines. We connect student founders with angel investors, mentors, incubator resources, and pitch opportunities.',
      logoUrl:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80',
      bannerUrl:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
      leadName: 'Kabir Singhania',
      leadEmail: 'kabir.s@ecell.campusconnect.edu',
      memberCount: 290,
      isFeatured: true,
      socialLinks: {
        instagram: 'https://instagram.com/ecell_campus',
        linkedin: 'https://linkedin.com/company/ecell-campus',
        website: 'https://ecell.campusconnect.edu',
      },
      createdAt: new Date('2026-01-18T09:00:00Z'),
      updatedAt: new Date('2026-01-18T09:00:00Z'),
    },
    {
      _id: '674c10000000000000000013',
      name: 'Design & Creative Media Collective',
      slug: 'design-creative-collective',
      category: 'Arts & Culture',
      description:
        'The home for UI/UX creators, 3D artists, illustrators, motion designers, and brand storytellers. We craft memorable visual experiences and organize hands-on creative sprints.',
      logoUrl:
        'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&auto=format&fit=crop&q=80',
      bannerUrl:
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&auto=format&fit=crop&q=80',
      leadName: 'Rhea Sen',
      leadEmail: 'rhea.sen@design.campusconnect.edu',
      memberCount: 180,
      isFeatured: false,
      socialLinks: {
        instagram: 'https://instagram.com/design_collective_campus',
        linkedin: 'https://linkedin.com/company/design-campus',
      },
      createdAt: new Date('2026-01-20T14:00:00Z'),
      updatedAt: new Date('2026-01-20T14:00:00Z'),
    },
    {
      _id: '674c10000000000000000014',
      name: 'Spardha Esports & Athletics Guild',
      slug: 'spardha-sports-guild',
      category: 'Sports & Fitness',
      description:
        'Promoting collegiate athletics, fitness bootcamps, and competitive esports leagues spanning Valorant, BGMI, Rocket League, and Football.',
      logoUrl:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80',
      bannerUrl:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      leadName: 'Varun Tej',
      leadEmail: 'varun.t@sports.campusconnect.edu',
      memberCount: 420,
      isFeatured: false,
      socialLinks: {
        instagram: 'https://instagram.com/spardha_campus',
        linkedin: 'https://linkedin.com/company/spardha-sports',
      },
      createdAt: new Date('2026-01-22T16:00:00Z'),
      updatedAt: new Date('2026-01-22T16:00:00Z'),
    },
    {
      _id: '674c10000000000000000015',
      name: 'Kalam Literary & Debating Forum',
      slug: 'kalam-debating-forum',
      category: 'Literature & Debate',
      description:
        'Fostering intellectual discourse, parliamentary debate, creative writing, slam poetry, and Model United Nations simulations across higher-ed circuits.',
      logoUrl:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&auto=format&fit=crop&q=80',
      bannerUrl:
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
      leadName: 'Ananya Deshmukh',
      leadEmail: 'ananya.d@kalam.campusconnect.edu',
      memberCount: 160,
      isFeatured: false,
      socialLinks: {
        instagram: 'https://instagram.com/kalam_debate',
      },
      createdAt: new Date('2026-01-25T11:00:00Z'),
      updatedAt: new Date('2026-01-25T11:00:00Z'),
    },
  ];

  const events = [
    {
      _id: '674c20000000000000000021',
      title: 'HackNova 2026: 36-Hour National Collegiate Hackathon',
      slug: 'hacknova-2026-36-hour-hackathon',
      shortDescription:
        'Build cutting-edge AI, Web3, and sustainability solutions over 36 adrenaline-filled hours with top mentors and ₹3,50,000 in prizes.',
      description:
        'HackNova 2026 brings together over 400 collegiate coders, designers, and innovators from across the country. Over 36 non-stop hours, teams will brainstorm, prototype, and demo transformative tech applications across AI/ML, Decentralized Systems, FinTech, and Smart Campus Sustainability. Features keynote sessions by industry architects, 1-on-1 mentor sprint desks, midnight games, unlimited refreshments, and direct interview fast-tracks for winning teams.',
      club: '674c10000000000000000010',
      category: 'Hackathon',
      date: '2026-10-15',
      startTime: '09:00 AM',
      endTime: '09:00 PM',
      venue: 'Dr. APJ Abdul Kalam Convention Center, Hall A',
      locationType: 'In-Person',
      bannerUrl:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
      capacity: 350,
      registeredCount: 284,
      status: 'published',
      featured: true,
      tags: ['Hackathon', 'AI/ML', 'FullStack', 'PrizePool', 'Networking'],
      requirements: [
        'Valid College Identity Card',
        'Personal laptop and charger',
        'Team of 2 to 4 students',
      ],
      createdAt: new Date('2026-02-01T08:00:00Z'),
      updatedAt: new Date('2026-02-01T08:00:00Z'),
    },
    {
      _id: '674c20000000000000000022',
      title: 'Prompt to Production: Generative AI & Agentic Systems Workshop',
      slug: 'prompt-to-production-generative-ai-workshop',
      shortDescription:
        'Hands-on masterclass on building LLM orchestrations, RAG pipelines, and autonomous AI agents using LangChain and Gemini.',
      description:
        'Dive into modern software development powered by Generative AI. In this 5-hour immersive workshop, participants will build real-world autonomous coding and data reasoning agents from scratch. Learn function calling, semantic retrieval pipelines with vector databases, and evaluation metrics for production AI applications. Every attendee receives free cloud compute credits and a verified certificate of completion.',
      club: '674c10000000000000000010',
      category: 'Workshop',
      date: '2026-10-08',
      startTime: '10:00 AM',
      endTime: '03:30 PM',
      venue: 'Turing Computer Science Lab 402, Tech Block',
      locationType: 'In-Person',
      bannerUrl:
        'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
      capacity: 120,
      registeredCount: 114,
      status: 'published',
      featured: true,
      tags: ['Generative AI', 'Agents', 'Python', 'Hands-on', 'Workshop'],
      requirements: ['Basic Python programming knowledge', 'Laptop with VS Code installed'],
      createdAt: new Date('2026-02-05T09:00:00Z'),
      updatedAt: new Date('2026-02-05T09:00:00Z'),
    },
    {
      _id: '674c20000000000000000023',
      title: 'Autonomous Bot Maze Sprint & Robo-Wars Arena',
      slug: 'autonomous-bot-maze-sprint-robowars',
      shortDescription:
        'Witness high-torque autonomous line-followers, maze navigators, and 15kg featherweight combat robots battle for the championship.',
      description:
        'The arena is set! The Robotics & AI Society invites students and engineering hobbyists to test their autonomous algorithms and mechanical armor. The tournament comprises two divisions: The Autonomous Sensor-Maze Sprint and the high-octane Featherweight Battle Bot Arena. Special safety cages and livestreaming displays will be active throughout.',
      club: '674c10000000000000000011',
      category: 'Technical',
      date: '2026-10-22',
      startTime: '11:00 AM',
      endTime: '05:00 PM',
      venue: 'Central Open Air Quadrangle Arena',
      locationType: 'In-Person',
      bannerUrl:
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
      capacity: 250,
      registeredCount: 180,
      status: 'published',
      featured: false,
      tags: ['Robotics', 'Hardware', 'Sensors', 'Competition'],
      requirements: ['Bot inspection passes technical safety checks', 'Battery isolation switch mandatory'],
      createdAt: new Date('2026-02-10T10:00:00Z'),
      updatedAt: new Date('2026-02-10T10:00:00Z'),
    },
    {
      _id: '674c20000000000000000024',
      title: 'Founders Arena: Seed Pitch Brawl 2026',
      slug: 'founders-arena-seed-pitch-brawl',
      shortDescription:
        'Pitch your student startup to real venture capitalists, angel syndicates, and alumni founders for ₹10,00,000 in pre-seed grants.',
      description:
        'Are you solving a real problem with your campus project or startup? Step into the Founders Arena. 10 shortlisted student teams will get 7 minutes to pitch on stage followed by 5 minutes of rapid Q&A with venture capitalists from top investment funds. Audience members can vote for the "People\'s Choice Innovator Award".',
      club: '674c10000000000000000012',
      category: 'Seminar',
      date: '2026-10-28',
      startTime: '01:30 PM',
      endTime: '06:00 PM',
      venue: 'MBA Auditorium & Executive Lounge',
      locationType: 'In-Person',
      bannerUrl:
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
      capacity: 180,
      registeredCount: 142,
      status: 'published',
      featured: false,
      tags: ['Startups', 'Pitching', 'VentureCapital', 'Networking'],
      requirements: ['Pitch deck in PDF format', 'Minimum Viable Prototype or validation demo'],
      createdAt: new Date('2026-02-12T11:00:00Z'),
      updatedAt: new Date('2026-02-12T11:00:00Z'),
    },
    {
      _id: '674c20000000000000000025',
      title: 'DesignScape: 24-Hour UI/UX Design Sprint',
      slug: 'designscape-24-hour-ui-ux-design-sprint',
      shortDescription:
        'Design responsive design systems, micro-interactions, and accessible mobile apps solving real campus life challenges.',
      description:
        'Put your Figma superpowers to the test. Teams of 1-3 designers receive a surprise design brief at 10 AM on Saturday morning. You will conduct user research, formulate persona maps, draft wireframes, craft cohesive visual component systems, and present an interactive clickable prototype to senior product design leaders.',
      club: '674c10000000000000000013',
      category: 'Workshop',
      date: '2026-11-04',
      startTime: '10:00 AM',
      endTime: '06:00 PM',
      venue: 'Design Studio 3B, Creative Arts Wing',
      locationType: 'Hybrid',
      bannerUrl:
        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
      capacity: 100,
      registeredCount: 65,
      status: 'published',
      featured: false,
      tags: ['Design', 'Figma', 'UI/UX', 'ProductDesign'],
      requirements: ['Figma account', 'Basic understanding of design tokens and auto-layout'],
      createdAt: new Date('2026-02-15T12:00:00Z'),
      updatedAt: new Date('2026-02-15T12:00:00Z'),
    },
    {
      _id: '674c20000000000000000026',
      title: 'Vanguard: Inter-College Valorant & FIFA 26 Esports Showdown',
      slug: 'vanguard-inter-college-esports-showdown',
      shortDescription:
        'The ultimate college esports clash. Live shoutcasted matches on 144Hz setups with cash rewards and championship trophies.',
      description:
        'Spardha Esports Guild brings the biggest campus LAN tournament of the semester. Compete in 5v5 Valorant Spike Rush & Competitive Bracket, or 1v1 FIFA 26 on PlayStation 5. Full live stream broadcast on Twitch and YouTube with student commentary desks, energy drinks, and gaming merch giveaways.',
      club: '674c10000000000000000014',
      category: 'Sports',
      date: '2026-11-12',
      startTime: '10:00 AM',
      endTime: '08:00 PM',
      venue: 'Student Activity Center Esports Arena',
      locationType: 'In-Person',
      bannerUrl:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      capacity: 200,
      registeredCount: 160,
      status: 'published',
      featured: false,
      tags: ['Esports', 'Gaming', 'Valorant', 'FIFA', 'Tournament'],
      requirements: ['Riot Games / EA account in good standing', 'BYOP (Bring Your Own Peripherals permitted)'],
      createdAt: new Date('2026-02-18T15:00:00Z'),
      updatedAt: new Date('2026-02-18T15:00:00Z'),
    },
    {
      _id: '674c20000000000000000027',
      title: 'Echoes & Verses: Annual Campus Slam Poetry & Acoustic Night',
      slug: 'echoes-verses-slam-poetry-acoustic-night',
      shortDescription:
        'An enchanting evening of original spoken word, live acoustic harmonies, and candid storytelling under fairy lights.',
      description:
        'Unwind as the campus lawn transforms into an acoustic haven. Featuring 20 curated student poets sharing verses in English and regional languages, interspersed with mellow acoustic guitar covers, hot cocoa counters, and open mic segments for brave spontaneous souls.',
      club: '674c10000000000000000015',
      category: 'Cultural',
      date: '2026-11-18',
      startTime: '06:00 PM',
      endTime: '09:30 PM',
      venue: 'Amphitheatre Lawn, North Campus',
      locationType: 'In-Person',
      bannerUrl:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
      capacity: 300,
      registeredCount: 220,
      status: 'published',
      featured: false,
      tags: ['Poetry', 'Music', 'OpenMic', 'Acoustic', 'Cultural'],
      requirements: ['Original written piece if registering for spoken mic performance'],
      createdAt: new Date('2026-02-20T16:00:00Z'),
      updatedAt: new Date('2026-02-20T16:00:00Z'),
    },
  ];

  const registrations = [
    {
      _id: '674c30000000000000000031',
      registrationId: 'CC-2026-H8K3A1',
      event: '674c20000000000000000021',
      fullName: 'Rohan Mehra',
      email: 'rohan.mehra@student.edu',
      college: 'Institute of Technology & Science',
      academicYear: '3rd Year',
      phone: '+91 98765 43210',
      status: 'Confirmed',
      notes: 'Interested in AI Track',
      registeredAt: new Date('2026-02-15T10:14:00Z'),
    },
    {
      _id: '674c30000000000000000032',
      registrationId: 'CC-2026-T9B2L5',
      event: '674c20000000000000000021',
      fullName: 'Pooja Krishnan',
      email: 'pooja.k@university.ac.in',
      college: 'National University of Engineering',
      academicYear: '2nd Year',
      phone: '+91 91234 56789',
      status: 'Confirmed',
      notes: 'Team Lead - AlphaBits',
      registeredAt: new Date('2026-02-16T14:22:00Z'),
    },
    {
      _id: '674c30000000000000000033',
      registrationId: 'CC-2026-M4P7Q8',
      event: '674c20000000000000000022',
      fullName: 'Siddharth Roy',
      email: 'siddharth.roy@campus.edu',
      college: 'City Engineering College',
      academicYear: '4th Year',
      phone: '+91 98111 22334',
      status: 'Confirmed',
      notes: 'Bringing laptop with CUDA GPU',
      registeredAt: new Date('2026-02-18T09:40:00Z'),
    },
    {
      _id: '674c30000000000000000034',
      registrationId: 'CC-2026-X1Z9R4',
      event: '674c20000000000000000024',
      fullName: 'Tanvi Agarwal',
      email: 'tanvi.agarwal@ventures.edu',
      college: 'School of Management & Enterprise',
      academicYear: 'Post Graduate',
      phone: '+91 97766 55443',
      status: 'Confirmed',
      notes: 'Pitching AgriTech platform',
      registeredAt: new Date('2026-02-22T11:05:00Z'),
    },
  ];

  return { admin, clubs, events, registrations };
};
