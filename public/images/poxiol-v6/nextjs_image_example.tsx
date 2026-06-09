// Example: POXIOL V6 image usage in Next.js
import Image from "next/image";

export default function PoxiolHero() {
  return (
    <section className="relative overflow-hidden bg-black">
      <Image
        src="/images/poxiol-v6/home_hero_custom_teamwear_manufacturer.png"
        alt="POXIOL custom teamwear manufacturer for clubs schools and sports brands"
        width={1672}
        height={941}
        priority
        className="w-full h-auto object-cover"
      />
    </section>
  );
}
