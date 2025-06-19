const UNIVERSAL_SALT = "your-super-secret-universal-salt-breachguard";

export class HashingService {
  private universalSalt: string;
  
  constructor() {
    this.universalSalt = UNIVERSAL_SALT;
  }
  
  // Generate full hash for user data
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
  
  // Generate partial hash for k-anonymity (first 8 characters) - only for sensitive data
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
        return value.replace(/\D/g, ''); // Remove non-digits
      case "firstName":
      case "lastName":
        return value.toLowerCase();
      case "ssn":
      case "creditCard":
      case "driverLicense":
        return value.replace(/\D/g, ''); // Remove non-digits
      default:
        return value.toLowerCase();
    }
  }
}
