"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import Link from "next/link";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader className="w-6 h-6 mr-4 mt-4 animate-spin" />;
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav className="flex items-center px-4">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <span className="hidden sm:inline-block text-black font-semibold">
                {session.user?.name}
              </span>
              <Avatar className="w-8 h-8 md:w-10 md:h-10 hover:opacity-75 transition">
                <AvatarImage
                  src={session.user?.image || undefined}
                  alt={session.user?.name || "User"}
                />
                <AvatarFallback className="bg-sky-900 text-black">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            className="bg-white text-[#141e30] rounded shadow-lg w-32 py-2"
          >
            <DropdownMenuItem
              className="h-10 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
              onClick={handleSignOut}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center px-3 py-2 text-black bg-gradient-to-r from-purple-500 to-blue-500 rounded shadow-md hover:from-purple-600 hover:to-blue-600 transition text-sm whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-3 py-2 text-[#141e30] bg-white rounded shadow-md hover:bg-gray-100 transition text-sm whitespace-nowrap"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}

export default UserButton;
