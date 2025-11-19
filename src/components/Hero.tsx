import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Kommunal xizmatlar murojaatlari tizimi
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Murojaat yuborishning qulay va tez usuli
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg h-14 px-8" asChild>
              <Link to="/murojaat-yuborish">Murojaat Yuborish</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8" asChild>
              <Link to="/kuzatish">Murojaatni Kuzatish</Link>
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <img 
            src={heroImage} 
            alt="Murojaat platformasi" 
            className="rounded-2xl shadow-2xl w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
