import { Method } from 'axios';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import axios from '../util/axios';

export function useApiQuery<T>(route: string, params?: any) {
  const client = useQueryClient();
  const result = useQuery<T>([route, params], async () => {
    const response = await axios.get<T>(route, { params });
    return response.data;
  });
  return {
    ...result,
    invalidate: () => client.invalidateQueries([route]),
    remove: () => client.removeQueries([route]),
  };
}

export function usePaginatedQuery<T>(
  route: string,
  params: any,
  page = 0,
  pageSize = 10,
) {
  const client = useQueryClient();
  const key = [route, params, page, pageSize];
  const result = useQuery<SearchResults<T>>(
    key,
    async () => {
      const response = await axios.get<SearchResults<T>>(route, {
        params: {
          ...params,
          page,
          pageSize,
        },
      });
      return response.data;
    },
    { keepPreviousData: true },
  );
  return { ...result, invalidate: () => client.invalidateQueries(key) };
}

export function useApiInfiniteQuery<T>(
  route: string,
  params: any,
  pageSize = 10,
) {
  const client = useQueryClient();
  const key = [route, pageSize, params];
  const result = useInfiniteQuery(
    key,
    async ({ pageParam = 0 }) => {
      const response = await axios.get<SearchResults<T>>(route, {
        params: {
          ...params,
          pageSize,
          page: pageParam,
        },
      });
      return response.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.results.length !== pageSize) {
          return false;
        }
        return allPages.length;
      },
    },
  );
  return {
    ...result,
    invalidate: () => client.invalidateQueries(key),
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

export type ApiResource<T> = T & {
  meta: {
    createdAt: string;
    updatedAt: string;
    id: string;
  };
};

export interface SearchResults<T> {
  results: ApiResource<T>[];
  total: number;
}
