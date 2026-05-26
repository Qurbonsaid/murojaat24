import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Eye, Loader2, Search } from "lucide-react";

import ReviewModal from "@/components/ReviewModal";
import RequestStatusBadge from "@/components/RequestStatusBadge";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api/client";
import type { Assignment, AssignmentUserRef } from "@/lib/api/assignments";
import { resolveAssignmentSpecialistName } from "@/lib/api/assignments";
import { useCurrentUser } from "@/lib/api/auth";
import {
  formatRequestDateTime,
  REQUEST_STATUS_OPTIONS,
  resolveOrganizationId,
  useRequests,
} from "@/lib/api/requests";
import { useDashboardStatistics } from "@/lib/api/statistics";

const ALL_FILTER = "all";
const PAGE_SIZE = 20;
const DEFAULT_STATUS = "completed";

const resolveListAssignment = (assignment: unknown): Assignment | undefined => {
  if (!assignment || typeof assignment !== "object") return undefined;
  return assignment as Assignment;
};

const ManagerReviewPage = () => {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const currentUserQuery = useCurrentUser();
  const user = currentUserQuery.data;
  const isManager = user?.role === "manager";
  const organizationId = resolveOrganizationId(user?.organization);

  const deferredSearch = useDeferredValue(searchValue.trim());

  useEffect(() => {
    setPage(1);
  }, [statusFilter, deferredSearch, organizationId]);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(organizationId ? { organization: organizationId } : {}),
      ...(statusFilter !== ALL_FILTER ? { status: statusFilter } : {}),
      ...(deferredSearch ? { search: deferredSearch } : {}),
    }),
    [page, organizationId, statusFilter, deferredSearch],
  );

  const requestsQuery = useRequests(listParams, {
    enabled: !isManager || Boolean(organizationId),
  });
  const dashboardQuery = useDashboardStatistics();

  const requests = requestsQuery.data?.data ?? [];
  const pagination = requestsQuery.data?.pagination;
  const requestStats = dashboardQuery.data?.requests;

  const errorMessage =
    requestsQuery.error instanceof ApiError
      ? requestsQuery.error.message
      : requestsQuery.error instanceof Error
        ? requestsQuery.error.message
        : "Murojaatlarni yuklashda xatolik";

  const openReview = (requestId: string | undefined) => {
    if (!requestId) return;
    setSelectedRequestId(requestId);
    setReviewModalOpen(true);
  };

  const missingOrganization = isManager && !organizationId;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Nazorat qilish</h1>
        <p className="text-muted-foreground">
          Tashkilot bo&apos;yicha bajarilgan murojaatlarni ko&apos;rib chiqish va tasdiqlash
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={CheckCircle}
          label="Bugun"
          value={requestStats?.today ?? "—"}
          iconColor="bg-green-100 text-green-600"
        />
        <StatsCard
          icon={Clock}
          label="Nazorat kutilmoqda"
          value={requestStats?.completed ?? "—"}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatsCard
          icon={CheckCircle}
          label="Tasdiqlangan"
          value={requestStats?.verified ?? "—"}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatsCard
          icon={Clock}
          label="Rad etilgan"
          value={requestStats?.rejected ?? "—"}
          iconColor="bg-red-100 text-red-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Murojaatlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Raqam yoki fuqaro bo&apos;yicha qidirish..."
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Holat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER}>Barcha holatlar</SelectItem>
                {REQUEST_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {missingOrganization ? (
            <p className="text-sm text-destructive">
              Profilda tashkilot tanlanmagan. Murojaatlar ro&apos;yxatini ko&apos;rish uchun
              administrator bilan bog&apos;laning.
            </p>
          ) : null}

          {requestsQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : requestsQuery.isError ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Murojaatlar topilmadi
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Raqam</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Mutaxassis</TableHead>
                    <TableHead>Manzil</TableHead>
                    <TableHead>Yakunlangan</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => {
                    const assignment = resolveListAssignment(request.assignment);
                    const populatedRequest =
                      assignment?.request &&
                      typeof assignment.request === "object"
                        ? assignment.request
                        : null;
                    const addressLabel =
                      populatedRequest?.address?.full ??
                      request.description ??
                      "—";
                    const specialistName = resolveAssignmentSpecialistName(
                      assignment?.specialist as AssignmentUserRef | undefined,
                      new Map(),
                    );

                    return (
                      <TableRow key={request._id ?? request.requestNumber}>
                        <TableCell className="font-medium">
                          {request.requestNumber}
                        </TableCell>
                        <TableCell>
                          <RequestStatusBadge status={request.status} />
                        </TableCell>
                        <TableCell>{specialistName}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {addressLabel}
                        </TableCell>
                        <TableCell>
                          {formatRequestDateTime(assignment?.completedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReview(request._id)}
                            disabled={!request._id}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ko&apos;rib chiqish
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {pagination && pagination.totalPages > 1 ? (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    Jami {pagination.total} ta · {pagination.page}-sahifa /{" "}
                    {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      Oldingi
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= pagination.totalPages}
                      onClick={() =>
                        setPage((current) =>
                          Math.min(pagination.totalPages, current + 1),
                        )
                      }
                    >
                      Keyingi
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      {selectedRequestId ? (
        <ReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          requestId={selectedRequestId}
        />
      ) : null}
    </div>
  );
};

export default ManagerReviewPage;
