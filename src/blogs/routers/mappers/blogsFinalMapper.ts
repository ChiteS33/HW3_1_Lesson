import {BlogOutPut} from "../../types/blogOutPut";

import {FinalWithPagination} from "../../../common/types/finalWithPagination";
import {OutPutPagination} from "../../../common/types/outputPagination";



export const outPutPaginationMapper = (dto: BlogOutPut[], params: OutPutPagination): FinalWithPagination<BlogOutPut> => {

    return {
        pagesCount: params.pagesCount,
        page: params.page,
        pageSize: params.pageSize,
        totalCount: params.totalCount,
        items: dto
    }
}