import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Code, Download, Sparkles, Zap, Shield, Palette, CheckCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About NotebookForge - Best Jupyter to Word Converter | Features & Benefits",
  description:
    "Learn about NotebookForge's powerful features for converting Jupyter notebooks to Word documents. Free, secure, and professional formatting with custom headers and footers.",
  keywords: [
    "jupyter notebook converter features",
    "ipynb to word converter about",
    "notebook conversion tool",
    "jupyter to docx features",
    "data science document converter",
    "python notebook to word",
  ].join(", "),
  alternates: {
    canonical: "https://notebookforge.com/about",
  },
}

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NotebookForge
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The most advanced and user-friendly Jupyter notebook to Word converter available online
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="text-center pb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-poppins">Markdown Cells</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 leading-relaxed">
                Converts markdown cells to formatted text with headers, bold, and italic styling preserved perfectly.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="text-center pb-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Code className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-poppins">Code Cells</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 leading-relaxed">
                Preserves code formatting with syntax highlighting and includes both input code and text outputs.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group md:col-span-2 lg:col-span-1">
            <CardHeader className="text-center pb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Download className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-poppins">Word Export</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 leading-relaxed">
                Generates professionally formatted Word documents (.docx) compatible with Microsoft Word and similar
                applications.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-poppins">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                Current Features
              </CardTitle>
              <CardDescription className="text-base">What's supported in this version</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Markdown cell conversion with advanced formatting",
                  "Support for all heading levels (# to ######)",
                  "Code cell preservation with syntax highlighting",
                  "Text and execution output display",
                  "Error output with distinctive red formatting",
                  "Automatic cell numbering system",
                  "Custom headers and footers",
                  "Multiple page number formats",
                  "Professional document structure",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-poppins">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                Planned Features
              </CardTitle>
              <CardDescription className="text-base">Coming in future versions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Image and plot output support",
                  "LaTeX equation rendering",
                  "Advanced markdown formatting (tables, links)",
                  "Multiple export formats (PDF, HTML)",
                  "Batch conversion capabilities",
                  "Custom styling themes",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="h-5 w-5 border-2 border-blue-300 rounded-full mt-0.5 flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose NotebookForge */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4 font-poppins">
              Why Choose NotebookForge?
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Built with modern technology and user experience in mind
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">Lightning Fast</h3>
                <p className="text-gray-600">
                  Optimized conversion engine processes your notebooks in seconds, not minutes.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">Secure & Private</h3>
                <p className="text-gray-600">Your files are processed securely and never stored on our servers.</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">Fully Customizable</h3>
                <p className="text-gray-600">Complete control over headers, footers, and document formatting.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Content */}
        <section className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">
            The Best Jupyter Notebook to Word Converter Online
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              NotebookForge stands out as the premier <strong>jupyter to word converter</strong> available online.
              Whether you're a data scientist, researcher, or student, our tool provides the most comprehensive solution
              for converting <strong>ipynb files to docx format</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike other converters, NotebookForge preserves the integrity of your <strong>python notebooks</strong>
              while adding professional formatting that's perfect for academic submissions, research papers, and
              business presentations. Our advanced <strong>jupyter notebook converter</strong> handles complex markdown
              structures, code syntax highlighting, and output formatting with precision.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Experience the difference with NotebookForge - the fastest, most reliable, and feature-rich
              <strong> online jupyter converter</strong> trusted by thousands of users worldwide.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
