import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Collection {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  is_sold_out: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  category: string;
}

const Collection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      loadCollection();
      loadCollectionProducts();
    }
  }, [id]);

  const loadCollection = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Erro ao carregar coleção');
      navigate('/');
    } else {
      setCollection(data);
    }
  };

  const loadCollectionProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('collection_products')
      .select(`
        product_id,
        products (
          id,
          name,
          description,
          price,
          image_url,
          category
        )
      `)
      .eq('collection_id', id);

    if (error) {
      toast.error('Erro ao carregar produtos');
    } else {
      const productsList = data.map((item: any) => item.products).filter(Boolean);
      setProducts(productsList);
    }
    setLoading(false);
  };

  if (!collection) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="mb-12">
            <div className="aspect-[21/9] overflow-hidden rounded-lg shadow-elegant mb-8">
              <img
                src={collection.image_url}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                {collection.name}
              </h1>
              {collection.is_sold_out && (
                <div className="inline-block px-6 py-2 bg-destructive/10 text-destructive rounded-full font-semibold mb-4">
                  Esgotado
                </div>
              )}
              {collection.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {collection.description}
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Nenhum produto nesta coleção</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image_url}
                  category={product.category}
                  onAddToCart={() => addToCart({
                    id: product.id,
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url
                  })}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;
