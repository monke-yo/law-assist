"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import SignInButton from "@/components/SignInButton";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageDropdown from "@/components/LanguageDropdown";

export default function Header() {
  return (
    <header className="w-full py-6 px-8 border-b-4 border-border bg-background">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold">
            lawly
          </Link>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              <NavigationMenuItem>
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-base hover:underline"
                >
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/app/search"
                  className="px-4 py-2 text-sm font-base hover:underline"
                >
                  Search
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Login Button */}
        <div className="flex items-center gap-3">
          <LanguageProvider>
            <LanguageDropdown />
          </LanguageProvider>
          <SignInButton />
        </div>
      </div>
    </header>
  );
}
