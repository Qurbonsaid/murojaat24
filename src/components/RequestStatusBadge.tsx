import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status: string, deadlineStatus?: string) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Yangi</Badge>;
    case "assigned":
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 ml-2">
          {deadlineStatus === "overdue" ? "Kechikkan" : "Tayinlangan"}
        </Badge>
      );
    case "accepted":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Qabul qilindi</Badge>
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
  deadlineStatus?: string;
};

const RequestStatusBadge = ({
  status,
  deadlineStatus,
}: RequestStatusBadgeProps) => getStatusBadge(status, deadlineStatus);

export default RequestStatusBadge;
