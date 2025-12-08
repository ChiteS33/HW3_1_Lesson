import {InPutPagination} from "../types/inPutPagination";
import {PaginationForRepo} from "../types/paginationForRepo";

export const valuesPaginationMaker = (query: InPutPagination): PaginationForRepo => {
    return {
        pageNumber: query.pageNumber ? Number(query.pageNumber) : 1,
        pageSize: query.pageSize ? Number(query.pageSize) : 10,
        sortBy: query.sortBy ?? "createdAt",
        sortDirection: query.sortDirection ?? "desc"
    }
}

