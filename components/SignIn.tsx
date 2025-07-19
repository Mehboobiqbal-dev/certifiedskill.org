"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { TriangleAlert, Eye, EyeOff } from "lucide-react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/dashboard");
      toast.success("Login successful");
    } else if (res?.status === 401) {
      setError("Invalid Credentials");
      setPending(false);
    } else {
      setError("Something went wrong");
      setPending(false);
    }
  };

  const handleProvider = (event, provider) => {
    event.preventDefault();
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <Header />
      {/* Hero/Branding Section */}
      <section className="w-full bg-gradient-to-br from-indigo-600 via-blue-400 to-indigo-200 py-16 px-4 text-center flex flex-col items-center justify-center">
        <img src="/ChatGPT Image Jul 19, 2025, 01_06_54 PM.png" alt="Logo" className="h-16 w-16 mx-auto mb-4 rounded" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-2">Sign in to CertifiedSkill.org</h1>
        <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-4">Access your dashboard, take exams, and manage your certifications.</p>
      </section>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
        <Card className="w-full max-w-md p-6 shadow-2xl border border-indigo-100 bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-indigo-700 text-2xl">Sign in</CardTitle>
            <CardDescription className="text-gray-500 text-sm">Use email or a service to sign in</CardDescription>
          </CardHeader>
          {!!error && (
            <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-700 mb-6">
              <TriangleAlert className="text-red-700" />
              <p className="font-bold">{error}</p>
            </div>
          )}
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  disabled={pending}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
                <span className="absolute left-3 top-2.5 text-indigo-400">@</span>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  disabled={pending}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-2.5 text-indigo-400 hover:text-indigo-600"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button
                className="w-full text-sm text-center text-white bg-gradient-to-r from-indigo-600 to-blue-400 hover:from-blue-400 hover:to-indigo-600 font-bold py-2 px-4 rounded transition"
                disabled={pending}
              >
                {pending ? "Signing in..." : "Continue"}
              </Button>
            </form>
            <div className="flex justify-end mt-2">
              <Link href="/forgot-password" className="text-xs text-indigo-600 hover:underline">Forgot password?</Link>
            </div>
            <Separator className="my-4" />
            <div className="flex my-2 justify-evenly mx-auto items-center gap-4">
              <Button
                onClick={(e) => handleProvider(e, "google")}
                className="bg-white border border-gray-200 hover:bg-indigo-50 hover:scale-110 transition flex items-center gap-2 text-gray-700"
                aria-label="Sign in with Google"
              >
                <FcGoogle size={24} /> Google
              </Button>
              <Button
                onClick={(e) => handleProvider(e, "github")}
                className="bg-white border border-gray-200 hover:bg-indigo-50 hover:scale-110 transition flex items-center gap-2 text-gray-700"
                aria-label="Sign in with GitHub"
              >
                <FaGithub size={24} /> GitHub
              </Button>
            </div>
            <p className="text-sm text-center text-gray-600 mt-4">
              Don&apos;t have an account?{' '}
              <Link className="text-indigo-700 hover:underline font-semibold" href="/sign-up">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default SignIn;
