import React, { FC, Fragment } from 'react';
import { useAppSelector } from '../../app/hooks';

// slice
import { alertState } from '../../features/alert/alertSlice';

const Alert: FC = () => {
  const alert = useAppSelector(alertState);

  return (
    <Fragment>
      {alert.alertStatus.length > 0 &&
        alert.alertStatus.map((alertItem) => {
          return (
            <div
              key={alertItem.id}
              className={`bg-${alertItem.alertTypeBgColorName} container mx-auto mt-3 p-5  rounded w-9/12`}>
              <p className='text-black'>{alertItem.message}</p>
            </div>
          );
        })}
    </Fragment>
  );
};

export default Alert;
