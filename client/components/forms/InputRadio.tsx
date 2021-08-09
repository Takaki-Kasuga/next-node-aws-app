import React, { FC, Fragment } from 'react';

// npm package
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputRadioProps {
  register: UseFormRegisterReturn;
  id: string;
  children: string;
  type: string;
  value: string;
}

const InputRadio: FC<InputRadioProps> = ({
  register,
  id,
  children,
  type,
  value
}) => {
  return (
    <Fragment>
      <label
        className='block text-gray-700 text-sm font-bold mb-2'
        htmlFor={id}>
        <input
          id={id}
          {...register}
          type='radio'
          className='form-radio border-solid border-2 border-gray-300'
          name={type}
          value={value}
          autoComplete='on'
        />
        <span className='ml-3'>{children}</span>
      </label>
    </Fragment>
  );
};

export default InputRadio;
