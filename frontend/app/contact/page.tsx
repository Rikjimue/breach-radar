import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Shield, Database, AlertTriangle, Clock, MessageCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Security Team</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get in touch with our security researchers and support team. We're here to help with breach investigations,
          API support, and security research collaboration.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Whether you're reporting a new breach, need API support, or have security questions, we're here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="security@yourcompany.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization (Optional)</Label>
                <Input id="organization" placeholder="Security Research Inc." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breach-report">New Breach Report</SelectItem>
                    <SelectItem value="api-support">API Support</SelectItem>
                    <SelectItem value="security-research">Security Research</SelectItem>
                    <SelectItem value="data-request">Data Request</SelectItem>
                    <SelectItem value="partnership">Research Partnership</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please provide details about your inquiry. For breach reports, include as much information as possible while respecting responsible disclosure practices..."
                  className="min-h-[120px]"
                />
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Secure Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Contact</CardTitle>
              <CardDescription>Direct channels for security-related communications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium">Security Team</p>
                  <p className="text-sm text-muted-foreground">security@breachguard.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">API Support</p>
                  <p className="text-sm text-muted-foreground">api@breachguard.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium">Breach Reports</p>
                  <p className="text-sm text-muted-foreground">reports@breachguard.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Critical Security Issues</p>
                  <p className="text-muted-foreground">Within 2 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">API Support</p>
                  <p className="text-muted-foreground">Within 4 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">General Inquiries</p>
                  <p className="text-muted-foreground">Within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsible Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We follow responsible disclosure practices for security vulnerabilities and new breach discoveries.
              </p>
              <Button className="w-full" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                View Disclosure Policy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Research */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Security Research Collaboration</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Breach Researchers",
              description: "Collaborate with our team to responsibly disclose and analyze new data breaches.",
              icon: AlertTriangle,
            },
            {
              title: "Academic Institutions",
              description: "Partner with universities and research institutions for security studies and analysis.",
              icon: Database,
            },
            {
              title: "Security Companies",
              description: "Integrate our breach data into your security products and threat intelligence platforms.",
              icon: Shield,
            },
            {
              title: "Law Enforcement",
              description: "Assist law enforcement agencies with breach investigations and cybercrime research.",
              icon: Mail,
            },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span>{item.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
