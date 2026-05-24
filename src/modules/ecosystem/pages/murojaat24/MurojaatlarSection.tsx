import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Eye, Loader2, Search } from "lucide-react";

import OperatorRequestDetailModal from "@/components/OperatorRequestDetailModal";
import RequestStatusBadge from "@/components/RequestStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
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
import { useOrganizations } from "@/lib/api/organizations";
import {
  formatRequestDateTime,
  getRequestPriorityLabel,
  REQUEST_PRIORITY_OPTIONS,
  REQUEST_STATUS_OPTIONS,
  resolveOrganizationName,
  useRequests,
} from "@/lib/api/requests";

const ALL_FILTER = "all";
const PAGE_SIZE = 20;

const MurojaatlarSection = () => {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);
  const [organizationFilter, setOrganizationFilter] = useState(ALL_FILTER);
  const [priorityFilter, setPriorityFilter] = useState(ALL_FILTER);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);

  const deferredSearch = useDeferredValue(searchValue.trim());

  useEffect(() => {
    setPage(1);
  }, [
    statusFilter,
    organizationFilter,
    priorityFilter,
    deferredSearch,
    startDate,
    endDate,
  ]);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(statusFilter !== ALL_FILTER ? { status: statusFilter } : {}),
      ...(organizationFilter !== ALL_FILTER
        ? { organization: organizationFilter }
        : {}),
      ...(priorityFilter !== ALL_FILTER ? { priority: priorityFilter } : {}),
      ...(deferredSearch ? { search: deferredSearch } : {}),
      ...(startDate ? { startDate: format(startDate, "yyyy-MM-dd") } : {}),
      ...(endDate ? { endDate: format(endDate, "yyyy-MM-dd") } : {}),
    }),
    [
      page,
      statusFilter,
      organizationFilter,
      priorityFilter,
      deferredSearch,
      startDate,
      endDate,
    ],
  );

  const requestsQuery = useRequests(listParams, { role: "admin" });
  const organizationsQuery = useOrganizations();

  const organizationNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const org of organizationsQuery.data ?? []) {
      map.set(org._id, org.name);
    }
    return map;
  }, [organizationsQuery.data]);

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

  const resetFilters = () => {
    setSearchValue("");
    setStatusFilter(ALL_FILTER);
    setOrganizationFilter(ALL_FILTER);
    setPriorityFilter(ALL_FILTER);
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(1);
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

      <Card>
        <CardHeader>
          <CardTitle>Murojaatlar ro&apos;yxati</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Qidirish (raqam, fuqaro, tavsif)..."
                className="pl-10"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER}>Barcha statuslar</SelectItem>
                  {REQUEST_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={organizationFilter}
                onValueChange={setOrganizationFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tashkilot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER}>Barcha tashkilotlar</SelectItem>
                  {(organizationsQuery.data ?? []).map((org) => (
                    <SelectItem key={org._id} value={org._id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ustuvorlik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER}>Barcha ustuvorliklar</SelectItem>
                  {REQUEST_PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Boshlanish sanasi"
              />

              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Tugash sanasi"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={resetFilters}>
                Filtrlarni tozalash
              </Button>
              {pagination && (
                <p className="text-sm text-muted-foreground">
                  Jami: {pagination.total}
                </p>
              )}
            </div>
          </div>

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
              {requestsQuery.isLoading ? (
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
                    Murojaatlar topilmadi
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
                  setPage((current) =>
                    Math.min(pagination.pages, current + 1),
                  )
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

export default MurojaatlarSection;
