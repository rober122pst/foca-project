import { create } from 'zustand';

export const useModalStore = create((set) => ({
    currentModal: null,
    modalData: null,

    openModal: (name_, data = null) => set({ currentModal: name_, modalData: data }),
    closeModal: () => set({ currentModal: null, modalData: null }),
}));
