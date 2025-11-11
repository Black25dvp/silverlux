import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  product_id: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;
    
    try {
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedItems: CartItem[] = (cartItems || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.products.name,
        price: item.products.price,
        image_url: item.products.image_url,
        quantity: item.quantity,
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    if (!user) {
      toast.error('Faça login para adicionar produtos ao carrinho');
      return;
    }

    try {
      const existing = items.find(item => item.product_id === product.product_id);
      
      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);

        if (error) throw error;
        
        toast.success('Quantidade atualizada no carrinho');
        await loadCartItems();
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.product_id,
            quantity: 1,
          });

        if (error) throw error;
        
        toast.success('Produto adicionado ao carrinho');
        await loadCartItems();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erro ao adicionar produto');
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Produto removido do carrinho');
      await loadCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Erro ao remover produto');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id);

      if (error) throw error;

      await loadCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Erro ao atualizar quantidade');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Carrinho limpo');
      await loadCartItems();
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Erro ao limpar carrinho');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
