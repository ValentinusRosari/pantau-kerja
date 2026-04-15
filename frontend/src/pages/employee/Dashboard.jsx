import { useState, useEffect, useRef } from 'react';
import { Camera, Upload, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { attendanceService } from '../../services/endpoints';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export function EmpDashboard() {
  const [status, setStatus] = useState({
    loading: true,
    hasClockedIn: false,
    hasClockedOut: false,
    clockIn: null,
    clockOut: null,
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStatus = async () => {
    try {
      const { data } = await attendanceService.getTodayStatus();
      setStatus({ ...data, loading: false });
    } catch (error) {
      toast.error('Gagal memuat status absensi');
      setStatus(s => ({ ...s, loading: false }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (type) => {
    if (!photoFile) {
      toast.error('Foto wajib dilampirkan!');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('photo', photoFile);
      if (note) formData.append('note', note);

      if (type === 'clock_in') {
        await attendanceService.clockIn(formData);
        toast.success('Berhasil Clock In!');
      } else {
        await attendanceService.clockOut(formData);
        toast.success('Berhasil Clock Out!');
      }

      setPhotoFile(null);
      setPhotoPreview(null);
      setNote('');
      fetchStatus();
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan absensi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status.loading) {
    return <div className="flex animate-pulse space-x-4"><div className="h-48 w-full bg-surface-lighter rounded-xl"></div></div>;
  }

  const isComplete = status.hasClockedIn && status.hasClockedOut;

  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Absensi</h1>
          <p className="text-gray-400">{format(currentTime, 'EEEE, d MMMM yyyy', { locale: idLocale })}</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-card border border-surface-lighter px-4 py-2 rounded-lg shadow-sm">
          <Clock className="text-primary-400 w-5 h-5" />
          <span className="text-xl font-mono text-white tracking-widest">
            {format(currentTime, 'HH:mm:ss')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Status Hari Ini</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 relative">
              {/* Timeline graphic indicator */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-surface-lighter"></div>
              
              <div className="relative pl-10">
                <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-surface-card flex items-center justify-center ${status.hasClockedIn ? 'bg-green-500 text-white' : 'bg-surface-lighter'}`}>
                  {status.hasClockedIn && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <h4 className="text-sm font-medium text-gray-400">Clock In</h4>
                <p className="text-lg font-semibold text-white">
                  {status.hasClockedIn ? format(new Date(status.clockIn.timestamp), 'HH:mm') : '--:--'}
                </p>
              </div>

              <div className="relative pl-10">
                <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-surface-card flex items-center justify-center ${status.hasClockedOut ? 'bg-blue-500 text-white' : 'bg-surface-lighter'}`}>
                  {status.hasClockedOut && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <h4 className="text-sm font-medium text-gray-400">Clock Out</h4>
                <p className="text-lg font-semibold text-white">
                  {status.hasClockedOut ? format(new Date(status.clockOut.timestamp), 'HH:mm') : '--:--'}
                </p>
              </div>
            </div>

            {isComplete && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 flex py-3 items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Absensi hari ini sudah selesai. Terima kasih!</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Card */}
        {!isComplete && (
          <Card className="border-primary-500/30 shadow-lg shadow-primary-500/10">
            <CardHeader>
              <CardTitle>Ambil Foto WFH</CardTitle>
              <CardDescription>Lampirkan foto bukti sedang bekerja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div 
                className="border-2 border-dashed border-gray-700 hover:border-primary-500 transition-colors rounded-xl overflow-hidden relative cursor-pointer group bg-surface flex flex-col items-center justify-center aspect-video"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                      <Camera className="w-8 h-8 mb-2" />
                      <span>Ganti Foto</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-surface-lighter flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6 text-gray-400 group-hover:text-primary-400" />
                    </div>
                    <p className="text-sm font-medium">Klik untuk buka kamera / galeri</p>
                    <p className="text-xs text-gray-500 mt-1">Hanya file JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </div>

              <Input 
                placeholder="Catatan (Opsional, misal: Mulai shift / Selesai shift)" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="pt-2">
                {!status.hasClockedIn ? (
                   <Button 
                     className="w-full" 
                     size="lg" 
                     onClick={() => handleSubmit('clock_in')}
                     isLoading={isSubmitting}
                   >
                     Mulai Kerja (Clock In)
                   </Button>
                ) : (
                  <Button 
                     className="w-full" 
                     variant="secondary"
                     size="lg" 
                     onClick={() => handleSubmit('clock_out')}
                     isLoading={isSubmitting}
                   >
                     Selesai Kerja (Clock Out)
                   </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
