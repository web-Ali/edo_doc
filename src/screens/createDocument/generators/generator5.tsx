import {
    Form,
    Button,
    Select,
    Typography,
    Result, Skeleton, Alert, message, Upload,
} from "antd";

import {useMemo, useState} from "react";
import { useForm } from "antd/lib/form/Form";
import {
    signularisApi,
    useCreateMetaDocumentMutation,
    useGetMetaDocumentsQuery,
    useGetRecipientsListQuery
} from "../../../store/api/signularisApi";

import { useAppDispatch } from "../../../hooks/redux";
import {CREATE_DOCUMENT_ROUTE, MAIN_PAGE_ROUTE} from "../../../routing/consts";
import { Link } from "react-router-dom";
import {DocTemplateType, Document, GetMetaDocumentsRequest} from "../../../types/types";
import {InboxOutlined} from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";

const { Title } = Typography;
const { Item } = Form;
const { Option } = Select;

type TemplateRequest = {
    title:      string,
    brief:      string,
    recipients: string[],
    file:       File,
    reference: number,
    regdate: string,
    regnum: string,
    regtext: string,
    dutyface: string
}

//generates random id;
let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x100)
            .toString(10)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + s4() + s4() + s4();
}


function Template(prop : {referenceId?: string, referenceType?:string}) {
    const [uploadFile, setUploadFile] = useState<File>()
    const dispatch = useAppDispatch()

    let reqParams: GetMetaDocumentsRequest = {
        type: 'signed',
        skip: 0,
        limit: 150,
        sort: 'newest'
    }
    const [docListFiltred, setDocListFiltred] = useState(Array<Document>)

    const {data: docList, isLoading: docListIsLoading, isError: docListIsError, refetch: docListRefetch} = useGetMetaDocumentsQuery(reqParams)

    useMemo(()=>{
        if (Array.isArray(docList?.docs) && docList?.docs != undefined ){
            setDocListFiltred(docList?.docs.filter((item)=>{
                return item.documentType === 'extractStorage'
            }))
        }
    },[docList?.docs])

    const { data: recipientsList } = useGetRecipientsListQuery()


    const [docname, setDocname] = useState("")
    const docTemplate : DocTemplateType = 'deliveryNote'

    const [createMetaDocument, {
        isLoading: mutationLoading,
        isSuccess: mutationSuccess,
        isError: mutationError,
    } ] = useCreateMetaDocumentMutation()

    const [form] = useForm()

    const onFinish = async (values: TemplateRequest) => {
        // user info
        const regnum = guid()

        setDocname('Накладная')
        const formData = new FormData()
        formData.append("title", `Требование-накладная №${regnum}`)
        formData.append("brief", "Сгенерировано из шаблона")
        formData.append("recipients", values.recipients.join(","))
        formData.append("referenceType", prop.referenceType ? prop.referenceType : docListFiltred[values.reference].documentType)
        formData.append("reference", prop.referenceId ? prop.referenceId : docListFiltred[values.reference].id)
        formData.append("documentType", docTemplate)

        if (uploadFile !== undefined) {
            formData.append("file", uploadFile, uploadFile?.name)
        }
        createMetaDocument(formData)
        dispatch(signularisApi.util.invalidateTags(['MetaDocument']))
    }

    if (mutationSuccess) {
        return (
            <Result
                status="success"
                title="Документ создан"
                subTitle={`Ваш документ ${docname} успешно создан из шаблона 'Требование-накладная'.`}
                extra={[
                    <Link to={MAIN_PAGE_ROUTE + '/' + CREATE_DOCUMENT_ROUTE}><Button >Создать еще</Button></Link>
                ]}
            />
        )
    }

    if (mutationError) {
        return (
            <Result
                status="error"
                title="Не удалось создать документ"
                extra={[
                    <Link to={MAIN_PAGE_ROUTE + '/' + CREATE_DOCUMENT_ROUTE}><Button >Создать еще</Button></Link>
                ]}
            />
        )
    }
    if (docListIsLoading){
        return (<>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            </>
        )
    }
    if (docListIsError){
        return (<>
                <Alert message="Произошла ошибка" type="error" />
                <Button onClick={docListRefetch} danger>Повторить запрос</Button>
            </>
        )
    }
    const formatTime = (time: string): string => {
        let tObj = new Date(time)
        let day = tObj.getDate().toString().length === 1 ? "0" + tObj.getDate() : tObj.getDate()
        let month = (tObj.getMonth()+1).toString().length === 1 ? "0" + (tObj.getMonth()+1 ): tObj.getMonth() +1
        let hours = tObj.getHours().toString().length === 1 ? "0" + tObj.getHours(): tObj.getHours()
        let minutes = tObj.getMinutes().toString().length === 1 ? "0" + tObj.getMinutes(): tObj.getMinutes()


        return `${day}.${month}.${tObj.getFullYear()} ${hours}:${minutes}`
    }

    const handleUpload = (uploadObj: any) => {
        if (uploadObj.fileList[0] !== undefined) {
            setUploadFile(uploadObj.fileList[0].originFileObj)
        } else {
            setUploadFile(uploadObj.file)
        }
    }

    const handleDelete = () => {
        message.warning(`Файл ${uploadFile?.name} удален`)
        setUploadFile(undefined)
    }

    const handleBeforeUpload = (file: File) => {
        if (file.type !== "application/pdf") {
            message.error("Разрешены файлы только в формате PDF")
            return Upload.LIST_IGNORE
        }
        return false
    }

    return (
        <>
            <Title level={2} style={{ marginBottom: '30px' }}>Требование-накладная</Title>
            <Form form={form} onFinish={onFinish} >
                <Item name="recipients" rules={[{ required: true, message: 'Обязательное поле' }]}>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Получатели"
                        notFoundContent={"Ничего не найдено"}
                        filterOption={(input, option) =>
                            option?.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            option?.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            recipientsList?.map((recipient) => (
                                <Option key={recipient.id} value={recipient.id} label={recipient.fullname}>
                                    {recipient.fullname}
                                </Option>
                            ))
                        }
                    </Select>
                </Item>
                <Item name="file" rules={[{ required: true, message: 'Обязательное поле' }]}>
                    <Dragger
                        accept='application/pdf'
                        name="file"
                        multiple={false}
                        maxCount={1}
                        beforeUpload={handleBeforeUpload}
                        onChange={handleUpload}
                        onRemove={handleDelete}
                    >
                        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                        <p className="ant-upload-text">Кликните или перетащите файл сюда для загрузки</p>
                        <p className="ant-upload-hint">Разрешено загружать только один файл</p>
                    </Dragger>
                </Item>
                {
                    prop.referenceId ? null : <Item name="reference" rules={[{ required: true, message: 'Обязательное поле' }]}>
                    <Select
                        allowClear
                        placeholder="Выберите документ, на который нужно ссылаться"
                        notFoundContent={"Ничего не найдено"}
                        filterOption={(input, option) =>
                            option?.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            option?.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            docListFiltred?.map((doc, index) => (
                                <Option key={doc.id} value={index} label={doc.documentTitle}>
                                    {doc.documentTitle}, от <span style={{fontStyle: 'italic'}}>{formatTime(doc.time)}</span>
                                </Option>
                            ))
                        }
                    </Select>
                </Item>
                }

                <Button className='my-btn margin-bottom-xl' type="primary"  htmlType="submit" loading={mutationLoading}>Создать документ</Button>
            </Form>
        </>
    )
}

export default Template;