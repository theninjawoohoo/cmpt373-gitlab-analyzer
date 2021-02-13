import { Method } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from '../util/axios';

export function useApiQuery<T>(route: string) {
  const client = useQueryClient();
  const result = useQuery<T>([route], async () => {
    const response = await axios.get<T>(route);
    return response.data;
  });
  return {
    ...result,
    invalidate: () => client.invalidateQueries([route]),
    remove: () => client.removeQueries([route]),
  };
}

export function useApiMutation<T, B>(route: string, method: Method) {
  return useMutation<T, any, B>(route, async (body?) => {
    const result = await axios.request<T>({
      method,
      url: route,
      data: body,
    });
    return result.data;
  });
}
