import { useMemo, useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { resolveOrganizationId } from "@/lib/api/requests";
import {
  mapStatisticsToChartSeries,
  useDailyStatistics,
  useDashboardStatistics,
  useExportStatistics,
  useOrganizationStatistics,
  useSpecialistStatistics,
} from "@/lib/api/statistics";
import { BarChart3, CheckCircle, Clock, Timer } from "lucide-react";

const ManagerStatisticsPage = () => {
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const currentUserQuery = useCurrentUser();
  const organizationId = resolveOrganizationId(
    currentUserQuery.data?.organization,
  );

  const statisticsDays = useMemo(() => {
    if (dateFrom && dateTo) {
      return Math.min(
        365,
        Math.max(1, differenceInCalendarDays(dateTo, dateFrom) + 1),
      );
    }
    if (dateFrom) return 30;
    return 30;
  }, [dateFrom, dateTo]);

  const exportParams = useMemo(
    () => ({
      startDate: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
      endDate: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      organization: organizationId,
    }),
    [dateFrom, dateTo, organizationId],
  );

  const dailyQuery = useDailyStatistics(statisticsDays);
  const organizationQuery = useOrganizationStatistics();
  const specialistQuery = useSpecialistStatistics();
  const dashboardQuery = useDashboardStatistics();
  const exportStatistics = useExportStatistics();

  const requestStats = dashboardQuery.data?.requests;

  const organizationChartData = useMemo(() => {
    const items = organizationQuery.data ?? [];
    const scoped = organizationId
      ? items.filter((item) => item.id === organizationId)
      : items;
    return mapStatisticsToChartSeries(scoped);
  }, [organizationQuery.data, organizationId]);

  const specialistChartData = useMemo(
    () =>
      (specialistQuery.data ?? []).map((item, index) => ({
        name: item.name,
        completed: item.completed,
        fill: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"][
          index % 5
        ],
      })),
    [specialistQuery.data],
  );

  const resolveErrorMessage = (error: unknown, fallback: string) =>
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : fallback;

  const handleExport = async () => {
    try {
      await exportStatistics.mutateAsync(exportParams);
      toast({
        title: "Yuklab olindi",
        description: "Statistika fayli muvaffaqiyatli yuklab olindi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: resolveErrorMessage(
          error,
          "Excel faylini yuklab olishda xatolik yuz berdi",
        ),
        variant: "destructive",
      });
    }
  };

  const isLoading =
    dailyQuery.isLoading ||
    organizationQuery.isLoading ||
    specialistQuery.isLoading ||
    dashboardQuery.isLoading;

  const hasError =
    dailyQuery.isError ||
    organizationQuery.isError ||
    specialistQuery.isError ||
    dashboardQuery.isError;

  const errorMessage =
    (dailyQuery.error &&
      resolveErrorMessage(
        dailyQuery.error,
        "Kunlik statistikani yuklashda xatolik",
      )) ||
    (organizationQuery.error &&
      resolveErrorMessage(
        organizationQuery.error,
        "Tashkilotlar statistikasini yuklashda xatolik",
      )) ||
    (specialistQuery.error &&
      resolveErrorMessage(
        specialistQuery.error,
        "Mutaxassislar statistikasini yuklashda xatolik",
      )) ||
    "Statistikani yuklashda xatolik yuz berdi";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Statistika</h1>
        <p className="text-muted-foreground">
          Tashkilot bo&apos;yicha murojaatlar va bajarilish ko&apos;rsatkichlari
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={BarChart3}
          label="Jami murojaatlar"
          value={requestStats?.total ?? "—"}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatsCard
          icon={CheckCircle}
          label="Bajarilgan"
          value={requestStats?.completed ?? "—"}
          iconColor="bg-green-100 text-green-600"
        />
        <StatsCard
          icon={Clock}
          label="Jarayonda"
          value={requestStats?.inProgress ?? "—"}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatsCard
          icon={Timer}
          label="Shu oy"
          value={requestStats?.thisMonth ?? "—"}
          iconColor="bg-purple-100 text-purple-600"
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vaqt oralig&apos;i (dan)</label>
              <DatePicker
                value={dateFrom}
                onChange={setDateFrom}
                placeholder="Boshlanish sanasi"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vaqt oralig&apos;i (gacha)</label>
              <DatePicker
                value={dateTo}
                onChange={setDateTo}
                placeholder="Tugash sanasi"
              />
            </div>
            <div className="space-y-2">
              <label className="invisible text-sm font-medium">Action</label>
              <Button
                type="button"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={exportStatistics.isPending || !organizationId}
                onClick={() => void handleExport()}
              >
                {exportStatistics.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Excel ga yuklash
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : null}

      {hasError && !isLoading ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}

      {!isLoading && !hasError ? (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kunlik dinamika ({statisticsDays} kun)</CardTitle>
              </CardHeader>
              <CardContent>
                {(dailyQuery.data ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Ma&apos;lumot topilmadi</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyQuery.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="received"
                        stroke="#3b82f6"
                        name="Qabul qilindi"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#10b981"
                        name="Bajarilgan"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tashkilot bo&apos;yicha</CardTitle>
              </CardHeader>
              <CardContent>
                {organizationChartData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Ma&apos;lumot topilmadi</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={organizationChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {organizationChartData.map((entry, index) => (
                          <Cell key={`org-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mutaxassislar samaradorligi</CardTitle>
              </CardHeader>
              <CardContent>
                {specialistChartData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Ma&apos;lumot topilmadi</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={specialistChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Bajarilgan" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mutaxassislar jadvali</CardTitle>
              </CardHeader>
              <CardContent>
                {(specialistQuery.data ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Ma&apos;lumot topilmadi</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mutaxassis</TableHead>
                        <TableHead className="text-right">Bajarilgan</TableHead>
                        <TableHead className="text-right">O&apos;rtacha vaqt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(specialistQuery.data ?? []).map((row) => (
                        <TableRow key={row.id ?? row.name}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell className="text-right">{row.completed}</TableCell>
                          <TableCell className="text-right">
                            {row.averageDuration ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ManagerStatisticsPage;
