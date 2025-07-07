"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Database, RefreshCw, Users, Shield, AlertTriangle, DollarSign, Clock, Target } from "lucide-react"

interface AccessibleStats {
  totalBreaches: number
  totalRecords: string
  lastUpdated: string
  keyInsights: {
    mostCommonAttack: string
    riskiestIndustry: string
    averageDetectionTime: string
    costPerRecord: string
  }
  whoAttacksYou: Array<{
    attackerType: string
    description: string
    likelihood: number
    whatTheyWant: string[]
    howToProtect: string[]
    realExample: string
    sophistication: "Beginner" | "Professional" | "Expert" | "Nation-State"
  }>
  commonVulnerabilities: Array<{
    vulnerability: string
    easyExplanation: string
    howItWorks: string
    whoIsAtRisk: string[]
    preventionSteps: string[]
    urgencyLevel: "Critical" | "High" | "Medium" | "Low"
    realWorldImpact: string
  }>
  dataWorthAndRisk: Array<{
    dataType: string
    whyValuable: string
    streetValue: string
    whoWantsIt: string[]
    howItsUsed: string[]
    protectionTips: string[]
    riskToYou: string
  }>
  protectionLevels: Array<{
    level: string
    description: string
    yourRisk: number
    whatHappensIfBreached: string
    timeToDetect: string
    costImpact: string
    practices: string[]
    howToImprove: string[]
    realWorldExample: string
  }>
  biggestBreaches: Array<{
    name: string
    year: string
    recordsAffected: string
    dataTypes: string[]
    whatHappened: string
    impact: string
    lessonLearned: string
  }>
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<AccessibleStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchStatistics = async () => {
    try {
      setIsRefreshing(true)
      // Mock accessible statistics
      const statistics: AccessibleStats = {
        totalBreaches: 47382,
        totalRecords: "18.7B",
        lastUpdated: "January 15, 2024",
        keyInsights: {
          mostCommonAttack: "Phishing emails (40% of all breaches)",
          riskiestIndustry: "Healthcare (takes 280 days to detect breaches)",
          averageDetectionTime: "200 days (most people don't know for 6+ months)",
          costPerRecord: "$165 per stolen record on average",
        },
        whoAttacksYou: [
          {
            attackerType: "Cybercriminals",
            description: "Professional criminals who steal data to make money",
            likelihood: 75,
            whatTheyWant: ["Credit card numbers", "Personal info to sell", "Passwords"],
            howToProtect: ["Use unique passwords", "Enable 2FA", "Don't click suspicious links"],
            realExample: "The Target breach where 40 million credit cards were stolen during holiday shopping",
            sophistication: "Professional",
          },
          {
            attackerType: "Scammers & Opportunists",
            description: "Less skilled attackers looking for easy targets",
            likelihood: 60,
            whatTheyWant: ["Easy money", "Personal info for scams", "Social media accounts"],
            howToProtect: ["Keep software updated", "Use strong passwords", "Be skeptical of emails"],
            realExample: "Fake tech support calls claiming your computer is infected",
            sophistication: "Beginner",
          },
          {
            attackerType: "Nation-State Hackers",
            description: "Government-sponsored hackers targeting specific information",
            likelihood: 5,
            whatTheyWant: ["Government secrets", "Corporate intelligence", "Infrastructure access"],
            howToProtect: ["Use encrypted communication", "Limit data sharing", "Regular security audits"],
            realExample: "Russian hackers targeting U.S. election systems and power grids",
            sophistication: "Nation-State",
          },
          {
            attackerType: "Insider Threats",
            description: "Employees or people with access who misuse their privileges",
            likelihood: 25,
            whatTheyWant: ["Revenge against employer", "Money from selling data", "Personal gain"],
            howToProtect: ["Limit access to sensitive data", "Monitor unusual activity", "Background checks"],
            realExample: "Edward Snowden leaking NSA documents, or employees selling customer lists",
            sophistication: "Expert",
          },
        ],
        commonVulnerabilities: [
          {
            vulnerability: "Weak Passwords",
            easyExplanation: "Using simple passwords like '123456' or 'password'",
            howItWorks: "Hackers use programs that try millions of common passwords automatically",
            whoIsAtRisk: ["Everyone", "Small businesses", "People reusing passwords"],
            preventionSteps: [
              "Use a password manager",
              "Create unique passwords for each account",
              "Use passphrases like 'Coffee!Morning!Sunshine!2024'",
            ],
            urgencyLevel: "High",
            realWorldImpact: "Over 80% of data breaches involve weak or stolen passwords",
          },
          {
            vulnerability: "Phishing Emails",
            easyExplanation: "Fake emails that trick you into giving away information or clicking malicious links",
            howItWorks: "Criminals send emails that look real (from banks, companies) to steal your login info",
            whoIsAtRisk: ["Everyone", "Elderly users", "Busy professionals"],
            preventionSteps: [
              "Check sender email addresses carefully",
              "Don't click links in suspicious emails",
              "Go directly to websites instead of clicking email links",
            ],
            urgencyLevel: "Critical",
            realWorldImpact: "Phishing causes 40% of all data breaches and costs companies $4.9 million on average",
          },
          {
            vulnerability: "Outdated Software",
            easyExplanation: "Not installing security updates on your devices and apps",
            howItWorks: "Hackers exploit known security holes in old software versions",
            whoIsAtRisk: ["Small businesses", "Home users", "Organizations with old systems"],
            preventionSteps: [
              "Enable automatic updates",
              "Regularly check for software updates",
              "Replace very old software that's no longer supported",
            ],
            urgencyLevel: "High",
            realWorldImpact: "The Equifax breach affected 147 million people due to an unpatched vulnerability",
          },
          {
            vulnerability: "Unsecured Wi-Fi",
            easyExplanation: "Using public Wi-Fi or poorly secured home networks",
            howItWorks: "Attackers can intercept data sent over unsecured networks",
            whoIsAtRisk: ["Public Wi-Fi users", "Remote workers", "Small businesses"],
            preventionSteps: [
              "Use a VPN on public Wi-Fi",
              "Avoid accessing sensitive accounts on public networks",
              "Secure your home Wi-Fi with WPA3 encryption",
            ],
            urgencyLevel: "Medium",
            realWorldImpact: "Man-in-the-middle attacks on public Wi-Fi can steal login credentials and personal data",
          },
        ],
        dataWorthAndRisk: [
          {
            dataType: "Credit Card Information",
            whyValuable: "Can be used immediately to make fraudulent purchases",
            streetValue: "$5-50 per card (depending on credit limit and info included)",
            whoWantsIt: ["Online fraudsters", "Identity thieves", "Criminal organizations"],
            howItsUsed: ["Online shopping fraud", "Creating fake cards", "Selling to other criminals"],
            protectionTips: [
              "Monitor your statements regularly",
              "Use credit cards instead of debit cards online",
              "Set up fraud alerts with your bank",
            ],
            riskToYou: "High - Can result in immediate financial loss and damaged credit",
          },
          {
            dataType: "Social Security Numbers",
            whyValuable: "The key to stealing someone's entire identity",
            streetValue: "$100-200 per SSN with additional personal info",
            whoWantsIt: ["Identity thieves", "Tax fraudsters", "Loan scammers"],
            howItsUsed: ["Opening new accounts", "Filing fake tax returns", "Medical identity theft"],
            protectionTips: [
              "Never carry your SSN card in your wallet",
              "Only give your SSN when absolutely necessary",
              "Freeze your credit reports",
            ],
            riskToYou: "Critical - Can take years to recover from identity theft",
          },
          {
            dataType: "Email & Passwords",
            whyValuable: "Gateway to all your other accounts and personal information",
            streetValue: "$1-10 per account (more for business emails)",
            whoWantsIt: ["Scammers", "Account takeover specialists", "Corporate spies"],
            howItsUsed: ["Accessing other accounts", "Sending scam emails", "Corporate espionage"],
            protectionTips: [
              "Use two-factor authentication",
              "Don't reuse passwords",
              "Use a reputable password manager",
            ],
            riskToYou: "High - Can lead to complete account takeover and privacy loss",
          },
          {
            dataType: "Medical Records",
            whyValuable: "Contains comprehensive personal info and insurance details",
            streetValue: "$100-1000 per complete medical record",
            whoWantsIt: ["Medical identity thieves", "Insurance fraudsters", "Blackmailers"],
            howItsUsed: ["Insurance fraud", "Prescription drug fraud", "Blackmail/extortion"],
            protectionTips: [
              "Review medical bills and insurance statements",
              "Ask healthcare providers about their security practices",
              "Be cautious about health apps and wearables",
            ],
            riskToYou: "Very High - Medical identity theft is hard to detect and expensive to fix",
          },
        ],
        protectionLevels: [
          {
            level: "Unprotected",
            description: "People and organizations with these characteristics are most vulnerable",
            yourRisk: 85,
            whatHappensIfBreached: "Complete data loss, long recovery time, high costs",
            timeToDetect: "6+ months (often never detected until too late)",
            costImpact: "5x higher than protected organizations",
            practices: [
              "Uses same password for multiple accounts",
              "Never updates software or apps",
              "Clicks on email links without checking",
              "Uses public Wi-Fi for sensitive activities",
              "No antivirus or security software",
              "Shares personal info freely on social media",
              "No backups of important data",
            ],
            howToImprove: [
              "Start with strong, unique passwords",
              "Enable two-factor authentication",
              "Keep software updated",
              "Learn to recognize phishing emails",
            ],
            realWorldExample: "Small businesses that lose everything to ransomware because they had no backups",
          },
          {
            level: "Basic Protection",
            description: "Some security measures in place, but significant gaps remain",
            yourRisk: 50,
            whatHappensIfBreached: "Significant impact, but some data may be recoverable",
            timeToDetect: "3 months on average",
            costImpact: "2-3x higher costs than well-protected organizations",
            practices: [
              "Uses different passwords but they're still weak",
              "Updates software sometimes but not consistently",
              "Has basic antivirus software",
              "Occasionally backs up data",
              "Uses two-factor authentication on some accounts",
              "Still falls for sophisticated phishing attempts",
              "Limited employee security training",
            ],
            howToImprove: [
              "Implement regular backups",
              "Add endpoint protection software",
              "Train employees on security awareness",
              "Create an incident response plan",
            ],
            realWorldExample: "Companies that recover from breaches but face significant downtime and costs",
          },
          {
            level: "Well Protected",
            description: "Comprehensive security measures and proactive monitoring",
            yourRisk: 15,
            whatHappensIfBreached: "Limited impact, quick recovery, minimal data loss",
            timeToDetect: "1 month or less",
            costImpact: "Baseline costs - well-managed incidents",
            practices: [
              "Uses password manager with unique, strong passwords",
              "Automatic security updates enabled",
              "Multi-factor authentication on all important accounts",
              "Regular, tested backups",
              "Advanced threat detection software",
              "Regular security training and awareness",
              "Network monitoring and intrusion detection",
              "Incident response plan regularly tested",
            ],
            howToImprove: [
              "Implement zero-trust architecture",
              "Add AI-powered threat detection",
              "Regular security audits and penetration testing",
              "Advanced employee training programs",
            ],
            realWorldExample: "Organizations that detect and stop attacks before significant damage occurs",
          },
        ],
        biggestBreaches: [
          {
            name: "Yahoo",
            year: "2013-2014",
            recordsAffected: "3 billion accounts",
            dataTypes: ["Email addresses", "Passwords", "Security questions", "Phone numbers"],
            whatHappened: "State-sponsored hackers gained access to user accounts over multiple years",
            impact: "Reduced Yahoo's sale price by $350 million",
            lessonLearned: "Don't delay reporting breaches - Yahoo waited years to disclose the full scope",
          },
          {
            name: "Equifax",
            year: "2017",
            recordsAffected: "147 million people",
            dataTypes: ["Social Security numbers", "Birth dates", "Addresses", "Driver's license numbers"],
            whatHappened: "Hackers exploited an unpatched vulnerability in web application software",
            impact: "$700 million in fines and settlements",
            lessonLearned: "Keep software updated - the vulnerability was known and had a patch available",
          },
          {
            name: "Facebook (Cambridge Analytica)",
            year: "2018",
            recordsAffected: "87 million users",
            dataTypes: ["Personal profiles", "Friend networks", "Likes and interests", "Private messages"],
            whatHappened: "Third-party app harvested data and shared it with political consulting firm",
            impact: "$5 billion FTC fine, congressional hearings",
            lessonLearned: "Be careful what apps you connect to your social media accounts",
          },
          {
            name: "Marriott/Starwood",
            year: "2018",
            recordsAffected: "500 million guests",
            dataTypes: ["Names", "Addresses", "Phone numbers", "Passport numbers", "Credit card info"],
            whatHappened: "Hackers had access to hotel reservation system for 4 years undetected",
            impact: "$123 million in fines, massive customer compensation",
            lessonLearned: "Monitor your systems continuously - attackers can hide for years",
          },
          {
            name: "Target",
            year: "2013",
            recordsAffected: "110 million customers",
            dataTypes: ["Credit card numbers", "Debit card PINs", "Names", "Addresses", "Phone numbers"],
            whatHappened: "Malware installed on point-of-sale systems during busy holiday shopping season",
            impact: "$292 million in costs, CEO resignation",
            lessonLearned: "Secure all systems, not just the obvious ones - attackers entered through HVAC vendor",
          },
        ],
      }
      setStats(statistics)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Data Breach Statistics</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding cyber threats and how to protect yourself
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Data Breach Statistics</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding cyber threats and how to protect yourself
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <Database className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchStatistics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-4">Data Breach Statistics</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understanding cyber threats and how to protect yourself
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Updated: {stats.lastUpdated}</span>
            </Badge>
            <Button onClick={fetchStatistics} variant="outline" size="sm" disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text font-heavy">Total Records in Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.totalRecords}</div>
            <div className="text-xs text-muted-foreground">Compromised identities tracked</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text font-heavy">Most Common Attack</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.keyInsights.mostCommonAttack.split(" (")[0]}</div>
            <div className="text-xs text-muted-foreground">
              {stats.keyInsights.mostCommonAttack.split(" (")[1]?.replace(")", "")}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text font-heavy">Detection Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.keyInsights.averageDetectionTime.split(" (")[0]}</div>
            <div className="text-xs text-muted-foreground">
              {stats.keyInsights.averageDetectionTime.split(" (")[1]?.replace(")", "")}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text font-heavy">Cost Per Record</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.keyInsights.costPerRecord.split(" per")[0]}</div>
            <div className="text-xs text-muted-foreground">Average cost to organizations</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="attackers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="attackers" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Who Attacks You</span>
          </TabsTrigger>
          <TabsTrigger value="vulnerabilities" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Common Weaknesses</span>
          </TabsTrigger>
          <TabsTrigger value="data-value" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>What Your Data Is Worth</span>
          </TabsTrigger>
          <TabsTrigger value="biggest-breaches" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Biggest Breaches</span>
          </TabsTrigger>
          <TabsTrigger value="protection" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Protection Levels</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attackers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Who Might Attack You and Why</CardTitle>
              <CardDescription>
                Understanding different types of cyber attackers helps you know what to watch out for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats.whoAttacksYou.map((attacker, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-xl">{attacker.attackerType}</h3>
                        <p className="text-muted-foreground mt-1">{attacker.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            attacker.sophistication === "Nation-State"
                              ? "destructive"
                              : attacker.sophistication === "Professional"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {attacker.sophistication}
                        </Badge>
                        <Badge variant="outline">{attacker.likelihood}% likely to target you</Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Progress value={attacker.likelihood} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">Likelihood of targeting average users</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">What They Want:</h4>
                        <ul className="space-y-1 text-sm">
                          {attacker.whatTheyWant.map((want, wantIndex) => (
                            <li key={wantIndex} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>{want}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">
                          How to Protect Yourself:
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {attacker.howToProtect.map((protect, protectIndex) => (
                            <li key={protectIndex} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{protect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1">Real-World Example:</h4>
                      <p className="text-sm text-muted-foreground">{attacker.realExample}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Security Weaknesses</CardTitle>
              <CardDescription>
                These are the most common ways attackers get into systems - and how you can prevent them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats.commonVulnerabilities.map((vuln, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-xl">{vuln.vulnerability}</h3>
                        <p className="text-muted-foreground mt-1">{vuln.easyExplanation}</p>
                      </div>
                      <Badge
                        variant={
                          vuln.urgencyLevel === "Critical"
                            ? "destructive"
                            : vuln.urgencyLevel === "High"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {vuln.urgencyLevel} Priority
                      </Badge>
                    </div>

                    <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <h4 className="font-medium mb-1">How It Works:</h4>
                      <p className="text-sm">{vuln.howItWorks}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Who's Most at Risk:</h4>
                        <div className="flex flex-wrap gap-1">
                          {vuln.whoIsAtRisk.map((risk, riskIndex) => (
                            <Badge key={riskIndex} variant="outline" className="text-xs">
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Prevention Steps:</h4>
                        <ul className="space-y-1 text-sm">
                          {vuln.preventionSteps.slice(0, 2).map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <h4 className="font-medium mb-1 text-red-700 dark:text-red-400">Real-World Impact:</h4>
                      <p className="text-sm text-red-800 dark:text-red-300">{vuln.realWorldImpact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-value" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What Your Personal Data Is Worth</CardTitle>
              <CardDescription>
                Understanding the value of your data helps you know what criminals are after and how to protect it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats.dataWorthAndRisk.map((data, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-xl">{data.dataType}</h3>
                        <p className="text-muted-foreground mt-1">{data.whyValuable}</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 dark:text-green-400">
                        {data.streetValue}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Who Wants It:</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {data.whoWantsIt.map((who, whoIndex) => (
                            <Badge key={whoIndex} variant="outline" className="text-xs">
                              {who}
                            </Badge>
                          ))}
                        </div>
                        <h4 className="font-medium mb-2">How It's Used Against You:</h4>
                        <ul className="space-y-1 text-sm">
                          {data.howItsUsed.map((use, useIndex) => (
                            <li key={useIndex} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>{use}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Protection Tips:</h4>
                        <ul className="space-y-1 text-sm">
                          {data.protectionTips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <h4 className="font-medium mb-1 text-yellow-700 dark:text-yellow-400">Risk to You:</h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">{data.riskToYou}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biggest-breaches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>The Biggest Data Breaches in History</CardTitle>
              <CardDescription>
                Learning from the largest breaches helps us understand what can go wrong and how to prevent it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats.biggestBreaches.map((breach, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-xl">{breach.name}</h3>
                        <p className="text-muted-foreground mt-1">
                          {breach.year} • {breach.recordsAffected}
                        </p>
                      </div>
                      <Badge variant="destructive">Major Breach</Badge>
                    </div>

                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <h4 className="font-medium mb-1 text-red-700 dark:text-red-400">What Happened:</h4>
                      <p className="text-sm text-red-800 dark:text-red-300">{breach.whatHappened}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Data Types Stolen:</h4>
                        <div className="flex flex-wrap gap-1">
                          {breach.dataTypes.map((type, typeIndex) => (
                            <Badge key={typeIndex} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Financial Impact:</h4>
                        <p className="text-sm text-muted-foreground">{breach.impact}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h4 className="font-medium mb-1 text-blue-700 dark:text-blue-400">Lesson Learned:</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-300">{breach.lessonLearned}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How Protected Are You?</CardTitle>
              <CardDescription>
                Different levels of cybersecurity protection and what they mean for your safety.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats.protectionLevels.map((level, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-xl">{level.level}</h3>
                        <p className="text-muted-foreground mt-1">{level.description}</p>
                      </div>
                      <Badge
                        variant={level.yourRisk > 70 ? "destructive" : level.yourRisk > 30 ? "default" : "secondary"}
                      >
                        {level.yourRisk}% Risk
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <Progress value={100 - level.yourRisk} className="h-3 mb-2" />
                      <p className="text-sm text-muted-foreground">Protection Level</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <h4 className="font-medium">Detection Time</h4>
                        <p className="text-muted-foreground">{level.timeToDetect}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Cost Impact</h4>
                        <p className="text-muted-foreground">{level.costImpact}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">If Breached</h4>
                        <p className="text-muted-foreground">{level.whatHappensIfBreached}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Typical Practices/Characteristics:</h4>
                      <ul className="space-y-1 text-sm">
                        {level.practices.map((practice, practiceIndex) => (
                          <li key={practiceIndex} className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${level.yourRisk > 70 ? "bg-red-500" : level.yourRisk > 30 ? "bg-yellow-500" : "bg-green-500"}`}
                            ></div>
                            <span>{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">How to Improve:</h4>
                      <ul className="space-y-1 text-sm">
                        {level.howToImprove.map((improve, improveIndex) => (
                          <li key={improveIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{improve}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-1">Real-World Example:</h4>
                      <p className="text-sm text-muted-foreground">{level.realWorldExample}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
