import { motion } from "framer-motion";
import { Section, SectionTitle, AnimatedCard } from "@/components/ui/Section";
import { BookOpen, ClipboardCheck, Users, Award, GraduationCap } from "lucide-react";

const classes = [
  "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3",
  "Class 4", "Class 5", "Class 6", "Class 7", "Class 8",
  "Class 9", "Class 10",
];

const methodologies = [
  { icon: BookOpen, title: "Interactive Learning", desc: "Engaging teaching methods that encourage participation and curiosity." },
  { icon: Users, title: "Small Class Sizes", desc: "Personal attention with manageable student-teacher ratios." },
  { icon: ClipboardCheck, title: "Regular Assessment", desc: "Continuous evaluation to track progress and identify improvement areas." },
  { icon: Award, title: "Skill Development", desc: "Focus on communication, leadership, and problem-solving skills." },
];

const Academics = () => {
  return (
    <>
      <section className="gradient-hero py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Academics</h1>
            <p className="text-primary-foreground/80 text-lg">
              A comprehensive curriculum designed for academic excellence and holistic development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Classes Offered */}
      <Section>
        <SectionTitle title="Classes Offered" subtitle="From Nursery to Class 10 with comprehensive CBSE-aligned curriculum" />
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {classes.map((cls, i) => (
            <motion.div
              key={cls}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-card shadow-card hover:shadow-card-hover transition-shadow px-6 py-3 rounded-xl font-medium text-foreground border border-border"
            >
              {cls}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Curriculum */}
      <Section className="gradient-subtle">
        <SectionTitle title="Curriculum" subtitle="Well-structured academic programs for every stage of learning" />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <AnimatedCard className="p-8">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Primary (Nursery – Class 5)</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• English, Hindi, Mathematics</li>
              <li>• Environmental Science (EVS)</li>
              <li>• General Knowledge & Computer Basics</li>
              <li>• Art, Craft & Physical Education</li>
              <li>• Moral Science & Value Education</li>
            </ul>
          </AnimatedCard>
          <AnimatedCard className="p-8" delay={0.15}>
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Secondary (Class 6 – Class 10)</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• English, Hindi, Sanskrit</li>
              <li>• Mathematics & Science</li>
              <li>• Social Science & Computer Science</li>
              <li>• Physical Education & Sports</li>
              <li>• Board Exam Preparation</li>
            </ul>
          </AnimatedCard>
        </div>
      </Section>

      {/* Teaching Methodology */}
      <Section>
        <SectionTitle title="Teaching Methodology" subtitle="Modern approaches to deliver effective and engaging education" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {methodologies.map((item, i) => (
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

      {/* Exams & Results */}
      <Section className="gradient-subtle">
        <SectionTitle title="Exams & Results" subtitle="Transparent and fair assessment system for academic growth" />
        <div className="max-w-3xl mx-auto">
          <AnimatedCard className="p-10">
            <div className="space-y-6">
              {[
                { title: "Unit Tests", desc: "Monthly tests to assess chapter-wise understanding and progress." },
                { title: "Half-Yearly Exams", desc: "Comprehensive mid-year examinations covering the first semester syllabus." },
                { title: "Annual Exams", desc: "Final examinations covering the complete academic year curriculum." },
                { title: "Board Exams", desc: "Thorough preparation for Class 10 board examinations with mock tests." },
              ].map((exam, i) => (
                <div key={exam.title} className={`flex items-start gap-4 ${i < 3 ? "pb-6 border-b border-border" : ""}`}>
                  <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center shrink-0">
                    <ClipboardCheck className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{exam.title}</h4>
                    <p className="text-sm text-muted-foreground">{exam.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </Section>
    </>
  );
};

export default Academics;
