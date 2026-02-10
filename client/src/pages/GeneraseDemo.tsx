import EmbeddedWebsite from "@/components/EmbeddedWebsite";

export default function GeneraseDemo() {
  const generaseUrl = import.meta.env.VITE_GENERASE_URL || "http://generase.website";
  
  return <EmbeddedWebsite url={generaseUrl} title="Generase - E-commerce Demo" />;
}
