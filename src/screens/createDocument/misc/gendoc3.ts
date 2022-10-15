import { PDFDocument, rgb } from "pdf-lib";
import { User } from '../../../types/types';
import fontkit from "@pdf-lib/fontkit";

async function genDocument3(values: {regdate: string, regnum: string, regtext: string, dutyface: string}, info: User) {
  const url = '/nimbus-roman.otf'
  const nimbusRomanBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const nimbusRomanFont = await pdfDoc.embedFont(nimbusRomanBytes)

  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const fontSize = 14
  console.log(width, height)
  const textAdrees =`Ректору ГГНТУ
Минцаеву М. Ш.`

  const text = `
    ${values.regdate}                                                                     Рег. номер: ${values.regnum}

                                                      Заявление
    
    ${values.regtext}

    Создал: ${info.lastname} ${info.firstname} ${info.middlename}
    Должность: ${info.position}
    Подразделение: ${info.department}
    Email: ${info.email}
    Telegram: ${info.telegram}
  `
  page.drawText(textAdrees, {
    x: width - 200,
    maxWidth: 180,
    y: height - height / 12,
    size: fontSize,
    font: nimbusRomanFont,
    color: rgb(0, 0, 0),
  })

  page.drawText(text, {
    x: 50,
    maxWidth: width - 50,
    y: height - height / 12 - 250,
    size: fontSize,
    font: nimbusRomanFont,
    color: rgb(0, 0, 0),
  })


  const pdfBytes = await pdfDoc.save()
  
  return pdfBytes
}

export default genDocument3;