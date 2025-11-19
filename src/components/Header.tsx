import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Murojaat24</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Bosh sahifa
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Murojaat yuborish
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Murojaatni kuzatish
          </a>
        </nav>

        <Button size="lg">Kirish</Button>
      </div>
    </header>
  );
};

export default Header;
