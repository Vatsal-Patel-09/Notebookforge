import { type NextRequest, NextResponse } from "next/server"
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  ImageRun,
} from "docx"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notebook_content, filename, lab_info } = body

    if (!notebook_content) {
      return NextResponse.json({ error: "No notebook content provided" }, { status: 400 })
    }

    const notebook = JSON.parse(notebook_content)
    const sections = []

    // Use lab info or defaults
    const labTitle = lab_info?.labTitle || "Jupyter to word converter"

    // Main title section
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: labTitle,
            bold: true,
            size: 28,
            font: "Calibri",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 300 },
      }),
    )

    let codeExecutionNumber = 1

    // Process cells
    for (let i = 0; i < notebook.cells.length; i++) {
      const cell = notebook.cells[i]

      if (cell.cell_type === "markdown") {
        processMarkdownCell(cell, sections)
      } else if (cell.cell_type === "code") {
        processCodeCell(cell, sections, codeExecutionNumber)
        const cellSource = Array.isArray(cell.source) ? cell.source.join("") : cell.source
        if (cellSource && String(cellSource).trim()) {
          codeExecutionNumber++
        }
      }
    }

    // Helper function to generate content based on field type
    const generateFieldContent = (field: any, filename: string, labTitle: string): (TextRun | PageNumber)[] => {
      if (!field || !field.type) return [new TextRun({ text: "", font: "Calibri", size: 22 })]

      switch (field.type) {
        case "custom":
          return [new TextRun({ text: field.customText || "", font: "Calibri", size: 22 })]

        case "page_number":
          const pageFormat = field.pageFormat || "brackets"
          switch (pageFormat) {
            case "brackets":
              return [
                new TextRun({ text: "[", font: "Calibri", size: 20 }),
                PageNumber.CURRENT,
                new TextRun({ text: "]", font: "Calibri", size: 20 }),
              ]
            case "page_word":
              return [new TextRun({ text: "Page ", font: "Calibri", size: 20 }), PageNumber.CURRENT]
            case "fraction":
              return [PageNumber.CURRENT, new TextRun({ text: "/", font: "Calibri", size: 20 }), PageNumber.TOTAL_PAGES]
            case "roman":
              return [
                new PageNumber({
                  format: PageNumberFormat.LOWER_ROMAN,
                }),
              ]
            case "plain":
              return [PageNumber.CURRENT]
            default:
              return [PageNumber.CURRENT]
          }

        case "date":
          return [new TextRun({ text: new Date().toLocaleDateString(), font: "Calibri", size: 22 })]

        case "time":
          return [new TextRun({ text: new Date().toLocaleTimeString(), font: "Calibri", size: 22 })]

        case "datetime":
          return [new TextRun({ text: new Date().toLocaleString(), font: "Calibri", size: 22 })]

        case "filename":
          return [new TextRun({ text: filename.replace(".ipynb", ""), font: "Calibri", size: 22 })]

        case "title":
          return [new TextRun({ text: labTitle, font: "Calibri", size: 22 })]

        case "empty":
        default:
          return [new TextRun({ text: "", font: "Calibri", size: 22 })]
      }
    }

    // Create 3-column header
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: generateFieldContent(lab_info?.headerLeft, filename, labTitle),
                  alignment: AlignmentType.LEFT,
                }),
              ],
              width: { size: 33.33, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: generateFieldContent(lab_info?.headerCenter, filename, labTitle),
                  alignment: AlignmentType.CENTER,
                }),
              ],
              width: { size: 33.33, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: generateFieldContent(lab_info?.headerRight, filename, labTitle),
                  alignment: AlignmentType.RIGHT,
                }),
              ],
              width: { size: 33.33, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
    })

    // Create 3-column footer
    const footerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: generateFieldContent(lab_info?.footerLeft, filename, labTitle),
                  alignment: AlignmentType.LEFT,
                }),
              ],
              width: { size: 33.33, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: generateFieldContent(lab_info?.footerCenter, filename, labTitle),
                  alignment: AlignmentType.CENTER,
                }),
              ],
              width: { size: 33.33, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: generateFieldContent(lab_info?.footerRight, filename, labTitle),
                  alignment: AlignmentType.RIGHT,
                }),
              ],
              width: { size: 33.33, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
    })

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          headers: {
            default: new Header({
              children: [headerTable],
            }),
          },
          footers: {
            default: new Footer({
              children: [footerTable],
            }),
          },
          children: sections,
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    const base64 = buffer.toString("base64")

    return NextResponse.json({
      document: base64,
      filename: filename.replace(".ipynb", ".docx"),
    })
  } catch (error) {
    console.error("Conversion error:", error)
    return NextResponse.json(
      { error: `Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}

function processMarkdownCell(cell: any, sections: any[]) {
  if (!cell.source) return

  const content = Array.isArray(cell.source) ? cell.source.join("") : cell.source
  const lines = content.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      sections.push(new Paragraph({ text: "", spacing: { after: 120 } }))
      continue
    }

    if (trimmedLine.startsWith("### ")) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine.substring(4).trim(),
              bold: true,
              size: 28,
              font: "Calibri",
            }),
          ],
          spacing: { before: 200, after: 150 },
        }),
      )
    } else if (trimmedLine.startsWith("## ")) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine.substring(3).trim(),
              bold: true,
              size: 32,
              font: "Calibri",
            }),
          ],
          spacing: { before: 250, after: 200 },
        }),
      )
    } else if (trimmedLine.startsWith("# ")) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine.substring(2).trim(),
              bold: true,
              size: 36,
              font: "Calibri",
            }),
          ],
          spacing: { before: 300, after: 200 },
        }),
      )
    } else if (trimmedLine.startsWith("- ")) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${trimmedLine.substring(2).trim()}`,
              size: 22,
              font: "Calibri",
            }),
          ],
          indent: { left: 360 },
          spacing: { before: 120, after: 120 },
        }),
      )
    } else if (/^\d+\.\s/.test(trimmedLine)) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              bold: true,
              size: 30,
              font: "Calibri",
            }),
          ],
          spacing: { before: 300, after: 200 },
        }),
      )
    } else {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              size: 22,
              font: "Calibri",
            }),
          ],
          spacing: { before: 100, after: 100 },
        }),
      )
    }
  }
}

