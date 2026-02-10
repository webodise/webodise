import { Link } from "react-router-dom";
import { Check, ArrowRight, Globe, Server, Shield, Clock } from "lucide-react";
import { SectionHeading } from "@/components/shared";
import { motion } from "framer-motion";
import { packages } from "@/data/packages";

export default function Pricing() {
  return (
    <>
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading
            badge="Pricing"
            title="Simple, Transparent Pricing"
            description="Choose the plan that fits your needs. No hidden fees. All plans include free domain & hosting for 1 year."
          />

          {/* Common benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-14">
            {[
              { icon: Globe, text: "Free Domain (1 Year)" },
              { icon: Server, text: "Free Hosting (1 Year)" },
              { icon: Shield, text: "1 Year Free Maintenance" },
              { icon: Clock, text: "Save with 3-Year Plans" },
            ].map((item) => (
              <div key={item.text} className="glass-card p-4 flex items-center gap-3">
                <item.icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {packages.map((plan, i) => (
              <motion.div
                key={plan.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`glass-card p-6 relative flex flex-col ${
                  plan.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-bold text-lg text-foreground">{plan.name}</h3>
                <div className="mt-3 mb-2">
                  <span className="text-3xl font-display font-bold text-foreground">{plan.price}</span>
                  {plan.period !== "custom" && (
                    <span className="text-xs text-muted-foreground ml-1">/ {plan.period}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-4">{plan.tagline}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.slice(0, 7).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.features.length > 7 && (
                    <li className="text-xs text-primary font-medium">+{plan.features.length - 7} more</li>
                  )}
                </ul>
                <div className="space-y-2">
                  <Link
                    to={`/pricing/${plan.slug}`}
                    className="block text-center px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to="/contact"
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {plan.period === "custom" ? "Contact Us" : "Get Started"} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Hosting & maintenance note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 max-w-3xl mx-auto mt-14 text-center"
          >
            <h3 className="font-display font-bold text-xl text-foreground mb-4">📌 Important Notes</h3>
            <div className="space-y-3 text-sm text-muted-foreground text-left max-w-xl mx-auto">
              <p>🌐 <strong className="text-foreground">Domain & Hosting:</strong> Free for 1 year with every plan. Yearly renewal charges apply after that.</p>
              <p>📦 <strong className="text-foreground">Bulk Savings:</strong> Pay for up to 3 years of hosting at once and save on renewal costs.</p>
              <p>🔧 <strong className="text-foreground">Maintenance:</strong> 1 year free maintenance included. Bug fixes and minor updates covered.</p>
              <p>➕ <strong className="text-foreground">Additional Work:</strong> Any new features or major changes after delivery will be charged as per requirement.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
