import {SortDirection} from "mongodb";

export type PaginationForRepo = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
}