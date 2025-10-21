import type { AdminType } from '../../utils/AdminType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AdminStore = {
    admin: AdminType | null;
    logaAdmin: (adminLogado: AdminType) => void;
    deslogaAdmin: () => void;
};

export const useAdminStore = create<AdminStore>()(
    persist(
        (set) => ({
            admin: null,
            logaAdmin: (adminLogado) => set({ admin: adminLogado }),
            deslogaAdmin: () => set({ admin: null }),
        }),
        {
            name: 'admin-context', // chave usada no localStorage
        }
    )
);
