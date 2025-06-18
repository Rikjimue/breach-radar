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
  MapPin,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Lock,
  CreditCard,
  Hash,
} from "lucide-react"

interface SearchField {
  id: string
  label: string
  placeholder: string
  icon: any
  type: "text" | "password"
  sensitive?: boolean
  format?: string
  validation?: (value: string) => boolean
}

const availableFields: SearchField[] = [
  { id: "firstName", label: "First Name", placeholder: "John", icon: User, type: "text" },
  { id: "lastName", label: "Last Name", placeholder: "Doe", icon: User, type: "text" },
  { id: "email", label: "Email", placeholder: "john@example.com", icon: Mail, type: "text" },
  {
    id: "phone",
    label: "Phone Number",
    placeholder: "+1 (555)-123-4567",
    icon: Phone,
    type: "text",
    format: "+extension (###)-###-####",
    validation: (value: string) => /^\+\d{1,3} $$\d{3}$$-\d{3}-\d{4}$/.test(value),
  },
  {
    id: "address",
    label: "Address",
    placeholder: "123 Main St, New York, NY, 10001",
    icon: MapPin,
    type: "text",
    format: "Street, City, State, ZIP",
    validation: (value: string) => {
      const parts = value.split(",").map((part) => part.trim())
      return parts.length === 4 && parts.every((part) => part.length > 0)
    },
  },
  { id: "username", label: "Username", placeholder: "your_username", icon: User, type: "text" },
  {
    id: "dateOfBirth",
    label: "Date of Birth",
    placeholder: "MM/DD/YYYY",
    icon: User,
    type: "text",
    format: "MM/DD/YYYY",
    validation: (value: string) => /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(value),
  },
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

export default function SearchPage() {
  const [activeFields, setActiveFields] = useState<string[]>(["firstName"])
  const [selectedSensitiveField, setSelectedSensitiveField] = useState<string>("")
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [breachSearchQuery, setBreachSearchQuery] = useState("")
  const [searchMode, setSearchMode] = useState<"personal" | "sensitive">("personal")

  // Filter breaches based on search query
  const filteredBreaches =
    searchResults?.breachList?.filter(
      (breach: any) =>
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
    // Clear the value and error when removing field
    const newValues = { ...searchValues }
    const newErrors = { ...fieldErrors }
    delete newValues[fieldId]
    delete newErrors[fieldId]
    setSearchValues(newValues)
    setFieldErrors(newErrors)
  }

  const validateField = (fieldId: string, value: string) => {
    const field = getFieldById(fieldId)
    if (!field || !field.validation || !value.trim()) {
      return ""
    }

    if (!field.validation(value)) {
      return `Please use format: ${field.format}`
    }

    return ""
  }

  const handleFieldChange = (fieldId: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [fieldId]: value }))

    // Clear error when user starts typing
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }

    // Validate on blur or when field is complete
    const field = getFieldById(fieldId)
    if (field?.validation && value.trim()) {
      const error = validateField(fieldId, value)
      if (error) {
        setFieldErrors((prev) => ({ ...prev, [fieldId]: error }))
      }
    }
  }

  const handleSensitiveFieldChange = (fieldId: string) => {
    // Clear previous sensitive field value and error
    if (selectedSensitiveField) {
      const newValues = { ...searchValues }
      const newErrors = { ...fieldErrors }
      delete newValues[selectedSensitiveField]
      delete newErrors[selectedSensitiveField]
      setSearchValues(newValues)
      setFieldErrors(newErrors)
    }
    setSelectedSensitiveField(fieldId)
    setShowPassword(false)
  }

  const clearSensitiveField = () => {
    if (selectedSensitiveField) {
      const newValues = { ...searchValues }
      const newErrors = { ...fieldErrors }
      delete newValues[selectedSensitiveField]
      delete newErrors[selectedSensitiveField]
      setSearchValues(newValues)
      setFieldErrors(newErrors)
    }
    setSelectedSensitiveField("")
    setShowPassword(false)
  }

  const handleSearch = async () => {
    // Validate all fields before searching
    const errors: Record<string, string> = {}
    const fieldsToValidate =
      searchMode === "personal" ? activeFields : selectedSensitiveField ? [selectedSensitiveField] : []

    fieldsToValidate.forEach((fieldId) => {
      const value = searchValues[fieldId]
      if (value?.trim()) {
        const error = validateField(fieldId, value)
        if (error) {
          errors[fieldId] = error
        }
      }
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSearching(true)

    try {
      // Prepare search data based on mode
      const searchData = {
        mode: searchMode,
        fields:
          searchMode === "personal"
            ? activeFields.reduce(
                (acc, fieldId) => {
                  if (searchValues[fieldId]?.trim()) {
                    acc[fieldId] = searchValues[fieldId].trim()
                  }
                  return acc
                },
                {} as Record<string, string>,
              )
            : selectedSensitiveField && searchValues[selectedSensitiveField]?.trim()
              ? { [selectedSensitiveField]: searchValues[selectedSensitiveField].trim() }
              : {},
      }

      // Check if we have any search values
      if (Object.keys(searchData.fields).length === 0) {
        setIsSearching(false)
        return
      }

      // Make API call to search endpoint
      const response = await fetch("/api/breach-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
      // Handle error - could show error message to user
      setSearchResults(null)
    } finally {
      setIsSearching(false)
    }
  }

  const getFieldById = (fieldId: string): SearchField | undefined => {
    return [...availableFields, ...sensitiveFields].find((field) => field.id === fieldId)
  }

  const selectedSensitiveFieldData = selectedSensitiveField ? getFieldById(selectedSensitiveField) : null

  // Check if search can be performed (no validation errors and has values)
  const canSearch = () => {
    const hasErrors = Object.keys(fieldErrors).length > 0
    const hasValues =
      searchMode === "personal"
        ? activeFields.some((fieldId) => searchValues[fieldId]?.trim())
        : selectedSensitiveField && searchValues[selectedSensitiveField]?.trim()

    return !hasErrors && hasValues && !isSearching
  }

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
                  Add or remove fields to customize your search. Multiple fields help narrow down results. Some fields
                  require specific formats.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Active Fields */}
                <div className="space-y-3">
                  {activeFields.map((fieldId) => {
                    const field = getFieldById(fieldId)
                    if (!field) return null
                    const Icon = field.icon
                    const hasError = fieldErrors[fieldId]

                    return (
                      <div key={fieldId} className="flex items-start space-x-2">
                        <div className="flex-1">
                          <Label htmlFor={fieldId} className="flex items-center space-x-2 mb-2">
                            <Icon className="h-4 w-4" />
                            <span>{field.label}</span>
                            {field.format && (
                              <Badge variant="outline" className="text-xs">
                                Format: {field.format}
                              </Badge>
                            )}
                          </Label>
                          <Input
                            id={fieldId}
                            placeholder={field.placeholder}
                            value={searchValues[fieldId] || ""}
                            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
                            className={hasError ? "border-red-500 focus:border-red-500" : ""}
                          />
                          {hasError && <p className="text-sm text-red-600 mt-1">{hasError}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(fieldId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 mt-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>

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
                {/* Sensitive Field Selector */}
                <div className="space-y-2">
                  <Label htmlFor="sensitiveSelect">Select Sensitive Data Type</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Select value={selectedSensitiveField} onValueChange={handleSensitiveFieldChange}>
                        <SelectTrigger id="sensitiveSelect">
                          <SelectValue placeholder="Choose a sensitive data type to search..." />
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
                    {selectedSensitiveField && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSensitiveField}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Selected Sensitive Field Input */}
                {selectedSensitiveFieldData && (
                  <div className="space-y-2">
                    <Label htmlFor="sensitiveInput" className="flex items-center space-x-2">
                      <selectedSensitiveFieldData.icon className="h-4 w-4" />
                      <span>{selectedSensitiveFieldData.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        Sensitive
                      </Badge>
                    </Label>
                    <div className="relative">
                      <Input
                        id="sensitiveInput"
                        type={selectedSensitiveFieldData.type === "password" && !showPassword ? "password" : "text"}
                        placeholder={selectedSensitiveFieldData.placeholder}
                        value={searchValues[selectedSensitiveField] || ""}
                        onChange={(e) => handleFieldChange(selectedSensitiveField, e.target.value)}
                        className="pr-10"
                      />
                      {selectedSensitiveFieldData.type === "password" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    <strong>Maximum Privacy:</strong> Sensitive searches are processed in complete isolation and cannot
                    be correlated with other searches or data points.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!canSearch()}
            className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? "Searching..." : "Search for Data Breaches"}
          </Button>

          {/* Search Results */}
          {searchResults && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {searchResults.found ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <span>Search Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Fields Searched: {searchResults.searchFields.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {searchResults.searchFields
                        .map((fieldId: string) => {
                          const field = getFieldById(fieldId)
                          return field?.label
                        })
                        .join(", ")}
                    </p>
                  </div>
                  <Badge variant={searchResults.found ? "destructive" : "default"}>
                    {searchResults.found ? "Found in Breaches" : "Not Found"}
                  </Badge>
                </div>

                {searchResults.found && (
                  <div className="space-y-4">
                    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        <strong>Security Alert:</strong> Your information was found in {searchResults.breaches}{" "}
                        breach(es) affecting {searchResults.records.toLocaleString()} records total.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Affected Breaches ({searchResults.totalBreaches} total):</h3>
                        <div className="relative w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search breaches..."
                            className="pl-10"
                            value={breachSearchQuery}
                            onChange={(e) => setBreachSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                        {filteredBreaches.map((breach: any, index: number) => (
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
                                {breach.date} • {breach.records} records
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Matched:{" "}
                                {breach.matchedFields
                                  .map((fieldId: string) => {
                                    const field = getFieldById(fieldId)
                                    return field?.label
                                  })
                                  .join(", ")}
                              </p>
                            </div>
                            <Badge variant={breach.severity === "High" ? "destructive" : "secondary"}>
                              {breach.severity}
                            </Badge>
                          </div>
                        ))}

                        {filteredBreaches.length === 0 && breachSearchQuery && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No breaches found matching "{breachSearchQuery}"</p>
                          </div>
                        )}
                      </div>

                      {filteredBreaches.length < searchResults.totalBreaches && !breachSearchQuery && (
                        <div className="text-center py-2 text-sm text-muted-foreground border-t">
                          Showing {filteredBreaches.length} of {searchResults.totalBreaches} breaches
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!searchResults.found && (
                  <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Good news! Your information was not found in any known data breaches in our database.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Format requirements</p>
                  <p className="text-muted-foreground">Phone: +1 (555)-123-4567</p>
                  <p className="text-muted-foreground">Address: Street, City, State, ZIP</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Combine fields</p>
                  <p className="text-muted-foreground">Use multiple personal fields for more accurate results</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Search modes</p>
                  <p className="text-muted-foreground">Choose personal OR sensitive search, not both</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Privacy first</p>
                  <p className="text-muted-foreground">No searches are logged or tracked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Breach Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">MegaCorp Data Leak</p>
                <p className="text-muted-foreground">2.3M records • 2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">TechStart Breach</p>
                <p className="text-muted-foreground">890K records • 1 day ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">RetailGiant Hack</p>
                <p className="text-muted-foreground">1.7M records • 3 days ago</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Enable Monitoring
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                Security Guide
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Breach
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
