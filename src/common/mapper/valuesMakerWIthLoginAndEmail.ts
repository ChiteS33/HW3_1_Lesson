import {
    InPutPaginationWithSearchLoginTermAndSearchEMailTerm
} from "../types/inPutPaginationWithSearchLoginTermAndSearchEmailTerm";

import {
    PaginationWithSearchLoginTermAndSearchEMailTermForRepo
} from "../types/paginationWithSearchLoginAndEmailForRepo";

export const valuesMakerWithSearchLoginAndEmail = (query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm): PaginationWithSearchLoginTermAndSearchEMailTermForRepo => {
    return {
        sortBy: query.sortBy ?? "createdAt",
        sortDirection: query.sortDirection ?? "desc",
        pageNumber: query.pageNumber ? Number(query.pageNumber) : 1,
        pageSize: query.pageSize ? Number(query.pageSize) : 10,
        searchLoginTerm: query.searchLoginTerm ?? "",
        searchEmailTerm: query.searchEmailTerm ?? "",
    }
}