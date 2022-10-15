import { 
  Form, 
  Input, 
  Button, 
  Select,
  Typography,
  Result,
} from "antd";

import { useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { signularisApi, useCreateMetaDocumentMutation, useGetRecipientsListQuery } from "../../../store/api/signularisApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useAppDispatch } from "../../../hooks/redux";
import genDocument4 from '../misc/gendoc4';
import {CREATE_DOCUMENT_ROUTE, MAIN_PAGE_ROUTE} from "../../../routing/consts";
import {Link} from "react-router-dom";
import {DocTemplateType} from "../../../types/types";

const { Title } = Typography;
const { Item } = Form;
const { Option } = Select;

type TemplateRequest = {
  title:      string,
  brief:      string,
  recipients: string[],
  file:       File,

  corpus: string,
  date: string,
  guest_fullname: string,
  send_fullname: string,
  recv_fullname: string,
  auto: string,
  send_phone: string
  
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

function styledDate() {
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", 
                  "августа", "сентября", "октября", "ноября", "декабря"]
  const dobj = new Date()
  return `${dobj.getDate()} ${months[dobj.getMonth()]} ${dobj.getFullYear()}`
}

function Template() {
  const info = useSelector((state: RootState) => state.userinfo)
  const dispatch = useAppDispatch()

  const { data: recipientsList } = useGetRecipientsListQuery()

  const [docname, setDocname] = useState("")
  const docTemplate : DocTemplateType = 'passToGGNTU'

  const [createMetaDocument, {
    isLoading: mutationLoading, 
    isSuccess: mutationSuccess, 
    isError: mutationError,
  } ] = useCreateMetaDocumentMutation()

  const [form] = useForm()

  const onFinish = async (values: TemplateRequest) => {
    // user info
    const regnum = guid()

    setDocname('Заявка на пропуск в корпуса ГГНТУ')
    const formData = new FormData()
    formData.append("title", `Заявка на пропуск в корпуса ГГНТУ №${regnum}`)
    formData.append("brief", "Сгенерировано из шаблона")
    formData.append("recipients", values.recipients.join(","))
    formData.append("documentType", docTemplate)

    const pdfBytes = await genDocument4(values, info)

    //const regtext = `Прошу Вас выписать со склада ${values.regtext}`
    //values.regtext = regtext
    formData.append("file", new Blob([pdfBytes]))
    console.log(values)
    createMetaDocument(formData)
    dispatch(signularisApi.util.invalidateTags(['MetaDocument']))
  }

  if (mutationSuccess) {
    return (
      <Result
        status="success"
        title="Документ создан"
        subTitle={`Ваш документ ${docname} успешно создан.`}
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
  const fullname = () => {
    return `${info.lastname} ${info.firstname} ${info.middlename}`
  }
  return (
    <>
      <Title level={2} style={{ marginBottom: '30px' }}>Заявка на пропуск в корпуса ГГНТУ</Title>
      <Form form={form} onFinish={onFinish} initialValues={{date: styledDate()}}>
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
        <Item className='my-input' name="corpus" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input placeholder="Корпус"/>
        </Item>
        <Item className='my-input' name="date" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input placeholder="Дата и время приема"/>
        </Item>
        <Item className='my-input' name="guest_fullname" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input placeholder="ФИО/Должность гостя"/>
        </Item>
        <Item className='my-input' name="recv_fullname" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input placeholder="Кто принимает? "/>
        </Item>
        <Item className='my-input' name="send_fullname" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input placeholder="ФИО/Должность отпраителя"/>
        </Item>
        <Item className='my-input' name="send_phone" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input placeholder="Телефон отправителя"/>
        </Item>
        <Item className='my-input' name="auto" rules={[{ required: true, message: 'Обязательное поле' }]}>
          <Input placeholder="Гос. номер/Марка авто"/>
        </Item>
        <Button className='my-btn margin-bottom-xl' type="primary"  htmlType="submit" loading={mutationLoading}>Создать документ</Button>
      </Form>
    </>
  )
}

export default Template;