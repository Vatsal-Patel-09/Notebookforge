"use client"

import { Clock } from "lucide-react"

export function AnalyticsDisplay() {
  return (
    <div className="flex items-center justify-center text-sm text-gray-600 mb-8">
      <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
        <Clock className="h-4 w-4 text-purple-600" />
        <span className="font-medium">
          Average: <span className="text-purple-700 font-bold">3 seconds</span>
        </span>
      </div>
    </div>
  )
}
