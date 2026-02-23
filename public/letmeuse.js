"use strict";(()=>{(function(){let w=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),p=w?.getAttribute("data-app-id")??"",X=w?.getAttribute("data-theme")??"light",u=w?.getAttribute("data-accent")??"#2563eb",Q=w?.getAttribute("data-locale")??"en",O=w?.getAttribute("data-mode")??"modal",m=w?.src?new URL(w.src).origin:window.location.origin;p||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");let q={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In",zh:"\u767B\u5165"},"btn.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"switch.toRegister":{en:"Don't have an account? Sign up",zh:"\u6C92\u6709\u5E33\u865F\uFF1F\u8A3B\u518A"},"switch.toLogin":{en:"Already have an account? Sign in",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F\u767B\u5165"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"},"error.passwordRequires":{en:"Password requires",zh:"\u5BC6\u78BC\u9700\u8981"},"strength.weak":{en:"Weak",zh:"\u5F31"},"strength.fair":{en:"Fair",zh:"\u4E2D\u7B49"},"strength.strong":{en:"Strong",zh:"\u5F37"}};function r(e){return q[e]?.[Q]??q[e]?.en??e}let G=`lmu_${p}_`,N=`${G}access_token`,j=`${G}refresh_token`;function B(){return localStorage.getItem(N)}function Y(){return localStorage.getItem(j)}function z(e,t){localStorage.setItem(N,e),localStorage.setItem(j,t)}function R(){localStorage.removeItem(N),localStorage.removeItem(j)}async function U(e,t){let o=await fetch(`${m}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await o.json();if(!o.ok)throw new Error(n.error??r("error.generic"));return n.data??n}async function D(e,t){let o={};t&&(o.Authorization=`Bearer ${t}`);let n=await fetch(`${m}${e}`,{headers:o}),a=await n.json();if(!n.ok)throw new Error(a.error??r("error.generic"));return a.data??a}let T=[];async function ee(){if(p)try{T=(await D(`/api/auth/providers?app_id=${p}`,"")).providers??[]}catch{T=[]}}function J(e){let t=encodeURIComponent(window.location.href);window.location.href=`${m}/api/auth/oauth/${e}?app_id=${p}&redirect=${t}`}let i=null,P=!1,H=[],L=null;function $(){for(let e of H)try{e(i)}catch{}}function te(e){try{let t=JSON.parse(atob(e.split(".")[1]));return t.exp?t.exp*1e3:null}catch{return null}}function S(){L&&clearTimeout(L);let e=B();if(!e)return;let t=te(e);if(!t)return;let o=t-Date.now()-300*1e3;if(o<=0){K();return}L=setTimeout(K,o)}async function K(){let e=Y();if(e)try{let t=await U("/api/auth/refresh",{refreshToken:e});z(t.accessToken,t.refreshToken),S()}catch{R(),i=null,$()}}function ne(){let e=window.location.hash;if(!e.includes("lmu_token="))return!1;let t=new URLSearchParams(e.slice(1)),o=t.get("lmu_token"),n=t.get("lmu_refresh");return o&&n?(z(o,n),window.history.replaceState(null,"",window.location.pathname+window.location.search),!0):!1}async function V(){ne(),await ee();let e=B();if(!e){P=!0,$();return}try{i=(await D("/api/auth/me",e)).user,S()}catch{let t=Y();if(t)try{let o=await U("/api/auth/refresh",{refreshToken:t});z(o.accessToken,o.refreshToken),i=(await D("/api/auth/me",o.accessToken)).user,S()}catch{R()}else R()}P=!0,$()}let g=X==="dark",F=g?"#1e1e2e":"#ffffff",v=g?"#cdd6f4":"#1e293b",f=g?"#a6adc8":"#64748b",I=g?"#313244":"#f8fafc",h=g?"#45475a":"#e2e8f0",oe=`
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
      background: ${F};
      color: ${v};
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
      color: ${f};
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
    .lmu-close:hover { background: ${I}; }
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
      color: ${f};
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
      background: ${I};
      color: ${v};
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .lmu-input:focus {
      border-color: ${u};
      box-shadow: 0 0 0 3px ${u}22;
    }
    .lmu-input::placeholder {
      color: ${f};
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
      background: ${u};
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
      color: ${f};
    }
    .lmu-switch a {
      color: ${u};
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
    }
    .lmu-switch a:hover { text-decoration: underline; }
    .lmu-error {
      background: ${g?"#3b1c1c":"#fef2f2"};
      color: ${g?"#f87171":"#dc2626"};
      padding: 11px 14px;
      margin: 0 0 18px 0;
      border-radius: 10px;
      font-size: 13px;
      border: 1px solid ${g?"#5c2828":"#fecaca"};
    }
    .lmu-divider {
      display: flex;
      align-items: center;
      margin: 22px 0 18px 0;
      padding: 0;
      gap: 12px;
      font-size: 12px;
      color: ${f};
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
      background: ${I};
      color: ${v};
      transition: border-color 0.2s, background 0.15s;
    }
    .lmu-oauth-btn:hover {
      border-color: ${u};
      background: ${g?"#3b3b50":"#f1f5f9"};
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
  `;function re(e){let t=0;return e.length>=8&&t++,/[a-z]/.test(e)&&t++,/[A-Z]/.test(e)&&t++,/[0-9]/.test(e)&&t++,t>=4?{level:"strong",label:r("strength.strong")}:t>=2?{level:"fair",label:r("strength.fair")}:{level:"weak",label:r("strength.weak")}}function _(e){let t=document.getElementById("lmu-auth-host");t&&t.remove();let o=e,n="",a=!1,c=document.createElement("div");c.id="lmu-auth-host",c.style.cssText="position:fixed;inset:0;z-index:99999;";let l=c.attachShadow({mode:"closed"});l.addEventListener("click",s=>{let M=l.querySelector(".lmu-card");M&&!M.contains(s.target)&&l.contains(s.target)&&c.remove()});function y(){let s=o==="login";if(l.innerHTML=`
        <style>${oe}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${r(s?"title.login":"title.register")}</div>
          ${n?`<div class="lmu-error">${n}</div>`:""}
          <form id="lmu-auth-form">
            ${s?"":`
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
              <input class="lmu-input" type="password" name="password" id="lmu-password-input" required minlength="${s?1:8}" />
              ${s?"":`
              <div class="lmu-strength" id="lmu-strength">
                <div class="lmu-strength-bar"><div class="lmu-strength-fill" id="lmu-strength-fill"></div></div>
                <div class="lmu-strength-text" id="lmu-strength-text"></div>
              </div>
              `}
            </div>
            ${s?`<div style="text-align:right;margin:-10px 0 8px 0;"><a id="lmu-forgot-pw" style="font-size:12px;color:${u};cursor:pointer;text-decoration:none;">${r("link.forgotPassword")}</a></div>`:""}
            <button class="lmu-btn" type="submit" ${a?"disabled":""}>
              ${r(a?"msg.loading":s?"btn.login":"btn.register")}
            </button>
          </form>
          ${T.length>0?`
            <div class="lmu-divider">${r("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${T.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${r("oauth.google")}
                </button>
              `:""}
              ${T.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="${v}"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${r("oauth.github")}
                </button>
              `:""}
            </div>
          `:""}
          <div class="lmu-switch">
            <a id="lmu-switch-mode">
              ${r(s?"switch.toRegister":"switch.toLogin")}
            </a>
          </div>
        </div>
      `,l.getElementById("lmu-close-btn")?.addEventListener("click",()=>c.remove()),l.getElementById("lmu-oauth-google")?.addEventListener("click",()=>J("google")),l.getElementById("lmu-oauth-github")?.addEventListener("click",()=>J("github")),l.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{c.remove(),window.open(`${m}/login?app=${p}&tab=login`,"_blank")}),l.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{o=s?"register":"login",n="",y()}),!s){let x=l.getElementById("lmu-password-input"),k=l.getElementById("lmu-strength-fill"),E=l.getElementById("lmu-strength-text");if(x&&k&&E){let b=()=>{let{level:d,label:C}=re(x.value);k.setAttribute("data-level",x.value?d:""),E.setAttribute("data-level",x.value?d:""),E.textContent=x.value?C:""};x.addEventListener("input",b),b()}}let M=l.getElementById("lmu-auth-form");M?.addEventListener("submit",async x=>{if(x.preventDefault(),a)return;let k=new FormData(M),E=k.get("email"),b=k.get("password");if(a=!0,n="",y(),!s){let d=[];if(b.length<8&&d.push("8+ chars"),/[a-z]/.test(b)||d.push("lowercase"),/[A-Z]/.test(b)||d.push("uppercase"),/[0-9]/.test(b)||d.push("number"),d.length>0){n=`${r("error.passwordRequires")}: ${d.join(", ")}`,a=!1,y();return}}try{if(s){let d=await U("/api/auth/login",{appId:p,email:E,password:b});z(d.accessToken,d.refreshToken),i=d.user,S(),$(),c.remove()}else{let d=k.get("displayName"),C=await U("/api/auth/register",{appId:p,email:E,password:b,displayName:d});z(C.accessToken,C.refreshToken),i=C.user,S(),$(),c.remove()}}catch(d){n=d instanceof Error?d.message:r("error.generic"),a=!1,y()}})}y(),document.body.appendChild(c),setTimeout(()=>{l.querySelector("input")?.focus()},50)}let Z=`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-profile-card {
      background: ${F};
      color: ${v};
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
      background: ${u};
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
      color: ${f};
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
      background: ${g?"#313244":"#f1f5f9"};
      color: ${f};
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
      background: ${I};
      color: ${v};
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .lmu-profile-btn:hover {
      border-color: ${u};
      background: ${g?"#3b3b50":"#f1f5f9"};
    }
    .lmu-profile-btn.primary {
      background: ${u};
      color: #fff;
      border-color: ${u};
    }
    .lmu-profile-btn.primary:hover { opacity: 0.9; }
    .lmu-profile-login {
      text-align: center;
      padding: 8px 0;
    }
    .lmu-profile-login a {
      color: ${u};
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .lmu-profile-login a:hover { text-decoration: underline; }
  `;function ie(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let o=document.createElement("div");o.className="lmu-profile-card-host";let n=o.attachShadow({mode:"closed"});function a(){if(!i){n.innerHTML=`
          <style>${Z}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${r("btn.login")}</a>
            </div>
          </div>
        `,n.getElementById("lmu-pc-login")?.addEventListener("click",()=>{_("login")});return}let l=i.displayName?.charAt(0)?.toUpperCase()??"?";n.innerHTML=`
        <style>${Z}</style>
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
      `,n.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{A.logout()}),n.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{window.open(`${m}/login?app=${p}&tab=profile`,"_blank")})}t.appendChild(o),a();let c=A.onAuthChange(()=>a());return()=>{c(),o.remove()}}let W=`
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
      background: ${u};
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
      border-color: ${u};
      box-shadow: 0 0 0 2px ${u}33;
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
      background: ${I};
      color: ${f};
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;
      padding: 0;
    }
    .lmu-avatar-login:hover { border-color: ${u}; color: ${u}; }
    .lmu-avatar-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: ${F};
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
      color: ${v};
      margin: 0;
    }
    .lmu-avatar-dropdown-email {
      font-size: 12px;
      color: ${f};
      margin: 2px 0 0;
    }
    .lmu-avatar-dropdown-item {
      display: block;
      width: 100%;
      padding: 10px 14px;
      border: none;
      background: none;
      color: ${v};
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s;
    }
    .lmu-avatar-dropdown-item:hover {
      background: ${g?"#313244":"#f8fafc"};
    }
    .lmu-avatar-dropdown-item.danger { color: #ef4444; }
  `;function ae(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let o=document.createElement("div");o.className="lmu-avatar-host";let n=o.attachShadow({mode:"closed"}),a=!1;function c(){if(!i){n.innerHTML=`
          <style>${W}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${r("btn.login")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,n.getElementById("lmu-av-login")?.addEventListener("click",()=>{_("login")});return}let s=i.displayName?.charAt(0)?.toUpperCase()??"?";n.innerHTML=`
        <style>${W}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${i.avatar?`<img src="${i.avatar}" alt="" />`:s}
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
      `,n.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{a=!a,c()}),n.getElementById("lmu-av-profile")?.addEventListener("click",()=>{a=!1,c(),window.open(`${m}/login?app=${p}&tab=profile`,"_blank")}),n.getElementById("lmu-av-logout")?.addEventListener("click",()=>{a=!1,A.logout()})}function l(s){a&&!o.contains(s.target)&&(a=!1,c())}document.addEventListener("click",l),t.appendChild(o),c();let y=A.onAuthChange(()=>{a=!1,c()});return()=>{y(),document.removeEventListener("click",l),o.remove()}}let A={get ready(){return P},get user(){return i},login(){if(O==="redirect"){window.location.href=`${m}/login?app=${p}&redirect=${encodeURIComponent(window.location.href)}`;return}_("login")},register(){if(O==="redirect"){window.location.href=`${m}/login?app=${p}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}_("register")},async logout(){let e=B();if(e)try{await fetch(`${m}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}R(),i=null,L&&clearTimeout(L),$()},getToken(){return B()},onAuthChange(e){if(H.push(e),P)try{e(i)}catch{}return()=>{let t=H.indexOf(e);t!==-1&&H.splice(t,1)}},openAdmin(){window.open(`${m}/admin`,"_blank")},renderProfileCard(e){return ie(e)},renderAvatar(e){return ae(e)}};window.letmeuse=A,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>V()):V()})();})();
