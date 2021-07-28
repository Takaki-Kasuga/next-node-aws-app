import React, { FC, Fragment } from 'react';
import { useAppSelector } from '../app/hooks';

// slice
import { alertState } from '../features/alert/alertSlice';

const Alert: FC = () => {
  const alert = useAppSelector(alertState);

  return (
    <Fragment>
      {alert.alertStatus.length > 0 &&
        alert.alertStatus.map((alertItem) => {
          return (
            <div
              key={alertItem.id}
              className={`container mx-auto mt-3 p-5 rounded w-9/12 ${alertItem.alertTypeBgColorName}`}>
              <p className={'text-white'}>{alertItem.message}</p>
              {/* <i className='text-white fas fa-times-circle'></i> */}
            </div>
          );
        })}
    </Fragment>
  );
};

export default Alert;
