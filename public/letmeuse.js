"use strict";(()=>{(function(){let h=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),u=h?.getAttribute("data-app-id")??"",A=h?.getAttribute("data-theme")??"light",l=h?.getAttribute("data-accent")??"#2563eb",ee=h?.getAttribute("data-locale")??"en",j=h?.getAttribute("data-mode")??"modal",p=h?.src?new URL(h.src).origin:window.location.origin;u||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");let F={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In",zh:"\u767B\u5165"},"btn.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"switch.toRegister":{en:"Don't have an account? Sign up",zh:"\u6C92\u6709\u5E33\u865F\uFF1F\u8A3B\u518A"},"switch.toLogin":{en:"Already have an account? Sign in",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F\u767B\u5165"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"},"error.passwordTooShort":{en:"Password must be at least 8 characters",zh:"\u5BC6\u78BC\u81F3\u5C11\u9700\u8981 8 \u500B\u5B57\u5143"}};function a(e){return F[e]?.[ee]??F[e]?.en??e}let q=`lmu_${u}_`,H=`${q}access_token`,P=`${q}refresh_token`;function S(){return localStorage.getItem(H)}function D(){return localStorage.getItem(P)}function w(e,t){localStorage.setItem(H,e),localStorage.setItem(P,t)}function L(){localStorage.removeItem(H),localStorage.removeItem(P)}async function z(e,t){let r=await fetch(`${p}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),o=await r.json();if(!r.ok)throw new Error(o.error??a("error.generic"));return o.data??o}async function U(e,t){let r={};t&&(r.Authorization=`Bearer ${t}`);let o=await fetch(`${p}${e}`,{headers:r}),i=await o.json();if(!o.ok)throw new Error(i.error??a("error.generic"));return i.data??i}let y=[];async function te(){if(u)try{y=(await U(`/api/auth/providers?app_id=${u}`,"")).providers??[]}catch{y=[]}}function G(e){let t=encodeURIComponent(window.location.href);window.location.href=`${p}/api/auth/oauth/${e}?app_id=${u}&redirect=${t}`}let n=null,B=!1,C=[],k=null;function v(){for(let e of C)try{e(n)}catch{}}function re(e){try{let t=JSON.parse(atob(e.split(".")[1]));return t.exp?t.exp*1e3:null}catch{return null}}function $(){k&&clearTimeout(k);let e=S();if(!e)return;let t=re(e);if(!t)return;let r=t-Date.now()-300*1e3;if(r<=0){Y();return}k=setTimeout(Y,r)}async function Y(){let e=D();if(e)try{let t=await z("/api/auth/refresh",{refreshToken:e});w(t.accessToken,t.refreshToken),$()}catch{L(),n=null,v()}}function oe(){let e=window.location.hash;if(!e.includes("lmu_token="))return!1;let t=new URLSearchParams(e.slice(1)),r=t.get("lmu_token"),o=t.get("lmu_refresh");return r&&o?(w(r,o),window.history.replaceState(null,"",window.location.pathname+window.location.search),!0):!1}async function V(){oe(),await te();let e=S();if(!e){B=!0,v();return}try{n=(await U("/api/auth/me",e)).user,$()}catch{let t=D();if(t)try{let r=await z("/api/auth/refresh",{refreshToken:t});w(r.accessToken,r.refreshToken),n=(await U("/api/auth/me",r.accessToken)).user,$()}catch{L()}else L()}B=!0,v()}function J(e){return{bg:e?"#1e1e2e":"#ffffff",textColor:e?"#cdd6f4":"#1e293b",subtextColor:e?"#a6adc8":"#64748b",inputBg:e?"#313244":"#f8fafc",inputBorder:e?"#45475a":"#e2e8f0",errorBg:e?"#3b1c1c":"#fef2f2",errorColor:e?"#f87171":"#dc2626",errorBorder:e?"#5c2828":"#fecaca",hoverBg:e?"#3b3b50":"#f1f5f9",roleBg:e?"#313244":"#f1f5f9",dropdownItemHoverBg:e?"#313244":"#f8fafc"}}function ne(){let e=document.documentElement.getAttribute("data-theme");return e==="dark"?!0:e==="light"?!1:document.documentElement.classList.contains("dark")?!0:window.matchMedia("(prefers-color-scheme: dark)").matches}function K(){return A==="auto"?ne():A==="dark"}let I=K(),g=new Set;function x(e){let t=J(I);e.style.setProperty("--lmu-bg",t.bg),e.style.setProperty("--lmu-text",t.textColor),e.style.setProperty("--lmu-subtext",t.subtextColor),e.style.setProperty("--lmu-input-bg",t.inputBg),e.style.setProperty("--lmu-input-border",t.inputBorder),e.style.setProperty("--lmu-error-bg",t.errorBg),e.style.setProperty("--lmu-error-color",t.errorColor),e.style.setProperty("--lmu-error-border",t.errorBorder),e.style.setProperty("--lmu-hover-bg",t.hoverBg),e.style.setProperty("--lmu-role-bg",t.roleBg),e.style.setProperty("--lmu-dropdown-item-hover-bg",t.dropdownItemHoverBg)}function ie(){for(let e of g)x(e)}function X(){let e=K();e!==I&&(I=e,ie())}A==="auto"&&(new MutationObserver(()=>{X()}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{X()}));let ae=J(I);function le(e){return`
      --lmu-bg: ${e.bg};
      --lmu-text: ${e.textColor};
      --lmu-subtext: ${e.subtextColor};
      --lmu-input-bg: ${e.inputBg};
      --lmu-input-border: ${e.inputBorder};
      --lmu-error-bg: ${e.errorBg};
      --lmu-error-color: ${e.errorColor};
      --lmu-error-border: ${e.errorBorder};
      --lmu-hover-bg: ${e.hoverBg};
      --lmu-role-bg: ${e.roleBg};
      --lmu-dropdown-item-hover-bg: ${e.dropdownItemHoverBg};
    `}let R=le(ae),se=`
    :host {
      ${R}
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
      background: var(--lmu-bg);
      color: var(--lmu-text);
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
      color: var(--lmu-subtext);
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
    .lmu-close:hover { background: var(--lmu-input-bg); }
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
      color: var(--lmu-subtext);
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
      border: 1.5px solid var(--lmu-input-border);
      border-radius: 10px;
      font-size: 15px;
      font-family: inherit;
      line-height: 44px;
      background: var(--lmu-input-bg);
      color: var(--lmu-text);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .lmu-input:focus {
      border-color: ${l};
      box-shadow: 0 0 0 3px ${l}22;
    }
    .lmu-input::placeholder {
      color: var(--lmu-subtext);
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
      background: ${l};
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
      color: var(--lmu-subtext);
    }
    .lmu-switch a {
      color: ${l};
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
    }
    .lmu-switch a:hover { text-decoration: underline; }
    .lmu-error {
      background: var(--lmu-error-bg);
      color: var(--lmu-error-color);
      padding: 11px 14px;
      margin: 0 0 18px 0;
      border-radius: 10px;
      font-size: 13px;
      border: 1px solid var(--lmu-error-border);
    }
    .lmu-divider {
      display: flex;
      align-items: center;
      margin: 22px 0 18px 0;
      padding: 0;
      gap: 12px;
      font-size: 12px;
      color: var(--lmu-subtext);
    }
    .lmu-divider::before,
    .lmu-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--lmu-input-border);
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
      border: 1.5px solid var(--lmu-input-border);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      line-height: 44px;
      cursor: pointer;
      background: var(--lmu-input-bg);
      color: var(--lmu-text);
      transition: border-color 0.2s, background 0.15s;
    }
    .lmu-oauth-btn:hover {
      border-color: ${l};
      background: var(--lmu-hover-bg);
    }
    .lmu-oauth-btn svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    @media (max-width: 480px) {
      .lmu-card { margin: 16px; padding: 28px; }
    }
  `;function M(e){let t=document.getElementById("lmu-auth-host");t&&(g.delete(t),t.remove());let r=e,o="",i=!1,s=document.createElement("div");s.id="lmu-auth-host",s.style.cssText="position:fixed;inset:0;z-index:99999;";let d=s.attachShadow({mode:"closed"});g.add(s);function b(){g.delete(s),s.remove()}d.addEventListener("click",c=>{let E=d.querySelector(".lmu-card");E&&!E.contains(c.target)&&d.contains(c.target)&&b()});function m(){let c=r==="login";d.innerHTML=`
        <style>${se}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${a(c?"title.login":"title.register")}</div>
          ${o?`<div class="lmu-error">${o}</div>`:""}
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
              <input class="lmu-input" type="password" name="password" id="lmu-password-input" required minlength="${c?1:8}" />
            </div>
            ${c?`<div style="text-align:right;margin:-10px 0 8px 0;"><a id="lmu-forgot-pw" style="font-size:12px;color:${l};cursor:pointer;text-decoration:none;">${a("link.forgotPassword")}</a></div>`:""}
            <button class="lmu-btn" type="submit" ${i?"disabled":""}>
              ${a(i?"msg.loading":c?"btn.login":"btn.register")}
            </button>
          </form>
          ${y.length>0?`
            <div class="lmu-divider">${a("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${y.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${a("oauth.google")}
                </button>
              `:""}
              ${y.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="var(--lmu-text)"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
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
      `,x(s),d.getElementById("lmu-close-btn")?.addEventListener("click",()=>b()),d.getElementById("lmu-oauth-google")?.addEventListener("click",()=>G("google")),d.getElementById("lmu-oauth-github")?.addEventListener("click",()=>G("github")),d.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{b(),window.open(`${p}/login?app=${u}&tab=login`,"_blank")}),d.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{r=c?"register":"login",o="",m()});let E=d.getElementById("lmu-auth-form");E?.addEventListener("submit",async ce=>{if(ce.preventDefault(),i)return;let _=new FormData(E),Z=_.get("email"),N=_.get("password");if(i=!0,o="",m(),!c&&N.length<8){o=a("error.passwordTooShort"),i=!1,m();return}try{if(c){let f=await z("/api/auth/login",{appId:u,email:Z,password:N});w(f.accessToken,f.refreshToken),n=f.user,$(),v(),b()}else{let f=_.get("displayName"),O=await z("/api/auth/register",{appId:u,email:Z,password:N,displayName:f});w(O.accessToken,O.refreshToken),n=O.user,$(),v(),b()}}catch(f){o=f instanceof Error?f.message:a("error.generic"),i=!1,m()}})}m(),document.body.appendChild(s),setTimeout(()=>{d.querySelector("input")?.focus()},50)}let Q=`
    :host {
      ${R}
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-profile-card {
      background: var(--lmu-bg);
      color: var(--lmu-text);
      border-radius: 12px;
      border: 1px solid var(--lmu-input-border);
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
      background: ${l};
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
      color: var(--lmu-subtext);
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
      background: var(--lmu-role-bg);
      color: var(--lmu-subtext);
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
      border: 1px solid var(--lmu-input-border);
      background: var(--lmu-input-bg);
      color: var(--lmu-text);
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .lmu-profile-btn:hover {
      border-color: ${l};
      background: var(--lmu-hover-bg);
    }
    .lmu-profile-btn.primary {
      background: ${l};
      color: #fff;
      border-color: ${l};
    }
    .lmu-profile-btn.primary:hover { opacity: 0.9; }
    .lmu-profile-login {
      text-align: center;
      padding: 8px 0;
    }
    .lmu-profile-login a {
      color: ${l};
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .lmu-profile-login a:hover { text-decoration: underline; }
  `;function de(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let r=document.createElement("div");r.className="lmu-profile-card-host";let o=r.attachShadow({mode:"closed"});g.add(r);function i(){if(!n){o.innerHTML=`
          <style>${Q}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${a("btn.login")}</a>
            </div>
          </div>
        `,x(r),o.getElementById("lmu-pc-login")?.addEventListener("click",()=>{M("login")});return}let d=n.displayName?.charAt(0)?.toUpperCase()??"?";o.innerHTML=`
        <style>${Q}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${n.avatar?`<img src="${n.avatar}" alt="" />`:d}
            </div>
            <div class="lmu-profile-info">
              <p class="lmu-profile-name">${n.displayName}</p>
              <p class="lmu-profile-email">${n.email}</p>
            </div>
          </div>
          <div class="lmu-profile-role">${n.role}</div>
          <div class="lmu-profile-actions">
            <button class="lmu-profile-btn primary" id="lmu-pc-edit">Edit Profile</button>
            <button class="lmu-profile-btn" id="lmu-pc-logout">Logout</button>
          </div>
        </div>
      `,x(r),o.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{T.logout()}),o.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{window.open(`${p}/account?app=${u}`,"_blank")})}t.appendChild(r),i();let s=T.onAuthChange(()=>i());return()=>{s(),g.delete(r),r.remove()}}let W=`
    :host {
      ${R}
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
      border: 2px solid var(--lmu-input-border);
      background: ${l};
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
      border-color: ${l};
      box-shadow: 0 0 0 2px ${l}33;
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
      border: 2px dashed var(--lmu-input-border);
      background: var(--lmu-input-bg);
      color: var(--lmu-subtext);
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;
      padding: 0;
    }
    .lmu-avatar-login:hover { border-color: ${l}; color: ${l}; }
    .lmu-avatar-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: var(--lmu-bg);
      border: 1px solid var(--lmu-input-border);
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      min-width: 200px;
      z-index: 99999;
      overflow: hidden;
    }
    .lmu-avatar-dropdown-header {
      padding: 12px 14px;
      border-bottom: 1px solid var(--lmu-input-border);
    }
    .lmu-avatar-dropdown-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--lmu-text);
      margin: 0;
    }
    .lmu-avatar-dropdown-email {
      font-size: 12px;
      color: var(--lmu-subtext);
      margin: 2px 0 0;
    }
    .lmu-avatar-dropdown-item {
      display: block;
      width: 100%;
      padding: 10px 14px;
      border: none;
      background: none;
      color: var(--lmu-text);
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s;
    }
    .lmu-avatar-dropdown-item:hover {
      background: var(--lmu-dropdown-item-hover-bg);
    }
    .lmu-avatar-dropdown-item.danger { color: #ef4444; }
  `;function ue(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let r=document.createElement("div");r.className="lmu-avatar-host";let o=r.attachShadow({mode:"closed"});g.add(r);let i=!1;function s(){if(!n){o.innerHTML=`
          <style>${W}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${a("btn.login")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,x(r),o.getElementById("lmu-av-login")?.addEventListener("click",()=>{M("login")});return}let m=n.displayName?.charAt(0)?.toUpperCase()??"?";o.innerHTML=`
        <style>${W}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${n.avatar?`<img src="${n.avatar}" alt="" />`:m}
        </button>
        ${i?`
          <div class="lmu-avatar-dropdown">
            <div class="lmu-avatar-dropdown-header">
              <p class="lmu-avatar-dropdown-name">${n.displayName}</p>
              <p class="lmu-avatar-dropdown-email">${n.email}</p>
            </div>
            <button class="lmu-avatar-dropdown-item" id="lmu-av-profile">Edit Profile</button>
            <button class="lmu-avatar-dropdown-item danger" id="lmu-av-logout">Logout</button>
          </div>
        `:""}
      `,x(r),o.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{i=!i,s()}),o.getElementById("lmu-av-profile")?.addEventListener("click",()=>{i=!1,s(),window.open(`${p}/account?app=${u}`,"_blank")}),o.getElementById("lmu-av-logout")?.addEventListener("click",()=>{i=!1,T.logout()})}function d(m){i&&!r.contains(m.target)&&(i=!1,s())}document.addEventListener("click",d),t.appendChild(r),s();let b=T.onAuthChange(()=>{i=!1,s()});return()=>{b(),g.delete(r),document.removeEventListener("click",d),r.remove()}}let T={get ready(){return B},get user(){return n},login(){if(j==="redirect"){window.location.href=`${p}/login?app=${u}&redirect=${encodeURIComponent(window.location.href)}`;return}M("login")},register(){if(j==="redirect"){window.location.href=`${p}/login?app=${u}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}M("register")},async logout(){let e=S();if(e)try{await fetch(`${p}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}L(),n=null,k&&clearTimeout(k),v()},getToken(){return S()},onAuthChange(e){if(C.push(e),B)try{e(n)}catch{}return()=>{let t=C.indexOf(e);t!==-1&&C.splice(t,1)}},openAdmin(){window.open(`${p}/admin`,"_blank")},openProfile(){window.open(`${p}/account?app=${u}`,"_blank")},renderProfileCard(e){return de(e)},renderAvatar(e){return ue(e)}};window.letmeuse=T,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>V()):V()})();})();
