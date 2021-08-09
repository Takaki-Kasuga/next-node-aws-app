import { AxiosResponse } from 'axios';

export const prepareErrorData = (
  uuid: string,
  response: AxiosResponse<any>
) => {
  let id = uuid;
  let errorObject = response;
  let message = errorObject!.data.message;
  const errorData = { id, errorObject, message };

  return errorData;
};
