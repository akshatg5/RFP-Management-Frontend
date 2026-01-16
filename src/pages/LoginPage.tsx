import { useNavigate } from "react-router-dom";
import { AuthForm } from "./AuthForm";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthForm
      mode="login"
      onModeChange={(mode) =>
        navigate(mode === "signup" ? "/signup" : "/login")
      }
      onAuthSuccess={() => navigate("/chat")}
    />
  );
}
