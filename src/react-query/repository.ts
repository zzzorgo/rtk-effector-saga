import { api } from "./api";
import { useQuery } from "react-query";

export interface Repository {
  name: string;
}

// ручка
const getRepositories = () => api.get<Repository[]>('https://api.github.com/repositories');

// ключ
const getRepositoriesQueryKey = () => 'repositories';

// хук
export const useRepositoriesQuery = () => useQuery(getRepositoriesQueryKey(), getRepositories);
