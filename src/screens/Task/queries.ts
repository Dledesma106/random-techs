import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { MyAssignedTaskByIdDocument, MyAssignedTaskByIdQuery } from '@/api/graphql';

export const TASK_BY_ID_QUERY_KEY = (id: string) => ['tasks', 'detail', id];

export type TaskByIdQuery = Omit<MyAssignedTaskByIdQuery, 'myAssignedTaskById'> & {
    myAssignedTaskById:
        | (Omit<NonNullable<MyAssignedTaskByIdQuery['myAssignedTaskById']>, 'images'> & {
              images: ReadonlyArray<
                  NonNullable<
                      MyAssignedTaskByIdQuery['myAssignedTaskById']
                  >['images'][0] & {
                      unsaved?: boolean;
                  }
              >;
          })
        | null;
};

export const useTaskByIdQuery = (id: string) => {
    return useQuery<unknown, Error, TaskByIdQuery>({
        queryKey: ['tasks', 'detail', id],
        queryFn: () => fetchGraphql(MyAssignedTaskByIdDocument, { id }),
    });
};
