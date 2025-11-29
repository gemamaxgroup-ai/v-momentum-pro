"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DemoUser {
  email: string;
  password: string;
}

const demoUsers: DemoUser[] = [
  { email: "etroco@gmail.com", password: "Welc0me1234" },
  { email: "lsantolalla74@gmail.com", password: "Welc0me1234" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Normalizar email (trim y lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Buscar usuario demo que coincida
    const matchedUser = demoUsers.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === normalizedPassword
    );

    if (matchedUser) {
      // Login exitoso
      // Guardar flag en localStorage para uso futuro
      if (typeof window !== "undefined") {
        localStorage.setItem("vmomentum_demo_user", matchedUser.email);
      }

      // Redirigir a /app
      router.push("/app");
    } else {
      // Credenciales inválidas
      setError(
        "Invalid credentials. Please use one of the demo accounts provided by your administrator."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Card de login */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to V-Momentum-Pro</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === "true" && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-500 text-center">
                For demo access you can use:
                <br />
                <span className="text-slate-400">
                  etroco@gmail.com / Welc0me1234
                </span>
                <br />
                <span className="text-slate-400">
                  lsantolalla74@gmail.com / Welc0me1234
                </span>
              </p>
            </div>
          )}

          {process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS !== "true" && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-400 text-center">
                Use your V-Momentum-Pro account to log in.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
