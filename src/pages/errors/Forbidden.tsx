import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Forbidden = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Ruxsat yo'q</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ushbu sahifaga kirish uchun huquqingiz yo'q.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">Bosh sahifa</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/login">Kirish</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Forbidden;
