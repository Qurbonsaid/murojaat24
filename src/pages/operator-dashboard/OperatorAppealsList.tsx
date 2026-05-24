import { useMemo, useState } from "react";
import OperatorRequestDetailModal from "@/components/OperatorRequestDetailModal";
import RequestStatusBadge from "@/components/RequestStatusBadge";
import StatsCard from "@/components/StatsCard";
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
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Timer,
  Eye,
  Loader2,
} from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { useOrganizations } from "@/lib/api/organizations";
import {
  formatRequestTime,
  getTodayDateRange,
  useRequests,
} from "@/lib/api/requests";

const OperatorAppealsList = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const today = getTodayDateRange();
  const requestsQuery = useRequests(
    {
      page: 1,
      limit: 50,
      startDate: today.startDate,
      endDate: today.endDate,
    },
    { role: "operator" }
  );
  const organizationsQuery = useOrganizations();

  const organizationNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const org of organizationsQuery.data ?? []) {
      map.set(org._id, org.name);
    }
    return map;
  }, [organizationsQuery.data]);
  const requests = requestsQuery.data?.data ?? [];
  const errorMessage =
    requestsQuery.error instanceof ApiError
      ? requestsQuery.error.message
      : requestsQuery.error instanceof Error
      ? requestsQuery.error.message
      : "Murojaatlarni yuklashda xatolik";

  const openRequestDetail = (requestId: string | undefined) => {
    if (!requestId) return;
    setSelectedRequestId(requestId);
    setDetailOpen(true);
  };

  return (
    <>
      <OperatorRequestDetailModal
        requestId={selectedRequestId}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setSelectedRequestId(null);
        }}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Murojaatlar ro&apos;yxati
        </h1>
        <p className="text-muted-foreground">
          Bugungi qabul qilingan murojaatlar va statistika
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={CheckCircle}
          label="Bugun qabul qilindi"
          value={23}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatsCard
          icon={Clock}
          label="Jarayonda"
          value={8}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatsCard
          icon={AlertCircle}
          label="Bajarilgan"
          value={15}
          iconColor="bg-green-100 text-green-600"
        />
        <StatsCard
          icon={Timer}
          label="O'rtacha vaqt"
          value="3.5 soat"
          iconColor="bg-gray-100 text-gray-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bugun yaratilgan murojaatlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Raqam</TableHead>
                <TableHead>Fuqaro</TableHead>
                <TableHead>Tashkilot</TableHead>
                <TableHead>Vaqt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestsQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : requestsQuery.isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-destructive"
                  >
                    {errorMessage}
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Bugun murojaatlar topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request._id ?? request.requestNumber}>
                    <TableCell className="font-medium">
                      {request.requestNumber}
                    </TableCell>
                    <TableCell>{request.citizen?.name ?? "—"}</TableCell>
                    <TableCell>
                      {request.organization
                        ? organizationNameById.get(request.organization._id) ??
                          "—"
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {formatRequestTime(request.createdAt)}
                    </TableCell>
                    <TableCell>
                      <RequestStatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        aria-label="Batafsil ko'rish"
                        disabled={!request._id}
                        onClick={() => openRequestDetail(request._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default OperatorAppealsList;
