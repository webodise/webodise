import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Code2, Layout, Layers, ExternalLink } from "lucide-react";
import { templates } from "@/data/templates";
import NotFound from "./NotFound";

export default function TemplateDetail() {
  const { slug } = useParams<{ slug: string }>();
  const template = templates.find((t) => t.slug === slug);

  if (!template) return <NotFound />;

  return (
    <>
      {/* Hero */}
      <section className="section-padding !pt-8">
        <div className="container-narrow">
          <Link
            to="/#templates"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Templates
          </Link>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              {template.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              {template.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              {template.longDesc}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              Get This Template <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Live Demo Card */}
      <section className="section-padding !pt-0">
        <div className="container-narrow">
          {template.demoUrl ? (
            <a
              href={template.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-cyan/5 h-64 sm:h-80 flex items-center justify-center relative group hover:border-primary/50 transition-colors"
            >
              <div className="text-center">
                <Layout className="w-16 h-16 text-primary/60 mx-auto mb-4 group-hover:text-primary transition-colors" />
                <p className="text-foreground font-semibold mb-4">Live Demo Available</p>
                <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary/20 border border-primary/50 text-primary text-sm font-medium group-hover:bg-primary/30 transition-colors">
                  <ExternalLink className="w-4 h-4" /> Visit Website
                </span>
              </div>
            </a>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-cyan/5 h-64 sm:h-80 flex items-center justify-center relative group">
              <div className="text-center">
                <Layout className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm mb-4">Live demo preview coming soon</p>
                <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-muted/50 border border-border text-muted-foreground text-sm font-medium cursor-default">
                  <ExternalLink className="w-4 h-4" /> Live Demo — Coming Soon
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sections / Demo */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">Template Walkthrough</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">What's Inside</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">A detailed look at every section and feature included in this template.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {template.sections.map((section) => (
              <div
                key={section.title}
                className="glass-card p-7"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">Everything You Get</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">A comprehensive list of features included in this template.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {template.features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 p-4 glass-card"
              >
                <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">Technology</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">Built With Modern Tech</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance">Technologies used to build this template.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {template.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-sm font-medium text-foreground"
              >
                <Code2 className="w-4 h-4 text-primary" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="glass-card p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
                Want this template for your business?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Get in touch and we'll customize it to match your brand and requirements.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                Get a Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
