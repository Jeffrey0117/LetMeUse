"use strict";(()=>{(function(){let w=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),u=w?.getAttribute("data-app-id")??"",X=w?.getAttribute("data-theme")??"light",c=w?.getAttribute("data-accent")??"#2563eb",Q=w?.getAttribute("data-locale")??"en",F=w?.getAttribute("data-mode")??"modal",f=w?.src?new URL(w.src).origin:window.location.origin;u||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");let O={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In",zh:"\u767B\u5165"},"btn.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"switch.toRegister":{en:"Don't have an account? Sign up",zh:"\u6C92\u6709\u5E33\u865F\uFF1F\u8A3B\u518A"},"switch.toLogin":{en:"Already have an account? Sign in",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F\u767B\u5165"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"},"strength.weak":{en:"Weak",zh:"\u5F31"},"strength.fair":{en:"Fair",zh:"\u4E2D\u7B49"},"strength.strong":{en:"Strong",zh:"\u5F37"}};function r(e){return O[e]?.[Q]??O[e]?.en??e}let q=`lmu_${u}_`,_=`${q}access_token`,N=`${q}refresh_token`;function C(){return localStorage.getItem(_)}function G(){return localStorage.getItem(N)}function E(e,t){localStorage.setItem(_,e),localStorage.setItem(N,t)}function B(){localStorage.removeItem(_),localStorage.removeItem(N)}async function U(e,t){let n=await fetch(`${f}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),o=await n.json();if(!n.ok)throw new Error(o.error??r("error.generic"));return o.data??o}async function j(e,t){let n={};t&&(n.Authorization=`Bearer ${t}`);let o=await fetch(`${f}${e}`,{headers:n}),a=await o.json();if(!o.ok)throw new Error(a.error??r("error.generic"));return a.data??a}let z=[];async function ee(){if(u)try{z=(await j(`/api/auth/providers?app_id=${u}`,"")).providers??[]}catch{z=[]}}function Y(e){let t=encodeURIComponent(window.location.href);window.location.href=`${f}/api/auth/oauth/${e}?app_id=${u}&redirect=${t}`}let i=null,R=!1,H=[],T=null;function y(){for(let e of H)try{e(i)}catch{}}function te(e){try{let t=JSON.parse(atob(e.split(".")[1]));return t.exp?t.exp*1e3:null}catch{return null}}function L(){T&&clearTimeout(T);let e=C();if(!e)return;let t=te(e);if(!t)return;let n=t-Date.now()-300*1e3;if(n<=0){J();return}T=setTimeout(J,n)}async function J(){let e=G();if(e)try{let t=await U("/api/auth/refresh",{refreshToken:e});E(t.accessToken,t.refreshToken),L()}catch{B(),i=null,y()}}function ne(){let e=window.location.hash;if(!e.includes("lmu_token="))return!1;let t=new URLSearchParams(e.slice(1)),n=t.get("lmu_token"),o=t.get("lmu_refresh");return n&&o?(E(n,o),window.history.replaceState(null,"",window.location.pathname+window.location.search),!0):!1}async function K(){ne(),await ee();let e=C();if(!e){R=!0,y();return}try{i=(await j("/api/auth/me",e)).user,L()}catch{let t=G();if(t)try{let n=await U("/api/auth/refresh",{refreshToken:t});E(n.accessToken,n.refreshToken),i=(await j("/api/auth/me",n.accessToken)).user,L()}catch{B()}else B()}R=!0,y()}let p=X==="dark",D=p?"#1e1e2e":"#ffffff",x=p?"#cdd6f4":"#1e293b",b=p?"#a6adc8":"#64748b",S=p?"#313244":"#f8fafc",h=p?"#45475a":"#e2e8f0",oe=`
    :host {
      position: fixed !important;
      inset: 0 !important;
      z-index: 99999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: rgba(0,0,0,0.5) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    .lmu-card {
      background: ${D};
      color: ${x};
      border-radius: 16px;
      padding: 36px;
      width: 100%;
      max-width: 400px;
      position: relative;
      box-shadow: 0 24px 64px rgba(0,0,0,0.35);
      line-height: 1.5;
    }
    .lmu-close {
      position: absolute;
      top: 14px;
      right: 14px;
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: ${b};
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      line-height: 1;
      transition: background 0.15s;
      padding: 0;
      margin: 0;
    }
    .lmu-close:hover { background: ${S}; }
    .lmu-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 28px 0;
      padding: 0;
      text-align: center;
      letter-spacing: -0.3px;
    }
    .lmu-field {
      margin: 0 0 18px 0;
      padding: 0;
    }
    .lmu-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin: 0 0 8px 0;
      padding: 0;
      color: ${b};
      letter-spacing: 0.2px;
    }
    .lmu-input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      display: block;
      width: 100%;
      height: 44px;
      padding: 0 14px;
      margin: 0;
      border: 1.5px solid ${h};
      border-radius: 10px;
      font-size: 15px;
      font-family: inherit;
      line-height: 44px;
      background: ${S};
      color: ${x};
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .lmu-input:focus {
      border-color: ${c};
      box-shadow: 0 0 0 3px ${c}22;
    }
    .lmu-input::placeholder {
      color: ${b};
      opacity: 0.6;
    }
    .lmu-btn {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      display: block;
      width: 100%;
      height: 48px;
      padding: 0;
      margin: 12px 0 0 0;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      background: ${c};
      color: #fff;
      transition: opacity 0.2s, transform 0.1s;
    }
    .lmu-btn:hover { opacity: 0.92; }
    .lmu-btn:active { transform: scale(0.99); }
    .lmu-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .lmu-switch {
      text-align: center;
      margin: 20px 0 0 0;
      padding: 0;
      font-size: 13px;
      color: ${b};
    }
    .lmu-switch a {
      color: ${c};
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
    }
    .lmu-switch a:hover { text-decoration: underline; }
    .lmu-error {
      background: ${p?"#3b1c1c":"#fef2f2"};
      color: ${p?"#f87171":"#dc2626"};
      padding: 11px 14px;
      margin: 0 0 18px 0;
      border-radius: 10px;
      font-size: 13px;
      border: 1px solid ${p?"#5c2828":"#fecaca"};
    }
    .lmu-divider {
      display: flex;
      align-items: center;
      margin: 22px 0 18px 0;
      padding: 0;
      gap: 12px;
      font-size: 12px;
      color: ${b};
    }
    .lmu-divider::before,
    .lmu-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: ${h};
    }
    .lmu-oauth-row {
      display: flex;
      gap: 10px;
      margin: 0;
      padding: 0;
    }
    .lmu-oauth-btn {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 44px;
      padding: 0 16px;
      margin: 0;
      border: 1.5px solid ${h};
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      line-height: 44px;
      cursor: pointer;
      background: ${S};
      color: ${x};
      transition: border-color 0.2s, background 0.15s;
    }
    .lmu-oauth-btn:hover {
      border-color: ${c};
      background: ${p?"#3b3b50":"#f1f5f9"};
    }
    .lmu-oauth-btn svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .lmu-strength {
      margin: 8px 0 0 0;
      padding: 0;
    }
    .lmu-strength-bar {
      height: 4px;
      border-radius: 2px;
      background: ${h};
      overflow: hidden;
      margin: 0 0 4px 0;
    }
    .lmu-strength-fill {
      height: 100%;
      border-radius: 2px;
      width: 0%;
      transition: width 0.25s ease, background-color 0.25s ease;
    }
    .lmu-strength-fill[data-level="weak"] {
      width: 33%;
      background-color: #ef4444;
    }
    .lmu-strength-fill[data-level="fair"] {
      width: 66%;
      background-color: #eab308;
    }
    .lmu-strength-fill[data-level="strong"] {
      width: 100%;
      background-color: #22c55e;
    }
    .lmu-strength-text {
      font-size: 11px;
      font-weight: 500;
      margin: 0;
      padding: 0;
    }
    .lmu-strength-text[data-level="weak"] { color: #ef4444; }
    .lmu-strength-text[data-level="fair"] { color: #eab308; }
    .lmu-strength-text[data-level="strong"] { color: #22c55e; }
    @media (max-width: 480px) {
      .lmu-card { margin: 16px; padding: 28px; }
    }
  `;function re(e){let t=0;return e.length>=8&&t++,/[a-z]/.test(e)&&t++,/[A-Z]/.test(e)&&t++,/[0-9]/.test(e)&&t++,t>=4?{level:"strong",label:r("strength.strong")}:t>=2?{level:"fair",label:r("strength.fair")}:{level:"weak",label:r("strength.weak")}}function P(e){let t=document.getElementById("lmu-auth-host");t&&t.remove();let n=e,o="",a=!1,s=document.createElement("div");s.id="lmu-auth-host",s.style.cssText="position:fixed;inset:0;z-index:99999;";let l=s.attachShadow({mode:"closed"});function $(){let d=n==="login";if(l.innerHTML=`
        <style>${oe}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${r(d?"title.login":"title.register")}</div>
          ${o?`<div class="lmu-error">${o}</div>`:""}
          <form id="lmu-auth-form">
            ${d?"":`
              <div class="lmu-field">
                <label class="lmu-label">${r("label.displayName")}</label>
                <input class="lmu-input" type="text" name="displayName" required />
              </div>
            `}
            <div class="lmu-field">
              <label class="lmu-label">${r("label.email")}</label>
              <input class="lmu-input" type="email" name="email" required />
            </div>
            <div class="lmu-field">
              <label class="lmu-label">${r("label.password")}</label>
              <input class="lmu-input" type="password" name="password" id="lmu-password-input" required minlength="${d?1:8}" pattern="${d?".*":"(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}"}" title="${d?"":"Min 8 chars, 1 uppercase, 1 lowercase, 1 number"}" />
              ${d?"":`
              <div class="lmu-strength" id="lmu-strength">
                <div class="lmu-strength-bar"><div class="lmu-strength-fill" id="lmu-strength-fill"></div></div>
                <div class="lmu-strength-text" id="lmu-strength-text"></div>
              </div>
              `}
            </div>
            ${d?`<div style="text-align:right;margin:-10px 0 8px 0;"><a id="lmu-forgot-pw" style="font-size:12px;color:${c};cursor:pointer;text-decoration:none;">${r("link.forgotPassword")}</a></div>`:""}
            <button class="lmu-btn" type="submit" ${a?"disabled":""}>
              ${r(a?"msg.loading":d?"btn.login":"btn.register")}
            </button>
          </form>
          ${z.length>0?`
            <div class="lmu-divider">${r("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${z.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${r("oauth.google")}
                </button>
              `:""}
              ${z.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="${x}"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${r("oauth.github")}
                </button>
              `:""}
            </div>
          `:""}
          <div class="lmu-switch">
            <a id="lmu-switch-mode">
              ${r(d?"switch.toRegister":"switch.toLogin")}
            </a>
          </div>
        </div>
      `,l.getElementById("lmu-close-btn")?.addEventListener("click",()=>s.remove()),l.addEventListener("click",g=>{if(g.target===l.firstElementChild?.nextElementSibling)return;let v=l.querySelector(".lmu-card");v&&!v.contains(g.target)&&s.remove()}),l.getElementById("lmu-oauth-google")?.addEventListener("click",()=>Y("google")),l.getElementById("lmu-oauth-github")?.addEventListener("click",()=>Y("github")),l.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{s.remove(),window.open(`${f}/login?app=${u}&tab=login`,"_blank")}),l.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{n=d?"register":"login",o="",$()}),!d){let g=l.getElementById("lmu-password-input"),v=l.getElementById("lmu-strength-fill"),k=l.getElementById("lmu-strength-text");if(g&&v&&k){let A=()=>{let{level:m,label:M}=re(g.value);v.setAttribute("data-level",g.value?m:""),k.setAttribute("data-level",g.value?m:""),k.textContent=g.value?M:""};g.addEventListener("input",A),A()}}let W=l.getElementById("lmu-auth-form");W?.addEventListener("submit",async g=>{if(g.preventDefault(),a)return;a=!0,o="",$();let v=new FormData(W),k=v.get("email"),A=v.get("password");try{if(d){let m=await U("/api/auth/login",{appId:u,email:k,password:A});E(m.accessToken,m.refreshToken),i=m.user,L(),y(),s.remove()}else{let m=v.get("displayName"),M=await U("/api/auth/register",{appId:u,email:k,password:A,displayName:m});E(M.accessToken,M.refreshToken),i=M.user,L(),y(),s.remove()}}catch(m){o=m instanceof Error?m.message:r("error.generic"),a=!1,$()}})}$(),document.body.appendChild(s),setTimeout(()=>{l.querySelector("input")?.focus()},50)}let V=`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-profile-card {
      background: ${D};
      color: ${x};
      border-radius: 12px;
      border: 1px solid ${h};
      padding: 20px;
      max-width: 320px;
    }
    .lmu-profile-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }
    .lmu-profile-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${c};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
      flex-shrink: 0;
      overflow: hidden;
    }
    .lmu-profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .lmu-profile-info {
      min-width: 0;
    }
    .lmu-profile-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lmu-profile-email {
      font-size: 13px;
      color: ${b};
      margin: 2px 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lmu-profile-role {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 9999px;
      background: ${p?"#313244":"#f1f5f9"};
      color: ${b};
      margin-bottom: 14px;
    }
    .lmu-profile-actions {
      display: flex;
      gap: 8px;
    }
    .lmu-profile-btn {
      flex: 1;
      height: 36px;
      border-radius: 8px;
      border: 1px solid ${h};
      background: ${S};
      color: ${x};
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .lmu-profile-btn:hover {
      border-color: ${c};
      background: ${p?"#3b3b50":"#f1f5f9"};
    }
    .lmu-profile-btn.primary {
      background: ${c};
      color: #fff;
      border-color: ${c};
    }
    .lmu-profile-btn.primary:hover { opacity: 0.9; }
    .lmu-profile-login {
      text-align: center;
      padding: 8px 0;
    }
    .lmu-profile-login a {
      color: ${c};
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .lmu-profile-login a:hover { text-decoration: underline; }
  `;function ie(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let n=document.createElement("div");n.className="lmu-profile-card-host";let o=n.attachShadow({mode:"closed"});function a(){if(!i){o.innerHTML=`
          <style>${V}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${r("btn.login")}</a>
            </div>
          </div>
        `,o.getElementById("lmu-pc-login")?.addEventListener("click",()=>{P("login")});return}let l=i.displayName?.charAt(0)?.toUpperCase()??"?";o.innerHTML=`
        <style>${V}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${i.avatar?`<img src="${i.avatar}" alt="" />`:l}
            </div>
            <div class="lmu-profile-info">
              <p class="lmu-profile-name">${i.displayName}</p>
              <p class="lmu-profile-email">${i.email}</p>
            </div>
          </div>
          <div class="lmu-profile-role">${i.role}</div>
          <div class="lmu-profile-actions">
            <button class="lmu-profile-btn primary" id="lmu-pc-edit">Edit Profile</button>
            <button class="lmu-profile-btn" id="lmu-pc-logout">Logout</button>
          </div>
        </div>
      `,o.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{I.logout()}),o.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{window.open(`${f}/login?app=${u}&tab=profile`,"_blank")})}t.appendChild(n),a();let s=I.onAuthChange(()=>a());return()=>{s(),n.remove()}}let Z=`
    :host {
      display: inline-block;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-avatar-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid ${h};
      background: ${c};
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
      padding: 0;
    }
    .lmu-avatar-btn:hover {
      border-color: ${c};
      box-shadow: 0 0 0 2px ${c}33;
    }
    .lmu-avatar-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .lmu-avatar-login {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px dashed ${h};
      background: ${S};
      color: ${b};
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;
      padding: 0;
    }
    .lmu-avatar-login:hover { border-color: ${c}; color: ${c}; }
    .lmu-avatar-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: ${D};
      border: 1px solid ${h};
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      min-width: 200px;
      z-index: 99999;
      overflow: hidden;
    }
    .lmu-avatar-dropdown-header {
      padding: 12px 14px;
      border-bottom: 1px solid ${h};
    }
    .lmu-avatar-dropdown-name {
      font-size: 14px;
      font-weight: 600;
      color: ${x};
      margin: 0;
    }
    .lmu-avatar-dropdown-email {
      font-size: 12px;
      color: ${b};
      margin: 2px 0 0;
    }
    .lmu-avatar-dropdown-item {
      display: block;
      width: 100%;
      padding: 10px 14px;
      border: none;
      background: none;
      color: ${x};
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s;
    }
    .lmu-avatar-dropdown-item:hover {
      background: ${p?"#313244":"#f8fafc"};
    }
    .lmu-avatar-dropdown-item.danger { color: #ef4444; }
  `;function ae(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let n=document.createElement("div");n.className="lmu-avatar-host";let o=n.attachShadow({mode:"closed"}),a=!1;function s(){if(!i){o.innerHTML=`
          <style>${Z}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${r("btn.login")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,o.getElementById("lmu-av-login")?.addEventListener("click",()=>{P("login")});return}let d=i.displayName?.charAt(0)?.toUpperCase()??"?";o.innerHTML=`
        <style>${Z}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${i.avatar?`<img src="${i.avatar}" alt="" />`:d}
        </button>
        ${a?`
          <div class="lmu-avatar-dropdown">
            <div class="lmu-avatar-dropdown-header">
              <p class="lmu-avatar-dropdown-name">${i.displayName}</p>
              <p class="lmu-avatar-dropdown-email">${i.email}</p>
            </div>
            <button class="lmu-avatar-dropdown-item" id="lmu-av-profile">Edit Profile</button>
            <button class="lmu-avatar-dropdown-item danger" id="lmu-av-logout">Logout</button>
          </div>
        `:""}
      `,o.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{a=!a,s()}),o.getElementById("lmu-av-profile")?.addEventListener("click",()=>{a=!1,s(),window.open(`${f}/login?app=${u}&tab=profile`,"_blank")}),o.getElementById("lmu-av-logout")?.addEventListener("click",()=>{a=!1,I.logout()})}function l(d){a&&!n.contains(d.target)&&(a=!1,s())}document.addEventListener("click",l),t.appendChild(n),s();let $=I.onAuthChange(()=>{a=!1,s()});return()=>{$(),document.removeEventListener("click",l),n.remove()}}let I={get ready(){return R},get user(){return i},login(){if(F==="redirect"){window.location.href=`${f}/login?app=${u}&redirect=${encodeURIComponent(window.location.href)}`;return}P("login")},register(){if(F==="redirect"){window.location.href=`${f}/login?app=${u}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}P("register")},async logout(){let e=C();if(e)try{await fetch(`${f}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}B(),i=null,T&&clearTimeout(T),y()},getToken(){return C()},onAuthChange(e){if(H.push(e),R)try{e(i)}catch{}return()=>{let t=H.indexOf(e);t!==-1&&H.splice(t,1)}},openAdmin(){window.open(`${f}/admin`,"_blank")},renderProfileCard(e){return ie(e)},renderAvatar(e){return ae(e)}};window.letmeuse=I,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>K()):K()})();})();
