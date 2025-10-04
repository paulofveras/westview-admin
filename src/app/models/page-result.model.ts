export interface PageResult<T> {
  page: number;
  pageSize: number;
  totalRecords: number;
  filteredRecords: number;
  data: T[];
}
