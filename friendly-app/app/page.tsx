import Link from "next/link"
import { ArrowRight, Shield, Search, Database, Eye, Lock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950/20 dark:to-orange-950/20 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
              <Badge variant="destructive" className="text-sm">
                Security Alert
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Check if Your Data Has Been <span className="text-red-600 dark:text-red-400">Compromised</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Search across millions of compromised records from data breaches to see if your personal information has
              been exposed. Protect yourself with comprehensive breach monitoring and privacy-focused searches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                asChild
              >
                <Link href="/home">
                  Check Your Data <Search className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">15.2B+</div>
              <p className="text-muted-foreground">Compromised Records</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">8,500+</div>
              <p className="text-muted-foreground">Data Breaches Tracked</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">2.1M+</div>
              <p className="text-muted-foreground">Daily Searches</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
              <p className="text-muted-foreground">Privacy Protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Breach Monitoring</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform aggregates data from multiple sources to provide the most comprehensive breach checking
              available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Multi-Source Aggregation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Search across multiple breach databases simultaneously for comprehensive coverage of compromised data.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Individual searches are isolated and cannot be tied together, protecting your privacy while you
                  investigate.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Modular Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Build custom searches by adding/removing fields. Search by name, phone, address, and sensitive data
                  independently.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search Types */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Modular Search Fields</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Add or remove search fields to build your custom breach check. Each field type is processed independently
              for maximum privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "First & Last Name", icon: "👤", description: "Search for name combinations in breaches" },
              { type: "Phone Numbers", icon: "📱", description: "Check if your phone appears in compromised data" },
              { type: "Home Address", icon: "🏠", description: "Find if your address has been exposed" },
              { type: "Usernames", icon: "🆔", description: "Search for compromised usernames and handles" },
              { type: "Social Security", icon: "🔒", description: "Sensitive SSN breach checking (isolated)" },
              { type: "Passwords", icon: "🔑", description: "Check password exposure (hashed searches)" },
              { type: "Credit Cards", icon: "💳", description: "Financial data breach monitoring" },
              { type: "Driver License", icon: "🪪", description: "ID document exposure checking" },
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold mb-2">{item.type}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="bg-gray-900 dark:bg-gray-950 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your Privacy is Our Priority</h2>
            <p className="text-lg text-gray-300 dark:text-gray-400 mb-6">
              We don't store your search queries, track your activity, or build profiles. Each search is independent and
              anonymous, ensuring your investigation remains private.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded-lg">
                <Eye className="h-6 w-6 text-red-400 mb-2" />
                <h3 className="font-semibold mb-2">No Tracking</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">We don't track or log your searches</p>
              </div>
              <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded-lg">
                <Lock className="h-6 w-6 text-green-400 mb-2" />
                <h3 className="font-semibold mb-2">Encrypted</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">All searches are encrypted in transit</p>
              </div>
              <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded-lg">
                <Shield className="h-6 w-6 text-blue-400 mb-2" />
                <h3 className="font-semibold mb-2">Anonymous</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">Searches cannot be tied to individuals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 dark:bg-red-500 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Start Protecting Yourself Today</h2>
          <p className="text-xl text-red-100 dark:text-red-200 mb-8 max-w-2xl mx-auto">
            Don't wait until it's too late. Check if your data has been compromised and take action to protect yourself.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
            <Link href="/home">
              Check Your Data Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
