import { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import LogoCadastro from "../../assets/logos/foca_icon.ico";
import LogoLogin from "../../assets/logos/foca_logo.svg";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);



    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-[var(--bg-primary)] p-6">
            
            <div
                className={`relative w-[1550px] max-w-[95vw] h-[820px] bg-white rounded-3xl shadow-xl overflow-hidden 
                transition-opacity duration-300
                ${mounted ? "opacity-100" : "opacity-0"}`}
            >

                {/* LEFT PANEL - Cadastro */}
                <div
                    className={`absolute top-0 left-0 h-full w-1/2 p-10 transition-transform duration-500 ease-in-out
                    ${isLogin ? "-translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"}
                    bg-gradient-to-b from-[var(--color-items-primary)] to-[var(--color-items-second)] text-white`}
                >
                    <img src={LogoCadastro} alt="logo" className="w-28 mx-auto mb-4" />

                    <h2 className="text-6xl font-extrabold text-center mb-2">Criar Conta</h2>
                    <p className="text-lg text-center opacity-90 mb-8">
                        Crie sua conta e aproveite nossas funcionalidades.
                    </p>

                    <form className="flex flex-col gap-6 max-w-[380px] mx-auto text-lg">
                        <input className="bg-transparent border-b border-white/30 p-3 placeholder-white/60 focus:outline-none" placeholder="Nickname" />
                        <input className="bg-transparent border-b border-white/30 p-3 placeholder-white/60 focus:outline-none" placeholder="Email" />
                        <input className="bg-transparent border-b border-white/30 p-3 placeholder-white/60 focus:outline-none" placeholder="Senha" type="password" />
                        <input className="bg-transparent border-b border-white/30 p-3 placeholder-white/60 focus:outline-none" placeholder="Confirmar senha" type="password" />

                        <button className="mt-6 bg-white text-[var(--color-items-primary)] font-bold p-4 rounded-md hover:bg-gray-100 transition text-lg">
                            Cadastrar
                        </button>
                    </form>
                </div>

                {/* RIGHT PANEL - Login */}
                <div
                    className={`absolute top-0 right-0 h-full w-1/2 p-10 transition-transform duration-500 ease-in-out
                    ${isLogin ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}
                    bg-[var(--bg-third)]`}
                >
                    <img src={LogoLogin} alt="logo" className="w-28 mx-auto mb-4" />

                    <h2 className="text-6xl font-extrabold text-center text-[var(--color-items-primary)] mb-2">Login</h2>
                    <p className="text-center text-lg mb-10">Entre com suas credenciais.</p>

                    <form className="flex flex-col gap-6 max-w-[380px] mx-auto text-lg">
                        <input className="p-4 bg-white border border-gray-200 rounded-md focus:outline-none" placeholder="Email" />
                        <input className="p-4 bg-white border border-gray-200 rounded-md focus:outline-none" placeholder="Senha" type="password" />
                        <button className="mt-4 bg-[var(--color-items-primary)] text-white font-bold p-4 rounded-md hover:bg-[var(--color-items-second)] transition text-lg">
                            Entrar
                        </button>
                        <button className="text-sm text-[var(--accent)] mt-2 hover:underline">
                            Esqueceu a senha?
                        </button>
                    </form>
                </div>

                {/* LEFT STATIC TEXT (para tela de login) */}
                <div
                    className={`absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center text-center 
                    transition-all duration-500 px-10
                    bg-gradient-to-b from-[var(--color-items-primary)] to-[var(--color-items-second)]
                    ${isLogin ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20 pointer-events-none"}`}
                >
                    <h1 className="text-white text-7xl font-extrabold mb-4">Bem vindo de volta!</h1>
                    <p className="text-white/90 text-2xl max-w-[450px]">
                        Não tem uma conta? Registre-se agora e comece a focar!
                    </p>
                </div>

                {/* RIGHT STATIC TEXT (para tela de cadastro) */}
                <div
                    className={`absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center text-center 
                    transition-all duration-500 px-10
                    bg-[var(--bg-third)]
                    ${isLogin ? "opacity-0 translate-x-20 pointer-events-none" : "opacity-100 translate-x-0"}`}
                >
                    <h1 className="text-[var(--color-items-primary)] text-7xl font-extrabold mb-4">Seja bem vindo!</h1>
                    <p className="text-[var(--color-items-primary)] text-2xl max-w-[450px]">
                        Já tem uma conta? Faça login e volte a focar!
                    </p>
                </div>

                {/* CIRCLE ARROW */}
                <button
                    onClick={() => setIsLogin((s) => !s)}
                    aria-label={isLogin ? "Voltar para cadastro" : "Ir para login"}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                    w-24 h-24 rounded-full bg-[var(--color-items-primary)] text-white flex items-center justify-center
                    shadow-2xl border-4 border-white/10 z-30 transform transition-all hover:scale-110"
                >
                    {isLogin ? <FaArrowLeft size={28} /> : <FaArrowRight size={28} />}
                </button>

                <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] bg-white/10 pointer-events-none z-20"></div>
            </div>
        </div>
    );
}
