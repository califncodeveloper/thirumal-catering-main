import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { loginServerFn } from "../../lib/admin-api.server";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Thirumal Catering Services" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginServerFn({
        data: {
          email: email.trim(),
          password,
        },
      });

      if (res.success) {
        navigate({ to: "/admin" });
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setErrorMessage((err as Error)?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-maroon-deep flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative filigree / background elements */}
      <div className="absolute inset-0 opacity-15 bg-[url('/images/services-hero-bg.jpg')] bg-cover bg-center" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card/95 backdrop-blur-xl border-2 border-gold/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-foreground">
          {/* Logo & Brand */}
          <div className="text-center space-y-3 mb-8">
            <div className="mx-auto w-20 h-20 rounded-full ring-4 ring-gold bg-white p-1 shadow-xl flex items-center justify-center">
              <img
                src="/logo-with-bg.png"
                alt="Thirumal Catering"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Thirumal Catering
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold flex items-center justify-center gap-1 mt-1">
                <ShieldCheck size={14} /> Admin Portal
              </p>
            </div>
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-semibold leading-relaxed animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thirumalcatering.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 rounded-2xl gold-gradient text-maroon-deep font-bold text-sm tracking-wide shadow-xl hover:shadow-[0_10px_30px_rgba(201,162,76,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <a
              href="/"
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              ← Back to Thirumal Catering Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
