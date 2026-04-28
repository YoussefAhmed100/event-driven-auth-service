 export interface IQueryBuilder<T> {
  filter(): this;
  sort(): this;
  limitFields(): this;
  search(searchFields: string[]): this;
  paginate(totalDocuments: number): this;
  count(): Promise<number>;
  exec(): Promise<T[]>;
}