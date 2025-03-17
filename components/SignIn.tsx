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
import { TriangleAlert } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
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
    <div className="h-full flex items-center justify-center bg-[#1b0918]">
      <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8">
        <CardHeader>
          <CardTitle className="text-center text-white">Sign in</CardTitle>
          <CardDescription className="text-sm text-center text-white">
            Use email or service to sign in
          </CardDescription>
        </CardHeader>
        {!!error && (
          <div className="bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-700 mb-6">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}
        <CardContent className="px-2 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              disabled={pending}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button className="w-full" disabled={pending}>
              Continue
            </Button>
          </form>
          <Separator />
          <div className="flex my-2 justify-evenly mx-auto items-center">
            <Button
              disabled={false}
              onClick={(e) => handleProvider(e, "google")}
              className="bg-slate-300 hover:bg-slate-400"
            >
              <FcGoogle size={24} />
            </Button>
            <Button
              disabled={false}
              onClick={(e) => handleProvider(e, "github")}
              className="bg-slate-300 hover:bg-slate-400"
            >
              <FaGithub size={24} />
            </Button>
          </div>
          <p className="text-center text-sm mt-2 text-gray-400">
            Create new account{" "}
            <Link className="text-sky-700 ml-4 hover:underline cursor-pointer" href="/signup">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
