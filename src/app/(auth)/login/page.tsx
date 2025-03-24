"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-[400px] h-[300px] bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-2xl" />
        </div>

        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">
              Sign in to access your PrimeSpot account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 bg-black/50 border-white/10 focus:border-white/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  name="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 bg-black/50 border-white/10 focus:border-white/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  name="password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-600 bg-black/50 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg shadow-blue-700/20"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : null}
              Sign in
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/30 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              className="mt-4 w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg"
              onClick={loginWithGoogle}
              disabled={loading}
            >
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.69 17.56V20.26H19.22C21.22 18.41 22.56 15.61 22.56 12.25Z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23C14.96 23 17.46 22.02 19.22 20.26L15.69 17.56C14.73 18.21 13.48 18.59 12 18.59C9.26 18.59 6.94 16.78 6.12 14.31H2.62V17.1C4.22 20.66 7.83 23 12 23Z"
                  fill="#34A853"
                />
                <path
                  d="M6.12 14.31C5.91 13.65 5.79 12.94 5.79 12.19C5.79 11.44 5.91 10.73 6.12 10.07V7.28H2.62C1.84 8.67 1.37 10.32 1.37 12.19C1.37 14.06 1.84 15.71 2.62 17.1L6.12 14.31Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.8C13.63 5.8 15.08 6.35 16.22 7.41L19.28 4.35C17.46 2.67 14.96 1.69 12 1.69C7.83 1.69 4.22 4.03 2.62 7.59L6.12 10.38C6.94 7.91 9.26 5.8 12 5.8Z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
