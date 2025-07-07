import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Database, Search, Lock, Eye, Users, AlertTriangle, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Breach Radar</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're dedicated to protecting your digital identity by providing comprehensive, privacy-focused breach
          monitoring and security research tools. Our mission is to democratize access to breach data for defensive
          security purposes.
        </p>
      </div>

      {/* Mission & Approach */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              To provide comprehensive, privacy-respecting breach monitoring that empowers individuals and organizations
              to protect themselves against data exposure and identity theft.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>Our Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              We aggregate breach data from multiple sources while maintaining strict privacy standards, ensuring your
              searches remain anonymous and cannot be tied to your identity.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How BreachGuard Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>1. Search Anonymously</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enter any piece of information you want to check. We don't log or track your searches, ensuring complete
                privacy.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>2. Multi-Source Check</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our system searches across multiple breach databases simultaneously, providing comprehensive coverage of
                known compromises.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>3. Get Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Receive detailed information about any breaches affecting your data, including breach dates, affected
                records, and severity.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Privacy Principles */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Privacy Principles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-lg">No Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>We don't track, log, or store your search queries or IP addresses.</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Encrypted</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All searches are encrypted in transit using industry-standard TLS encryption.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">Anonymous</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Individual searches cannot be linked together or tied to a specific person.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">Responsible</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We follow responsible disclosure practices and work with security researchers.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Sources */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Data Sources</h2>
        <Card>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Include</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Publicly disclosed breaches</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Security researcher findings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Verified breach databases</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Historical breach archives</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Searchable Fields</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline">Email Addresses</Badge>
                  <Badge variant="outline">Phone Numbers</Badge>
                  <Badge variant="outline">Usernames</Badge>
                  <Badge variant="outline">IP Addresses</Badge>
                  <Badge variant="outline">Passwords (Hashed)</Badge>
                  <Badge variant="outline">Credit Cards</Badge>
                  <Badge variant="outline">Social Security</Badge>
                  <Badge variant="outline">Physical Addresses</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="bg-muted/50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Platform Statistics</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">15.2B+</div>
            <p className="text-muted-foreground">Compromised Records</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">8,500+</div>
            <p className="text-muted-foreground">Tracked Breaches</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">2.1M+</div>
            <p className="text-muted-foreground">Daily Searches</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
            <p className="text-muted-foreground">Privacy Protected</p>
          </div>
        </div>
      </div>

      {/* Responsible Use */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Responsible Use</h2>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <p className="text-lg text-muted-foreground mb-6">
              BreachGuard is designed for defensive security purposes only. We encourage responsible use of our platform
              to help individuals and organizations protect themselves against data breaches and identity theft.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">✓ Appropriate Uses</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Checking your own information</li>
                  <li>• Security research and analysis</li>
                  <li>• Organizational security assessments</li>
                  <li>• Educational purposes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">✗ Prohibited Uses</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Stalking or harassment</li>
                  <li>• Identity theft or fraud</li>
                  <li>• Unauthorized access attempts</li>
                  <li>• Commercial data harvesting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
