// int this file all request mades axios
import {BlendMode, PDFDocument, rgb} from 'pdf-lib';
import {message} from "antd";
import axios from "axios";
import fontkit from "@pdf-lib/fontkit";
import {User} from "../../types/types";

const signRequest = async (id: string, password: string, fileId: string, info: User, signLen: number,  comment?: string) => {



    return axios.get(`/api/v1/getpdf/${fileId}`, {
        responseType: 'arraybuffer',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        }
    })
        .then(async (response) => {
            const url = '/nimbus-roman.otf'
            const nimbusRomanBytes = await fetch(url).then((res) => res.arrayBuffer());

            const pdfDoc = await PDFDocument.load(response.data)
            pdfDoc.registerFontkit(fontkit)
            const nimbusRomanFont = await pdfDoc.embedFont(nimbusRomanBytes)
            const pages = pdfDoc.getPages()
            const firstPage = pages[0]
            const {width, height} = firstPage.getSize()
            let now = new Date().toLocaleString();
            const text =
                `Документ подписан простой электронной подписью
ФИО: ${info.lastname} ${info.firstname} ${info.middlename}
Должность: ${info.position}
Дата подписания: ${now}`
            const textSize = 10


            firstPage.drawText(text, {
                x: 8 + ((signLen % 2) * (width - 16) / 2),
                y: 60 + (Math.trunc(signLen / 2) * 75),
                size: textSize  ,
                lineHeight: 10,
                font: nimbusRomanFont,
                color: rgb(0.1, 0.1, 0.9),
                opacity: 0.8,
            })
            firstPage.drawRectangle({
                x: 4 + ((signLen % 2) * (width - 16) / 2),
                y: 26 + (Math.trunc(signLen / 2) * 75),
                width: (width - 24) / 2,
                height: 45,
                borderColor: rgb(0.1, 0.1, 0.9),
                borderWidth: 1.5,
            })

            if (comment) {

                firstPage.drawText(`*${comment}`, {
                    x: 8 + ((signLen % 2) * (width - 16) / 2),
                    y: 15 + (Math.trunc(signLen / 2) * 75),
                    size: 9,
                    opacity: 0.7,
                    font: nimbusRomanFont,
                    maxWidth: (width - 16) / 2,
                    color: rgb(0.6, 0.1, 0.1),
                })
            }
            return await pdfDoc.save()
        })
        .then((pdfEdited) => {
            const formData = new FormData()
            formData.append("file", new Blob([pdfEdited]))
            formData.append("password", password)
            formData.append("documentId", id)
            return axios.post(`/api/v1/signwithupdate`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/pdf'
                    },

                })
        })
        .then((response) => {
            response.status >= 200 && response.status <= 299 ?
                message.success("Документ подписан") : message.error("Не удалось подписать документ")
        })
        .catch((err) => {
            console.log(err)
            message.error("Не удалось подписать документ")
        })
    // signwithupdate
    // await axios.post('/api/v1/sign', {
    //     documentId: id,
    //     password: password
    // }, {
    //     headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     }
    // })
    //     .then(() => {
    //         message.success("Документ подписан")
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //         message.error("Не удалось подписать документ")
    //     })
}

const declineRequest = (metaDocumentId: string, password: string, reason: string) => {
    axios.post('/api/v1/decline', {
        documentId: metaDocumentId,
        password: password,
        message: reason
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(() => {
            message.success("Документ отклонен")
        })
        .catch((err) => {
            console.log(err)
            message.error("Не удалось отклонить документ")
        })
}

const downloadDocument = (fileId: string) => {
    axios.get(`/api/v1/getpdf/${fileId}`, {
        responseType: 'blob',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            window.open(URL.createObjectURL(response.data))
        })
        .catch((err) => {
            console.log(err)
            message.error("Не удалось открыть документ")
        })
}

export {
    signRequest,
    declineRequest,
    downloadDocument
}