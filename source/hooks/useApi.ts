import {useNavigation} from '@react-navigation/native';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {deleteItem} from 'services/storage';

interface UseApiProps<TData, TError> {
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  onSuccess?: (data: TData) => void;
}

export const useApi = <TData, TError>({
  queryKey,
  queryFn,
  onSuccess,
  ...rest
}: UseApiProps<TData, TError>) => {
  const navigation = useNavigation();
  const data = useQuery({
    queryKey,
    queryFn,
    onError: error => {
      switch (error?.response?.status) {
        case 401:
          {
            navigation.reset({
              index: 0,
              routes: [{name: 'OnboardingScreen'}],
            });
            deleteItem('userdetails');
            deleteItem('unreadNotification');
            deleteItem('token');
          }
          break;
        default:
          console.log(queryKey, ' errorr ', error?.response.data);
      }
    },
    onSuccess,
    ...rest,
  });

  return data;
};

interface UseInfiniteApiProps<TData, TError> {
  queryKey: unknown[];
  queryFunction: ({pageParam}: {pageParam?: number}) => Promise<TData>;
  onSuccess?: (data: TData) => void;
}

export function useInfiniteApi<TData, TError>({
  queryKey,
  queryFunction,
  onSuccess,
}: UseInfiniteApiProps<TData, TError>) {
  return useInfiniteQuery(queryKey, queryFunction, {
    retry: true,
    failureCount: 3,
    getNextPageParam: (lastPage, pages) => {
      const {currentPage, totalPages} = lastPage.paginationData;

      if (totalPages > currentPage) {
        return currentPage + 1;
      } else {
        return undefined;
      }
    },
    onSuccess,
  });
}
