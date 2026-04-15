import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const user = await login(data.username, data.password);
      toast.success("Login berhasil!");

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login gagal. Periksa username dan password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in relative z-10">
        <div className="mx-auto w-16 h-16 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/30 flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
          Pantau<span className="text-primary-400">Kerja</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Aplikasi Manajemen & Absensi WFH Karyawan
        </p>
      </div>

      <div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-in relative z-10"
        style={{ animationDelay: "0.1s" }}
      >
        <Card className="border-gray-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Masuk ke Akun</CardTitle>
            <CardDescription className="text-center">
              Masuk sebagai Admin atau Karyawan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Username"
                type="text"
                placeholder="Masukkan username"
                icon={User}
                error={errors.username?.message}
                {...register("username", { required: "Username wajib diisi" })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register("password", { required: "Password wajib diisi" })}
              />

              <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
