import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

interface PopularProduct extends Product {
  search_count: number;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      loadPopularProducts();
      loadRecentSearches();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      searchProducts();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const loadPopularProducts = async () => {
    // Get products with most searches in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: searches, error } = await supabase
      .from('product_searches' as any)
      .select('product_id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('Error loading popular products:', error);
      return;
    }

    // Count occurrences
    const productCounts = (searches as any[]).reduce((acc: Record<string, number>, search: any) => {
      if (search.product_id) {
        acc[search.product_id] = (acc[search.product_id] || 0) + 1;
      }
      return acc;
    }, {});

    // Get top 5 products
    const topProductIds = Object.entries(productCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([id]) => id);

    if (topProductIds.length > 0) {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('id', topProductIds);

      if (products) {
        const productsWithCount = products.map(p => ({
          ...p,
          search_count: productCounts[p.id]
        }));
        setPopularProducts(productsWithCount);
      }
    }
  };

  const loadRecentSearches = () => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  };

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const searchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .limit(8);

    if (error) {
      console.error('Error searching products:', error);
    } else {
      setSearchResults(data || []);
    }
  };

  const handleSearch = async (term?: string) => {
    const finalTerm = term || searchTerm;
    if (!finalTerm.trim()) return;

    saveRecentSearch(finalTerm);
    
    // Track search
    // Track search
    await supabase
      .from('product_searches' as any)
      .insert({
        search_term: finalTerm,
        user_id: user?.id || null
      });

    onOpenChange(false);
    navigate(`/products?search=${encodeURIComponent(finalTerm)}`);
    setSearchTerm("");
  };

  const handleProductClick = async (product: Product) => {
    // Track product view
    await supabase
      .from('product_searches' as any)
      .insert({
        product_id: product.id,
        search_term: searchTerm || null,
        user_id: user?.id || null
      });

    onOpenChange(false);
    navigate(`/products?search=${encodeURIComponent(product.name)}`);
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscar Produtos</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar joias, cordões, anéis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button onClick={() => handleSearch()}>
              Buscar
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Search className="h-4 w-4" />
                Resultados da Busca
              </h3>
              <div className="space-y-2">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && searchTerm.length === 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pesquisas Recentes
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(term)}
                    className="text-sm"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Products */}
          {popularProducts.length > 0 && searchTerm.length === 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Produtos Mais Pesquisados
              </h3>
              <div className="space-y-2">
                {popularProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
