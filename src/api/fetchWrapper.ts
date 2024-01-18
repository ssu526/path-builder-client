import {
  BadRequestError,
  ConflictError,
  PageNotFoundError,
  UnauthorizedError,
} from "../errors/http_errors";

export const fetchWrapper = async (url: RequestInfo, init?: RequestInit) => {
  const response = await fetch(url, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    switch (response.status) {
      case 400:
        throw new BadRequestError(errorMessage);
      case 401:
        throw new UnauthorizedError(errorMessage);
      case 4004:
        throw new PageNotFoundError(errorMessage);
      case 409:
        throw new ConflictError(errorMessage);
      default:
        throw Error(
          "Request failed with status: " +
            response.status +
            ". message: " +
            errorMessage
        );
    }
  }
};
