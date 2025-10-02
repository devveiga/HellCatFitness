import { Link } from "react-router-dom"
import { useUsuarioStore } from "../context/UsuarioContext"
import { useNavigate } from "react-router-dom"
import logo from "../assets/hellcat.png";


export default function Titulo() {
    const { usuario, deslogaUsuario } = useUsuarioStore()
    const navigate = useNavigate()

    function usuarioSair() {
        if (confirm("Confirma saída do sistema?")) {
            deslogaUsuario()
            if (localStorage.getItem("usuarioKey")) {
                localStorage.removeItem("usuarioKey")
            }
            navigate("/login")
        }
    }

    return (
        <nav className="border-blue-500 bg-blue-400 dark:bg-blue-800 dark:border-blue-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-20" alt="Logo HellCat" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        HellCat Fitness
                    </span>
                </Link>
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                        <li>
                            {usuario.id ?
                                <>
                                    <span className="text-black">
                                        {usuario.nome}
                                    </span>&nbsp;&nbsp;
                                    <Link to="/minhasPropostas" className="text-white font-bold bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:outline-none focus:ring-gray-400 rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                                        Agendamentos
                                    </Link>&nbsp;&nbsp;
                                    <span className="cursor-pointer font-bold text-gray-600"
                                        onClick={usuarioSair}>
                                        Sair
                                    </span>
                                </>
                                :
                                <Link to="/login" className="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-700 dark:text-white md:dark:hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    Entrar
                                </Link>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}