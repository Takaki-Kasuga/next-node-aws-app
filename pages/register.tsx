import React, { FC } from 'react';

// components
import { InputText } from '../components/forms/index';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';

// components
import { Header } from '../components/layout/index';

interface RegisterFormType {
  name: string;
  email: string;
  password: string;
}

const Register: FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormType>();
  return (
    <Header>
      <form>
        <div>
          <InputText
            id='name'
            inputType='text'
            placeholder='Your Name'
            error={errors.name!}
            register={register('name', {
              required: 'Please input your username'
            })}>
            UserName
          </InputText>
        </div>
        <div>
          <InputText
            id='email'
            inputType='text'
            placeholder='Email address'
            error={errors.email!}
            register={register('email', {
              required: 'Please input your email address'
            })}>
            Email adress
          </InputText>
        </div>
        <div>
          <InputText
            id='password'
            inputType='text'
            placeholder='Password'
            error={errors.password!}
            register={register('password', {
              required: 'Please input your password'
            })}>
            Password
          </InputText>
        </div>
      </form>
    </Header>
  );
};

export default Register;
