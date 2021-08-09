import React, { FC, Fragment } from 'react';
import { useAppSelector } from '../../app/hooks';

// slice
import { successAlertState } from '../../features/alert/successAlertSlice';

const Alert: FC = () => {
  const successAlert = useAppSelector(successAlertState);

  return (
    <Fragment>
      {successAlert.successAlertStatus.length !== 0
        ? successAlert.successAlertStatus.map((successAlertItem) => (
            <div
              key={successAlertItem.id}
              className={`bg-green-500 container mx-auto mt-3 p-5 rounded w-9/12`}>
              <p className='text-white'>{successAlertItem.message}</p>
            </div>
          ))
        : null}
    </Fragment>
  );
};

export default Alert;
