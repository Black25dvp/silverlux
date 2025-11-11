import { Facebook, Instagram, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">
              Silver<span className="text-accent">Luxe</span>
            </h3>
            <p className="text-primary-foreground/80 text-sm">
              Joias de prata 925 de alta qualidade. Elegância e sofisticação em cada peça.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#produtos" className="text-primary-foreground/80 hover:text-accent transition-colors">Produtos</a></li>
              <li><a href="#colecoes" className="text-primary-foreground/80 hover:text-accent transition-colors">Coleções</a></li>
              <li><a href="#sobre" className="text-primary-foreground/80 hover:text-accent transition-colors">Sobre</a></li>
              <li><a href="#contato" className="text-primary-foreground/80 hover:text-accent transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Atendimento</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">Política de Troca</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">Frete e Entrega</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">Garantia</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                (11) 9999-9999
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                contato@silverluxe.com
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; 2025 SilverLuxe. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
