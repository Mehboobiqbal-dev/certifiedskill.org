"use client";

import Head from "next/head";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Header from "../Header";
import Footer from "../Footer";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setPending(false);
      return;
    }
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        throw new Error(`Response is not JSON. HTTP status: ${res.status}`);
      }
      if (res.ok) {
        toast.success(data.message);
        router.push("/sign-in");
      } else {
        const errorMsg = `Error ${res.status}: ${data.message || "An error occurred during sign up."}`;
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorDetails = err instanceof Error ? err.message : String(err);
      setError(`Sign-up error: ${errorDetails}`);
      toast.error(`Sign-up error: ${errorDetails}`);
    } finally {
      setPending(false);
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    provider: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <>
      <Header />
      <Head>
        <title>Sign Up | CertifiedSkill.org</title>
        <meta name="description" content="Create an account at CertifiedSkill.org using your email or sign in with Google or GitHub. Join us to access free certifications and boost your career." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://certifiedskill.org/sign-up" />
        <meta name="robots" content="index, follow" />
        <link rel="preload" href="/og-image-signup.jpg" as="image" type="image/jpeg" />
        <meta property="og:title" content="Sign Up | CertifiedSkill.org" />
        <meta property="og:description" content="Create an account at CertifiedSkill.org using your email or sign in with Google or GitHub. Join us to access free certifications and grow your career." />
        <meta property="og:url" content="https://certifiedskill.org/sign-up" />
        <meta property="og:image" content="https://certifiedskill.org/og-image-signup.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign Up | CertifiedSkill.org" />
        <meta name="twitter:description" content="Create an account at CertifiedSkill.org using your email or sign in with Google or GitHub. Grow your career with our free certifications." />
        <meta name="twitter:image" content="https://certifiedskill.org/og-image-signup.jpg" />
      </Head>
      {/* Hero/Branding Section */}
      <section className="w-full bg-gradient-to-br from-indigo-600 via-blue-400 to-indigo-200 py-16 px-4 text-center flex flex-col items-center justify-center">
        <img src="/ChatGPT Image Jul 19, 2025, 01_06_54 PM.png" alt="Logo" className="h-16 w-16 mx-auto mb-4 rounded" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-2">Create your CertifiedSkill.org account</h1>
        <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-4">Sign up to access free certifications, exams, and your personal dashboard.</p>
      </section>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
        <Card className="w-full max-w-md p-6 shadow-2xl border border-indigo-100 bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-indigo-700 text-2xl">Sign up</CardTitle>
            <CardDescription className="text-gray-500 text-sm">Use email or a service to create an account</CardDescription>
          </CardHeader>
          {error && (
            <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-700 my-4">
              <TriangleAlert className="text-red-700" />
              <p className="font-bold">{error}</p>
            </div>
          )}
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
              <Input
                type="text"
                disabled={pending}
                placeholder="Full name"
                value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                  className="pl-10"
              />
                <span className="absolute left-3 top-2.5 text-indigo-400 font-bold">&#128100;</span>
              </div>
              <div className="relative">
              <Input
                type="email"
                disabled={pending}
                placeholder="Email"
                value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                  className="pr-10"
                autoComplete="new-password"
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
              <div className="relative">
              <Input
                  type={showConfirm ? "text" : "password"}
                disabled={pending}
                placeholder="Confirm password"
                value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                  className="pr-10"
                autoComplete="new-password"
              />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-2.5 text-indigo-400 hover:text-indigo-600"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={pending}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-400 hover:from-blue-400 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded transition"
              >
                {pending ? "Submitting..." : "Continue"}
              </button>
            </form>
            <Separator className="my-4" />
            <div className="flex justify-around items-center gap-4">
              <Button
                onClick={(e) => handleProvider(e, "google")}
                variant="outline"
                size="lg"
                className="bg-white border border-gray-200 hover:bg-indigo-50 hover:scale-110 transition flex items-center gap-2 text-gray-700"
                aria-label="Sign in with Google"
              >
                <FcGoogle size={24} /> Google
              </Button>
              <Button
                onClick={(e) => handleProvider(e, "github")}
                variant="outline"
                size="lg"
                className="bg-white border border-gray-200 hover:bg-indigo-50 hover:scale-110 transition flex items-center gap-2 text-gray-700"
                aria-label="Sign in with GitHub"
              >
                <FaGithub size={24} /> GitHub
              </Button>
            </div>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <Link className="text-indigo-700 hover:underline font-semibold" href="/sign-in">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
