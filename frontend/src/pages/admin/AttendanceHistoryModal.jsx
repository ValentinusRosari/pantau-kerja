import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { attendanceService } from '../../services/endpoints';
import toast from 'react-hot-toast';
import { X, FileImage, Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function AttendanceHistoryModal({ isOpen, onClose, employee }) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (isOpen && employee) {
      fetchAttendances();
    }
  }, [isOpen, employee, meta.page]);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const params = { 
        page: meta.page, 
        limit: meta.limit,
        employee_id: employee.id
      };
      
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await attendanceService.getAll(params);
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      toast.error('Gagal memuat data absensi karyawan');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setMeta(m => ({ ...m, page: 1 }));
    fetchAttendances();
  };

  if (!isOpen) return null;

  const getImageUrl = (path) => `http://localhost:3000${path}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-card border border-surface-lighter w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-surface-lighter gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Riwayat Absensi
            </h2>
            <p className="text-sm text-gray-400 mt-1">Karyawan: {employee?.fullName} ({employee?.employeeCode})</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors self-start sm:self-auto bg-surface-lighter rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-surface-lighter">
          <form className="flex flex-col sm:flex-row gap-4 items-end" onSubmit={handleFilter}>
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
            <Button type="submit" className="w-full sm:w-auto h-10">
              <Search className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </form>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="sticky top-0 text-xs text-gray-400 uppercase bg-surface-lighter">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Tipe</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Waktu</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Catatan</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider text-right">Lampiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lighter">
              {loading ? (
                 <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                 <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Tidak ada riwayat absensi.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-lighter/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                         item.type === 'clock_in' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                       }`}>
                         {item.type === 'clock_in' ? 'Clock In' : 'Clock Out'}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white">{format(new Date(item.timestamp), 'dd MMM yyyy', { locale: idLocale })}</div>
                      <div className="text-gray-400 text-xs">{format(new Date(item.timestamp), 'HH:mm:ss')}</div>
                    </td>
                    <td className="px-6 py-4">{item.note || '-'}</td>
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
                      ) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination inside Modal */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-lighter bg-surface shrink-0">
             <div className="text-sm text-gray-400">
               Page <span className="font-semibold text-white">{meta.page}</span> of <span className="font-semibold text-white">{meta.totalPages}</span>
             </div>
             <div className="flex gap-2">
               <button 
                 disabled={meta.page === 1}
                 onClick={() => setMeta(m => ({ ...m, page: m.page - 1 }))}
                 className="px-3 py-1.5 rounded-md bg-surface-card border border-surface-lighter text-sm font-medium hover:bg-surface-lighter transition-colors disabled:opacity-50"
               >
                 Prev
               </button>
               <button 
                 disabled={meta.page === meta.totalPages}
                 onClick={() => setMeta(m => ({ ...m, page: m.page + 1 }))}
                 className="px-3 py-1.5 rounded-md bg-surface-card border border-surface-lighter text-sm font-medium hover:bg-surface-lighter transition-colors disabled:opacity-50"
               >
                 Next
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
