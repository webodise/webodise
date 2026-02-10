import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export function SectionHeading({ badge, title, description, center = true }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${center ? "text-center" : ""}`}
    >
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">{title}</h2>
      {description && (
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">{description}</p>
      )}
    </motion.div>
  );
}

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
      className={`glass-card p-6 hover:scale-[1.02] transition-transform duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}
