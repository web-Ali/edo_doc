import {
    Tabs
} from "antd";

import Generator1 from "./generators/generator1";
import Generator2 from "./generators/generator2";
import Generator3 from "./generators/generator3";
import Generator4 from "./generators/generator4";
import style from './CreateDocument.module.scss'
import useSetTitle from "../../hooks/useSetTitle";
import { FileTextOutlined } from "@ant-design/icons";
import Generator5 from "./generators/generator5";

function Templates() {

    useSetTitle('Создание документа по шаблону')
    const { TabPane } = Tabs;

    return (
        <>
            <Tabs defaultActiveKey="1" tabPosition={'left'} size={'small'} className={style.tabs}>
                <TabPane tab={<><FileTextOutlined />Выписка из склада</>} key="1">
                    <Generator1 />
                </TabPane>
                <TabPane tab={<><FileTextOutlined />Заявление на оплачиваемый отпуск</>} key="2">
                    <Generator2 />
                </TabPane>
                <TabPane tab={<><FileTextOutlined />Заявление о выходе на работу в условиях неполного рабочего времени</>} key="3">
                    <Generator3 />
                </TabPane>
                <TabPane tab={<><FileTextOutlined />Заявка на пропуск в корпуса ГГНТУ</>} key="4">
                    <Generator4 />
                </TabPane>
                <TabPane tab={<><FileTextOutlined />Требование-накладная</>} key="5">
                    <Generator5 />
                </TabPane>

            </Tabs>

        </>
    )
}

export default Templates;