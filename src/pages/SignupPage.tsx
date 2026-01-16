import { useNavigate } from "react-router-dom";
import { AuthForm } from "./AuthForm";

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <AuthForm
      mode="signup"
      onModeChange={(mode) => navigate(mode === "login" ? "/login" : "/signup")}
      onAuthSuccess={() => navigate("/login")}
    />
  );
}
