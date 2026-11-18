import {create} from "zustand";

// Holds the sign-up / sign-in form across the multi-step auth pages (in memory only).
type AuthFormData = {
    email?: string;
    password?: string;
};

type AuthStore = {
    formData: AuthFormData;
    setFormData: (data: Partial<AuthFormData>) => void;
    resetFormData: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    formData: {},
    setFormData: (data) => set((state) => ({formData: {...state.formData, ...data}})),
    resetFormData: () => set({formData: {}}),
}));
