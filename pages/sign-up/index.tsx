"use client";

import Head from "next/head";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Header from "../Header";
import Footer from "../Footer"; // Corrected import

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Attempt to parse the response as JSON
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error(`Response is not JSON. HTTP status: ${res.status}`);
      }

      if (res.ok) {
        toast.success(data.message);
        router.push("/sign-in");
      } else {
        console.error("Error response from API:", { status: res.status, data });
        const errorMsg = `Error ${res.status}: ${
          data.message || "An error occurred during sign up."
        }`;
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorDetails = err instanceof Error ? err.message : String(err);
      console.error("Sign-up error:", errorDetails, err);
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
        <meta
          name="description"
          content="Create an account at CertifiedSkill.org using your email or sign in with Google or GitHub. Join us to access free certifications and boost your career."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://certifiedskill.org/sign-up" />
        <meta name="robots" content="index, follow" />

        {/* Preload Critical Resource */}
        <link
          rel="preload"
          href="/og-image-signup.jpg"
          as="image"
          type="image/jpeg"
        />

        {/* OpenGraph Tags */}
        <meta property="og:title" content="Sign Up | CertifiedSkill.org" />
        <meta
          property="og:description"
          content="Create an account at CertifiedSkill.org using your email or sign in with Google or GitHub. Join us to access free certifications and grow your career."
        />
        <meta property="og:url" content="https://certifiedskill.org/sign-up" />
        <meta
          property="og:image"
          content="https://certifiedskill.org/og-image-signup.jpg"
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign Up | CertifiedSkill.org" />
        <meta
          name="twitter:description"
          content="Create an account at CertifiedSkill.org using your email or sign in with Google or GitHub. Grow your career with our free certifications."
        />
        <meta
          name="twitter:image"
          content="https://certifiedskill.org/og-image-signup.jpg"
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-[#1b0918] px-4">
        <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Sign up</CardTitle>
            <CardDescription className="text-white text-sm">
              Use email or a service to create an account
            </CardDescription>
          </CardHeader>

          {error && (
            <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-700 my-4">
              <TriangleAlert className="text-red-700" />
              <p className="font-bold">{error}</p>
            </div>
          )}

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                disabled={pending}
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
              <Input
                type="email"
                disabled={pending}
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
              <Input
                type="password"
                disabled={pending}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                autoComplete="new-password"
              />
              <Input
                type="password"
                disabled={pending}
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
                autoComplete="new-password"
              />
              <button
                type="submit"
                disabled={pending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                {pending ? "Submitting..." : "Continue"}
              </button>
            </form>

            <Separator className="my-4" />

            <div className="flex justify-around items-center">
              <Button
                onClick={(e) => handleProvider(e, "google")}
                variant="outline"
                size="lg"
                className="bg-slate-300 hover:bg-slate-400 hover:scale-110 transition"
                aria-label="Sign in with Google"
              >
                <FcGoogle size={24} />
              </Button>
              <Button
                onClick={(e) => handleProvider(e, "github")}
                variant="outline"
                size="lg"
                className="bg-slate-300 hover:bg-slate-400 hover:scale-110 transition"
                aria-label="Sign in with GitHub"
              >
                <FaGithub size={24} />
              </Button>
            </div>
            <p className="text-center text-white mt-4">
              Already have an account?{" "}
              <Link className="text-sky-700 hover:underline" href="/sign-in">
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
