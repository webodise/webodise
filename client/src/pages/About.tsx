import { motion } from "framer-motion";
import { Section, SectionTitle, AnimatedCard } from "@/components/ui/Section";
import { Eye, Target, UserCheck, Building2, BookOpen, Laptop, Dumbbell, FlaskConical } from "lucide-react";

const facilities = [
  { icon: BookOpen, title: "Library", desc: "Well-stocked library with thousands of books and digital resources." },
  { icon: Laptop, title: "Computer Lab", desc: "Modern computer lab with internet connectivity for digital learning." },
  { icon: FlaskConical, title: "Science Lab", desc: "Equipped science laboratories for practical learning experiences." },
  { icon: Dumbbell, title: "Sports Ground", desc: "Spacious sports ground for cricket, football, and athletics." },
];

const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">About Us</h1>
            <p className="text-primary-foreground/80 text-lg">
              Learn about our journey, values, and commitment to shaping bright futures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle title="Our Story" center={false} />
            <p className="text-muted-foreground leading-relaxed mb-4">
              Jyoti Public School was established with the vision of providing accessible, quality education to the children of Saharsa and surrounding areas. Since our inception, we have been committed to creating an environment where learning is enjoyable and every student is encouraged to reach their full potential.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our school combines modern teaching methodologies with traditional values, ensuring that our students are not only academically proficient but also morally grounded individuals ready to take on the challenges of the future.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Eye, label: "Vision", color: "gradient-hero" },
              { icon: Target, label: "Mission", color: "gradient-accent" },
              { icon: UserCheck, label: "Values", color: "gradient-hero" },
              { icon: Building2, label: "Campus", color: "gradient-accent" },
            ].map((item) => (
              <div key={item.label} className={`${item.color} rounded-2xl p-8 text-center text-primary-foreground`}>
                <item.icon className="w-10 h-10 mx-auto mb-3" />
                <span className="font-semibold">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section className="gradient-subtle">
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedCard className="p-10">
            <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be a beacon of quality education in Bihar, nurturing students who are intellectually capable, morally upright, and socially responsible. We envision a school where every child discovers their unique strengths and develops the confidence to pursue their dreams.
            </p>
          </AnimatedCard>
          <AnimatedCard className="p-10" delay={0.2}>
            <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To provide holistic education that combines academic excellence with character building. We aim to create a supportive and stimulating learning environment that fosters curiosity, creativity, and critical thinking in every student.
            </p>
          </AnimatedCard>
        </div>
      </Section>

      {/* Principal's Message */}
      <Section>
        <SectionTitle title="Principal's Message" />
        <AnimatedCard className="p-10 md:p-14 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-12 h-12 text-primary-foreground" />
            </div>
            <blockquote className="text-lg text-muted-foreground leading-relaxed italic mb-6">
              "Education is the most powerful tool for transforming lives. At Jyoti Public School, we strive to create an environment where every student feels valued, motivated, and inspired to achieve excellence. Our dedicated faculty works tirelessly to ensure that learning goes beyond textbooks and examinations."
            </blockquote>
            <p className="font-semibold text-foreground">— Principal, Jyoti Public School</p>
          </div>
        </AnimatedCard>
      </Section>

      {/* Facilities */}
      <Section className="gradient-subtle">
        <SectionTitle title="Our Facilities" subtitle="Modern infrastructure for a complete learning experience" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((item, i) => (
            <AnimatedCard key={item.title} delay={i * 0.1} className="p-8 text-center">
              <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </Section>
    </>
  );
};

export default About;
