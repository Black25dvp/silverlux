import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";

import bracelet1 from "@/assets/bracelet-1.jpg";
import bracelet2 from "@/assets/bracelet-2.jpg";
import bracelet3 from "@/assets/bracelet-3.jpg";
import necklaces from "@/assets/necklaces.jpg";
import rings from "@/assets/rings.jpg";
import earrings from "@/assets/earrings.jpg";

const products = [
  {
    id: 1,
    name: "Pulseira Círculos Interligados",
    price: 289.90,
    image: bracelet1,
    category: "Pulseiras"
  },
  {
    id: 2,
    name: "Pulseira Árvore da Vida Dourada",
    price: 349.90,
    image: bracelet2,
    category: "Pulseiras"
  },
  {
    id: 3,
    name: "Pulseira Estrela do Mar",
    price: 279.90,
    image: bracelet3,
    category: "Pulseiras"
  },
  {
    id: 4,
    name: "Colar com Pingente de Pedra",
    price: 459.90,
    image: necklaces,
    category: "Colares"
  },
  {
    id: 5,
    name: "Anel Solitário com Gema",
    price: 329.90,
    image: rings,
    category: "Anéis"
  },
  {
    id: 6,
    name: "Brincos Círculo Elegante",
    price: 249.90,
    image: earrings,
    category: "Brincos"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Featured Products */}
      <section id="produtos" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore nossa seleção exclusiva de joias em prata 925, 
              cada peça cuidadosamente escolhida para você.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="colecoes" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Nossas Coleções
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra as coleções que definem elegância e estilo
            </p>
          </div>

          <CategorySection
            title="Colares Elegantes"
            description="Nossa coleção de colares combina design sofisticado com a pureza da prata 925. 
            Cada peça é criada para realçar sua beleza natural, perfeita para qualquer ocasião especial."
            image={necklaces}
          />

          <CategorySection
            title="Anéis Exclusivos"
            description="Anéis que contam histórias. Com pedras preciosas cuidadosamente selecionadas 
            e design único, cada anel é uma obra de arte em prata que complementa seu estilo."
            image={rings}
            reverse
          />

          <CategorySection
            title="Brincos Sofisticados"
            description="Detalhes que fazem a diferença. Nossos brincos em prata 925 são desenhados 
            para adicionar um toque de elegância e sofisticação ao seu visual."
            image={earrings}
          />
        </div>
      </section>

      {/* About */}
      <section id="sobre" className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Sobre a SilverLuxe
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Há anos dedicamos nossa paixão à criação de joias em prata 925 de alta qualidade. 
              Cada peça é cuidadosamente selecionada e trabalhada com atenção aos mínimos detalhes.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Acreditamos que joias são mais do que acessórios - são expressões de personalidade, 
              memórias e momentos especiais. Por isso, oferecemos peças únicas que combinam 
              tradição artesanal com design contemporâneo.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contato" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Entre em Contato
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Dúvidas sobre nossos produtos? Nossa equipe está pronta para atendê-lo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground rounded-md font-semibold hover:bg-accent/90 transition-colors shadow-elegant"
            >
              WhatsApp
            </a>
            <a 
              href="mailto:contato@silverluxe.com"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-foreground/10 text-primary-foreground rounded-md font-semibold hover:bg-primary-foreground/20 transition-colors border-2 border-primary-foreground/20"
            >
              Email
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
