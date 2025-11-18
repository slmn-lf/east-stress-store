import fs from "fs/promises";
import path from "path";
import Hero from "./components/landing/Hero";

import ContactSection from "@/app/components/landing/ContactSection";
import AboutSection from "./components/landing/AboutSection";
import ProductsSection from "./components/landing/ProductsSection";

export default async function Home() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "cmsprofile.json"
  );
  let data: unknown = {};
  try {
    const text = await fs.readFile(filePath, "utf8");
    data = JSON.parse(text);
  } catch {
    data = {};
  }

  return (
    <main style={{ paddingTop: 72 }}>
      <Hero data={data} />
      <AboutSection data={data} />
      <ProductsSection />
      <ContactSection data={data} />
    </main>
  );
}
