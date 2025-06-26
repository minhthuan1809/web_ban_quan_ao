import { create } from 'zustand';

interface SearchState {
  search: string;
  type: string;
  setSearch: (search: string) => void;
  setType: (type: string) => void;
  resetSearch: () => void;
}

export const useAdminSearchStore = create<SearchState>((set) => ({
  search: '',
  type: '',
  setSearch: (search) => set({ search }),
  setType: (type) => set({ type }),
  resetSearch: () => set({ search: '', type: '' }),
})); 