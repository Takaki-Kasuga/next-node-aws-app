import React, { FC, Fragment } from 'react';
import { useAppSelector } from '../../app/hooks';

// slice
import { dangerAlertState } from '../../features/alert/dangerAlertSlice';

const Alert: FC = () => {
  const dangerAlert = useAppSelector(dangerAlertState);

  return (
    <Fragment>
      {dangerAlert.dangerAlertStatus.length !== 0
        ? dangerAlert.dangerAlertStatus.map((dangerAlertItem) => (
            <div
              key={dangerAlertItem.id}
              className={`bg-red-500 container mx-auto mt-3 p-5 rounded w-9/12`}>
              <p className='text-white'>{dangerAlertItem.message}</p>
            </div>
          ))
        : null}
    </Fragment>
  );
};

export default Alert;
