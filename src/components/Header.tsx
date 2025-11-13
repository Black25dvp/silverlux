import { ShoppingBag, Search, Menu, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-serif font-bold text-foreground tracking-tight">
              Silver<span className="text-accent">Luxe</span>
            </a>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/products" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                Produtos
              </Link>
              <a href="/#colecoes" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                Coleções
              </a>
              <a href="/#sobre" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                Sobre
              </a>
              <a href="/#contato" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                Contato
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Administração
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate('/auth')}>
                    <User className="mr-2 h-4 w-4" />
                    Entrar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
                  Menu
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col gap-4 border-t border-border">
            <a href="#produtos" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Produtos
            </a>
            <a href="#colecoes" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Coleções
            </a>
            <a href="#sobre" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Sobre
            </a>
            <a href="#contato" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Contato
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
