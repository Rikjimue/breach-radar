import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Database, Zap, Crown, Shield } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Personal",
      price: "Free",
      description: "Basic breach checking for individuals",
      icon: Shield,
      features: [
        "10 searches per day",
        "Basic breach information",
        "Email & username search",
        "Community support",
        "Privacy protected searches",
      ],
      buttonText: "Start Free",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Advanced monitoring for security professionals",
      icon: Zap,
      features: [
        "Unlimited searches",
        "All data types supported",
        "Detailed breach reports",
        "API access (1000 calls/day)",
        "Priority support",
        "Bulk search capabilities",
        "Export functionality",
        "Historical breach data",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "Complete solution for organizations",
      icon: Crown,
      features: [
        "Everything in Professional",
        "Unlimited API calls",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "Custom breach alerts",
        "Team management",
        "Advanced analytics",
        "White-label options",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">API Access & Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose the right plan for your security needs. All plans include privacy-protected searches and comprehensive
          breach data.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => {
          const Icon = plan.icon
          return (
            <Card key={index} className={`relative ${plan.popular ? "border-red-500 shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500">Most Popular</Badge>
              )}
              <CardHeader className="text-center">
                <div
                  className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    plan.popular ? "bg-red-100 dark:bg-red-900/20" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${plan.popular ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                  />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}
                  {plan.period && <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.buttonVariant} size="lg">
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* API Documentation */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">API Documentation</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>REST API</span>
              </CardTitle>
              <CardDescription>Simple HTTP requests for breach checking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm">GET /api/v1/breach-check?email=user@example.com</code>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Response Format:</h4>
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <pre>{`{
  "found": true,
  "breaches": 3,
  "records": 15420,
  "details": [...]
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Features</span>
              </CardTitle>
              <CardDescription>Built-in privacy and security protections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm">Rate limiting protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm">API key authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm">HTTPS encryption required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm">No query logging</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm">GDPR compliant</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "How accurate is the breach data?",
              answer:
                "Our data is sourced from verified breaches and security researchers. We continuously update our database and verify breach authenticity before inclusion.",
            },
            {
              question: "Do you store my search queries?",
              answer:
                "No, we do not log, store, or track any search queries. Each search is processed in real-time and immediately discarded to protect your privacy.",
            },
            {
              question: "What's included in the API?",
              answer:
                "The API provides access to all breach data, supports all search types, and includes detailed breach metadata such as dates, affected records, and severity levels.",
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer:
                "Yes, you can cancel your subscription at any time. There are no long-term contracts, and you'll retain access until the end of your billing period.",
            },
            {
              question: "Is there a free trial for paid plans?",
              answer:
                "Yes, Professional and Enterprise plans include a 14-day free trial. No credit card required to start your trial.",
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{faq.answer}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
        <Shield className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Responsible Use Policy</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Our API is designed for legitimate security research and defensive purposes only. We monitor usage patterns
          and reserve the right to suspend accounts that violate our terms of service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline">View Terms of Service</Button>
          <Button variant="outline">Contact Security Team</Button>
        </div>
      </div>
    </div>
  )
}
