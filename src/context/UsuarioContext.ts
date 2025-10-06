import type { UsuarioType } from '../utils/UsuarioType'
import { create } from 'zustand'

type UsuarioStore = {
    usuario: UsuarioType
    logaUsuario: (usuarioLogado: UsuarioType) => void
    deslogaUsuario: () => void
    
}

export const useUsuarioStore = create<UsuarioStore>((set) => ({
    usuario: {} as UsuarioType,
    logaUsuario: (clienteUsuario) => set({usuario: clienteUsuario}),
    deslogaUsuario: () => set({usuario: {} as UsuarioType})
}))