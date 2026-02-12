import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Award, Users, BookOpen, Bell, ArrowRight, Star, Shield, Trophy } from "lucide-react";
import { Section, SectionTitle, AnimatedCard } from "@/components/ui/Section";
import heroImage from "@/assets/hero-school.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const DEFAULT_ADMISSIONS_BADGE_TEXT = "Admissions Open 2026-27";

const highlights = [
  { icon: BookOpen, title: "Quality Education", desc: "Comprehensive curriculum with experienced faculty dedicated to academic excellence." },
  { icon: Shield, title: "Discipline & Values", desc: "Building strong character through discipline, moral values, and ethical practices." },
  { icon: Trophy, title: "Co-curricular Activities", desc: "Sports, arts, and cultural programs for all-round personality development." },
  { icon: Award, title: "Outstanding Results", desc: "Consistently excellent board results and academic achievements year after year." },
];


type NoticeItem = {
  id: string;
  text: string;
  noticeDate?: string;
  createdAt?: string;
};

const Index = () => {
  const [noticeItems, setNoticeItems] = useState<NoticeItem[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [admissionsBadgeText, setAdmissionsBadgeText] = useState(DEFAULT_ADMISSIONS_BADGE_TEXT);

  useEffect(() => {
    let cancelled = false;

    async function loadNotices() {
      setNoticesLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/notices`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || "Failed to load notices");
        }
        if (!cancelled) {
          setNoticeItems(Array.isArray(data.notices) ? data.notices : []);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setNoticeItems([]);
        }
      } finally {
        if (!cancelled) {
          setNoticesLoading(false);
        }
      }
    }

    async function loadAdmissionsBadge() {
      try {
        const response = await fetch(`${API_BASE}/api/site-settings/admissions-badge`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || "Failed to load admission badge");
        }

        const badgeText = String(data.text || "").trim();
        if (!cancelled) {
          setAdmissionsBadgeText(badgeText || DEFAULT_ADMISSIONS_BADGE_TEXT);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setAdmissionsBadgeText(DEFAULT_ADMISSIONS_BADGE_TEXT);
        }
      }
    }

    loadNotices();
    loadAdmissionsBadge();

    return () => {
      cancelled = true;
    };
  }, []);

  function formatNoticeDate(notice: NoticeItem): string {
    const rawDate = notice.noticeDate || notice.createdAt;
    if (!rawDate) return "Recent update";

    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) return "Recent update";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Jyoti Public School Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground">{admissionsBadgeText}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Jyoti Public School
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl">
              Illuminating minds, shaping futures. Providing quality education with values, discipline, and a nurturing environment in Saharsa, Bihar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 gradient-accent text-accent-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-hero"
              >
                Apply for Admission <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground border border-primary-foreground/20 px-8 py-4 rounded-xl font-semibold hover:bg-primary-foreground/20 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Intro */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Welcome to <span className="text-gradient">Jyoti Public School</span>
            </h2>
            <div className="w-16 h-1 gradient-accent rounded-full mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-4">
              Jyoti Public School, located in Saharsa, Bihar, is committed to providing a well-rounded education that combines academic excellence with character development. Our dedicated team of educators ensures every student receives personalized attention.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We believe in creating a supportive learning environment where students can explore their potential, develop critical thinking skills, and grow into responsible citizens of tomorrow.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Learn More About Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-hero rounded-2xl p-10 flex items-center justify-center"
          >
            <div className="text-center text-primary-foreground">
              <GraduationCap className="w-20 h-20 mx-auto mb-6 animate-float" />
              <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
              <p className="opacity-80 max-w-sm">
                To empower students with knowledge, skills, and values to excel in every walk of life.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Highlights */}
      <Section className="gradient-subtle">
        <SectionTitle title="Why Choose Us" subtitle="We provide a holistic learning experience that shapes future leaders" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, i) => (
            <AnimatedCard key={item.title} delay={i * 0.1} className="p-8 text-center group">
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </Section>

      {/* Notice Board */}
      <Section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <SectionTitle title="Notice Board" subtitle="Stay updated with the latest announcements and events" />
        <div className="relative max-w-3xl mx-auto">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-accent">
                <Bell className="w-4 h-4 text-accent-foreground" />
              </span>
              School Updates
            </div>
            {!noticesLoading && noticeItems.length > 0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {noticeItems.length} notice{noticeItems.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {noticesLoading ? (
            <AnimatedCard className="p-5 mb-4 border border-slate-200 bg-white/90 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loading...</p>
                  <p className="text-foreground font-medium">Fetching latest notices</p>
                </div>
              </div>
            </AnimatedCard>
          ) : noticeItems.length === 0 ? (
            <AnimatedCard className="p-6 mb-4 border border-dashed border-slate-300 bg-white/80 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-accent">
                <Bell className="w-5 h-5 text-accent-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Notice Board</p>
              <p className="text-foreground font-medium">No notices available right now.</p>
            </AnimatedCard>
          ) : (
            noticeItems.map((notice, i) => (
              <AnimatedCard
                key={notice.id || `${notice.text}-${i}`}
                delay={i * 0.08}
                className={`p-5 mb-4 border shadow-sm ${
                  i === 0
                    ? "border-accent/30 bg-gradient-to-r from-accent/10 via-white to-white"
                    : "border-slate-200 bg-white/90"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      i === 0 ? "gradient-accent" : "bg-slate-800"
                    }`}
                  >
                    <Bell className={`w-5 h-5 ${i === 0 ? "text-accent-foreground" : "text-white"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm text-muted-foreground">{formatNoticeDate(notice)}</p>
                      {i === 0 && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-foreground font-medium leading-relaxed mt-1">{notice.text}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))
          )}
        </div>
      </Section>

      {/* CTA */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Begin Your Child's Journey With Us
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Admissions are now open for the 2026–27 session. Give your child the gift of quality education.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 gradient-accent text-accent-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Apply Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 px-8 py-4 rounded-xl font-semibold hover:bg-primary-foreground/20 transition-colors"
              >
                <Users className="w-5 h-5" /> Talk to Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;
