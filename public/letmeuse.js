"use strict";(()=>{(function(){let y=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),v=y?.getAttribute("data-app-id")??"",_=y?.getAttribute("data-theme")??"light",d=y?.getAttribute("data-accent")??"#2563eb",L=y?.getAttribute("data-locale")??"en",J=y?.getAttribute("data-mode")??"modal",x=y?.src?new URL(y.src).origin:window.location.origin;v||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");let V={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In",zh:"\u767B\u5165"},"btn.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"switch.toRegister":{en:"Don't have an account? Sign up",zh:"\u6C92\u6709\u5E33\u865F\uFF1F\u8A3B\u518A"},"switch.toLogin":{en:"Already have an account? Sign in",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F\u767B\u5165"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"},"error.passwordTooShort":{en:"Password must be at least 8 characters",zh:"\u5BC6\u78BC\u81F3\u5C11\u9700\u8981 8 \u500B\u5B57\u5143"},"profile.title":{en:"Account Settings",zh:"\u5E33\u865F\u8A2D\u5B9A"},"profile.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"profile.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"profile.role":{en:"Role",zh:"\u89D2\u8272"},"profile.save":{en:"Save",zh:"\u5132\u5B58"},"profile.saving":{en:"Saving...",zh:"\u5132\u5B58\u4E2D..."},"profile.saved":{en:"Saved!",zh:"\u5DF2\u5132\u5B58\uFF01"},"profile.changePassword":{en:"Change Password",zh:"\u8B8A\u66F4\u5BC6\u78BC"},"profile.currentPassword":{en:"Current Password",zh:"\u76EE\u524D\u5BC6\u78BC"},"profile.newPassword":{en:"New Password",zh:"\u65B0\u5BC6\u78BC"},"profile.confirmPassword":{en:"Confirm Password",zh:"\u78BA\u8A8D\u5BC6\u78BC"},"profile.passwordMismatch":{en:"Passwords do not match",zh:"\u5169\u6B21\u5BC6\u78BC\u4E0D\u4E00\u81F4"},"profile.passwordChanged":{en:"Password changed!",zh:"\u5BC6\u78BC\u5DF2\u8B8A\u66F4\uFF01"},"profile.logout":{en:"Log Out",zh:"\u767B\u51FA"}};function n(e){return V[e]?.[L]??V[e]?.en??e}let K=`lmu_${v}_`,F=`${K}access_token`,q=`${K}refresh_token`;function P(){return localStorage.getItem(F)}function X(){return localStorage.getItem(q)}function B(e,t){localStorage.setItem(F,e),localStorage.setItem(q,t)}function H(){localStorage.removeItem(F),localStorage.removeItem(q)}async function N(e,t){let r=await fetch(`${x}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),o=await r.json();if(!r.ok)throw new Error(o.error??n("error.generic"));return o.data??o}async function D(e,t){let r={};t&&(r.Authorization=`Bearer ${t}`);let o=await fetch(`${x}${e}`,{headers:r}),i=await o.json();if(!o.ok)throw new Error(i.error??n("error.generic"));return i.data??i}async function le(e,t,r){let o=await fetch(`${x}${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(t)}),i=await o.json();if(!o.ok)throw new Error(i.error??n("error.generic"));return i.data??i}async function se(e,t,r){let o=await fetch(`${x}${e}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(t)}),i=await o.json();if(!o.ok)throw new Error(i.error??n("error.generic"));return i.data??i}let C=[];async function de(){if(v)try{C=(await D(`/api/auth/providers?app_id=${v}`,"")).providers??[]}catch{C=[]}}function Q(e){let t=encodeURIComponent(window.location.href);window.location.href=`${x}/api/auth/oauth/${e}?app_id=${v}&redirect=${t}`}let a=null,R=!1,U=[],I=null;function k(){for(let e of U)try{e(a)}catch{}}function ue(e){try{let t=JSON.parse(atob(e.split(".")[1]));return t.exp?t.exp*1e3:null}catch{return null}}function M(){I&&clearTimeout(I);let e=P();if(!e)return;let t=ue(e);if(!t)return;let r=t-Date.now()-300*1e3;if(r<=0){W();return}I=setTimeout(W,r)}async function W(){let e=X();if(e)try{let t=await N("/api/auth/refresh",{refreshToken:e});B(t.accessToken,t.refreshToken),M()}catch{H(),a=null,k()}}function ce(){let e=window.location.hash;if(!e.includes("lmu_token="))return!1;let t=new URLSearchParams(e.slice(1)),r=t.get("lmu_token"),o=t.get("lmu_refresh");return r&&o?(B(r,o),window.history.replaceState(null,"",window.location.pathname+window.location.search),!0):!1}async function Z(){ce(),await de();let e=P();if(!e){R=!0,k();return}try{a=(await D("/api/auth/me",e)).user,M()}catch{let t=X();if(t)try{let r=await N("/api/auth/refresh",{refreshToken:t});B(r.accessToken,r.refreshToken),a=(await D("/api/auth/me",r.accessToken)).user,M()}catch{H()}else H()}R=!0,k()}function ee(e){return{bg:e?"#1e1e2e":"#ffffff",textColor:e?"#cdd6f4":"#1e293b",subtextColor:e?"#a6adc8":"#64748b",inputBg:e?"#313244":"#f8fafc",inputBorder:e?"#45475a":"#e2e8f0",errorBg:e?"#3b1c1c":"#fef2f2",errorColor:e?"#f87171":"#dc2626",errorBorder:e?"#5c2828":"#fecaca",hoverBg:e?"#3b3b50":"#f1f5f9",roleBg:e?"#313244":"#f1f5f9",dropdownItemHoverBg:e?"#313244":"#f8fafc"}}function me(){let e=document.documentElement.getAttribute("data-theme");return e==="dark"?!0:e==="light"?!1:document.documentElement.classList.contains("dark")?!0:window.matchMedia("(prefers-color-scheme: dark)").matches}function te(){return _==="auto"?me():_==="dark"}let j=te(),b=new Set;function $(e){let t=ee(j);e.style.setProperty("--lmu-bg",t.bg),e.style.setProperty("--lmu-text",t.textColor),e.style.setProperty("--lmu-subtext",t.subtextColor),e.style.setProperty("--lmu-input-bg",t.inputBg),e.style.setProperty("--lmu-input-border",t.inputBorder),e.style.setProperty("--lmu-error-bg",t.errorBg),e.style.setProperty("--lmu-error-color",t.errorColor),e.style.setProperty("--lmu-error-border",t.errorBorder),e.style.setProperty("--lmu-hover-bg",t.hoverBg),e.style.setProperty("--lmu-role-bg",t.roleBg),e.style.setProperty("--lmu-dropdown-item-hover-bg",t.dropdownItemHoverBg)}function pe(){for(let e of b)$(e)}function re(){let e=te();e!==j&&(j=e,pe())}_==="auto"&&(new MutationObserver(()=>{re()}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{re()}));let ge=ee(j);function fe(e){return`
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
    `}let O=fe(ge),he=`
    :host {
      ${O}
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
      border-color: ${d};
      box-shadow: 0 0 0 3px ${d}22;
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
      background: ${d};
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
      color: ${d};
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
      border-color: ${d};
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
  `;function A(e){let t=document.getElementById("lmu-auth-host");t&&(b.delete(t),t.remove());let r=e,o="",i=!1,l=document.createElement("div");l.id="lmu-auth-host",l.style.cssText="position:fixed;inset:0;z-index:99999;";let s=l.attachShadow({mode:"closed"});b.add(l);function m(){b.delete(l),l.remove()}s.addEventListener("click",u=>{let f=s.querySelector(".lmu-card");f&&!f.contains(u.target)&&s.contains(u.target)&&m()});function g(){let u=r==="login";s.innerHTML=`
        <style>${he}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${n(u?"title.login":"title.register")}</div>
          ${o?`<div class="lmu-error">${o}</div>`:""}
          <form id="lmu-auth-form">
            ${u?"":`
              <div class="lmu-field">
                <label class="lmu-label">${n("label.displayName")}</label>
                <input class="lmu-input" type="text" name="displayName" required />
              </div>
            `}
            <div class="lmu-field">
              <label class="lmu-label">${n("label.email")}</label>
              <input class="lmu-input" type="email" name="email" required />
            </div>
            <div class="lmu-field">
              <label class="lmu-label">${n("label.password")}</label>
              <input class="lmu-input" type="password" name="password" id="lmu-password-input" required minlength="${u?1:8}" />
            </div>
            ${u?`<div style="text-align:right;margin:-10px 0 8px 0;"><a id="lmu-forgot-pw" style="font-size:12px;color:${d};cursor:pointer;text-decoration:none;">${n("link.forgotPassword")}</a></div>`:""}
            <button class="lmu-btn" type="submit" ${i?"disabled":""}>
              ${n(i?"msg.loading":u?"btn.login":"btn.register")}
            </button>
          </form>
          ${C.length>0?`
            <div class="lmu-divider">${n("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${C.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${n("oauth.google")}
                </button>
              `:""}
              ${C.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="var(--lmu-text)"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${n("oauth.github")}
                </button>
              `:""}
            </div>
          `:""}
          <div class="lmu-switch">
            <a id="lmu-switch-mode">
              ${n(u?"switch.toRegister":"switch.toLogin")}
            </a>
          </div>
        </div>
      `,$(l),s.getElementById("lmu-close-btn")?.addEventListener("click",()=>m()),s.getElementById("lmu-oauth-google")?.addEventListener("click",()=>Q("google")),s.getElementById("lmu-oauth-github")?.addEventListener("click",()=>Q("github")),s.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{m(),window.open(`${x}/login?app=${v}&tab=login`,"_blank")}),s.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{r=u?"register":"login",o="",g()});let f=s.getElementById("lmu-auth-form");f?.addEventListener("submit",async p=>{if(p.preventDefault(),i)return;let E=new FormData(f),c=E.get("email"),w=E.get("password");if(i=!0,o="",g(),!u&&w.length<8){o=n("error.passwordTooShort"),i=!1,g();return}try{if(u){let h=await N("/api/auth/login",{appId:v,email:c,password:w});B(h.accessToken,h.refreshToken),a=h.user,M(),k(),m()}else{let h=E.get("displayName"),z=await N("/api/auth/register",{appId:v,email:c,password:w,displayName:h});B(z.accessToken,z.refreshToken),a=z.user,M(),k(),m()}}catch(h){o=h instanceof Error?h.message:n("error.generic"),i=!1,g()}})}g(),document.body.appendChild(l),setTimeout(()=>{s.querySelector("input")?.focus()},50)}let be=`
    :host {
      ${O}
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
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-card {
      background: var(--lmu-bg);
      color: var(--lmu-text);
      border-radius: 16px;
      padding: 36px;
      width: 100%;
      max-width: 420px;
      position: relative;
      box-shadow: 0 24px 64px rgba(0,0,0,0.35);
      max-height: 90vh;
      overflow-y: auto;
    }
    .lmu-close {
      position: absolute; top: 14px; right: 14px;
      background: none; border: none; font-size: 22px; cursor: pointer;
      color: var(--lmu-subtext); width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 6px; transition: background 0.15s; padding: 0; margin: 0;
    }
    .lmu-close:hover { background: var(--lmu-input-bg); }
    .lmu-title {
      font-size: 22px; font-weight: 700; margin: 0 0 24px 0;
      text-align: center; letter-spacing: -0.3px;
    }
    .lmu-avatar-area {
      display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
    }
    .lmu-avatar-circle {
      width: 56px; height: 56px; border-radius: 50%;
      background: ${d}; color: #fff; display: flex;
      align-items: center; justify-content: center;
      font-size: 24px; font-weight: 600; flex-shrink: 0; overflow: hidden;
    }
    .lmu-avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
    .lmu-avatar-info { min-width: 0; flex: 1; }
    .lmu-avatar-name {
      font-size: 18px; font-weight: 600; margin: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .lmu-avatar-email {
      font-size: 13px; color: var(--lmu-subtext); margin: 2px 0 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .lmu-section {
      border-top: 1px solid var(--lmu-input-border);
      padding-top: 20px; margin-top: 20px;
    }
    .lmu-section-title {
      font-size: 14px; font-weight: 600; margin: 0 0 14px 0;
    }
    .lmu-field { margin: 0 0 14px 0; }
    .lmu-label {
      display: block; font-size: 13px; font-weight: 600;
      margin: 0 0 6px 0; color: var(--lmu-subtext);
    }
    .lmu-input {
      display: block; width: 100%; height: 42px; padding: 0 12px;
      border: 1.5px solid var(--lmu-input-border); border-radius: 10px;
      font-size: 14px; font-family: inherit; background: var(--lmu-input-bg);
      color: var(--lmu-text); outline: none; transition: border-color 0.2s;
    }
    .lmu-input:focus { border-color: ${d}; box-shadow: 0 0 0 3px ${d}22; }
    .lmu-input:disabled { opacity: 0.6; cursor: not-allowed; }
    .lmu-row { display: flex; gap: 8px; margin-top: 10px; }
    .lmu-btn-sm {
      height: 38px; padding: 0 16px; border-radius: 8px;
      font-size: 13px; font-weight: 600; font-family: inherit;
      cursor: pointer; border: none; transition: opacity 0.15s;
    }
    .lmu-btn-primary {
      background: ${d}; color: #fff;
    }
    .lmu-btn-primary:hover { opacity: 0.9; }
    .lmu-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .lmu-btn-secondary {
      background: var(--lmu-input-bg); color: var(--lmu-text);
      border: 1px solid var(--lmu-input-border);
    }
    .lmu-btn-secondary:hover { background: var(--lmu-hover-bg); }
    .lmu-btn-danger {
      width: 100%; height: 42px; border-radius: 10px;
      font-size: 14px; font-weight: 600; font-family: inherit;
      cursor: pointer; border: 1.5px solid var(--lmu-error-border);
      background: none; color: var(--lmu-error-color); transition: background 0.15s;
    }
    .lmu-btn-danger:hover { background: var(--lmu-error-bg); }
    .lmu-success {
      background: #ecfdf5; color: #059669; padding: 8px 12px;
      border-radius: 8px; font-size: 13px; margin-bottom: 14px;
      border: 1px solid #a7f3d0;
    }
    .lmu-error {
      background: var(--lmu-error-bg); color: var(--lmu-error-color);
      padding: 8px 12px; border-radius: 8px; font-size: 13px;
      margin-bottom: 14px; border: 1px solid var(--lmu-error-border);
    }
    @media (max-width: 480px) {
      .lmu-card { margin: 16px; padding: 28px; }
    }
  `;function G(){if(!a){A("login");return}let e=document.getElementById("lmu-profile-host");e&&(b.delete(e),e.remove());let t=P();if(!t)return;let r=!1,o=a.displayName,i=!1,l=!1,s=!1,m="",g="",u=!1,f=document.createElement("div");f.id="lmu-profile-host",f.style.cssText="position:fixed;inset:0;z-index:99999;";let p=f.attachShadow({mode:"closed"});b.add(f);function E(){b.delete(f),f.remove()}p.addEventListener("click",w=>{let h=p.querySelector(".lmu-card");h&&!h.contains(w.target)&&p.contains(w.target)&&E()});function c(){if(!a)return;let w=a.displayName?.charAt(0)?.toUpperCase()??"?";p.innerHTML=`
        <style>${be}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close">&times;</button>
          <div class="lmu-title">${n("profile.title")}</div>

          <div class="lmu-avatar-area">
            <div class="lmu-avatar-circle">
              ${a.avatar?`<img src="${a.avatar}" alt="" />`:w}
            </div>
            <div class="lmu-avatar-info">
              <p class="lmu-avatar-name">${a.displayName}</p>
              <p class="lmu-avatar-email">${a.email}</p>
            </div>
          </div>

          <!-- Display Name Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${n("profile.displayName")}</div>
            ${l?`<div class="lmu-success">${n("profile.saved")}</div>`:""}
            ${r?`
              <div class="lmu-field">
                <input class="lmu-input" type="text" id="lmu-name-input" value="${o.replace(/"/g,"&quot;")}" />
              </div>
              <div class="lmu-row">
                <button class="lmu-btn-sm lmu-btn-primary" id="lmu-name-save" ${i?"disabled":""}>
                  ${n(i?"profile.saving":"profile.save")}
                </button>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-cancel">${L==="zh"?"\u53D6\u6D88":"Cancel"}</button>
              </div>
            `:`
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:15px;">${a.displayName}</span>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-edit" style="padding:0 12px;height:32px;font-size:12px;">
                  ${L==="zh"?"\u7DE8\u8F2F":"Edit"}
                </button>
              </div>
            `}
          </div>

          <!-- Change Password Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${n("profile.changePassword")}</div>
            ${g?`<div class="lmu-success">${g}</div>`:""}
            ${m?`<div class="lmu-error">${m}</div>`:""}
            ${s?`
              <form id="lmu-pw-form">
                <div class="lmu-field">
                  <label class="lmu-label">${n("profile.currentPassword")}</label>
                  <input class="lmu-input" type="password" name="currentPassword" required />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${n("profile.newPassword")}</label>
                  <input class="lmu-input" type="password" name="newPassword" required minlength="8" />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${n("profile.confirmPassword")}</label>
                  <input class="lmu-input" type="password" name="confirmPassword" required minlength="8" />
                </div>
                <div class="lmu-row">
                  <button type="submit" class="lmu-btn-sm lmu-btn-primary" ${u?"disabled":""}>
                    ${n(u?"profile.saving":"profile.save")}
                  </button>
                  <button type="button" class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-cancel">${L==="zh"?"\u53D6\u6D88":"Cancel"}</button>
                </div>
              </form>
            `:`
              <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-show">
                ${L==="zh"?"\u8B8A\u66F4\u5BC6\u78BC":"Change"}
              </button>
            `}
          </div>

          <!-- Logout -->
          <div class="lmu-section">
            <button class="lmu-btn-danger" id="lmu-logout">${n("profile.logout")}</button>
          </div>
        </div>
      `,$(f),p.getElementById("lmu-close")?.addEventListener("click",()=>E()),p.getElementById("lmu-name-edit")?.addEventListener("click",()=>{r=!0,o=a?.displayName??"",l=!1,c(),p.getElementById("lmu-name-input")?.focus()}),p.getElementById("lmu-name-cancel")?.addEventListener("click",()=>{r=!1,c()}),p.getElementById("lmu-name-save")?.addEventListener("click",async()=>{let T=p.getElementById("lmu-name-input")?.value?.trim();if(!(!T||!t)){i=!0,c();try{await le("/api/auth/profile",{displayName:T},t),a&&(a={...a,displayName:T},k()),r=!1,l=!0,i=!1,c(),setTimeout(()=>{l=!1,c()},2e3)}catch{i=!1,c()}}}),p.getElementById("lmu-pw-show")?.addEventListener("click",()=>{s=!0,m="",g="",c()}),p.getElementById("lmu-pw-cancel")?.addEventListener("click",()=>{s=!1,m="",c()});let h=p.getElementById("lmu-pw-form");h?.addEventListener("submit",async z=>{z.preventDefault();let T=new FormData(h),ie=T.get("currentPassword"),Y=T.get("newPassword"),we=T.get("confirmPassword");if(Y!==we){m=n("profile.passwordMismatch"),c();return}if(Y.length<8){m=n("error.passwordTooShort"),c();return}u=!0,m="",c();try{await se("/api/auth/change-password",{currentPassword:ie,newPassword:Y},t),s=!1,u=!1,g=n("profile.passwordChanged"),c(),setTimeout(()=>{g="",c()},3e3)}catch(ae){m=ae instanceof Error?ae.message:n("error.generic"),u=!1,c()}}),p.getElementById("lmu-logout")?.addEventListener("click",()=>{E(),S.logout()})}c(),document.body.appendChild(f)}let oe=`
    :host {
      ${O}
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
      background: ${d};
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
      border-color: ${d};
      background: var(--lmu-hover-bg);
    }
    .lmu-profile-btn.primary {
      background: ${d};
      color: #fff;
      border-color: ${d};
    }
    .lmu-profile-btn.primary:hover { opacity: 0.9; }
    .lmu-profile-login {
      text-align: center;
      padding: 8px 0;
    }
    .lmu-profile-login a {
      color: ${d};
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .lmu-profile-login a:hover { text-decoration: underline; }
  `;function ve(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let r=document.createElement("div");r.className="lmu-profile-card-host";let o=r.attachShadow({mode:"closed"});b.add(r);function i(){if(!a){o.innerHTML=`
          <style>${oe}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${n("btn.login")}</a>
            </div>
          </div>
        `,$(r),o.getElementById("lmu-pc-login")?.addEventListener("click",()=>{A("login")});return}let s=a.displayName?.charAt(0)?.toUpperCase()??"?";o.innerHTML=`
        <style>${oe}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${a.avatar?`<img src="${a.avatar}" alt="" />`:s}
            </div>
            <div class="lmu-profile-info">
              <p class="lmu-profile-name">${a.displayName}</p>
              <p class="lmu-profile-email">${a.email}</p>
            </div>
          </div>
          <div class="lmu-profile-role">${a.role}</div>
          <div class="lmu-profile-actions">
            <button class="lmu-profile-btn primary" id="lmu-pc-edit">Edit Profile</button>
            <button class="lmu-profile-btn" id="lmu-pc-logout">Logout</button>
          </div>
        </div>
      `,$(r),o.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{S.logout()}),o.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{G()})}t.appendChild(r),i();let l=S.onAuthChange(()=>i());return()=>{l(),b.delete(r),r.remove()}}let ne=`
    :host {
      ${O}
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
      background: ${d};
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
      border-color: ${d};
      box-shadow: 0 0 0 2px ${d}33;
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
    .lmu-avatar-login:hover { border-color: ${d}; color: ${d}; }
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
  `;function xe(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let r=document.createElement("div");r.className="lmu-avatar-host";let o=r.attachShadow({mode:"closed"});b.add(r);let i=!1;function l(){if(!a){o.innerHTML=`
          <style>${ne}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${n("btn.login")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,$(r),o.getElementById("lmu-av-login")?.addEventListener("click",()=>{A("login")});return}let g=a.displayName?.charAt(0)?.toUpperCase()??"?";o.innerHTML=`
        <style>${ne}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${a.avatar?`<img src="${a.avatar}" alt="" />`:g}
        </button>
        ${i?`
          <div class="lmu-avatar-dropdown">
            <div class="lmu-avatar-dropdown-header">
              <p class="lmu-avatar-dropdown-name">${a.displayName}</p>
              <p class="lmu-avatar-dropdown-email">${a.email}</p>
            </div>
            <button class="lmu-avatar-dropdown-item" id="lmu-av-profile">Edit Profile</button>
            <button class="lmu-avatar-dropdown-item danger" id="lmu-av-logout">Logout</button>
          </div>
        `:""}
      `,$(r),o.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{i=!i,l()}),o.getElementById("lmu-av-profile")?.addEventListener("click",()=>{i=!1,l(),G()}),o.getElementById("lmu-av-logout")?.addEventListener("click",()=>{i=!1,S.logout()})}function s(g){i&&!r.contains(g.target)&&(i=!1,l())}document.addEventListener("click",s),t.appendChild(r),l();let m=S.onAuthChange(()=>{i=!1,l()});return()=>{m(),b.delete(r),document.removeEventListener("click",s),r.remove()}}let S={get ready(){return R},get user(){return a},login(){if(J==="redirect"){window.location.href=`${x}/login?app=${v}&redirect=${encodeURIComponent(window.location.href)}`;return}A("login")},register(){if(J==="redirect"){window.location.href=`${x}/login?app=${v}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}A("register")},async logout(){let e=P();if(e)try{await fetch(`${x}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}H(),a=null,I&&clearTimeout(I),k()},getToken(){return P()},onAuthChange(e){if(U.push(e),R)try{e(a)}catch{}return()=>{let t=U.indexOf(e);t!==-1&&U.splice(t,1)}},openAdmin(){window.open(`${x}/admin`,"_blank")},openProfile(){G()},renderProfileCard(e){return ve(e)},renderAvatar(e){return xe(e)}};window.letmeuse=S,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>Z()):Z()})();})();
