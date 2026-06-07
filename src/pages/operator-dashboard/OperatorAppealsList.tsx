import { useMemo, useState } from "react";
import OperatorEditRequestModal from "@/components/OperatorEditRequestModal";
import OperatorRequestDetailModal from "@/components/OperatorRequestDetailModal";
import IncorrectOrganizationBadge from "@/components/IncorrectOrganizationBadge";
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
  Pencil,
} from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { useOrganizations } from "@/lib/api/organizations";
import { useDashboardStatistics } from "@/lib/api/statistics";
import {
  formatRequestTime,
  getTodayDateRange,
  resolveOrganizationName,
  type AppealRequestListItem,
  useRequests,
} from "@/lib/api/requests";

const canOperatorEditRequest = (request: AppealRequestListItem) =>
  request.status === "new" || request.incorrectOrganization === true;

const formatDashboardStatValue = (
  isLoading: boolean,
  value: number | undefined
): string | number => {
  if (isLoading) return "…";
  if (value === undefined) return "—";
  return value;
};

type OperatorAppealsTableProps = {
  requests: AppealRequestListItem[];
  organizationNameById: Map<string, string>;
  onOpenDetail: (requestId: string | undefined) => void;
  onOpenEdit: (request: AppealRequestListItem) => void;
};

const OperatorAppealsTable = ({
  requests,
  organizationNameById,
  onOpenDetail,
  onOpenEdit,
}: OperatorAppealsTableProps) => (
  <>
    {requests.map((request) => (
      <TableRow key={request._id ?? request.requestNumber}>
        <TableCell className="font-medium">{request.requestNumber}</TableCell>
        <TableCell>{request.citizen?.name ?? "—"}</TableCell>
        <TableCell>
          {resolveOrganizationName(
            request.organization,
            organizationNameById
          )}
        </TableCell>
        <TableCell>{formatRequestTime(request.createdAt)}</TableCell>
        <TableCell>
          <div className="flex flex-wrap items-center gap-1.5">
            <RequestStatusBadge status={request.status} />
            {request.incorrectOrganization ? (
              <IncorrectOrganizationBadge />
            ) : null}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              aria-label="Tahrirlash"
              disabled={!request._id || !canOperatorEditRequest(request)}
              title={
                canOperatorEditRequest(request)
                  ? "Tashkilotni o'zgartirish"
                  : "Faqat yangi yoki qaytarilgan murojaatlarni tahrirlash mumkin"
              }
              onClick={() => onOpenEdit(request)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              aria-label="Batafsil ko'rish"
              disabled={!request._id}
              onClick={() => onOpenDetail(request._id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);

const appealsTableHeaders = (
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
);

const OperatorAppealsList = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRequest, setEditingRequest] =
    useState<AppealRequestListItem | null>(null);
  const today = getTodayDateRange();
  const returnedRequestsQuery = useRequests(
    { page: 1, limit: 50, incorrectOrganization: true },
    { role: "operator" }
  );
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
  const dashboardQuery = useDashboardStatistics();

  const organizationNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const org of organizationsQuery.data ?? []) {
      map.set(org._id, org.name);
    }
    return map;
  }, [organizationsQuery.data]);

  const returnedRequests = returnedRequestsQuery.data?.data ?? [];
  const todayRequests = (requestsQuery.data?.data ?? []).filter(
    (request) => !request.incorrectOrganization
  );
  const showReturnedList =
    !returnedRequestsQuery.isLoading && returnedRequests.length > 0;

  const requestStats = dashboardQuery.data?.requests;
  const completedTotal =
    requestStats === undefined
      ? undefined
      : (requestStats.completed ?? 0) + (requestStats.verified ?? 0);
  const errorMessage =
    requestsQuery.error instanceof ApiError
      ? requestsQuery.error.message
      : requestsQuery.error instanceof Error
        ? requestsQuery.error.message
        : "Murojaatlarni yuklashda xatolik";
  const dashboardErrorMessage =
    dashboardQuery.error instanceof ApiError
      ? dashboardQuery.error.message
      : dashboardQuery.error instanceof Error
        ? dashboardQuery.error.message
        : "Statistikani yuklashda xatolik";

  const openRequestDetail = (requestId: string | undefined) => {
    if (!requestId) return;
    setSelectedRequestId(requestId);
    setDetailOpen(true);
  };

  const openRequestEdit = (request: AppealRequestListItem) => {
    if (!request._id || !canOperatorEditRequest(request)) return;
    setEditingRequest(request);
    setEditOpen(true);
  };

  const tableProps = {
    organizationNameById,
    onOpenDetail: openRequestDetail,
    onOpenEdit: openRequestEdit,
  };

  return (
    <>
      <OperatorEditRequestModal
        request={editingRequest}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingRequest(null);
        }}
      />

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
          value={formatDashboardStatValue(
            dashboardQuery.isLoading,
            requestStats?.today
          )}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatsCard
          icon={Clock}
          label="Jarayonda"
          value={formatDashboardStatValue(
            dashboardQuery.isLoading,
            requestStats?.inProgress
          )}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatsCard
          icon={AlertCircle}
          label="Bajarilgan"
          value={formatDashboardStatValue(
            dashboardQuery.isLoading,
            completedTotal
          )}
          iconColor="bg-green-100 text-green-600"
        />
        <StatsCard
          icon={Timer}
          label="Shu oy qabul qilindi"
          value={formatDashboardStatValue(
            dashboardQuery.isLoading,
            requestStats?.thisMonth
          )}
          iconColor="bg-gray-100 text-gray-600"
        />
      </div>

      {dashboardQuery.isError ? (
        <p className="mb-6 text-sm text-destructive">{dashboardErrorMessage}</p>
      ) : null}

      {showReturnedList ? (
        <Card className="mb-6 border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-amber-900 dark:text-amber-100">
              Qaytarilgan murojaatlar
            </CardTitle>
            <p className="text-sm text-amber-800/80 dark:text-amber-200/80">
              Noto&apos;g&apos;ri tashkilot sababli qaytarilgan — tashkilotni
              to&apos;g&apos;rilang
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              {appealsTableHeaders}
              <TableBody>
                <OperatorAppealsTable
                  requests={returnedRequests}
                  {...tableProps}
                />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Bugun yaratilgan murojaatlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            {appealsTableHeaders}
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
              ) : todayRequests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Bugun murojaatlar topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                <OperatorAppealsTable requests={todayRequests} {...tableProps} />
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default OperatorAppealsList;
