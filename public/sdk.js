"use strict";(()=>{(function(){let d=document.currentScript,l=d?.getAttribute("data-app-id")??"",j=d?.getAttribute("data-theme")??"light",$=d?.getAttribute("data-accent")??"#2563eb",J=d?.getAttribute("data-locale")??"en",C=d?.getAttribute("data-mode")??"modal",u=d?.src?new URL(d.src).origin:window.location.origin;l||console.warn("[AdMan SDK] Missing data-app-id attribute on script tag.");let L={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In",zh:"\u767B\u5165"},"btn.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"switch.toRegister":{en:"Don't have an account? Sign up",zh:"\u6C92\u6709\u5E33\u865F\uFF1F\u8A3B\u518A"},"switch.toLogin":{en:"Already have an account? Sign in",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F\u767B\u5165"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."}};function a(e){return L[e]?.[J]??L[e]?.en??e}let U=`adman_${l}_`,S=`${U}access_token`,A=`${U}refresh_token`;function b(){return localStorage.getItem(S)}function D(){return localStorage.getItem(A)}function w(e,t){localStorage.setItem(S,e),localStorage.setItem(A,t)}function x(){localStorage.removeItem(S),localStorage.removeItem(A)}async function k(e,t){let n=await fetch(`${u}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),o=await n.json();if(!n.ok)throw new Error(o.error??a("error.generic"));return o}async function M(e,t){let n=await fetch(`${u}${e}`,{headers:{Authorization:`Bearer ${t}`}}),o=await n.json();if(!n.ok)throw new Error(o.error??a("error.generic"));return o}let i=null,y=!1,v=[],p=null;function m(){for(let e of v)try{e(i)}catch{}}function K(e){try{let t=JSON.parse(atob(e.split(".")[1]));return t.exp?t.exp*1e3:null}catch{return null}}function f(){p&&clearTimeout(p);let e=b();if(!e)return;let t=K(e);if(!t)return;let n=t-Date.now()-300*1e3;if(n<=0){N();return}p=setTimeout(N,n)}async function N(){let e=D();if(e)try{let t=await k("/api/auth/refresh",{refreshToken:e});w(t.accessToken,t.refreshToken),f()}catch{x(),i=null,m()}}async function P(){let e=b();if(!e){y=!0,m();return}try{i=(await M("/api/auth/me",e)).user,f()}catch{let t=D();if(t)try{let n=await k("/api/auth/refresh",{refreshToken:t});w(n.accessToken,n.refreshToken),i=(await M("/api/auth/me",n.accessToken)).user,f()}catch{x()}else x()}y=!0,m()}let g=j==="dark",G=g?"#1e1e2e":"#ffffff",B=g?"#cdd6f4":"#1e293b",z=g?"#a6adc8":"#64748b",_=g?"#313244":"#f8fafc",Y=g?"#45475a":"#e2e8f0",Q=g?"#45475a":"#e2e8f0";function q(e){let t=document.getElementById("adman-auth-modal");t&&t.remove();let n=e,o="",h=!1,r=document.createElement("div");r.id="adman-auth-modal";function T(){let s=n==="login";r.innerHTML=`
        <style>
          #adman-auth-modal {
            position: fixed; inset: 0; z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.5); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          #adman-auth-modal * { box-sizing: border-box; margin: 0; padding: 0; }
          .adman-card {
            background: ${G}; color: ${B}; border-radius: 12px;
            padding: 32px; width: 100%; max-width: 400px; position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .adman-close {
            position: absolute; top: 12px; right: 12px; background: none; border: none;
            font-size: 20px; cursor: pointer; color: ${z}; padding: 4px 8px;
            border-radius: 4px; line-height: 1;
          }
          .adman-close:hover { background: ${_}; }
          .adman-title {
            font-size: 22px; font-weight: 700; margin-bottom: 24px; text-align: center;
          }
          .adman-field { margin-bottom: 16px; }
          .adman-label {
            display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: ${z};
          }
          .adman-input {
            width: 100%; padding: 10px 12px; border: 1px solid ${Y}; border-radius: 8px;
            font-size: 14px; background: ${_}; color: ${B}; outline: none;
            transition: border-color 0.2s;
          }
          .adman-input:focus { border-color: ${$}; }
          .adman-btn {
            width: 100%; padding: 12px; border: none; border-radius: 8px;
            font-size: 15px; font-weight: 600; cursor: pointer;
            background: ${$}; color: #fff; margin-top: 8px;
            transition: opacity 0.2s;
          }
          .adman-btn:hover { opacity: 0.9; }
          .adman-btn:disabled { opacity: 0.6; cursor: not-allowed; }
          .adman-switch {
            text-align: center; margin-top: 16px; font-size: 13px; color: ${z};
          }
          .adman-switch a {
            color: ${$}; cursor: pointer; text-decoration: none; font-weight: 500;
          }
          .adman-switch a:hover { text-decoration: underline; }
          .adman-error {
            background: #fef2f2; color: #dc2626; padding: 10px 12px; border-radius: 8px;
            font-size: 13px; margin-bottom: 16px; border: 1px solid #fecaca;
          }
          @media (max-width: 480px) {
            .adman-card { margin: 16px; padding: 24px; }
          }
        </style>
        <div class="adman-card">
          <button class="adman-close" id="adman-close-btn">&times;</button>
          <div class="adman-title">${a(s?"title.login":"title.register")}</div>
          ${o?`<div class="adman-error">${o}</div>`:""}
          <form id="adman-auth-form">
            ${s?"":`
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
              <input class="adman-input" type="password" name="password" required minlength="${s?1:8}" />
            </div>
            <button class="adman-btn" type="submit" ${h?"disabled":""}>
              ${a(h?"msg.loading":s?"btn.login":"btn.register")}
            </button>
          </form>
          <div class="adman-switch">
            <a id="adman-switch-mode">
              ${a(s?"switch.toRegister":"switch.toLogin")}
            </a>
          </div>
        </div>
      `,r.querySelector("#adman-close-btn")?.addEventListener("click",()=>r.remove()),r.addEventListener("click",E=>{E.target===r&&r.remove()}),r.querySelector("#adman-switch-mode")?.addEventListener("click",()=>{n=s?"register":"login",o="",T()});let O=r.querySelector("#adman-auth-form");O?.addEventListener("submit",async E=>{if(E.preventDefault(),h)return;h=!0,o="",T();let I=new FormData(O),F=I.get("email"),H=I.get("password");try{if(s){let c=await k("/api/auth/login",{appId:l,email:F,password:H});w(c.accessToken,c.refreshToken),i=c.user,f(),m(),r.remove()}else{let c=I.get("displayName"),R=await k("/api/auth/register",{appId:l,email:F,password:H,displayName:c});w(R.accessToken,R.refreshToken),i=R.user,f(),m(),r.remove()}}catch(c){o=c instanceof Error?c.message:a("error.generic"),h=!1,T()}})}T(),document.body.appendChild(r),setTimeout(()=>{r.querySelector("input")?.focus()},50)}let X={get ready(){return y},get user(){return i},login(){if(C==="redirect"){window.location.href=`${u}/login?app=${l}&redirect=${encodeURIComponent(window.location.href)}`;return}q("login")},register(){if(C==="redirect"){window.location.href=`${u}/login?app=${l}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}q("register")},async logout(){let e=b();if(e)try{await fetch(`${u}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}x(),i=null,p&&clearTimeout(p),m()},getToken(){return b()},onAuthChange(e){if(v.push(e),y)try{e(i)}catch{}return()=>{let t=v.indexOf(e);t!==-1&&v.splice(t,1)}},openAdmin(){window.open(`${u}/admin`,"_blank")}};window.adman=X,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>P()):P()})();})();
