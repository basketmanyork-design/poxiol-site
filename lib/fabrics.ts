export type Fabric = {
  name: string;
  slug: string;
  features: string[];
  bestFor: string[];
  breathability: string;
  stretch: string;
  durability: string;
  sublimation: string;
};

export const fabricDatabase: Fabric[] = [
  {
    name: "Mesh Fabric",
    slug: "mesh-fabric",
    features: ["Highly breathable", "Lightweight", "Good airflow", "Comfortable for active sports"],
    bestFor: ["Basketball uniforms", "Soccer training wear", "Running apparel", "Practice jerseys"],
    breathability: "High",
    stretch: "Medium",
    durability: "Medium",
    sublimation: "Good if polyester-based",
  },
  {
    name: "Interlock Fabric",
    slug: "interlock-fabric",
    features: ["Smooth surface", "Durable", "Stable structure", "Professional appearance"],
    bestFor: ["Soccer jerseys", "Volleyball uniforms", "Basketball jerseys", "Teamwear sets"],
    breathability: "Medium",
    stretch: "Medium",
    durability: "High",
    sublimation: "Excellent if polyester",
  },
  {
    name: "Bird Eye Fabric",
    slug: "bird-eye-fabric",
    features: ["Breathable texture", "Lightweight", "Good moisture movement"],
    bestFor: ["Soccer kits", "Training shirts", "Running apparel", "Basketball practice jerseys"],
    breathability: "High",
    stretch: "Medium",
    durability: "Medium",
    sublimation: "Good if polyester",
  },
  {
    name: "Quick-Dry Polyester",
    slug: "quick-dry-polyester",
    features: ["Fast drying", "Moisture-wicking", "Lightweight", "Durable"],
    bestFor: ["Basketball", "Soccer", "Baseball", "Volleyball", "Running", "Esports"],
    breathability: "Medium-High",
    stretch: "Medium",
    durability: "High",
    sublimation: "Excellent",
  },
  {
    name: "Spandex Sports Fabric",
    slug: "spandex-sports-fabric",
    features: ["High stretch", "Better mobility", "Comfortable fit", "Flexible movement"],
    bestFor: ["Volleyball uniforms", "Running apparel", "Training wear", "Athletic fit teamwear"],
    breathability: "Medium",
    stretch: "High",
    durability: "Medium",
    sublimation: "Depends on blend",
  },
  {
    name: "Moisture-Wicking Fabric",
    slug: "moisture-wicking-fabric",
    features: ["Sweat management", "Comfort during activity", "Quick-dry performance"],
    bestFor: ["Basketball", "Soccer", "Running", "Volleyball", "Training apparel"],
    breathability: "Medium-High",
    stretch: "Medium",
    durability: "High",
    sublimation: "Excellent if polyester-based",
  },
];
