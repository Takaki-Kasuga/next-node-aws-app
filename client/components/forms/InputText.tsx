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
  disabled?: boolean;
  hidden?: boolean;
  accept?: string;
}

const InputText: FC<InputTextProps> = ({
  register,
  error,
  inputType,
  placeholder,
  id,
  children,
  disabled,
  hidden,
  accept
}) => {
  return (
    <Fragment>
      <label
        className={
          hidden ? 'upload-btn' : 'block text-gray-700 text-sm font-bold mb-2'
        }
        htmlFor={id}>
        {children}
      </label>
      <input
        hidden={hidden}
        accept={accept}
        disabled={disabled}
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        id={id}
        autoComplete='on'
        {...register}
        type={inputType}
        placeholder={placeholder}></input>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Fragment>
  );
};

InputText.defaultProps = { hidden: false, disabled: false };

export default InputText;
