"use strict";(()=>{(function(){let v=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),u=v?.getAttribute("data-app-id")??"",Q=v?.getAttribute("data-theme")??"light",s=v?.getAttribute("data-accent")??"#2563eb",W=v?.getAttribute("data-locale")??"en",j=v?.getAttribute("data-mode")??"modal",m=v?.src?new URL(v.src).origin:window.location.origin;u||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");let D={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In",zh:"\u767B\u5165"},"btn.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"switch.toRegister":{en:"Don't have an account? Sign up",zh:"\u6C92\u6709\u5E33\u865F\uFF1F\u8A3B\u518A"},"switch.toLogin":{en:"Already have an account? Sign in",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F\u767B\u5165"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"}};function a(e){return D[e]?.[W]??D[e]?.en??e}let O=`lmu_${u}_`,R=`${O}access_token`,H=`${O}refresh_token`;function S(){return localStorage.getItem(R)}function F(){return localStorage.getItem(H)}function $(e,t){localStorage.setItem(R,e),localStorage.setItem(H,t)}function M(){localStorage.removeItem(R),localStorage.removeItem(H)}async function A(e,t){let o=await fetch(`${m}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await o.json();if(!o.ok)throw new Error(n.error??a("error.generic"));return n.data??n}async function P(e,t){let o={};t&&(o.Authorization=`Bearer ${t}`);let n=await fetch(`${m}${e}`,{headers:o}),i=await n.json();if(!n.ok)throw new Error(i.error??a("error.generic"));return i.data??i}let k=[];async function ee(){if(u)try{k=(await P(`/api/auth/providers?app_id=${u}`,"")).providers??[]}catch{k=[]}}function q(e){let t=encodeURIComponent(window.location.href);window.location.href=`${m}/api/auth/oauth/${e}?app_id=${u}&redirect=${t}`}let r=null,C=!1,I=[],E=null;function x(){for(let e of I)try{e(r)}catch{}}function te(e){try{let t=JSON.parse(atob(e.split(".")[1]));return t.exp?t.exp*1e3:null}catch{return null}}function z(){E&&clearTimeout(E);let e=S();if(!e)return;let t=te(e);if(!t)return;let o=t-Date.now()-300*1e3;if(o<=0){G();return}E=setTimeout(G,o)}async function G(){let e=F();if(e)try{let t=await A("/api/auth/refresh",{refreshToken:e});$(t.accessToken,t.refreshToken),z()}catch{M(),r=null,x()}}function oe(){let e=window.location.hash;if(!e.includes("lmu_token="))return!1;let t=new URLSearchParams(e.slice(1)),o=t.get("lmu_token"),n=t.get("lmu_refresh");return o&&n?($(o,n),window.history.replaceState(null,"",window.location.pathname+window.location.search),!0):!1}async function Y(){oe(),await ee();let e=S();if(!e){C=!0,x();return}try{r=(await P("/api/auth/me",e)).user,z()}catch{let t=F();if(t)try{let o=await A("/api/auth/refresh",{refreshToken:t});$(o.accessToken,o.refreshToken),r=(await P("/api/auth/me",o.accessToken)).user,z()}catch{M()}else M()}C=!0,x()}let p=Q==="dark",_=p?"#1e1e2e":"#ffffff",h=p?"#cdd6f4":"#1e293b",g=p?"#a6adc8":"#64748b",T=p?"#313244":"#f8fafc",f=p?"#45475a":"#e2e8f0",ne=`
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
      background: ${_};
      color: ${h};
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
      color: ${g};
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
    .lmu-close:hover { background: ${T}; }
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
      color: ${g};
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
      border: 1.5px solid ${f};
      border-radius: 10px;
      font-size: 15px;
      font-family: inherit;
      line-height: 44px;
      background: ${T};
      color: ${h};
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .lmu-input:focus {
      border-color: ${s};
      box-shadow: 0 0 0 3px ${s}22;
    }
    .lmu-input::placeholder {
      color: ${g};
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
      background: ${s};
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
      color: ${g};
    }
    .lmu-switch a {
      color: ${s};
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
      color: ${g};
    }
    .lmu-divider::before,
    .lmu-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: ${f};
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
      border: 1.5px solid ${f};
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      line-height: 44px;
      cursor: pointer;
      background: ${T};
      color: ${h};
      transition: border-color 0.2s, background 0.15s;
    }
    .lmu-oauth-btn:hover {
      border-color: ${s};
      background: ${p?"#3b3b50":"#f1f5f9"};
    }
    .lmu-oauth-btn svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    @media (max-width: 480px) {
      .lmu-card { margin: 16px; padding: 28px; }
    }
  `;function U(e){let t=document.getElementById("lmu-auth-host");t&&t.remove();let o=e,n="",i=!1,l=document.createElement("div");l.id="lmu-auth-host",l.style.cssText="position:fixed;inset:0;z-index:99999;";let d=l.attachShadow({mode:"closed"});function w(){let c=o==="login";d.innerHTML=`
        <style>${ne}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${a(c?"title.login":"title.register")}</div>
          ${n?`<div class="lmu-error">${n}</div>`:""}
          <form id="lmu-auth-form">
            ${c?"":`
              <div class="lmu-field">
                <label class="lmu-label">${a("label.displayName")}</label>
                <input class="lmu-input" type="text" name="displayName" required />
              </div>
            `}
            <div class="lmu-field">
              <label class="lmu-label">${a("label.email")}</label>
              <input class="lmu-input" type="email" name="email" required />
            </div>
            <div class="lmu-field">
              <label class="lmu-label">${a("label.password")}</label>
              <input class="lmu-input" type="password" name="password" required minlength="${c?1:8}" pattern="${c?".*":"(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}"}" title="${c?"":"Min 8 chars, 1 uppercase, 1 lowercase, 1 number"}" />
            </div>
            ${c?`<div style="text-align:right;margin:-10px 0 8px 0;"><a id="lmu-forgot-pw" style="font-size:12px;color:${s};cursor:pointer;text-decoration:none;">${a("link.forgotPassword")}</a></div>`:""}
            <button class="lmu-btn" type="submit" ${i?"disabled":""}>
              ${a(i?"msg.loading":c?"btn.login":"btn.register")}
            </button>
          </form>
          ${k.length>0?`
            <div class="lmu-divider">${a("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${k.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${a("oauth.google")}
                </button>
              `:""}
              ${k.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="${h}"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${a("oauth.github")}
                </button>
              `:""}
            </div>
          `:""}
          <div class="lmu-switch">
            <a id="lmu-switch-mode">
              ${a(c?"switch.toRegister":"switch.toLogin")}
            </a>
          </div>
        </div>
      `,d.getElementById("lmu-close-btn")?.addEventListener("click",()=>l.remove()),d.addEventListener("click",B=>{if(B.target===d.firstElementChild?.nextElementSibling)return;let y=d.querySelector(".lmu-card");y&&!y.contains(B.target)&&l.remove()}),d.getElementById("lmu-oauth-google")?.addEventListener("click",()=>q("google")),d.getElementById("lmu-oauth-github")?.addEventListener("click",()=>q("github")),d.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{l.remove(),window.open(`${m}/login?app=${u}&tab=login`,"_blank")}),d.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{o=c?"register":"login",n="",w()});let V=d.getElementById("lmu-auth-form");V?.addEventListener("submit",async B=>{if(B.preventDefault(),i)return;i=!0,n="",w();let y=new FormData(V),X=y.get("email"),Z=y.get("password");try{if(c){let b=await A("/api/auth/login",{appId:u,email:X,password:Z});$(b.accessToken,b.refreshToken),r=b.user,z(),x(),l.remove()}else{let b=y.get("displayName"),N=await A("/api/auth/register",{appId:u,email:X,password:Z,displayName:b});$(N.accessToken,N.refreshToken),r=N.user,z(),x(),l.remove()}}catch(b){n=b instanceof Error?b.message:a("error.generic"),i=!1,w()}})}w(),document.body.appendChild(l),setTimeout(()=>{d.querySelector("input")?.focus()},50)}let J=`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-profile-card {
      background: ${_};
      color: ${h};
      border-radius: 12px;
      border: 1px solid ${f};
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
      background: ${s};
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
      color: ${g};
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
      color: ${g};
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
      border: 1px solid ${f};
      background: ${T};
      color: ${h};
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .lmu-profile-btn:hover {
      border-color: ${s};
      background: ${p?"#3b3b50":"#f1f5f9"};
    }
    .lmu-profile-btn.primary {
      background: ${s};
      color: #fff;
      border-color: ${s};
    }
    .lmu-profile-btn.primary:hover { opacity: 0.9; }
    .lmu-profile-login {
      text-align: center;
      padding: 8px 0;
    }
    .lmu-profile-login a {
      color: ${s};
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .lmu-profile-login a:hover { text-decoration: underline; }
  `;function re(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let o=document.createElement("div");o.className="lmu-profile-card-host";let n=o.attachShadow({mode:"closed"});function i(){if(!r){n.innerHTML=`
          <style>${J}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${a("btn.login")}</a>
            </div>
          </div>
        `,n.getElementById("lmu-pc-login")?.addEventListener("click",()=>{U("login")});return}let d=r.displayName?.charAt(0)?.toUpperCase()??"?";n.innerHTML=`
        <style>${J}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${r.avatar?`<img src="${r.avatar}" alt="" />`:d}
            </div>
            <div class="lmu-profile-info">
              <p class="lmu-profile-name">${r.displayName}</p>
              <p class="lmu-profile-email">${r.email}</p>
            </div>
          </div>
          <div class="lmu-profile-role">${r.role}</div>
          <div class="lmu-profile-actions">
            <button class="lmu-profile-btn primary" id="lmu-pc-edit">Edit Profile</button>
            <button class="lmu-profile-btn" id="lmu-pc-logout">Logout</button>
          </div>
        </div>
      `,n.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{L.logout()}),n.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{window.open(`${m}/login?app=${u}&tab=profile`,"_blank")})}t.appendChild(o),i();let l=L.onAuthChange(()=>i());return()=>{l(),o.remove()}}let K=`
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
      border: 2px solid ${f};
      background: ${s};
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
      border-color: ${s};
      box-shadow: 0 0 0 2px ${s}33;
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
      border: 2px dashed ${f};
      background: ${T};
      color: ${g};
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;
      padding: 0;
    }
    .lmu-avatar-login:hover { border-color: ${s}; color: ${s}; }
    .lmu-avatar-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: ${_};
      border: 1px solid ${f};
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      min-width: 200px;
      z-index: 99999;
      overflow: hidden;
    }
    .lmu-avatar-dropdown-header {
      padding: 12px 14px;
      border-bottom: 1px solid ${f};
    }
    .lmu-avatar-dropdown-name {
      font-size: 14px;
      font-weight: 600;
      color: ${h};
      margin: 0;
    }
    .lmu-avatar-dropdown-email {
      font-size: 12px;
      color: ${g};
      margin: 2px 0 0;
    }
    .lmu-avatar-dropdown-item {
      display: block;
      width: 100%;
      padding: 10px 14px;
      border: none;
      background: none;
      color: ${h};
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
  `;function ie(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let o=document.createElement("div");o.className="lmu-avatar-host";let n=o.attachShadow({mode:"closed"}),i=!1;function l(){if(!r){n.innerHTML=`
          <style>${K}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${a("btn.login")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,n.getElementById("lmu-av-login")?.addEventListener("click",()=>{U("login")});return}let c=r.displayName?.charAt(0)?.toUpperCase()??"?";n.innerHTML=`
        <style>${K}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${r.avatar?`<img src="${r.avatar}" alt="" />`:c}
        </button>
        ${i?`
          <div class="lmu-avatar-dropdown">
            <div class="lmu-avatar-dropdown-header">
              <p class="lmu-avatar-dropdown-name">${r.displayName}</p>
              <p class="lmu-avatar-dropdown-email">${r.email}</p>
            </div>
            <button class="lmu-avatar-dropdown-item" id="lmu-av-profile">Edit Profile</button>
            <button class="lmu-avatar-dropdown-item danger" id="lmu-av-logout">Logout</button>
          </div>
        `:""}
      `,n.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{i=!i,l()}),n.getElementById("lmu-av-profile")?.addEventListener("click",()=>{i=!1,l(),window.open(`${m}/login?app=${u}&tab=profile`,"_blank")}),n.getElementById("lmu-av-logout")?.addEventListener("click",()=>{i=!1,L.logout()})}function d(c){i&&!o.contains(c.target)&&(i=!1,l())}document.addEventListener("click",d),t.appendChild(o),l();let w=L.onAuthChange(()=>{i=!1,l()});return()=>{w(),document.removeEventListener("click",d),o.remove()}}let L={get ready(){return C},get user(){return r},login(){if(j==="redirect"){window.location.href=`${m}/login?app=${u}&redirect=${encodeURIComponent(window.location.href)}`;return}U("login")},register(){if(j==="redirect"){window.location.href=`${m}/login?app=${u}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}U("register")},async logout(){let e=S();if(e)try{await fetch(`${m}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}M(),r=null,E&&clearTimeout(E),x()},getToken(){return S()},onAuthChange(e){if(I.push(e),C)try{e(r)}catch{}return()=>{let t=I.indexOf(e);t!==-1&&I.splice(t,1)}},openAdmin(){window.open(`${m}/admin`,"_blank")},renderProfileCard(e){return re(e)},renderAvatar(e){return ie(e)}};window.letmeuse=L,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>Y()):Y()})();})();
