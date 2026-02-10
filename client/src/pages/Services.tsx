import { Link } from "react-router-dom";
import { Globe, Server, Code2, Wrench, ArrowRight, Monitor, ShoppingCart, Database, Building2, BookOpen, Package } from "lucide-react";
import { SectionHeading, AnimatedCard } from "@/components/shared";
import { motion } from "framer-motion";

const services = [
  {
    icon: Globe,
    title: "Website Development",
    desc: "Beautiful, fast, responsive websites built with modern frameworks.",
    features: [
      { icon: Monitor, label: "Static Websites", detail: "Portfolio, landing pages, informational sites" },
      { icon: Code2, label: "Dynamic Websites", detail: "Full-stack web apps with admin panels" },
      { icon: ShoppingCart, label: "E-commerce", detail: "Online stores with payments and inventory" },
    ],
  },
  {
    icon: Server,
    title: "Management Systems",
    desc: "Streamline operations with custom-built management platforms.",
    features: [
      { icon: BookOpen, label: "School Management", detail: "Student, teacher, attendance & grading" },
      { icon: Building2, label: "Office Management", detail: "HR, task tracking, and reporting" },
      { icon: Package, label: "Inventory & ERP", detail: "Stock, orders, supply chain management" },
    ],
  },
  {
    icon: Code2,
    title: "Custom Software Solutions",
    desc: "Purpose-built software for your unique challenges.",
    features: [
      { icon: Database, label: "API Development", detail: "RESTful & GraphQL APIs" },
      { icon: Server, label: "Automation Tools", detail: "Workflow and process automation" },
      { icon: Code2, label: "Integrations", detail: "Third-party service integrations" },
    ],
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    desc: "Keep your systems running smoothly with our expert support.",
    features: [
      { icon: Wrench, label: "Bug Fixes", detail: "Quick fixes and patches" },
      { icon: Globe, label: "Hosting", detail: "Reliable hosting solutions" },
      { icon: Wrench, label: "Updates", detail: "Regular updates and improvements" },
    ],
  },
];

export default function Services() {
  return (
    <>
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading
            badge="Our Services"
            title="Everything You Need to Go Digital"
            description="From concept to deployment — we handle the full digital lifecycle."
          />

          <div className="space-y-12">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-8"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3">
                    <service.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.desc}</p>
                  </div>
                  <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {service.features.map((f) => (
                      <div key={f.label} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <f.icon className="w-6 h-6 text-primary mb-2" />
                        <h4 className="font-display font-semibold text-foreground text-sm">{f.label}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{f.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Need a custom solution?
          </h2>
          <p className="text-muted-foreground mb-8">Let's discuss your project requirements.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
