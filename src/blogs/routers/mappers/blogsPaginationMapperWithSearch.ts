
import {PaginationForRepoWithSearchName} from "../../../common/types/paginationForRepoWithSearchName";
import {InPutPaginationWithSearchName} from "../../../common/types/inPutPaginationWithSearchName";


export const valuesMakerWithSearch = (query: InPutPaginationWithSearchName): PaginationForRepoWithSearchName => {
    return {
        searchNameTerm: query.searchNameTerm ?? null,
        sortBy: query.sortBy ?? "createdAt",
        sortDirection: query.sortDirection ?? "desc",
        pageNumber: query.pageNumber ? Number(query.pageNumber) : 1,
        pageSize: query.pageSize ? Number(query.pageSize) : 10,
    }

}