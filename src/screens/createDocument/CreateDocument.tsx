import {
    Form,
    Input,
    Button,
    Select,
    Upload,
    Result,
    message
} from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { signularisApi, useCreateMetaDocumentMutation, useGetRecipientsListQuery } from "../../store/api/signularisApi";
import { useAppDispatch } from "../../hooks/redux";
import {useNavigate} from "react-router-dom";
import {MAIN_PAGE_ROUTE, TEMPLATES_CREATE_DOCUMENT_ROUTE} from "../../routing/consts";
import useSetTitle from "../../hooks/useSetTitle";
import {DocTemplateType} from "../../types/types";

const { Item } = Form;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;

type CreateMetaDocumentRequest = {
    title:      string,
    brief:      string,
    recipients: string[],
    file:       File,
}

function Create() {
    const dispatch = useAppDispatch()

    useSetTitle('Создание документа')


    const { data: recipientsList } = useGetRecipientsListQuery()

    const [docname, setDocname] = useState("")
    const docTemplate : DocTemplateType = 'default'

    const [createMetaDocument, {
        isLoading: mutationLoading,
        isSuccess: mutationSuccess,
        isError: mutationError,
    } ] = useCreateMetaDocumentMutation()

    const [form] = useForm()
    const navigate = useNavigate();

    const onFinish = (values: CreateMetaDocumentRequest) => {
        setDocname(values.title)
        const formData = new FormData()
        formData.append("title", values.title)
        formData.append("referenceType", docTemplate)
        formData.append("brief", values.brief)
        formData.append("recipients", values.recipients.join(","))
        if (uploadFile !== undefined) {
            formData.append("file", uploadFile, uploadFile?.name)
        }
        createMetaDocument(formData)
        dispatch(signularisApi.util.invalidateTags(['MetaDocument']))
    }

    const [uploadFile, setUploadFile] = useState<File>()

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
        console.log(file)
        if (file.type !== "application/pdf") {
            message.error("Разрешены файлы только в формате PDF")
            return Upload.LIST_IGNORE
        }
        return false
    }

    if (mutationSuccess) {
        return (
            <Result
                status="success"
                title="Документ создан"
                subTitle={`Ваш документ ${docname} успешно создан. Едем дальше.`}
                extra={[
                    <Button key='succes_again' href="/user/create">Создать еще</Button>
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
                    <Button key='error_again' href="/user/create">Создать еще</Button>
                ]}
            />
        )
    }



    return (
        <>

            <Form form={form} onFinish={onFinish}>
                <Item className='my-input' name="title" rules={[{ required: true, message: 'Обязательное поле' }]}>
                    <Input placeholder={'Название документа'} />
                </Item>
                <Item className='my-input' name="recipients" rules={[{ required: true, message: 'Обязательное поле' }]}>
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
                <Item className='my-input' name="brief" rules={[{ required: true, message: 'Обязательное поле' }]}>
                        <TextArea rows={5} placeholder={'Краткое описание'}/>
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
                <Button className='my-btn margin-bottom-sm' type="primary" style={{marginRight: '5px'}} htmlType="submit" loading={mutationLoading}>Создать документ</Button>
                <Button onClick={() => navigate(MAIN_PAGE_ROUTE + '/' + TEMPLATES_CREATE_DOCUMENT_ROUTE)}>Создать документ по шаблону</Button>
            </Form>
        </>
    )
}

export default Create;