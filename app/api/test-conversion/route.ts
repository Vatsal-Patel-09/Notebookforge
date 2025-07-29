import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Simple test data
    const testLabInfo = {
      labTitle: "Test Document",
      headerLeft: { type: "custom", customText: "Test Header Left", pageFormat: "brackets" },
      headerCenter: { type: "date", customText: "", pageFormat: "brackets" },
      headerRight: { type: "custom", customText: "Test Header Right", pageFormat: "brackets" },
      footerLeft: { type: "custom", customText: "Test Footer Left", pageFormat: "brackets" },
      footerCenter: { type: "page_number", customText: "", pageFormat: "brackets" },
      footerRight: { type: "custom", customText: "Test Footer Right", pageFormat: "brackets" },
    }

    const testNotebook = {
      cells: [
        {
          cell_type: "markdown",
          source: "# Test Notebook\n\nThis is a test markdown cell.",
        },
        {
          cell_type: "code",
          source: "print('Hello, World!')",
          outputs: [
            {
              output_type: "stream",
              text: "Hello, World!\n",
            },
          ],
        },
      ],
    }

    // Test the conversion
    const response = await fetch(`${request.nextUrl.origin}/api/python-convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notebook_content: JSON.stringify(testNotebook),
        filename: "test.ipynb",
        lab_info: testLabInfo,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Conversion failed: ${errorText}`)
    }

    const result = await response.json()
    const wordBuffer = Buffer.from(result.document, "base64")

    return new NextResponse(wordBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=test-conversion.docx",
      },
    })
  } catch (error) {
    console.error("Test conversion error:", error)
    return NextResponse.json(
      { error: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
