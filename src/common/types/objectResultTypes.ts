type ExtensionType = {
    field: string | null;
    message: string;
};

export type ObjectResult<T = null> = {
    status: ResultStatus;
    errorMessage?: string;
    extensions: ExtensionType[];
    data: T;
};

export enum ResultStatus {
    Success = 'Success',
    Created = 'Created',
    NoContent = 'NoContent',
    BadRequest = 'BadRequest',
    Unauthorized = 'Unauthorized',
    Forbidden = 'Forbidden',
    NotFound = 'NotFound',
    InternalServerError = 'InternalServerError',
}

export enum HttpStatuses {
    Success = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    ServerError = 500,
}