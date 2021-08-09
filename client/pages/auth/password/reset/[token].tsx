import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../app/hooks';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

// components
import { Header } from '../../../../components/layout/index';
import { InputText } from '../../../../components/forms/index';
import { PageTitle } from '../../../../components/atoms/index';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';

// slice
import { resetPasswordAsync } from '../../../../features/auth/authSlice';

// helper function
import { isAuth } from '../../../../helpers/storageToken';

interface ResetPasswordFormType {
  newPassword: string;
}

const ResetPassword: FC = () => {
  const router = useRouter();
  const token = router.query.token as string;
  const [decoded, setDecoded] = useState<{ name: string }>({ name: '' });
  const dispatch = useAppDispatch();

  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ResetPasswordFormType>({
    mode: 'onBlur'
  });

  const onSubmit: SubmitHandler<ResetPasswordFormType> = (formData) => {
    const newFormData = _.extend(formData, { token });
    console.log('通過しました。');
    console.table(newFormData);
    dispatch(resetPasswordAsync(newFormData));
    reset();
  };
  console.log('watch', watch());

  useEffect(() => {
    const decoded = jwt.decode(token) as { name: string } | null;
    if (decoded) {
      console.log('decoded', decoded);
      setDecoded({ ...decoded, name: decoded.name });
    }
  }, [router, token]);

  return (
    <Header>
      <PageTitle>Reset Password</PageTitle>
      <p className='text-center mt-5'>
        Hi {decoded.name}, Ready to Reset Password?
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-4'>
          <InputText
            id='newPassword'
            inputType='password'
            placeholder='Input your newPassword for this app.'
            error={errors.newPassword!}
            register={register('newPassword', {
              required: 'Please input your email address',
              minLength: {
                value: 6,
                message: 'Please set password more than equal 6 characters'
              },
              validate: (value) => {
                return (
                  value.replace(/\s+/g, '').length >= 6 ||
                  'Do not enter blank space. Please set password more than equal 6 characters'
                );
              }
            })}>
            Reset Password
          </InputText>
        </div>
        {/* {JSON.stringify(isAuth())} */}
        <button type='submit' className='primary-btn'>
          Reset Password
        </button>
      </form>
    </Header>
  );
};

export default ResetPassword;
