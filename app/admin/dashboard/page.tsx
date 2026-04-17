/*
 * Fil: app/admin/dashboard/page.tsx
 * Syfte: Adminpanel för CV, jobbansökningar, företag och tjänster.
 * Vad koden gör: Läser/skriver localStorage, filtrerar data och renderar adminflikar.
 * Lär dig: Följ useEffect-blocken för hur data laddas/sparas per fliktyp.
 * Felsökning: Kontrollera storage-nycklar, normalisering av data och activeTab-logik.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  Download,
  FileText,
  Search,
  User,
} from "lucide-react";
import {
  type AdminTab,
  type CVRegistration,
  type JobApplication,
  type ServiceItem,
  companyInquiries,
  cvRegistrations,
  dashboardStats,
  jobApplications,
  mockServices,
} from "@/lib/admin/mockData";

function toSwedishDate(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        <div className="text-zinc-500">{icon}</div>
      </div>
      <p className="mt-6 text-3xl font-semibold leading-none text-zinc-900">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
    </article>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Ny"
      ? "bg-blue-50 text-blue-700"
      : status === "Väntande"
      ? "bg-amber-50 text-amber-700"
      : status === "Besvarad"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-zinc-100 text-zinc-700";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{status}</span>
  );
}

function getCvUrl(cvFilePath?: string, cvFileName?: string) {
  if (cvFilePath && cvFilePath.trim()) return cvFilePath;
  if (cvFileName && cvFileName.trim()) {
    return `/uploads/cv/${encodeURIComponent(cvFileName.trim())}`;
  }
  return "";
}

export default function AdminDashboardPage() {
  // Storage-nycklarna kopplar ihop adminpanelen med klientdata i browsern.
  const router = useRouter();
  const CV_STORAGE_KEY = "admin.cvRegistrations";
  const SERVICES_STORAGE_KEY = "admin.services";
  const JOB_APPLICATIONS_STORAGE_KEY = "admin.jobApplications";
  const [activeTab, setActiveTab] = useState<AdminTab>("company");
  const [query, setQuery] = useState("");
  const [cvItems, setCvItems] = useState<CVRegistration[]>(cvRegistrations);
  const [services, setServices] = useState<ServiceItem[]>(mockServices);
  const [applications, setApplications] = useState<JobApplication[]>(jobApplications);
  const [hasLoadedCvItems, setHasLoadedCvItems] = useState(false);
  const [hasLoadedServices, setHasLoadedServices] = useState(false);
  const [hasLoadedApplications, setHasLoadedApplications] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    excerpt: "",
    description: "",
    location: "",
    employmentType: "Heltid" as "Heltid" | "Deltid",
    publishedAt: "",
    lastApplyDate: "",
    status: "Publicerad" as "Publicerad" | "Utkast",
  });

  // Ladda CV-registreringar från localStorage när sidan öppnas.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CV_STORAGE_KEY);
      if (!raw) {
        setHasLoadedCvItems(true);
        return;
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        setHasLoadedCvItems(true);
        return;
      }
      const normalized = (parsed as Record<string, unknown>[]).map((item) => {
        const id = typeof item.id === "string" && item.id ? item.id : `cv-${Date.now()}`;
        const fullName = typeof item.fullName === "string" ? item.fullName : "";
        const email = typeof item.email === "string" ? item.email : "";
        const phone = typeof item.phone === "string" ? item.phone : "";
        const competence = typeof item.competence === "string" ? item.competence : "";
        const cvFileName = typeof item.cvFileName === "string" ? item.cvFileName : undefined;
        const cvFilePath = typeof item.cvFilePath === "string" ? item.cvFilePath : undefined;
        const createdAt =
          typeof item.createdAt === "string" && item.createdAt
            ? item.createdAt
            : new Date().toISOString().slice(0, 10);
        const status = item.status === "Läst" ? "Läst" : "Ny";
        return {
          id,
          fullName,
          email,
          phone,
          competence,
          cvFileName,
          cvFilePath,
          createdAt,
          status,
        } as CVRegistration;
      });
      setCvItems(normalized);
    } catch {
      // Fallback to mock data if stored payload is invalid.
    } finally {
      setHasLoadedCvItems(true);
    }
  }, []);

  // Ladda adminstyrda tjänster från localStorage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SERVICES_STORAGE_KEY);
      if (!raw) {
        setHasLoadedServices(true);
        return;
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        setHasLoadedServices(true);
        return;
      }
      const normalized = (parsed as Record<string, unknown>[]).map((item) => {
        const title = typeof item.title === "string" ? item.title : "";
        const excerpt = typeof item.excerpt === "string" ? item.excerpt : "";
        const description = typeof item.description === "string" ? item.description : "";
        const location = typeof item.location === "string" ? item.location : "";
        const employmentType = item.employmentType === "Deltid" ? "Deltid" : "Heltid";
        const publishedAt =
          typeof item.publishedAt === "string" && item.publishedAt ? item.publishedAt : "";
        const lastApplyDate =
          typeof item.lastApplyDate === "string" && item.lastApplyDate ? item.lastApplyDate : "";
        const status = item.status === "Utkast" ? "Utkast" : "Publicerad";
        const updatedAt =
          typeof item.updatedAt === "string" && item.updatedAt
            ? item.updatedAt
            : new Date().toISOString().slice(0, 10);
        const id =
          typeof item.id === "string" && item.id ? item.id : `svc-${Date.now()}-${title}`;

        return {
          id,
          title,
          excerpt,
          description,
          location,
          employmentType,
          publishedAt,
          lastApplyDate,
          status,
          updatedAt,
        } as ServiceItem;
      });
      setServices(normalized);
    } catch {
      // Fallback to mock data if stored payload is invalid.
    } finally {
      setHasLoadedServices(true);
    }
  }, []);

  // Ladda jobbansökningar från localStorage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(JOB_APPLICATIONS_STORAGE_KEY);
      if (!raw) {
        setHasLoadedApplications(true);
        return;
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        setHasLoadedApplications(true);
        return;
      }
      const normalized = (parsed as Record<string, unknown>[]).map((item) => {
        const id = typeof item.id === "string" && item.id ? item.id : `job-${Date.now()}`;
        const fullName = typeof item.fullName === "string" ? item.fullName : "";
        const email = typeof item.email === "string" ? item.email : "";
        const phone = typeof item.phone === "string" ? item.phone : "";
        const role = typeof item.role === "string" ? item.role : "";
        const cvFileName = typeof item.cvFileName === "string" ? item.cvFileName : undefined;
        const cvFilePath = typeof item.cvFilePath === "string" ? item.cvFilePath : undefined;
        const createdAt =
          typeof item.createdAt === "string" && item.createdAt
            ? item.createdAt
            : new Date().toISOString().slice(0, 10);
        const status =
          item.status === "Läst" || item.status === "Väntande" ? item.status : "Ny";
        return {
          id,
          fullName,
          email,
          phone,
          role,
          cvFileName,
          cvFilePath,
          createdAt,
          status,
        } as JobApplication;
      });
      setApplications(normalized);
    } catch {
      // Fallback to mock data if stored payload is invalid.
    } finally {
      setHasLoadedApplications(true);
    }
  }, []);

  // Spara tjänster tillbaka till localStorage när de ändras.
  useEffect(() => {
    if (!hasLoadedServices) return;
    window.localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
  }, [hasLoadedServices, services]);

  // Spara CV-poster tillbaka till localStorage när de ändras.
  useEffect(() => {
    if (!hasLoadedCvItems) return;
    window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvItems));
  }, [hasLoadedCvItems, cvItems]);

  // Spara jobbansökningar tillbaka till localStorage när de ändras.
  useEffect(() => {
    if (!hasLoadedApplications) return;
    window.localStorage.setItem(JOB_APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
  }, [hasLoadedApplications, applications]);

  // filtered bygger listan som visas i aktiv flik utifrån sökfältet.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Hjälpfunktion: sortera så "Ny" visas överst, därefter övriga i oförändrad ordning.
    const sortByStatusPriority = <T extends { status: string }>(items: T[], order: string[]) => {
      const index = new Map(order.map((status, i) => [status, i]));
      return [...items].sort((a, b) => {
        const ia = index.get(a.status) ?? order.length;
        const ib = index.get(b.status) ?? order.length;
        return ia - ib;
      });
    };

    if (activeTab === "cv") {
      const list = cvItems.filter((item) =>
        [item.fullName, item.email, item.competence].join(" ").toLowerCase().includes(q)
      );
      return sortByStatusPriority(list, ["Ny", "Läst"]);
    }


    if (activeTab === "jobs") {
      const list = applications.filter((item) =>
        [item.fullName, item.email, item.role].join(" ").toLowerCase().includes(q)
      );
      return sortByStatusPriority(list, ["Ny", "Väntande", "Läst"]);
    }
    if (activeTab === "services") {
      return services.filter((item) =>
        [
          item.title,
          item.excerpt,
          item.description,
          item.location,
          item.employmentType,
          item.publishedAt,
          item.lastApplyDate,
          item.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return companyInquiries.filter((item) =>
      [item.companyName, item.contactPerson, item.email, item.industry]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [activeTab, query, services, applications, cvItems]);

  function resetServiceForm() {
    setServiceForm({
      title: "",
      excerpt: "",
      description: "",
      location: "",
      employmentType: "Heltid",
      publishedAt: "",
      lastApplyDate: "",
      status: "Publicerad",
    });
    setEditingServiceId(null);
  }

  function openCreateService() {
    resetServiceForm();
    setShowServiceForm(true);
  }

  function openEditService(service: ServiceItem) {
    setServiceForm({
      title: service.title,
      excerpt: service.excerpt,
      description: service.description,
      location: service.location,
      employmentType: service.employmentType,
      publishedAt: service.publishedAt,
      lastApplyDate: service.lastApplyDate,
      status: service.status,
    });
    setEditingServiceId(service.id);
    setShowServiceForm(true);
  }

  function saveService() {
    if (
      !serviceForm.title.trim() ||
      !serviceForm.excerpt.trim() ||
      !serviceForm.description.trim() ||
      !serviceForm.location.trim() ||
      !serviceForm.publishedAt ||
      !serviceForm.lastApplyDate
    ) {
      alert("Fyll i titel, kort text, beskrivning, plats och båda datumen.");
      return;
    }

    const now = new Date().toISOString().slice(0, 10);

    if (editingServiceId) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingServiceId ? { ...s, ...serviceForm, updatedAt: now } : s
        )
      );
    } else {
      setServices((prev) => [
        {
          id: `svc-${Date.now()}`,
          ...serviceForm,
          updatedAt: now,
        },
        ...prev,
      ]);
    }

    setShowServiceForm(false);
    resetServiceForm();
  }

  function removeService(id: string) {
    if (!confirm("Är du säker på att du vill ta bort tjänsten?")) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function removeCvItem(id: string) {
    if (!confirm("Är du säker på att du vill ta bort den här CV-registreringen?")) return;
    setCvItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateCvStatus(id: string, status: CVRegistration["status"]) {
    setCvItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  function updateJobStatus(id: string, status: JobApplication["status"]) {
    setApplications((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      {/* Statistik överst: snabb överblick innan man går in i detaljer. */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Admin Panel</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Logga ut
          </button>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="CV-registreringar"
            value={dashboardStats.cvCount}
            subtitle={`${dashboardStats.cvNewThisWeek} nya denna vecka`}
            icon={<FileText className="h-4 w-4" />}
          />
          <StatCard
            title="Jobbansökningar"
            value={dashboardStats.jobCount}
            subtitle={`${dashboardStats.jobPending} väntande`}
            icon={<BriefcaseBusiness className="h-4 w-4" />}
          />
          <StatCard
            title="Företagsförfrågningar"
            value={dashboardStats.companyCount}
            subtitle={`${dashboardStats.companyNew} nya förfrågningar`}
            icon={<Building2 className="h-4 w-4" />}
          />
        </section>

        {/* Huvudkortet innehåller flikar, sökfält och listor för admininnehållet. */}
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2 rounded-full bg-zinc-100 p-1">
            <TabButton active={activeTab === "cv"} onClick={() => setActiveTab("cv")}>
              CV-registreringar
            </TabButton>
            <TabButton active={activeTab === "jobs"} onClick={() => setActiveTab("jobs")}>
              Jobbansökningar
            </TabButton>
            <TabButton active={activeTab === "company"} onClick={() => setActiveTab("company")}>
              Företagsförfrågningar
            </TabButton>
            <TabButton
              active={activeTab === "services"}
              onClick={() => setActiveTab("services")}
            >
              Tjänster
            </TabButton>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök efter företag, namn, e-post..."
                className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <Download className="h-4 w-4" />
              Exportera
            </button>
            {activeTab === "services" ? (
              <button
                type="button"
                onClick={openCreateService}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#080b22] px-4 text-sm font-semibold text-white transition hover:bg-[#13183b]"
              >
                Ny tjänst
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
                Inga träffar hittades.
              </div>
            ) : null}

            {activeTab === "company" &&
              filtered.map((item) => {
                const company = item as (typeof companyInquiries)[number];
                return (
                  <article key={company.id} className="rounded-xl border border-zinc-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-900">{company.companyName}</h3>
                        <div className="mt-2 space-y-1 text-sm text-zinc-600">
                          <p className="inline-flex items-center gap-2">
                            <User className="h-4 w-4" /> {company.contactPerson}
                          </p>
                          <p>{company.email}</p>
                          <p>{company.phone}</p>
                          <p>{company.industry}</p>
                        </div>
                      </div>
                      <StatusBadge status={company.status} />
                    </div>
                    <p className="mt-4 text-sm text-zinc-700">{company.message}</p>
                    <p className="mt-4 text-xs text-zinc-500">{company.createdAt}</p>
                  </article>
                );
              })}

            {activeTab === "cv" &&
              filtered.map((item) => {
                const cv = item as CVRegistration;
                const cvUrl = getCvUrl(cv.cvFilePath, cv.cvFileName);
                return (
                  <article key={cv.id} className="rounded-xl border border-zinc-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-zinc-900">{cv.fullName}</h3>
                        <div className="mt-2 space-y-1 text-sm text-zinc-600">
                          <p>{cv.email}</p>
                          <p>{cv.phone}</p>
                          <p>{cv.competence}</p>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => updateCvStatus(cv.id, "Ny")}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              cv.status === "Ny"
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            }`}
                          >
                            Markera som ny
                          </button>
                          <button
                            type="button"
                            onClick={() => updateCvStatus(cv.id, "Läst")}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              cv.status === "Läst"
                                ? "bg-emerald-600 text-white"
                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            }`}
                          >
                            Markera som läst
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCvItem(cv.id)}
                            className="rounded-full px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 border border-red-200"
                          >
                            Ta bort
                          </button>
                        </div>
                      </div>
                      <StatusBadge status={cv.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={cvUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                          cvUrl
                            ? "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                            : "pointer-events-none border-zinc-200 text-zinc-400"
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Oppna CV
                      </a>
                      <a
                        href={cvUrl || "#"}
                        download={cv.cvFileName || true}
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                          cvUrl
                            ? "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                            : "pointer-events-none border-zinc-200 text-zinc-400"
                        }`}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Ladda ner CV
                      </a>
                    </div>
                    <p className="mt-4 text-xs text-zinc-500">{cv.createdAt}</p>
                  </article>
                );
              })}

            {activeTab === "jobs" &&
              filtered.map((item) => {
                const job = item as JobApplication;
                const cvUrl = getCvUrl(job.cvFilePath, job.cvFileName);
                return (
                  <article key={job.id} className="rounded-xl border border-zinc-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-zinc-900">{job.fullName}</h3>
                        <div className="mt-2 space-y-1 text-sm text-zinc-600">
                          <p>{job.email}</p>
                          <p>{job.phone}</p>
                          <p>{job.role}</p>
                          {cvUrl ? (
                            <p>
                              CV:{" "}
                              <a
                                href={cvUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-zinc-800 underline"
                              >
                                {job.cvFileName || "Öppna CV"}
                              </a>
                            </p>
                          ) : job.cvFileName ? (
                            <p>CV: {job.cvFileName}</p>
                          ) : null}
                          <div className="pt-1">
                            <a
                              href={cvUrl || "#"}
                              download={job.cvFileName || true}
                              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                                cvUrl
                                  ? "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                                  : "pointer-events-none border-zinc-200 text-zinc-400"
                              }`}
                            >
                              <Download className="h-3.5 w-3.5" />
                              Ladda ner CV
                            </a>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => updateJobStatus(job.id, "Ny")}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              job.status === "Ny"
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            }`}
                          >
                            Markera som ny
                          </button>
                          <button
                            type="button"
                            onClick={() => updateJobStatus(job.id, "Väntande")}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              job.status === "Väntande"
                                ? "bg-amber-600 text-white"
                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            }`}
                          >
                            Markera som väntande
                          </button>
                          <button
                            type="button"
                            onClick={() => updateJobStatus(job.id, "Läst")}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              job.status === "Läst"
                                ? "bg-emerald-600 text-white"
                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            }`}
                          >
                            Markera som läst
                          </button>
                        </div>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="mt-4 text-xs text-zinc-500">{job.createdAt}</p>
                  </article>
                );
              })}

            {activeTab === "services" &&
              filtered.map((item) => {
                const service = item as ServiceItem;
                return (
                  <article key={service.id} className="rounded-xl border border-zinc-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-900">{service.title}</h3>
                        <p className="mt-2 text-sm text-zinc-600">{service.excerpt}</p>
                      </div>
                      <StatusBadge status={service.status} />
                    </div>

                    <p className="mt-3 text-sm text-zinc-700">{service.description}</p>
                    <div className="mt-3 space-y-1 text-sm text-zinc-600">
                      <p>Plats: {service.location}</p>
                      <p>Anställning: {service.employmentType}</p>
                      <p>Publicerad: {toSwedishDate(service.publishedAt)}</p>
                      <p>Sista ansökningsdag: {toSwedishDate(service.lastApplyDate)}</p>
                    </div>
                    <p className="mt-4 text-xs text-zinc-500">Uppdaterad: {service.updatedAt}</p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditService(service)}
                        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Redigera
                      </button>
                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Ta bort
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      </div>

      {showServiceForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-zinc-900">
              {editingServiceId ? "Redigera tjänst" : "Ny tjänst"}
            </h2>

            <div className="mt-4 space-y-3 text-zinc-900 ">
              <input
                value={serviceForm.title}
                onChange={(e) => setServiceForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Titel"
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
              />
              <input
                value={serviceForm.excerpt}
                onChange={(e) => setServiceForm((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="Kort text"
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
              />
              <textarea
                value={serviceForm.description}
                onChange={(e) =>
                  setServiceForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Beskrivning"
                rows={4}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
              <input
                value={serviceForm.location}
                onChange={(e) => setServiceForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Plats (t.ex. Malmö / Hybrid)"
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
              />
              <select
                value={serviceForm.employmentType}
                onChange={(e) =>
                  setServiceForm((p) => ({
                    ...p,
                    employmentType: e.target.value as "Heltid" | "Deltid",
                  }))
                }
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
              >
                <option value="Heltid">Heltid</option>
                <option value="Deltid">Deltid</option>
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">Publicerad</label>
                  <input
                    type="date"
                    value={serviceForm.publishedAt}
                    onChange={(e) =>
                      setServiceForm((p) => ({ ...p, publishedAt: e.target.value }))
                    }
                    className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">
                    Sista ansökningsdag
                  </label>
                  <input
                    type="date"
                    value={serviceForm.lastApplyDate}
                    onChange={(e) =>
                      setServiceForm((p) => ({ ...p, lastApplyDate: e.target.value }))
                    }
                    className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
              <select
                value={serviceForm.status}
                onChange={(e) =>
                  setServiceForm((p) => ({
                    ...p,
                    status: e.target.value as "Publicerad" | "Utkast",
                  }))
                }
                className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
              >
                <option value="Publicerad">Publicerad</option>
                <option value="Utkast">Utkast</option>
              </select>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowServiceForm(false);
                  resetServiceForm();
                }}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={saveService}
                className="rounded-md bg-[#080b22] px-4 py-2 text-sm font-semibold text-white hover:bg-[#13183b]"
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}