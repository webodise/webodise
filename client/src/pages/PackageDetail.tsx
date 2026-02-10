import { useParams, Link, Navigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Globe, Server, Shield, Clock, Layers, Palette, Search, Lock } from "lucide-react";
import { SectionHeading } from "@/components/shared";
import { motion } from "framer-motion";
import { packages } from "@/data/packages";

const techLogos: Record<string, string> = {
  "HTML": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "TypeScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "Bootstrap": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
  "Tailwind CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "Material UI": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/materialui/materialui-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "Express.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  "MongoDB": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  "REST APIs": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
};

export default function PackageDetail() {
  const { slug } = useParams();
  const pkg = packages.find((p) => p.slug === slug);

  if (!pkg) return <Navigate to="/pricing" replace />;

  const detailSections = [
    { icon: Layers, label: "Pages", value: pkg.details.pages },
    { icon: Palette, label: "Design", value: pkg.details.design },
    { icon: Search, label: "SEO", value: pkg.details.seo },
    { icon: Lock, label: "Security", value: pkg.details.security },
  ];

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <Link to="/pricing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Pricing
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {pkg.popular && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground mb-4">Most Popular</span>
              )}
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">{pkg.name} Package</h1>
              <p className="text-lg text-muted-foreground mb-4">{pkg.desc}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-display font-bold text-foreground">{pkg.price}</span>
                {pkg.period !== "custom" && <span className="text-muted-foreground">/ {pkg.period}</span>}
              </div>
            </motion.div>

            {/* Details Grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-display font-bold text-xl text-foreground mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detailSections.map((s) => (
                  <div key={s.label} className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-display font-semibold text-foreground text-sm">{s.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Extras */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display font-bold text-xl text-foreground mb-4">Additional Features</h2>
              <div className="glass-card p-6">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.details.extras.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Technologies */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-display font-bold text-xl text-foreground mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {pkg.technologies.map((tech) => (
                  <div key={tech} className="glass-card px-4 py-3 flex items-center gap-2">
                    {techLogos[tech] ? (
                      <img src={techLogos[tech]} alt={tech} className="w-6 h-6" />
                    ) : (
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{tech[0]}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground">{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6 sticky top-28">
              <h3 className="font-display font-bold text-lg text-foreground mb-4">All Features</h3>
              <ul className="space-y-3 mb-6">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Domain & Hosting</p>
                    <p className="text-xs text-muted-foreground">{pkg.hosting.free}</p>
                    <p className="text-xs text-muted-foreground">{pkg.hosting.renewal}</p>
                    <p className="text-xs text-primary font-medium">{pkg.hosting.bulk}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Maintenance</p>
                    <p className="text-xs text-muted-foreground">{pkg.maintenance.free}</p>
                    <p className="text-xs text-muted-foreground">{pkg.maintenance.after}</p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity w-full"
              >
                {pkg.period === "custom" ? "Contact Us" : "Get Started"} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
