import {SortDirection} from "mongodb";

export type InPutPagination = {
    pageNumber?: string,
    pageSize?: string,
    sortBy?: string,
    sortDirection?: SortDirection,
}