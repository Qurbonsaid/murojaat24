import { useMemo, useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import {
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useOrganizations } from "@/lib/api/organizations";
import {
  groupOrganizationStatisticsByGovernance,
  mapStatisticsToChartSeries,
  useDailyStatistics,
  useExportStatistics,
  useOrganizationStatistics,
  useSpecialistStatistics,
} from "@/lib/api/statistics";

const ALL_ORGANIZATIONS = "all";

const StatisticsSection = () => {
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [organizationFilter, setOrganizationFilter] = useState(ALL_ORGANIZATIONS);

  const currentUserQuery = useCurrentUser();
  const isAdmin = currentUserQuery.data?.role === "admin";

  const statisticsDays = useMemo(() => {
    if (dateFrom && dateTo) {
      return Math.min(
        365,
        Math.max(1, differenceInCalendarDays(dateTo, dateFrom) + 1),
      );
    }
    if (dateFrom) return 30;
    return 7;
  }, [dateFrom, dateTo]);

  const exportParams = useMemo(
    () => ({
      startDate: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
      endDate: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      organization:
        organizationFilter !== ALL_ORGANIZATIONS
          ? organizationFilter
          : undefined,
    }),
    [dateFrom, dateTo, organizationFilter],
  );

  const dailyQuery = useDailyStatistics(statisticsDays);
  const organizationQuery = useOrganizationStatistics();
  const specialistsQuery = useSpecialistStatistics();
  const organizationsQuery = useOrganizations();
  const exportStatistics = useExportStatistics();

  const organizationChartData = useMemo(
    () => mapStatisticsToChartSeries(organizationQuery.data ?? []),
    [organizationQuery.data],
  );

  const governanceChartData = useMemo(
    () => groupOrganizationStatisticsByGovernance(organizationQuery.data ?? []),
    [organizationQuery.data],
  );

  const governanceGroups = useMemo(() => {
    const groups = new Map<string, typeof organizationChartData>();

    for (const item of organizationChartData) {
      const key = item.governance?.trim() || "Boshqa";
      const current = groups.get(key) ?? [];
      current.push(item);
      groups.set(key, current);
    }

    return Array.from(groups.entries()).sort(([a], [b]) =>
      a.localeCompare(b, "uz"),
    );
  }, [organizationChartData]);

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
    specialistsQuery.isLoading;

  const hasError =
    dailyQuery.isError || organizationQuery.isError || specialistsQuery.isError;

  const errorMessage =
    (dailyQuery.error &&
      resolveErrorMessage(dailyQuery.error, "Kunlik statistikani yuklashda xatolik")) ||
    (organizationQuery.error &&
      resolveErrorMessage(
        organizationQuery.error,
        "Tashkilotlar statistikasini yuklashda xatolik",
      )) ||
    (specialistsQuery.error &&
      resolveErrorMessage(
        specialistsQuery.error,
        "Mutaxassislar statistikasini yuklashda xatolik",
      )) ||
    "Statistikani yuklashda xatolik yuz berdi";

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vaqt oralig&apos;i (dan)</label>
              <DatePicker
                value={dateFrom}
                onChange={setDateFrom}
                placeholder="Boshlanish sanasi"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Vaqt oralig&apos;i (gacha)
              </label>
              <DatePicker
                value={dateTo}
                onChange={setDateTo}
                placeholder="Tugash sanasi"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tashkilot</label>
              <Select
                value={organizationFilter}
                onValueChange={setOrganizationFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_ORGANIZATIONS}>
                    Barcha tashkilotlar
                  </SelectItem>
                  {(organizationsQuery.data ?? []).map((org) => (
                    <SelectItem key={org._id} value={org._id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="invisible text-sm font-medium">Action</label>
              <Button
                type="button"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={exportStatistics.isPending}
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

      {!isLoading && !hasError && isAdmin && governanceChartData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Rahbariyat bo&apos;yicha statistika</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Grafik</TabsTrigger>
                <TabsTrigger value="details">Batafsil</TabsTrigger>
              </TabsList>

              <TabsContent value="chart">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={governanceChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {governanceChartData.map((entry, index) => (
                          <Cell key={`gov-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-4">
                  {governanceGroups.map(([category, orgs]) => (
                    <div key={category} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold">{category}</h4>
                        <span className="text-sm text-muted-foreground">
                          {orgs.length} tashkilot
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {orgs.map((org) => (
                          <div
                            key={org.id ?? org.name}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="truncate">{org.name}</span>
                            <span className="font-medium shrink-0">
                              {org.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !hasError ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tashkilotlar bo&apos;yicha taqsimot</CardTitle>
            </CardHeader>
            <CardContent>
              {organizationChartData.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Ma&apos;lumot topilmadi
                </p>
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

          <Card>
            <CardHeader>
              <CardTitle>
                Kunlik dinamika ({statisticsDays} kun)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(dailyQuery.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Ma&apos;lumot topilmadi
                </p>
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
        </div>
      ) : null}

      {!isLoading && !hasError ? (
        <Card>
          <CardHeader>
            <CardTitle>Mutaxassislar samaradorligi</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mutaxassis</TableHead>
                  <TableHead>Bajarilgan</TableHead>
                  <TableHead>O&apos;rtacha vaqt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(specialistsQuery.data ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Ma&apos;lumot topilmadi
                    </TableCell>
                  </TableRow>
                ) : (
                  (specialistsQuery.data ?? []).map((row) => (
                    <TableRow key={row.id ?? row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.completed}</TableCell>
                      <TableCell>{row.averageDuration ?? "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default StatisticsSection;
