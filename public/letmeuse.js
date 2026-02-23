"use strict";(()=>{(function(){let S=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),v=S?.getAttribute("data-app-id")??"",J=S?.getAttribute("data-theme")??"light",u=S?.getAttribute("data-accent")??"#2563eb",M=S?.getAttribute("data-locale")??"en",ee=S?.getAttribute("data-mode")??"modal",b=S?.src?new URL(S.src).origin:window.location.origin;v||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");let te={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In",zh:"\u767B\u5165"},"btn.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"switch.toRegister":{en:"Don't have an account? Sign up",zh:"\u6C92\u6709\u5E33\u865F\uFF1F\u8A3B\u518A"},"switch.toLogin":{en:"Already have an account? Sign in",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F\u767B\u5165"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"},"error.passwordTooShort":{en:"Password must be at least 8 characters",zh:"\u5BC6\u78BC\u81F3\u5C11\u9700\u8981 8 \u500B\u5B57\u5143"},"forgot.title":{en:"Reset Password",zh:"\u91CD\u8A2D\u5BC6\u78BC"},"forgot.description":{en:"Enter your email to receive a reset link.",zh:"\u8F38\u5165\u4FE1\u7BB1\u4EE5\u6536\u53D6\u91CD\u8A2D\u9023\u7D50\u3002"},"forgot.send":{en:"Send Reset Link",zh:"\u767C\u9001\u91CD\u8A2D\u9023\u7D50"},"forgot.sent":{en:"Check your email for the reset link!",zh:"\u91CD\u8A2D\u9023\u7D50\u5DF2\u5BC4\u51FA\uFF0C\u8ACB\u67E5\u770B\u4FE1\u7BB1\uFF01"},"forgot.backToLogin":{en:"Back to Sign In",zh:"\u8FD4\u56DE\u767B\u5165"},"profile.title":{en:"Account Settings",zh:"\u5E33\u865F\u8A2D\u5B9A"},"profile.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"profile.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"profile.role":{en:"Role",zh:"\u89D2\u8272"},"profile.save":{en:"Save",zh:"\u5132\u5B58"},"profile.saving":{en:"Saving...",zh:"\u5132\u5B58\u4E2D..."},"profile.saved":{en:"Saved!",zh:"\u5DF2\u5132\u5B58\uFF01"},"profile.changePassword":{en:"Change Password",zh:"\u8B8A\u66F4\u5BC6\u78BC"},"profile.currentPassword":{en:"Current Password",zh:"\u76EE\u524D\u5BC6\u78BC"},"profile.newPassword":{en:"New Password",zh:"\u65B0\u5BC6\u78BC"},"profile.confirmPassword":{en:"Confirm Password",zh:"\u78BA\u8A8D\u5BC6\u78BC"},"profile.passwordMismatch":{en:"Passwords do not match",zh:"\u5169\u6B21\u5BC6\u78BC\u4E0D\u4E00\u81F4"},"profile.passwordChanged":{en:"Password changed!",zh:"\u5BC6\u78BC\u5DF2\u8B8A\u66F4\uFF01"},"profile.logout":{en:"Log Out",zh:"\u767B\u51FA"},"profile.avatar":{en:"Change Avatar",zh:"\u66F4\u63DB\u982D\u50CF"},"profile.avatarUploading":{en:"Uploading...",zh:"\u4E0A\u50B3\u4E2D..."},"profile.avatarUpdated":{en:"Avatar updated!",zh:"\u982D\u50CF\u5DF2\u66F4\u65B0\uFF01"},"profile.emailVerified":{en:"Verified",zh:"\u5DF2\u9A57\u8B49"},"profile.emailNotVerified":{en:"Not verified",zh:"\u672A\u9A57\u8B49"},"profile.resendVerification":{en:"Resend",zh:"\u91CD\u5BC4"},"profile.verificationSent":{en:"Verification email sent!",zh:"\u9A57\u8B49\u4FE1\u5DF2\u5BC4\u51FA\uFF01"}};function r(e){return te[e]?.[M]??te[e]?.en??e}let re=`lmu_${v}_`,K=`${re}access_token`,W=`${re}refresh_token`;function A(){return localStorage.getItem(K)}function oe(){return localStorage.getItem(W)}function H(e,t){localStorage.setItem(K,e),localStorage.setItem(W,t)}function _(){localStorage.removeItem(K),localStorage.removeItem(W)}async function P(e,t){let o=await fetch(`${b}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await o.json();if(!o.ok)throw new Error(n.error??r("error.generic"));return n.data??n}async function X(e,t){let o={};t&&(o.Authorization=`Bearer ${t}`);let n=await fetch(`${b}${e}`,{headers:o}),i=await n.json();if(!n.ok)throw new Error(i.error??r("error.generic"));return i.data??i}async function he(e,t,o){let n=await fetch(`${b}${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(t)}),i=await n.json();if(!n.ok)throw new Error(i.error??r("error.generic"));return i.data??i}async function ve(e,t,o){let n=await fetch(`${b}${e}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(t)}),i=await n.json();if(!n.ok)throw new Error(i.error??r("error.generic"));return i.data??i}let N=[];async function be(){if(v)try{N=(await X(`/api/auth/providers?app_id=${v}`,"")).providers??[]}catch{N=[]}}function ne(e){let t=encodeURIComponent(window.location.href);window.location.href=`${b}/api/auth/oauth/${e}?app_id=${v}&redirect=${t}`}let a=null,V=!1,q=[],U=null;function $(){for(let e of q)try{e(a)}catch{}}function xe(e){try{let t=JSON.parse(atob(e.split(".")[1]));return t.exp?t.exp*1e3:null}catch{return null}}function R(){U&&clearTimeout(U);let e=A();if(!e)return;let t=xe(e);if(!t)return;let o=t-Date.now()-300*1e3;if(o<=0){ae();return}U=setTimeout(ae,o)}async function ae(){let e=oe();if(e)try{let t=await P("/api/auth/refresh",{refreshToken:e});H(t.accessToken,t.refreshToken),R()}catch{_(),a=null,$()}}function we(){let e=window.location.hash;if(!e.includes("lmu_token="))return!1;let t=new URLSearchParams(e.slice(1)),o=t.get("lmu_token"),n=t.get("lmu_refresh");return o&&n?(H(o,n),window.history.replaceState(null,"",window.location.pathname+window.location.search),!0):!1}async function ie(){we(),await be();let e=A();if(!e){V=!0,$();return}try{a=(await X("/api/auth/me",e)).user,R()}catch{let t=oe();if(t)try{let o=await P("/api/auth/refresh",{refreshToken:t});H(o.accessToken,o.refreshToken),a=(await X("/api/auth/me",o.accessToken)).user,R()}catch{_()}else _()}V=!0,$()}function le(e){return{bg:e?"#1e1e2e":"#ffffff",textColor:e?"#cdd6f4":"#1e293b",subtextColor:e?"#a6adc8":"#64748b",inputBg:e?"#313244":"#f8fafc",inputBorder:e?"#45475a":"#e2e8f0",errorBg:e?"#3b1c1c":"#fef2f2",errorColor:e?"#f87171":"#dc2626",errorBorder:e?"#5c2828":"#fecaca",hoverBg:e?"#3b3b50":"#f1f5f9",roleBg:e?"#313244":"#f1f5f9",dropdownItemHoverBg:e?"#313244":"#f8fafc"}}function ye(){let e=document.documentElement.getAttribute("data-theme");return e==="dark"?!0:e==="light"?!1:document.documentElement.classList.contains("dark")?!0:window.matchMedia("(prefers-color-scheme: dark)").matches}function se(){return J==="auto"?ye():J==="dark"}let D=se(),x=new Set;function E(e){let t=le(D);e.style.setProperty("--lmu-bg",t.bg),e.style.setProperty("--lmu-text",t.textColor),e.style.setProperty("--lmu-subtext",t.subtextColor),e.style.setProperty("--lmu-input-bg",t.inputBg),e.style.setProperty("--lmu-input-border",t.inputBorder),e.style.setProperty("--lmu-error-bg",t.errorBg),e.style.setProperty("--lmu-error-color",t.errorColor),e.style.setProperty("--lmu-error-border",t.errorBorder),e.style.setProperty("--lmu-hover-bg",t.hoverBg),e.style.setProperty("--lmu-role-bg",t.roleBg),e.style.setProperty("--lmu-dropdown-item-hover-bg",t.dropdownItemHoverBg)}function ke(){for(let e of x)E(e)}function de(){let e=se();e!==D&&(D=e,ke())}J==="auto"&&(new MutationObserver(()=>{de()}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{de()}));let $e=le(D);function Ee(e){return`
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
    `}let G=Ee($e),ue=`
    :host {
      ${G}
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
      border-color: ${u};
      box-shadow: 0 0 0 3px ${u}22;
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
      color: var(--lmu-subtext);
    }
    .lmu-switch a {
      color: ${u};
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
    .lmu-success {
      background: #ecfdf5;
      color: #059669;
      padding: 11px 14px;
      margin: 0 0 18px 0;
      border-radius: 10px;
      font-size: 13px;
      border: 1px solid #a7f3d0;
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
      border-color: ${u};
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
  `;function j(e){let t=document.getElementById("lmu-auth-host");t&&(x.delete(t),t.remove());let o=e,n="",i="",s=!1,m=document.createElement("div");m.id="lmu-auth-host",m.style.cssText="position:fixed;inset:0;z-index:99999;";let d=m.attachShadow({mode:"closed"});x.add(m);function g(){x.delete(m),m.remove()}d.addEventListener("click",p=>{let z=d.querySelector(".lmu-card");z&&!z.contains(p.target)&&d.contains(p.target)&&g()});function f(){let p=o==="login";if(o==="forgot"){d.innerHTML=`
          <style>${ue}</style>
          <div class="lmu-card">
            <button class="lmu-close" id="lmu-close-btn">&times;</button>
            <div class="lmu-title">${r("forgot.title")}</div>
            ${i?`<div class="lmu-success">${i}</div>`:""}
            ${n?`<div class="lmu-error">${n}</div>`:""}
            ${i?"":`
              <p style="font-size:14px;color:var(--lmu-subtext);margin:0 0 18px 0;text-align:center;">${r("forgot.description")}</p>
              <form id="lmu-forgot-form">
                <div class="lmu-field">
                  <label class="lmu-label">${r("label.email")}</label>
                  <input class="lmu-input" type="email" name="email" required />
                </div>
                <button class="lmu-btn" type="submit" ${s?"disabled":""}>
                  ${r(s?"msg.loading":"forgot.send")}
                </button>
              </form>
            `}
            <div class="lmu-switch">
              <a id="lmu-back-login">${r("forgot.backToLogin")}</a>
            </div>
          </div>
        `,E(m),d.getElementById("lmu-close-btn")?.addEventListener("click",()=>g()),d.getElementById("lmu-back-login")?.addEventListener("click",()=>{o="login",n="",i="",f()});let y=d.getElementById("lmu-forgot-form");y?.addEventListener("submit",async h=>{h.preventDefault();let k=new FormData(y).get("email");s=!0,n="",f();try{await P("/api/auth/forgot-password",{appId:v,email:k}),s=!1,i=r("forgot.sent"),f()}catch(l){n=l instanceof Error?l.message:r("error.generic"),s=!1,f()}});return}d.innerHTML=`
        <style>${ue}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${r(p?"title.login":"title.register")}</div>
          ${n?`<div class="lmu-error">${n}</div>`:""}
          <form id="lmu-auth-form">
            ${p?"":`
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
              <input class="lmu-input" type="password" name="password" id="lmu-password-input" required minlength="${p?1:8}" />
            </div>
            ${p?`<div style="text-align:right;margin:-10px 0 8px 0;"><a id="lmu-forgot-pw" style="font-size:12px;color:${u};cursor:pointer;text-decoration:none;">${r("link.forgotPassword")}</a></div>`:""}
            <button class="lmu-btn" type="submit" ${s?"disabled":""}>
              ${r(s?"msg.loading":p?"btn.login":"btn.register")}
            </button>
          </form>
          ${N.length>0?`
            <div class="lmu-divider">${r("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${N.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${r("oauth.google")}
                </button>
              `:""}
              ${N.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="var(--lmu-text)"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${r("oauth.github")}
                </button>
              `:""}
            </div>
          `:""}
          <div class="lmu-switch">
            <a id="lmu-switch-mode">
              ${r(p?"switch.toRegister":"switch.toLogin")}
            </a>
          </div>
        </div>
      `,E(m),d.getElementById("lmu-close-btn")?.addEventListener("click",()=>g()),d.getElementById("lmu-oauth-google")?.addEventListener("click",()=>ne("google")),d.getElementById("lmu-oauth-github")?.addEventListener("click",()=>ne("github")),d.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{o="forgot",n="",i="",f()}),d.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{o=p?"register":"login",n="",f()});let T=d.getElementById("lmu-auth-form");T?.addEventListener("submit",async y=>{if(y.preventDefault(),s)return;let h=new FormData(T),c=h.get("email"),k=h.get("password");if(s=!0,n="",f(),!p&&k.length<8){n=r("error.passwordTooShort"),s=!1,f();return}try{if(p){let l=await P("/api/auth/login",{appId:v,email:c,password:k});H(l.accessToken,l.refreshToken),a=l.user,R(),$(),g()}else{let l=h.get("displayName"),L=await P("/api/auth/register",{appId:v,email:c,password:k,displayName:l});H(L.accessToken,L.refreshToken),a=L.user,R(),$(),g()}}catch(l){n=l instanceof Error?l.message:r("error.generic"),s=!1,f()}})}f(),document.body.appendChild(m),setTimeout(()=>{d.querySelector("input")?.focus()},50)}let ze=`
    :host {
      ${G}
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
      background: ${u}; color: #fff; display: flex;
      align-items: center; justify-content: center;
      font-size: 24px; font-weight: 600; flex-shrink: 0; overflow: hidden;
      cursor: pointer; position: relative; transition: opacity 0.15s;
    }
    .lmu-avatar-circle:hover { opacity: 0.8; }
    .lmu-avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
    .lmu-avatar-overlay {
      position: absolute; inset: 0; background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.15s; border-radius: 50%;
    }
    .lmu-avatar-circle:hover .lmu-avatar-overlay { opacity: 1; }
    .lmu-avatar-overlay svg { width: 20px; height: 20px; }
    .lmu-badge {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 600; padding: 2px 8px;
      border-radius: 9999px;
    }
    .lmu-badge-verified { background: #ecfdf5; color: #059669; }
    .lmu-badge-unverified { background: var(--lmu-error-bg); color: var(--lmu-error-color); }
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
    .lmu-input:focus { border-color: ${u}; box-shadow: 0 0 0 3px ${u}22; }
    .lmu-input:disabled { opacity: 0.6; cursor: not-allowed; }
    .lmu-row { display: flex; gap: 8px; margin-top: 10px; }
    .lmu-btn-sm {
      height: 38px; padding: 0 16px; border-radius: 8px;
      font-size: 13px; font-weight: 600; font-family: inherit;
      cursor: pointer; border: none; transition: opacity 0.15s;
    }
    .lmu-btn-primary {
      background: ${u}; color: #fff;
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
  `;function Q(){if(!a){j("login");return}let e=document.getElementById("lmu-profile-host");e&&(x.delete(e),e.remove());let t=A();if(!t)return;let o=t,n=!1,i=a.displayName,s=!1,m=!1,d=!1,g="",f="",p=!1,z=!1,T="",y=!1,h=document.createElement("div");h.id="lmu-profile-host",h.style.cssText="position:fixed;inset:0;z-index:99999;";let c=h.attachShadow({mode:"closed"});x.add(h);function k(){x.delete(h),h.remove()}c.addEventListener("click",L=>{let F=c.querySelector(".lmu-card");F&&!F.contains(L.target)&&c.contains(L.target)&&k()});function l(){if(!a)return;let L=a.displayName?.charAt(0)?.toUpperCase()??"?",F=a.avatar?a.avatar.startsWith("http")?a.avatar:`${b}${a.avatar}`:"",pe=a.emailVerified===!0;c.innerHTML=`
        <style>${ze}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close">&times;</button>
          <div class="lmu-title">${r("profile.title")}</div>

          ${T?`<div class="lmu-success" style="margin-bottom:16px;">${T}</div>`:""}

          <div class="lmu-avatar-area">
            <div class="lmu-avatar-circle" id="lmu-avatar-click" title="${r("profile.avatar")}">
              ${F?`<img src="${F}" alt="" />`:L}
              <div class="lmu-avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              ${z?`<div class="lmu-avatar-overlay" style="opacity:1;"><span style="font-size:11px;color:#fff;">${r("profile.avatarUploading")}</span></div>`:""}
            </div>
            <input type="file" id="lmu-avatar-input" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none;" />
            <div class="lmu-avatar-info">
              <p class="lmu-avatar-name">${a.displayName}</p>
              <div style="display:flex;align-items:center;gap:8px;margin-top:2px;">
                <p class="lmu-avatar-email" style="margin:0;">${a.email}</p>
                ${pe?`<span class="lmu-badge lmu-badge-verified">${r("profile.emailVerified")}</span>`:`<span class="lmu-badge lmu-badge-unverified">${r("profile.emailNotVerified")}</span>`}
              </div>
              ${!pe&&!y?`<a id="lmu-resend-verify" style="font-size:11px;color:${u};cursor:pointer;margin-top:4px;display:inline-block;">${r("profile.resendVerification")}</a>`:""}
              ${y?`<span style="font-size:11px;color:#059669;margin-top:4px;display:inline-block;">${r("profile.verificationSent")}</span>`:""}
            </div>
          </div>

          <!-- Display Name Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${r("profile.displayName")}</div>
            ${m?`<div class="lmu-success">${r("profile.saved")}</div>`:""}
            ${n?`
              <div class="lmu-field">
                <input class="lmu-input" type="text" id="lmu-name-input" value="${i.replace(/"/g,"&quot;")}" />
              </div>
              <div class="lmu-row">
                <button class="lmu-btn-sm lmu-btn-primary" id="lmu-name-save" ${s?"disabled":""}>
                  ${r(s?"profile.saving":"profile.save")}
                </button>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-cancel">${M==="zh"?"\u53D6\u6D88":"Cancel"}</button>
              </div>
            `:`
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:15px;">${a.displayName}</span>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-edit" style="padding:0 12px;height:32px;font-size:12px;">
                  ${M==="zh"?"\u7DE8\u8F2F":"Edit"}
                </button>
              </div>
            `}
          </div>

          <!-- Change Password Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${r("profile.changePassword")}</div>
            ${f?`<div class="lmu-success">${f}</div>`:""}
            ${g?`<div class="lmu-error">${g}</div>`:""}
            ${d?`
              <form id="lmu-pw-form">
                <div class="lmu-field">
                  <label class="lmu-label">${r("profile.currentPassword")}</label>
                  <input class="lmu-input" type="password" name="currentPassword" required />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${r("profile.newPassword")}</label>
                  <input class="lmu-input" type="password" name="newPassword" required minlength="8" />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${r("profile.confirmPassword")}</label>
                  <input class="lmu-input" type="password" name="confirmPassword" required minlength="8" />
                </div>
                <div class="lmu-row">
                  <button type="submit" class="lmu-btn-sm lmu-btn-primary" ${p?"disabled":""}>
                    ${r(p?"profile.saving":"profile.save")}
                  </button>
                  <button type="button" class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-cancel">${M==="zh"?"\u53D6\u6D88":"Cancel"}</button>
                </div>
              </form>
            `:`
              <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-show">
                ${M==="zh"?"\u8B8A\u66F4\u5BC6\u78BC":"Change"}
              </button>
            `}
          </div>

          <!-- Logout -->
          <div class="lmu-section">
            <button class="lmu-btn-danger" id="lmu-logout">${r("profile.logout")}</button>
          </div>
        </div>
      `,E(h),c.getElementById("lmu-close")?.addEventListener("click",()=>k());let Se=c.getElementById("lmu-avatar-click"),Z=c.getElementById("lmu-avatar-input");Se?.addEventListener("click",()=>Z?.click()),Z?.addEventListener("change",async()=>{let B=Z.files?.[0];if(!(!B||!o)){if(B.size>2*1024*1024){T="",l();return}z=!0,l();try{let w=new FormData;w.append("file",B);let O=await fetch(`${b}/api/auth/avatar`,{method:"POST",headers:{Authorization:`Bearer ${o}`},body:w}),C=await O.json();if(!O.ok)throw new Error(C.error??r("error.generic"));let Y=C.data;Y?.user&&a&&(a={...a,avatar:Y.user.avatar},$()),z=!1,T=r("profile.avatarUpdated"),l(),setTimeout(()=>{T="",l()},2e3)}catch{z=!1,l()}}}),c.getElementById("lmu-resend-verify")?.addEventListener("click",async()=>{if(o){try{await P("/api/auth/register",{appId:v,resendVerification:!0})}catch{}y=!0,l(),setTimeout(()=>{y=!1},5e3)}}),c.getElementById("lmu-name-edit")?.addEventListener("click",()=>{n=!0,i=a?.displayName??"",m=!1,l(),c.getElementById("lmu-name-input")?.focus()}),c.getElementById("lmu-name-cancel")?.addEventListener("click",()=>{n=!1,l()}),c.getElementById("lmu-name-save")?.addEventListener("click",async()=>{let w=c.getElementById("lmu-name-input")?.value?.trim();if(!(!w||!o)){s=!0,l();try{await he("/api/auth/profile",{displayName:w},o),a&&(a={...a,displayName:w},$()),n=!1,m=!0,s=!1,l(),setTimeout(()=>{m=!1,l()},2e3)}catch{s=!1,l()}}}),c.getElementById("lmu-pw-show")?.addEventListener("click",()=>{d=!0,g="",f="",l()}),c.getElementById("lmu-pw-cancel")?.addEventListener("click",()=>{d=!1,g="",l()});let ge=c.getElementById("lmu-pw-form");ge?.addEventListener("submit",async B=>{B.preventDefault();let w=new FormData(ge),O=w.get("currentPassword"),C=w.get("newPassword"),Y=w.get("confirmPassword");if(C!==Y){g=r("profile.passwordMismatch"),l();return}if(C.length<8){g=r("error.passwordTooShort"),l();return}p=!0,g="",l();try{await ve("/api/auth/change-password",{currentPassword:O,newPassword:C},o),d=!1,p=!1,f=r("profile.passwordChanged"),l(),setTimeout(()=>{f="",l()},3e3)}catch(fe){g=fe instanceof Error?fe.message:r("error.generic"),p=!1,l()}}),c.getElementById("lmu-logout")?.addEventListener("click",()=>{k(),I.logout()})}l(),document.body.appendChild(h)}let ce=`
    :host {
      ${G}
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
      border-color: ${u};
      background: var(--lmu-hover-bg);
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
  `;function Te(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let o=document.createElement("div");o.className="lmu-profile-card-host";let n=o.attachShadow({mode:"closed"});x.add(o);function i(){if(!a){n.innerHTML=`
          <style>${ce}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${r("btn.login")}</a>
            </div>
          </div>
        `,E(o),n.getElementById("lmu-pc-login")?.addEventListener("click",()=>{j("login")});return}let m=a.displayName?.charAt(0)?.toUpperCase()??"?";n.innerHTML=`
        <style>${ce}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${a.avatar?`<img src="${a.avatar}" alt="" />`:m}
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
      `,E(o),n.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{I.logout()}),n.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{Q()})}t.appendChild(o),i();let s=I.onAuthChange(()=>i());return()=>{s(),x.delete(o),o.remove()}}let me=`
    :host {
      ${G}
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
    .lmu-avatar-login:hover { border-color: ${u}; color: ${u}; }
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
  `;function Le(e){let t=typeof e=="string"?document.querySelector(e):e;if(!t)return()=>{};let o=document.createElement("div");o.className="lmu-avatar-host";let n=o.attachShadow({mode:"closed"});x.add(o);let i=!1;function s(){if(!a){n.innerHTML=`
          <style>${me}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${r("btn.login")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,E(o),n.getElementById("lmu-av-login")?.addEventListener("click",()=>{j("login")});return}let g=a.displayName?.charAt(0)?.toUpperCase()??"?";n.innerHTML=`
        <style>${me}</style>
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
      `,E(o),n.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{i=!i,s()}),n.getElementById("lmu-av-profile")?.addEventListener("click",()=>{i=!1,s(),Q()}),n.getElementById("lmu-av-logout")?.addEventListener("click",()=>{i=!1,I.logout()})}function m(g){i&&!o.contains(g.target)&&(i=!1,s())}document.addEventListener("click",m),t.appendChild(o),s();let d=I.onAuthChange(()=>{i=!1,s()});return()=>{d(),x.delete(o),document.removeEventListener("click",m),o.remove()}}let I={get ready(){return V},get user(){return a},login(){if(ee==="redirect"){window.location.href=`${b}/login?app=${v}&redirect=${encodeURIComponent(window.location.href)}`;return}j("login")},register(){if(ee==="redirect"){window.location.href=`${b}/login?app=${v}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}j("register")},async logout(){let e=A();if(e)try{await fetch(`${b}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}_(),a=null,U&&clearTimeout(U),$()},getToken(){return A()},onAuthChange(e){if(q.push(e),V)try{e(a)}catch{}return()=>{let t=q.indexOf(e);t!==-1&&q.splice(t,1)}},openAdmin(){window.open(`${b}/admin`,"_blank")},openProfile(){Q()},renderProfileCard(e){return Te(e)},renderAvatar(e){return Le(e)}};window.letmeuse=I,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>ie()):ie()})();})();
