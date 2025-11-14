// constants/ResourcesData.ts

export type ResourceType = "Guide" | "Video" | "Template" | "FAQ";

export type Resource = {
  id: string;
  title: string;
  author: string;
  category: string;
  image: any; // Image asset
  type: ResourceType;
};

export const dummyResources: Resource[] = [
  {
    id: "1",
    title: "How to protect your mental health as a surrogate",
    author: "Lindy John",
    category: "Mental wellness",
    image: require("../assets/images/unsplash-1.png"),
    type: "Guide",
  },
  {
    id: "2",
    title: "Getting the best representative as a surrogate",
    author: "News Network",
    category: "Legal",
    image: require("../assets/images/unsplash-2.png"),
    type: "Guide",
  },
  {
    id: "3",
    title: "My experience as a surrogate",
    author: "Jennie Ma",
    category: "Health tips",
    image: require("../assets/images/unsplash-3.png"),
    type: "Guide",
  },
  {
    id: "4",
    title: "5 things to note when meeting intending parents",
    author: "Lindy John",
    category: "Guidelines",
    image: require("../assets/images/pdf_reader_pro_icon.png"),
    type: "Guide",
  },
];
