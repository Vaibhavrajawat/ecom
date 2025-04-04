"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Package,
  BarChart3,
  ShoppingCart,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/store/cart";
import { useCartContext } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = React.useState<boolean>(false);
  const itemCount = useCart((state) => state.itemCount);
  const { toggleCart } = useCartContext();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="font-bold">
            <span className="bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 text-xl text-transparent">
              PrimeSpot
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:space-x-6 mx-auto absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground/80",
              isActive("/") ? "text-foreground" : "text-foreground/60"
            )}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground/80",
              isActive("/products") ? "text-foreground" : "text-foreground/60"
            )}
          >
            Products
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground/80",
              isActive("/contact") ? "text-foreground" : "text-foreground/60"
            )}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleCart}>
            <motion.div
              key={itemCount}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingCart className="h-5 w-5 cart-icon" />
            </motion.div>
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  key={itemCount}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-[10px] font-bold text-white flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
          <ThemeToggle />

          {status === "authenticated" && session?.user ? (
            <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full h-8 w-8 p-0 relative"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user.name && (
                      <p className="font-medium">{session.user.name}</p>
                    )}
                    {session.user.email && (
                      <p className="text-xs text-muted-foreground truncate w-[180px]">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={isAdmin ? "/admin" : "/user/dashboard"}
                    className="flex w-full cursor-pointer items-center"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {isAdmin ? "Admin Dashboard" : "Dashboard"}
                  </Link>
                </DropdownMenuItem>
                {!isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/user/dashboard/orders"
                        className="flex w-full cursor-pointer items-center"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/user/dashboard/settings"
                        className="flex w-full cursor-pointer items-center"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
                Login
              </Button>
            </Link>
          )}

          <button
            className="block md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background p-6 pb-32 shadow-md animate-in slide-in-from-top md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className={cn(
                "text-base font-medium transition-colors hover:text-foreground/80",
                isActive("/") ? "text-foreground" : "text-foreground/60"
              )}
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-accent",
                isActive("/products") ? "bg-accent" : "transparent"
              )}
              onClick={() => setShowMobileMenu(false)}
            >
              Products
            </Link>
            <Link
              href="/contact"
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-accent",
                isActive("/contact") ? "bg-accent" : "transparent"
              )}
              onClick={() => setShowMobileMenu(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
