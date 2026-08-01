import fs from "fs"
import { getFrontendImg } from '../../utils/public.utils.js'

const drawLetterhead = (doc, data) => {
  const left = doc.page.margins.left
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right
  let yPosition = doc.page.margins.top
  const gap = 4;
  const logoHeight = 42;
  const logoTextGap = 10;

  const { exteriorNumber, street, postalCode, city, state } = data?.user?.address || {}
  const companyName = data.user?.company?.socialReason || ""
  const companyRfc = data.user?.company?.rfc || ""
  const addressL1 = `${street || ""} ${exteriorNumber || ""}`.trim()
  const addressL2 = `${postalCode || ""} ${city || ""} ${state || ""}`.trim()
  const textLines = [companyName, companyRfc, addressL1, addressL2].filter(Boolean).join('\n')
  const logoPath = data.user?.letterhead ? getFrontendImg(data.user.letterhead) : null
  const logoImage = logoPath && fs.existsSync(logoPath) ? doc.openImage(logoPath) : null
  const estimatedTextHeight = doc.heightOfString(textLines, { width: width })
  const logoHeight = logoImage ? Math.max(42, estimatedTextHeight) : 0
  const logoWidth = logoImage ? (logoImage.width * logoHeight) / logoImage.height : 0

  if (logoPath && logoImage) {
    doc.image(logoPath, left, yPosition, { height: logoHeight })
  }

  const textX = logoImage ? left + logoWidth + logoTextGap : left
  const textWidth = logoImage ? width - logoWidth - logoTextGap : width
  const textHeight = doc.heightOfString(textLines, { width: textWidth })

  doc.text(textLines, textX, yPosition, { width: textWidth, align: 'left' })
  yPosition += Math.max(logoHeight, textHeight) + gap;

  
  doc.moveDown(1.5)
}

export default drawLetterhead