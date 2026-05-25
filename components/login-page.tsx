"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ThemeToggle } from "./theme-toggle";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Email atau password tidak sesuai");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (emailStr: string, pass: string) => {
    setEmail(emailStr);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-card dark:bg-card rounded-2xl shadow-xl p-8 border border-border dark:border-border/50 transition-colors">
          {/* GANTI LOGO KE logo.png */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl mx-auto flex items-center justify-center mb-4 overflow-hidden bg-white">
              <img
                src="/logo.png"
                alt="STMIK El Rahma"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              STMIK El Rahma
            </h1>
            <p className="text-muted-foreground">Sistem Absensi</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@stmik.ac.id"
                className="w-full px-4 py-2.5 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border dark:border-border/50"
                />
                <span className="text-foreground">Ingat saya</span>
              </label>
              <a href="#" className="text-primary hover:underline font-medium">
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-2.5 rounded-lg transition-colors duration-200 mt-6"
            >
              {loading ? "Sedang Masuk..." : "Masuk"}
            </button>
          </form>

          <div className="border-t border-border dark:border-border/50 pt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Akun Demo
            </p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin("admin@stmik.ac.id", "admin123")}
                className="w-full text-left p-3 rounded-lg bg-secondary dark:bg-secondary/50 hover:bg-secondary/80 dark:hover:bg-secondary/60 border border-border dark:border-border/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Administrator
                    </p>
                    <p className="text-xs text-muted-foreground">
                      admin@stmik.ac.id
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Akses penuh ke semua fitur
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-background dark:bg-background/50 px-2 py-1 rounded border border-border dark:border-border/50 text-muted-foreground">
                    admin
                  </span>
                </div>
              </button>
              <button
                onClick={() => quickLogin("dosen@stmik.ac.id", "user123")}
                className="w-full text-left p-3 rounded-lg bg-secondary dark:bg-secondary/50 hover:bg-secondary/80 dark:hover:bg-secondary/60 border border-border dark:border-border/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Dr. Ahmad Wijaya
                    </p>
                    <p className="text-xs text-muted-foreground">
                      dosen@stmik.ac.id
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pengajuan izin/sakit/cuti
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-background dark:bg-background/50 px-2 py-1 rounded border border-border dark:border-border/50 text-muted-foreground">
                    user
                  </span>
                </div>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Hubungi Admin jika ada kendala login
          </p>
        </div>
      </div>
    </div>
  );
}
