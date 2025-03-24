"use client";
import ImageSlider from "@/components/shared/ImageSlider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type LoginInputs = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

// type SignupInputs = {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   role: string;
// };

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginForm = useForm<LoginInputs>();
  const router = useRouter();

  const handleLogin = async (data: LoginInputs) => {
    const { email, password } = data;
    setIsLoading(true);
    try {
      // Implement your authentication logic here
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(
          "Login failed: " + (data.message || "Please check your credentials")
        );
      } else {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        router.push("/pos");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const images = [
    "/images/tsherles52 .jpeg",
    "/images/tsherles55 .jpeg",
    "/images/tsherles56 .jpeg",
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen h-full items-stretch md:pl-3">
      <div className="w-[90%] mx-auto md:w-1/2 h-64 md:h-auto flex relative rounded-md flex-col justify-center bg-primary/5 mt-4 md:my-4">
        <div className="hidden absolute top-4 z-50 w-full md:flex flex-row justify-between px-6">
          <div className="w-4"></div>
          <Link href={`/`}>
            <Button className="bg-transparent/70 dark:text-white">
              Back to the home page
            </Button>
          </Link>
        </div>
        <ImageSlider images={images} />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 w-full">
        <div className="w-full max-w-md space-y-3 flex flex-col justify-center">
          <div className="w-full flex justify-center pb-6">
            <Image
              className="hidden w-auto h-10 dark:block "
              src="/images/tsherles.png"
              height={1000}
              width={1000}
              alt="logo of sayit"
            />
            <Image
              className="block w-60 h-auto dark:hidden"
              src="/images/tsherles.png"
              height={1000}
              width={1000}
              alt="logo of sayit"
            />
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome Back
              </h2>
              <p className="text-muted-foreground mt-2">
                Sign in to access your POS system
              </p>
            </div>

            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10 h-10 border-muted-foreground/20 focus:border-primary"
                    {...loginForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-10 border-muted-foreground/20 focus:border-primary"
                    {...loginForm.register("password", {
                      required: "Password is required",
                    })}
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
