import { SectionHeading } from "@/components/shared";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <section className="section-padding">
      <div className="container-narrow max-w-4xl">
        <SectionHeading badge="Legal" title="Terms & Conditions" description="Please read these terms carefully before using our services." />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 sm:p-12 space-y-8"
        >
          {[
            {
              title: "1. Services",
              content: "Webodise Labs provides website development, management systems, custom software solutions, hosting, and maintenance services. All projects are delivered based on mutually agreed requirements and timelines."
            },
            {
              title: "2. Pricing & Payment",
              content: "All prices are listed in Indian Rupees (₹) and are one-time charges unless stated otherwise. Payment terms will be discussed and agreed upon before project commencement. A 50% advance payment is required to begin work on any project."
            },
            {
              title: "3. Domain & Hosting",
              content: "All packages include free domain registration and hosting for 1 year. After the first year, yearly renewal charges will apply. Clients can pay for up to 3 years of hosting at once for bulk savings."
            },
            {
              title: "4. Maintenance & Support",
              content: "1 year of free maintenance is included with every package, covering bug fixes and minor updates. After the first year, maintenance services will be charged based on requirements. Any new features or major changes requested after project delivery will be charged separately."
            },
            {
              title: "5. Intellectual Property",
              content: "Upon full payment, the client receives full ownership of the delivered website/software. Webodise Labs retains the right to showcase the project in its portfolio unless otherwise agreed in writing."
            },
            {
              title: "6. Project Delivery",
              content: "Delivery timelines are estimates and may vary based on project complexity and client responsiveness. Delays caused by late content submission or requirement changes from the client's side are not the responsibility of Webodise Labs."
            },
            {
              title: "7. Refund Policy",
              content: "Refunds are evaluated on a case-by-case basis. Once significant development work has begun, partial refunds may be offered based on the work completed. No refunds are provided after project delivery and approval."
            },
            {
              title: "8. Limitation of Liability",
              content: "Webodise Labs is not liable for any indirect, incidental, or consequential damages arising from the use of our services or products. Our total liability is limited to the amount paid for the specific service."
            },
            {
              title: "9. Changes to Terms",
              content: "We reserve the right to update these terms at any time. Clients will be notified of significant changes via email or through our website."
            },
            {
              title: "10. Contact",
              content: "For any questions regarding these terms, reach out to us at webodise@gmail.com or call +91 9572949137."
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
