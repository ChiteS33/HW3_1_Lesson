import {HttpStatuses, ResultStatus} from "../types/objectResultTypes";
import {HttpStatus} from "../../core/types/http-statuses";


export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch (resultCode) {
        case ResultStatus.Success:
            return HttpStatuses.Success
        case ResultStatus.Created:
            return HttpStatus.Created;
        case ResultStatus.NoContent:
            return HttpStatuses.NoContent;
        case ResultStatus.BadRequest:
            return HttpStatuses.BadRequest;
        case ResultStatus.Unauthorized:
            return HttpStatuses.Unauthorized
        case ResultStatus.Forbidden:
            return HttpStatuses.Forbidden;
        case ResultStatus.NotFound:
            return HttpStatuses.NotFound;
        default:
            return HttpStatuses.ServerError;
    }
};