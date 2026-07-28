import fs from "fs"
import { getFrontendImg } from '../../utils/public.utils.js'

const drawLetterhead = (doc, data) => {
  const left = doc.page.margins.left
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right
  let yPosition = doc.page.margins.top
  const gap = 2;

  const { exteriorNumber, street, postalCode, city, state } = data?.user?.address || {}

  if (data.user?.letterhead && fs.existsSync(getFrontendImg(data.user?.letterhead))) {
    doc.image(getFrontendImg(data.user?.letterhead), left, yPosition, { height: 25 })
    yPosition += 25 + gap; // Adjust yPosition after the image
  }

  doc.text(data.user?.company?.socialReason || "", left, yPosition, { width, align: 'left' })
  yPosition += doc.currentLineHeight() + gap;

  doc.text(data.user?.company?.rfc || "", left, yPosition, { width, align: 'left' })
  yPosition += doc.currentLineHeight() + gap;

  doc.text(`${street || ""} ${exteriorNumber || ""}`, left, yPosition, { width, align: 'left' })
  yPosition += doc.currentLineHeight() + gap;

  doc.text(`${postalCode || ""} ${city || ""} ${state || ""}`, left, yPosition, { width, align: 'left' })
  yPosition += doc.currentLineHeight() + gap;

  
  doc.moveDown(1.5)
}

export default drawLetterhead