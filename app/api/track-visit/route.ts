import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage (resets on server restart)
// In production, use a database like PostgreSQL, Redis, or MongoDB
interface Analytics {
  totalVisits: number
  filesConverted: number
  lastUpdated: string
}

// Start with realistic numbers for a new app
const analytics: Analytics = {
  totalVisits: 0,
  filesConverted: 0,
  lastUpdated: new Date().toISOString(),
}

export async function POST(request: NextRequest) {
  try {
    // Always increment visit count on every request (no IP filtering)
    analytics.totalVisits += 1
    analytics.lastUpdated = new Date().toISOString()

    console.log(`Page visit tracked! Total visits: ${analytics.totalVisits}`)

    return NextResponse.json({
      success: true,
      totalVisits: analytics.totalVisits,
      filesConverted: analytics.filesConverted,
      timestamp: analytics.lastUpdated,
      isNewVisit: true,
    })
  } catch (error) {
    console.error("Error tracking visit:", error)
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    totalVisits: analytics.totalVisits,
    filesConverted: analytics.filesConverted,
    timestamp: analytics.lastUpdated,
  })
}

// Function to increment file conversion count
export function incrementFileConversion() {
  analytics.filesConverted += 1
  analytics.lastUpdated = new Date().toISOString()
  console.log(`File conversion tracked! Total conversions: ${analytics.filesConverted}`)
  return analytics.filesConverted
}
