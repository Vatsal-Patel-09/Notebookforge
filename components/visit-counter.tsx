"use client"

import { useState, useEffect } from "react"
import { Eye } from "lucide-react"

export function VisitCounter() {
  const [visits, setVisits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Track visit and get count - this will increment on every page load/refresh
    const trackVisit = async () => {
      try {
        const response = await fetch("/api/track-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setVisits(data.totalVisits)
          console.log("Visit tracked! Total visits:", data.totalVisits)
        }
      } catch (error) {
        console.error("Failed to track visit:", error)
        // Fallback to localStorage for basic counting
        const localVisits = localStorage.getItem("notebookforge-visits")
        const currentCount = localVisits ? Number.parseInt(localVisits) + 1 : 1
        localStorage.setItem("notebookforge-visits", currentCount.toString())
        setVisits(currentCount)
      } finally {
        setLoading(false)
      }
    }

    trackVisit()

    // Update count every 15 seconds to show real-time changes from other users
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/track-visit", {
          method: "GET",
        })
        if (response.ok) {
          const data = await response.json()
          setVisits(data.totalVisits)
        }
      } catch (error) {
        console.error("Failed to fetch updated count:", error)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Eye className="h-4 w-4 animate-pulse" />
        <span className="hidden sm:inline">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
      <Eye className="h-4 w-4 text-blue-600" />
      <span className="font-medium">
        {visits.toLocaleString()}
        <span className="hidden sm:inline ml-1">visitors</span>
      </span>
    </div>
  )
}
