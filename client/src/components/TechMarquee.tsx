import { motion } from "framer-motion";

const technologies = [
  { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Bootstrap", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
  { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Material UI", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/materialui/materialui-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Google Auth", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" },
  { name: "JWT Security", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/json/json-original.svg" },
  { name: "REST APIs", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg" },
  { name: "Razorpay", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" },
];

// Duplicate for seamless loop
const allTech = [...technologies, ...technologies];

export default function TechMarquee() {
  return (
    <section className="section-padding !py-12 overflow-hidden">
      <div className="container-narrow mb-8 text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
          Technologies We Use
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Built With <span className="gradient-text">Modern Tech</span>
        </h2>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          className="flex gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {allTech.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="glass-card px-6 py-4 flex items-center gap-3 shrink-0 hover:scale-105 transition-transform"
            >
              <img
                src={tech.logo}
                alt={tech.name}
                className="w-8 h-8"
                loading="lazy"
              />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
