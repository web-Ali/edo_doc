import {
  Card,
  Form,
  Divider,
  Button,
  Modal,
  Input, Space,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import { declineRequest, signRequest } from "../../store/api/axiosApi";
import { signularisApi } from "../../store/api/signularisApi";
import {MAIN_PAGE_ROUTE, META_DOCUMENT_INFO_ROUTE} from "../../routing/consts";
import {documentTemplates} from "../../const";
import {DocTemplateType, Signature} from "../../types/types";
import {RootState} from "../../store/store";

const { TextArea } = Input;
const { Item } = Form;


function DocumentCard(prop: {reference: string,
  docType: DocTemplateType, referenceType: string,
  id: string, title: string, brief: string,
  time: string, owner: string, fileId: string,
  viewButtons: boolean, signatures: Signature[]
}) {
  const [signModalVisible, setSignModalVisible] = useState<boolean>(false)
  const [declineModalVisible, setDeclineModalVisible] = useState<boolean>(false)

  const [signModalLoading, setSignModalLoading] = useState<boolean>(false)
  const [declineModalLoading, setDeclineModalLoading] = useState<boolean>(false)

  const userInfo = useAppSelector((state: RootState) => state.userinfo)
  const [password, setPassword] = useState<string>("")
  const [commentAccept, setCommentAccept] = useState<string>("")


  const dispatch = useAppDispatch()

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value)
  }

  const handleDeclineConfirm = (value: any) => {
    setDeclineModalLoading(true);
    
    declineRequest(prop.id, password, value.reason)
    
    setPassword("")
    setDeclineModalVisible(false);
    setDeclineModalLoading(false);
    dispatch(signularisApi.util.invalidateTags(['MetaDocument']))
  }

  const handleConfirm = async () => {
    setSignModalLoading(true);
    await signRequest(prop.id, password, prop.fileId, userInfo, prop.signatures.filter(elem=>elem.status === 1).length, commentAccept)
    setPassword("")
    setSignModalVisible(false);
    setSignModalLoading(false);
    dispatch(signularisApi.util.invalidateTags(['MetaDocument']))
  }

  return (
    <>
      <Modal 
        title={`Подпись документа ${prop.title}`}
        visible={signModalVisible}
        onCancel={() => {setSignModalVisible(false)}}
        footer={[
          <>
            <Button onClick={() => {setSignModalVisible(false)}}>отмена</Button>
            <Button onClick={handleConfirm} type="primary" loading={signModalLoading}>
              подтвердить
            </Button>
          </>
        ]}
      >
        <Item
            name='reason'
        >
          <TextArea placeholder="комментарий" onChange={(e)=>setCommentAccept(e.target.value)}/>
        </Item>
        <Item
            name='password'
            rules={[{required: true, message: 'Обязательное поле'}]}
        >
          <Input type="password" placeholder="Пароль" onChange={handlePasswordChange}/>
        </Item>
      </Modal>
      <Modal
        title={`Отклонение документа ${prop.title}`}
        visible={declineModalVisible}
        onCancel={() => {setDeclineModalVisible(false)}}
        footer={null}
      >
        <Form onFinish={handleDeclineConfirm}>
          <Item
            name='reason'
            rules={[{ required: true, message: 'Обязательное поле' }]}
          >
            <TextArea rows={4} placeholder="Причина отклонения" />
          </Item>
          <Item
            name='password'
            rules={[{ required: true, message: 'Обязательное поле' }]}
          >
            <Input type="password" placeholder="Пароль" onChange={handlePasswordChange} />
          </Item>
          <Button type="primary" htmlType="submit" danger loading={declineModalLoading}>
            подтвердить
          </Button>
        </Form>
      </Modal>
      <Card 
        title={prop.title}
        style={{margin: '20px 0'}}
        extra={<Link to={MAIN_PAGE_ROUTE + `/` + META_DOCUMENT_INFO_ROUTE + `/${prop.id}`}>подробнее</Link>}
        className="document-card"
      >
        <p style={{color: 'rgb(131, 131, 131)'}} >{prop.time} {prop.owner}</p>
        <br/>
        {
          documentTemplates[prop.docType] ? <p>{prop.brief} «{documentTemplates[prop.docType]}»</p> : <p>{prop.brief}</p>
        }
        <br/>
        {
          (+prop.reference || isNaN(+prop.reference)) ? <p>Ссылается на документ <Link to={MAIN_PAGE_ROUTE + '/'+ META_DOCUMENT_INFO_ROUTE +'/' + prop.reference}>{prop.reference}</Link></p> : null
        }

        { prop.viewButtons ?
          <>
            <Divider />
            <Button type="primary" style={{ marginRight: '5px' }} onClick={() => setSignModalVisible(true)}>подписать</Button>
            <Button type="primary" danger onClick={() => { setDeclineModalVisible(true); } }>отклонить</Button>
          </>
          : null
        }
      </Card>
    </>
  )
}

export default DocumentCard;