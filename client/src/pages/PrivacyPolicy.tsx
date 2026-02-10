import { SectionHeading } from "@/components/shared";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <section className="section-padding">
      <div className="container-narrow max-w-4xl">
        <SectionHeading badge="Legal" title="Privacy Policy" description="Your privacy matters to us. Here's how we handle your data." />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 sm:p-12 space-y-8"
        >
          {[
            {
              title: "1. Information We Collect",
              content: "We collect information you provide directly, such as your name, email address, phone number, and project details when you fill out our contact form, request a quote, or communicate with us via WhatsApp or email."
            },
            {
              title: "2. How We Use Your Information",
              content: "We use your information to respond to your inquiries, provide our services, send project updates, improve our website experience, and communicate about new offerings. We never sell your personal data to third parties."
            },
            {
              title: "3. Data Protection",
              content: "We implement industry-standard security measures including SSL encryption, secure servers, and restricted access to protect your personal information from unauthorized access, alteration, or disclosure."
            },
            {
              title: "4. Cookies & Analytics",
              content: "Our website may use cookies and analytics tools to understand visitor behavior and improve user experience. You can disable cookies in your browser settings at any time."
            },
            {
              title: "5. Third-Party Services",
              content: "We may use third-party services such as Google Analytics, payment gateways (Razorpay), and hosting providers. These services have their own privacy policies governing how they handle your data."
            },
            {
              title: "6. Your Rights",
              content: "You have the right to access, update, or delete your personal information at any time. You can also opt out of marketing communications by contacting us directly."
            },
            {
              title: "7. Contact Us",
              content: "If you have any questions about this Privacy Policy, please contact us at webodise@gmail.com or call us at +91 9572949137."
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-display font-semibold text-lg text-foreground mb-3">{section.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
