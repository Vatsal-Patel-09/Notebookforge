import { Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Get in Touch Section */}
        <div className="text-center mb-8">
          <div className="bg-slate-800 rounded-lg p-4 max-w-sm mx-auto">
            <h4 className="text-sm font-medium text-white mb-2">Get in Touch</h4>
            <p className="text-xs text-gray-400 mb-3">Have questions or suggestions? Feel free to reach out!</p>
            <a
              href="mailto:vatsalpatel952005@gmail.com"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
            >
              vatsalpatel952005@gmail.com
            </a>
          </div>
        </div>

        {/* Copyright and Social Icons */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-700 pt-6 gap-4">
          <p className="text-sm text-gray-400">
            © 2025 NotebookForge. All rights reserved. • Made with ❤️ by Vatsal Patel
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            <a
              href="https://github.com/Vatsal-Patel-09"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4 text-white" />
            </a>
            <a
              href="https://www.linkedin.com/in/vatsalpatel09"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4 text-white" />
            </a>
            <a
              href="mailto:vatsalpatel952005@gmail.com"
              className="bg-red-600 hover:bg-red-500 p-2 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Email Contact"
            >
              <Mail className="h-4 w-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
