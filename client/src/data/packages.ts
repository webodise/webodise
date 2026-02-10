export interface PackageData {
  slug: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  desc: string;
  popular: boolean;
  features: string[];
  technologies: string[];
  details: {
    pages: string;
    design: string;
    seo: string;
    security: string;
    extras: string[];
  };
  hosting: {
    free: string;
    renewal: string;
    bulk: string;
  };
  maintenance: {
    free: string;
    after: string;
  };
}

export const packages: PackageData[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "₹15,000",
    period: "one-time",
    tagline: "Perfect for individuals & small businesses getting online.",
    desc: "A clean, responsive static website to establish your online presence.",
    popular: false,
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Basic SEO setup",
      "Contact form",
      "WhatsApp integration",
      "Free domain (1 year)",
      "Free hosting (1 year)",
      "1 year free maintenance",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    details: {
      pages: "Up to 5 static pages (Home, About, Services, Contact, etc.)",
      design: "Clean, mobile-responsive layout with modern UI",
      seo: "Basic on-page SEO with meta tags and sitemap",
      security: "SSL certificate included",
      extras: ["Social media links", "Google Maps embed", "Basic analytics setup"],
    },
    hosting: {
      free: "Domain + Hosting free for 1 year",
      renewal: "Renewal charges apply yearly after 1st year",
      bulk: "Save more — pay for up to 3 years at once",
    },
    maintenance: {
      free: "1 year free maintenance (bug fixes & minor updates)",
      after: "Additional features or changes charged per requirement",
    },
  },
  {
    slug: "professional",
    name: "Professional",
    price: "₹25,000",
    period: "one-time",
    tagline: "For growing businesses that need a dynamic online presence.",
    desc: "A dynamic website with admin panel and interactive features.",
    popular: false,
    features: [
      "Up to 10 pages",
      "Custom responsive design",
      "Dynamic content management",
      "Admin panel",
      "Advanced SEO",
      "Contact & inquiry forms",
      "Free domain (1 year)",
      "Free hosting (1 year)",
      "1 year free maintenance",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    details: {
      pages: "Up to 10 dynamic pages with content management",
      design: "Custom UI/UX design with animations & interactions",
      seo: "Advanced SEO with schema markup & performance optimization",
      security: "SSL + JWT authentication for admin panel",
      extras: ["Blog section", "Image gallery", "Newsletter integration", "Admin dashboard"],
    },
    hosting: {
      free: "Domain + Hosting free for 1 year",
      renewal: "Renewal charges apply yearly after 1st year",
      bulk: "Save more — pay for up to 3 years at once",
    },
    maintenance: {
      free: "1 year free maintenance (bug fixes & minor updates)",
      after: "Additional features or changes charged per requirement",
    },
  },
  {
    slug: "business",
    name: "Business",
    price: "₹45,000",
    period: "one-time",
    tagline: "For established businesses needing full-featured websites.",
    desc: "Complete business website with CMS, e-commerce ready & advanced features.",
    popular: true,
    features: [
      "Up to 20 pages",
      "Premium custom design",
      "Full CMS integration",
      "E-commerce ready",
      "Payment gateway (Razorpay)",
      "Google Authentication",
      "REST API integration",
      "Free domain (1 year)",
      "Free hosting (1 year)",
      "1 year free maintenance",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "TypeScript", "Tailwind CSS", "Material UI", "Node.js", "Express.js", "MongoDB", "REST APIs", "Razorpay", "Google Authentication", "JWT"],
    details: {
      pages: "Up to 20 pages with full content management system",
      design: "Premium UI/UX with micro-interactions & glassmorphism",
      seo: "Complete SEO suite with analytics & performance tracking",
      security: "SSL + JWT + Google Auth + role-based access control",
      extras: ["E-commerce functionality", "Razorpay payment gateway", "User authentication", "Product/service listings", "Order management", "Email notifications"],
    },
    hosting: {
      free: "Domain + Hosting free for 1 year",
      renewal: "Renewal charges apply yearly after 1st year",
      bulk: "Save more — pay for up to 3 years at once",
    },
    maintenance: {
      free: "1 year free maintenance (bug fixes & minor updates)",
      after: "Additional features or changes charged per requirement",
    },
  },
  {
    slug: "premium",
    name: "Premium",
    price: "₹75,000",
    period: "one-time",
    tagline: "Advanced solutions for businesses needing management systems.",
    desc: "Full-scale management system — School, Office, Inventory, or ERP with cloud database.",
    popular: false,
    features: [
      "Unlimited pages",
      "Custom management system",
      "Cloud database integration",
      "Advanced admin panel",
      "Multi-user roles & permissions",
      "Automated reports & analytics",
      "Payment gateway integration",
      "API integrations",
      "Free domain (1 year)",
      "Free hosting (1 year)",
      "1 year free maintenance",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "TypeScript", "Tailwind CSS", "Material UI", "Node.js", "Express.js", "MongoDB", "Cloud Databases", "REST APIs", "Razorpay", "Google Authentication", "JWT"],
    details: {
      pages: "Unlimited pages with modular dashboard architecture",
      design: "Enterprise-grade UI with data visualization & real-time updates",
      seo: "Full SEO + performance optimization + CDN setup",
      security: "Multi-layer security — SSL, JWT, OAuth, role-based access, data encryption",
      extras: ["School/Office/Inventory management modules", "Automated reporting", "Data export (CSV/PDF)", "Multi-user dashboard", "Real-time notifications", "Backup & recovery system"],
    },
    hosting: {
      free: "Domain + Hosting free for 1 year",
      renewal: "Renewal charges apply yearly after 1st year",
      bulk: "Save more — pay for up to 3 years at once",
    },
    maintenance: {
      free: "1 year free maintenance (bug fixes & minor updates)",
      after: "Additional features or changes charged per requirement",
    },
  },
  {
    slug: "mnc-enterprise",
    name: "MNC Enterprise",
    price: "₹1,50,000+",
    period: "custom",
    tagline: "Full-scale enterprise solution for MNC-level businesses.",
    desc: "Complete digital ecosystem — custom ERP, CRM, multi-platform, dedicated team & SLA guarantee.",
    popular: false,
    features: [
      "Unlimited pages & modules",
      "Custom ERP / CRM system",
      "Multi-platform (Web + Mobile API)",
      "Microservices architecture",
      "Dedicated development team",
      "CI/CD pipeline setup",
      "Load balancing & auto-scaling",
      "Priority 24/7 support",
      "SLA guarantee",
      "Training & documentation",
      "Free domain (1 year)",
      "Free hosting (1 year)",
      "1 year free maintenance",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "TypeScript", "Bootstrap", "Tailwind CSS", "Material UI", "Node.js", "Express.js", "MongoDB", "Cloud Databases", "REST APIs", "Razorpay", "Google Authentication", "JWT"],
    details: {
      pages: "Unlimited — fully modular enterprise architecture",
      design: "Bespoke enterprise design system with white-labeling support",
      seo: "Enterprise SEO + CDN + edge caching + performance monitoring",
      security: "Enterprise-grade — SSL, JWT, OAuth 2.0, 2FA, audit logs, data encryption, GDPR compliance",
      extras: ["Custom ERP/CRM modules", "Microservices architecture", "CI/CD deployment pipeline", "Load balancing & auto-scaling", "Dedicated project manager", "Staff training sessions", "Comprehensive documentation", "SLA with uptime guarantee", "Quarterly reviews & optimization"],
    },
    hosting: {
      free: "Domain + Hosting free for 1 year",
      renewal: "Renewal charges apply yearly after 1st year",
      bulk: "Save more — pay for up to 3 years at once",
    },
    maintenance: {
      free: "1 year free maintenance (bug fixes, updates & support)",
      after: "Additional features or changes charged per requirement",
    },
  },
];
