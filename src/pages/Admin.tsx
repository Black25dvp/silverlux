import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/Header';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  category: string;
  location?: string | null;
}

interface Collection {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  is_sold_out: boolean;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    location: 'São Paulo, São Paulo'
  });
  const [collectionFormData, setCollectionFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    is_sold_out: false
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error('Acesso negado');
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadProducts();
      loadCollections();
    }
  }, [user, isAdmin]);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar produtos');
    } else {
      setProducts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: formData.image_url,
      category: formData.category,
      location: formData.location
    };

    if (editingId) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingId);

      if (error) {
        toast.error('Erro ao atualizar produto');
      } else {
        toast.success('Produto atualizado com sucesso');
        setEditingId(null);
        resetForm();
        loadProducts();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        toast.error('Erro ao adicionar produto');
      } else {
        toast.success('Produto adicionado com sucesso');
        resetForm();
        loadProducts();
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url,
      category: product.category,
      location: product.location || 'São Paulo, São Paulo'
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir produto');
    } else {
      toast.success('Produto excluído com sucesso');
      loadProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: '',
      location: 'São Paulo, São Paulo'
    });
  };

  const loadCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar coleções');
    } else {
      setCollections(data || []);
    }
  };

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const collectionData = {
      name: collectionFormData.name,
      description: collectionFormData.description,
      image_url: collectionFormData.image_url,
      is_sold_out: collectionFormData.is_sold_out
    };

    if (editingCollectionId) {
      const { error } = await supabase
        .from('collections')
        .update(collectionData)
        .eq('id', editingCollectionId);

      if (error) {
        toast.error('Erro ao atualizar coleção');
      } else {
        toast.success('Coleção atualizada com sucesso');
        setEditingCollectionId(null);
        resetCollectionForm();
        loadCollections();
        await updateCollectionProducts(editingCollectionId);
      }
    } else {
      const { data, error } = await supabase
        .from('collections')
        .insert([collectionData])
        .select()
        .single();

      if (error) {
        toast.error('Erro ao adicionar coleção');
      } else {
        toast.success('Coleção adicionada com sucesso');
        if (data) {
          await updateCollectionProducts(data.id);
        }
        resetCollectionForm();
        loadCollections();
      }
    }
  };

  const updateCollectionProducts = async (collectionId: string) => {
    // Remove existing products
    await supabase
      .from('collection_products')
      .delete()
      .eq('collection_id', collectionId);

    // Add selected products
    if (selectedProducts.length > 0) {
      const inserts = selectedProducts.map(productId => ({
        collection_id: collectionId,
        product_id: productId
      }));

      const { error } = await supabase
        .from('collection_products')
        .insert(inserts);

      if (error) {
        toast.error('Erro ao atualizar produtos da coleção');
      }
    }
  };

  const handleEditCollection = async (collection: Collection) => {
    setEditingCollectionId(collection.id);
    setCollectionFormData({
      name: collection.name,
      description: collection.description || '',
      image_url: collection.image_url,
      is_sold_out: collection.is_sold_out
    });

    // Load products in this collection
    const { data } = await supabase
      .from('collection_products')
      .select('product_id')
      .eq('collection_id', collection.id);

    if (data) {
      setSelectedProducts(data.map(item => item.product_id));
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta coleção?')) return;

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir coleção');
    } else {
      toast.success('Coleção excluída com sucesso');
      loadCollections();
    }
  };

  const resetCollectionForm = () => {
    setCollectionFormData({
      name: '',
      description: '',
      image_url: '',
      is_sold_out: false
    });
    setSelectedProducts([]);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Carregando...</p>
    </div>;
  }

  if (!user || !isAdmin) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-8">
            Painel de Administração
          </h1>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="collections">Coleções</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                {editingId ? 'Editar Produto' : 'Adicionar Produto'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: São Paulo, São Paulo"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingId ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-foreground">
                Produtos ({products.length})
              </h2>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-card rounded-lg p-4 shadow-sm border border-border"
                >
                  <div className="flex gap-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <p className="text-lg font-bold text-accent mt-1">
                        R$ {product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="collections">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                  <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                    {editingCollectionId ? 'Editar Coleção' : 'Adicionar Coleção'}
                  </h2>
                  <form onSubmit={handleCollectionSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="collection-name">Nome</Label>
                      <Input
                        id="collection-name"
                        value={collectionFormData.name}
                        onChange={(e) => setCollectionFormData({ ...collectionFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="collection-description">Descrição</Label>
                      <Textarea
                        id="collection-description"
                        value={collectionFormData.description}
                        onChange={(e) => setCollectionFormData({ ...collectionFormData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="collection-image">URL da Imagem</Label>
                      <Input
                        id="collection-image"
                        value={collectionFormData.image_url}
                        onChange={(e) => setCollectionFormData({ ...collectionFormData, image_url: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="sold-out"
                        checked={collectionFormData.is_sold_out}
                        onCheckedChange={(checked) => setCollectionFormData({ ...collectionFormData, is_sold_out: checked })}
                      />
                      <Label htmlFor="sold-out">Marcar como esgotado</Label>
                    </div>

                    <div>
                      <Label>Produtos na Coleção</Label>
                      <div className="mt-2 max-h-64 overflow-y-auto space-y-2 border border-border rounded-md p-3">
                        {products.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Nenhum produto disponível</p>
                        ) : (
                          products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                              onClick={() => toggleProductSelection(product.id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => toggleProductSelection(product.id)}
                                className="cursor-pointer"
                              />
                              <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded" />
                              <span className="text-sm">{product.name}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingCollectionId ? 'Atualizar' : 'Adicionar'}
                      </Button>
                      {editingCollectionId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingCollectionId(null);
                            resetCollectionForm();
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-bold text-foreground">
                    Coleções ({collections.length})
                  </h2>
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      className="bg-card rounded-lg p-4 shadow-sm border border-border"
                    >
                      <div className="flex gap-4">
                        <img
                          src={collection.image_url}
                          alt={collection.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{collection.name}</h3>
                          {collection.is_sold_out && (
                            <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full">
                              Esgotado
                            </span>
                          )}
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {collection.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditCollection(collection)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteCollection(collection.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default Admin;
