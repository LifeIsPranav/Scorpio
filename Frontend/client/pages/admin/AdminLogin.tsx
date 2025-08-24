import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login, isLoading, isAuthenticated } = useAdminAuth();

  // If already authenticated, redirect to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-white dark:text-gray-900" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Portal
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Access the store administration
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                  placeholder="Enter admin username"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white pr-10"
                    placeholder="Enter admin password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 border-0 h-12 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-0 h-auto"
                onClick={() => navigate("/")}
              >
                ← Back to Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
