import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "@/components/ManagerSidebar";
import StatsCard from "@/components/StatsCard";
import ReviewModal from "@/components/ReviewModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Timer, Star, Eye } from "lucide-react";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("manager_session");
    if (!session) {
      navigate("/login");
    }
  }, [navigate]);

  const reviewRequests = [
    {
      requestNumber: "MUR-2024-001234",
      specialist: "Akmal Rahimov",
      address: "Yunusobod tumani, Abdulla Qodiriy ko'chasi, 12-uy",
      completedTime: "12:45",
      beforeImage: "/placeholder.svg",
      afterImage: "/placeholder.svg",
      report: "Elektr hisoblagichni almashtirildi. Barcha rozetkalar tekshirildi va ishlayapti. Fuqaro natijadan mamnun.",
      assignedTime: "09:30",
      startedTime: "10:15",
    },
    {
      requestNumber: "MUR-2024-001235",
      specialist: "Bobur Toshmatov",
      address: "Chilonzor tumani, Bunyodkor ko'chasi, 45-uy",
      completedTime: "14:20",
      beforeImage: "/placeholder.svg",
      afterImage: "/placeholder.svg",
      report: "Suv quvuri almashtrildi. Endi suvda hech qanday muammo yo'q.",
      assignedTime: "10:00",
      startedTime: "11:30",
    },
    {
      requestNumber: "MUR-2024-001236",
      specialist: "Davron Yusupov",
      address: "Mirzo Ulug'bek tumani, Shifokorlar ko'chasi, 23-uy",
      completedTime: "16:10",
      beforeImage: "/placeholder.svg",
      afterImage: "/placeholder.svg",
      report: "Kanalizatsiya tizimi tozalandi. Test qilingan va hech qanday muammo yo'q.",
      assignedTime: "13:00",
      startedTime: "14:30",
    },
    {
      requestNumber: "MUR-2024-001237",
      specialist: "Eldor Karimov",
      address: "Olmazor tumani, Mustaqillik ko'chasi, 78-uy",
      completedTime: "17:30",
      beforeImage: "/placeholder.svg",
      afterImage: "/placeholder.svg",
      report: "Yo'lning shikastlangan qismi ta'mirlandi. Asfalt to'ldirildi.",
      assignedTime: "14:00",
      startedTime: "15:45",
    },
    {
      requestNumber: "MUR-2024-001238",
      specialist: "Akmal Rahimov",
      address: "Sergeli tumani, Yangi hayot ko'chasi, 34-uy",
      completedTime: "18:45",
      beforeImage: "/placeholder.svg",
      afterImage: "/placeholder.svg",
      report: "Elektr simlar almashtrildi. Xavfsizlik tekshiruvi o'tkazildi.",
      assignedTime: "15:30",
      startedTime: "17:00",
    },
  ];

  const handleReview = (request: typeof reviewRequests[0]) => {
    setSelectedRequest(request);
    setReviewModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Menjer Dashboard</h1>
          <p className="text-muted-foreground">Bajarilgan ishlarni nazorat qilish</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={CheckCircle}
            label="Bugun bajarildi"
            value={28}
            iconColor="bg-green-100 text-green-600"
          />
          <StatsCard
            icon={Clock}
            label="Nazorat kutilmoqda"
            value={12}
            iconColor="bg-yellow-100 text-yellow-600"
          />
          <StatsCard
            icon={Timer}
            label="O'rtacha bajarilish vaqti"
            value="4.2 soat"
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatsCard
            icon={Star}
            label="Mamnuniyat reytingi"
            value="4.6/5"
            iconColor="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Review Table */}
        <Card>
          <CardHeader>
            <CardTitle>Nazorat qilinishi kerak</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Raqam</TableHead>
                  <TableHead>Mutaxassis</TableHead>
                  <TableHead>Manzil</TableHead>
                  <TableHead>Bajarilgan vaqt</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewRequests.map((request) => (
                  <TableRow key={request.requestNumber}>
                    <TableCell className="font-medium">{request.requestNumber}</TableCell>
                    <TableCell>{request.specialist}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.address}</TableCell>
                    <TableCell>{request.completedTime}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReview(request)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ko'rib chiqish
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {selectedRequest && (
        <ReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
