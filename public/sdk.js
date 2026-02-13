"use strict";(()=>{(function(){let u=document.currentScript,m=u?.getAttribute("data-app-id")??"",J=u?.getAttribute("data-theme")??"light",x=u?.getAttribute("data-accent")??"#2563eb",K=u?.getAttribute("data-locale")??"en",L=u?.getAttribute("data-mode")??"modal",g=u?.src?new URL(u.src).origin:window.location.origin;m||console.warn("[AdMan SDK] Missing data-app-id attribute on script tag.");let D={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In",zh:"\u767B\u5165"},"btn.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"switch.toRegister":{en:"Don't have an account? Sign up",zh:"\u6C92\u6709\u5E33\u865F\uFF1F\u8A3B\u518A"},"switch.toLogin":{en:"Already have an account? Sign in",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F\u767B\u5165"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."}};function a(e){return D[e]?.[K]??D[e]?.en??e}let U=`adman_${m}_`,I=`${U}access_token`,R=`${U}refresh_token`;function y(){return localStorage.getItem(I)}function M(){return localStorage.getItem(R)}function k(e,t){localStorage.setItem(I,e),localStorage.setItem(R,t)}function v(){localStorage.removeItem(I),localStorage.removeItem(R)}async function $(e,t){let n=await fetch(`${g}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),r=await n.json();if(!n.ok)throw new Error(r.error??a("error.generic"));return r}async function B(e,t){let n=await fetch(`${g}${e}`,{headers:{Authorization:`Bearer ${t}`}}),r=await n.json();if(!n.ok)throw new Error(r.error??a("error.generic"));return r}let o=null,T=!1,S=[],h=null;function p(){for(let e of S)try{e(o)}catch{}}function Y(e){try{let t=JSON.parse(atob(e.split(".")[1]));return t.exp?t.exp*1e3:null}catch{return null}}function b(){h&&clearTimeout(h);let e=y();if(!e)return;let t=Y(e);if(!t)return;let n=t-Date.now()-300*1e3;if(n<=0){N();return}h=setTimeout(N,n)}async function N(){let e=M();if(e)try{let t=await $("/api/auth/refresh",{refreshToken:e});k(t.accessToken,t.refreshToken),b()}catch{v(),o=null,p()}}async function P(){let e=y();if(!e){T=!0,p();return}try{o=(await B("/api/auth/me",e)).user,b()}catch{let t=M();if(t)try{let n=await $("/api/auth/refresh",{refreshToken:t});k(n.accessToken,n.refreshToken),o=(await B("/api/auth/me",n.accessToken)).user,b()}catch{v()}else v()}T=!0,p()}let i=J==="dark",G=i?"#1e1e2e":"#ffffff",_=i?"#cdd6f4":"#1e293b",E=i?"#a6adc8":"#64748b",O=i?"#313244":"#f8fafc",X=`
    :host {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .adman-card {
      background: ${G}; color: ${_}; border-radius: 16px;
      padding: 36px; width: 100%; max-width: 400px; position: relative;
      box-shadow: 0 24px 64px rgba(0,0,0,0.35);
    }
    .adman-close {
      position: absolute; top: 14px; right: 14px; background: none; border: none;
      font-size: 22px; cursor: pointer; color: ${E}; padding: 4px 8px;
      border-radius: 6px; line-height: 1; transition: background 0.15s;
    }
    .adman-close:hover { background: ${O}; }
    .adman-title {
      font-size: 24px; font-weight: 700; margin-bottom: 28px; text-align: center;
      letter-spacing: -0.3px;
    }
    .adman-field { margin-bottom: 18px; }
    .adman-label {
      display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;
      color: ${E}; letter-spacing: 0.2px;
    }
    .adman-input {
      display: block; width: 100%; padding: 11px 14px;
      border: 1.5px solid ${i?"#45475a":"#e2e8f0"}; border-radius: 10px;
      font-size: 15px; font-family: inherit;
      background: ${O}; color: ${_};
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .adman-input:focus {
      border-color: ${x};
      box-shadow: 0 0 0 3px ${x}22;
    }
    .adman-input::placeholder { color: ${E}; opacity: 0.6; }
    .adman-btn {
      display: block; width: 100%; padding: 13px; border: none; border-radius: 10px;
      font-size: 15px; font-weight: 600; font-family: inherit; cursor: pointer;
      background: ${x}; color: #fff; margin-top: 12px;
      transition: opacity 0.2s, transform 0.1s;
    }
    .adman-btn:hover { opacity: 0.92; }
    .adman-btn:active { transform: scale(0.99); }
    .adman-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .adman-switch {
      text-align: center; margin-top: 20px; font-size: 13px; color: ${E};
    }
    .adman-switch a {
      color: ${x}; cursor: pointer; text-decoration: none; font-weight: 600;
    }
    .adman-switch a:hover { text-decoration: underline; }
    .adman-error {
      background: ${i?"#3b1c1c":"#fef2f2"};
      color: ${i?"#f87171":"#dc2626"};
      padding: 11px 14px; border-radius: 10px;
      font-size: 13px; margin-bottom: 18px;
      border: 1px solid ${i?"#5c2828":"#fecaca"};
    }
    @media (max-width: 480px) {
      .adman-card { margin: 16px; padding: 28px; }
    }
  `;function q(e){let t=document.getElementById("adman-auth-host");t&&t.remove();let n=e,r="",w=!1,s=document.createElement("div");s.id="adman-auth-host",s.style.cssText="position:fixed;inset:0;z-index:99999;";let c=s.attachShadow({mode:"closed"});function A(){let d=n==="login";c.innerHTML=`
        <style>${X}</style>
        <div class="adman-card">
          <button class="adman-close" id="adman-close-btn">&times;</button>
          <div class="adman-title">${a(d?"title.login":"title.register")}</div>
          ${r?`<div class="adman-error">${r}</div>`:""}
          <form id="adman-auth-form">
            ${d?"":`
              <div class="adman-field">
                <label class="adman-label">${a("label.displayName")}</label>
                <input class="adman-input" type="text" name="displayName" required />
              </div>
            `}
            <div class="adman-field">
              <label class="adman-label">${a("label.email")}</label>
              <input class="adman-input" type="email" name="email" required />
            </div>
            <div class="adman-field">
              <label class="adman-label">${a("label.password")}</label>
              <input class="adman-input" type="password" name="password" required minlength="${d?1:8}" />
            </div>
            <button class="adman-btn" type="submit" ${w?"disabled":""}>
              ${a(w?"msg.loading":d?"btn.login":"btn.register")}
            </button>
          </form>
          <div class="adman-switch">
            <a id="adman-switch-mode">
              ${a(d?"switch.toRegister":"switch.toLogin")}
            </a>
          </div>
        </div>
      `,c.getElementById("adman-close-btn")?.addEventListener("click",()=>s.remove()),c.addEventListener("click",z=>{if(z.target===c.firstElementChild?.nextElementSibling)return;let f=c.querySelector(".adman-card");f&&!f.contains(z.target)&&s.remove()}),c.getElementById("adman-switch-mode")?.addEventListener("click",()=>{n=d?"register":"login",r="",A()});let F=c.getElementById("adman-auth-form");F?.addEventListener("submit",async z=>{if(z.preventDefault(),w)return;w=!0,r="",A();let f=new FormData(F),H=f.get("email"),j=f.get("password");try{if(d){let l=await $("/api/auth/login",{appId:m,email:H,password:j});k(l.accessToken,l.refreshToken),o=l.user,b(),p(),s.remove()}else{let l=f.get("displayName"),C=await $("/api/auth/register",{appId:m,email:H,password:j,displayName:l});k(C.accessToken,C.refreshToken),o=C.user,b(),p(),s.remove()}}catch(l){r=l instanceof Error?l.message:a("error.generic"),w=!1,A()}})}A(),document.body.appendChild(s),setTimeout(()=>{c.querySelector("input")?.focus()},50)}let Q={get ready(){return T},get user(){return o},login(){if(L==="redirect"){window.location.href=`${g}/login?app=${m}&redirect=${encodeURIComponent(window.location.href)}`;return}q("login")},register(){if(L==="redirect"){window.location.href=`${g}/login?app=${m}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}q("register")},async logout(){let e=y();if(e)try{await fetch(`${g}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}v(),o=null,h&&clearTimeout(h),p()},getToken(){return y()},onAuthChange(e){if(S.push(e),T)try{e(o)}catch{}return()=>{let t=S.indexOf(e);t!==-1&&S.splice(t,1)}},openAdmin(){window.open(`${g}/admin`,"_blank")}};window.adman=Q,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>P()):P()})();})();