function processCodeCell(cell: any, sections: any[], executionNumber: number) {
  if (!cell.source) return

  const code = Array.isArray(cell.source) ? cell.source.join("") : cell.source
  const codeText = typeof code === "string" ? code : String(code)

  if (!codeText.trim()) return

  const codeTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `In [${executionNumber}]: `,
                    font: "Consolas",
                    size: 20,
                    color: "666666",
                  }),
                ],
                spacing: { before: 100, after: 50 },
              }),
              ...createSyntaxHighlightedCode(codeText),
            ],
            shading: { fill: "FAFAFA" },
          }),
        ],
      }),
    ],
  })

  sections.push(codeTable)
  sections.push(new Paragraph({ text: "", spacing: { after: 100 } }))

  if (cell.outputs && cell.outputs.length > 0) {
    cell.outputs.forEach((output: any) => {
      if (output.output_type === "stream" && output.text) {
        const text = Array.isArray(output.text) ? output.text.join("") : output.text
        const outputText = String(text).trim()
        const outputLines = outputText.split("\n")

        outputLines.forEach((line, lineIndex) => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line || " ",
                  font: "Consolas",
                  size: 20,
                  color: "000000",
                }),
              ],
              spacing: {
                before: lineIndex === 0 ? 100 : 0,
                after: lineIndex === outputLines.length - 1 ? 200 : 0,
              },
            }),
          )
        })
      } else if (
        (output.output_type === "execute_result" || output.output_type === "display_data") &&
        output.data
      ) {
        // Handle image outputs first
        if (output.data["image/png"]) {
          try {
            const base64Data = output.data["image/png"]
            const imageBuffer = Buffer.from(base64Data, 'base64')
            
            sections.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    type: "png",
                    data: imageBuffer,
                    transformation: {
                      width: 400,
                      height: 300,
                    },
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            )
          } catch (error) {
            console.error("Failed to process PNG image:", error)
            // Fallback to text representation
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "[Image: PNG plot/figure]",
                    font: "Calibri",
                    size: 20,
                    color: "666666",
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
              }),
            )
          }
        } else if (output.data["image/jpeg"]) {
          try {
            const base64Data = output.data["image/jpeg"]
            const imageBuffer = Buffer.from(base64Data, 'base64')
            
            sections.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    type: "jpg",
                    data: imageBuffer,
                    transformation: {
                      width: 400,
                      height: 300,
                    },
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            )
          } catch (error) {
            console.error("Failed to process JPEG image:", error)
            // Fallback to text representation
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "[Image: JPEG plot/figure]",
                    font: "Calibri",
                    size: 20,
                    color: "666666",
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
              }),
            )
          }
        } else if (output.data["image/svg+xml"]) {
          // SVG images can't be directly embedded in docx, so show a placeholder
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[Image: SVG plot/figure - SVG format not supported in Word documents]",
                  font: "Calibri",
                  size: 20,
                  color: "666666",
                  italics: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 100, after: 100 },
            }),
          )
        } else if (output.data["text/plain"]) {
          // Handle text/plain outputs as before
          const text = Array.isArray(output.data["text/plain"])
            ? output.data["text/plain"].join("")
            : output.data["text/plain"]

          const outputText = String(text).trim()
          const cleanOutput = cleanArrayOutput(outputText)
          const outputLines = cleanOutput.split("\n")

          outputLines.forEach((line, lineIndex) => {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line.trim() || " ",
                    font: "Consolas",
                    size: 20,
                    color: "000000",
                  }),
                ],
                spacing: {
                  before: lineIndex === 0 ? 100 : 0,
                  after: lineIndex === outputLines.length - 1 ? 200 : 0,
                },
              }),
            )
          })
        }
      }
    })
  }
}

