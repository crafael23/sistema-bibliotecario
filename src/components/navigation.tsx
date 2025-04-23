import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { Library } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 font-semibold">
            <Library className="h-6 w-6" />
            <span>Sistema Bibliotecario </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
