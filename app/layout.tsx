import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Info } from "lucide-react"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "NotebookForge - #1 Free Jupyter Notebook to Word Converter | Convert .ipynb to .docx Online",
  description:
    "Convert Jupyter notebooks (.ipynb) to Word documents (.docx) instantly. Free online converter with custom headers, footers, and professional formatting. No registration required!",
  keywords: [
    "jupyter to word converter",
    "ipynb to word converter",
    "jupyter notebook to docx",
    "convert ipynb to word",
    "notebook to word converter",
    "jupyter to docx converter",
    "free jupyter converter",
    "online ipynb converter",
    "jupyter notebook converter",
    "python notebook to word",
    "data science notebook converter",
    "jupyter lab to word",
    "convert notebook to document",
    "ipynb file converter",
    "jupyter export word",
  ].join(", "),
  authors: [{ name: "NotebookForge Team" }],
  creator: "NotebookForge",
  publisher: "NotebookForge",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NotebookForge",
    title: "NotebookForge - Free Jupyter Notebook to Word Converter",
    description:
      "Convert Jupyter notebooks to Word documents instantly. Free, secure, and professional formatting with custom headers and footers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NotebookForge - Jupyter to Word Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NotebookForge - Free Jupyter Notebook to Word Converter",
    description: "Convert Jupyter notebooks to Word documents instantly. Free, secure, and professional formatting.",
    images: ["/og-image.png"],
    creator: "@notebookforge",
  },
  alternates: {
    canonical: "https://notebookforge.com",
  },
  category: "Technology",
  classification: "Converter Tool",
  other: {
    "google-site-verification": "your-google-verification-code",
  },
    generator: 'v0.dev'
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NotebookForge",
  description:
    "Free online converter that transforms Jupyter notebooks (.ipynb) into professionally formatted Word documents (.docx)",
  url: "https://notebookforge.com",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert .ipynb to .docx",
    "Custom headers and footers",
    "Syntax highlighting",
    "Professional formatting",
    "No registration required",
    "Secure and private",
  ],
  creator: {
    "@type": "Organization",
    name: "NotebookForge",
  },
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString(),
  inLanguage: "en-US",
  isAccessibleForFree: true,
  browserRequirements: "Requires JavaScript. Requires HTML5.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="canonical" href="https://notebookforge.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} ${poppins.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-poppins">
                      NotebookForge
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block">Jupyter to Word Converter</p>
                  </div>
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-blue-600">
                    <Link href="/" className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Convert</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-blue-600">
                    <Link href="/about" className="flex items-center space-x-2">
                      <Info className="h-4 w-4" />
                      <span className="hidden sm:inline">About</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
