const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Murojaat24. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-sm text-muted-foreground">
            Aloqa: <a href="tel:+998711234567" className="hover:text-primary transition-colors">+998 71 123 45 67</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
