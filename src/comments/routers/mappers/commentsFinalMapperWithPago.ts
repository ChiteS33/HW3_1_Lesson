


import {FinalWithPagination} from "../../../common/types/finalWithPagination";
import {OutPutPagination} from "../../../common/types/outputPagination";
import {CommentOutPut} from "../../types/commentOutPut";



export const finalCommentsMapperWithPago = (dto: CommentOutPut[], params: OutPutPagination): FinalWithPagination<CommentOutPut> => {

    return {
        pagesCount: params.pagesCount,
        page: params.page,
        pageSize: params.pageSize,
        totalCount: params.totalCount,
        items: dto
    }
}