import {SortDirection} from "mongodb";

export type InPutPaginationWithSearchName = {
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: string,
    pageSize?: string,
}