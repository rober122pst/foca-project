import '../static/style.css'

import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    useEffect(() => {
        // Importando scripts, por que o React não deixa colocar script direto no HTML
        const script = document.createElement('script');

        script.src = "/src/static/scripts/main.js";
        script.async = true;

        document.body.appendChild(script);
        
        "use strict";var _cc=function(){function t(t,i){for(var s=0;s<i.length;s++){var e=i[s];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}return function(i,s,e){return s&&t(i.prototype,s),e&&t(i,e),i}}();function _ccc(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}!function(t){function i(t,i){var s=Math.tan(.017453*Math.abs(t));return Math.ceil(i*s)}function s(t){var i=void 0;return/^#([A-Fa-f0-9]{3}){1,2}$/.test(t)?(3===(i=t.substring(1).split("")).length&&(i=[i[0],i[0],i[1],i[1],i[2],i[2]]),{r:(i="0x"+i.join(""))>>16&255,g:i>>8&255,b:255&i}):{r:0,g:0,b:0}}var e=function(){function t(i,e,h){_ccc(this,t),this.o=h,this.r=s(i),this.d=this.grd(),this.h=this.grs(),this.s=Math.abs(this.gnfr(this.o.size)),this.srpgq(e),this.vx=this.gnfr(this.o.speed.x)*this.grd(),this.vy=this.gnfr(this.o.speed.y)*this.grd()}return _cc(t,[{key:"srpgq",value:function(t){var i=this.srpiq();return 3===t?(this.x=i.x+i.halfWidth,void(this.y=i.y)):2===t?(this.x=i.x,void(this.y=i.y+i.halfHeight)):1===t?(this.x=i.x+i.halfWidth,void(this.y=i.y+i.halfHeight)):(this.x=i.x,void(this.y=i.y))}},{key:"srpiq",value:function(){var t=this.o.c.w/2,i=this.o.c.h/2;return{x:Math.random()*t,y:Math.random()*i,halfHeight:i,halfWidth:t}}},{key:"gnfr",value:function(t){if(t.min===t.max)return t.min;var i=t.max-t.min;return Math.random()*i+t.min}},{key:"grd",value:function(){return Math.random()>.5?1:-1}},{key:"grs",value:function(){return this.o.shapes[Math.floor(Math.random()*this.o.shapes.length)]}},{key:"gr",value:function(t,i){return"rgba("+t.r+", "+t.g+", "+t.b+", "+i+")"}},{key:"an",value:function(t,s,e){this.o.size.pulse&&(this.s+=this.o.size.pulse*this.d,(this.s>this.o.size.max||this.s<this.o.size.min)&&(this.d*=-1),this.s=Math.abs(this.s)),this.x+=this.vx,this.y+=this.vy,this.x<0?(this.vx*=-1,this.x+=1):this.x>s&&(this.vx*=-1,this.x-=1),this.y<0?(this.vy*=-1,this.y+=1):this.y>e&&(this.vy*=-1,this.y-=1),t.beginPath(),this.o.blending&&"none"!==this.o.blending&&(t.globalCompositeOperation=this.o.blending);var h=this.gr(this.r,this.o.opacity.center),a=this.gr(this.r,this.o.opacity.edge),n="c"===this.h?this.s/2:"t"===this.h?.577*this.s:"s"===this.h?.707*this.s:this.s,o=t.createRadialGradient(this.x,this.y,.01,this.x,this.y,n);o.addColorStop(0,h),o.addColorStop(1,a),t.fillStyle=o;var r=Math.abs(this.s/2);if("c"===this.h&&t.arc(this.x,this.y,r,0,6.283185,!1),"s"===this.h){var c=this.x-r,l=this.x+r,u=this.y-r,d=this.y+r;t.moveTo(c,d),t.lineTo(l,d),t.lineTo(l,u),t.lineTo(c,u)}if("t"===this.h){var v=i(30,r),g=this.y+v;t.moveTo(this.x-r,g),t.lineTo(this.x+r,g),t.lineTo(this.x,this.y-2*v)}t.closePath(),t.fill()}}]),t}(),h=function(){function h(i){var s=this;_ccc(this,h),this.c=document.createElement("canvas"),this.x=this.c.getContext("2d"),this.c.setAttribute("id","finisher-canvas"),this.gr(i.className).appendChild(this.c);var e=void 0;t.addEventListener("resize",(function(){clearTimeout(e),e=setTimeout(s.resize.bind(s),150)}),!1),this.init(i),t.requestAnimationFrame(this.an.bind(this))}return _cc(h,[{key:"gr",value:function(t){var i=document.getElementsByClassName(t||"finisher-header");if(!i.length)throw new Error("No .finisher-header element found");return i[0]}},{key:"resize",value:function(){var t=this.gr(this.o.className);this.o.c={w:t.clientWidth,h:t.clientHeight},this.c.width=this.o.c.w,this.c.height=this.o.c.h;var s=i(this.o.skew,this.o.c.w/2),e="skewY("+this.o.skew+"deg) translateY(-"+s+"px)";this.c.setAttribute("style","position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;-webkit-transform:"+e+";transform:"+e+";outline: 1px solid transparent;background-color:rgba("+this.bc.r+","+this.bc.g+","+this.bc.b+",1);")}},{key:"init",value:function(t){this.o=t,this.bc=s(this.o.colors.background),this.ps=[],this.resize(),this.cp()}},{key:"cp",value:function(){var i=0;this.ps=[],this.o.ac=t.innerWidth<600&&this.o.count>5?Math.round(this.o.count/2):this.o.count;for(var s=0;s<this.o.ac;s++){var h=s%4,a=new e(this.o.colors.particles[i],h,this.o);++i>=this.o.colors.particles.length&&(i=0),this.ps[s]=a}}},{key:"an",value:function(){t.requestAnimationFrame(this.an.bind(this)),this.x.clearRect(0,0,this.o.c.w,this.o.c.h);for(var i=0;i<this.o.ac;i++){this.ps[i].an(this.x,this.o.c.w,this.o.c.h)}}}]),h}();t.FinisherHeader=h}(window);

        new FinisherHeader({
            "count": 10,
            "size": {
                "min": 1246,
                "max": 1392,
                "pulse": 0.3
            },
            "speed": {
                "x": {
                "min": 0.1,
                "max": 0.6
                },
                "y": {
                "min": 0.1,
                "max": 0.6
                }
            },
            "colors": {
                "background": "#270022",
                "particles": [
                "#ff0546",
                "#9c173b",
                "#660f31"
                ]
            },
            "blending": "lighten",
            "opacity": {
                "center": 0.5,
                "edge": 0.05
            },
            "skew": -2,
            "shapes": [
                "c"
            ]
        });

        return () => {
            document.body.removeChild(script);
        }
}, []);

  return (
    <>
        <section id="header">
            <div className="navbar-geral">
                <div className="title-container">
                    <Link className="header-title" to="/">
                        <picture>
                            <source srcSet="/logos/foca_logo_uncolor.svg" media="(max-width: 900px)" />
                            <source srcSet="/logos/foca_logo_uncolor_typo.svg" media="(min-width: 901px)" />
                            <img src="/logos/foca_logo_uncolor_typo.svg" alt="Logo Foca" className="logo-foca" />
                        </picture>
                    </Link>
                </div>
        
                <nav className="navbar">
                    <ul className="navbar-links">
                        <li>
                            <a href="#start-now">Início</a>
                        </li>
                        <li>
                            <a href="#about">Sobre</a>
                        </li>           
                        <li>
                            <a href="#functions">Benefícios</a>
                        </li>             
                    </ul>
                </nav>
            </div>
            <div className="cta-container">
                <Link to="/auth?register=true" className="signup-button cta-button invert"></Link>
            </div>     
        </section>
        
        <section id="start-now">
            <div className="hero-bg finisher-header" style={{width: '100%', height: '864px'}}>
            </div>
            <div className="wrapper-start">
                <div className="hero-container">
                    <h1 className="title">Diga adeus à procrastinação e foque no que importa!</h1>
                    <h4 className="subtitle">Transforme sua rotina em um jogo: foco, organização e produtividade com o Foca.
                    </h4>
                </div>
                <a href="/auth?register=true" className="cta-button invert"></a>
            </div>
            <div className="hero-image-container">
                <img src="/landing/alvo1.svg" />
            </div>
        </section>

        <section id="about">
            <div className="image-section">
                <img src="/landing/Mobile Marketing-amico.svg" alt="" />
            </div>
            <div className="wrapper wrapper-about">
                <div className="about-container">
                    <h1 className="title">Tá difícil focar? Relaxa, o Foca resolve.</h1>
                    <h4 className="subtitle">
                        O celular vibra, a notificação chama, a vida acontece... e o estudo? Fica pra depois (ou nunca). Mas calma. Tem solução.
                    </h4>
                </div>
            </div>
        </section>
        
        <section id="conheca">
            <div className="wrapper wrapper-conheca">
                <div className="conheca-container">
                    <h1 className="title">Conheça o Foca</h1>
                    <h4 className="subtitle">
                        Seu aliado na guerra contra o celular, os vídeos de gatinhos fofos e o “só mais uma partida”. Ele segura a bronca enquanto você foca no que importa: passar, aprender e vencer.
                    </h4>
                </div>
                <a href="/auth?register=true" className="cta-button"></a>
            </div>
            <div className="image-section">
                <img src="/landing/disabled student-amico.svg" alt="" />
            </div>
        </section>
        
        <div className="waves">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
            <div className="wave wave4"></div>
        </div>
        <section id="functions">
            <h1 className="title">Com o Foca, você</h1>
            <div id="rotina">
                <div className="image-section">
                    <img src="/landing/Learning-amico.svg" alt="" />
                </div>
                <div className="wrapper wrapper-rotina">
                    <div className="rotina-container">
                        <h1 className="title">Organiza sua rotina com IA</h1>
                        <h4 className="subtitle">
                            No Foca, você monta sua rotina de estudo do jeitinho que quiser, com pausas, prioridades e até tempo pra pensar na vida (ou dar uma olhadinha nos memes, vai). Aqui, quem manda é você.
                        </h4>
                    </div>
                    <a href="/auth?register=true" className="cta-button invert"></a>
                </div>
            </div>
        
            <div id="pontos">
                <div className="wrapper wrapper-pontos">
                    <div className="pontos-container">
                        <h1 className="title">Ganha pontos sendo produtivo</h1>
                        <h4 className="subtitle">
                            Estudar não precisa ser só sofrimento. Cada tarefa concluída viram pontos. Quanto mais você foca, mais você evolui.
                        </h4>
                    </div>
                    <a href="/auth?register=true" className="cta-button invert"></a>
                </div>
                <div className="image-section">
                    <img src="/landing/Gaming-amico.svg" alt="" />
                </div>
            </div>
            
            <div id="notificacao">
                <div className="image-section">
                    <img src="/landing/Push notifications-amico.svg" alt="" />
                </div>
                <div className="wrapper wrapper-notificacao">
                    <div className="notificacao-container">
                        <h1 className="title">Recebe notificações que te ajudam</h1>
                        <h4 className="subtitle">
                            As notificações do Foca aparecem só pra dar aquele toque na hora certa. São tipo um amigo que te cutuca quando você tá quase escorregando pra procrastinação.
                        </h4>
                    </div>
                    <a href="/auth?register=true" className="cta-button invert"></a>
                </div>
            </div>
        
            <div id="distracao">
                <div className="wrapper wrapper-distracao">
                    <div className="distracao-container">
                        <h1 className="title">Não se distrai</h1>
                        <h4 className="subtitle">
                            Sabe aquele momento que você finalmente senta pra estudar... e dois cliques depois tá vendo a letra de uma música? Então. O Foca bloqueia esses apps e jogos ladrões de atenção enquanto você estuda. É tipo um segurança na porta do seu foco.
                        </h4>
                    </div>
                    <a href="/auth?register=true" className="cta-button invert"></a>
                </div>
                <div className="image-section">
                    <img src="/landing/Warning-amico.svg" alt="" />
                </div>
            </div>
        </section>

        <section id="cta-final">
            <div className="cta-final-container">
                <img className="divider" src="/landing/divider.svg" alt="" />
                <h1 className="title">Tá esperando o quê?</h1>
                <p className="subtitle">Deixe de ser um procrastinador a partir de agora. Não deixe o Tik Tok te vencer de novo!</p>
                <a href="/auth?register=true" className="cta-button invert"></a>
            </div>
        </section>

        <section id="footer">
            <footer>
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="#about">Sobre</a>
                        <a href="#functions">Benefícios</a>
                        <a href="#start-now">Início</a>
                    </div>
                    <div className="footer-image">
                        <img src="/logos/foca_logo_uncolor.svg" alt="Logo Foca" />
                    </div>
                    <div className="footer-socials">
                        <a href="https://www.facebook.com" target="_blank" aria-label="Facebook">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a href="https://www.instagram.com/app.foca/" target="_blank" aria-label="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="https://www.twitter.com" target="_blank" aria-label="Twitter">
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>
                    </div>
                    
                    <div className="footer-copyright">
                        <p>&copy; 2025 Foca. Todos os direitos reservados.</p>
                        <p><a href="https://storyset.com/" style={{textDecoration: 'none', color: '#0098db'}}>Illustrations by Storyset</a></p>
                    </div>
                </div>
            </footer>
        </section>
    </>
  );
}

export default LandingPage;
