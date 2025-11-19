import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RequestProblemSectionProps {
  description: string;
  image: string | null;
}

const RequestProblemSection = ({ description, image }: RequestProblemSectionProps) => {
  return (
    <Card className="border-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <CardHeader>
        <CardTitle>Dastlabki muammo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {image && (
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={image}
              alt="Muammo rasmi"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        <p className="text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default RequestProblemSection;
