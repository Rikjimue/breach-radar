"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, Search, BarChart3, Info, Mail, DollarSign, Radar, Database, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Search", href: "/home", icon: Search },
  { name: "Statistics", href: "/statistics", icon: BarChart3 },
  { name: "Pricing", href: "/pricing", icon: DollarSign },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Mail },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 dark:bg-red-500 rounded-lg flex items-center justify-center">
              <Radar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Breach Radar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <Database className="h-4 w-4 mr-2" />
                API Access
              </Link>
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" asChild>
              <Link href="/signup">
                <Radar className="h-4 w-4 mr-2" />
                Get Protected
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                <div className="border-t pt-4 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  >
                    <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 ml-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="ml-6">Toggle theme</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Database className="h-4 w-4 mr-2" />
                      API Access
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-full justify-start bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    asChild
                  >
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Radar className="h-4 w-4 mr-2" />
                      Get Protected
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
