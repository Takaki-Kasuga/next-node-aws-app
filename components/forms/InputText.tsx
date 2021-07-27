import React, { FC, Fragment } from 'react';

// npm package
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

// components
import { ErrorMessage } from '../styles/index';

interface InputTextProps {
  register: UseFormRegisterReturn;
  error: FieldError;
  inputType: string;
  placeholder: string;
  id: string;
  children: string;
}

const InputText: FC<InputTextProps> = ({
  register,
  error,
  inputType,
  placeholder,
  id,
  children
}) => {
  return (
    <Fragment>
      <label
        className='block text-gray-700 text-sm font-bold mb-2'
        htmlFor={id}>
        {children}
      </label>
      <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        id={id}
        autoComplete='on'
        {...register}
        type={inputType}
        placeholder={placeholder}></input>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Fragment>
  );
};

export default InputText;
