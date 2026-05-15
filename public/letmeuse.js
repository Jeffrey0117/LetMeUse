"use strict";(()=>{var le={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"btn.login":{en:"Sign In",zh:"\u767B\u5165"},"btn.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"switch.toRegister":{en:"Don't have an account? Sign up",zh:"\u6C92\u6709\u5E33\u865F\uFF1F\u8A3B\u518A"},"switch.toLogin":{en:"Already have an account? Sign in",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F\u767B\u5165"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"error.invalidCredentials":{en:"Invalid email or password",zh:"\u5E33\u865F\u6216\u5BC6\u78BC\u932F\u8AA4"},"error.accountDisabled":{en:"Account is disabled",zh:"\u5E33\u865F\u5DF2\u505C\u7528"},"error.loginFailed":{en:"Login failed",zh:"\u767B\u5165\u5931\u6557"},"error.registrationFailed":{en:"Registration failed",zh:"\u8A3B\u518A\u5931\u6557"},"error.emailInUse":{en:"Email already registered",zh:"\u6B64\u4FE1\u7BB1\u5DF2\u88AB\u8A3B\u518A"},"error.tooManyAttempts":{en:"Too many attempts, please try again later",zh:"\u5617\u8A66\u6B21\u6578\u904E\u591A\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"},"error.passwordTooShort":{en:"Password must be at least 8 characters",zh:"\u5BC6\u78BC\u81F3\u5C11\u9700\u8981 8 \u500B\u5B57\u5143"},"forgot.title":{en:"Reset Password",zh:"\u91CD\u8A2D\u5BC6\u78BC"},"forgot.description":{en:"Enter your email to receive a reset link.",zh:"\u8F38\u5165\u4FE1\u7BB1\u4EE5\u6536\u53D6\u91CD\u8A2D\u9023\u7D50\u3002"},"forgot.send":{en:"Send Reset Link",zh:"\u767C\u9001\u91CD\u8A2D\u9023\u7D50"},"forgot.sent":{en:"Check your email for the reset link!",zh:"\u91CD\u8A2D\u9023\u7D50\u5DF2\u5BC4\u51FA\uFF0C\u8ACB\u67E5\u770B\u4FE1\u7BB1\uFF01"},"forgot.backToLogin":{en:"Back to Sign In",zh:"\u8FD4\u56DE\u767B\u5165"},"profile.title":{en:"Account Settings",zh:"\u5E33\u865F\u8A2D\u5B9A"},"profile.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"profile.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"profile.role":{en:"Role",zh:"\u89D2\u8272"},"profile.save":{en:"Save",zh:"\u5132\u5B58"},"profile.saving":{en:"Saving...",zh:"\u5132\u5B58\u4E2D..."},"profile.saved":{en:"Saved!",zh:"\u5DF2\u5132\u5B58\uFF01"},"profile.changePassword":{en:"Change Password",zh:"\u8B8A\u66F4\u5BC6\u78BC"},"profile.currentPassword":{en:"Current Password",zh:"\u76EE\u524D\u5BC6\u78BC"},"profile.newPassword":{en:"New Password",zh:"\u65B0\u5BC6\u78BC"},"profile.confirmPassword":{en:"Confirm Password",zh:"\u78BA\u8A8D\u5BC6\u78BC"},"profile.passwordMismatch":{en:"Passwords do not match",zh:"\u5169\u6B21\u5BC6\u78BC\u4E0D\u4E00\u81F4"},"profile.passwordChanged":{en:"Password changed!",zh:"\u5BC6\u78BC\u5DF2\u8B8A\u66F4\uFF01"},"profile.logout":{en:"Log Out",zh:"\u767B\u51FA"},"profile.avatar":{en:"Change Avatar",zh:"\u66F4\u63DB\u982D\u50CF"},"profile.avatarUploading":{en:"Uploading...",zh:"\u4E0A\u50B3\u4E2D..."},"profile.avatarUpdated":{en:"Avatar updated!",zh:"\u982D\u50CF\u5DF2\u66F4\u65B0\uFF01"},"profile.emailVerified":{en:"Verified",zh:"\u5DF2\u9A57\u8B49"},"profile.emailNotVerified":{en:"Not verified",zh:"\u672A\u9A57\u8B49"},"profile.resendVerification":{en:"Resend",zh:"\u91CD\u5BC4"},"profile.verificationSent":{en:"Verification email sent!",zh:"\u9A57\u8B49\u4FE1\u5DF2\u5BC4\u51FA\uFF01"}},Te={"Invalid credentials":"error.invalidCredentials","Account is disabled":"error.accountDisabled","Login failed":"error.loginFailed","Registration failed":"error.registrationFailed","Email already registered":"error.emailInUse","Too many requests":"error.tooManyAttempts"};function de(e){return t=>le[t]?.[e]??le[t]?.en??t}function O(e,t){let r=Te[e];return r?t(r):e}function S(e){return{bg:e?"#1e1e2e":"#ffffff",textColor:e?"#cdd6f4":"#1e293b",subtextColor:e?"#a6adc8":"#64748b",inputBg:e?"#313244":"#f8fafc",inputBorder:e?"#45475a":"#e2e8f0",errorBg:e?"#3b1c1c":"#fef2f2",errorColor:e?"#f87171":"#dc2626",errorBorder:e?"#5c2828":"#fecaca",hoverBg:e?"#3b3b50":"#f1f5f9",roleBg:e?"#313244":"#f1f5f9",dropdownItemHoverBg:e?"#313244":"#f8fafc"}}function Le(){let e=document.documentElement.getAttribute("data-theme");return e==="dark"?!0:e==="light"?!1:document.documentElement.classList.contains("dark")?!0:window.matchMedia("(prefers-color-scheme: dark)").matches}function ue(e){return e==="auto"?Le():e==="dark"}function I(e){return`
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
  `}function ce(e,t){let r=S(t);e.style.setProperty("--lmu-bg",r.bg),e.style.setProperty("--lmu-text",r.textColor),e.style.setProperty("--lmu-subtext",r.subtextColor),e.style.setProperty("--lmu-input-bg",r.inputBg),e.style.setProperty("--lmu-input-border",r.inputBorder),e.style.setProperty("--lmu-error-bg",r.errorBg),e.style.setProperty("--lmu-error-color",r.errorColor),e.style.setProperty("--lmu-error-border",r.errorBorder),e.style.setProperty("--lmu-hover-bg",r.hoverBg),e.style.setProperty("--lmu-role-bg",r.roleBg),e.style.setProperty("--lmu-dropdown-item-hover-bg",r.dropdownItemHoverBg)}var W=class{constructor(t){this.activeShadowHosts=new Set;this.themeSetting=t,this.currentIsDark=ue(t),this.setupAutoTheme()}get isDark(){return this.currentIsDark}registerHost(t){this.activeShadowHosts.add(t)}unregisterHost(t){this.activeShadowHosts.delete(t)}applyToHost(t){ce(t,this.currentIsDark)}updateAllShadowHosts(){for(let t of this.activeShadowHosts)ce(t,this.currentIsDark)}handleThemeChange(){let t=ue(this.themeSetting);t!==this.currentIsDark&&(this.currentIsDark=t,this.updateAllShadowHosts())}setupAutoTheme(){if(this.themeSetting!=="auto")return;new MutationObserver(()=>{this.handleThemeChange()}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.handleThemeChange()})}};async function P(e,t,r){let a=await fetch(`${e.baseUrl}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),s=await a.json();if(!a.ok){let o=s.error??"";throw new Error(O(o,e.t)||e.t("error.generic"))}return s.data??s}async function G(e,t,r){let a={};r&&(a.Authorization=`Bearer ${r}`);let s=await fetch(`${e.baseUrl}${t}`,{headers:a}),o=await s.json();if(!s.ok){let p=o.error??"";throw new Error(O(p,e.t)||e.t("error.generic"))}return o.data??o}async function pe(e,t,r,a){let s=await fetch(`${e.baseUrl}${t}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(r)}),o=await s.json();if(!s.ok){let p=o.error??"";throw new Error(O(p,e.t)||e.t("error.generic"))}return o.data??o}async function me(e,t,r,a){let s=await fetch(`${e.baseUrl}${t}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(r)}),o=await s.json();if(!s.ok){let p=o.error??"";throw new Error(O(p,e.t)||e.t("error.generic"))}return o.data??o}var J=class{constructor(t,r){this._currentUser=null;this._ready=!1;this.callbacks=[];this.refreshTimer=null;this.availableProviders=[];this.appId=t,this.apiDeps=r;let a=`lmu_${t}_`;this.accessKey=`${a}access_token`,this.refreshKey=`${a}refresh_token`,this._readyPromise=new Promise(s=>{this._readyResolve=s})}get currentUser(){return this._currentUser}set currentUser(t){this._currentUser=t}get ready(){return this._ready}whenReady(){return this._readyPromise}getStoredAccessToken(){return localStorage.getItem(this.accessKey)}getStoredRefreshToken(){return localStorage.getItem(this.refreshKey)}storeTokens(t,r){localStorage.setItem(this.accessKey,t),localStorage.setItem(this.refreshKey,r)}clearTokens(){localStorage.removeItem(this.accessKey),localStorage.removeItem(this.refreshKey)}fireCallbacks(t="init"){for(let r of this.callbacks)try{r(this._currentUser,t)}catch{}}onAuthChange(t){if(this.callbacks.push(t),this._ready)try{t(this._currentUser,"init")}catch{}return()=>{let r=this.callbacks.indexOf(t);r!==-1&&this.callbacks.splice(r,1)}}parseJwtExp(t){try{let r=JSON.parse(atob(t.split(".")[1]));return r.exp?r.exp*1e3:null}catch{return null}}scheduleRefresh(){this.refreshTimer&&clearTimeout(this.refreshTimer);let t=this.getStoredAccessToken();if(!t)return;let r=this.parseJwtExp(t);if(!r)return;let a=r-Date.now()-300*1e3;if(a<=0){this.doRefresh();return}this.refreshTimer=setTimeout(()=>this.doRefresh(),a)}async doRefresh(){let t=this.getStoredRefreshToken();if(t)try{let r=await P(this.apiDeps,"/api/auth/refresh",{refreshToken:t});this.storeTokens(r.accessToken,r.refreshToken),this.scheduleRefresh()}catch{this.clearTokens(),this._currentUser=null,this.fireCallbacks("refresh_failed")}}cancelRefresh(){this.refreshTimer&&clearTimeout(this.refreshTimer)}async fetchProviders(){if(this.appId)try{let t=await G(this.apiDeps,`/api/auth/providers?app_id=${this.appId}`,"");this.availableProviders=t.providers??[]}catch{this.availableProviders=[]}}startOAuth(t){let r=encodeURIComponent(window.location.href);window.location.href=`${this.apiDeps.baseUrl}/api/auth/oauth/${t}?app_id=${this.appId}&redirect=${r}`}checkHashTokens(){let t=window.location.hash;if(!t.includes("lmu_token="))return!1;let r=new URLSearchParams(t.slice(1)),a=r.get("lmu_token"),s=r.get("lmu_refresh");return a&&s?(this.storeTokens(a,s),window.history.replaceState(null,"",window.location.pathname+window.location.search),!0):!1}async init(){this.checkHashTokens(),await this.fetchProviders();let t=this.getStoredAccessToken();if(!t){this._ready=!0,this._readyResolve(null),this.fireCallbacks("init");return}try{let r=await G(this.apiDeps,"/api/auth/me",t);this._currentUser=r.user,this.scheduleRefresh()}catch{let r=this.getStoredRefreshToken();if(r)try{let a=await P(this.apiDeps,"/api/auth/refresh",{refreshToken:r});this.storeTokens(a.accessToken,a.refreshToken);let s=await G(this.apiDeps,"/api/auth/me",a.accessToken);this._currentUser=s.user,this.scheduleRefresh()}catch{this.clearTokens()}else this.clearTokens()}this._ready=!0,this._readyResolve(this._currentUser),this.fireCallbacks("init")}};function ge(e,t){return`
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
    .lmu-switch a {
      color: ${e};
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
  `}function he(e,t){return`
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
  `}function fe(e,t){return`
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
  `}function ve(e,t){return`
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
  `}function A(e,t){let{appId:r,accent:a,locale:s,auth:o,theme:p,apiDeps:$,t:i}=e,z=document.getElementById("lmu-auth-host");z&&(p.unregisterHost(z),z.remove());let T=t,m="",f="",n=!1,d=document.createElement("div");d.id="lmu-auth-host",d.style.cssText="position:fixed;inset:0;z-index:99999;";let l=d.attachShadow({mode:"closed"});p.registerHost(d);let v=I(S(p.isDark)),x=ge(a,v);function w(){p.unregisterHost(d),d.remove()}l.addEventListener("click",h=>{let U=l.querySelector(".lmu-card");U&&!U.contains(h.target)&&l.contains(h.target)&&w()});function u(){let h=T==="login";if(T==="forgot"){l.innerHTML=`
          <style>${x}</style>
          <div class="lmu-card">
            <button class="lmu-close" id="lmu-close-btn">&times;</button>
            <div class="lmu-title">${i("forgot.title")}</div>
            ${f?`<div class="lmu-success">${f}</div>`:""}
            ${m?`<div class="lmu-error">${m}</div>`:""}
            ${f?"":`
              <p style="font-size:14px;color:var(--lmu-subtext);margin:0 0 18px 0;text-align:center;">${i("forgot.description")}</p>
              <form id="lmu-forgot-form">
                <div class="lmu-field">
                  <label class="lmu-label">${i("label.email")}</label>
                  <input class="lmu-input" type="email" name="email" required />
                </div>
                <button class="lmu-btn" type="submit" ${n?"disabled":""}>
                  ${i(n?"msg.loading":"forgot.send")}
                </button>
              </form>
            `}
            <div class="lmu-switch">
              <a id="lmu-back-login">${i("forgot.backToLogin")}</a>
            </div>
          </div>
        `,p.applyToHost(d),l.getElementById("lmu-close-btn")?.addEventListener("click",()=>w()),l.getElementById("lmu-back-login")?.addEventListener("click",()=>{T="login",m="",f="",u()});let L=l.getElementById("lmu-forgot-form");L?.addEventListener("submit",async M=>{M.preventDefault();let c=new FormData(L).get("email");n=!0,m="",u();try{await P($,"/api/auth/forgot-password",{appId:r,email:c}),n=!1,f=i("forgot.sent"),u()}catch(y){m=y instanceof Error?y.message:i("error.generic"),n=!1,u()}});return}l.innerHTML=`
        <style>${x}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${i(h?"title.login":"title.register")}</div>
          ${m?`<div class="lmu-error">${m}</div>`:""}
          <form id="lmu-auth-form">
            ${h?"":`
              <div class="lmu-field">
                <label class="lmu-label">${i("label.displayName")}</label>
                <input class="lmu-input" type="text" name="displayName" required />
              </div>
            `}
            <div class="lmu-field">
              <label class="lmu-label">${i("label.email")}</label>
              <input class="lmu-input" type="email" name="email" required />
            </div>
            <div class="lmu-field">
              <label class="lmu-label">${i("label.password")}</label>
              <input class="lmu-input" type="password" name="password" id="lmu-password-input" required minlength="${h?1:8}" />
            </div>
            ${h?`<div style="text-align:right;margin:-10px 0 8px 0;"><a id="lmu-forgot-pw" style="font-size:12px;color:${a};cursor:pointer;text-decoration:none;">${i("link.forgotPassword")}</a></div>`:""}
            <button class="lmu-btn" type="submit" ${n?"disabled":""}>
              ${i(n?"msg.loading":h?"btn.login":"btn.register")}
            </button>
          </form>
          ${o.availableProviders.length>0?`
            <div class="lmu-divider">${i("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${o.availableProviders.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${i("oauth.google")}
                </button>
              `:""}
              ${o.availableProviders.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="var(--lmu-text)"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${i("oauth.github")}
                </button>
              `:""}
            </div>
          `:""}
          <div class="lmu-switch">
            <a id="lmu-switch-mode">
              ${i(h?"switch.toRegister":"switch.toLogin")}
            </a>
          </div>
        </div>
      `,p.applyToHost(d),l.getElementById("lmu-close-btn")?.addEventListener("click",()=>w()),l.getElementById("lmu-oauth-google")?.addEventListener("click",()=>o.startOAuth("google")),l.getElementById("lmu-oauth-github")?.addEventListener("click",()=>o.startOAuth("github")),l.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{T="forgot",m="",f="",u()}),l.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{T=h?"register":"login",m="",u()});let C=l.getElementById("lmu-auth-form");C?.addEventListener("submit",async L=>{if(L.preventDefault(),n)return;let M=new FormData(C),k=M.get("email"),c=M.get("password");if(n=!0,m="",u(),!h&&c.length<8){m=i("error.passwordTooShort"),n=!1,u();return}try{if(h){let y=await P($,"/api/auth/login",{appId:r,email:k,password:c});o.storeTokens(y.accessToken,y.refreshToken),o.currentUser=y.user,o.scheduleRefresh(),o.fireCallbacks("login"),w()}else{let y=M.get("displayName"),_=await P($,"/api/auth/register",{appId:r,email:k,password:c,displayName:y});o.storeTokens(_.accessToken,_.refreshToken),o.currentUser=_.user,o.scheduleRefresh(),o.fireCallbacks("login"),w()}}catch(y){m=y instanceof Error?y.message:i("error.generic"),n=!1,u()}})}u(),document.body.appendChild(d),setTimeout(()=>{l.querySelector("input")?.focus()},50)}function V(e){let{appId:t,accent:r,locale:a,baseUrl:s,auth:o,theme:p,apiDeps:$,t:i,getLoginModalDeps:z,onLogout:T}=e;if(!o.currentUser){A(z(),"login");return}let m=document.getElementById("lmu-profile-host");m&&(p.unregisterHost(m),m.remove());let f=o.getStoredAccessToken();if(!f)return;let n=f,d=!1,l=o.currentUser.displayName,v=!1,x=!1,w=!1,u="",h="",U=!1,C=!1,L="",M=!1,k=document.createElement("div");k.id="lmu-profile-host",k.style.cssText="position:fixed;inset:0;z-index:99999;";let c=k.attachShadow({mode:"closed"});p.registerHost(k);let y=I(S(p.isDark)),_=he(r,y);function ee(){p.unregisterHost(k),k.remove()}c.addEventListener("click",q=>{let j=c.querySelector(".lmu-card");j&&!j.contains(q.target)&&c.contains(q.target)&&ee()});function g(){if(!o.currentUser)return;let q=o.currentUser.displayName?.charAt(0)?.toUpperCase()??"?",j=o.currentUser.avatar?o.currentUser.avatar.startsWith("http")?o.currentUser.avatar:`${s}${o.currentUser.avatar}`:"",ae=o.currentUser.emailVerified===!0;c.innerHTML=`
        <style>${_}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close">&times;</button>
          <div class="lmu-title">${i("profile.title")}</div>

          ${L?`<div class="lmu-success" style="margin-bottom:16px;">${L}</div>`:""}

          <div class="lmu-avatar-area">
            <div class="lmu-avatar-circle" id="lmu-avatar-click" title="${i("profile.avatar")}">
              ${j?`<img src="${j}" alt="" />`:q}
              <div class="lmu-avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              ${C?`<div class="lmu-avatar-overlay" style="opacity:1;"><span style="font-size:11px;color:#fff;">${i("profile.avatarUploading")}</span></div>`:""}
            </div>
            <input type="file" id="lmu-avatar-input" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none;" />
            <div class="lmu-avatar-info">
              <p class="lmu-avatar-name">${o.currentUser.displayName}</p>
              <div style="display:flex;align-items:center;gap:8px;margin-top:2px;">
                <p class="lmu-avatar-email" style="margin:0;">${o.currentUser.email}</p>
                ${ae?`<span class="lmu-badge lmu-badge-verified">${i("profile.emailVerified")}</span>`:`<span class="lmu-badge lmu-badge-unverified">${i("profile.emailNotVerified")}</span>`}
              </div>
              ${!ae&&!M?`<a id="lmu-resend-verify" style="font-size:11px;color:${r};cursor:pointer;margin-top:4px;display:inline-block;">${i("profile.resendVerification")}</a>`:""}
              ${M?`<span style="font-size:11px;color:#059669;margin-top:4px;display:inline-block;">${i("profile.verificationSent")}</span>`:""}
            </div>
          </div>

          <!-- Display Name Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${i("profile.displayName")}</div>
            ${x?`<div class="lmu-success">${i("profile.saved")}</div>`:""}
            ${d?`
              <div class="lmu-field">
                <input class="lmu-input" type="text" id="lmu-name-input" value="${l.replace(/"/g,"&quot;")}" />
              </div>
              <div class="lmu-row">
                <button class="lmu-btn-sm lmu-btn-primary" id="lmu-name-save" ${v?"disabled":""}>
                  ${i(v?"profile.saving":"profile.save")}
                </button>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-cancel">${a==="zh"?"\u53D6\u6D88":"Cancel"}</button>
              </div>
            `:`
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:15px;">${o.currentUser.displayName}</span>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-edit" style="padding:0 12px;height:32px;font-size:12px;">
                  ${a==="zh"?"\u7DE8\u8F2F":"Edit"}
                </button>
              </div>
            `}
          </div>

          <!-- Change Password Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${i("profile.changePassword")}</div>
            ${h?`<div class="lmu-success">${h}</div>`:""}
            ${u?`<div class="lmu-error">${u}</div>`:""}
            ${w?`
              <form id="lmu-pw-form">
                <div class="lmu-field">
                  <label class="lmu-label">${i("profile.currentPassword")}</label>
                  <input class="lmu-input" type="password" name="currentPassword" required />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${i("profile.newPassword")}</label>
                  <input class="lmu-input" type="password" name="newPassword" required minlength="8" />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${i("profile.confirmPassword")}</label>
                  <input class="lmu-input" type="password" name="confirmPassword" required minlength="8" />
                </div>
                <div class="lmu-row">
                  <button type="submit" class="lmu-btn-sm lmu-btn-primary" ${U?"disabled":""}>
                    ${i(U?"profile.saving":"profile.save")}
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
            <button class="lmu-btn-danger" id="lmu-logout">${i("profile.logout")}</button>
          </div>
        </div>
      `,p.applyToHost(k),c.getElementById("lmu-close")?.addEventListener("click",()=>ee());let $e=c.getElementById("lmu-avatar-click"),te=c.getElementById("lmu-avatar-input");$e?.addEventListener("click",()=>te?.click()),te?.addEventListener("change",async()=>{let D=te.files?.[0];if(!(!D||!n)){if(D.size>2*1024*1024){L="",g();return}C=!0,g();try{let E=new FormData;E.append("file",D);let F=await fetch(`${s}/api/auth/avatar`,{method:"POST",headers:{Authorization:`Bearer ${n}`},body:E}),B=await F.json();if(!F.ok)throw new Error(B.error??i("error.generic"));let K=B.data;K?.user&&o.currentUser&&(o.currentUser={...o.currentUser,avatar:K.user.avatar},o.fireCallbacks("login")),C=!1,L=i("profile.avatarUpdated"),g(),setTimeout(()=>{L="",g()},2e3)}catch{C=!1,g()}}}),c.getElementById("lmu-resend-verify")?.addEventListener("click",async()=>{if(n){try{await P($,"/api/auth/register",{appId:t,resendVerification:!0})}catch{}M=!0,g(),setTimeout(()=>{M=!1},5e3)}}),c.getElementById("lmu-name-edit")?.addEventListener("click",()=>{d=!0,l=o.currentUser?.displayName??"",x=!1,g(),c.getElementById("lmu-name-input")?.focus()}),c.getElementById("lmu-name-cancel")?.addEventListener("click",()=>{d=!1,g()}),c.getElementById("lmu-name-save")?.addEventListener("click",async()=>{let E=c.getElementById("lmu-name-input")?.value?.trim();if(!(!E||!n)){v=!0,g();try{await pe($,"/api/auth/profile",{displayName:E},n),o.currentUser&&(o.currentUser={...o.currentUser,displayName:E},o.fireCallbacks("login")),d=!1,x=!0,v=!1,g(),setTimeout(()=>{x=!1,g()},2e3)}catch{v=!1,g()}}}),c.getElementById("lmu-pw-show")?.addEventListener("click",()=>{w=!0,u="",h="",g()}),c.getElementById("lmu-pw-cancel")?.addEventListener("click",()=>{w=!1,u="",g()});let ne=c.getElementById("lmu-pw-form");ne?.addEventListener("submit",async D=>{D.preventDefault();let E=new FormData(ne),F=E.get("currentPassword"),B=E.get("newPassword"),K=E.get("confirmPassword");if(B!==K){u=i("profile.passwordMismatch"),g();return}if(B.length<8){u=i("error.passwordTooShort"),g();return}U=!0,u="",g();try{await me($,"/api/auth/change-password",{currentPassword:F,newPassword:B},n),w=!1,U=!1,h=i("profile.passwordChanged"),g(),setTimeout(()=>{h="",g()},3e3)}catch(se){u=se instanceof Error?se.message:i("error.generic"),U=!1,g()}}),c.getElementById("lmu-logout")?.addEventListener("click",()=>{ee(),T()})}g(),document.body.appendChild(k)}function be(e,t){let{accent:r,auth:a,theme:s,t:o,getLoginModalDeps:p,getProfileModalDeps:$,onLogout:i,onAuthChange:z}=e,T=I(S(s.isDark)),m=fe(r,T),f=typeof t=="string"?document.querySelector(t):t;if(!f)return()=>{};let n=document.createElement("div");n.className="lmu-profile-card-host";let d=n.attachShadow({mode:"closed"});s.registerHost(n);function l(){if(!a.currentUser){d.innerHTML=`
          <style>${m}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${o("btn.login")}</a>
            </div>
          </div>
        `,s.applyToHost(n),d.getElementById("lmu-pc-login")?.addEventListener("click",()=>{A(p(),"login")});return}let x=a.currentUser.displayName?.charAt(0)?.toUpperCase()??"?";d.innerHTML=`
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
      `,s.applyToHost(n),d.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{i()}),d.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{V($())})}f.appendChild(n),l();let v=z(()=>l());return()=>{v(),s.unregisterHost(n),n.remove()}}function ye(e,t){let{accent:r,auth:a,theme:s,t:o,getLoginModalDeps:p,getProfileModalDeps:$,onLogout:i,onAuthChange:z}=e,T=I(S(s.isDark)),m=ve(r,T),f=typeof t=="string"?document.querySelector(t):t;if(!f)return()=>{};let n=document.createElement("div");n.className="lmu-avatar-host";let d=n.attachShadow({mode:"closed"});s.registerHost(n);let l=!1;function v(){if(!a.currentUser){d.innerHTML=`
          <style>${m}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${o("btn.login")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,s.applyToHost(n),d.getElementById("lmu-av-login")?.addEventListener("click",()=>{A(p(),"login")});return}let u=a.currentUser.displayName?.charAt(0)?.toUpperCase()??"?";d.innerHTML=`
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
      `,s.applyToHost(n),d.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{l=!l,v()}),d.getElementById("lmu-av-profile")?.addEventListener("click",()=>{l=!1,v(),V($())}),d.getElementById("lmu-av-logout")?.addEventListener("click",()=>{l=!1,i()})}function x(u){l&&!n.contains(u.target)&&(l=!1,v())}document.addEventListener("click",x),f.appendChild(n),v();let w=z(()=>{l=!1,v()});return()=>{w(),s.unregisterHost(n),document.removeEventListener("click",x),n.remove()}}var H=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),N=H?.getAttribute("data-app-id")??"",Me=H?.getAttribute("data-theme")??"light",re=H?.getAttribute("data-accent")??"#2563eb",X=H?.getAttribute("data-locale")??"en",xe=H?.getAttribute("data-mode")??"modal",R=H?.src?new URL(H.src).origin:window.location.origin;N||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");var Z=de(X),oe=new W(Me),ie={baseUrl:R,t:Z},b=new J(N,ie);function Y(){return{appId:N,accent:re,locale:X,auth:b,theme:oe,apiDeps:ie,t:Z}}function ke(){return{appId:N,accent:re,locale:X,baseUrl:R,auth:b,theme:oe,apiDeps:ie,t:Z,getLoginModalDeps:Y,onLogout:()=>Q.logout()}}function we(){return{accent:re,locale:X,auth:b,theme:oe,t:Z,getLoginModalDeps:Y,getProfileModalDeps:ke,onLogout:()=>Q.logout(),onAuthChange:e=>Q.onAuthChange(e)}}var Q={get ready(){return b.ready},get user(){return b.currentUser},login(){if(xe==="redirect"){window.location.href=`${R}/login?app=${N}&redirect=${encodeURIComponent(window.location.href)}`;return}A(Y(),"login")},register(){if(xe==="redirect"){window.location.href=`${R}/login?app=${N}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}A(Y(),"register")},async logout(){let e=b.getStoredAccessToken();if(e)try{await fetch(`${R}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}b.clearTokens(),b.currentUser=null,b.cancelRefresh(),b.fireCallbacks("logout")},getToken(){return b.getStoredAccessToken()},whenReady(){return b.whenReady()},onAuthChange(e){return b.onAuthChange(e)},openAdmin(){window.open(`${R}/admin`,"_blank")},openProfile(){V(ke())},renderProfileCard(e){return be(we(),e)},renderAvatar(e){return ye(we(),e)}};window.letmeuse=Q;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>b.init()):b.init();})();
