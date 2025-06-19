import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, Shield, Database } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-600 dark:bg-red-500 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">API Access Login</CardTitle>
          <CardDescription>Sign in to access your BreachGuard API dashboard and manage your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="Enter your email" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="Enter your password" className="pl-10 pr-10" />
              <button className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="rounded" />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>
            <Link href="/forgot-password" className="text-sm text-red-600 dark:text-red-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" size="lg">
            <Database className="h-4 w-4 mr-2" />
            Access API Dashboard
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Need API access?{" "}
            <Link href="/signup" className="text-red-600 dark:text-red-400 hover:underline font-medium">
              Get started with our API
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
