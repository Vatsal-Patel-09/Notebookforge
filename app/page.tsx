"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Download, Loader2, Settings, Sparkles, Zap, Shield, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AnalyticsDisplay } from "@/components/analytics-display"

type ContentType = "custom" | "page_number" | "date" | "time" | "datetime" | "filename" | "title" | "empty"
type PageNumberFormat = "brackets" | "page_word" | "fraction" | "roman" | "plain"

interface HeaderFooterField {
  type: ContentType
  customText: string
  pageFormat?: PageNumberFormat
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [labInfo, setLabInfo] = useState({
    labTitle: "Jupyter to word converter",
    // Header fields with your custom defaults
    headerLeft: {
      type: "custom" as ContentType,
      customText: "course code",
      pageFormat: "brackets" as PageNumberFormat,
    },
    headerCenter: { type: "datetime" as ContentType, customText: "", pageFormat: "brackets" as PageNumberFormat },
    headerRight: {
      type: "custom" as ContentType,
      customText: "course name",
      pageFormat: "brackets" as PageNumberFormat,
    },
    // Footer fields with your custom defaults
    footerLeft: {
      type: "custom" as ContentType,
      customText: "made by vatsal",
      pageFormat: "brackets" as PageNumberFormat,
    },
    footerCenter: { type: "page_number" as ContentType, customText: "", pageFormat: "plain" as PageNumberFormat },
    footerRight: { type: "custom" as ContentType, customText: "230023", pageFormat: "brackets" as PageNumberFormat },
  })
  const { toast } = useToast()

  const contentTypeOptions = [
    { value: "custom", label: "Custom Text" },
    { value: "page_number", label: "Page Number" },
    { value: "date", label: "Current Date" },
    { value: "time", label: "Current Time" },
    { value: "datetime", label: "Date & Time" },
    { value: "filename", label: "File Name" },
    { value: "title", label: "Document Title" },
    { value: "empty", label: "Empty" },
  ]

