import {SortDirection} from "mongodb";

export type PaginationForRepoWithSearchName = {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
}
