
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, User, Mail, Lock, Eye, EyeOff, UserCheck, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });

  // Password validation criteria
  const passwordCriteria = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Password tidak valid",
        description: "Pastikan password memenuhi semua kriteria",
        variant: "destructive",
      });
      return;
    }

    // Validate form
    if (!formData.fullName.trim() || !formData.username.trim() || !formData.email.trim()) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting registration process...');
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        formData.username, 
        formData.fullName
      );

      if (!error) {
        console.log('Registration successful, redirecting to verification...');
        // Redirect to verification page with email parameter
        navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
      } else {
        console.error('Registration error:', error);
        toast({
          title: "Registrasi gagal",
          description: error.message || "Terjadi kesalahan saat mendaftar",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registrasi gagal",
        description: "Terjadi kesalahan sistem",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Cloud className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SamuelIndraBastian Cloud
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <Card className="bg-white/60 backdrop-blur-lg border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Buat Akun Baru
            </CardTitle>
            <CardDescription>
              Daftar untuk mengakses semua fitur cloud storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-white/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">Username</Label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username_unik"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-white/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-white/50 border-white/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Buat password kuat"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-white/50 border-white/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Criteria */}
                {formData.password && (
                  <div className="mt-3 p-3 bg-white/30 rounded-lg backdrop-blur-sm">
                    <p className="text-sm font-medium text-gray-700 mb-2">Kriteria Password:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center text-xs ${passwordCriteria.minLength ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordCriteria.minLength ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Minimal 8 karakter
                      </div>
                      <div className={`flex items-center text-xs ${passwordCriteria.hasUppercase ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordCriteria.hasUppercase ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Huruf besar (A-Z)
                      </div>
                      <div className={`flex items-center text-xs ${passwordCriteria.hasLowercase ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordCriteria.hasLowercase ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Huruf kecil (a-z)
                      </div>
                      <div className={`flex items-center text-xs ${passwordCriteria.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordCriteria.hasNumber ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Angka (0-9)
                      </div>
                      <div className={`flex items-center text-xs ${passwordCriteria.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordCriteria.hasSpecialChar ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Karakter khusus (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mendaftar...
                  </div>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
