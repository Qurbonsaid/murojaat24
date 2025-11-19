import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    value: "145",
    label: "Bugun qabul qilindi",
    color: "text-primary",
  },
  {
    value: "32",
    label: "Jarayonda",
    color: "text-warning",
  },
  {
    value: "98",
    label: "Bugun bajarildi",
    color: "text-secondary",
  },
  {
    value: "4.6/5",
    label: "Mamnuniyat",
    color: "text-secondary",
  },
];

const Statistics = () => {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2">
              <CardContent className="flex flex-col items-center text-center p-8 gap-2">
                <div className={`text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
