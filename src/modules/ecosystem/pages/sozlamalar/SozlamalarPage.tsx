import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Clock3, Edit, Plus, Search, Trash2 } from "lucide-react";

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
import { ComboboxInput } from "@/components/ui/combobox-input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import type { Organization } from "@/lib/api/organizations";
import {
  useCreateOrganization,
  useDeleteOrganization,
  useOrganizations,
  useUpdateOrganization,
} from "@/lib/api/organizations";

type SozlamalarSection =
  | "rahbariyat"
  | "tashkilotlar"
  | "obyekt-turi"
  | "chaqiruv-turi"
  | "ish-vaqtlari"
  | "shablonlar"
  | "umumiy"
  | "overview";

const sectionMeta: Record<
  SozlamalarSection,
  { title: string; subtitle: string }
> = {
  overview: {
    title: "Sozlamalar",
    subtitle: "Tizimning barcha sozlamalari bitta joyda birlashtirilgan.",
  },
  rahbariyat: {
    title: "Rahbariyat",
    subtitle: "Tashkilotlarning rahbariyat kesimidagi taqsimoti.",
  },
  tashkilotlar: {
    title: "Tashkilotlar",
    subtitle: "Ekotizimga ulangan tashkilotlar ro'yxati.",
  },
  "obyekt-turi": {
    title: "Obyekt turi",
    subtitle: "Murojaat obyektlari turlari sozlamalari.",
  },
  "chaqiruv-turi": {
    title: "Chaqiruv turi",
    subtitle: "Kommunal chaqiruv turlari sozlamalari.",
  },
  "ish-vaqtlari": {
    title: "Ish vaqtlari",
    subtitle: "Xizmatlar uchun ish vaqtlari jadvali.",
  },
  shablonlar: {
    title: "Bildirishnoma shablonlari",
    subtitle: "SMS va email xabarnomalar uchun shablonlar.",
  },
  umumiy: {
    title: "Umumiy sozlamalar",
    subtitle: "Tizim bo'ylab amal qiladigan umumiy sozlamalar.",
  },
};

const resolveSection = (pathname: string): SozlamalarSection => {
  const match = pathname.match(/\/ecosystem\/sozlamalar\/([^/]+)/);
  const slug = match?.[1];

  switch (slug) {
    case "rahbariyat":
    case "tashkilotlar":
    case "obyekt-turi":
    case "chaqiruv-turi":
    case "ish-vaqtlari":
    case "shablonlar":
    case "umumiy":
      return slug;
    default:
      return "overview";
  }
};

const smsTemplates = [
  {
    id: 1,
    name: "Qabul qilindi",
    content: "Hurmatli {name}, murojaatingiz qabul qilindi. Raqam: {number}",
  },
  {
    id: 2,
    name: "Tayinlandi",
    content: "Murojaatingiz {specialist}ga tayinlandi. Tel: {phone}",
  },
  {
    id: 3,
    name: "Bajarildi",
    content: "Murojaatingiz bajarildi. Fikr-mulohazalaringizni bildiring.",
  },
];

const ComingSoonCard = ({ sectionLabel }: { sectionLabel: string }) => (
  <Card>
    <CardHeader>
      <div className="flex items-start gap-4">
        <span className="mt-1 inline-flex rounded-full bg-amber-100 p-3 text-amber-600">
          <Clock3 className="h-5 w-5" />
        </span>
        <div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Tez kunda...
          </CardTitle>
          <p className="mt-2 text-sm text-slate-500">
            {sectionLabel} sozlamalari tayyorlanmoqda.
          </p>
        </div>
      </div>
    </CardHeader>
  </Card>
);

const RahbariyatSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const organizationsQuery = useOrganizations();

  const groups = useMemo(() => {
    const items = organizationsQuery.data ?? [];
    const map = new Map<string, Organization[]>();

    items.forEach((org) => {
      const governance = org.governance?.trim() || "Boshqa";
      const bucket = map.get(governance);
      if (bucket) {
        bucket.push(org);
      } else {
        map.set(governance, [org]);
      }
    });

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0], "uz"))
      .map(([governance, orgs]) => ({
        governance,
        organizations: orgs
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name, "uz")),
      }));
  }, [organizationsQuery.data]);

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return groups;

    return groups
      .map((group) => {
        const governanceMatches = group.governance
          .toLowerCase()
          .includes(query);
        if (governanceMatches) return group;

        const matchingOrgs = group.organizations.filter((org) =>
          org.name.toLowerCase().includes(query),
        );

        if (matchingOrgs.length === 0) return null;
        return { ...group, organizations: matchingOrgs };
      })
      .filter(Boolean) as Array<{
      governance: string;
      organizations: Organization[];
    }>;
  }, [groups, searchTerm]);

  const errorMessage =
    organizationsQuery.error instanceof ApiError
      ? organizationsQuery.error.message
      : "Tashkilotlarni yuklashda xatolik yuz berdi";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rahbariyat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rahbariyat qidirish..."
            className="pl-10"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {organizationsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
        ) : organizationsQuery.isError ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : filteredGroups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Tashkilotlar topilmadi.
          </p>
        ) : (
          <div className="max-h-[32rem] space-y-4 overflow-y-auto">
            {filteredGroups.map((group) => (
              <div key={group.governance} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{group.governance}</h4>
                  <Badge variant="secondary">
                    {group.organizations.length} tashkilot
                  </Badge>
                </div>
                <div className="space-y-2">
                  {group.organizations.map((org) => (
                    <div
                      key={org._id}
                      className="border-l-2 border-muted py-1 pl-4 text-sm text-muted-foreground"
                    >
                      {org.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TashkilotlarSection = () => {
  const { toast } = useToast();
  const [searchOrg, setSearchOrg] = useState("");

  const organizationsQuery = useOrganizations();
  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization();
  const deleteOrganizationMutation = useDeleteOrganization();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [activeOrganizationId, setActiveOrganizationId] = useState<
    string | null
  >(null);
  const [formName, setFormName] = useState("");
  const [formGovernance, setFormGovernance] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] =
    useState<Organization | null>(null);

  const filtered = useMemo(() => {
    const items = organizationsQuery.data ?? [];
    const query = searchOrg.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        org.governance.toLowerCase().includes(query),
    );
  }, [organizationsQuery.data, searchOrg]);

  const errorMessage =
    organizationsQuery.error instanceof ApiError
      ? organizationsQuery.error.message
      : "Tashkilotlarni yuklashda xatolik yuz berdi";

  const governanceOptions = useMemo(() => {
    const items = organizationsQuery.data ?? [];
    const set = new Set<string>();

    items.forEach((org) => {
      const value = org.governance?.trim();
      if (value) set.add(value);
    });

    return Array.from(set).sort((a, b) => a.localeCompare(b, "uz"));
  }, [organizationsQuery.data]);

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    setActiveOrganizationId(null);
    setFormName("");
    setFormGovernance("");
    setDialogOpen(true);
  };

  const openEditDialog = (org: Organization) => {
    setDialogMode("edit");
    setActiveOrganizationId(org._id);
    setFormName(org.name);
    setFormGovernance(org.governance);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  const handleSave = async () => {
    const name = formName.trim();
    const governance = formGovernance.trim();

    try {
      if (dialogMode === "create") {
        await createOrganizationMutation.mutateAsync({ name, governance });
        toast({
          title: "Yaratildi",
          description: "Tashkilot muvaffaqiyatli yaratildi",
        });
      } else {
        if (!activeOrganizationId) return;
        await updateOrganizationMutation.mutateAsync({
          id: activeOrganizationId,
          name,
          governance,
        });
        toast({
          title: "Yangilandi",
          description: "Tashkilot muvaffaqiyatli yangilandi",
        });
      }

      closeDialog();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : dialogMode === "create"
            ? "Tashkilot yaratishda xatolik yuz berdi"
            : "Tashkilotni yangilashda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (org: Organization) => {
    setOrganizationToDelete(org);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setOrganizationToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!organizationToDelete) return;

    try {
      await deleteOrganizationMutation.mutateAsync(organizationToDelete._id);
      toast({
        title: "O'chirildi",
        description: "Tashkilot muvaffaqiyatli o'chirildi",
      });

      if (activeOrganizationId === organizationToDelete._id) {
        closeDialog();
      }

      closeDeleteDialog();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Tashkilotni o'chirishda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  const isMutating =
    createOrganizationMutation.isPending ||
    updateOrganizationMutation.isPending ||
    deleteOrganizationMutation.isPending;

  const isSaving =
    createOrganizationMutation.isPending ||
    updateOrganizationMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tashkilotlar</CardTitle>
          <Button size="sm" onClick={openCreateDialog} disabled={isMutating}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi tashkilot
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tashkilot qidirish..."
            className="pl-10"
            value={searchOrg}
            onChange={(event) => setSearchOrg(event.target.value)}
          />
        </div>

        {organizationsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
        ) : organizationsQuery.isError ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}

        <div className="max-h-[32rem] space-y-2 overflow-y-auto">
          {filtered.map((org) => (
            <div
              key={org._id}
              className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{org.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {org.governance}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(org)}
                    disabled={isMutating}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(org)}
                    disabled={isMutating}
                    aria-label={`${org.name} tashkilotini o'chirish`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {!organizationsQuery.isLoading &&
          !organizationsQuery.isError &&
          filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tashkilotlar topilmadi.
            </p>
          ) : null}
        </div>

        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) setOrganizationToDelete(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tashkilotni o&apos;chirish</AlertDialogTitle>
              <AlertDialogDescription>
                {organizationToDelete ? (
                  <>
                    <span className="font-medium text-foreground">
                      {organizationToDelete.name}
                    </span>{" "}
                    tashkilotini o&apos;chirmoqchimisiz? Bu amalni qaytarib
                    bo&apos;lmaydi.
                  </>
                ) : (
                  "Tashkilotni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi."
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={deleteOrganizationMutation.isPending}
              >
                Bekor qilish
              </AlertDialogCancel>
              <Button
                type="button"
                variant="destructive"
                disabled={deleteOrganizationMutation.isPending}
                onClick={() => void handleDeleteConfirm()}
              >
                {deleteOrganizationMutation.isPending
                  ? "O'chirilmoqda..."
                  : "O'chirish"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="overflow-visible">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create"
                  ? "Yangi tashkilot"
                  : "Tashkilotni tahrirlash"}
              </DialogTitle>
            </DialogHeader>

            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSave();
              }}
            >
              <div className="space-y-1">
                <Label htmlFor="organization-name">Tashkilot nomi</Label>
                <Input
                  id="organization-name"
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  placeholder="Masalan: Termiz shahar suv ta'minoti bo'limi"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="organization-governance">Boshqaruv turi</Label>
                <ComboboxInput
                  id="organization-governance"
                  value={formGovernance}
                  onValueChange={setFormGovernance}
                  suggestions={governanceOptions}
                  placeholder="Masalan: Kapital qurilish..."
                  disabled={isSaving}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={isSaving}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSaving || !formName.trim() || !formGovernance.trim()
                  }
                >
                  {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const ShablonlarSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Bildirishnoma shablonlari</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {smsTemplates.map((template) => (
        <div key={template.id} className="rounded-lg border p-4">
          <div className="mb-2 flex items-start justify-between">
            <h4 className="font-semibold">{template.name}</h4>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{template.content}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

const UmumiySection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Umumiy sozlamalar</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label>Email xabarnomalar</Label>
          <p className="text-sm text-muted-foreground">
            Fuqarolarga email yuborish
          </p>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>SMS xabarnomalar</Label>
          <p className="text-sm text-muted-foreground">
            Fuqarolarga SMS yuborish
          </p>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="space-y-2">
        <Label>Maksimal rasm hajmi (MB)</Label>
        <Input type="number" defaultValue="5" />
      </div>

      <div className="space-y-2">
        <Label>Javob kutish vaqti (daqiqa)</Label>
        <Input type="number" defaultValue="30" />
      </div>

      <Button>Saqlash</Button>
    </CardContent>
  </Card>
);

const OverviewSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Sozlamalar bo'limlari</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      <p>
        Chap menyudan kerakli sozlamalar bo'limini tanlang. Murojaat24 va
        ekotizimning boshqa modullariga tegishli sozlamalar shu bitta bo'limda
        birlashtirilgan.
      </p>
    </CardContent>
  </Card>
);

const SozlamalarPage = () => {
  const location = useLocation();
  const section = resolveSection(location.pathname);
  const { title, subtitle } = sectionMeta[section];

  const renderSection = () => {
    switch (section) {
      case "rahbariyat":
        return <RahbariyatSection />;
      case "tashkilotlar":
        return <TashkilotlarSection />;
      case "shablonlar":
        return <ShablonlarSection />;
      case "umumiy":
        return <UmumiySection />;
      case "obyekt-turi":
        return <ComingSoonCard sectionLabel="Obyekt turi" />;
      case "chaqiruv-turi":
        return <ComingSoonCard sectionLabel="Chaqiruv turi" />;
      case "ish-vaqtlari":
        return <ComingSoonCard sectionLabel="Ish vaqtlari" />;
      case "overview":
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {renderSection()}
    </div>
  );
};

export default SozlamalarPage;
