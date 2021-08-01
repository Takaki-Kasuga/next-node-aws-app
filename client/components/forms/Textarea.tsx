import React, { FC, Fragment } from 'react';

// npm package
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

// components
import { ErrorMessage } from '../styles/index';

interface TextareaProps {
  register: UseFormRegisterReturn;
  error: FieldError;
  placeholder: string;
  id: string;
  children: string;
}

const Textarea: FC<TextareaProps> = ({
  register,
  error,
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
      <textarea
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        id={id}
        autoComplete='on'
        {...register}
        placeholder={placeholder}></textarea>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Fragment>
  );
};

export default Textarea;
