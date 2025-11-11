import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Joias de prata elegantes" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Elegância em
            <span className="block text-accent">Prata 925</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            Descubra nossa coleção exclusiva de joias em prata de alta qualidade. 
            Peças únicas que combinam sofisticação e estilo atemporal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant">
              Ver Coleção
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 hover:bg-secondary/50">
              Explorar Produtos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