  const pageNumberFormats = [
    { value: "brackets", label: "[1]", example: "[1]" },
    { value: "page_word", label: "Page 1", example: "Page 1" },
    { value: "fraction", label: "1/10", example: "1/10" },
    { value: "roman", label: "i", example: "i" },
    { value: "plain", label: "1", example: "1" },
  ]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.name.endsWith(".ipynb")) {
      setFile(selectedFile)
      setDownloadUrl(null)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a .ipynb file",
        variant: "destructive",
      })
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith(".ipynb")) {
      setFile(droppedFile)
      setDownloadUrl(null)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a .ipynb file",
        variant: "destructive",
      })
    }
  }

  const updateHeaderFooterField = (
    section: "headerLeft" | "headerCenter" | "headerRight" | "footerLeft" | "footerCenter" | "footerRight",
    updates: Partial<HeaderFooterField>,
  ) => {
    setLabInfo((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }))
  }

  const getPreviewText = (field: HeaderFooterField, filename?: string): string => {
    switch (field.type) {
      case "custom":
        return field.customText || "Custom Text"
      case "page_number":
        switch (field.pageFormat) {
          case "brackets":
            return "[1]"
          case "page_word":
            return "Page 1"
          case "fraction":
            return "1/10"
          case "roman":
            return "i"
          case "plain":
            return "1"
          default:
            return "[1]"
        }
      case "date":
        return new Date().toLocaleDateString()
      case "time":
        return new Date().toLocaleTimeString()
      case "datetime":
        return new Date().toLocaleString()
      case "filename":
        return filename ? filename.replace(".ipynb", "") : "notebook"
      case "title":
        return labInfo.labTitle || "Document Title"
      case "empty":
        return ""
      default:
        return ""
    }
  }

  const convertToWord = async () => {
    if (!file) return

    setIsConverting(true)

    const timeoutId = setTimeout(() => {
      setIsConverting(false)
      toast({
        title: "Conversion timeout",
        description: "The conversion is taking too long. Please try with a smaller file.",
        variant: "destructive",
      })
    }, 30000)

    try {
      const formData = new FormData()
      formData.append("notebook", file)
      formData.append("labInfo", JSON.stringify(labInfo))

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Conversion failed: ${errorText}`)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)

      toast({
        title: "Conversion successful!",
        description: "Your Word document is ready for download",
      })
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("Conversion error:", error)
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const downloadFile = () => {
    if (downloadUrl && file) {
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = file.name.replace(".ipynb", ".docx")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const renderFieldControls = (
    field: HeaderFooterField,
    section: "headerLeft" | "headerCenter" | "headerRight" | "footerLeft" | "footerCenter" | "footerRight",
    label: string,
  ) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Select
        value={field.type}
        onValueChange={(value: ContentType) => updateHeaderFooterField(section, { type: value })}
      >
        <SelectTrigger className="h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {contentTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {field.type === "custom" && (
        <Input
          value={field.customText}
          onChange={(e) => updateHeaderFooterField(section, { customText: e.target.value })}
          placeholder="Enter custom text"
          className="h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      )}

      {field.type === "page_number" && (
        <Select
          value={field.pageFormat}
          onValueChange={(value: PageNumberFormat) => updateHeaderFooterField(section, { pageFormat: value })}
        >
          <SelectTrigger className="h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageNumberFormats.map((format) => (
              <SelectItem key={format.value} value={format.value} className="text-sm">
                <div className="flex justify-between items-center w-full">
                  <span>{format.label}</span>
                  <span className="text-gray-500 ml-2">({format.example})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* SEO-Optimized Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-poppins">
              Free{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Jupyter Notebook to Word
              </span>{" "}
              Converter
            </h1>
            <h2 className="text-xl sm:text-2xl text-gray-700 mb-4 font-medium">
              Convert .ipynb files to .docx documents instantly - No registration required!
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your Jupyter notebooks into professionally formatted Word documents with custom headers,
              footers, syntax highlighting, and beautiful styling. Perfect for data scientists, researchers, and
              students.
            </p>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Lightning Fast Conversion</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">100% Secure & Private</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Professional Quality</span>
              </div>
            </div>

            {/* Dynamic Analytics Display */}
            <AnalyticsDisplay />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* SEO Keywords Section */}
        <section className="mb-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
              The Ultimate Jupyter Notebook Converter
            </h3>
            <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Whether you need to convert <strong>ipynb to word</strong>, <strong>jupyter to docx</strong>, or transform
              your <strong>python notebooks</strong> into professional documents, NotebookForge is the fastest and most
              reliable <strong>online jupyter converter</strong>. Perfect for data science projects, academic research,
              and machine learning documentation.
            </p>
          </div>
        </section>

        {/* Document Settings */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-poppins">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              Document Settings
            </CardTitle>
            <CardDescription className="text-base">
              Customize your document title, header, and footer with advanced options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Lab Title */}
            <div className="space-y-3">
              <Label htmlFor="labTitle" className="text-base font-semibold text-gray-800">
                Document Title
              </Label>
              <Input
                id="labTitle"
                value={labInfo.labTitle}
                onChange={(e) => setLabInfo({ ...labInfo, labTitle: e.target.value })}
                placeholder="Jupyter to word converter"
                className="text-center font-medium h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Header Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                Header Configuration
              </Label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                {renderFieldControls(labInfo.headerLeft, "headerLeft", "Left")}
                {renderFieldControls(labInfo.headerCenter, "headerCenter", "Center")}
                {renderFieldControls(labInfo.headerRight, "headerRight", "Right")}
              </div>
            </div>

            {/* Footer Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                Footer Configuration
              </Label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                {renderFieldControls(labInfo.footerLeft, "footerLeft", "Left")}
                {renderFieldControls(labInfo.footerCenter, "footerCenter", "Center")}
                {renderFieldControls(labInfo.footerRight, "footerRight", "Right")}
              </div>
            </div>

            {/* Enhanced Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
              <Label className="text-base font-semibold text-gray-800 mb-4 block">Live Preview:</Label>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm bg-white p-4 rounded-lg border-t-4 border-blue-500 shadow-sm">
                  <span className="font-mono flex-1 text-left text-gray-700 mb-2 sm:mb-0">
                    {getPreviewText(labInfo.headerLeft, file?.name)}
                  </span>
                  <span className="font-mono flex-1 text-center text-gray-700 mb-2 sm:mb-0">
                    {getPreviewText(labInfo.headerCenter, file?.name)}
                  </span>
                  <span className="font-mono flex-1 text-right text-gray-700">
                    {getPreviewText(labInfo.headerRight, file?.name)}
                  </span>
                </div>
                <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                  <span className="font-bold text-xl text-gray-800 font-poppins">
                    {labInfo.labTitle || "Document Title"}
                  </span>
                  <div className="text-sm text-gray-500 mt-3">Document content will appear here...</div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm bg-white p-4 rounded-lg border-b-4 border-purple-500 shadow-sm">
                  <span className="font-mono flex-1 text-left text-gray-700 mb-2 sm:mb-0">
                    {getPreviewText(labInfo.footerLeft, file?.name)}
                  </span>
                  <span className="font-mono flex-1 text-center text-gray-700 mb-2 sm:mb-0">
                    {getPreviewText(labInfo.footerCenter, file?.name)}
                  </span>
                  <span className="font-mono flex-1 text-right text-gray-700">
                    {getPreviewText(labInfo.footerRight, file?.name)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <Label className="text-base font-semibold text-blue-800 mb-4 block">Quick Presets:</Label>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setLabInfo((prev) => ({
                      ...prev,
                      headerLeft: { type: "custom", customText: "Course Code", pageFormat: "brackets" },
                      headerCenter: { type: "date", customText: "", pageFormat: "brackets" },
                      headerRight: { type: "custom", customText: "Course Name", pageFormat: "brackets" },
                      footerLeft: { type: "custom", customText: "[Lab Assignment]", pageFormat: "brackets" },
                      footerCenter: { type: "page_number", customText: "", pageFormat: "page_word" },
                      footerRight: { type: "custom", customText: "[Student ID]", pageFormat: "brackets" },
                    }))
                  }
                  className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                >
                  Academic Format
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setLabInfo((prev) => ({
                      ...prev,
                      headerLeft: { type: "title", customText: "", pageFormat: "brackets" },
                      headerCenter: { type: "empty", customText: "", pageFormat: "brackets" },
                      headerRight: { type: "datetime", customText: "", pageFormat: "brackets" },
                      footerLeft: { type: "filename", customText: "", pageFormat: "brackets" },
                      footerCenter: { type: "page_number", customText: "", pageFormat: "fraction" },
                      footerRight: {
                        type: "custom",
                        customText: "Generated by NotebookForge",
                        pageFormat: "brackets",
                      },
                    }))
                  }
                  className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                >
                  Professional Format
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setLabInfo((prev) => ({
                      ...prev,
                      headerLeft: { type: "empty", customText: "", pageFormat: "brackets" },
                      headerCenter: { type: "title", customText: "", pageFormat: "brackets" },
                      headerRight: { type: "empty", customText: "", pageFormat: "brackets" },
                      footerLeft: { type: "empty", customText: "", pageFormat: "brackets" },
                      footerCenter: { type: "page_number", customText: "", pageFormat: "plain" },
                      footerRight: { type: "empty", customText: "", pageFormat: "brackets" },
                    }))
                  }
                  className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                >
                  Minimal Format
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-poppins">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                <Upload className="h-5 w-5 text-white" />
              </div>
              Upload Your Jupyter Notebook (.ipynb)
            </CardTitle>
            <CardDescription className="text-base">
              Select or drag and drop your .ipynb file to convert it to Word format instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600 mb-6 text-lg">Drag and drop your .ipynb file here, or click to browse</p>
              <input type="file" accept=".ipynb" onChange={handleFileChange} className="hidden" id="file-input" />
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 bg-transparent"
              >
                <label htmlFor="file-input" className="cursor-pointer">
                  Choose Jupyter Notebook File
                </label>
              </Button>
            </div>

            {file && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-800 font-semibold text-lg">{file.name}</p>
                    <p className="text-green-600">Size: {(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Convert Section */}
        {file && (
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-poppins">Convert to Word Document</CardTitle>
              <CardDescription className="text-base">
                Transform your Jupyter notebook into a professionally formatted Word document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={convertToWord}
                disabled={isConverting}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    Converting Jupyter Notebook...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-3" />
                    Convert .ipynb to .docx
                  </>
                )}
              </Button>
              {isConverting && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Processing your notebook with syntax highlighting and formatting...
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Download Section */}
        {downloadUrl && (
          <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700 text-xl sm:text-2xl font-poppins flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Download className="h-5 w-5 text-green-600" />
                </div>
                Conversion Complete!
              </CardTitle>
              <CardDescription className="text-green-600 text-base">
                Your Jupyter notebook has been successfully converted to Word format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={downloadFile}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-3" />
                Download Word Document (.docx)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* SEO Content Section */}
        <section className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center font-poppins">
            Why Choose NotebookForge for Jupyter to Word Conversion?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Perfect for Data Scientists & Researchers</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Convert Python notebooks with code syntax highlighting</li>
                <li>• Preserve markdown formatting and mathematical expressions</li>
                <li>• Professional document layout for academic submissions</li>
                <li>• Custom headers and footers for institutional requirements</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Advanced Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Support for all heading levels (# to ######)</li>
                <li>• Automatic code cell numbering</li>
                <li>• Output preservation with proper formatting</li>
                <li>• Multiple page numbering formats</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
