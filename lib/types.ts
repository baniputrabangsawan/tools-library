export const categories = ["Design", "Development", "AI", "Productivity", "Business", "Utilities"] as const;
export const types = ["Website", "GitHub Repository", "Documentation", "SaaS", "Library", "Resource", "Tool"] as const;

export type Category = (typeof categories)[number];
export type ToolType = (typeof types)[number];

export type Tool = {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
  favicon?: string;
  screenshot?: string;
  category: Category;
  subcategory: string;
  type: ToolType;
  tags: string[];
  favorite: boolean;
  favoritedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ToolInput = Omit<Tool, "id" | "slug" | "favicon" | "screenshot" | "createdAt" | "updatedAt">;
