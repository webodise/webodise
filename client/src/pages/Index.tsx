import { Link } from "react-router-dom";
import {
  Globe, Server, Code2, Wrench, Zap, DollarSign, Puzzle, Rocket, Headphones,
  Search, Palette, CodeXml, CloudUpload, LifeBuoy, ArrowRight, Check, Star, Quote,
  ExternalLink, Layout
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import TechMarquee from "@/components/TechMarquee";
import { packages } from "@/data/packages";
import { templates } from "@/data/templates";

const services = [
  { icon: Globe, title: "Website Development", desc: "Modern, responsive websites that convert visitors into customers." },
  { icon: Server, title: "Management Systems", desc: "Custom ERP, school, office & inventory management solutions." },
  { icon: Code2, title: "Custom Software", desc: "Tailored software built for your unique business needs." },
  { icon: Wrench, title: "Hosting & Maintenance", desc: "Reliable hosting, updates, and ongoing technical support." },
];

const whyUs = [
  { icon: Zap, title: "Modern Tech Stack", desc: "Built with the latest frameworks and tools." },
  { icon: DollarSign, title: "Affordable Pricing", desc: "Premium quality at competitive prices." },
  { icon: Puzzle, title: "Custom Solutions", desc: "Every project tailored to your needs." },
  { icon: Rocket, title: "Fast Delivery", desc: "On-time delivery, every time." },
  { icon: Headphones, title: "Reliable Support", desc: "Dedicated support when you need it." },
];

const process = [
  { icon: Search, label: "Discover", desc: "Understanding your goals" },
  { icon: Palette, label: "Design", desc: "Crafting the experience" },
  { icon: CodeXml, label: "Develop", desc: "Building with precision" },
  { icon: CloudUpload, label: "Deploy", desc: "Launching your product" },
  { icon: LifeBuoy, label: "Support", desc: "Ongoing partnership" },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Founder, TechStart India",
    text: "Webodise Labs delivered our website in record time. The quality exceeded our expectations and the pricing was very reasonable.",
    rating: 5,
  },
  {
    name: "Priya Gupta",
    role: "Principal, DPS Academy",
    text: "Their school management system transformed how we handle admissions, attendance, and fee collection. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "CEO, RetailHub",
    text: "The e-commerce platform they built handles thousands of orders daily without any issues. Great team and amazing support.",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    role: "Director, GreenLeaf Organics",
    text: "Professional, responsive, and affordable. They understood our vision perfectly and delivered a stunning website.",
    rating: 5,
  },
];

const topPackages = packages.slice(0, 3);

export default function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30 dark:opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative container-narrow section-padding !pt-3 sm:!pt-16 lg:!pt-20 !pb-20">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6 tracking-wide uppercase">
              Digital Innovation Lab
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight text-foreground mb-6">
              We Don't Just Build Websites.{" "}
              <span className="gradient-text">We Build Digital Systems.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Websites, management systems & custom software for growing businesses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                Get a Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#templates"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-colors"
              >
                View Our Work
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 sm:px-6 lg:px-8 py-0 sm:py-16 lg:py-24">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">Services That Drive Growth</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">End-to-end digital solutions tailored for your business.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <s.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2 text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">Why Webodise Labs</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">Built Different. Built Better.</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">Here's what sets us apart from the rest.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {whyUs.map((item) => (
              <div key={item.title} className="glass-card p-6 text-center hover:scale-[1.02] transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">Plans That Fit Your Budget</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">Transparent pricing with no hidden fees. All plans include free domain & hosting for 1 year.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {topPackages.map((plan) => (
              <div
                key={plan.slug}
                className={`glass-card p-7 relative flex flex-col ${plan.popular ? "ring-2 ring-primary scale-[1.02]" : ""
                  }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-bold text-xl text-foreground">{plan.name}</h3>
                <div className="mt-3 mb-3">
                  <span className="text-3xl font-display font-bold text-foreground">{plan.price}</span>
                  {plan.period !== "custom" && (
                    <span className="text-sm text-muted-foreground ml-1">/ {plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-5">{plan.tagline}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25"
                      : "bg-muted/50 text-foreground hover:bg-muted border border-border"
                    }`}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              View All Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">Our Process</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">From Idea to Impact</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">A streamlined process designed for speed and quality.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            {process.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="glass-card p-6 text-center w-44">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-display font-semibold text-foreground text-sm">{step.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                </div>
                {i < process.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-2 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects & Templates */}
      <section id="templates" className="section-padding">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">Our Work</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">Templates & Projects Delivered</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">A showcase of our recent work and ready-to-use templates. Click any card to explore details.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Link key={template.slug} to={`/templates/${template.slug}`} className="glass-card overflow-hidden group block hover:scale-[1.02] transition-transform duration-300 relative">
                {template.demoUrl && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/90 text-primary-foreground text-xs font-semibold">
                      <ExternalLink className="w-3 h-3" /> Live Demo
                    </span>
                  </div>
                )}
                <div className="h-40 bg-gradient-to-br from-primary/20 via-accent/10 to-cyan/10 flex items-center justify-center">
                  <Layout className="w-12 h-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
                </div>
                <div className="p-6">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                    {template.category}
                  </span>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{template.desc}</p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3">
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">What Our Clients Say</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">Real feedback from businesses we've helped grow.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6 flex flex-col">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">"{t.text}"</p>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Marquee */}
      <TechMarquee />

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="glass-card p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
                Let's build something <span className="gradient-text">powerful</span> together.
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Ready to transform your business with cutting-edge digital solutions?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
