import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, Zap, Clock, CheckCircle } from "lucide-react";
import { SectionHeading } from "@/components/shared";

const contactInfo = [
  { icon: Mail, label: "Email", value: "webodise@gmail.com", href: "mailto:webodise@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 9572949137", href: "tel:+919572949137" },
  { icon: MapPin, label: "Location", value: "Saharsa, Bihar, India", href: "#" },
];

const features = [
  { icon: Zap, title: "Quick Turnaround", description: "Fast project delivery without compromising quality" },
  { icon: Clock, title: "24/7 Support", description: "Always available for your urgent needs" },
  { icon: CheckCircle, title: "Quality Assured", description: "Premium solutions tailored to your business" },
];

export default function Contact() {
  const whatsappUrl = `https://wa.me/919572949137?text=${encodeURIComponent("Hi Webodise Labs! I want to discuss a project and get a quote.")}`;
  const phoneNumber = "tel:+919572949137";

  return (
    <>
      <section className="section-padding">
        <div className="container-narrow">
          <SectionHeading badge="Contact Us" title="Let's Bring Your Ideas to Life" description="Get a quote for your project and let's start building amazing solutions together." />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Get Quote Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Main CTA Card */}
              <div className="glass-card p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="text-2xl font-bold text-foreground mb-3">Get Your Free Quote</h3>
                <p className="text-muted-foreground mb-6">
                  Ready to start your next project? Contact us today and let our experts discuss your requirements with you.
                </p>

                <div className="space-y-3">
                  <a
                    href={phoneNumber}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:scale-[1.02]"
                  >
                    <Phone className="w-4 h-4" /> Call: +91 9572949137
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp Chat
                  </a>

                  <a
                    href="mailto:webodise@gmail.com"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-muted bg-muted/50 text-foreground font-medium hover:bg-muted transition-all hover:scale-[1.02]"
                  >
                    <Mail className="w-4 h-4" /> Email Us
                  </a>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="glass-card p-4 rounded-lg flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-muted/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                </a>
              ))}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform ring-1 ring-green-500/20 hover:bg-green-50/5"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium text-foreground">Chat with us instantly</p>
                </div>
              </a>

              {/* Map - Saharsa Bihar */}
              <div className="glass-card overflow-hidden rounded-xl h-48">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57364.85493882344!2d86.5547!3d25.8783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb96e1a8b1b1d%3A0x7ef6e3c7e4c7b0e!2sSaharsa%2C%20Bihar!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Webodise Labs Location - Saharsa, Bihar"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
