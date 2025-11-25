import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";
import { governanceCategories } from "@/lib/governance";

const Statistics = () => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const isAdmin = localStorage.getItem("operator_session"); // Check if admin/hokimiyat

  const governanceDistribution = [
    { name: "Hokim", value: 45, color: "#2563eb" },
    { name: "Moliya-iqtisodiyot", value: 32, color: "#10b981" },
    { name: "Kapital qurilish", value: 38, color: "#f59e0b" },
    { name: "Yoshlar siyosati", value: 52, color: "#8b5cf6" },
    { name: "Oila va xotin-qizlar", value: 18, color: "#ec4899" },
    { name: "Boshqa", value: 15, color: "#6b7280" },
  ];

  // Mock data for charts
  const sectorData = [
    { name: "Elektr energiyasi", value: 35, color: "#3b82f6" },
    { name: "Suv ta'minoti", value: 25, color: "#10b981" },
    { name: "Gaz ta'minoti", value: 20, color: "#f59e0b" },
    { name: "Ko'cha yoritish", value: 15, color: "#8b5cf6" },
    { name: "Boshqa", value: 5, color: "#6b7280" },
  ];

  const dailyData = [
    { date: "13.11", received: 18, completed: 15 },
    { date: "14.11", received: 22, completed: 19 },
    { date: "15.11", received: 25, completed: 20 },
    { date: "16.11", received: 28, completed: 24 },
    { date: "17.11", received: 30, completed: 27 },
    { date: "18.11", received: 35, completed: 30 },
    { date: "19.11", received: 38, completed: 33 },
  ];

  const statusData = [
    { name: "Yangi", count: 45, color: "#ef4444" },
    { name: "Jarayonda", count: 32, color: "#f59e0b" },
    { name: "Bajarilgan", count: 128, color: "#10b981" },
  ];

  const regionData = [
    { name: "Yunusobod", count: 45 },
    { name: "Chilonzor", count: 38 },
    { name: "Mirzo Ulug'bek", count: 35 },
    { name: "Olmazor", count: 28 },
    { name: "Sergeli", count: 22 },
  ];

  const detailedData = [
    {
      date: "19.11.2024",
      number: "MUR-2024-001234",
      type: "Elektr",
      address: "Yunusobod, A.Qodiriy ko'chasi, 12",
      status: "completed",
      specialist: "Akmal Rahimov",
      duration: "2.5 soat",
    },
    {
      date: "19.11.2024",
      number: "MUR-2024-001235",
      type: "Suv",
      address: "Chilonzor, Bunyodkor ko'chasi, 45",
      status: "in-progress",
      specialist: "Bobur Toshmatov",
      duration: "1.2 soat",
    },
    {
      date: "19.11.2024",
      number: "MUR-2024-001236",
      type: "Kanalizatsiya",
      address: "M.Ulug'bek, Shifokorlar ko'chasi, 23",
      status: "completed",
      specialist: "Davron Yusupov",
      duration: "3.0 soat",
    },
    {
      date: "19.11.2024",
      number: "MUR-2024-001237",
      type: "Yo'l",
      address: "Olmazor, Mustaqillik ko'chasi, 78",
      status: "completed",
      specialist: "Eldor Karimov",
      duration: "4.5 soat",
    },
    {
      date: "19.11.2024",
      number: "MUR-2024-001238",
      type: "Gaz",
      address: "Sergeli, Yangi hayot ko'chasi, 34",
      status: "new",
      specialist: "-",
      duration: "-",
    },
    {
      date: "18.11.2024",
      number: "MUR-2024-001239",
      type: "Elektr",
      address: "Yunusobod, Amir Temur ko'chasi, 56",
      status: "completed",
      specialist: "Akmal Rahimov",
      duration: "1.8 soat",
    },
    {
      date: "18.11.2024",
      number: "MUR-2024-001240",
      type: "Yoritish",
      address: "Chilonzor, Qatortol ko'chasi, 89",
      status: "completed",
      specialist: "Eldor Karimov",
      duration: "2.3 soat",
    },
    {
      date: "18.11.2024",
      number: "MUR-2024-001241",
      type: "Suv",
      address: "M.Ulug'bek, Universitet ko'chasi, 12",
      status: "in-progress",
      specialist: "Bobur Toshmatov",
      duration: "0.5 soat",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Bajarilgan</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Jarayonda</Badge>;
      case "new":
        return <Badge className="bg-red-500 hover:bg-red-600">Yangi</Badge>;
      default:
        return <Badge>Noma'lum</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Statistika</h1>
          <p className="text-muted-foreground">Murojaatlar statistikasi va tahlili</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vaqt oralig'i (dan)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd.MM.yyyy") : "Sanani tanlang"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vaqt oralig'i (gacha)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd.MM.yyyy") : "Sanani tanlang"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Soha</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha sohalar</SelectItem>
                    <SelectItem value="elektr">Elektr energiyasi</SelectItem>
                    <SelectItem value="suv">Suv ta'minoti</SelectItem>
                    <SelectItem value="gaz">Gaz ta'minoti</SelectItem>
                    <SelectItem value="yoritish">Ko'cha yoritish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mintaqa</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha mintaqalar</SelectItem>
                    <SelectItem value="yunusobod">Yunusobod</SelectItem>
                    <SelectItem value="chilonzor">Chilonzor</SelectItem>
                    <SelectItem value="mirzo">Mirzo Ulug'bek</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium invisible">Action</label>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Download className="mr-2 h-4 w-4" />
                  Excel ga yuklash
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
      {isAdmin && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rahbariyat bo'yicha statistika</CardTitle>
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
                        data={governanceDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {governanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                  {Object.entries(governanceCategories).map(([category, orgs]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{category}</h4>
                        <Badge variant="secondary">{orgs.length} tashkilot</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Jami murojaatlar:</div>
                        <div className="font-medium">
                          {governanceDistribution.find(g => category.includes(g.name.split(' ')[0]))?.value || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tashkilotlar bo'yicha taqsimot</CardTitle>
          </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Kunlik dinamika (oxirgi 7 kun)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="received" stroke="#3b82f6" name="Qabul qilindi" strokeWidth={2} />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" name="Bajarilgan" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Status bo'yicha</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Horizontal Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Mintaqalar bo'yicha</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Batafsil jadval</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Raqam</TableHead>
                  <TableHead>Turi</TableHead>
                  <TableHead>Manzil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mutaxassis</TableHead>
                  <TableHead>Bajarilish vaqti</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedData.map((row) => (
                  <TableRow key={row.number}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="font-medium">{row.number}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell className="max-w-xs truncate">{row.address}</TableCell>
                    <TableCell>{getStatusBadge(row.status)}</TableCell>
                    <TableCell>{row.specialist}</TableCell>
                    <TableCell>{row.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">4</Button>
              <Button variant="outline" size="sm">5</Button>
              <span className="text-muted-foreground">...</span>
              <Button variant="outline" size="sm">15</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Statistics;
