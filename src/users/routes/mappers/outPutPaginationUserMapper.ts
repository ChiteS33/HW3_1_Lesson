import {OutPutPagination} from "../../../common/types/outputPagination";
import {FinalWithPagination} from "../../../common/types/finalWithPagination";
import {UserOutPut} from "../../types/userOutPut";

export const outPutPaginationUserMapper = (dto: UserOutPut[], params: OutPutPagination): FinalWithPagination<UserOutPut> => {

    return {
        pagesCount: params.pagesCount,
        page: params.page,
        pageSize: params.pageSize,
        totalCount: params.totalCount,
        items: dto
    }
}