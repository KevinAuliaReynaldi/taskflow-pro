/**
 * Komponen Footer yang menampilkan informasi hak cipta, tautan kebijakan, dan kredit pengembang.
 * 
 * @returns Elemen JSX Footer
 */
export default function Footer() {
    const currentYear = new Date().getFullYear()
  
    return (
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  TaskFlow<span className="text-blue-600 dark:text-blue-400">Pro</span>
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Modern task management made simple by Kevin Aulia Reynaldi
              </p>
            </div>
  
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Contact
              </a>
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
  
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} TaskFlow Pro. All rights reserved.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    )
  }