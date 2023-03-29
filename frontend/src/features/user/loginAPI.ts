
import { getHttpClient, ApiReponse } from '../../utils/httpClient';
import { User } from '@backend/models';


export function _login(username:string, password: string): ApiReponse<User> {
  const cliente = getHttpClient(null);
  return cliente.post("/user/login", {username, password});
}