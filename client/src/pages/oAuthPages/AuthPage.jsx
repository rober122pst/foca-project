import '../../login.css'
import { FaChevronRight } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useEffect, useRef } from 'react';

export default function AuthPage() {
    const wrapperLogin = useRef(null)

    const toggleForm = () => {
        wrapperLogin.current.classList.toggle("active");
    };

    return (
        <>
            <section id="login">
                <div className="wrapper-login" ref={wrapperLogin}>
                    <div className="sign-up-container">
                        <div className="sidebar">
                            <div className="sidebar-content register">
                                <h1>Bem-vindo<br/>de volta!
                                    <p>Não tem uma conta? <b>Registre-se</b> agora e começe a focar!</p>
                                </h1>
                            </div>
                        </div>
                        <div className="sign-up-button" onClick={toggleForm}>
                            <FaChevronRight />
                        </div>
                            <form className="form-content" onsubmit="submitRegister()" id="form-signup">
                                
                                <img src="/logos/foca_logo_uncolor.svg" alt=""/>
                                <h1>Criar Conta</h1>
                                <div className="social-icons">
                                    <a href="#" className="social-icon"><FaGoogle /></a>
                                    <a href="#" className="social-icon"><FaFacebook /></a>
                                </div>
                                <div className="input-form username">
                                    <input type="text" className="input-field" id="nickname" placeholder=" " />
                                    <label className="input-label">
                                        <span className="label-name">Nickname</span>
                                        <span className="underline"></span>
                                    </label>
                                </div>
                                <div className="input-form email">
                                    <input type="email" className="input-field" id="email-register" placeholder=" " />
                                    <label className="input-label">
                                        <span className="label-name">Email</span>
                                        <span className="underline"></span>
                                    </label>
                                </div>
                                <div className="input-form password">
                                    <input type="password" className="input-field" id="senha-register" placeholder=" " />
                                    <label className="input-label">
                                        <span className="label-name">Senha</span>
                                        <span className="underline"></span>
                                        <span className="visible material-symbols-rounded visibility" onClick={() => {}}>visibility</span>
                                        <span className="invisible material-symbols-rounded visibility-off" onClick={() => {}}>visibility_off</span>
                                    </label>
                                </div>
                                <div className="input-form password">
                                    <input type="password" className="input-field" id="senha-confirm" placeholder=" " />
                                    <label className="input-label">
                                        <span className="label-name">Confirmar Senha</span>
                                        <span className="underline"></span>
                                        <span className="visible material-symbols-rounded visibility" onClick={() => {}}>visibility</span>
                                        <span className="invisible material-symbols-rounded visibility-off" onClick={() => {}}>visibility_off</span>
                                    </label>
                                </div>
                                <h3 id="response-register"></h3>
                                <div className="input-form check">
                                    <label className="input-check"><input type="checkbox" className="remember" id="termos-servicos"/> Aceitar <a href="" style={{textDecoration: 'none', color: '#0098db'}}>Termos e Condições</a></label>
                                </div>
                                <div className="input-form">
                                    <button disabled className="input-button login-button" type="submit">
                                        <div className="progress-fill">
                                            <div className="progress-fill-text">Registrar</div>
                                        </div>
                                    </button>
                                </div>
                            </form>               
                    </div>
                    <div className="sign-in-container">
                        <div className="sidebar">
                            <div className="sidebar-content login">
                                <h1>Seja<br/>bem vindo!
                                    <p>Já tem uma conta? Faça login e volte a focar!</p>
                                </h1>
                            </div>
                        </div>
                        <form className="form-content" onsubmit="submitLogin()" id="form-signin">
                            <img src="/logos/foca_logo.svg" alt=""/>
                            <h1>Login</h1>
                            <div className="social-icons">
                                <a href="#" className="social-icon"><FcGoogle /></a>
                                <a href="#" className="social-icon"><FaFacebook /></a>
                            </div>
                            <div className="input-form email">
                                <input type="email" className="input-field" id="email-login" placeholder=" " />
                                <label className="input-label">
                                    <span className="label-name">Email</span>
                                    <span className="underline"></span>
                                </label>
                            </div>
                            <div className="input-form password">
                                <input type="password" className="input-field" id="senha-login" placeholder=" " />
                                <label className="input-label">
                                    <span className="label-name">Senha</span>
                                    <span className="underline"></span>
                                    <span className="visible material-symbols-rounded visibility" onClick={() => {}}><FaRegEye /></span>
                                    <span className="invisible material-symbols-rounded visibility-off" onClick={() => {}}><FaRegEyeSlash /></span>
                                </label>
                            </div>
                            <h3 id="response-login"></h3>
                            <div className="input-form check">
                                <label className="input-check"><input type="checkbox" className="remember" id="remember-me"/> Manter logado</label>
                            </div>
                            <div className="input-form">
                                <button disabled className="input-button login-button" type="submit">
                                    <div className="progress-fill">
                                        <div className="progress-fill-text">Entrar</div>
                                    </div>
                                </button>
                            </div>
                            <a className="esqueci-senha" href="./forgot.html">Esqueceu a senha?</a>
                        </form>               
                    </div>
                </div>
                <div className="waves">
                    <div className="wave wave1"></div>
                    <div className="wave wave2"></div>
                    <div className="wave wave3"></div>
                    <div className="wave wave4"></div>
                </div>
            </section>
        </>
    );
}