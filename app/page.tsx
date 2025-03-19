"use client"
import ImageSlider from "@/components/shared/ImageSlider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Loader2, Lock, Mail, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Toaster, toast } from "sonner"

type LoginInputs = {
  email: string
  password: string
  rememberMe?: boolean
}

type SignupInputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: string
}

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("login")

  const loginForm = useForm<LoginInputs>()
  const signupForm = useForm<SignupInputs>()

  const router = useRouter()
  const handleLogin = async (data: LoginInputs) => {
    const { email, password } = data
    setIsLoading(true)
    try {
      // Implement your authentication logic here
      console.log("Login data:", email)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      console.log(data)
      if (!res.ok) {
        toast.error("Login failed: " + (data.message || "Please check your credentials"))
      } else {
        localStorage.setItem("token", data.token)
        toast.success("Login successful!")
        router.push("/pos")
      }
    } catch (error) {
      console.error("Error signing in:", error)
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (data: SignupInputs) => {
    const { email, password, name, role } = data
    setIsLoading(true)
    try {
      // Implement your registration logic here
      console.log("Signup data:", email)

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error("Registration failed: " + (data.message || "Please try again"))
      } else {
        toast.success("Account created successfully!")
        setActiveTab("login")
      }
    } catch (error) {
      console.error("Error signing up:", error)
      toast.error("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  const images = ["/images/tsherles52 .jpeg", "/images/tsherles55 .jpeg", "/images/tsherles56 .jpeg"]

  return (
    <div className="flex flex-col md:flex-row min-h-screen h-full items-stretch md:pl-3">
      <div className="w-[90%] mx-auto md:w-1/2 h-64 md:h-auto flex relative rounded-md flex-col justify-center bg-primary/5 mt-4 md:my-4">
        <div className="hidden absolute top-4 z-50 w-full md:flex flex-row justify-between px-6">
          <div className="w-4"></div>
          <Link href={`/`}>
            <Button className="bg-transparent/70 dark:text-white">Back to the home page</Button>
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
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 w-full bg-muted/50 p-0.5 rounded-lg">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
                <p className="text-muted-foreground mt-2">Sign in to access your POS system</p>
              </div>

              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
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
                    <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
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
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="rememberMe"
                    className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    {...loginForm.register("rememberMe")}
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal text-muted-foreground">
                    Remember me for 30 days
                  </Label>
                </div>

                <Button type="submit" className="w-full h-10 mt-2 font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
                <p className="text-muted-foreground mt-2">Register for a new POS account</p>
              </div>

              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 h-10 border-muted-foreground/20 focus:border-primary"
                        {...signupForm.register("name", {
                          required: "Name is required",
                        })}
                      />
                    </div>
                    {signupForm.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Role
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="role"
                        type="text"
                        placeholder="Admin, Cashier, etc."
                        className="pl-10 h-10 border-muted-foreground/20 focus:border-primary"
                        {...signupForm.register("role", {
                          required: "Role is required",
                        })}
                      />
                    </div>
                    {signupForm.formState.errors.role && (
                      <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.role.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 h-10 border-muted-foreground/20 focus:border-primary"
                      {...signupForm.register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-10 border-muted-foreground/20 focus:border-primary"
                        {...signupForm.register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-10 border-muted-foreground/20 focus:border-primary"
                        {...signupForm.register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) => value === signupForm.watch("password") || "Passwords do not match",
                        })}
                      />
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">
                        {signupForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full h-10 mt-2 font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Creer votre compte"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        <Toaster position="top-right" />
      </div>
    </div>
  )
}

