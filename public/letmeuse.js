"use strict";(()=>{var fe={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"placeholder.email":{en:"you@example.com",zh:"\u8ACB\u8F38\u5165\u96FB\u5B50\u4FE1\u7BB1"},"placeholder.password":{en:"Enter your password",zh:"\u8ACB\u8F38\u5165\u5BC6\u78BC"},"placeholder.passwordNew":{en:"At least 8 characters",zh:"\u5BC6\u78BC\u9577\u5EA6\u6700\u4F4E 8 \u4F4D"},"placeholder.displayName":{en:"Your name",zh:"\u8ACB\u8F38\u5165\u986F\u793A\u540D\u7A31"},"password.show":{en:"Show password",zh:"\u986F\u793A\u5BC6\u78BC"},"password.hide":{en:"Hide password",zh:"\u96B1\u85CF\u5BC6\u78BC"},"btn.login":{en:"Sign In Now",zh:"\u7ACB\u5373\u767B\u5165"},"btn.register":{en:"Sign Up Now",zh:"\u7ACB\u5373\u8A3B\u518A"},"switch.toRegisterPrompt":{en:"Don't have an account yet?",zh:"\u9084\u6C92\u6709\u5E33\u865F\uFF1F"},"switch.toRegisterAction":{en:"Sign up now",zh:"\u7ACB\u5373\u8A3B\u518A"},"switch.toLoginPrompt":{en:"Already have an account?",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F"},"switch.toLoginAction":{en:"Sign in now",zh:"\u7ACB\u5373\u767B\u5165"},"register.terms":{en:"By signing up you agree to the Terms of Service & Privacy Policy",zh:"\u8A3B\u518A\u767B\u5165\u5373\u8868\u793A\u540C\u610F \u670D\u52D9\u689D\u6B3E\u3001\u96B1\u79C1\u6B0A\u653F\u7B56"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"error.invalidCredentials":{en:"Invalid email or password",zh:"\u5E33\u865F\u6216\u5BC6\u78BC\u932F\u8AA4"},"error.accountDisabled":{en:"Account is disabled",zh:"\u5E33\u865F\u5DF2\u505C\u7528"},"error.loginFailed":{en:"Login failed",zh:"\u767B\u5165\u5931\u6557"},"error.registrationFailed":{en:"Registration failed",zh:"\u8A3B\u518A\u5931\u6557"},"error.emailInUse":{en:"Email already registered",zh:"\u6B64\u4FE1\u7BB1\u5DF2\u88AB\u8A3B\u518A"},"error.tooManyAttempts":{en:"Too many attempts, please try again later",zh:"\u5617\u8A66\u6B21\u6578\u904E\u591A\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"},"label.rememberMe":{en:"Remember me",zh:"\u8A18\u4F4F\u5E33\u865F"},"error.passwordTooShort":{en:"Password must be at least 8 characters",zh:"\u5BC6\u78BC\u81F3\u5C11\u9700\u8981 8 \u500B\u5B57\u5143"},"forgot.title":{en:"Reset Password",zh:"\u91CD\u8A2D\u5BC6\u78BC"},"forgot.description":{en:"Enter your email to receive a reset link.",zh:"\u8F38\u5165\u4FE1\u7BB1\u4EE5\u6536\u53D6\u91CD\u8A2D\u9023\u7D50\u3002"},"forgot.send":{en:"Send Reset Link",zh:"\u767C\u9001\u91CD\u8A2D\u9023\u7D50"},"forgot.sent":{en:"Check your email for the reset link!",zh:"\u91CD\u8A2D\u9023\u7D50\u5DF2\u5BC4\u51FA\uFF0C\u8ACB\u67E5\u770B\u4FE1\u7BB1\uFF01"},"forgot.backToLogin":{en:"Back to Sign In",zh:"\u8FD4\u56DE\u767B\u5165"},"profile.title":{en:"Account Settings",zh:"\u5E33\u865F\u8A2D\u5B9A"},"profile.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"profile.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"profile.role":{en:"Role",zh:"\u89D2\u8272"},"profile.save":{en:"Save",zh:"\u5132\u5B58"},"profile.saving":{en:"Saving...",zh:"\u5132\u5B58\u4E2D..."},"profile.saved":{en:"Saved!",zh:"\u5DF2\u5132\u5B58\uFF01"},"profile.changePassword":{en:"Change Password",zh:"\u8B8A\u66F4\u5BC6\u78BC"},"profile.currentPassword":{en:"Current Password",zh:"\u76EE\u524D\u5BC6\u78BC"},"profile.newPassword":{en:"New Password",zh:"\u65B0\u5BC6\u78BC"},"profile.confirmPassword":{en:"Confirm Password",zh:"\u78BA\u8A8D\u5BC6\u78BC"},"profile.passwordMismatch":{en:"Passwords do not match",zh:"\u5169\u6B21\u5BC6\u78BC\u4E0D\u4E00\u81F4"},"profile.passwordChanged":{en:"Password changed!",zh:"\u5BC6\u78BC\u5DF2\u8B8A\u66F4\uFF01"},"profile.logout":{en:"Log Out",zh:"\u767B\u51FA"},"profile.avatar":{en:"Change Avatar",zh:"\u66F4\u63DB\u982D\u50CF"},"profile.avatarUploading":{en:"Uploading...",zh:"\u4E0A\u50B3\u4E2D..."},"profile.avatarUpdated":{en:"Avatar updated!",zh:"\u982D\u50CF\u5DF2\u66F4\u65B0\uFF01"},"profile.emailVerified":{en:"Verified",zh:"\u5DF2\u9A57\u8B49"},"profile.emailNotVerified":{en:"Not verified",zh:"\u672A\u9A57\u8B49"},"profile.resendVerification":{en:"Resend",zh:"\u91CD\u5BC4"},"profile.verificationSent":{en:"Verification email sent!",zh:"\u9A57\u8B49\u4FE1\u5DF2\u5BC4\u51FA\uFF01"}},Se={"Invalid credentials":"error.invalidCredentials","Account is disabled":"error.accountDisabled","Login failed":"error.loginFailed","Registration failed":"error.registrationFailed","Email already registered":"error.emailInUse","Too many requests":"error.tooManyAttempts"};function be(e){return t=>fe[t]?.[e]??fe[t]?.en??t}function J(e,t){let o=Se[e];return o?t(o):e}function N(e){return{bg:e?"#1e1e2e":"#ffffff",textColor:e?"#cdd6f4":"#1e293b",subtextColor:e?"#a6adc8":"#64748b",inputBg:e?"#313244":"#f8fafc",inputBorder:e?"#45475a":"#e2e8f0",errorBg:e?"#3b1c1c":"#fef2f2",errorColor:e?"#f87171":"#dc2626",errorBorder:e?"#5c2828":"#fecaca",hoverBg:e?"#3b3b50":"#f1f5f9",roleBg:e?"#313244":"#f1f5f9",dropdownItemHoverBg:e?"#313244":"#f8fafc"}}function Ie(){let e=document.documentElement.getAttribute("data-theme");return e==="dark"?!0:e==="light"?!1:document.documentElement.classList.contains("dark")?!0:window.matchMedia("(prefers-color-scheme: dark)").matches}function ve(e){return e==="auto"?Ie():e==="dark"}function O(e){return`
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
  `}function ye(e,t){let o=N(t);e.style.setProperty("--lmu-bg",o.bg),e.style.setProperty("--lmu-text",o.textColor),e.style.setProperty("--lmu-subtext",o.subtextColor),e.style.setProperty("--lmu-input-bg",o.inputBg),e.style.setProperty("--lmu-input-border",o.inputBorder),e.style.setProperty("--lmu-error-bg",o.errorBg),e.style.setProperty("--lmu-error-color",o.errorColor),e.style.setProperty("--lmu-error-border",o.errorBorder),e.style.setProperty("--lmu-hover-bg",o.hoverBg),e.style.setProperty("--lmu-role-bg",o.roleBg),e.style.setProperty("--lmu-dropdown-item-hover-bg",o.dropdownItemHoverBg)}var ee=class{constructor(t){this.activeShadowHosts=new Set;this.themeSetting=t,this.currentIsDark=ve(t),this.setupAutoTheme()}get isDark(){return this.currentIsDark}registerHost(t){this.activeShadowHosts.add(t)}unregisterHost(t){this.activeShadowHosts.delete(t)}applyToHost(t){ye(t,this.currentIsDark)}updateAllShadowHosts(){for(let t of this.activeShadowHosts)ye(t,this.currentIsDark)}handleThemeChange(){let t=ve(this.themeSetting);t!==this.currentIsDark&&(this.currentIsDark=t,this.updateAllShadowHosts())}setupAutoTheme(){if(this.themeSetting!=="auto")return;new MutationObserver(()=>{this.handleThemeChange()}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.handleThemeChange()})}};var _=class extends Error{constructor(t,o){super(t),this.status=o}};async function R(e,t,o){let a=await fetch(`${e.baseUrl}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),n=await a.json();if(!a.ok){let i=n.error??"";throw new _(J(i,e.t)||e.t("error.generic"),a.status)}return n.data??n}async function te(e,t,o){let a={};o&&(a.Authorization=`Bearer ${o}`);let n=await fetch(`${e.baseUrl}${t}`,{headers:a}),i=await n.json();if(!n.ok){let m=i.error??"";throw new _(J(m,e.t)||e.t("error.generic"),n.status)}return i.data??i}async function xe(e,t,o,a){let n=await fetch(`${e.baseUrl}${t}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(o)}),i=await n.json();if(!n.ok){let m=i.error??"";throw new _(J(m,e.t)||e.t("error.generic"),n.status)}return i.data??i}async function we(e,t,o,a){let n=await fetch(`${e.baseUrl}${t}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(o)}),i=await n.json();if(!n.ok){let m=i.error??"";throw new _(J(m,e.t)||e.t("error.generic"),n.status)}return i.data??i}function de(e){return e instanceof _&&e.status===401}var re=class{constructor(t,o){this._currentUser=null;this._ready=!1;this.callbacks=[];this.refreshTimer=null;this.availableProviders=[];this.requireEmailVerification=!1;this.appId=t,this.apiDeps=o;let a=`lmu_${t}_`;this.accessKey=`${a}access_token`,this.refreshKey=`${a}refresh_token`,this._readyPromise=new Promise(n=>{this._readyResolve=n})}get currentUser(){return this._currentUser}set currentUser(t){this._currentUser=t}get ready(){return this._ready}whenReady(){return this._readyPromise}getStoredAccessToken(){return localStorage.getItem(this.accessKey)}getStoredRefreshToken(){return localStorage.getItem(this.refreshKey)}storeTokens(t,o){localStorage.setItem(this.accessKey,t),localStorage.setItem(this.refreshKey,o)}clearTokens(){localStorage.removeItem(this.accessKey),localStorage.removeItem(this.refreshKey)}fireCallbacks(t="init"){for(let o of this.callbacks)try{o(this._currentUser,t)}catch{}}onAuthChange(t){if(this.callbacks.push(t),this._ready)try{t(this._currentUser,"init")}catch{}return()=>{let o=this.callbacks.indexOf(t);o!==-1&&this.callbacks.splice(o,1)}}parseJwtExp(t){try{let o=t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),a=Uint8Array.from(atob(o),i=>i.charCodeAt(0)),n=JSON.parse(new TextDecoder().decode(a));return n.exp?n.exp*1e3:null}catch{return null}}scheduleRefresh(){this.refreshTimer&&clearTimeout(this.refreshTimer);let t=this.getStoredAccessToken();if(!t)return;let o=this.parseJwtExp(t);if(!o)return;let a=o-Date.now()-300*1e3;if(a<=0){this.doRefresh();return}this.refreshTimer=setTimeout(()=>this.doRefresh(),a)}async doRefresh(){let t=this.getStoredRefreshToken();if(t)try{let o=await R(this.apiDeps,"/api/auth/refresh",{refreshToken:t});this.storeTokens(o.accessToken,o.refreshToken),this.scheduleRefresh()}catch(o){de(o)?(this.clearTokens(),this._currentUser=null,this.fireCallbacks("refresh_failed")):this.refreshTimer=setTimeout(()=>this.doRefresh(),60*1e3)}}cancelRefresh(){this.refreshTimer&&clearTimeout(this.refreshTimer)}async fetchProviders(){if(this.appId)try{let t=await te(this.apiDeps,`/api/auth/providers?app_id=${this.appId}`,"");this.availableProviders=t.providers??[],this.requireEmailVerification=t.requireEmailVerification===!0}catch{this.availableProviders=[],this.requireEmailVerification=!1}}startOAuth(t){let o=encodeURIComponent(window.location.href);window.location.href=`${this.apiDeps.baseUrl}/api/auth/oauth/${t}?app_id=${this.appId}&redirect=${o}`}checkHashTokens(){let t=window.location.hash;if(!t.includes("lmu_token="))return!1;let o=new URLSearchParams(t.slice(1)),a=o.get("lmu_token"),n=o.get("lmu_refresh");return a&&n?(this.storeTokens(a,n),window.history.replaceState(null,"",window.location.pathname+window.location.search),!0):!1}async init(){this.checkHashTokens(),await this.fetchProviders();let t=this.getStoredAccessToken();if(!t){this._ready=!0,this._readyResolve(null),this.fireCallbacks("init");return}try{let o=await te(this.apiDeps,"/api/auth/me",t);this._currentUser=o.user,this.scheduleRefresh()}catch(o){let a=this.getStoredRefreshToken();if(a)try{let n=await R(this.apiDeps,"/api/auth/refresh",{refreshToken:a});this.storeTokens(n.accessToken,n.refreshToken);let i=await te(this.apiDeps,"/api/auth/me",n.accessToken);this._currentUser=i.user,this.scheduleRefresh()}catch(n){de(n)&&this.clearTokens()}else de(o)&&this.clearTokens()}this._ready=!0,this._readyResolve(this._currentUser),this.fireCallbacks("init")}};function ke(e,t){return`
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
    .lmu-remember {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: var(--lmu-subtext);
      cursor: pointer;
      user-select: none;
      margin: 0 0 14px 0;
    }
    .lmu-remember input {
      width: 15px;
      height: 15px;
      margin: 0;
      accent-color: ${e};
      cursor: pointer;
    }
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
    .lmu-input-wrap {
      position: relative;
    }
    .lmu-input-wrap .lmu-input {
      padding-right: 44px;
    }
    .lmu-eye-btn {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      position: absolute;
      top: 0;
      right: 0;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      color: var(--lmu-subtext);
      opacity: 0.7;
      transition: opacity 0.15s, color 0.15s;
    }
    .lmu-eye-btn:hover { opacity: 1; color: var(--lmu-text); }
    .lmu-eye-btn svg {
      width: 18px;
      height: 18px;
      display: block;
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
  `}function $e(e,t){return`
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
    .lmu-input-wrap { position: relative; }
    .lmu-input-wrap .lmu-input { padding-right: 42px; }
    .lmu-eye-btn {
      -webkit-appearance: none; -moz-appearance: none; appearance: none;
      position: absolute; top: 0; right: 0; width: 42px; height: 42px;
      display: flex; align-items: center; justify-content: center;
      background: none; border: none; padding: 0; margin: 0;
      cursor: pointer; color: var(--lmu-subtext); opacity: 0.7;
      transition: opacity 0.15s, color 0.15s;
    }
    .lmu-eye-btn:hover { opacity: 1; color: var(--lmu-text); }
    .lmu-eye-btn svg { width: 18px; height: 18px; display: block; }
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
  `}function Te(e,t){return`
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
  `}function Ee(e,t){return`
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
  `}var q='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',K='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';function j(e,t){let{appId:o,accent:a,locale:n,auth:i,theme:m,apiDeps:z,t:r}=e,D=document.getElementById("lmu-auth-host");D&&(m.unregisterHost(D),D.remove());let P=t,g="",x="",s=!1,u=!1,h="",b="",L="",U=!1,v=`lmu_${o}_remembered_email`;try{let l=localStorage.getItem(v);l&&(h=l,U=!0)}catch{}let S=l=>l.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),w=document.createElement("div");w.id="lmu-auth-host",w.style.cssText="position:fixed;inset:0;z-index:99999;";let c=w.attachShadow({mode:"closed"});m.registerHost(w);let G=O(N(m.isDark)),F=ke(a,G);function A(){m.unregisterHost(w),w.remove()}c.addEventListener("click",l=>{let p=c.querySelector(".lmu-card");p&&!p.contains(l.target)&&c.contains(l.target)&&A()});function k(){let l=P==="login";if(P==="forgot"){c.innerHTML=`
          <style>${F}</style>
          <div class="lmu-card">
            <button class="lmu-close" id="lmu-close-btn">&times;</button>
            <div class="lmu-title">${r("forgot.title")}</div>
            ${x?`<div class="lmu-success">${x}</div>`:""}
            ${g?`<div class="lmu-error">${g}</div>`:""}
            ${x?"":`
              <p style="font-size:14px;color:var(--lmu-subtext);margin:0 0 18px 0;text-align:center;">${r("forgot.description")}</p>
              <form id="lmu-forgot-form">
                <div class="lmu-field">
                  <label class="lmu-label">${r("label.email")}</label>
                  <input class="lmu-input" type="email" name="email" value="${S(h)}" required />
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
        `,m.applyToHost(w),c.getElementById("lmu-close-btn")?.addEventListener("click",()=>A()),c.getElementById("lmu-back-login")?.addEventListener("click",()=>{P="login",g="",x="",k()});let B=c.getElementById("lmu-forgot-form");B?.addEventListener("submit",async $=>{$.preventDefault();let y=new FormData(B).get("email");h=y,s=!0,g="",k();try{await R(z,"/api/auth/forgot-password",{appId:o,email:y}),s=!1,x=r("forgot.sent"),k()}catch(f){g=f instanceof Error?f.message:r("error.generic"),s=!1,k()}});return}c.innerHTML=`
        <style>${F}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${r(l?"title.login":"title.register")}</div>
          ${g?`<div class="lmu-error">${g}</div>`:""}
          <form id="lmu-auth-form">
            ${l?"":`
              <div class="lmu-field">
                <label class="lmu-label">${r("label.displayName")} <span class="lmu-req">*</span></label>
                <input class="lmu-input" type="text" name="displayName" placeholder="${r("placeholder.displayName")}" value="${S(L)}" required />
              </div>
            `}
            <div class="lmu-field">
              <label class="lmu-label">${r("label.email")} <span class="lmu-req">*</span></label>
              <input class="lmu-input" type="email" name="email" placeholder="${r("placeholder.email")}" value="${S(h)}" required />
            </div>
            <div class="lmu-field">
              <div class="lmu-label-row">
                <label class="lmu-label">${r("label.password")} <span class="lmu-req">*</span></label>
                ${l?`<a id="lmu-forgot-pw" class="lmu-label-link">${r("link.forgotPassword")}</a>`:""}
              </div>
              <div class="lmu-input-wrap">
                <input class="lmu-input" type="${u?"text":"password"}" name="password" id="lmu-password-input" placeholder="${r(l?"placeholder.password":"placeholder.passwordNew")}" value="${S(b)}" required minlength="${l?1:8}" />
                <button class="lmu-eye-btn" type="button" id="lmu-toggle-password" tabindex="-1" aria-label="${r(u?"password.hide":"password.show")}">
                  ${u?K:q}
                </button>
              </div>
            </div>
            ${l?`
              <label class="lmu-remember">
                <input type="checkbox" name="remember" ${U?"checked":""} />
                <span>${r("label.rememberMe")}</span>
              </label>
            `:""}
            ${l?"":`<p class="lmu-terms">${r("register.terms")}</p>`}
            <button class="lmu-btn" type="submit" ${s?"disabled":""}>
              ${r(s?"msg.loading":l?"btn.login":"btn.register")}
            </button>
          </form>
          ${i.availableProviders.length>0?`
            <div class="lmu-divider">${r("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${i.availableProviders.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${r("oauth.google")}
                </button>
              `:""}
              ${i.availableProviders.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="var(--lmu-text)"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${r("oauth.github")}
                </button>
              `:""}
            </div>
          `:""}
          <div class="lmu-switch">
            <span class="lmu-switch-text">${r(l?"switch.toRegisterPrompt":"switch.toLoginPrompt")}</span>
            <a id="lmu-switch-mode">${r(l?"switch.toRegisterAction":"switch.toLoginAction")}</a>
          </div>
        </div>
      `,m.applyToHost(w),c.getElementById("lmu-close-btn")?.addEventListener("click",()=>A()),c.getElementById("lmu-oauth-google")?.addEventListener("click",()=>i.startOAuth("google")),c.getElementById("lmu-oauth-github")?.addEventListener("click",()=>i.startOAuth("github")),c.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{P="forgot",g="",x="",k()}),c.getElementById("lmu-toggle-password")?.addEventListener("click",()=>{u=!u;let B=c.getElementById("lmu-password-input"),$=c.getElementById("lmu-toggle-password");B&&(B.type=u?"text":"password"),$&&($.innerHTML=u?K:q,$.setAttribute("aria-label",r(u?"password.hide":"password.show")))}),c.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{P=l?"register":"login",g="",k()});let X=c.getElementById("lmu-auth-form");X?.addEventListener("submit",async B=>{if(B.preventDefault(),s)return;let $=new FormData(X),d=$.get("email"),y=$.get("password");if(h=d,b=y,l||(L=$.get("displayName")??""),l&&(U=$.get("remember")!==null),s=!0,g="",k(),!l&&y.length<8){g=r("error.passwordTooShort"),s=!1,k();return}try{if(l){let f=await R(z,"/api/auth/login",{appId:o,email:d,password:y});try{U?localStorage.setItem(v,d):localStorage.removeItem(v)}catch{}i.storeTokens(f.accessToken,f.refreshToken),i.currentUser=f.user,i.scheduleRefresh(),i.fireCallbacks("login"),A()}else{let f=$.get("displayName"),I=await R(z,"/api/auth/register",{appId:o,email:d,password:y,displayName:f});i.storeTokens(I.accessToken,I.refreshToken),i.currentUser=I.user,i.scheduleRefresh(),i.fireCallbacks("login"),A()}}catch(f){g=f instanceof Error?f.message:r("error.generic"),s=!1,k()}})}k(),document.body.appendChild(w),setTimeout(()=>{(h?c.getElementById("lmu-password-input"):c.querySelector("input"))?.focus()},50)}function Q(e){let{appId:t,accent:o,locale:a,baseUrl:n,auth:i,theme:m,apiDeps:z,t:r,getLoginModalDeps:D,onLogout:P}=e;if(!i.currentUser){j(D(),"login");return}let g=document.getElementById("lmu-profile-host");g&&(m.unregisterHost(g),g.remove());let x=i.getStoredAccessToken();if(!x)return;let s=x,u=!1,h=i.currentUser.displayName,b=!1,L=!1,U=!1,v="",S="",w=!1,c={};function G(y,f){let I=c[y]===!0;return`
        <div class="lmu-input-wrap">
          <input class="lmu-input" type="${I?"text":"password"}" name="${y}" ${f} />
          <button class="lmu-eye-btn" type="button" tabindex="-1" data-pw-toggle="${y}" aria-label="${r(I?"password.hide":"password.show")}">
            ${I?K:q}
          </button>
        </div>`}let F=!1,A="",k=!1,l=document.createElement("div");l.id="lmu-profile-host",l.style.cssText="position:fixed;inset:0;z-index:99999;";let p=l.attachShadow({mode:"closed"});m.registerHost(l);let X=O(N(m.isDark)),B=$e(o,X);function $(){m.unregisterHost(l),l.remove()}p.addEventListener("click",y=>{let f=p.querySelector(".lmu-card");f&&!f.contains(y.target)&&p.contains(y.target)&&$()});function d(){if(!i.currentUser)return;let y=i.currentUser.displayName?.charAt(0)?.toUpperCase()??"?",f=i.currentUser.avatar?i.currentUser.avatar.startsWith("http")?i.currentUser.avatar:`${n}${i.currentUser.avatar}`:"",I=i.currentUser.emailVerified===!0,se=i.requireEmailVerification===!0;p.innerHTML=`
        <style>${B}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close">&times;</button>
          <div class="lmu-title">${r("profile.title")}</div>

          ${A?`<div class="lmu-success" style="margin-bottom:16px;">${A}</div>`:""}

          <div class="lmu-avatar-area">
            <div class="lmu-avatar-circle" id="lmu-avatar-click" title="${r("profile.avatar")}">
              ${f?`<img src="${f}" alt="" />`:y}
              <div class="lmu-avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              ${F?`<div class="lmu-avatar-overlay" style="opacity:1;"><span style="font-size:11px;color:#fff;">${r("profile.avatarUploading")}</span></div>`:""}
            </div>
            <input type="file" id="lmu-avatar-input" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none;" />
            <div class="lmu-avatar-info">
              <p class="lmu-avatar-name">${i.currentUser.displayName}</p>
              <div style="display:flex;align-items:center;gap:8px;margin-top:2px;">
                <p class="lmu-avatar-email" style="margin:0;">${i.currentUser.email}</p>
                ${se?I?`<span class="lmu-badge lmu-badge-verified">${r("profile.emailVerified")}</span>`:`<span class="lmu-badge lmu-badge-unverified">${r("profile.emailNotVerified")}</span>`:""}
              </div>
              ${se&&!I&&!k?`<a id="lmu-resend-verify" style="font-size:11px;color:${o};cursor:pointer;margin-top:4px;display:inline-block;">${r("profile.resendVerification")}</a>`:""}
              ${se&&k?`<span style="font-size:11px;color:#059669;margin-top:4px;display:inline-block;">${r("profile.verificationSent")}</span>`:""}
            </div>
          </div>

          <!-- Display Name Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${r("profile.displayName")}</div>
            ${L?`<div class="lmu-success">${r("profile.saved")}</div>`:""}
            ${u?`
              <div class="lmu-field">
                <input class="lmu-input" type="text" id="lmu-name-input" value="${h.replace(/"/g,"&quot;")}" />
              </div>
              <div class="lmu-row">
                <button class="lmu-btn-sm lmu-btn-primary" id="lmu-name-save" ${b?"disabled":""}>
                  ${r(b?"profile.saving":"profile.save")}
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
            <div class="lmu-section-title">${r("profile.changePassword")}</div>
            ${S?`<div class="lmu-success">${S}</div>`:""}
            ${v?`<div class="lmu-error">${v}</div>`:""}
            ${U?`
              <form id="lmu-pw-form">
                <div class="lmu-field">
                  <label class="lmu-label">${r("profile.currentPassword")}</label>
                  ${G("currentPassword","required")}
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${r("profile.newPassword")}</label>
                  ${G("newPassword",'required minlength="8"')}
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${r("profile.confirmPassword")}</label>
                  ${G("confirmPassword",'required minlength="8"')}
                </div>
                <div class="lmu-row">
                  <button type="submit" class="lmu-btn-sm lmu-btn-primary" ${w?"disabled":""}>
                    ${r(w?"profile.saving":"profile.save")}
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
            <button class="lmu-btn-danger" id="lmu-logout">${r("profile.logout")}</button>
          </div>
        </div>
      `,m.applyToHost(l),p.getElementById("lmu-close")?.addEventListener("click",()=>$());let Ae=p.getElementById("lmu-avatar-click"),le=p.getElementById("lmu-avatar-input");Ae?.addEventListener("click",()=>le?.click()),le?.addEventListener("change",async()=>{let M=le.files?.[0];if(!(!M||!s)){if(M.size>2*1024*1024){A="",d();return}F=!0,d();try{let E=new FormData;E.append("file",M);let C=await fetch(`${n}/api/auth/avatar`,{method:"POST",headers:{Authorization:`Bearer ${s}`},body:E}),H=await C.json();if(!C.ok)throw new Error(H.error??r("error.generic"));let Z=H.data;Z?.user&&i.currentUser&&(i.currentUser={...i.currentUser,avatar:Z.user.avatar},i.fireCallbacks("login")),F=!1,A=r("profile.avatarUpdated"),d(),setTimeout(()=>{A="",d()},2e3)}catch{F=!1,d()}}}),p.getElementById("lmu-resend-verify")?.addEventListener("click",async()=>{if(s){try{await R(z,"/api/auth/register",{appId:t,resendVerification:!0})}catch{}k=!0,d(),setTimeout(()=>{k=!1},5e3)}}),p.getElementById("lmu-name-edit")?.addEventListener("click",()=>{u=!0,h=i.currentUser?.displayName??"",L=!1,d(),p.getElementById("lmu-name-input")?.focus()}),p.getElementById("lmu-name-cancel")?.addEventListener("click",()=>{u=!1,d()}),p.getElementById("lmu-name-save")?.addEventListener("click",async()=>{let E=p.getElementById("lmu-name-input")?.value?.trim();if(!(!E||!s)){b=!0,d();try{await xe(z,"/api/auth/profile",{displayName:E},s),i.currentUser&&(i.currentUser={...i.currentUser,displayName:E},i.fireCallbacks("login")),u=!1,L=!0,b=!1,d(),setTimeout(()=>{L=!1,d()},2e3)}catch{b=!1,d()}}}),p.getElementById("lmu-pw-show")?.addEventListener("click",()=>{U=!0,v="",S="",d()}),p.getElementById("lmu-pw-cancel")?.addEventListener("click",()=>{U=!1,v="",d()}),p.querySelectorAll("[data-pw-toggle]").forEach(M=>{M.addEventListener("click",()=>{let E=M.dataset.pwToggle??"",C=c[E]!==!0;c={...c,[E]:C};let H=p.querySelector(`input[name="${E}"]`);H&&(H.type=C?"text":"password"),M.innerHTML=C?K:q,M.setAttribute("aria-label",r(C?"password.hide":"password.show"))})});let ge=p.getElementById("lmu-pw-form");ge?.addEventListener("submit",async M=>{M.preventDefault();let E=new FormData(ge),C=E.get("currentPassword"),H=E.get("newPassword"),Z=E.get("confirmPassword");if(H!==Z){v=r("profile.passwordMismatch"),d();return}if(H.length<8){v=r("error.passwordTooShort"),d();return}w=!0,v="",d();try{await we(z,"/api/auth/change-password",{currentPassword:C,newPassword:H},s),U=!1,w=!1,S=r("profile.passwordChanged"),d(),setTimeout(()=>{S="",d()},3e3)}catch(he){v=he instanceof Error?he.message:r("error.generic"),w=!1,d()}}),p.getElementById("lmu-logout")?.addEventListener("click",()=>{$(),P()})}d(),document.body.appendChild(l)}function Le(e,t){let{accent:o,auth:a,theme:n,t:i,getLoginModalDeps:m,getProfileModalDeps:z,onLogout:r,onAuthChange:D}=e,P=O(N(n.isDark)),g=Te(o,P),x=typeof t=="string"?document.querySelector(t):t;if(!x)return()=>{};let s=document.createElement("div");s.className="lmu-profile-card-host";let u=s.attachShadow({mode:"closed"});n.registerHost(s);function h(){if(!a.currentUser){u.innerHTML=`
          <style>${g}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${i("btn.login")}</a>
            </div>
          </div>
        `,n.applyToHost(s),u.getElementById("lmu-pc-login")?.addEventListener("click",()=>{j(m(),"login")});return}let L=a.currentUser.displayName?.charAt(0)?.toUpperCase()??"?";u.innerHTML=`
        <style>${g}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${a.currentUser.avatar?`<img src="${a.currentUser.avatar}" alt="" />`:L}
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
      `,n.applyToHost(s),u.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{r()}),u.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{Q(z())})}x.appendChild(s),h();let b=D(()=>h());return()=>{b(),n.unregisterHost(s),s.remove()}}function Me(e,t){let{accent:o,auth:a,theme:n,t:i,getLoginModalDeps:m,getProfileModalDeps:z,onLogout:r,onAuthChange:D}=e,P=O(N(n.isDark)),g=Ee(o,P),x=typeof t=="string"?document.querySelector(t):t;if(!x)return()=>{};let s=document.createElement("div");s.className="lmu-avatar-host";let u=s.attachShadow({mode:"closed"});n.registerHost(s);let h=!1;function b(){if(!a.currentUser){u.innerHTML=`
          <style>${g}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${i("btn.login")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,n.applyToHost(s),u.getElementById("lmu-av-login")?.addEventListener("click",()=>{j(m(),"login")});return}let v=a.currentUser.displayName?.charAt(0)?.toUpperCase()??"?";u.innerHTML=`
        <style>${g}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${a.currentUser.avatar?`<img src="${a.currentUser.avatar}" alt="" />`:v}
        </button>
        ${h?`
          <div class="lmu-avatar-dropdown">
            <div class="lmu-avatar-dropdown-header">
              <p class="lmu-avatar-dropdown-name">${a.currentUser.displayName}</p>
              <p class="lmu-avatar-dropdown-email">${a.currentUser.email}</p>
            </div>
            <button class="lmu-avatar-dropdown-item" id="lmu-av-profile">Edit Profile</button>
            <button class="lmu-avatar-dropdown-item danger" id="lmu-av-logout">Logout</button>
          </div>
        `:""}
      `,n.applyToHost(s),u.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{h=!h,b()}),u.getElementById("lmu-av-profile")?.addEventListener("click",()=>{h=!1,b(),Q(z())}),u.getElementById("lmu-av-logout")?.addEventListener("click",()=>{h=!1,r()})}function L(v){h&&!s.contains(v.target)&&(h=!1,b())}document.addEventListener("click",L),x.appendChild(s),b();let U=D(()=>{h=!1,b()});return()=>{U(),n.unregisterHost(s),document.removeEventListener("click",L),s.remove()}}var V=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),W=V?.getAttribute("data-app-id")??"",Ce=V?.getAttribute("data-theme")??"light",ce=V?.getAttribute("data-accent")??"#2563eb",ae=V?.getAttribute("data-locale")??"en",ze=V?.getAttribute("data-mode")??"modal",Y=V?.src?new URL(V.src).origin:window.location.origin;W||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");var ne=be(ae),pe=new ee(Ce),me={baseUrl:Y,t:ne},T=new re(W,me);function oe(){return{appId:W,accent:ce,locale:ae,auth:T,theme:pe,apiDeps:me,t:ne}}function Ue(){return{appId:W,accent:ce,locale:ae,baseUrl:Y,auth:T,theme:pe,apiDeps:me,t:ne,getLoginModalDeps:oe,onLogout:()=>ie.logout()}}function Pe(){return{accent:ce,locale:ae,auth:T,theme:pe,t:ne,getLoginModalDeps:oe,getProfileModalDeps:Ue,onLogout:()=>ie.logout(),onAuthChange:e=>ie.onAuthChange(e)}}var ue=!1,ie={get ready(){return T.ready},get user(){return T.currentUser},login(){if(ze==="redirect"){window.location.href=`${Y}/login?app=${W}&redirect=${encodeURIComponent(window.location.href)}`;return}j(oe(),"login")},register(){if(ze==="redirect"){window.location.href=`${Y}/login?app=${W}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}j(oe(),"register")},async logout(){if(!ue){ue=!0;try{let e=T.getStoredAccessToken();if(e)try{await fetch(`${Y}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${e}`}})}catch{}T.clearTokens(),T.currentUser=null,T.cancelRefresh(),T.fireCallbacks("logout")}finally{ue=!1}}},getToken(){return T.getStoredAccessToken()},whenReady(){return T.whenReady()},onAuthChange(e){return T.onAuthChange(e)},openAdmin(){window.open(`${Y}/admin`,"_blank")},openProfile(){Q(Ue())},renderProfileCard(e){return Le(Pe(),e)},renderAvatar(e){return Me(Pe(),e)}};window.letmeuse=ie;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>T.init()):T.init();})();
