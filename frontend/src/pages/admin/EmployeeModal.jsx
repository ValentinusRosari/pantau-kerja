import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { employeeService } from '../../services/endpoints';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

export function EmployeeModal({ isOpen, onClose, employee, onSuccess }) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (employee) {
        reset({
          fullName: employee.fullName,
          email: employee.email,
          phone: employee.phone || '',
          department: employee.department || '',
          position: employee.position || '',
          joinDate: employee.joinDate || ''
        });
      } else {
        reset({
          fullName: '', email: '', phone: '', department: '', position: '', joinDate: '', username: '', password: ''
        });
      }
    }
  }, [isOpen, employee, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (employee) {
        // Exclude username and password from update
        const { username, password, ...updateData } = data;
        await employeeService.update(employee.id, updateData);
        toast.success('Berhasil mengupdate karyawan');
      } else {
        await employeeService.create(data);
        toast.success('Berhasil menambahkan karyawan baru');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-card border border-surface-lighter w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-surface-lighter">
          <h2 className="text-xl font-semibold text-white">
            {employee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="employee-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap *"
                error={errors.fullName?.message}
                {...register('fullName', { required: 'Kewajiban diisi' })}
              />
              <Input
                label="Email *"
                type="email"
                error={errors.email?.message}
                {...register('email', { 
                  required: 'Kewajiban diisi',
                  pattern: { value: /^\S+@\S+$/i, message: 'Format email tidak valid' }
                })}
              />
              <Input label="No. Handphone" {...register('phone')} />
              <Input label="Departemen" {...register('department')} />
              <Input label="Posisi/Jabatan" {...register('position')} />
              <Input label="Tanggal Masuk" type="date" {...register('joinDate')} />
            </div>

            {!employee && (
              <>
                <h3 className="text-lg font-medium text-white pt-4 mt-2 border-t border-surface-lighter">Kredensial Akun</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Username Login *"
                    error={errors.username?.message}
                    {...register('username', { required: 'Kewajiban diisi', minLength: 3 })}
                  />
                  <Input
                    label="Password *"
                    type="password"
                    error={errors.password?.message}
                    {...register('password', { required: 'Kewajiban diisi', minLength: 6 })}
                  />
                  <Input
                    label="Konfirmasi Password *"
                    type="password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', { 
                      required: 'Kewajiban diisi', 
                      validate: val => {
                        if (watch('password') !== val) {
                          return 'Password tidak sesuai';
                        }
                      }
                    })}
                  />
                </div>
              </>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-surface-lighter bg-surface flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button form="employee-form" type="submit" isLoading={isLoading}>
            {employee ? 'Simpan Perubahan' : 'Tambahkan Karyawan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
