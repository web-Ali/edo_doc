import { PDFDocument, rgb } from "pdf-lib";
import { User } from '../../../types/types';
import fontkit from "@pdf-lib/fontkit";

async function genDocument3(values: {corpus: string, date: string, guest_fullname: string, recv_fullname: string, send_fullname: string, auto: string, send_phone: string}, info: User) {
  const url = '/nimbus-roman.otf'
  const nimbusRomanBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const nimbusRomanFont = await pdfDoc.embedFont(nimbusRomanBytes)

  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const fontSize = 14
  console.log(width, height)
  
  const text = `
    Заявка на пропуск в корпуса ГГНТУ
    
    Корпус: ${values.corpus}
    Дата: ${values.date}
    ФИО/Должность гостя: ${values.guest_fullname}
    Кто принимает: ${values.recv_fullname}
    ФИО/должность отправителя заявки: ${values.send_fullname}
    Гос. номер/Марка авто: ${values.auto}
    Телефон отправителя заявки: ${values.send_phone}
  `

  page.drawText(text, {
    x: 50,
    y: height - height / 12,
    size: fontSize,
    font: nimbusRomanFont,
    maxWidth: width - 50,
    color: rgb(0, 0, 0),
  })

  const pdfBytes = await pdfDoc.save()
  
  return pdfBytes
}

export default genDocument3;