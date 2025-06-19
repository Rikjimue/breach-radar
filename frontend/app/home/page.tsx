"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  X,
  User,
  Phone,
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Lock,
  CreditCard,
  Hash,
  Loader2,
} from "lucide-react"

// Universal salt - in production, get this from environment or server
const UNIVERSAL_SALT = "your-super-secret-universal-salt-breachguard";

// Hashing service
class HashingService {
  private universalSalt: string;
  
  constructor() {
    this.universalSalt = UNIVERSAL_SALT;
  }
  
  async generateFullHash(value: string, fieldType: string): Promise<string> {
    const fieldSalt = this.getFieldSalt(fieldType);
    const normalized = this.normalizeInput(value, fieldType);
    const combined = this.universalSalt + fieldSalt + normalized;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  generatePartialHash(fullHash: string): string {
    return fullHash.substring(0, 8);
  }
  
  private getFieldSalt(fieldType: string): string {
    const fieldSalts: Record<string, string> = {
      email: "email_salt",
      phone: "phone_salt",
      firstName: "fname_salt", 
      lastName: "lname_salt",
      ssn: "ssn_salt",
      creditCard: "cc_salt",
      password: "password_salt",
      username: "username_salt",
      address: "address_salt",
      city: "city_salt",
      state: "state_salt",
      zipCode: "zip_salt",
      country: "country_salt",
      dateOfBirth: "dob_salt",
      driverLicense: "dl_salt",
      passport: "passport_salt"
    };
    return fieldSalts[fieldType] || "default_salt";
  }
  
  private normalizeInput(value: string, fieldType: string): string {
    value = value.trim();
    switch (fieldType) {
      case "email":
        return value.toLowerCase();
      case "phone":
        return value.replace(/\D/g, '');
      case "firstName":
      case "lastName":
        return value.toLowerCase();
      case "ssn":
      case "creditCard":
      case "driverLicense":
        return value.replace(/\D/g, '');
      default:
        return value.toLowerCase();
    }
  }
}

interface SearchField {
  id: string
  label: string
  placeholder: string
  icon: any
  type: "text" | "password"
  sensitive?: boolean
}

const availableFields: SearchField[] = [
  { id: "firstName", label: "First Name", placeholder: "John", icon: User, type: "text" },
  { id: "lastName", label: "Last Name", placeholder: "Doe", icon: User, type: "text" },
  { id: "email", label: "Email", placeholder: "john@example.com", icon: Mail, type: "text" },
  { id: "phone", label: "Phone Number", placeholder: "+1 (555) 123-4567", icon: Phone, type: "text" },
  { id: "username", label: "Username", placeholder: "your_username", icon: User, type: "text" },
  { id: "address", label: "Address", placeholder: "123 Main St", icon: User, type: "text" },
  { id: "city", label: "City", placeholder: "New York", icon: User, type: "text" },
  { id: "state", label: "State", placeholder: "NY", icon: User, type: "text" },
  { id: "zipCode", label: "ZIP Code", placeholder: "10001", icon: Hash, type: "text" },
  { id: "country", label: "Country", placeholder: "United States", icon: User, type: "text" },
  { id: "dateOfBirth", label: "Date of Birth", placeholder: "1990-01-01", icon: User, type: "text" },
]

const sensitiveFields: SearchField[] = [
  {
    id: "ssn",
    label: "Social Security Number",
    placeholder: "XXX-XX-1234",
    icon: Hash,
    type: "password",
    sensitive: true,
  },
  { id: "password", label: "Password", placeholder: "Your password", icon: Lock, type: "password", sensitive: true },
  {
    id: "creditCard",
    label: "Credit Card",
    placeholder: "**** **** **** 1234",
    icon: CreditCard,
    type: "password",
    sensitive: true,
  },
  {
    id: "driverLicense",
    label: "Driver License",
    placeholder: "DL123456789",
    icon: Hash,
    type: "password",
    sensitive: true,
  },
  { id: "passport", label: "Passport Number", placeholder: "A12345678", icon: Hash, type: "password", sensitive: true },
]

interface BreachSummary {
  name: string;
  date: string;
  records: string;
  severity: string;
  matchedFields: string[];
  partialMatch: boolean;
  riskScore: number;
  timeAgo?: string;
}

interface SearchResults {
  found: boolean;
  breaches: number;
  records: number;
  searchFields: string[];
  totalBreaches: number;
  breachList: BreachSummary[];
}

export default function SearchPage() {
  const [activeFields, setActiveFields] = useState<string[]>(["firstName"])
  const [selectedSensitiveField, setSelectedSensitiveField] = useState<string>("")
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [breachSearchQuery, setBreachSearchQuery] = useState("")
  const [searchMode, setSearchMode] = useState<"personal" | "sensitive">("personal")

  const hashingService = new HashingService();

  // Filter breaches based on search query
  const filteredBreaches = searchResults?.breachList?.filter(
    (breach) =>
      breach.name.toLowerCase().includes(breachSearchQuery.toLowerCase()) ||
      breach.severity.toLowerCase().includes(breachSearchQuery.toLowerCase()),
  ) || []

  const addField = (fieldId: string) => {
    if (!activeFields.includes(fieldId)) {
      setActiveFields([...activeFields, fieldId])
    }
  }

  const removeField = (fieldId: string) => {
    setActiveFields(activeFields.filter((id) => id !== fieldId))
    const newValues = { ...searchValues }
    delete newValues[fieldId]
    setSearchValues(newValues)
  }

  const handleSensitiveFieldChange = (fieldId: string) => {
    if (selectedSensitiveField) {
      const newValues = { ...searchValues }
      delete newValues[selectedSensitiveField]
      setSearchValues(newValues)
    }
    setSelectedSensitiveField(fieldId)
    setShowPassword(false)
  }

  const clearSensitiveField = () => {
    if (selectedSensitiveField) {
      const newValues = { ...searchValues }
      delete newValues[selectedSensitiveField]
      setSearchValues(newValues)
    }
    setSelectedSensitiveField("")
    setShowPassword(false)
  }

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchError(null);
    setSearchResults(null);

    try {
      const searchData: any = {
        mode: searchMode,
        fields: {},
        clientHashes: {}
      };

      if (searchMode === "personal") {
        for (const fieldId of activeFields) {
          if (searchValues[fieldId]?.trim()) {
            const fullHash = await hashingService.generateFullHash(
              searchValues[fieldId].trim(), 
              fieldId
            );
            searchData.fields[fieldId] = fullHash;
          }
        }
      } else if (selectedSensitiveField && searchValues[selectedSensitiveField]?.trim()) {
        const fullHash = await hashingService.generateFullHash(
          searchValues[selectedSensitiveField].trim(),
          selectedSensitiveField
        );
        const partialHash = hashingService.generatePartialHash(fullHash);
        
        searchData.fields[selectedSensitiveField] = partialHash;
        searchData.clientHashes[selectedSensitiveField] = fullHash;
      }

      // Check if we have any search data
      if (Object.keys(searchData.fields).length === 0) {
        setSearchError("Please enter data to search for breaches");
        return;
      }

      const response = await fetch("/api/breach-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: searchData.mode,
          fields: searchData.fields
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const serverResults = await response.json();
      
      let verifiedResults;
      if (searchMode === "personal") {
        verifiedResults = processPersonalResults(serverResults);
      } else {
        verifiedResults = verifySensitiveMatches(serverResults, searchData.clientHashes);
      }
      
      setSearchResults(verifiedResults);

    } catch (error) {
      console.error("Search error:", error);
      
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError("An unexpected error occurred while searching. Please try again.");
      }
      
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const processPersonalResults = (serverResults: any): SearchResults => {
    const processedBreaches: BreachSummary[] = [];
    
    for (const breach of serverResults.exactMatches || []) {
      const severity = calculateDynamicSeverity(breach.matchedFields, breach.affectedRecords);
      
      processedBreaches.push({
        name: breach.name,
        date: breach.date,
        records: breach.affectedRecords,
        severity: severity,
        matchedFields: breach.matchedFields,
        partialMatch: breach.partialMatch,
        riskScore: calculateRiskScore(breach.matchedFields),
        timeAgo: formatTimeAgo(breach.date)
      });
    }
    
    return {
      found: processedBreaches.length > 0,
      breaches: processedBreaches.length,
      records: processedBreaches.reduce((sum, b) => sum + parseInt(b.records.replace(/\D/g, '')), 0),
      searchFields: serverResults.searchFields || [],
      totalBreaches: processedBreaches.length,
      breachList: processedBreaches
    };
  };

  const verifySensitiveMatches = (serverResults: any, clientHashes: Record<string, string>): SearchResults => {
    const verifiedBreaches: BreachSummary[] = [];
    
    for (const breach of serverResults.candidateBreaches || []) {
      const matchedFields: string[] = [];
      
      for (const [fieldType, candidateHashes] of Object.entries(breach.hashCandidates || {})) {
        const userFullHash = clientHashes[fieldType];
        if (userFullHash && (candidateHashes as string[]).includes(userFullHash)) {
          matchedFields.push(fieldType);
        }
      }
      
      if (matchedFields.length > 0) {
        const severity = calculateDynamicSeverity(matchedFields, breach.affectedRecords);
        
        verifiedBreaches.push({
          name: breach.name,
          date: breach.date,
          records: breach.affectedRecords,
          severity: severity,
          matchedFields: matchedFields,
          partialMatch: false,
          riskScore: calculateRiskScore(matchedFields),
          timeAgo: formatTimeAgo(breach.date)
        });
      }
    }
    
    return {
      found: verifiedBreaches.length > 0,
      breaches: verifiedBreaches.length,
      records: verifiedBreaches.reduce((sum, b) => sum + parseInt(b.records.replace(/\D/g, '')), 0),
      searchFields: Object.keys(clientHashes),
      totalBreaches: verifiedBreaches.length,
      breachList: verifiedBreaches
    };
  };

  const calculateDynamicSeverity = (matchedFields: string[], recordCount: string): string => {
    let score = 0;
    
    const fieldScores: Record<string, number> = {
      ssn: 100, creditCard: 90, driverLicense: 80, passport: 85, password: 75,
      email: 40, phone: 35, address: 45,
      firstName: 20, lastName: 25, username: 30,
      city: 15, state: 10, zipCode: 20, dateOfBirth: 50, country: 10
    };
    
    for (const field of matchedFields) {
      score += fieldScores[field] || 10;
    }
    
    const records = parseInt(recordCount.replace(/\D/g, '')) || 0;
    if (records > 100000000) {
      score = Math.floor(score * 1.3);
    } else if (records > 10000000) {
      score = Math.floor(score * 1.1);
    }
    
    const sensitiveFields = ['ssn', 'creditCard', 'driverLicense', 'passport', 'password', 'dateOfBirth'];
    const sensitiveCount = matchedFields.filter(field => sensitiveFields.includes(field)).length;
    
    if (sensitiveCount >= 3) {
      score = Math.floor(score * 1.4);
    } else if (sensitiveCount >= 2) {
      score = Math.floor(score * 1.2);
    }
    
    if (score >= 200) return "Critical";
    if (score >= 120) return "High";
    if (score >= 60) return "Medium";
    return "Low";
  };

  const calculateRiskScore = (matchedFields: string[]): number => {
    const severity = calculateDynamicSeverity(matchedFields, "1000000");
    const scoreMap = { Critical: 95, High: 75, Medium: 50, Low: 25 };
    return scoreMap[severity as keyof typeof scoreMap] || 25;
  };

  const formatTimeAgo = (date: string): string => {
    const breachDate = new Date(date);
    const now = new Date();
    const years = Math.floor((now.getTime() - breachDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    
    if (years >= 1) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    
    const months = Math.floor((now.getTime() - breachDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return `${months} month${months > 1 ? 's' : ''} ago`;
  };

  const getFieldById = (fieldId: string): SearchField | undefined => {
    return [...availableFields, ...sensitiveFields].find((field) => field.id === fieldId)
  }

  const selectedSensitiveFieldData = selectedSensitiveField ? getFieldById(selectedSensitiveField) : null

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Modular Data Breach Search</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Build your custom search by adding the data fields you want to check. Each search is private and cannot be
          linked to you.
        </p>
      </div>

      {/* Privacy Notice */}
      <Alert className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Privacy Protected:</strong> Your searches are not logged, tracked, or stored. Each query is
          independent and anonymous.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Search Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Mode Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search Mode</CardTitle>
              <CardDescription>
                Choose between personal information search or sensitive data search. Only one mode can be active at a
                time for maximum privacy protection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button
                  variant={searchMode === "personal" ? "default" : "outline"}
                  onClick={() => setSearchMode("personal")}
                  className={`flex items-center space-x-2 ${
                    searchMode === "personal" ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" : ""
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Personal Information</span>
                </Button>
                <Button
                  variant={searchMode === "sensitive" ? "default" : "outline"}
                  onClick={() => setSearchMode("sensitive")}
                  className={`flex items-center space-x-2 ${
                    searchMode === "sensitive"
                      ? "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white"
                      : "border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950"
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  <span>Sensitive Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {searchMode === "personal" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Personal Information Search</span>
                </CardTitle>
                <CardDescription>
                  Add or remove fields to customize your search. Multiple fields help narrow down results.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Active Fields */}
                {activeFields.map((fieldId) => {
                  const field = getFieldById(fieldId)
                  if (!field) return null
                  const Icon = field.icon

                  return (
                    <div key={fieldId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={fieldId} className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{field.label}</span>
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(fieldId)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        id={fieldId}
                        placeholder={field.placeholder}
                        value={searchValues[fieldId] || ""}
                        onChange={(e) => setSearchValues({ ...searchValues, [fieldId]: e.target.value })}
                      />
                    </div>
                  )
                })}

                {/* Add Field Buttons */}
                <div className="flex flex-wrap gap-2">
                  {availableFields
                    .filter((field) => !activeFields.includes(field.id))
                    .map((field) => {
                      const Icon = field.icon
                      return (
                        <Button
                          key={field.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addField(field.id)}
                          className="flex items-center space-x-1"
                        >
                          <Plus className="h-3 w-3" />
                          <Icon className="h-3 w-3" />
                          <span>{field.label}</span>
                        </Button>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sensitive Information Search */}
          {searchMode === "sensitive" && (
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-700 dark:text-orange-400">
                  <Lock className="h-5 w-5" />
                  <span>Sensitive Information Search</span>
                </CardTitle>
                <CardDescription>
                  Search for highly sensitive data. Only one sensitive field can be searched at a time for maximum
                  privacy protection.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sensitive Field Selection */}
                <div className="space-y-2">
                  <Label>Select Sensitive Data Type</Label>
                  <Select value={selectedSensitiveField} onValueChange={handleSensitiveFieldChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose sensitive data type to search" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensitiveFields.map((field) => {
                        const Icon = field.icon
                        return (
                          <SelectItem key={field.id} value={field.id}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{field.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sensitive Field Input */}
                {selectedSensitiveFieldData && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sensitiveInput" className="flex items-center space-x-2">
                        <selectedSensitiveFieldData.icon className="h-4 w-4" />
                        <span>{selectedSensitiveFieldData.label}</span>
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-8 w-8 p-0"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearSensitiveField}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Input
                      id="sensitiveInput"
                      type={showPassword ? "text" : selectedSensitiveFieldData.type}
                      placeholder={selectedSensitiveFieldData.placeholder}
                      value={searchValues[selectedSensitiveField] || ""}
                      onChange={(e) =>
                        setSearchValues({ ...searchValues, [selectedSensitiveField]: e.target.value })
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Search Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleSearch}
                disabled={isSearching || (searchMode === "personal" ? activeFields.length === 0 : !selectedSensitiveField)}
                className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Searching Breaches...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Check for Data Breaches
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Error Display */}
          {searchError && (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Search Error</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      <strong>Error:</strong> {searchError}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p><strong>Common issues:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Network connection problems</li>
                      <li>Server temporarily unavailable</li>
                      <li>Invalid search parameters</li>
                      <li>Rate limiting (too many requests)</li>
                    </ul>
                    
                    <p className="mt-3">
                      <strong>Try:</strong> Check your connection and try searching again in a few moments.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => setSearchError(null)} 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    Dismiss Error
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Status */}
          {searchResults && !searchError && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {searchResults.found ? (
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                  <span>{searchResults.found ? "Data Found in Breaches" : "No Data Found"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {searchResults.found ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Your data appears in <strong>{searchResults.breaches}</strong> breach{searchResults.breaches !== 1 ? 'es' : ''} affecting approximately{' '}
                      <strong>{searchResults.records.toLocaleString()}</strong> total records.
                    </p>
                    
                    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        <strong>Action Recommended:</strong> Consider changing passwords and enabling two-factor authentication for affected accounts.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Affected Breaches ({searchResults.totalBreaches} total):</h3>
                        {searchResults.breachList.length > 3 && (
                          <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search breaches..."
                              className="pl-10"
                              value={breachSearchQuery}
                              onChange={(e) => setBreachSearchQuery(e.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                        {filteredBreaches.map((breach, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium">{breach.name}</p>
                                {breach.partialMatch && (
                                  <Badge variant="outline" className="text-xs">
                                    Partial Match
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {breach.date} • {breach.records} records • {breach.timeAgo}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Matched: {breach.matchedFields.map((fieldId) => {
                                  const field = getFieldById(fieldId)
                                  return field?.label
                                }).join(", ")}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={getSeverityColor(breach.severity) as any}>
                                  {breach.severity}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Risk: {breach.riskScore}/100
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Great news! Your data was not found in any known breaches.
                    </p>
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Your information appears to be secure based on our current database.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Information Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>How It Works</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">1</span>
                </div>
                <p>
                  <strong>Personal Mode:</strong> Search multiple fields simultaneously for comprehensive results.
                  Your data is hashed locally before being sent to our servers.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">2</span>
                </div>
                <p>
                  <strong>Sensitive Mode:</strong> Uses advanced k-anonymity protection. Only partial hashes are sent,
                  and verification happens on your device for maximum privacy.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">3</span>
                </div>
                <p>
                  <strong>Privacy First:</strong> No search queries are logged or stored. Each search is independent
                  and cannot be linked to you or your previous searches.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                <Shield className="h-5 w-5" />
                <span>Privacy Protection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <span>End-to-end encryption of search data</span>
              </div>
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <span>No logging or tracking of searches</span>
              </div>
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <span>Client-side hashing and verification</span>
              </div>
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <span>K-anonymity protection for sensitive data</span>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Search Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p><strong>Personal Information:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Add multiple fields for more comprehensive results</li>
                  <li>Use the exact format as it appears in your accounts</li>
                  <li>Include variations like nicknames or maiden names</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p><strong>Sensitive Data:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Only search one sensitive field at a time</li>
                  <li>Enter data exactly as it appears on documents</li>
                  <li>Remember that partial matches protect your privacy</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}