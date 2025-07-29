import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Sample notebook for testing
    const sampleNotebook = {
      cells: [
        {
          cell_type: "markdown",
          source:
            "# Numpy Exercises\n\n## 1.Basic Array Creation & Manipulation\n\n- Create a 1D array of numbers from 1 to 20.\n- Create a 3×4 matrix of ones and reshape it to 4×3.\n- Create a 5×5 identity matrix.\n- Generate 15 equally spaced numbers between 5 and 50.\n- Generate a 4×4 matrix of random integers between 1 and 100.",
        },
        {
          cell_type: "code",
          source: "import numpy as np",
          outputs: [],
        },
        {
          cell_type: "code",
          source: "#Create a 1D array of numbers from 1 to 20.\narr = np.arange(1,21)\nprint(arr)",
          outputs: [
            {
              output_type: "stream",
              text: "[ 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20]\n",
            },
          ],
        },
        {
          cell_type: "code",
          source:
            "#Create a 3×4 matrix of ones and reshape it to 4×3.\narr = np.ones((3,4))\nprint(arr)\narr = arr.reshape(4,3)\nprint(arr)",
          outputs: [
            {
              output_type: "stream",
              text: "[[1. 1. 1. 1.]\n [1. 1. 1. 1.]\n [1. 1. 1. 1.]]\n[[1. 1. 1.]\n [1. 1. 1.]\n [1. 1. 1.]\n [1. 1. 1.]]\n",
            },
          ],
        },
      ],
    }

    // Convert using our conversion logic
    const response = await fetch(`${request.nextUrl.origin}/api/python-convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notebook_content: JSON.stringify(sampleNotebook),
        filename: "test-notebook.ipynb",
      }),
    })

    if (!response.ok) {
      throw new Error("Conversion failed")
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
