import { create } from "zustand";


interface UserState {
  user_Zustand: any | null;
  setUser_Zustand: (user: any | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user_Zustand: null,
  setUser_Zustand: (user) => set({ user_Zustand: user }),
}));
