import { useEffect, useMemo, useState } from "react";
import { Loader2, XCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import {
  ASSIGNMENT_STATUS_OPTIONS,
  canCancelAssignment,
  formatAssignmentDateTime,
  getAssignmentStatusLabel,
  resolveAssignmentRequestNumber,
  resolveAssignmentSpecialistName,
  useAssignments,
  useCancelAssignment,
} from "@/lib/api/assignments";
import { ApiError } from "@/lib/api/client";
import { getStaffUserDisplayName, useSpecialists } from "@/lib/api/users";

const ALL_STATUSES = "all";
const PAGE_SIZE = 20;

const DispatcherAssignments = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(ALL_STATUSES);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(statusFilter !== ALL_STATUSES
        ? { status: statusFilter as (typeof ASSIGNMENT_STATUS_OPTIONS)[number]["value"] }
        : {}),
    }),
    [page, statusFilter],
  );

  const assignmentsQuery = useAssignments(listParams);
  const specialistsQuery = useSpecialists({ limit: 200 });
  const cancelAssignment = useCancelAssignment();

  const specialistNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const specialist of specialistsQuery.data?.data ?? []) {
      map.set(specialist._id, getStaffUserDisplayName(specialist));
    }
    return map;
  }, [specialistsQuery.data?.data]);

  const assignments = assignmentsQuery.data?.data ?? [];
  const pagination = assignmentsQuery.data?.pagination;

  const errorMessage =
    assignmentsQuery.error instanceof ApiError
      ? assignmentsQuery.error.message
      : assignmentsQuery.error instanceof Error
        ? assignmentsQuery.error.message
        : "Topshiriqlarni yuklashda xatolik";

  const cancelTarget = assignments.find((item) => item._id === cancelTargetId);

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;

    try {
      await cancelAssignment.mutateAsync({ id: cancelTargetId });
      toast({
        title: "Bekor qilindi",
        description: "Topshiriq muvaffaqiyatli bekor qilindi",
      });
      setCancelTargetId(null);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Topshiriqni bekor qilishda xatolik";
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: message,
      });
    }
  };

  return (
    <>
      <AlertDialog
        open={Boolean(cancelTargetId)}
        onOpenChange={(open) => {
          if (!open) setCancelTargetId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Topshiriqni bekor qilish</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelTarget ? (
                <>
                  <span className="font-medium text-foreground">
                    {resolveAssignmentRequestNumber(cancelTarget.request)}
                  </span>{" "}
                  murojaati uchun topshiriqni bekor qilmoqchimisiz? Bu amalni
                  qaytarib bo&apos;lmaydi.
                </>
              ) : (
                "Topshiriqni bekor qilmoqchimisiz?"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelAssignment.isPending}>
              Yo&apos;q
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={cancelAssignment.isPending}
              onClick={handleConfirmCancel}
            >
              {cancelAssignment.isPending ? "Bekor qilinmoqda..." : "Ha, bekor qilish"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Topshiriqlar</h1>
        <p className="text-muted-foreground">
          Mutaxassislarga tayinlangan topshiriqlar
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Topshiriqlar ro&apos;yxati</CardTitle>
          <div className="w-full sm:w-72">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>Barcha statuslar</SelectItem>
                {ASSIGNMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pagination && (
            <p className="text-sm text-muted-foreground">Jami: {pagination.total}</p>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Murojaat</TableHead>
                <TableHead>Mutaxassis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tayinlangan vaqt</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignmentsQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : assignmentsQuery.isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-destructive"
                  >
                    {errorMessage}
                  </TableCell>
                </TableRow>
              ) : assignments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Topshiriqlar topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment._id}>
                    <TableCell className="font-medium">
                      {resolveAssignmentRequestNumber(assignment.request)}
                    </TableCell>
                    <TableCell>
                      {resolveAssignmentSpecialistName(
                        assignment.specialist,
                        specialistNameById,
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getAssignmentStatusLabel(assignment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatAssignmentDateTime(assignment.assignedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="text-destructive hover:text-destructive"
                        disabled={!canCancelAssignment(assignment.status)}
                        onClick={() => setCancelTargetId(assignment._id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Bekor qilish
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

export default DispatcherAssignments;
