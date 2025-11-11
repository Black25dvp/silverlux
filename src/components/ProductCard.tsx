import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard = ({ name, price, image, category }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-silver-light">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardContent className="p-6">
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {category}
          </p>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {name}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-foreground">
            R$ {price.toFixed(2)}
          </p>
          <Button size="icon" variant="outline" className="group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
