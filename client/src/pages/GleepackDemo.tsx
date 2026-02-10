import EmbeddedWebsite from "@/components/EmbeddedWebsite";

export default function GleepackDemo() {
  const gleepackUrl = import.meta.env.VITE_GLEEPACK_URL || "https://www.gleepack.shop";
  
  return <EmbeddedWebsite url={gleepackUrl} title="Gleepack - E-commerce Demo" />;
}
