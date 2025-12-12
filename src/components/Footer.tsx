import { FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <a
            href="https://1drv.ms/w/c/658c032eff59b375/IQDbF5Y0xV27TbozwzHZ7KGpAdEivWZXJrq42A-aacG9tXQ?email=niby.babu%40cvv.ac.in&e=8RlWkN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono group"
          >
            <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
            View Project Paper
          </a>
          <p className="text-sm text-muted-foreground font-mono">
            © 2025 IKARA – Indian Art Recognition Project | Created by{" "}
            <a
              href="https://amalsonu2874.github.io/cresvero.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Cresvero
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
