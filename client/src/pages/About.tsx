import { motion } from "framer-motion";
import { Target, Eye, Heart, Lightbulb, Shield, Users } from "lucide-react";
import { SectionHeading, AnimatedCard } from "@/components/shared";

const values = [
  { icon: Lightbulb, title: "Innovation", desc: "We experiment, iterate, and push boundaries." },
  { icon: Shield, title: "Reliability", desc: "Solutions built to last, backed by support." },
  { icon: Users, title: "Partnership", desc: "We succeed when our clients succeed." },
  { icon: Heart, title: "Passion", desc: "Every project is crafted with care and purpose." },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
              A Lab for <span className="gradient-text">Digital Innovation</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Webodise Labs is a digital innovation lab focused on building smart, scalable and affordable
              digital solutions. We help schools, startups, offices, and growing businesses transform their
              operations with modern technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimatedCard>
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display font-bold text-xl text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower businesses with accessible, high-quality digital tools that drive efficiency,
                growth, and innovation — without the enterprise price tag.
              </p>
            </AnimatedCard>
            <AnimatedCard delay={0.1}>
              <Eye className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display font-bold text-xl text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the go-to digital partner for growing businesses worldwide — known for
                innovation, reliability, and results that matter.
              </p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading badge="Our Values" title="What Drives Us" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <AnimatedCard key={v.title} delay={i * 0.1} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
