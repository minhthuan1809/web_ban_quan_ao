import { create } from "zustand";

// Import types from centralized location
import type { UserState } from '../../../types/auth';

// Extended interface để thêm clearUser function
interface ExtendedUserState extends UserState {
  clearUser: () => void;
}

export const useUserStore = create<ExtendedUserState>((set) => ({
  user_Zustand: null,
  setUser_Zustand: (user) => set({ user_Zustand: user }),
  clearUser: () => set({ user_Zustand: null }),
}));
