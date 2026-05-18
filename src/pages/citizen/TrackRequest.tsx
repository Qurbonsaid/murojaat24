import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TrackingTimeline from "@/components/TrackingTimeline";
import RequestDetailsCard from "@/components/RequestDetailsCard";
import RequestProblemSection from "@/components/RequestProblemSection";

const TrackRequest = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSearching(false);
    setShowResults(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Mock data - in real app, this would come from API
  const mockRequestData = {
    id: trackingNumber || "MUR-2024-001234",
    type: "Elektr energiyasi",
    address: "Yunusobod tumani, Abdulla Qodiriy ko'chasi, 12-uy",
    phone: "+998 90 123 45 67",
    submittedDate: "19.11.2024, 09:30",
    status: "Jarayonda",
    description: "Ko'chamizda elektr energiyasi bilan bog'liq muammo bor. Oxirgi 3 kun ichida elektr tez-tez uzilmoqda. Bu ayniqsa kechki soatlarda yuz bermoqda va ko'p noqulaylik yaratmoqda. Iltimos, tezroq hal qiling.",
    image: null,
  };

  const timelineSteps = [
    {
      id: 1,
      title: "Qabul qilindi",
      time: "19.11.2024, 09:30",
      description: "Murojaat call center tomonidan qabul qilindi",
      status: "completed" as const,
    },
    {
      id: 2,
      title: "Mutaxassisga tayinlandi",
      time: "19.11.2024, 09:45",
      description: "Akmal Rahimov (Elektr bo'limi)",
      badge: "Tayinlangan",
      status: "completed" as const,
    },
    {
      id: 3,
      title: "Ish jarayonida",
      time: "19.11.2024, 10:15",
      description: "Mutaxassis hozirda muammoni hal qilmoqda",
      badge: "Jarayonda",
      status: "in-progress" as const,
    },
    {
      id: 4,
      title: "Bajarildi",
      time: "Kutilmoqda",
      description: "Ish tugaganidan keyin natija bu yerda ko'rsatiladi",
      status: "pending" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Murojaatni Kuzatish</h1>
              <p className="text-muted-foreground">Murojaat raqamingizni kiriting</p>
            </div>

            <div className="bg-card rounded-2xl shadow-lg p-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Masalan: MUR-2024-001234"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button
                  size="lg"
                  onClick={handleSearch}
                  disabled={isSearching || !trackingNumber.trim()}
                  className="px-8"
                >
                  {isSearching ? "Qidirilmoqda..." : "Qidirish"}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Timeline - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <TrackingTimeline steps={timelineSteps} />
                </div>

                {/* Request Details Card - Takes 1 column */}
                <div>
                  <RequestDetailsCard request={mockRequestData} />
                </div>
              </div>

              {/* Problem Section */}
              <RequestProblemSection
                description={mockRequestData.description}
                image={mockRequestData.image}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackRequest;
