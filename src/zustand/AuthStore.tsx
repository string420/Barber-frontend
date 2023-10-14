import { create } from "zustand";

interface AuthStore {
  user: string | null;
  setUser: (user: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem("mangubat-user-info") || null,
  setUser: (user) => {
    localStorage.setItem("mangubat-user-info", user);
    set({ user });
    setTimeout(() => {
      window.location.reload();
    }, 0);
  },
  clearUser: () => {
    localStorage.removeItem("mangubat-user-info");
    set({ user: null });
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("email");
      const newUrl = url.href;
      window.history.replaceState(null, "", newUrl);
      window.location.reload();
    }, 0);
  },
}));

export default useAuthStore;
