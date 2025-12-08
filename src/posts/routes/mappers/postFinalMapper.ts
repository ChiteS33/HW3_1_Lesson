import {PostOutPut} from "../../types/postOutPut";
import {FinalWithPagination} from "../../../common/types/finalWithPagination";
import {OutPutPagination} from "../../../common/types/outputPagination";


export const finalPostMapper = (dto: PostOutPut[], params: OutPutPagination): FinalWithPagination<PostOutPut> => {

    return {
        pagesCount: params.pagesCount,
        page: params.page,
        pageSize: params.pageSize,
        totalCount: params.totalCount,
        items: dto
    }
}