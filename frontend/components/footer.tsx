import Link from "next/link"
import { Mail, Shield, Database, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 dark:bg-red-500 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">BreachGuard</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500">
              Protecting your digital identity through comprehensive breach monitoring and privacy-focused security
              research.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Breach Search
                </Link>
              </li>
              <li>
                <Link
                  href="/statistics"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                >
                  Breach Statistics
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  API Access
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Monitoring Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Security Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Security Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400 dark:text-gray-500">
                <Mail className="h-4 w-4" />
                <span>security@breachguard.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 dark:text-gray-500">
                <Database className="h-4 w-4" />
                <span>API Support</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 dark:text-gray-500">
                <Github className="h-4 w-4" />
                <span>Open Source</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500">&copy; 2024 BreachGuard. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-400 dark:text-gray-500">Responsible Disclosure</span>
              <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
              <span className="text-sm text-gray-400 dark:text-gray-500">Security Research</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
