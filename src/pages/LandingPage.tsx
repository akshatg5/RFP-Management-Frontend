"use client";

import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full space-y-20">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-balance">
              ExpertHub
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Connect with specialized AI experts across skincare, finance, technology, fitness, and more.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-6">
              <Button
                onClick={() => navigate("/signup")}
                className="px-6"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="px-6"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <h3 className="font-medium text-sm">Skincare</h3>
              <p className="text-xs text-muted-foreground">Dermatology advice</p>
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-medium text-sm">Finance</h3>
              <p className="text-xs text-muted-foreground">Money management</p>
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-medium text-sm">Technology</h3>
              <p className="text-xs text-muted-foreground">Tech support</p>
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-medium text-sm">Fitness</h3>
              <p className="text-xs text-muted-foreground">Health guidance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
