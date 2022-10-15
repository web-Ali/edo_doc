import { PDFDocument, rgb } from "pdf-lib";
import { User } from '../../../types/types';
import fontkit from "@pdf-lib/fontkit";

async function genDocument1(values: {regdate: string, regnum: string, regtext: string, dutyface: string}, info: User) {
  const url = '/nimbus-roman.otf'
  const nimbusRomanBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const nimbusRomanFont = await pdfDoc.embedFont(nimbusRomanBytes)

  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const fontSize = 14

  const textAdrees =`Ректору ГГНТУ
Минцаеву М. Ш.`

  page.drawText(textAdrees, {
    x: width - 200,
    maxWidth: 180,
    y: height - 30,
    size: fontSize,
    font: nimbusRomanFont,
    color: rgb(0, 0, 0),
  })

  page.drawText(values.regdate, {
    x: 50,
    y: height - height / 5,
    size: fontSize,
    font: nimbusRomanFont,
    color: rgb(0, 0, 0),
    
  })
  page.drawText(`Рег. номер: ${values.regnum}`, {
    x: 400,
    y: height - height / 5,
    size: fontSize,
    font: nimbusRomanFont,
    color: rgb(0, 0, 0),
    
  })

  page.drawText("Заявка", {
    x: 260,
    y: height - height / 5 - 30,
    size: fontSize,
    font: nimbusRomanFont,
    color: rgb(0, 0, 0),
    
  })

  const leftText = `
    ${values.regtext}

    Создал: ${info.lastname} ${info.firstname} ${info.middlename}
    Должность: ${info.position}
    Подразделение: ${info.department}
    Материально ответственное лицо: ${values.dutyface}
  `

  page.drawText(leftText, {
    x: 50,
    y: height - height / 5 - 30 * 2,
    size: fontSize,
    font: nimbusRomanFont,
    color: rgb(0, 0, 0),
    maxWidth: width - 50
    
  })

  const pdfBytes = await pdfDoc.save()
  
  return pdfBytes
}

export default genDocument1;