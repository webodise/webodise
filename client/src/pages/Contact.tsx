import { useState } from "react";
import { motion } from "framer-motion";
import { Section, SectionTitle, AnimatedCard } from "@/components/ui/Section";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const contactInfo = [
  { icon: MapPin, title: "Address", text: "Kahra Ward No. 6/41, Saharsa, Bihar – 852201" },
  { icon: Phone, title: "Phone", text: "8229095143", href: "tel:8229095143" },
  { icon: Mail, title: "Email", text: "jyotipublicschool24@gmail.com", href: "mailto:jyotipublicschool24@gmail.com" },
  { icon: Clock, title: "Office Hours", text: "Mon – Sat: 9:00 AM – 4:00 PM" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Phone validation (optional but if provided, must be valid)
    if (form.phone.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(form.phone.replace(/[^0-9]/g, ""))) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }
    }

    // Subject validation
    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (form.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    // Message validation
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setShowSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setErrors({ submit: (err as Error).message || "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Contact Us</h1>
            <p className="text-primary-foreground/80 text-lg">
              We'd love to hear from you. Reach out to us anytime.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <SectionTitle title="Get in Touch" center={false} />
            {contactInfo.map((item, i) => (
              <AnimatedCard key={item.title} delay={i * 0.1} className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                  {item.href ? (
                    <a href={item.href} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">{item.text}</p>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <AnimatedCard className="p-8 md:p-10">
              <h3 className="text-2xl font-bold text-foreground mb-6">Send a Message</h3>
              
              {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Thank you for contacting us!</p>
                    <p className="text-green-800 text-sm">Our team will get back to you soon.</p>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-900">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow`}
                      placeholder="Your phone number"
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Subject *</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => {
                        setForm({ ...form, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: "" });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-red-400 bg-red-50' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow`}
                      placeholder="Subject"
                    />
                    {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400 bg-red-50' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none`}
                    placeholder="Write your message here..."
                  />
                  {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 gradient-hero text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </AnimatedCard>
          </div>
        </div>
      </Section>

      {/* Google Map */}
      <Section className="gradient-subtle">
        <SectionTitle title="Find Us" subtitle="Visit our campus in Saharsa, Bihar" />
        <AnimatedCard className="overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57468.82834994384!2d86.55!3d25.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb8a1d1c8bc7f%3A0x3c02148db84ce014!2sSaharsa%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Jyoti Public School Location"
            className="rounded-xl"
          />
        </AnimatedCard>
      </Section>
    </>
  );
};

export default Contact;
