import '../../login.css'
import { FaChevronRight } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Ring } from 'ldrs/react'
import 'ldrs/react/Ring.css'

export default function AuthPage() {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isVisibleLogin, setIsVisibleLogin] = useState(false);
    const [formLogin, setFormLogin] = useState({
        email: '',
        password: ''
    });
    const [formRegister, setFormRegister] = useState({
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [loginError, setLoginError] = useState('');

    const wrapperLogin = useRef(null);

    const toggleForm = () => {
        wrapperLogin.current.classList.toggle("active");
    };

    const togglePasswordLogin = () => {
        setIsVisibleLogin(!isVisibleLogin);
    }

    const handleChangeLogin = (e) => {
        setFormLogin({
            ...formLogin,
            [e.target.name]: e.target.value
        })
        setLoginError('');
    }

    const handleChangeRegister = (e) => {
        setFormRegister({
            ...formRegister,
            [e.target.name]: e.target.value
        })
        setLoginError('');
    }

    const calculateLoginProgress = () => {
        let percent = 0;
        if (formLogin.email) percent += 50;
        if (formLogin.password) percent += 50;
        return percent;
    }
    
    const handleSubmitLogin = (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);
        setTimeout(() => {
            if (formLogin.email === 'admin' && formLogin.password === 'admin') {
                alert(`Email: ${formLogin.email}\nPassword: ${formLogin.password}`);
            }else {
                setLoginError('Email ou senha incorretos');
            }
            setIsLoading(false);
        }, 1000)
    }
    
    useEffect(() => {
        const isRegister = searchParams.get('register');
        if (isRegister === 'true') {
            wrapperLogin.current.classList.add("active");
        }
    }, []);

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
                        <form className="form-content" onSubmit={handleSubmitLogin} id="form-signin">
                            <img src="/logos/foca_logo.svg" alt=""/>
                            <h1>Login</h1>
                            <div className="social-icons">
                                <a href="#" className="social-icon"><FcGoogle /></a>
                                <a href="#" className="social-icon"><FaFacebook /></a>
                            </div>
                            <div className="input-form email">
                                <input name='email' onChange={handleChangeLogin} value={formLogin.email} type="text" className="input-field" id="email-login" placeholder=" " />
                                <label className="input-label">
                                    <span className="label-name">Email</span>
                                    <span className="underline"></span>
                                </label>
                            </div>
                            <div className="input-form password">
                                <input name='password' onChange={handleChangeLogin} value={formLogin.password} type={isVisibleLogin ? 'text' : 'password'} className="input-field" id="senha-login" placeholder=" " />
                                <label className="input-label">
                                    <span className="label-name">Senha</span>
                                    <span className="underline"></span>
                                    {isVisibleLogin ? <span className="visible visibility" onClick={togglePasswordLogin}><FaRegEye /></span> :
                                    <span className="invisible visibility-off" onClick={togglePasswordLogin}><FaRegEyeSlash /></span>}
                                </label>
                            </div>
                            <span id="response-login">{loginError}</span>
                            <div className="input-form check">
                                <label className="input-check"><input type="checkbox" className="remember" id="remember-me"/> Manter logado</label>
                            </div>
                            <div className="input-form">
                                <button disabled={calculateLoginProgress() < 100 || isLoading} className="input-button login-button" type="submit">
                                    <div className={`progress-fill ${calculateLoginProgress() === 100 && 'complete'}`} style={{ width: `${calculateLoginProgress()}%` }}>
                                        <div className="progress-fill-text" style={{ width: `${calculateLoginProgress()}%` }}>{isLoading ? <Ring size={20} stroke={4} bgOpacity={0.3} speed={2} color='white' /> : 'Entrar'}</div>
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