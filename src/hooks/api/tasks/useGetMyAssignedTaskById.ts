import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { MyAssignedTaskByIdDocument, MyAssignedTaskByIdQuery } from '@/api/graphql';

export const TASK_BY_ID_QUERY_KEY = (id: string) => ['tasks', 'detail', id];

export type TaskByIdQuery = Omit<MyAssignedTaskByIdQuery, 'myAssignedTaskById'> & {
    myAssignedTaskById:
        | (Omit<
              NonNullable<MyAssignedTaskByIdQuery['myAssignedTaskById']>,
              'images' | 'expenses'
          > & {
              images: ReadonlyArray<
                  NonNullable<
                      MyAssignedTaskByIdQuery['myAssignedTaskById']
                  >['images'][0] & {
                      unsaved?: boolean;
                      file?: {
                          id: string;
                          url: string;
                          key: string;
                      } | null;
                  }
              >;
              expenses: ReadonlyArray<
                  NonNullable<
                      MyAssignedTaskByIdQuery['myAssignedTaskById']
                  >['expenses'][0] & {
                      file?: {
                          id: string;
                          url: string;
                          key: string;
                      } | null;
                  }
              >;
          })
        | null;
};

export const useGetMyAssignedTaskById = (id: string) => {
    return useQuery<unknown, Error, TaskByIdQuery>({
        queryKey: ['tasks', 'detail', id],
        queryFn: () => fetchGraphql(MyAssignedTaskByIdDocument, { id }),
    });
};
