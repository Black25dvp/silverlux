import { ShoppingBag, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-serif font-bold text-foreground tracking-tight">
              Silver<span className="text-accent">Luxe</span>
            </a>
            
            <nav className="hidden md:flex items-center gap-6">
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
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
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
