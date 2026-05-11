import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

const mockRequests = [
  {
    id: "MUR-2024-001234",
    citizen: "Sardor Karimov",
    type: "Elektr energiyasi",
    time: "09:30",
    status: "completed",
  },
  {
    id: "MUR-2024-001235",
    citizen: "Dilnoza Rahimova",
    type: "Suv ta'minoti",
    time: "10:15",
    status: "in-progress",
  },
  {
    id: "MUR-2024-001236",
    citizen: "Otabek Toshmatov",
    type: "Yo'l ta'miri",
    time: "11:00",
    status: "in-progress",
  },
  {
    id: "MUR-2024-001237",
    citizen: "Gulnora Saidova",
    type: "Ko'cha yoritish",
    time: "11:45",
    status: "completed",
  },
  {
    id: "MUR-2024-001238",
    citizen: "Jamshid Ergashev",
    type: "Gaz ta'minoti",
    time: "12:20",
    status: "pending",
  },
  {
    id: "MUR-2024-001239",
    citizen: "Malika Yusupova",
    type: "Axlat chiqarish",
    time: "13:05",
    status: "completed",
  },
  {
    id: "MUR-2024-001240",
    citizen: "Aziz Nazarov",
    type: "Kanalizatsiya",
    time: "13:40",
    status: "in-progress",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Bajarilgan</Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">Jarayonda</Badge>
      );
    case "pending":
      return <Badge className="bg-red-500 hover:bg-red-600">Kutilmoqda</Badge>;
    default:
      return <Badge>Noma'lum</Badge>;
  }
};

const MurojaatlarSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Murojaatlar ro'yxati</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Raqam</TableHead>
              <TableHead>Fuqaro</TableHead>
              <TableHead>Turi</TableHead>
              <TableHead>Vaqt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.citizen}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.time}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MurojaatlarSection;
