import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CategoryProps {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
}

const CategorySection = ({ title, description, image, reverse }: CategoryProps) => {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
      <div className="w-full md:w-1/2">
        <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-elegant">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 space-y-6">
        <h2 className="text-4xl font-serif font-bold text-foreground">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
        <Button variant="outline" className="group border-2">
          Ver Coleção
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default CategorySection;
