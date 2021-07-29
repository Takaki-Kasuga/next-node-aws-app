import { AxiosResponse } from 'axios';

export const prepareErrorData = (
  uuid: string,
  response: AxiosResponse<any>
) => {
  let id = uuid;
  let errorObject = response;
  let statusCode = errorObject!.status;
  let message = errorObject!.data.message;
  const errorData = { id, errorObject, statusCode, message };

  return errorData;
};
