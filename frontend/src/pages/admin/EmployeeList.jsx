import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { employeeService } from '../../services/endpoints';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { EmployeeModal } from './EmployeeModal';
import { AttendanceHistoryModal } from './AttendanceHistoryModal';

export function AdminEmployees() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  
  // Employee Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // History Modal state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyEmployee, setHistoryEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [meta.page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getAll({ 
        page: meta.page, 
        limit: meta.limit,
        search,
        department,
        position
      });
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      toast.error('Gagal memuat data karyawan');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setMeta(m => ({ ...m, page: 1 }));
    fetchEmployees();
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleHistory = (employee) => {
    setHistoryEmployee(employee);
    setIsHistoryOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menonaktifkan karyawan ini?')) {
      try {
        await employeeService.remove(id);
        toast.success('Karyawan berhasil dinonaktifkan');
        fetchEmployees();
      } catch (error) {
        toast.error('Gagal menonaktifkan karyawan');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster position="top-right" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Karyawan</h1>
          <p className="text-gray-400">Kelola data master karyawan perusahaan</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-5 h-5 mr-2" />
          Tambah Karyawan
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-surface-lighter pb-4">
          <form className="flex flex-wrap lg:flex-nowrap gap-4" onSubmit={handleSearch}>
            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder="Cari nama karyawan..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder="Filter Departemen" 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder="Filter Posisi" 
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" className="shrink-0">Filter</Button>
          </form>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-surface border-b border-surface-lighter">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">ID</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Nama & Kontak</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Posisi</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lighter">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Tidak ada data karyawan.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-lighter/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                      {item.employeeCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{item.fullName}</div>
                      <div className="text-gray-400 text-xs">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white">{item.position || '-'}</div>
                      <div className="text-gray-400 text-xs">{item.department || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {item.isActive ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          title="Riwayat Absensi"
                          onClick={() => handleHistory(item)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-surface-lighter rounded-lg transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button 
                          title="Edit"
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-surface-lighter rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {item.isActive && (
                          <button 
                            title="Nonaktifkan"
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-surface-lighter rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (sama seperti yg lainnya) */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-lighter">
             <div className="text-sm text-gray-400">
               Halaman <span className="font-semibold text-white">{meta.page}</span> dari <span className="font-semibold text-white">{meta.totalPages}</span>
             </div>
             <div className="flex gap-2">
               <button 
                 disabled={meta.page === 1}
                 onClick={() => setMeta(m => ({ ...m, page: m.page - 1 }))}
                 className="px-3 py-1.5 rounded-md bg-surface border border-surface-lighter text-sm font-medium hover:bg-surface-lighter transition-colors disabled:opacity-50"
               >
                 Prev
               </button>
               <button 
                 disabled={meta.page === meta.totalPages}
                 onClick={() => setMeta(m => ({ ...m, page: m.page + 1 }))}
                 className="px-3 py-1.5 rounded-md bg-surface border border-surface-lighter text-sm font-medium hover:bg-surface-lighter transition-colors disabled:opacity-50"
               >
                 Next
               </button>
             </div>
          </div>
        )}
      </Card>

      <EmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />

      <AttendanceHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        employee={historyEmployee}
      />
    </div>
  );
}
