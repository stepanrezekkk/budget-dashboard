export const CATEGORIES = [
  "rent",
  "food",
  "internet",
  "miscellaneous",
  "cosmetic",
  "clothes",
  "tech",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  rent: "Rent",
  food: "Food",
  internet: "Internet",
  miscellaneous: "Miscellaneous",
  cosmetic: "Cosmetic",
  clothes: "Clothes",
  tech: "Tech",
};

export const CATEGORY_COLOR: Record<Category, string> = {
  rent: "#7c5cff",
  food: "#3ddc97",
  internet: "#4cc9f0",
  miscellaneous: "#8a93a3",
  cosmetic: "#ff7ab6",
  clothes: "#ffb454",
  tech: "#ff5d6c",
};

export type Expense = {
  id: string;
  amount: number;
  category: Category;
  note: string | null;
  spent_on: string;
  created_at: string;
};

export type Budget = {
  category: Category;
  monthly_limit: number;
  updated_at: string;
};
