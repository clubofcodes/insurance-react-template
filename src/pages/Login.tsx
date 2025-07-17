import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Shield, Eye, EyeOff } from "lucide-react";
import type { LoginFormData, User } from "../types";

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError("");

      // Mock authentication - replace with actual API call
      const mockUsers: Record<string, { user: User; token: string }> = {
        "admin@master.com": {
          user: {
            id: "1",
            email: "admin@master.com",
            firstName: "Master",
            lastName: "Admin",
            role: "master_admin",
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: "mock-master-token",
        },
        "admin@agency.com": {
          user: {
            id: "2",
            email: "admin@agency.com",
            firstName: "Agency",
            lastName: "Admin",
            role: "agency_admin",
            status: "active",
            agencyId: "agency-1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: "mock-agency-token",
        },
        "agent@demo.com": {
          user: {
            id: "3",
            email: "agent@demo.com",
            firstName: "Demo",
            lastName: "Agent",
            role: "agent",
            status: "active",
            agencyId: "agency-1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: "mock-agent-token",
        },
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (data.password === "password123" && mockUsers[data.email]) {
        const { user, token } = mockUsers[data.email];
        login(user, token);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Insurance Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className={
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Demo Accounts:
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div>Master Admin: admin@master.com / password123</div>
                <div>Agency Admin: admin@agency.com / password123</div>
                <div>Agent: agent@demo.com / password123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
