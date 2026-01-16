import type React from "react";

import { useState } from "react";
import { apiClient } from "../lib/apiClient";
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Mode = "login" | "signup";

interface AuthFormProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onAuthSuccess?: () => void;
}

export function AuthForm({ mode, onModeChange, onAuthSuccess }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isSignup) {
        await apiClient.post("/api/auth/signup", {
          name,
          email,
          password,
        });
        setSuccess("Welcome to your skincare journey! Redirecting to login...");
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess();
        }, 1500);
      } else {
        const response = await apiClient.post("/api/auth/login", {
          email,
          password,
        });
        setSuccess("Welcome back to your skincare chat! Redirecting...");
        if (response.data?.token) {
          localStorage.setItem("authToken", response.data.token);
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess();
          }, 800);
        }
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-6 border rounded-lg bg-card">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {isSignup ? "Join this community" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignup
              ? "Create your account to start your personalized skincare journey"
              : "Continue your skincare conversations and discover new insights"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10"
                  placeholder="Jane Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading
              ? isSignup
                ? "Creating account..."
                : "Logging in..."
              : isSignup
              ? "Sign Up"
              : "Log In"}
          </Button>
        </form>

        {error && (
          <div
            className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm"
            role="status"
          >
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => onModeChange(isSignup ? "login" : "signup")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignup ? "Already part of our community? " : "Ready to start your journey? "}
            <span className="font-semibold underline">
              {isSignup ? "Sign in" : "Join us"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
