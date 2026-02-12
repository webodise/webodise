import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Section, SectionTitle, AnimatedCard } from "@/components/ui/Section";
import { FileText, CheckCircle, ArrowRight, Download, ClipboardList, Calendar } from "lucide-react";

const steps = [
  { icon: FileText, title: "Collect Form", desc: "Obtain the admission form from the school office or download it online." },
  { icon: ClipboardList, title: "Submit Documents", desc: "Submit the filled form along with all required documents." },
  { icon: Calendar, title: "Entrance Test", desc: "Attend the entrance test / interaction session as per schedule." },
  { icon: CheckCircle, title: "Confirmation", desc: "Receive confirmation and complete the admission formalities." },
];

const documents = [
  "Birth Certificate (original & photocopy)",
  "Transfer Certificate (TC) from previous school",
  "Report Card / Marksheet of last class",
  "Aadhaar Card of student",
  "Passport-size photographs (4 copies)",
  "Aadhaar Card of parents/guardian",
  "Address proof (Ration Card / Electricity Bill)",
  "Caste Certificate (if applicable)",
];

const eligibility = [
  { cls: "Nursery", age: "3+ years" },
  { cls: "LKG", age: "4+ years" },
  { cls: "UKG", age: "5+ years" },
  { cls: "Class 1", age: "6+ years" },
  { cls: "Class 2–10", age: "As per previous class completion" },
];

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

type AdmissionFormData = {
  id: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

function resolveFileUrl(filePath: string) {
  if (/^https?:\/\//i.test(filePath)) return filePath;
  return `${API_BASE}${filePath}`;
}

const Admissions = () => {
  const [formLoading, setFormLoading] = useState(true);
  const [downloadForm, setDownloadForm] = useState<AdmissionFormData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAdmissionForm() {
      setFormLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/admission-form`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || "Failed to load admission form");
        }

        if (!cancelled) {
          setDownloadForm(data.form || null);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setDownloadForm(null);
        }
      } finally {
        if (!cancelled) {
          setFormLoading(false);
        }
      }
    }

    loadAdmissionForm();

    return () => {
      cancelled = true;
    };
  }, []);

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
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Admissions</h1>
            <p className="text-primary-foreground/80 text-lg">
              Join our school family – Admissions open for 2026–27 session.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Admission Process */}
      <Section>
        <SectionTitle title="Admission Process" subtitle="Simple, transparent steps to enroll your child" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <AnimatedCard key={step.title} delay={i * 0.1} className="p-8 text-center relative">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                {i + 1}
              </div>
              <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </Section>

      {/* Eligibility */}
      <Section className="gradient-subtle">
        <SectionTitle title="Eligibility Criteria" subtitle="Age requirements for different classes" />
        <div className="max-w-xl mx-auto">
          <AnimatedCard className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="gradient-hero text-primary-foreground">
                  <th className="text-left px-6 py-4 font-semibold">Class</th>
                  <th className="text-left px-6 py-4 font-semibold">Minimum Age</th>
                </tr>
              </thead>
              <tbody>
                {eligibility.map((item, i) => (
                  <tr key={item.cls} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}>
                    <td className="px-6 py-4 font-medium text-foreground">{item.cls}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AnimatedCard>
        </div>
      </Section>

      {/* Required Documents */}
      <Section>
        <SectionTitle title="Required Documents" subtitle="Please keep the following documents ready for admission" />
        <div className="max-w-2xl mx-auto">
          <AnimatedCard className="p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{doc}</span>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </Section>

      {/* Download & CTA */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Enroll?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Download the latest admission form uploaded by school admin and submit it with required documents.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {downloadForm ? (
                <a
                  href={resolveFileUrl(downloadForm.filePath)}
                  target="_blank"
                  rel="noreferrer"
                  download={downloadForm.fileName}
                  className="inline-flex items-center gap-2 gradient-accent text-accent-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  <Download className="w-5 h-5" /> Download Form
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground/80 px-8 py-4 rounded-xl font-semibold cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  {formLoading ? "Loading Form..." : "Form Not Available"}
                </button>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 px-8 py-4 rounded-xl font-semibold hover:bg-primary-foreground/20 transition-colors"
              >
                Contact Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            {downloadForm && (
              <p className="text-primary-foreground/70 text-sm mt-4">
                {/* Latest file: {downloadForm.fileName} */}
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Admissions;
