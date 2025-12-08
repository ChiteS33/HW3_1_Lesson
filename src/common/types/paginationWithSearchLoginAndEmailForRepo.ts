import {SortDirection} from "mongodb";

export type PaginationWithSearchLoginTermAndSearchEMailTermForRepo = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string ,
    searchEmailTerm: string ,
}