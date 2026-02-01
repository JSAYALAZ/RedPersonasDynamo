
export interface GetUserNameRepository {
  getNameById(id:string): Promise<string>;
}
