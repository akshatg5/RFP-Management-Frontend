import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { whoami } from "../lib/apiClient";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const [user, setUser] = useState<{
    authenticated: boolean;
    user?: {
      id: string;
      email: string;
      name: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const result = await whoami();
      setUser(result);
      setLoading(false);
    };

    checkAuth();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser({ authenticated: false });
    navigate("/login");
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity"
        >
          <div className="w-6 h-6 rounded border flex items-center justify-center">
            <span className="text-xs font-medium">EH</span>
          </div>
          <span>ExpertHub</span>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && user?.authenticated ? (
            <>
              {user?.user?.name && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-black">
                    Hi, {user?.user?.name}
                  </span>
                </div>
              )}
              <Link to="/chat">
                <Button
                  variant="ghost"
                  className={location.pathname === "/chat" ? "bg-muted" : ""}
                >
                  Chat
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            !loading &&
            !isAuthPage && (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
