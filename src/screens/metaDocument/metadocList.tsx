import {
  Typography,
  Skeleton,
  Result,
  Button,
  Select,
  Pagination
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentCard from './documentCard';
import {signularisApi, useGetMetaDocumentsQuery} from '../../store/api/signularisApi';
import { DocSort, DocType, GetMetaDocumentsRequest } from '../../types/types';
import useSetTitle from "../../hooks/useSetTitle";
import {useAppDispatch} from "../../hooks/redux";

const { Title } = Typography;
const { Option } = Select;

function MetadocList() {

  let { type } = useParams<{type: DocType}>();

  useSetTitle('Документы')

  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [sort, setSort] = useState<DocSort>('newest');
  const dispatch = useAppDispatch()


  let reqParams: GetMetaDocumentsRequest = {
    // @ts-ignore
    type: type,
    skip: skip,
    limit: limit,
    sort: sort
  }
  const {data, isLoading, isError, refetch} = useGetMetaDocumentsQuery(reqParams)

  const [viewButtons, setViewButtons] = useState<boolean>(false)
  const [header, setHeader] = useState<string>("")

  useEffect(() => {
    if (type === 'new') {
      setViewButtons(true);
    } else {
      setViewButtons(false);
    }

    if (type === "new") {
      setHeader("Входящие");
    }
    if (type === "signed") {
      setHeader("Подписанные");
    }
    if (type === "declined") {
      setHeader("Отклоненные");
    }
    if (type === "created") {
      setHeader("Созданные");
    }
    if (type === "view") {
      setHeader("Просматриваемые");
    }
    dispatch(signularisApi.util.invalidateTags(['documentCount']))
  }, [type])

  const handleSortOptionChange = (value: DocSort) => {
    setSort(value)
  }

  const handleLimitOptionChange = (value: number) => {
    setLimit(value)
  }

  const handlePaginationChange = (value: number) => {
    setSkip(limit * (value - 1))
  }

  const formatTime = (time: string): string => {
    let tObj = new Date(time)
    let day = tObj.getDate().toString().length === 1 ? "0" + tObj.getDate() : tObj.getDate()
    let month = (tObj.getMonth()+1).toString().length === 1 ? "0" + (tObj.getMonth()+1 ): tObj.getMonth() +1
    let hours = tObj.getHours().toString().length === 1 ? "0" + tObj.getHours(): tObj.getHours()
    let minutes = tObj.getMinutes().toString().length === 1 ? "0" + tObj.getMinutes(): tObj.getMinutes()


    return `${day}.${month}.${tObj.getFullYear()} ${hours}:${minutes}`
  }

  if (isError) return (
    <>
      <Result
        status="error"
        title="Не удалось загрузить список"
        extra={[
          <Button key="refetch" onClick={() => refetch()}>Обновить</Button>
        ]}
      />
    </>
  )

  if (isLoading) return (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  )

  return (
    <>
      <Title level={2} style={{ marginBottom: '30px' }}>{header}</Title>

      {
        data?.docs !== null && data?.docs.length ? <>
                <Select defaultValue="newest" onChange={handleSortOptionChange} style={{marginRight: "10px"}}>
                  <Option value="newest">Сначала новые</Option>
                  <Option value="oldest">Сначала старые</Option>
                </Select>
            <Select defaultValue={5} onChange={handleLimitOptionChange}>
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
            </Select>
            {
              data?.docs.map((metadocument) => (
                  <DocumentCard
                      id={metadocument.id}
                      title={metadocument.documentTitle}
                      brief={metadocument.documentBrief}
                      time={formatTime(metadocument.time)}
                      owner={metadocument.ownerFullname}
                      fileId={metadocument.fileId}
                      key={metadocument.id}
                      reference={metadocument.reference}
                      docType={metadocument.documentType}
                      referenceType={metadocument.referenceType}
                      viewButtons={viewButtons}
                      signatures={metadocument.signatures}
                  />
              ))
            }

            <Pagination
                defaultCurrent={1}
                total={data?.count}
                pageSize={limit}
                onChange={handlePaginationChange}
            />
          </>
              :
              <p>Список документов пуст</p>
      }


    </>
  )
}

export default MetadocList;