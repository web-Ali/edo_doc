import {
  Form,
  Input,
  Button,
  message
} from 'antd';
import { useLogInMutation } from '../../store/api/noLoginApi';
import { Credentials } from '../../types/types';
import style from "./Login.module.scss";
import {useForm} from "antd/lib/form/Form";

const { Item } = Form;

function Login() {
  const [logIn, { data, isSuccess, isLoading, isError }] = useLogInMutation()

  const [form] = useForm()

  const onFinish = (values: any) => {
    let creds: Credentials = {
      username: values.username,
      password: values.password
    }
    logIn(creds)
  }

  if (isSuccess && data) {
    localStorage.setItem('token', data.token)
    window.location.href = '/';
  }

  if (isError) {
    message.error('Не удалось войти.')
  }

  return (
      <div className={style.login}>
        <h1 className="title">Документооборот ГГНТУ </h1>

        <div className={style.container}>
          <h3 className={style.title + ' margin-bottom-md'}>Авторизация</h3>
          <Form
              form={form}
              onFinish={onFinish}
          >
            <Item
                className='my-input'
                name='username'
                rules={[{ required: true, message: 'Обязательное поле' }]}
            >
             <Input  placeholder={'Логин'}/>
            </Item>
            <Item
                className='my-input margin-top-sm'
                name='password'
                rules={[{ required: true, message: 'Обязательное поле' }]}
            >
             <Input type='password' placeholder={'Пароль'} />

            </Item>
            <Button className='my-btn' htmlType='submit' loading={isLoading}>Войти</Button>
          </Form>
        </div>
      </div>
  )
}

export default Login;