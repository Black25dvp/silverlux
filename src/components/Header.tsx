import { ShoppingBag, Search, Menu, User, LogOut, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import SearchDialog from "@/components/SearchDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleHashNavigate = (hash: string) => {
    setDrawerOpen(false);
    window.location.hash = hash;
  };

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
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex"
              onClick={() => setSearchOpen(true)}
            >
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
            
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl font-serif">
                    Silver<span className="text-accent">Luxe</span>
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    className="justify-start text-base font-medium"
                    onClick={() => handleNavigate('/products')}
                  >
                    Produtos
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-base font-medium"
                    onClick={() => handleHashNavigate('#colecoes')}
                  >
                    Coleções
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-base font-medium"
                    onClick={() => handleHashNavigate('#sobre')}
                  >
                    Sobre
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-base font-medium"
                    onClick={() => handleHashNavigate('#contato')}
                  >
                    Contato
                  </Button>
                  
                  <Separator className="my-4" />
                  
                  {user ? (
                    <>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          className="justify-start text-base"
                          onClick={() => handleNavigate('/admin')}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Administração
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="justify-start text-base"
                        onClick={() => {
                          signOut();
                          setDrawerOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      className="justify-start text-base"
                      onClick={() => handleNavigate('/auth')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Entrar
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
      
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Header;
