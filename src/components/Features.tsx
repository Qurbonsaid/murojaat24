import { Card, CardContent } from "@/components/ui/card";
import { Phone, Smartphone, BarChart } from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "Telefon orqali",
    description: "Qisqa raqamga qo'ng'iroq qiling",
  },
  {
    icon: Smartphone,
    title: "Mobil ilova orqali",
    description: "Istalgan vaqtda murojaat yuboring",
  },
  {
    icon: BarChart,
    title: "Real vaqtda kuzatish",
    description: "Murojaat holati haqida darhol xabardor bo'ling",
  },
];

const Features = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-2 hover:border-primary transition-colors">
              <CardContent className="flex flex-col items-center text-center p-8 gap-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
