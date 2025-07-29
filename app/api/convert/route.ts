import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("notebook") as File
    const labInfoString = formData.get("labInfo") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.name.endsWith(".ipynb")) {
      return NextResponse.json({ error: "File must be a .ipynb notebook" }, { status: 400 })
    }

    // Parse lab info if provided
    let labInfo = null
    if (labInfoString) {
      try {
        labInfo = JSON.parse(labInfoString)
      } catch (e) {
        console.warn("Could not parse lab info:", e)
      }
    }

    // Read the notebook content
    const notebookContent = await file.text()

    // Validate JSON
    try {
      JSON.parse(notebookContent)
    } catch (e) {
      return NextResponse.json({ error: "Invalid notebook file format" }, { status: 400 })
    }

    // Call the python-convert-simple endpoint directly
    const response = await fetch(`${request.nextUrl.origin}/api/python-convert-simple`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notebook_content: notebookContent,
        filename: file.name,
        lab_info: labInfo,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Python conversion failed:", errorText)
      throw new Error(`Python conversion failed: ${errorText}`)
    }

    const result = await response.json()

    // Track successful conversion ONLY after successful conversion
    try {
      const conversionResponse = await fetch(`${request.nextUrl.origin}/api/track-conversion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (conversionResponse.ok) {
        const conversionData = await conversionResponse.json()
        console.log("Conversion tracked! Total conversions:", conversionData.filesConverted)
      }
    } catch (error) {
      console.error("Failed to track conversion:", error)
      // Don't fail the conversion if tracking fails
    }

    // Return the Word document
    const wordBuffer = Buffer.from(result.document, "base64")

    return new NextResponse(wordBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${file.name.replace(".ipynb", ".docx")}"`,
        "Content-Length": wordBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Conversion error:", error)
    return NextResponse.json(
      {
        error: "Conversion failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
