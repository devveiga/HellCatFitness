import type { UsuarioType } from '../utils/UsuarioType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UsuarioStore = {
    usuario: UsuarioType | null;
    logaUsuario: (usuarioLogado: UsuarioType) => void;
    deslogaUsuario: () => void;
};

export const useUsuarioStore = create<UsuarioStore>()(
    persist(
        (set) => ({
            usuario: null,
            logaUsuario: (clienteUsuario) => set({ usuario: clienteUsuario }),
            deslogaUsuario: () => set({ usuario: null }),
        }),
        {
            name: 'usuario-context', // chave do localStorage
        }
    )
);