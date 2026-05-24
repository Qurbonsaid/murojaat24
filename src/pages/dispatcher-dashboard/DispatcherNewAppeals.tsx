import { useEffect, useMemo, useState } from "react";
import { Eye, Loader2, UserPlus } from "lucide-react";

import AssignModal from "@/components/AssignModal";
import OperatorRequestDetailModal from "@/components/OperatorRequestDetailModal";
import RequestStatusBadge from "@/components/RequestStatusBadge";
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
import { useCurrentUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  formatRequestDateTime,
  getRequestPriorityLabel,
  resolveOrganizationId,
  resolveOrganizationName,
  useRequests,
} from "@/lib/api/requests";

const PAGE_SIZE = 20;

type AssignTarget = {
  requestId: string;
  requestNumber: string;
  organizationId?: string;
};

const DispatcherNewAppeals = () => {
  const [page, setPage] = useState(1);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<AssignTarget | null>(null);

  const currentUserQuery = useCurrentUser();
  const dispatcherOrganizationId = resolveOrganizationId(
    currentUserQuery.data?.organization,
  );

  useEffect(() => {
    setPage(1);
  }, [dispatcherOrganizationId]);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      status: "new",
      ...(dispatcherOrganizationId
        ? { organization: dispatcherOrganizationId }
        : {}),
    }),
    [page, dispatcherOrganizationId],
  );

  const requestsQuery = useRequests(listParams, {
    enabled: Boolean(dispatcherOrganizationId),
  });

  const organizationNameById = useMemo(() => {
    const map = new Map<string, string>();
    const organization = currentUserQuery.data?.organization;
    const organizationId = resolveOrganizationId(organization);
    if (organizationId && typeof organization === "object" && organization?.name) {
      map.set(organizationId, organization.name);
    }
    return map;
  }, [currentUserQuery.data?.organization]);

  const requests = requestsQuery.data?.data ?? [];
  const pagination = requestsQuery.data?.pagination;

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

  const openAssignModal = (
    requestId: string | undefined,
    requestNumber: string,
    organizationId?: string,
  ) => {
    if (!requestId) return;
    setAssignTarget({ requestId, requestNumber, organizationId });
    setAssignOpen(true);
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

      <AssignModal
        open={assignOpen}
        onOpenChange={(open) => {
          setAssignOpen(open);
          if (!open) setAssignTarget(null);
        }}
        requestId={assignTarget?.requestId ?? ""}
        requestNumber={assignTarget?.requestNumber ?? ""}
        organizationId={assignTarget?.organizationId ?? dispatcherOrganizationId}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Yangi murojaatlar
        </h1>
        <p className="text-muted-foreground">
          Tayinlanishi kerak bo&apos;lgan yangi murojaatlar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Murojaatlar ro&apos;yxati</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!dispatcherOrganizationId && !currentUserQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">
              Murojaatlarni ko&apos;rish uchun profilga tashkilot biriktirilgan
              bo&apos;lishi kerak.
            </p>
          ) : null}

          {pagination && dispatcherOrganizationId ? (
            <p className="text-sm text-muted-foreground">Jami: {pagination.total}</p>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Raqam</TableHead>
                <TableHead>Fuqaro</TableHead>
                <TableHead>Tashkilot</TableHead>
                <TableHead>Ustuvorlik</TableHead>
                <TableHead>Vaqt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUserQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : !dispatcherOrganizationId ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tashkilot topilmadi
                  </TableCell>
                </TableRow>
              ) : requestsQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : requestsQuery.isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-destructive"
                  >
                    {errorMessage}
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Yangi murojaatlar topilmadi
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
                      {resolveOrganizationName(
                        request.organization,
                        organizationNameById,
                      )}
                    </TableCell>
                    <TableCell>
                      {getRequestPriorityLabel(request.priority)}
                    </TableCell>
                    <TableCell>
                      {formatRequestDateTime(request.createdAt)}
                    </TableCell>
                    <TableCell>
                      <RequestStatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          aria-label="Mutaxassis tayinlash"
                          disabled={!request._id}
                          onClick={() =>
                            openAssignModal(
                              request._id,
                              request.requestNumber,
                              resolveOrganizationId(request.organization),
                            )
                          }
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Oldingi
              </Button>
              <span className="text-sm text-muted-foreground">
                {pagination.page} / {pagination.pages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={() =>
                  setPage((current) => Math.min(pagination.pages, current + 1))
                }
              >
                Keyingi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default DispatcherNewAppeals;
