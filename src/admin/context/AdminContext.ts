import type { AdminType } from '../../utils/AdminType'
import { create } from 'zustand'

type AdminStore = {
    admin: AdminType
    logaAdmin: (adminLogado: AdminType) => void
    deslogaAdmin: () => void
}

export const useAdminStore = create<AdminStore>((set) => {
    // lê token do localStorage **no momento da criação do store**
    const token = localStorage.getItem("token")
    const adminInicial: AdminType = token ? { token } as AdminType : {} as AdminType

    return {
        admin: adminInicial,
        logaAdmin: (adminLogado) => {
            localStorage.setItem("token", adminLogado.token)
            set({ admin: adminLogado })
        },
        deslogaAdmin: () => {
            localStorage.removeItem("token")
            set({ admin: {} as AdminType })
        }
    }
})
