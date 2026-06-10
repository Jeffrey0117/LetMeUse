"use strict";(()=>{var ce={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"placeholder.email":{en:"you@example.com",zh:"\u8ACB\u8F38\u5165\u96FB\u5B50\u4FE1\u7BB1"},"placeholder.password":{en:"Enter your password",zh:"\u8ACB\u8F38\u5165\u5BC6\u78BC"},"placeholder.passwordNew":{en:"At least 8 characters",zh:"\u5BC6\u78BC\u9577\u5EA6\u6700\u4F4E 8 \u4F4D"},"placeholder.displayName":{en:"Your name",zh:"\u8ACB\u8F38\u5165\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In Now",zh:"\u7ACB\u5373\u767B\u5165"},"btn.register":{en:"Sign Up Now",zh:"\u7ACB\u5373\u8A3B\u518A"},"switch.toRegisterPrompt":{en:"Don't have an account yet?",zh:"\u9084\u6C92\u6709\u5E33\u865F\uFF1F"},"switch.toRegisterAction":{en:"Sign up now",zh:"\u7ACB\u5373\u8A3B\u518A"},"switch.toLoginPrompt":{en:"Already have an account?",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F"},"switch.toLoginAction":{en:"Sign in now",zh:"\u7ACB\u5373\u767B\u5165"},"register.terms":{en:"By signing up you agree to the Terms of Service & Privacy Policy",zh:"\u8A3B\u518A\u767B\u5165\u5373\u8868\u793A\u540C\u610F \u670D\u52D9\u689D\u6B3E\u3001\u96B1\u79C1\u6B0A\u653F\u7B56"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"error.invalidCredentials":{en:"Invalid email or password",zh:"\u5E33\u865F\u6216\u5BC6\u78BC\u932F\u8AA4"},"error.accountDisabled":{en:"Account is disabled",zh:"\u5E33\u865F\u5DF2\u505C\u7528"},"error.loginFailed":{en:"Login failed",zh:"\u767B\u5165\u5931\u6557"},"error.registrationFailed":{en:"Registration failed",zh:"\u8A3B\u518A\u5931\u6557"},"error.emailInUse":{en:"Email already registered",zh:"\u6B64\u4FE1\u7BB1\u5DF2\u88AB\u8A3B\u518A"},"error.tooManyAttempts":{en:"Too many attempts, please try again later",zh:"\u5617\u8A66\u6B21\u6578\u904E\u591A\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"},"error.passwordTooShort":{en:"Password must be at least 8 characters",zh:"\u5BC6\u78BC\u81F3\u5C11\u9700\u8981 8 \u500B\u5B57\u5143"},"forgot.title":{en:"Reset Password",zh:"\u91CD\u8A2D\u5BC6\u78BC"},"forgot.description":{en:"Enter your email to receive a reset link.",zh:"\u8F38\u5165\u4FE1\u7BB1\u4EE5\u6536\u53D6\u91CD\u8A2D\u9023\u7D50\u3002"},"forgot.send":{en:"Send Reset Link",zh:"\u767C\u9001\u91CD\u8A2D\u9023\u7D50"},"forgot.sent":{en:"Check your email for the reset link!",zh:"\u91CD\u8A2D\u9023\u7D50\u5DF2\u5BC4\u51FA\uFF0C\u8ACB\u67E5\u770B\u4FE1\u7BB1\uFF01"},"forgot.backToLogin":{en:"Back to Sign In",zh:"\u8FD4\u56DE\u767B\u5165"},"profile.title":{en:"Account Settings",zh:"\u5E33\u865F\u8A2D\u5B9A"},"profile.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"profile.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"profile.role":{en:"Role",zh:"\u89D2\u8272"},"profile.save":{en:"Save",zh:"\u5132\u5B58"},"profile.saving":{en:"Saving...",zh:"\u5132\u5B58\u4E2D..."},"profile.saved":{en:"Saved!",zh:"\u5DF2\u5132\u5B58\uFF01"},"profile.changePassword":{en:"Change Password",zh:"\u8B8A\u66F4\u5BC6\u78BC"},"profile.currentPassword":{en:"Current Password",zh:"\u76EE\u524D\u5BC6\u78BC"},"profile.newPassword":{en:"New Password",zh:"\u65B0\u5BC6\u78BC"},"profile.confirmPassword":{en:"Confirm Password",zh:"\u78BA\u8A8D\u5BC6\u78BC"},"profile.passwordMismatch":{en:"Passwords do not match",zh:"\u5169\u6B21\u5BC6\u78BC\u4E0D\u4E00\u81F4"},"profile.passwordChanged":{en:"Password changed!",zh:"\u5BC6\u78BC\u5DF2\u8B8A\u66F4\uFF01"},"profile.logout":{en:"Log Out",zh:"\u767B\u51FA"},"profile.avatar":{en:"Change Avatar",zh:"\u66F4\u63DB\u982D\u50CF"},"profile.avatarUploading":{en:"Uploading...",zh:"\u4E0A\u50B3\u4E2D..."},"profile.avatarUpdated":{en:"Avatar updated!",zh:"\u982D\u50CF\u5DF2\u66F4\u65B0\uFF01"},"profile.emailVerified":{en:"Verified",zh:"\u5DF2\u9A57\u8B49"},"profile.emailNotVerified":{en:"Not verified",zh:"\u672A\u9A57\u8B49"},"profile.resendVerification":{en:"Resend",zh:"\u91CD\u5BC4"},"profile.verificationSent":{en:"Verification email sent!",zh:"\u9A57\u8B49\u4FE1\u5DF2\u5BC4\u51FA\uFF01"}},Me={"Invalid credentials":"error.invalidCredentials","Account is disabled":"error.accountDisabled","Login failed":"error.loginFailed","Registration failed":"error.registrationFailed","Email already registered":"error.emailInUse","Too many requests":"error.tooManyAttempts"};function pe(e){return t=>ce[t]?.[e]??ce[t]?.en??t}function V(e,t){let r=Me[e];return r?t(r):e}function A(e){return{bg:e?"#1e1e2e":"#ffffff",textColor:e?"#cdd6f4":"#1e293b",subtextColor:e?"#a6adc8":"#64748b",inputBg:e?"#313244":"#f8fafc",inputBorder:e?"#45475a":"#e2e8f0",errorBg:e?"#3b1c1c":"#fef2f2",errorColor:e?"#f87171":"#dc2626",errorBorder:e?"#5c2828":"#fecaca",hoverBg:e?"#3b3b50":"#f1f5f9",roleBg:e?"#313244":"#f1f5f9",dropdownItemHoverBg:e?"#313244":"#f8fafc"}}function Ee(){let e=document.documentElement.getAttribute("data-theme");return e==="dark"?!0:e==="light"?!1:document.documentElement.classList.contains("dark")?!0:window.matchMedia("(prefers-color-scheme: dark)").matches}function me(e){return e==="auto"?Ee():e==="dark"}function B(e){return`
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
  `}function ge(e,t){let r=A(t);e.style.setProperty("--lmu-bg",r.bg),e.style.setProperty("--lmu-text",r.textColor),e.style.setProperty("--lmu-subtext",r.subtextColor),e.style.setProperty("--lmu-input-bg",r.inputBg),e.style.setProperty("--lmu-input-border",r.inputBorder),e.style.setProperty("--lmu-error-bg",r.errorBg),e.style.setProperty("--lmu-error-color",r.errorColor),e.style.setProperty("--lmu-error-border",r.errorBorder),e.style.setProperty("--lmu-hover-bg",r.hoverBg),e.style.setProperty("--lmu-role-bg",r.roleBg),e.style.setProperty("--lmu-dropdown-item-hover-bg",r.dropdownItemHoverBg)}var G=class{constructor(t){this.activeShadowHosts=new Set;this.themeSetting=t,this.currentIsDark=me(t),this.setupAutoTheme()}get isDark(){return this.currentIsDark}registerHost(t){this.activeShadowHosts.add(t)}unregisterHost(t){this.activeShadowHosts.delete(t)}applyToHost(t){ge(t,this.currentIsDark)}updateAllShadowHosts(){for(let t of this.activeShadowHosts)ge(t,this.currentIsDark)}handleThemeChange(){let t=me(this.themeSetting);t!==this.currentIsDark&&(this.currentIsDark=t,this.updateAllShadowHosts())}setupAutoTheme(){if(this.themeSetting!=="auto")return;new MutationObserver(()=>{this.handleThemeChange()}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.handleThemeChange()})}};var S=class extends Error{constructor(t,r){super(t),this.status=r}};async function P(e,t,r){let a=await fetch(`${e.baseUrl}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),n=await a.json();if(!a.ok){let i=n.error??"";throw new S(V(i,e.t)||e.t("error.generic"),a.status)}return n.data??n}async function J(e,t,r){let a={};r&&(a.Authorization=`Bearer ${r}`);let n=await fetch(`${e.baseUrl}${t}`,{headers:a}),i=await n.json();if(!n.ok){let p=i.error??"";throw new S(V(p,e.t)||e.t("error.generic"),n.status)}return i.data??i}async function he(e,t,r,a){let n=await fetch(`${e.baseUrl}${t}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(r)}),i=await n.json();if(!n.ok){let p=i.error??"";throw new S(V(p,e.t)||e.t("error.generic"),n.status)}return i.data??i}async function fe(e,t,r,a){let n=await fetch(`${e.baseUrl}${t}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(r)}),i=await n.json();if(!n.ok){let p=i.error??"";throw new S(V(p,e.t)||e.t("error.generic"),n.status)}return i.data??i}function oe(e){return e instanceof S&&e.status===401}var Y=class{constructor(t,r){this._currentUser=null;this._ready=!1;this.callbacks=[];this.refreshTimer=null;this.availableProviders=[];this.appId=t,this.apiDeps=r;let a=`lmu_${t}_`;this.accessKey=`${a}access_token`,this.refreshKey=`${a}refresh_token`,this._readyPromise=new Promise(n=>{this._readyResolve=n})}get currentUser(){return this._currentUser}set currentUser(t){this._currentUser=t}get ready(){return this._ready}whenReady(){return this._readyPromise}getStoredAccessToken(){return localStorage.getItem(this.accessKey)}getStoredRefreshToken(){return localStorage.getItem(this.refreshKey)}storeTokens(t,r){localStorage.setItem(this.accessKey,t),localStorage.setItem(this.refreshKey,r)}clearTokens(){localStorage.removeItem(this.accessKey),localStorage.removeItem(this.refreshKey)}fireCallbacks(t="init"){for(let r of this.callbacks)try{r(this._currentUser,t)}catch{}}onAuthChange(t){if(this.callbacks.push(t),this._ready)try{t(this._currentUser,"init")}catch{}return()=>{let r=this.callbacks.indexOf(t);r!==-1&&this.callbacks.splice(r,1)}}parseJwtExp(t){try{let r=t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),a=Uint8Array.from(atob(r),i=>i.charCodeAt(0)),n=JSON.parse(new TextDecoder().decode(a));return n.exp?n.exp*1e3:null}catch{return null}}scheduleRefresh(){this.refreshTimer&&clearTimeout(this.refreshTimer);let t=this.getStoredAccessToken();if(!t)return;let r=this.parseJwtExp(t);if(!r)return;let a=r-Date.now()-300*1e3;if(a<=0){this.doRefresh();return}this.refreshTimer=setTimeout(()=>this.doRefresh(),a)}async doRefresh(){let t=this.getStoredRefreshToken();if(t)try{let r=await P(this.apiDeps,"/api/auth/refresh",{refreshToken:t});this.storeTokens(r.accessToken,r.refreshToken),this.scheduleRefresh()}catch(r){oe(r)?(this.clearTokens(),this._currentUser=null,this.fireCallbacks("refresh_failed")):this.refreshTimer=setTimeout(()=>this.doRefresh(),60*1e3)}}cancelRefresh(){this.refreshTimer&&clearTimeout(this.refreshTimer)}async fetchProviders(){if(this.appId)try{let t=await J(this.apiDeps,`/api/auth/providers?app_id=${this.appId}`,"");this.availableProviders=t.providers??[]}catch{this.availableProviders=[]}}startOAuth(t){let r=encodeURIComponent(window.location.href);window.location.href=`${this.apiDeps.baseUrl}/api/auth/oauth/${t}?app_id=${this.appId}&redirect=${r}`}checkHashTokens(){let t=window.location.hash;if(!t.includes("lmu_token="))return!1;let r=new URLSearchParams(t.slice(1)),a=r.get("lmu_token"),n=r.get("lmu_refresh");return a&&n?(this.storeTokens(a,n),window.history.replaceState(null,"",window.location.pathname+window.location.search),!0):!1}async init(){this.checkHashTokens(),await this.fetchProviders();let t=this.getStoredAccessToken();if(!t){this._ready=!0,this._readyResolve(null),this.fireCallbacks("init");return}try{let r=await J(this.apiDeps,"/api/auth/me",t);this._currentUser=r.user,this.scheduleRefresh()}catch(r){let a=this.getStoredRefreshToken();if(a)try{let n=await P(this.apiDeps,"/api/auth/refresh",{refreshToken:a});this.storeTokens(n.accessToken,n.refreshToken);let i=await J(this.apiDeps,"/api/auth/me",n.accessToken);this._currentUser=i.user,this.scheduleRefresh()}catch(n){oe(n)&&this.clearTokens()}else oe(r)&&this.clearTokens()}this._ready=!0,this._readyResolve(this._currentUser),this.fireCallbacks("init")}};function ve(e,t){return`
    :host {
      ${t}
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
    .lmu-req {
      color: #ef4444;
      font-weight: 600;
    }
    .lmu-label-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin: 0 0 8px 0;
    }
    .lmu-label-row .lmu-label {
      margin: 0;
    }
    .lmu-label-link {
      font-size: 12px;
      color: ${e};
      cursor: pointer;
      text-decoration: none;
      font-weight: 500;
      white-space: nowrap;
    }
    .lmu-label-link:hover { text-decoration: underline; }
    .lmu-terms {
      font-size: 12px;
      color: var(--lmu-subtext);
      line-height: 1.5;
      margin: 2px 0 14px 0;
      padding: 0;
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
      border-color: ${e};
      box-shadow: 0 0 0 3px ${e}22;
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
      background: ${e};
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
    .lmu-switch-text {
      color: var(--lmu-subtext);
      margin-right: 5px;
    }
    .lmu-switch a {
      color: ${e};
      cursor: pointer;
      text-decoration: none;
      font-weight: 700;
      font-size: 14.5px;
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
      border-color: ${e};
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
  `}function be(e,t){return`
    :host {
      ${t}
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
      background: ${e}; color: #fff; display: flex;
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
    .lmu-input:focus { border-color: ${e}; box-shadow: 0 0 0 3px ${e}22; }
    .lmu-input:disabled { opacity: 0.6; cursor: not-allowed; }
    .lmu-row { display: flex; gap: 8px; margin-top: 10px; }
    .lmu-btn-sm {
      height: 38px; padding: 0 16px; border-radius: 8px;
      font-size: 13px; font-weight: 600; font-family: inherit;
      cursor: pointer; border: none; transition: opacity 0.15s;
    }
    .lmu-btn-primary {
      background: ${e}; color: #fff;
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
  `}function ye(e,t){return`
    :host {
      ${t}
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
      background: ${e};
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
      border-color: ${e};
      background: var(--lmu-hover-bg);
    }
    .lmu-profile-btn.primary {
      background: ${e};
      color: #fff;
      border-color: ${e};
    }
    .lmu-profile-btn.primary:hover { opacity: 0.9; }
    .lmu-profile-login {
      text-align: center;
      padding: 8px 0;
    }
    .lmu-profile-login a {
      color: ${e};
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .lmu-profile-login a:hover { text-decoration: underline; }
  `}function xe(e,t){return`
    :host {
      ${t}
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
      background: ${e};
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
      border-color: ${e};
      box-shadow: 0 0 0 2px ${e}33;
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
    .lmu-avatar-login:hover { border-color: ${e}; color: ${e}; }
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
  `}function C(e,t){let{appId:r,accent:a,locale:n,auth:i,theme:p,apiDeps:$,t:o}=e,E=document.getElementById("lmu-auth-host");E&&(p.unregisterHost(E),E.remove());let T=t,m="",f="",s=!1,d=document.createElement("div");d.id="lmu-auth-host",d.style.cssText="position:fixed;inset:0;z-index:99999;";let l=d.attachShadow({mode:"closed"});p.registerHost(d);let v=B(A(p.isDark)),x=ve(a,v);function w(){p.unregisterHost(d),d.remove()}l.addEventListener("click",g=>{let U=l.querySelector(".lmu-card");U&&!U.contains(g.target)&&l.contains(g.target)&&w()});function u(){let g=T==="login";if(T==="forgot"){l.innerHTML=`
          <style>${x}</style>
          <div class="lmu-card">
            <button class="lmu-close" id="lmu-close-btn">&times;</button>
            <div class="lmu-title">${o("forgot.title")}</div>
            ${f?`<div class="lmu-success">${f}</div>`:""}
            ${m?`<div class="lmu-error">${m}</div>`:""}
            ${f?"":`
              <p style="font-size:14px;color:var(--lmu-subtext);margin:0 0 18px 0;text-align:center;">${o("forgot.description")}</p>
              <form id="lmu-forgot-form">
                <div class="lmu-field">
                  <label class="lmu-label">${o("label.email")}</label>
                  <input class="lmu-input" type="email" name="email" required />
                </div>
                <button class="lmu-btn" type="submit" ${s?"disabled":""}>
                  ${o(s?"msg.loading":"forgot.send")}
                </button>
              </form>
            `}
            <div class="lmu-switch">
              <a id="lmu-back-login">${o("forgot.backToLogin")}</a>
            </div>
          </div>
        `,p.applyToHost(d),l.getElementById("lmu-close-btn")?.addEventListener("click",()=>w()),l.getElementById("lmu-back-login")?.addEventListener("click",()=>{T="login",m="",f="",u()});let L=l.getElementById("lmu-forgot-form");L?.addEventListener("submit",async z=>{z.preventDefault();let c=new FormData(L).get("email");s=!0,m="",u();try{await P($,"/api/auth/forgot-password",{appId:r,email:c}),s=!1,f=o("forgot.sent"),u()}catch(y){m=y instanceof Error?y.message:o("error.generic"),s=!1,u()}});return}l.innerHTML=`
        <style>${x}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${o(g?"title.login":"title.register")}</div>
          ${m?`<div class="lmu-error">${m}</div>`:""}
          <form id="lmu-auth-form">
            ${g?"":`
              <div class="lmu-field">
                <label class="lmu-label">${o("label.displayName")} <span class="lmu-req">*</span></label>
                <input class="lmu-input" type="text" name="displayName" placeholder="${o("placeholder.displayName")}" required />
              </div>
            `}
            <div class="lmu-field">
              <label class="lmu-label">${o("label.email")} <span class="lmu-req">*</span></label>
              <input class="lmu-input" type="email" name="email" placeholder="${o("placeholder.email")}" required />
            </div>
            <div class="lmu-field">
              <div class="lmu-label-row">
                <label class="lmu-label">${o("label.password")} <span class="lmu-req">*</span></label>
                ${g?`<a id="lmu-forgot-pw" class="lmu-label-link">${o("link.forgotPassword")}</a>`:""}
              </div>
              <input class="lmu-input" type="password" name="password" id="lmu-password-input" placeholder="${o(g?"placeholder.password":"placeholder.passwordNew")}" required minlength="${g?1:8}" />
            </div>
            ${g?"":`<p class="lmu-terms">${o("register.terms")}</p>`}
            <button class="lmu-btn" type="submit" ${s?"disabled":""}>
              ${o(s?"msg.loading":g?"btn.login":"btn.register")}
            </button>
          </form>
          ${i.availableProviders.length>0?`
            <div class="lmu-divider">${o("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${i.availableProviders.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${o("oauth.google")}
                </button>
              `:""}
              ${i.availableProviders.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="var(--lmu-text)"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${o("oauth.github")}
                </button>
              `:""}
            </div>
          `:""}
          <div class="lmu-switch">
            <span class="lmu-switch-text">${o(g?"switch.toRegisterPrompt":"switch.toLoginPrompt")}</span>
            <a id="lmu-switch-mode">${o(g?"switch.toRegisterAction":"switch.toLoginAction")}</a>
          </div>
        </div>
      `,p.applyToHost(d),l.getElementById("lmu-close-btn")?.addEventListener("click",()=>w()),l.getElementById("lmu-oauth-google")?.addEventListener("click",()=>i.startOAuth("google")),l.getElementById("lmu-oauth-github")?.addEventListener("click",()=>i.startOAuth("github")),l.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{T="forgot",m="",f="",u()}),l.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{T=g?"register":"login",m="",u()});let D=l.getElementById("lmu-auth-form");D?.addEventListener("submit",async L=>{if(L.preventDefault(),s)return;let z=new FormData(D),k=z.get("email"),c=z.get("password");if(s=!0,m="",u(),!g&&c.length<8){m=o("error.passwordTooShort"),s=!1,u();return}try{if(g){let y=await P($,"/api/auth/login",{appId:r,email:k,password:c});i.storeTokens(y.accessToken,y.refreshToken),i.currentUser=y.user,i.scheduleRefresh(),i.fireCallbacks("login"),w()}else{let y=z.get("displayName"),j=await P($,"/api/auth/register",{appId:r,email:k,password:c,displayName:y});i.storeTokens(j.accessToken,j.refreshToken),i.currentUser=j.user,i.scheduleRefresh(),i.fireCallbacks("login"),w()}}catch(y){m=y instanceof Error?y.message:o("error.generic"),s=!1,u()}})}u(),document.body.appendChild(d),setTimeout(()=>{l.querySelector("input")?.focus()},50)}function q(e){let{appId:t,accent:r,locale:a,baseUrl:n,auth:i,theme:p,apiDeps:$,t:o,getLoginModalDeps:E,onLogout:T}=e;if(!i.currentUser){C(E(),"login");return}let m=document.getElementById("lmu-profile-host");m&&(p.unregisterHost(m),m.remove());let f=i.getStoredAccessToken();if(!f)return;let s=f,d=!1,l=i.currentUser.displayName,v=!1,x=!1,w=!1,u="",g="",U=!1,D=!1,L="",z=!1,k=document.createElement("div");k.id="lmu-profile-host",k.style.cssText="position:fixed;inset:0;z-index:99999;";let c=k.attachShadow({mode:"closed"});p.registerHost(k);let y=B(A(p.isDark)),j=be(r,y);function te(){p.unregisterHost(k),k.remove()}c.addEventListener("click",K=>{let F=c.querySelector(".lmu-card");F&&!F.contains(K.target)&&c.contains(K.target)&&te()});function h(){if(!i.currentUser)return;let K=i.currentUser.displayName?.charAt(0)?.toUpperCase()??"?",F=i.currentUser.avatar?i.currentUser.avatar.startsWith("http")?i.currentUser.avatar:`${n}${i.currentUser.avatar}`:"",le=i.currentUser.emailVerified===!0;c.innerHTML=`
        <style>${j}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close">&times;</button>
          <div class="lmu-title">${o("profile.title")}</div>

          ${L?`<div class="lmu-success" style="margin-bottom:16px;">${L}</div>`:""}

          <div class="lmu-avatar-area">
            <div class="lmu-avatar-circle" id="lmu-avatar-click" title="${o("profile.avatar")}">
              ${F?`<img src="${F}" alt="" />`:K}
              <div class="lmu-avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              ${D?`<div class="lmu-avatar-overlay" style="opacity:1;"><span style="font-size:11px;color:#fff;">${o("profile.avatarUploading")}</span></div>`:""}
            </div>
            <input type="file" id="lmu-avatar-input" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none;" />
            <div class="lmu-avatar-info">
              <p class="lmu-avatar-name">${i.currentUser.displayName}</p>
              <div style="display:flex;align-items:center;gap:8px;margin-top:2px;">
                <p class="lmu-avatar-email" style="margin:0;">${i.currentUser.email}</p>
                ${le?`<span class="lmu-badge lmu-badge-verified">${o("profile.emailVerified")}</span>`:`<span class="lmu-badge lmu-badge-unverified">${o("profile.emailNotVerified")}</span>`}
              </div>
              ${!le&&!z?`<a id="lmu-resend-verify" style="font-size:11px;color:${r};cursor:pointer;margin-top:4px;display:inline-block;">${o("profile.resendVerification")}</a>`:""}
              ${z?`<span style="font-size:11px;color:#059669;margin-top:4px;display:inline-block;">${o("profile.verificationSent")}</span>`:""}
            </div>
          </div>

          <!-- Display Name Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${o("profile.displayName")}</div>
            ${x?`<div class="lmu-success">${o("profile.saved")}</div>`:""}
            ${d?`
              <div class="lmu-field">
                <input class="lmu-input" type="text" id="lmu-name-input" value="${l.replace(/"/g,"&quot;")}" />
              </div>
              <div class="lmu-row">
                <button class="lmu-btn-sm lmu-btn-primary" id="lmu-name-save" ${v?"disabled":""}>
                  ${o(v?"profile.saving":"profile.save")}
                </button>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-cancel">${a==="zh"?"\u53D6\u6D88":"Cancel"}</button>
              </div>
            `:`
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:15px;">${i.currentUser.displayName}</span>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-edit" style="padding:0 12px;height:32px;font-size:12px;">
                  ${a==="zh"?"\u7DE8\u8F2F":"Edit"}
                </button>
              </div>
            `}
          </div>

          <!-- Change Password Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${o("profile.changePassword")}</div>
            ${g?`<div class="lmu-success">${g}</div>`:""}
            ${u?`<div class="lmu-error">${u}</div>`:""}
            ${w?`
              <form id="lmu-pw-form">
                <div class="lmu-field">
                  <label class="lmu-label">${o("profile.currentPassword")}</label>
                  <input class="lmu-input" type="password" name="currentPassword" required />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${o("profile.newPassword")}</label>
                  <input class="lmu-input" type="password" name="newPassword" required minlength="8" />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${o("profile.confirmPassword")}</label>
                  <input class="lmu-input" type="password" name="confirmPassword" required minlength="8" />
                </div>
                <div class="lmu-row">
                  <button type="submit" class="lmu-btn-sm lmu-btn-primary" ${U?"disabled":""}>
                    ${o(U?"profile.saving":"profile.save")}
                  </button>
                  <button type="button" class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-cancel">${a==="zh"?"\u53D6\u6D88":"Cancel"}</button>
                </div>
              </form>
            `:`
              <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-show">
                ${a==="zh"?"\u8B8A\u66F4\u5BC6\u78BC":"Change"}
              </button>
            `}
          </div>

          <!-- Logout -->
          <div class="lmu-section">
            <button class="lmu-btn-danger" id="lmu-logout">${o("profile.logout")}</button>
          </div>
        </div>
      `,p.applyToHost(k),c.getElementById("lmu-close")?.addEventListener("click",()=>te());let ze=c.getElementById("lmu-avatar-click"),re=c.getElementById("lmu-avatar-input");ze?.addEventListener("click",()=>re?.click()),re?.addEventListener("change",async()=>{let I=re.files?.[0];if(!(!I||!s)){if(I.size>2*1024*1024){L="",h();return}D=!0,h();try{let M=new FormData;M.append("file",I);let O=await fetch(`${n}/api/auth/avatar`,{method:"POST",headers:{Authorization:`Bearer ${s}`},body:M}),R=await O.json();if(!O.ok)throw new Error(R.error??o("error.generic"));let W=R.data;W?.user&&i.currentUser&&(i.currentUser={...i.currentUser,avatar:W.user.avatar},i.fireCallbacks("login")),D=!1,L=o("profile.avatarUpdated"),h(),setTimeout(()=>{L="",h()},2e3)}catch{D=!1,h()}}}),c.getElementById("lmu-resend-verify")?.addEventListener("click",async()=>{if(s){try{await P($,"/api/auth/register",{appId:t,resendVerification:!0})}catch{}z=!0,h(),setTimeout(()=>{z=!1},5e3)}}),c.getElementById("lmu-name-edit")?.addEventListener("click",()=>{d=!0,l=i.currentUser?.displayName??"",x=!1,h(),c.getElementById("lmu-name-input")?.focus()}),c.getElementById("lmu-name-cancel")?.addEventListener("click",()=>{d=!1,h()}),c.getElementById("lmu-name-save")?.addEventListener("click",async()=>{let M=c.getElementById("lmu-name-input")?.value?.trim();if(!(!M||!s)){v=!0,h();try{await he($,"/api/auth/profile",{displayName:M},s),i.currentUser&&(i.currentUser={...i.currentUser,displayName:M},i.fireCallbacks("login")),d=!1,x=!0,v=!1,h(),setTimeout(()=>{x=!1,h()},2e3)}catch{v=!1,h()}}}),c.getElementById("lmu-pw-show")?.addEventListener("click",()=>{w=!0,u="",g="",h()}),c.getElementById("lmu-pw-cancel")?.addEventListener("click",()=>{w=!1,u="",h()});let de=c.getElementById("lmu-pw-form");de?.addEventListener("submit",async I=>{I.preventDefault();let M=new FormData(de),O=M.get("currentPassword"),R=M.get("newPassword"),W=M.get("confirmPassword");if(R!==W){u=o("profile.passwordMismatch"),h();return}if(R.length<8){u=o("error.passwordTooShort"),h();return}U=!0,u="",h();try{await fe($,"/api/auth/change-password",{currentPassword:O,newPassword:R},s),w=!1,U=!1,g=o("profile.passwordChanged"),h(),setTimeout(()=>{g="",h()},3e3)}catch(ue){u=ue instanceof Error?ue.message:o("error.generic"),U=!1,h()}}),c.getElementById("lmu-logout")?.addEventListener("click",()=>{te(),T()})}h(),document.body.appendChild(k)}function we(e,t){let{accent:r,auth:a,theme:n,t:i,getLoginModalDeps:p,getProfileModalDeps:$,onLogout:o,onAuthChange:E}=e,T=B(A(n.isDark)),m=ye(r,T),f=typeof t=="string"?document.querySelector(t):t;if(!f)return()=>{};let s=document.createElement("div");s.className="lmu-profile-card-host";let d=s.attachShadow({mode:"closed"});n.registerHost(s);function l(){if(!a.currentUser){d.innerHTML=`
          <style>${m}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${i("btn.login")}</a>
            </div>
          </div>
        `,n.applyToHost(s),d.getElementById("lmu-pc-login")?.addEventListener("click",()=>{C(p(),"login")});return}let x=a.currentUser.displayName?.charAt(0)?.toUpperCase()??"?";d.innerHTML=`
        <style>${m}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${a.currentUser.avatar?`<img src="${a.currentUser.avatar}" alt="" />`:x}
            </div>
            <div class="lmu-profile-info">
              <p class="lmu-profile-name">${a.currentUser.displayName}</p>
              <p class="lmu-profile-email">${a.currentUser.email}</p>
            </div>
          </div>
          <div class="lmu-profile-role">${a.currentUser.role}</div>
          <div class="lmu-profile-actions">
            <button class="lmu-profile-btn primary" id="lmu-pc-edit">Edit Profile</button>
            <button class="lmu-profile-btn" id="lmu-pc-logout">Logout</button>
          </div>
        </div>
      `,n.applyToHost(s),d.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{o()}),d.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{q($())})}f.appendChild(s),l();let v=E(()=>l());return()=>{v(),n.unregisterHost(s),s.remove()}}function ke(e,t){let{accent:r,auth:a,theme:n,t:i,getLoginModalDeps:p,getProfileModalDeps:$,onLogout:o,onAuthChange:E}=e,T=B(A(n.isDark)),m=xe(r,T),f=typeof t=="string"?document.querySelector(t):t;if(!f)return()=>{};let s=document.createElement("div");s.className="lmu-avatar-host";let d=s.attachShadow({mode:"closed"});n.registerHost(s);let l=!1;function v(){if(!a.currentUser){d.innerHTML=`
          <style>${m}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${i("btn.login")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,n.applyToHost(s),d.getElementById("lmu-av-login")?.addEventListener("click",()=>{C(p(),"login")});return}let u=a.currentUser.displayName?.charAt(0)?.toUpperCase()??"?";d.innerHTML=`
        <style>${m}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${a.currentUser.avatar?`<img src="${a.currentUser.avatar}" alt="" />`:u}
        </button>
        ${l?`
          <div class="lmu-avatar-dropdown">
            <div class="lmu-avatar-dropdown-header">
              <p class="lmu-avatar-dropdown-name">${a.currentUser.displayName}</p>
              <p class="lmu-avatar-dropdown-email">${a.currentUser.email}</p>
            </div>
            <button class="lmu-avatar-dropdown-item" id="lmu-av-profile">Edit Profile</button>
            <button class="lmu-avatar-dropdown-item danger" id="lmu-av-logout">Logout</button>
          </div>
        `:""}
      `,n.applyToHost(s),d.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{l=!l,v()}),d.getElementById("lmu-av-profile")?.addEventListener("click",()=>{l=!1,v(),q($())}),d.getElementById("lmu-av-logout")?.addEventListener("click",()=>{l=!1,o()})}function x(u){l&&!s.contains(u.target)&&(l=!1,v())}document.addEventListener("click",x),f.appendChild(s),v();let w=E(()=>{l=!1,v()});return()=>{w(),n.unregisterHost(s),document.removeEventListener("click",x),s.remove()}}var H=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),_=H?.getAttribute("data-app-id")??"",Ue=H?.getAttribute("data-theme")??"light",ae=H?.getAttribute("data-accent")??"#2563eb",Z=H?.getAttribute("data-locale")??"en",$e=H?.getAttribute("data-mode")??"modal",N=H?.src?new URL(H.src).origin:window.location.origin;_||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");var ee=pe(Z),ne=new G(Ue),se={baseUrl:N,t:ee},b=new Y(_,se);function Q(){return{appId:_,accent:ae,locale:Z,auth:b,theme:ne,apiDeps:se,t:ee}}function Le(){return{appId:_,accent:ae,locale:Z,baseUrl:N,auth:b,theme:ne,apiDeps:se,t:ee,getLoginModalDeps:Q,onLogout:()=>X.logout()}}function Te(){return{accent:ae,locale:Z,auth:b,theme:ne,t:ee,getLoginModalDeps:Q,getProfileModalDeps:Le,onLogout:()=>X.logout(),onAuthChange:e=>X.onAuthChange(e)}}var ie=!1,X={get ready(){return b.ready},get user(){return b.currentUser},login(){if($e==="redirect"){window.location.href=`${N}/login?app=${_}&redirect=${encodeURIComponent(window.location.href)}`;return}C(Q(),"login")},register(){if($e==="redirect"){window.location.href=`${N}/login?app=${_}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}C(Q(),"register")},async logout(){if(!ie){ie=!0;try{let e=b.getStoredAccessToken();if(e)try{await fetch(`${N}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}b.clearTokens(),b.currentUser=null,b.cancelRefresh(),b.fireCallbacks("logout")}finally{ie=!1}}},getToken(){return b.getStoredAccessToken()},whenReady(){return b.whenReady()},onAuthChange(e){return b.onAuthChange(e)},openAdmin(){window.open(`${N}/admin`,"_blank")},openProfile(){q(Le())},renderProfileCard(e){return we(Te(),e)},renderAvatar(e){return ke(Te(),e)}};window.letmeuse=X;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>b.init()):b.init();})();
