import { useCallback, useEffect, useState } from 'react';

export enum RequestStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Failed = 'error'
}

export namespace RequestStatus {
  type T = RequestStatus;
  export const isIdle = (...statuses: T[]) => statuses.some((status) => status === RequestStatus.Idle);

  export const isLoading = (...statuses: T[]) => statuses.some((status) => status === RequestStatus.Loading);

  export const isSuccess = (...statuses: T[]) => statuses.every((status) => status === RequestStatus.Success);

  export const isFailure = (...statuses: T[]) => statuses.some((status) => status === RequestStatus.Failed);
}

interface SuccessReturn<T> {
  data: T;
  status: RequestStatus.Success;
  error: null;
}

interface IdleReturn {
  data: null;
  status: RequestStatus.Idle;
  error: null;
}

interface LoadingReturn<T> {
  data: null | T;
  status: RequestStatus.Loading;
  error: null;
}

interface ErrorReturn {
  data: null;
  status: RequestStatus.Failed;
  error: string;
}

type FetchReturn<T> = LoadingReturn<T> | ErrorReturn | IdleReturn | SuccessReturn<T>;

type FetchDataReturn<T> = FetchReturn<T> & {
  reload: () => void;
  mutate: (state: Partial<FetchReturn<T>>) => void;
};

const initialState = {
  data: null,
  error: null,
  status: RequestStatus.Idle
} as const;

export const useFetch = <T,>(callback: () => boolean | Promise<T>, deps: unknown[] = []): FetchDataReturn<T> => {
  const [state, setState] = useState<FetchReturn<T>>(initialState);

  const reload = useCallback(() => {
    setState(initialState);

    const promise = callback();

    if (!(promise instanceof Promise)) return;

    setState({
      data: null,
      error: null,
      status: RequestStatus.Loading
    });
    promise
      .then((data) => setState({ data, error: null, status: RequestStatus.Success }))
      .catch((error) => setState({ data: null, error, status: RequestStatus.Failed }));
  }, [callback]);

  const mutate = useCallback(
    (data: Partial<FetchReturn<T>>) => {
      if (!RequestStatus.isSuccess(state.status)) return;

      //@ts-expect-error - we know that data is FetchReturn<T>
      setState((state) => ({ ...state, ...data }));
    },
    [state.status]
  );

  useEffect(() => {
    reload();
  }, [...deps]);

  return { ...state, reload, mutate } as const;
};
