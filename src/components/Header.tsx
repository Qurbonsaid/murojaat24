import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Murojaat24</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Bosh sahifa
          </Link>
          <Link to="/murojaat-yuborish" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Murojaat yuborish
          </Link>
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
