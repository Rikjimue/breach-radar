"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Database, AlertTriangle, Shield, Users } from "lucide-react"

interface StatisticsData {
  totalRecords: string
  totalRecordsChange: string
  activeBreaches: number
  activeBreachesChange: number
  dailySearches: string
  dailySearchesChange: string
  privacyScore: string
  breachActivity: number[]
  breachSeverity: {
    critical: number
    high: number
    medium: number
    low: number
  }
  topIndustries: Array<{
    industry: string
    breaches: number
    trend: "up" | "down"
  }>
  dataTypes: Array<{
    type: string
    percentage: number
  }>
  recentBreaches: Array<{
    name: string
    records: string
    timeAgo: string
    severity: "Critical" | "High" | "Medium" | "Low"
  }>
  globalImpact: {
    northAmerica: string
    europe: string
    asiaPacific: string
    otherRegions: string
  }
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("/api/statistics")
        if (!response.ok) {
          throw new Error("Failed to fetch statistics")
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Breach Statistics & Analytics</h1>
          <p className="text-muted-foreground">
            Real-time insights into global data breach trends and compromised records.
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
          <h1 className="text-3xl font-bold mb-2">Breach Statistics & Analytics</h1>
          <p className="text-muted-foreground">
            Real-time insights into global data breach trends and compromised records.
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Statistics</h3>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Breach Statistics & Analytics</h1>
        <p className="text-muted-foreground">
          Real-time insights into global data breach trends and compromised records.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecords}</div>
            <div className="flex items-center text-xs text-red-600 dark:text-red-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.totalRecordsChange}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Breaches</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBreaches.toLocaleString()}</div>
            <div className="flex items-center text-xs text-red-600 dark:text-red-400">
              <TrendingUp className="h-3 w-3 mr-1" />+{stats.activeBreachesChange} this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Searches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dailySearches}</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.dailySearchesChange}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Privacy Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.privacyScore}</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              Maintained
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Breach Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Breach Activity (Last 30 Days)</CardTitle>
            <CardDescription>Number of new breaches discovered daily</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-1">
              {stats.breachActivity.map((height, i) => {
                const isHigh = height > 70
                return (
                  <div
                    key={i}
                    className={`rounded-t-sm flex-1 opacity-80 hover:opacity-100 transition-opacity ${
                      isHigh ? "bg-red-500 dark:bg-red-400" : "bg-orange-500 dark:bg-orange-400"
                    }`}
                    style={{ height: `${height}%` }}
                    title={`Day ${i + 1}: ${Math.floor(height / 10)} breaches`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Breach Severity */}
        <Card>
          <CardHeader>
            <CardTitle>Breach Severity Distribution</CardTitle>
            <CardDescription>Classification of breaches by impact level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full mr-2"></div>
                  Critical
                </span>
                <span>{stats.breachSeverity.critical}%</span>
              </div>
              <Progress value={stats.breachSeverity.critical} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded-full mr-2"></div>
                  High
                </span>
                <span>{stats.breachSeverity.high}%</span>
              </div>
              <Progress value={stats.breachSeverity.high} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full mr-2"></div>
                  Medium
                </span>
                <span>{stats.breachSeverity.medium}%</span>
              </div>
              <Progress value={stats.breachSeverity.medium} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full mr-2"></div>
                  Low
                </span>
                <span>{stats.breachSeverity.low}%</span>
              </div>
              <Progress value={stats.breachSeverity.low} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Targeted Industries</CardTitle>
            <CardDescription>Industries with highest breach frequency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topIndustries.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.industry}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{item.breaches}</Badge>
                  {item.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Types Compromised</CardTitle>
            <CardDescription>Most commonly exposed data fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.dataTypes.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.type}</span>
                  <span>{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Major Breaches</CardTitle>
            <CardDescription>Significant breaches in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentBreaches.map((breach, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium">{breach.name}</p>
                  <Badge variant={breach.severity === "Critical" ? "destructive" : "secondary"}>
                    {breach.severity}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {breach.records} records • {breach.timeAgo}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Global Impact */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Global Breach Impact</CardTitle>
            <CardDescription>Geographic distribution of data breaches and affected populations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {stats.globalImpact.northAmerica}
                </div>
                <p className="text-sm text-muted-foreground">North America</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {stats.globalImpact.europe}
                </div>
                <p className="text-sm text-muted-foreground">Europe</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {stats.globalImpact.asiaPacific}
                </div>
                <p className="text-sm text-muted-foreground">Asia Pacific</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {stats.globalImpact.otherRegions}
                </div>
                <p className="text-sm text-muted-foreground">Other Regions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
