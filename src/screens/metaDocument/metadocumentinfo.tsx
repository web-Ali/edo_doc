import {
    Button,
    Divider,
    Timeline,
    Tooltip,
    Form,
    Modal,
    Input
} from "antd";
import Title from "antd/lib/typography/Title";
import {useEffect, useState} from "react";

import {Link, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {declineRequest, downloadDocument, signRequest} from "../../store/api/axiosApi";
import {signularisApi, useGetMetaDocumentQuery, useGetSelfInfoQuery} from "../../store/api/signularisApi";

import {RootState} from "../../store/store";
import {documentTemplates} from "../../const";
import {MAIN_PAGE_ROUTE, META_DOCUMENT_INFO_ROUTE} from "../../routing/consts";
import Generator5 from "../createDocument/generators/generator5";
import {setnew} from "../../store/slices/userinfoSlice";

const {TextArea} = Input;
const {Item} = Form;

function MetaDocumentInfo() {
    let {id} = useParams<{ id: string }>();

    const {
        data: infoData,
        isLoading: infoLoading,
        isError: infoError
        // @ts-ignore
    } = useGetMetaDocumentQuery(id)

    const openDoc = () => {
        if (infoData) {
            downloadDocument(infoData.fileId)
        }
    }

    const [signModalVisible, setSignModalVisible] = useState<boolean>(false)
    const [nakladnayaModalVisible, setNakladnayaModalVisible] = useState<boolean>(false)
    const [declineModalVisible, setDeclineModalVisible] = useState<boolean>(false)

    const [signModalLoading, setSignModalLoading] = useState<boolean>(false)
    const [declineModalLoading, setDeclineModalLoading] = useState<boolean>(false)

    const [password, setPassword] = useState<string>("")
    const [commentAccept, setCommentAccept] = useState<string>("")
    const userInfo = useAppSelector((state: RootState) => state.userinfo)
    const dispatch = useAppDispatch()

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value)
    }

    const handleDeclineConfirm = (value: any) => {
        setDeclineModalLoading(true);
        // @ts-ignore
        declineRequest(id, password, value.reason)

        setPassword("")
        setDeclineModalVisible(false);
        setDeclineModalLoading(false);
        dispatch(signularisApi.util.invalidateTags(['MetaDocument']))
        window.location.reload()
    }

    const handleConfirm = async () => {
        setSignModalLoading(true);
        // @ts-ignore
        await signRequest(id, password, infoData.fileId, userInfo, infoData.signatures.filter(elem=>elem.status === 1).length, commentAccept)

        setPassword("")
        setSignModalVisible(false);
        setSignModalLoading(false);
        dispatch(signularisApi.util.invalidateTags(['MetaDocument']))
        window.location.reload()
    }


    const showUsageButtons = infoData?.signatures.find(
        signature => {
            return signature.userFullname === `${userInfo.lastname} ${userInfo.firstname} ${userInfo.middlename}` &&
                signature.status === 0
        }
    )

    const formatTime = (time: string): string => {
        let tObj = new Date(time)
        let day = tObj.getDate().toString().length === 1 ? "0" + tObj.getDate() : tObj.getDate()
        let month = (tObj.getMonth()+1).toString().length === 1 ? "0" + (tObj.getMonth()+1 ): tObj.getMonth() +1
        let hours = tObj.getHours().toString().length === 1 ? "0" + tObj.getHours(): tObj.getHours()
        let minutes = tObj.getMinutes().toString().length === 1 ? "0" + tObj.getMinutes(): tObj.getMinutes()
        return `${day}.${month}.${tObj.getFullYear()} ${hours}:${minutes}`
    }

    if (infoLoading) return (
        <>loading</>
    )
    if (infoError) return (
        <>error</>
    )
    if (infoData) return (
        <>
            <Modal
                title={`Требование-накладная на "${infoData.documentTitle}"`}
                visible={nakladnayaModalVisible}
                width={1000}
                onCancel={() => {
                    setNakladnayaModalVisible(false)
                }}
                footer={[
                    <>
                        <Button onClick={() => {
                            setNakladnayaModalVisible(false)
                        }}>отмена</Button>
                    </>
                ]}
            >
                <Generator5 referenceId={infoData.id} referenceType={infoData.documentType} />
            </Modal>
            <Modal
                title={`Подпись документа ${infoData.documentTitle}`}
                visible={signModalVisible}
                onCancel={() => {
                    setSignModalVisible(false)
                }}
                footer={[
                    <>
                        <Button onClick={() => {
                            setSignModalVisible(false)
                        }}>отмена</Button>
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
                title={`Отклонение документа ${infoData.documentTitle}`}
                visible={declineModalVisible}
                onCancel={() => {
                    setDeclineModalVisible(false)
                }}
                footer={null}
            >
                <Form onFinish={handleDeclineConfirm}>
                    <Item
                        name='reason'
                        rules={[{required: true, message: 'Обязательное поле'}]}
                    >
                        <TextArea rows={4} placeholder="Причина отклонения"/>
                    </Item>
                    <Item
                        name='password'
                        rules={[{required: true, message: 'Обязательное поле'}]}
                    >
                        <Input type="password" placeholder="Пароль" onChange={handlePasswordChange}/>
                    </Item>
                    <Button type="primary" htmlType="submit" danger loading={declineModalLoading}>
                        подтвердить
                    </Button>
                </Form>
            </Modal>

            <Title level={1}>{infoData.documentTitle}</Title>
            <Title level={5} style={{margin: "0 0 10px 0", color: "#616161"}}>{infoData.ownerFullname}</Title>
            <Title level={5} style={{margin: "0 0 10px 0", color: "#616161"}}>{formatTime(infoData.time)}</Title>
            <Divider>Описание</Divider>
            {
                documentTemplates[infoData.documentType] ?
                    <p>{infoData.documentBrief} «{documentTemplates[infoData.documentType]}»</p> :
                    <p>{infoData.documentBrief}</p>
            }
            <br/>
            {
                (+infoData.reference || isNaN(+infoData.reference)) ? <p>Ссылается на документ <Link
                    to={MAIN_PAGE_ROUTE + '/' + META_DOCUMENT_INFO_ROUTE + '/' + infoData.reference}>{infoData.reference}</Link>
                </p> : null
            }
            <Divider>Информация о подписантах</Divider>
            <Timeline>
                {
                    infoData.signatures.map(signature => (
                        signature.status === 0
                            ? <Timeline.Item color="grey">{signature.userFullname}</Timeline.Item>
                            : signature.status === 1
                                ? <Timeline.Item color="green">{signature.userFullname}</Timeline.Item>
                                : <Timeline.Item color="red">
                                    <Tooltip placement="topRight" title="asd">{signature.userFullname}</Tooltip>
                                </Timeline.Item>
                    ))
                }
            </Timeline>
            <Divider/>
            {showUsageButtons ?
                <>
                    <Button type="primary" style={{marginRight: '5px'}}
                            onClick={() => setSignModalVisible(true)}>подписать</Button>
                    <Button type="primary" style={{marginRight: '5px'}} onClick={() => setDeclineModalVisible(true)}
                            danger>отклонить</Button>
                </>
                : infoData.documentType === 'extractStorage' ?
                    <Button type="primary" style={{marginRight: '5px'}}
                            onClick={() => setNakladnayaModalVisible(true)}>Создать накладную</Button>
                : null
            }
            <Button type="default" onClick={openDoc}>Просмотреть</Button>

        </>
    )
    return (<></>)
}

export default MetaDocumentInfo;