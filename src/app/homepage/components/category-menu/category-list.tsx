import { Badge } from "~/components/ui/badge";

type CategoryListProps = {
  categories: Array<{
    categoria: string;
    count: number;
  }>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <div className="max-h-[60vh] overflow-auto">
      {categories.map((category) => (
        <button
          key={category.categoria}
          onClick={() => onSelectCategory(category.categoria)}
          className={`flex w-full items-center justify-between px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${
            selectedCategory === category.categoria
              ? "bg-accent text-accent-foreground"
              : ""
          }`}
        >
          <span>{category.categoria}</span>
          <Badge variant="secondary" className="ml-2">
            {category.count}
          </Badge>
        </button>
      ))}
    </div>
  );
}