function createSyntaxHighlightedCode(code: string): Paragraph[] {
  const codeString = typeof code === "string" ? code : String(code)
  const lines = codeString.split("\n")
  const paragraphs: Paragraph[] = []

  lines.forEach((line) => {
    const runs: TextRun[] = []

    if (line.trim().startsWith("#")) {
      runs.push(
        new TextRun({
          text: line,
          font: "Consolas",
          size: 20,
          color: "008000",
        }),
      )
    } else if (line.includes("print(")) {
      const printIndex = line.indexOf("print(")
      const beforePrint = line.substring(0, printIndex)
      const printPart = "print"
      const afterPrint = line.substring(printIndex + 5)

      if (beforePrint) {
        runs.push(
          new TextRun({
            text: beforePrint,
            font: "Consolas",
            size: 20,
            color: "000000",
          }),
        )
      }

      runs.push(
        new TextRun({
          text: printPart,
          font: "Consolas",
          size: 20,
          color: "800080",
        }),
      )

      runs.push(
        new TextRun({
          text: afterPrint,
          font: "Consolas",
          size: 20,
          color: "000000",
        }),
      )
    } else if (line.includes("import ")) {
      runs.push(
        new TextRun({
          text: line.replace("import", ""),
          font: "Consolas",
          size: 20,
          color: "000000",
        }),
      )
      runs.unshift(
        new TextRun({
          text: "import",
          font: "Consolas",
          size: 20,
          color: "0000FF",
        }),
      )
    } else {
      runs.push(
        new TextRun({
          text: line,
          font: "Consolas",
          size: 20,
          color: "000000",
        }),
      )
    }

    paragraphs.push(
      new Paragraph({
        children: runs,
        spacing: { before: 0, after: 0 },
      }),
    )
  })

  return paragraphs
}

function cleanArrayOutput(text: string): string {
  let cleaned = text.trim()

  if (cleaned.startsWith("array(")) {
    const match = cleaned.match(/array$$\[(.*?)\](?:,\s*dtype=.*?)?$$/)
    if (match) {
      const arrayContent = match[1]
      if (arrayContent.includes("\n")) {
        cleaned = `[${arrayContent}]`
      } else {
        cleaned = `[${arrayContent.replace(/\s+/g, " ")}]`
      }
    }
  }

  return cleaned
}
