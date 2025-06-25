import { create } from "zustand";


// Import types from centralized location
import type { UserState } from '../../../types/auth';

export const useUserStore = create<UserState>((set) => ({
  user_Zustand: null,
  setUser_Zustand: (user) => set({ user_Zustand: user }),
}));
