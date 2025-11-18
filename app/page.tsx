import Hero from "./components/landing/Hero";

import ContactSection from "@/app/components/landing/ContactSection";
import AboutSection from "./components/landing/AboutSection";
import ProductsSection from "./components/landing/ProductsSection";

// Revalidate every 60 seconds for ISR (Incremental Static Regeneration)
export const revalidate = 60;

export default async function Home() {
  let data: unknown = {};
  try {
    // Fetch CMS profile from database via API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/cmsprofile`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (response.ok) {
      data = await response.json();
    } else {
      console.error("Failed to fetch CMS profile:", response.status);
      data = {};
    }
  } catch (error) {
    console.error("Error fetching CMS profile:", error);
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
