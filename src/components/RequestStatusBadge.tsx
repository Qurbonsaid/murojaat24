import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Yangi</Badge>;
    case "assigned":
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600">Tayinlangan</Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          Bajarilmoqda
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Yakunlangan</Badge>
      );
    case "verified":
      return (
        <Badge className="bg-green-600 hover:bg-green-700">Tasdiqlangan</Badge>
      );
    case "rejected":
      return <Badge className="bg-red-500 hover:bg-red-600">Rad etilgan</Badge>;
    default:
      return <Badge variant="secondary">{status || "Noma'lum"}</Badge>;
  }
};

type RequestStatusBadgeProps = {
  status: string;
};

const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) =>
  getStatusBadge(status);

export default RequestStatusBadge;
