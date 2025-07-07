import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Lock, Eye, EyeOff, Radar, Building } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-600 dark:bg-red-500 rounded-lg flex items-center justify-center mb-4">
            <Radar className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Get API Access</CardTitle>
          <CardDescription>Create your BreachGuard account to start using our breach monitoring API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="firstName" placeholder="John" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="lastName" placeholder="Doe" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="security@yourcompany.com" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="organization" placeholder="Your Company Name" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">Primary Use Case</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your use case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="security-research">Security Research</SelectItem>
                <SelectItem value="threat-intelligence">Threat Intelligence</SelectItem>
                <SelectItem value="incident-response">Incident Response</SelectItem>
                <SelectItem value="compliance">Compliance Monitoring</SelectItem>
                <SelectItem value="personal">Personal Use</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="Create a strong password" className="pl-10 pr-10" />
              <button className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="confirmPassword" type="password" placeholder="Confirm your password" className="pl-10 pr-10" />
              <button className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                <EyeOff className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-red-600 dark:text-red-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-red-600 dark:text-red-400 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="responsible" />
            <Label htmlFor="responsible" className="text-sm">
              I will use this service for legitimate security research and defensive purposes only
            </Label>
          </div>

          <Button className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" size="lg">
            Create API Account
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-red-600 dark:text-red-400 hover:underline font-medium">
              Sign in to your dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
