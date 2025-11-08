// constants/ResourcesData.ts

export const categories = ["All", "Guides", "Videos", "Templates", "FAQs"] as const;

export type ResourceType = "Guide" | "Video" | "Template" | "FAQ";

export type Resource = {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  thumbnail?: string;
};

export const dummyResources: Resource[] = [
  {
    id: "1",
    title: "Surrogacy Guide for Parents",
    description: "Learn the step-by-step process for a safe surrogacy journey.",
    type: "Guide",
    thumbnail: "https://via.placeholder.com/60",
  },
  {
    id: "2",
    title: "Nutrition Tips for Surrogates",
    description: "Healthy eating plan for pregnancy.",
    type: "Guide",
  },
  {
    id: "3",
    title: "Legal FAQ",
    description: "Common legal questions answered for surrogates and parents.",
    type: "FAQ",
  },
  {
    id: "4",
    title: "Milestone Tracker Template",
    description: "Track important pregnancy milestones easily.",
    type: "Template",
  },
];
