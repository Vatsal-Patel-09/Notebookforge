import { type NextRequest, NextResponse } from "next/server"

// Shared analytics - in production this would be in a database
let filesConvertedCount = 0

export async function POST(request: NextRequest) {
  try {
    // Increment file conversion count
    filesConvertedCount += 1
    const timestamp = new Date().toISOString()

    console.log(`File conversion tracked! Total conversions: ${filesConvertedCount}`)

    return NextResponse.json({
      success: true,
      filesConverted: filesConvertedCount,
      timestamp: timestamp,
    })
  } catch (error) {
    console.error("Error tracking conversion:", error)
    return NextResponse.json({ error: "Failed to track conversion" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    filesConverted: filesConvertedCount,
    timestamp: new Date().toISOString(),
  })
}
