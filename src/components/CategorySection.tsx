import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoryProps {
  id?: string;
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
  isSoldOut?: boolean;
}

const CategorySection = ({ id, title, description, image, reverse, isSoldOut }: CategoryProps) => {
  const navigate = useNavigate();

  const handleViewCollection = () => {
    if (id) {
      navigate(`/collection/${id}`);
    }
  };

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
        {isSoldOut && (
          <div className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-full font-semibold text-sm">
            Esgotado
          </div>
        )}
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
        {id && (
          <Button variant="outline" className="group border-2" onClick={handleViewCollection}>
            Ver Coleção
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategorySection;
