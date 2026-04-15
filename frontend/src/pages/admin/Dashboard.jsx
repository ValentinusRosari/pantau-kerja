import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import { attendanceService } from "../../services/endpoints";
import toast, { Toaster } from "react-hot-toast";
import { FileImage, Search } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function AdminDashboard() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateFrom, setDateFrom] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dateTo, setDateTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAttendances();
  }, [meta.page]);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getAll({
        page: meta.page,
        limit: meta.limit,
        date_from: dateFrom,
        date_to: dateTo,
        search: search,
      });
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      toast.error("Gagal memuat data absensi");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setMeta((m) => ({ ...m, page: 1 }));
    fetchAttendances();
  };

  const getImageUrl = (path) => `http://localhost:3000${path}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-white">Monitoring Absensi</h1>
        <p className="text-gray-400">Pantau seluruh absensi karyawan WFH</p>
      </div>

      <Card>
        <CardHeader className="border-b border-surface-lighter pb-4">
          <form className="flex flex-col md:flex-row gap-4 items-end" onSubmit={handleFilter}>
            <Input 
              placeholder="Cari nama karyawan..." 
              label="Cari Karyawan"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
            <Input
              type="date"
              label="Dari Tanggal"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              label="Sampai Tanggal"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <Button type="submit" className="w-full md:w-auto h-10">
              <Search className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </form>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-surface border-b border-surface-lighter">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                  Karyawan
                </th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                  Tipe
                </th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                  Waktu
                </th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                  Catatan
                </th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider text-right">
                  Foto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lighter">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data absensi pada periode ini.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-lighter/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{item.employee?.fullName}</div>
                      <div className="text-gray-400 text-xs">
                        {item.employee?.employeeCode} - {item.employee?.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.type === "clock_in"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {item.type === "clock_in" ? "Clock In" : "Clock Out"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white">
                        {format(new Date(item.timestamp), "dd MMM yyyy", { locale: idLocale })}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {format(new Date(item.timestamp), "HH:mm:ss")}
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.note || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {item.photos && item.photos.length > 0 ? (
                        <a
                          href={getImageUrl(item.photos[0].filePath)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 bg-primary-400/10 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium"
                        >
                          <FileImage className="w-3.5 h-3.5" />
                          Lihat
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-lighter">
            <div className="text-sm text-gray-400">
              Halaman <span className="font-semibold text-white">{meta.page}</span> dari{" "}
              <span className="font-semibold text-white">{meta.totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={meta.page === 1}
                onClick={() => setMeta((m) => ({ ...m, page: m.page - 1 }))}
                className="px-3 py-1.5 rounded-md bg-surface border border-surface-lighter text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-lighter transition-colors"
              >
                Sebelumnya
              </button>
              <button
                disabled={meta.page === meta.totalPages}
                onClick={() => setMeta((m) => ({ ...m, page: m.page + 1 }))}
                className="px-3 py-1.5 rounded-md bg-surface border border-surface-lighter text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-lighter transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
