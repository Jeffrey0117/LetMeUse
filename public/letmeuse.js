"use strict";(()=>{var ve={"title.login":{en:"Sign In",zh:"\u767B\u5165"},"title.register":{en:"Create Account",zh:"\u5EFA\u7ACB\u5E33\u865F"},"label.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"label.password":{en:"Password",zh:"\u5BC6\u78BC"},"label.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"placeholder.email":{en:"you@example.com",zh:"\u8ACB\u8F38\u5165\u96FB\u5B50\u4FE1\u7BB1"},"placeholder.password":{en:"Enter your password",zh:"\u8ACB\u8F38\u5165\u5BC6\u78BC"},"placeholder.passwordNew":{en:"At least 8 characters",zh:"\u5BC6\u78BC\u9577\u5EA6\u6700\u4F4E 8 \u4F4D"},"placeholder.displayName":{en:"Your name",zh:"\u8ACB\u8F38\u5165\u986F\u793A\u540D\u7A31"},"password.show":{en:"Show password",zh:"\u986F\u793A\u5BC6\u78BC"},"password.hide":{en:"Hide password",zh:"\u96B1\u85CF\u5BC6\u78BC"},"btn.login":{en:"Sign In Now",zh:"\u7ACB\u5373\u767B\u5165"},"btn.register":{en:"Sign Up Now",zh:"\u7ACB\u5373\u8A3B\u518A"},"switch.toRegisterPrompt":{en:"Don't have an account yet?",zh:"\u9084\u6C92\u6709\u5E33\u865F\uFF1F"},"switch.toRegisterAction":{en:"Sign up now",zh:"\u7ACB\u5373\u8A3B\u518A"},"switch.toLoginPrompt":{en:"Already have an account?",zh:"\u5DF2\u6709\u5E33\u865F\uFF1F"},"switch.toLoginAction":{en:"Sign in now",zh:"\u7ACB\u5373\u767B\u5165"},"register.terms":{en:"By signing up you agree to the Terms of Service & Privacy Policy",zh:"\u8A3B\u518A\u767B\u5165\u5373\u8868\u793A\u540C\u610F \u670D\u52D9\u689D\u6B3E\u3001\u96B1\u79C1\u6B0A\u653F\u7B56"},"error.generic":{en:"Something went wrong",zh:"\u767C\u751F\u932F\u8AA4"},"error.invalidCredentials":{en:"Invalid email or password",zh:"\u5E33\u865F\u6216\u5BC6\u78BC\u932F\u8AA4"},"error.accountDisabled":{en:"Account is disabled",zh:"\u5E33\u865F\u5DF2\u505C\u7528"},"error.loginFailed":{en:"Login failed",zh:"\u767B\u5165\u5931\u6557"},"error.registrationFailed":{en:"Registration failed",zh:"\u8A3B\u518A\u5931\u6557"},"error.emailInUse":{en:"Email already registered",zh:"\u6B64\u4FE1\u7BB1\u5DF2\u88AB\u8A3B\u518A"},"error.tooManyAttempts":{en:"Too many attempts, please try again later",zh:"\u5617\u8A66\u6B21\u6578\u904E\u591A\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66"},"msg.loading":{en:"Loading...",zh:"\u8F09\u5165\u4E2D..."},"oauth.or":{en:"or continue with",zh:"\u6216\u4F7F\u7528\u4EE5\u4E0B\u65B9\u5F0F\u767B\u5165"},"oauth.google":{en:"Google",zh:"Google"},"oauth.github":{en:"GitHub",zh:"GitHub"},"link.forgotPassword":{en:"Forgot password?",zh:"\u5FD8\u8A18\u5BC6\u78BC\uFF1F"},"label.rememberMe":{en:"Remember me",zh:"\u8A18\u4F4F\u5E33\u865F"},"error.passwordTooShort":{en:"Password must be at least 8 characters",zh:"\u5BC6\u78BC\u81F3\u5C11\u9700\u8981 8 \u500B\u5B57\u5143"},"forgot.title":{en:"Reset Password",zh:"\u91CD\u8A2D\u5BC6\u78BC"},"forgot.description":{en:"Enter your email to receive a reset link.",zh:"\u8F38\u5165\u4FE1\u7BB1\u4EE5\u6536\u53D6\u91CD\u8A2D\u9023\u7D50\u3002"},"forgot.send":{en:"Send Reset Link",zh:"\u767C\u9001\u91CD\u8A2D\u9023\u7D50"},"forgot.sent":{en:"Check your email for the reset link!",zh:"\u91CD\u8A2D\u9023\u7D50\u5DF2\u5BC4\u51FA\uFF0C\u8ACB\u67E5\u770B\u4FE1\u7BB1\uFF01"},"forgot.backToLogin":{en:"Back to Sign In",zh:"\u8FD4\u56DE\u767B\u5165"},"profile.title":{en:"Account Settings",zh:"\u5E33\u865F\u8A2D\u5B9A"},"profile.displayName":{en:"Display Name",zh:"\u986F\u793A\u540D\u7A31"},"profile.email":{en:"Email",zh:"\u96FB\u5B50\u4FE1\u7BB1"},"profile.role":{en:"Role",zh:"\u89D2\u8272"},"profile.save":{en:"Save",zh:"\u5132\u5B58"},"profile.saving":{en:"Saving...",zh:"\u5132\u5B58\u4E2D..."},"profile.saved":{en:"Saved!",zh:"\u5DF2\u5132\u5B58\uFF01"},"profile.changePassword":{en:"Change Password",zh:"\u8B8A\u66F4\u5BC6\u78BC"},"profile.currentPassword":{en:"Current Password",zh:"\u76EE\u524D\u5BC6\u78BC"},"profile.newPassword":{en:"New Password",zh:"\u65B0\u5BC6\u78BC"},"profile.confirmPassword":{en:"Confirm Password",zh:"\u78BA\u8A8D\u5BC6\u78BC"},"profile.passwordMismatch":{en:"Passwords do not match",zh:"\u5169\u6B21\u5BC6\u78BC\u4E0D\u4E00\u81F4"},"profile.passwordChanged":{en:"Password changed!",zh:"\u5BC6\u78BC\u5DF2\u8B8A\u66F4\uFF01"},"profile.logout":{en:"Log Out",zh:"\u767B\u51FA"},"profile.avatar":{en:"Change Avatar",zh:"\u66F4\u63DB\u982D\u50CF"},"profile.avatarUploading":{en:"Uploading...",zh:"\u4E0A\u50B3\u4E2D..."},"profile.avatarUpdated":{en:"Avatar updated!",zh:"\u982D\u50CF\u5DF2\u66F4\u65B0\uFF01"},"profile.emailVerified":{en:"Verified",zh:"\u5DF2\u9A57\u8B49"},"profile.emailNotVerified":{en:"Not verified",zh:"\u672A\u9A57\u8B49"},"profile.resendVerification":{en:"Resend",zh:"\u91CD\u5BC4"},"profile.verificationSent":{en:"Verification email sent!",zh:"\u9A57\u8B49\u4FE1\u5DF2\u5BC4\u51FA\uFF01"}},je={"Invalid credentials":"error.invalidCredentials","Account is disabled":"error.accountDisabled","Login failed":"error.loginFailed","Registration failed":"error.registrationFailed","Email already registered":"error.emailInUse","Too many requests":"error.tooManyAttempts"};function xe(r){return e=>ve[e]?.[r]??ve[e]?.en??e}function Z(r,e){let t=je[r];return t?e(t):r}var we=["classic","minimal","soft","glass","brutal","terminal","paper"],ye="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",ke={radius:"16px",radiusCtl:"10px",btnRadius:"10px",font:ye,titleFont:"inherit",titleWeight:"700",titleAlign:"center",titlePad:"0",titleTransform:"none",titleSpacing:"-0.3px",labelTransform:"none",shadow:"0 24px 64px rgba(0,0,0,0.35)",cardBorder:"0 solid transparent",ctlBorderW:"1.5px",btnBorder:"0 solid transparent",btnShadow:"none",backdrop:"rgba(0,0,0,0.5)",backdropFilter:"none",cardFilter:"none"},V={errorBg:"#fef2f2",errorColor:"#dc2626",errorBorder:"#fecaca",successBg:"#ecfdf5",successColor:"#059669",successBorder:"#a7f3d0"},q={errorBg:"#3b1c1c",errorColor:"#f87171",errorBorder:"#5c2828",successBg:"#12301f",successColor:"#4ade80",successBorder:"#1f5136"},Te={classic:{shape:{},light:{...V,accent:"#2563eb",bg:"#ffffff",text:"#1e293b",subtext:"#64748b",inputBg:"#f8fafc",inputBorder:"#e2e8f0",hoverBg:"#f1f5f9",roleBg:"#f1f5f9",dropdownItemHoverBg:"#f8fafc"},dark:{...q,accent:"#2563eb",bg:"#1e1e2e",text:"#cdd6f4",subtext:"#a6adc8",inputBg:"#313244",inputBorder:"#45475a",hoverBg:"#3b3b50",roleBg:"#313244",dropdownItemHoverBg:"#313244"}},minimal:{shape:{radius:"10px",radiusCtl:"6px",btnRadius:"6px",titleWeight:"600",titleAlign:"left",titlePad:"0 28px 0 0",shadow:"0 8px 30px rgba(0,0,0,0.12)",cardBorder:"1px solid var(--lmu-input-border)",ctlBorderW:"1px",backdrop:"rgba(0,0,0,0.35)"},light:{...V,accent:"#18181b",bg:"#ffffff",text:"#18181b",subtext:"#71717a",inputBg:"#ffffff",inputBorder:"#e4e4e7",hoverBg:"#f4f4f5",roleBg:"#f4f4f5",dropdownItemHoverBg:"#f4f4f5"},dark:{...q,accent:"#fafafa",bg:"#18181b",text:"#fafafa",subtext:"#a1a1aa",inputBg:"#18181b",inputBorder:"#3f3f46",hoverBg:"#27272a",roleBg:"#27272a",dropdownItemHoverBg:"#27272a"}},soft:{shape:{radius:"28px",radiusCtl:"14px",btnRadius:"999px",font:`ui-rounded, 'SF Pro Rounded', 'Nunito', ${ye}`,shadow:"0 30px 80px -20px rgba(80,60,120,0.45)",backdrop:"rgba(40,30,60,0.35)",backdropFilter:"blur(6px)"},light:{...V,accent:"#8b5cf6",bg:"#fffdfa",text:"#3b3247",subtext:"#8a8194",inputBg:"#f6f2fb",inputBorder:"#e9e2f3",hoverBg:"#efe8f8",roleBg:"#f6f2fb",dropdownItemHoverBg:"#f6f2fb"},dark:{...q,accent:"#a78bfa",bg:"#2a2433",text:"#f1ebfa",subtext:"#b3a8c4",inputBg:"#362e42",inputBorder:"#4a4059",hoverBg:"#413750",roleBg:"#362e42",dropdownItemHoverBg:"#362e42"}},glass:{shape:{radius:"20px",radiusCtl:"12px",btnRadius:"12px",ctlBorderW:"1px",shadow:"0 20px 60px rgba(0,0,0,0.3)",backdrop:"rgba(0,0,0,0.25)",backdropFilter:"blur(4px)",cardFilter:"blur(24px) saturate(160%)"},light:{...V,accent:"#2563eb",cardBorder:"1px solid rgba(255,255,255,0.55)",bg:"rgba(255,255,255,0.74)",text:"#0f172a",subtext:"#475569",inputBg:"rgba(255,255,255,0.62)",inputBorder:"rgba(15,23,42,0.14)",hoverBg:"rgba(255,255,255,0.9)",roleBg:"rgba(15,23,42,0.07)",dropdownItemHoverBg:"rgba(15,23,42,0.06)"},dark:{...q,accent:"#60a5fa",cardBorder:"1px solid rgba(255,255,255,0.14)",bg:"rgba(22,24,34,0.66)",text:"#f1f5f9",subtext:"#b6c0d0",inputBg:"rgba(255,255,255,0.08)",inputBorder:"rgba(255,255,255,0.16)",hoverBg:"rgba(255,255,255,0.14)",roleBg:"rgba(255,255,255,0.1)",dropdownItemHoverBg:"rgba(255,255,255,0.1)"}},brutal:{shape:{radius:"0px",radiusCtl:"0px",btnRadius:"0px",titleWeight:"900",titleAlign:"left",titlePad:"0 28px 0 0",titleTransform:"uppercase",titleSpacing:"0.5px",labelTransform:"uppercase",shadow:"8px 8px 0 var(--lmu-text)",cardBorder:"3px solid var(--lmu-text)",ctlBorderW:"2px",btnBorder:"2px solid var(--lmu-text)",btnShadow:"4px 4px 0 var(--lmu-text)",backdrop:"rgba(0,0,0,0.6)"},light:{...V,accent:"#facc15",link:"#111111",bg:"#ffffff",text:"#111111",subtext:"#444444",inputBg:"#ffffff",inputBorder:"#111111",hoverBg:"#fef08a",roleBg:"#fef08a",dropdownItemHoverBg:"#fef08a"},dark:{...q,accent:"#facc15",bg:"#111111",text:"#ffffff",subtext:"#c9c9c9",inputBg:"#111111",inputBorder:"#ffffff",hoverBg:"#333333",roleBg:"#333333",dropdownItemHoverBg:"#333333"}},terminal:{shape:{radius:"6px",radiusCtl:"3px",btnRadius:"3px",font:"ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace",titleWeight:"600",titleAlign:"left",titlePad:"0 28px 0 0",titleSpacing:"0",shadow:"0 20px 60px rgba(0,0,0,0.5)",cardBorder:"1px solid var(--lmu-input-border)",ctlBorderW:"1px",backdrop:"rgba(0,0,0,0.6)"},light:{...V,accent:"#1f8f52",bg:"#f7f8f5",text:"#1c2b21",subtext:"#5d6f63",inputBg:"#ffffff",inputBorder:"#cfd8d0",hoverBg:"#ebefe9",roleBg:"#ebefe9",dropdownItemHoverBg:"#ebefe9"},dark:{...q,accent:"#3ddc84",bg:"#0c0f0d",text:"#d7e2d9",subtext:"#7d9484",inputBg:"#121714",inputBorder:"#26332b",hoverBg:"#1a211c",roleBg:"#1a211c",dropdownItemHoverBg:"#1a211c"}},paper:{shape:{radius:"6px",radiusCtl:"4px",btnRadius:"4px",titleFont:"Georgia, 'Noto Serif TC', 'Songti TC', 'PMingLiU', serif",titleWeight:"600",titleSpacing:"0",shadow:"0 12px 40px rgba(60,40,10,0.22)",cardBorder:"1px solid var(--lmu-input-border)",ctlBorderW:"1px",backdrop:"rgba(40,30,15,0.45)"},light:{...V,accent:"#9a3412",bg:"#fbf7ee",text:"#2b2620",subtext:"#7a6f60",inputBg:"#fffdf7",inputBorder:"#e0d6c2",hoverBg:"#f1eadb",roleBg:"#f1eadb",dropdownItemHoverBg:"#f1eadb"},dark:{...q,accent:"#e08a52",bg:"#24201a",text:"#ece4d4",subtext:"#a89c88",inputBg:"#2e2921",inputBorder:"#4a4234",hoverBg:"#38322a",roleBg:"#38322a",dropdownItemHoverBg:"#38322a"}}};var Le="classic",Se="#ffffff",Ve="#111111",qe=.6;function ze(r){let e=(r??"").trim().toLowerCase();return we.includes(e)?e:Le}function Ke(r){let e=(r??"").trim();return!e||e.length>64?null:/^(#[0-9a-f]{3,8}|[a-z]+|(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([0-9a-z.,%\s/+-]+\))$/i.test(e)?e:null}function Be(r){let e=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(r.trim());if(!e)return null;let t=e[1];return t.length===3?t.split("").map(a=>a+a).join(""):t}function We(r){let e=t=>{let a=parseInt(r.slice(t,t+2),16)/255;return a<=.03928?a/12.92:Math.pow((a+.055)/1.055,2.4)};return .2126*e(0)+.7152*e(2)+.0722*e(4)}function Ye(r){let e=Be(r);return e&&We(e)>qe?Ve:Se}function Ge(r){let e=Be(r);return e?`#${e}22`:`color-mix(in srgb, ${r} 14%, transparent)`}function Je(r,e,t){let a=Te[r],o={...ke,...a.shape,...e?a.dark:a.light},s=Ke(t),i=s||o.accent,n=s||o.link||i;return{...o,accent:i,link:n,onAccent:Ye(i),ring:Ge(i)}}function Me(r){return`--lmu-${r.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}`}function Ze(r){return Object.entries(r).map(([e,t])=>`${Me(e)}: ${t};`).join(`
    `)}function Ee(r,e){for(let[t,a]of Object.entries(e))r.style.setProperty(Me(t),a)}function Xe(){let r=document.documentElement.getAttribute("data-theme");return r==="dark"?!0:r==="light"?!1:document.documentElement.classList.contains("dark")?!0:window.matchMedia("(prefers-color-scheme: dark)").matches}function $e(r){return r==="auto"?Xe():r==="dark"}var te=class{constructor(e,t=Le,a=null){this.activeShadowHosts=new Set;this.themeSetting=e,this.style=t,this.accentOverride=a,this.currentIsDark=$e(e),this.setupAutoTheme()}get isDark(){return this.currentIsDark}get tokens(){return Je(this.style,this.currentIsDark,this.accentOverride)}hostVars(){return Ze(this.tokens)}registerHost(e){this.activeShadowHosts.add(e)}unregisterHost(e){this.activeShadowHosts.delete(e)}applyToHost(e){Ee(e,this.tokens)}updateAllShadowHosts(){let e=this.tokens;for(let t of this.activeShadowHosts)Ee(t,e)}handleThemeChange(){let e=$e(this.themeSetting);e!==this.currentIsDark&&(this.currentIsDark=e,this.updateAllShadowHosts())}setupAutoTheme(){if(this.themeSetting!=="auto")return;new MutationObserver(()=>{this.handleThemeChange()}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.handleThemeChange()})}};var N=class extends Error{constructor(e,t){super(e),this.status=t}};async function H(r,e,t){let a=await fetch(`${r.baseUrl}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),o=await a.json();if(!a.ok){let s=o.error??"";throw new N(Z(s,r.t)||r.t("error.generic"),a.status)}return o.data??o}async function re(r,e,t){let a={};t&&(a.Authorization=`Bearer ${t}`);let o=await fetch(`${r.baseUrl}${e}`,{headers:a}),s=await o.json();if(!o.ok){let i=s.error??"";throw new N(Z(i,r.t)||r.t("error.generic"),o.status)}return s.data??s}async function Ae(r,e,t,a){let o=await fetch(`${r.baseUrl}${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(t)}),s=await o.json();if(!o.ok){let i=s.error??"";throw new N(Z(i,r.t)||r.t("error.generic"),o.status)}return s.data??s}async function Ue(r,e,t,a){let o=await fetch(`${r.baseUrl}${e}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(t)}),s=await o.json();if(!o.ok){let i=s.error??"";throw new N(Z(i,r.t)||r.t("error.generic"),o.status)}return s.data??s}function pe(r){return r instanceof N&&r.status===401}var Qe=900*1e3,et=/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,tt=/^[A-Za-z0-9._-]+$/,ae=class{constructor(e,t){this._currentUser=null;this._ready=!1;this.callbacks=[];this.refreshCallbacks=[];this.refreshTimer=null;this.availableProviders=[];this.requireEmailVerification=!1;this.appId=e,this.apiDeps=t;let a=`lmu_${e}_`;this.accessKey=`${a}access_token`,this.refreshKey=`${a}refresh_token`,this.pendingKey=`${a}signin_pending`,this._readyPromise=new Promise(o=>{this._readyResolve=o})}get currentUser(){return this._currentUser}set currentUser(e){this._currentUser=e}get ready(){return this._ready}whenReady(){return this._readyPromise}getStoredAccessToken(){return localStorage.getItem(this.accessKey)}getStoredRefreshToken(){return localStorage.getItem(this.refreshKey)}storeTokens(e,t){localStorage.setItem(this.accessKey,e),localStorage.setItem(this.refreshKey,t)}clearTokens(){localStorage.removeItem(this.accessKey),localStorage.removeItem(this.refreshKey)}fireCallbacks(e="init"){for(let t of this.callbacks)try{t(this._currentUser,e)}catch{}}onTokenRefresh(e){return this.refreshCallbacks.push(e),()=>{let t=this.refreshCallbacks.indexOf(e);t!==-1&&this.refreshCallbacks.splice(t,1)}}fireRefreshCallbacks(e){for(let t of this.refreshCallbacks)try{t(e)}catch{}}onAuthChange(e){if(this.callbacks.push(e),this._ready)try{e(this._currentUser,"init")}catch{}return()=>{let t=this.callbacks.indexOf(e);t!==-1&&this.callbacks.splice(t,1)}}parseJwtExp(e){try{let t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),a=Uint8Array.from(atob(t),s=>s.charCodeAt(0)),o=JSON.parse(new TextDecoder().decode(a));return o.exp?o.exp*1e3:null}catch{return null}}scheduleRefresh(){this.refreshTimer&&clearTimeout(this.refreshTimer);let e=this.getStoredAccessToken();if(!e)return;let t=this.parseJwtExp(e);if(!t)return;let a=t-Date.now()-300*1e3;if(a<=0){this.doRefresh();return}this.refreshTimer=setTimeout(()=>this.doRefresh(),a)}async doRefresh(){let e=this.getStoredRefreshToken();if(e)try{let t=await H(this.apiDeps,"/api/auth/refresh",{refreshToken:e});this.storeTokens(t.accessToken,t.refreshToken),this.scheduleRefresh(),this.fireRefreshCallbacks(t.accessToken)}catch(t){pe(t)?(this.clearTokens(),this._currentUser=null,this.fireCallbacks("refresh_failed")):this.refreshTimer=setTimeout(()=>this.doRefresh(),60*1e3)}}cancelRefresh(){this.refreshTimer&&clearTimeout(this.refreshTimer)}async fetchProviders(){if(this.appId)try{let e=await re(this.apiDeps,`/api/auth/providers?app_id=${this.appId}`,"");this.availableProviders=e.providers??[],this.requireEmailVerification=e.requireEmailVerification===!0}catch{this.availableProviders=[],this.requireEmailVerification=!1}}startOAuth(e){this.markSignInStarted();let t=encodeURIComponent(window.location.href);window.location.href=`${this.apiDeps.baseUrl}/api/auth/oauth/${e}?app_id=${this.appId}&redirect=${t}`}markSignInStarted(){try{localStorage.setItem(this.pendingKey,String(Date.now()))}catch{}}consumeSignInStarted(){try{let e=Number(localStorage.getItem(this.pendingKey));return localStorage.removeItem(this.pendingKey),Number.isFinite(e)&&e>0&&Date.now()-e<Qe}catch{return!1}}checkHashTokens(){let e=window.location.hash;if(!e.includes("lmu_token="))return!1;let t=new URLSearchParams(e.slice(1)),a=t.get("lmu_token"),o=t.get("lmu_refresh");return window.history.replaceState(null,"",window.location.pathname+window.location.search),this.consumeSignInStarted()?a&&o&&et.test(a)&&tt.test(o)?(this.storeTokens(a,o),!0):!1:(console.warn("[LetMeUse SDK] Ignored sign-in tokens in the URL: no sign-in was started from this browser."),!1)}async init(){this.checkHashTokens(),await this.fetchProviders();let e=this.getStoredAccessToken();if(!e){this._ready=!0,this._readyResolve(null),this.fireCallbacks("init");return}try{let t=await re(this.apiDeps,"/api/auth/me",e);this._currentUser=t.user,this.scheduleRefresh()}catch(t){let a=this.getStoredRefreshToken();if(a)try{let o=await H(this.apiDeps,"/api/auth/refresh",{refreshToken:a});this.storeTokens(o.accessToken,o.refreshToken);let s=await re(this.apiDeps,"/api/auth/me",o.accessToken);this._currentUser=s.user,this.scheduleRefresh()}catch(o){pe(o)&&this.clearTokens()}else pe(t)&&this.clearTokens()}this._ready=!0,this._readyResolve(this._currentUser),this.fireCallbacks("init")}};function Ie(r){return`
    :host {
      ${r}
      position: fixed !important;
      inset: 0 !important;
      z-index: 99999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: var(--lmu-backdrop) !important;
      -webkit-backdrop-filter: var(--lmu-backdrop-filter);
      backdrop-filter: var(--lmu-backdrop-filter);
      padding: 16px;
      font-family: var(--lmu-font);
      line-height: 1.5;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    .lmu-card {
      background: var(--lmu-bg);
      color: var(--lmu-text);
      border-radius: var(--lmu-radius);
      padding: 36px;
      width: 100%;
      max-width: 400px;
      max-height: calc(100vh - 32px);
      max-height: calc(100dvh - 32px);
      overflow-y: auto;
      position: relative;
      box-shadow: var(--lmu-shadow);
      border: var(--lmu-card-border);
      -webkit-backdrop-filter: var(--lmu-card-filter);
      backdrop-filter: var(--lmu-card-filter);
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
      border-radius: max(0px, calc(var(--lmu-radius-ctl) - 4px));
      line-height: 1;
      transition: background 0.15s;
      padding: 0;
      margin: 0;
    }
    .lmu-close:hover { background: var(--lmu-input-bg); }
    .lmu-title {
      font-family: var(--lmu-title-font);
      font-size: 24px;
      font-weight: var(--lmu-title-weight);
      margin: 0 0 28px 0;
      padding: var(--lmu-title-pad);
      text-align: var(--lmu-title-align);
      text-transform: var(--lmu-title-transform);
      letter-spacing: var(--lmu-title-spacing);
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
      text-transform: var(--lmu-label-transform);
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
      color: var(--lmu-link);
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
      accent-color: var(--lmu-accent);
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
      border: var(--lmu-ctl-border-w) solid var(--lmu-input-border);
      border-radius: var(--lmu-radius-ctl);
      font-size: 15px;
      font-family: inherit;
      line-height: 44px;
      background: var(--lmu-input-bg);
      color: var(--lmu-text);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .lmu-input:focus {
      border-color: var(--lmu-accent);
      box-shadow: 0 0 0 3px var(--lmu-ring);
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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 48px;
      padding: 0;
      margin: 12px 0 0 0;
      border: var(--lmu-btn-border);
      border-radius: var(--lmu-btn-radius);
      box-shadow: var(--lmu-btn-shadow);
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
      line-height: 1;
      text-align: center;
      cursor: pointer;
      background: var(--lmu-accent);
      color: var(--lmu-on-accent);
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
      color: var(--lmu-link);
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
      border-radius: var(--lmu-radius-ctl);
      font-size: 13px;
      border: 1px solid var(--lmu-error-border);
    }
    .lmu-success {
      background: var(--lmu-success-bg);
      color: var(--lmu-success-color);
      padding: 11px 14px;
      margin: 0 0 18px 0;
      border-radius: var(--lmu-radius-ctl);
      font-size: 13px;
      border: 1px solid var(--lmu-success-border);
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
      border: var(--lmu-ctl-border-w) solid var(--lmu-input-border);
      border-radius: var(--lmu-radius-ctl);
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
      border-color: var(--lmu-accent);
      background: var(--lmu-hover-bg);
    }
    .lmu-oauth-btn svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    @media (max-width: 480px), (max-height: 600px) {
      .lmu-card { max-width: 340px; padding: 24px 20px 20px; }
      .lmu-close { top: 8px; right: 8px; }
      .lmu-title { font-size: 19px; margin: 0 0 16px 0; }
      .lmu-field { margin: 0 0 12px 0; }
      .lmu-label { font-size: 12px; margin: 0 0 5px 0; }
      .lmu-label-row { margin: 0 0 5px 0; }
      .lmu-label-row .lmu-label { margin: 0; }
      /* 16px: anything smaller makes iOS Safari zoom the whole page on focus */
      .lmu-input { height: 42px; line-height: 42px; padding: 0 12px; font-size: 16px; }
      .lmu-input-wrap .lmu-input { padding-right: 42px; }
      .lmu-eye-btn { width: 42px; height: 42px; }
      .lmu-remember { margin: 0 0 10px 0; }
      .lmu-terms { margin: 0 0 10px 0; }
      .lmu-btn { height: 44px; margin: 8px 0 0 0; }
      .lmu-divider { margin: 14px 0 12px 0; }
      .lmu-oauth-btn { height: 42px; padding: 0 10px; font-size: 13px; }
      .lmu-switch { margin: 14px 0 0 0; }
      .lmu-error, .lmu-success { padding: 9px 12px; margin: 0 0 12px 0; }
    }
  `}function Pe(r){return`
    :host {
      ${r}
      position: fixed !important;
      inset: 0 !important;
      z-index: 99999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: var(--lmu-backdrop) !important;
      -webkit-backdrop-filter: var(--lmu-backdrop-filter);
      backdrop-filter: var(--lmu-backdrop-filter);
      padding: 16px;
      font-family: var(--lmu-font);
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-card {
      background: var(--lmu-bg);
      color: var(--lmu-text);
      border-radius: var(--lmu-radius);
      padding: 36px;
      width: 100%;
      max-width: 420px;
      position: relative;
      box-shadow: var(--lmu-shadow);
      border: var(--lmu-card-border);
      -webkit-backdrop-filter: var(--lmu-card-filter);
      backdrop-filter: var(--lmu-card-filter);
      max-height: calc(100vh - 32px);
      max-height: calc(100dvh - 32px);
      overflow-y: auto;
    }
    .lmu-close {
      position: absolute; top: 14px; right: 14px;
      background: none; border: none; font-size: 22px; cursor: pointer;
      color: var(--lmu-subtext); width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      border-radius: max(0px, calc(var(--lmu-radius-ctl) - 4px)); transition: background 0.15s; padding: 0; margin: 0;
    }
    .lmu-close:hover { background: var(--lmu-input-bg); }
    .lmu-title {
      font-family: var(--lmu-title-font);
      font-size: 22px; font-weight: var(--lmu-title-weight); margin: 0 0 24px 0;
      padding: var(--lmu-title-pad);
      text-align: var(--lmu-title-align); text-transform: var(--lmu-title-transform);
      letter-spacing: var(--lmu-title-spacing);
    }
    .lmu-avatar-area {
      display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
    }
    .lmu-avatar-circle {
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--lmu-accent); color: var(--lmu-on-accent); display: flex;
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
    .lmu-badge-verified { background: var(--lmu-success-bg); color: var(--lmu-success-color); }
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
      border: var(--lmu-ctl-border-w) solid var(--lmu-input-border); border-radius: var(--lmu-radius-ctl);
      font-size: 14px; font-family: inherit; background: var(--lmu-input-bg);
      color: var(--lmu-text); outline: none; transition: border-color 0.2s;
    }
    .lmu-input:focus { border-color: var(--lmu-accent); box-shadow: 0 0 0 3px var(--lmu-ring); }
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
      height: 38px; padding: 0 16px; border-radius: max(0px, calc(var(--lmu-radius-ctl) - 2px));
      font-size: 13px; font-weight: 600; font-family: inherit;
      cursor: pointer; border: none; transition: opacity 0.15s;
    }
    .lmu-btn-primary {
      background: var(--lmu-accent); color: var(--lmu-on-accent);
      border: var(--lmu-btn-border);
    }
    .lmu-btn-primary:hover { opacity: 0.9; }
    .lmu-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .lmu-btn-secondary {
      background: var(--lmu-input-bg); color: var(--lmu-text);
      border: 1px solid var(--lmu-input-border);
    }
    .lmu-btn-secondary:hover { background: var(--lmu-hover-bg); }
    .lmu-btn-danger {
      width: 100%; height: 42px; border-radius: var(--lmu-radius-ctl);
      font-size: 14px; font-weight: 600; font-family: inherit;
      cursor: pointer; border: var(--lmu-ctl-border-w) solid var(--lmu-error-border);
      background: none; color: var(--lmu-error-color); transition: background 0.15s;
    }
    .lmu-btn-danger:hover { background: var(--lmu-error-bg); }
    .lmu-success {
      background: var(--lmu-success-bg); color: var(--lmu-success-color); padding: 8px 12px;
      border-radius: max(0px, calc(var(--lmu-radius-ctl) - 2px)); font-size: 13px; margin-bottom: 14px;
      border: 1px solid var(--lmu-success-border);
    }
    .lmu-error {
      background: var(--lmu-error-bg); color: var(--lmu-error-color);
      padding: 8px 12px; border-radius: max(0px, calc(var(--lmu-radius-ctl) - 2px)); font-size: 13px;
      margin-bottom: 14px; border: 1px solid var(--lmu-error-border);
    }
    @media (max-width: 480px), (max-height: 600px) {
      .lmu-card { max-width: 340px; padding: 24px 20px 20px; }
      .lmu-close { top: 8px; right: 8px; }
      .lmu-title { font-size: 19px; margin: 0 0 16px 0; }
      .lmu-avatar-area { gap: 12px; margin-bottom: 16px; }
      .lmu-avatar-circle { width: 48px; height: 48px; font-size: 20px; }
      .lmu-avatar-name { font-size: 16px; }
      .lmu-section { padding-top: 14px; margin-top: 14px; }
      .lmu-section-title { margin: 0 0 10px 0; }
      .lmu-field { margin: 0 0 10px 0; }
      /* 16px: anything smaller makes iOS Safari zoom the whole page on focus */
      .lmu-input { height: 40px; font-size: 16px; }
      .lmu-input-wrap .lmu-input { padding-right: 40px; }
      .lmu-eye-btn { width: 40px; height: 40px; }
    }
  `}function Ce(r){return`
    :host {
      ${r}
      display: block;
      font-family: var(--lmu-font);
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-profile-card {
      background: var(--lmu-bg);
      color: var(--lmu-text);
      border-radius: max(0px, calc(var(--lmu-radius) - 4px));
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
      background: var(--lmu-accent);
      color: var(--lmu-on-accent);
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
      border-radius: max(0px, calc(var(--lmu-radius-ctl) - 2px));
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
      border-color: var(--lmu-accent);
      background: var(--lmu-hover-bg);
    }
    .lmu-profile-btn.primary {
      background: var(--lmu-accent);
      color: var(--lmu-on-accent);
      border-color: var(--lmu-accent);
    }
    .lmu-profile-btn.primary:hover { opacity: 0.9; }
    .lmu-profile-login {
      text-align: center;
      padding: 8px 0;
    }
    .lmu-profile-login a {
      color: var(--lmu-link);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .lmu-profile-login a:hover { text-decoration: underline; }
  `}function De(r){return`
    :host {
      ${r}
      display: inline-block;
      position: relative;
      font-family: var(--lmu-font);
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-avatar-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--lmu-input-border);
      background: var(--lmu-accent);
      color: var(--lmu-on-accent);
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
      border-color: var(--lmu-accent);
      box-shadow: 0 0 0 2px var(--lmu-ring);
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
    .lmu-avatar-login:hover { border-color: var(--lmu-accent); color: var(--lmu-link); }
    .lmu-avatar-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: var(--lmu-bg);
      border: 1px solid var(--lmu-input-border);
      border-radius: var(--lmu-radius-ctl);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      min-width: 200px;
      z-index: 99999;
      overflow: hidden;
      -webkit-backdrop-filter: var(--lmu-card-filter);
      backdrop-filter: var(--lmu-card-filter);
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
  `}var Y='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',G='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';var rt={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"};function p(r){return r==null?"":String(r).replace(/[&<>"'`]/g,e=>rt[e])}var at=/^\/uploads\/[A-Za-z0-9._\-/]+$/;function X(r,e){let t=(r??"").trim();if(!t)return"";if(at.test(t)&&!t.includes(".."))return`${e}${t}`;try{let a=new URL(t);return a.protocol==="https:"?a.toString():""}catch{return""}}function _(r,e){let{appId:t,auth:a,theme:o,apiDeps:s,t:i}=r,n=document.getElementById("lmu-auth-host");n&&(o.unregisterHost(n),n.remove());let M=e,b="",k="",f=!1,l=!1,g="",w="",T="",E=!1,L=`lmu_${t}_remembered_email`;try{let d=localStorage.getItem(L);d&&(g=d,E=!0)}catch{}let y=p,v=document.createElement("div");v.id="lmu-auth-host",v.style.cssText="position:fixed;inset:0;z-index:99999;";let m=v.attachShadow({mode:"closed"});o.registerHost(v);let F=Ie(o.hostVars());function P(){o.unregisterHost(v),v.remove()}m.addEventListener("click",d=>{let R=m.querySelector(".lmu-card");R&&!R.contains(d.target)&&m.contains(d.target)&&P()});function S(){let d=M==="login";if(M==="forgot"){m.innerHTML=`
          <style>${F}</style>
          <div class="lmu-card">
            <button class="lmu-close" id="lmu-close-btn">&times;</button>
            <div class="lmu-title">${i("forgot.title")}</div>
            ${k?`<div class="lmu-success">${p(k)}</div>`:""}
            ${b?`<div class="lmu-error">${p(b)}</div>`:""}
            ${k?"":`
              <p style="font-size:14px;color:var(--lmu-subtext);margin:0 0 18px 0;text-align:center;">${i("forgot.description")}</p>
              <form id="lmu-forgot-form">
                <div class="lmu-field">
                  <label class="lmu-label">${i("label.email")}</label>
                  <input class="lmu-input" type="email" name="email" value="${y(g)}" required />
                </div>
                <button class="lmu-btn" type="submit" ${f?"disabled":""}>
                  ${i(f?"msg.loading":"forgot.send")}
                </button>
              </form>
            `}
            <div class="lmu-switch">
              <a id="lmu-back-login">${i("forgot.backToLogin")}</a>
            </div>
          </div>
        `,o.applyToHost(v),m.getElementById("lmu-close-btn")?.addEventListener("click",()=>P()),m.getElementById("lmu-back-login")?.addEventListener("click",()=>{M="login",b="",k="",S()});let u=m.getElementById("lmu-forgot-form");u?.addEventListener("submit",async z=>{z.preventDefault();let c=new FormData(u).get("email");g=c,f=!0,b="",S();try{await H(s,"/api/auth/forgot-password",{appId:t,email:c}),f=!1,k=i("forgot.sent"),S()}catch(h){b=h instanceof Error?h.message:i("error.generic"),f=!1,S()}});return}m.innerHTML=`
        <style>${F}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${i(d?"title.login":"title.register")}</div>
          ${b?`<div class="lmu-error">${p(b)}</div>`:""}
          <form id="lmu-auth-form">
            ${d?"":`
              <div class="lmu-field">
                <label class="lmu-label">${i("label.displayName")} <span class="lmu-req">*</span></label>
                <input class="lmu-input" type="text" name="displayName" placeholder="${i("placeholder.displayName")}" value="${y(T)}" required />
              </div>
            `}
            <div class="lmu-field">
              <label class="lmu-label">${i("label.email")} <span class="lmu-req">*</span></label>
              <input class="lmu-input" type="email" name="email" placeholder="${i("placeholder.email")}" value="${y(g)}" required />
            </div>
            <div class="lmu-field">
              <div class="lmu-label-row">
                <label class="lmu-label">${i("label.password")} <span class="lmu-req">*</span></label>
                ${d?`<a id="lmu-forgot-pw" class="lmu-label-link">${i("link.forgotPassword")}</a>`:""}
              </div>
              <div class="lmu-input-wrap">
                <input class="lmu-input" type="${l?"text":"password"}" name="password" id="lmu-password-input" placeholder="${i(d?"placeholder.password":"placeholder.passwordNew")}" value="${y(w)}" required minlength="${d?1:8}" />
                <button class="lmu-eye-btn" type="button" id="lmu-toggle-password" tabindex="-1" aria-label="${i(l?"password.hide":"password.show")}">
                  ${l?G:Y}
                </button>
              </div>
            </div>
            ${d?`
              <label class="lmu-remember">
                <input type="checkbox" name="remember" ${E?"checked":""} />
                <span>${i("label.rememberMe")}</span>
              </label>
            `:""}
            ${d?"":`<p class="lmu-terms">${i("register.terms")}</p>`}
            <button class="lmu-btn" type="submit" ${f?"disabled":""}>
              ${i(f?"msg.loading":d?"btn.login":"btn.register")}
            </button>
          </form>
          ${a.availableProviders.length>0?`
            <div class="lmu-divider">${i("oauth.or")}</div>
            <div class="lmu-oauth-row">
              ${a.availableProviders.includes("google")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${i("oauth.google")}
                </button>
              `:""}
              ${a.availableProviders.includes("github")?`
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="var(--lmu-text)"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${i("oauth.github")}
                </button>
              `:""}
            </div>
          `:""}
          <div class="lmu-switch">
            <span class="lmu-switch-text">${i(d?"switch.toRegisterPrompt":"switch.toLoginPrompt")}</span>
            <a id="lmu-switch-mode">${i(d?"switch.toRegisterAction":"switch.toLoginAction")}</a>
          </div>
        </div>
      `,o.applyToHost(v),m.getElementById("lmu-close-btn")?.addEventListener("click",()=>P()),m.getElementById("lmu-oauth-google")?.addEventListener("click",()=>a.startOAuth("google")),m.getElementById("lmu-oauth-github")?.addEventListener("click",()=>a.startOAuth("github")),m.getElementById("lmu-forgot-pw")?.addEventListener("click",()=>{M="forgot",b="",k="",S()}),m.getElementById("lmu-toggle-password")?.addEventListener("click",()=>{l=!l;let u=m.getElementById("lmu-password-input"),z=m.getElementById("lmu-toggle-password");u&&(u.type=l?"text":"password"),z&&(z.innerHTML=l?G:Y,z.setAttribute("aria-label",i(l?"password.hide":"password.show")))}),m.getElementById("lmu-switch-mode")?.addEventListener("click",()=>{M=d?"register":"login",b="",S()});let A=m.getElementById("lmu-auth-form");A?.addEventListener("submit",async u=>{if(u.preventDefault(),f)return;let z=new FormData(A),C=z.get("email"),c=z.get("password");if(g=C,w=c,d||(T=z.get("displayName")??""),d&&(E=z.get("remember")!==null),f=!0,b="",S(),!d&&c.length<8){b=i("error.passwordTooShort"),f=!1,S();return}try{if(d){let h=await H(s,"/api/auth/login",{appId:t,email:C,password:c});try{E?localStorage.setItem(L,C):localStorage.removeItem(L)}catch{}a.storeTokens(h.accessToken,h.refreshToken),a.currentUser=h.user,a.scheduleRefresh(),a.fireCallbacks("login"),P()}else{let h=z.get("displayName"),U=await H(s,"/api/auth/register",{appId:t,email:C,password:c,displayName:h});a.storeTokens(U.accessToken,U.refreshToken),a.currentUser=U.user,a.scheduleRefresh(),a.fireCallbacks("login"),P()}}catch(h){b=h instanceof Error?h.message:i("error.generic"),f=!1,S()}})}S(),document.body.appendChild(v),setTimeout(()=>{(g?m.getElementById("lmu-password-input"):m.querySelector("input"))?.focus()},50)}function Q(r){let{appId:e,locale:t,baseUrl:a,auth:o,theme:s,apiDeps:i,t:n,getLoginModalDeps:M,onLogout:b}=r;if(!o.currentUser){_(M(),"login");return}let k=document.getElementById("lmu-profile-host");k&&(s.unregisterHost(k),k.remove());let f=o.getStoredAccessToken();if(!f)return;let l=f,g=!1,w=o.currentUser.displayName,T=!1,E=!1,L=!1,y="",v="",m=!1,F={};function P(h,U){let W=F[h]===!0;return`
        <div class="lmu-input-wrap">
          <input class="lmu-input" type="${W?"text":"password"}" name="${h}" ${U} />
          <button class="lmu-eye-btn" type="button" tabindex="-1" data-pw-toggle="${h}" aria-label="${n(W?"password.hide":"password.show")}">
            ${W?G:Y}
          </button>
        </div>`}let S=!1,d="",R=!1,A=document.createElement("div");A.id="lmu-profile-host",A.style.cssText="position:fixed;inset:0;z-index:99999;";let u=A.attachShadow({mode:"closed"});s.registerHost(A);let z=Pe(s.hostVars());function C(){s.unregisterHost(A),A.remove()}u.addEventListener("click",h=>{let U=u.querySelector(".lmu-card");U&&!U.contains(h.target)&&u.contains(h.target)&&C()});function c(){if(!o.currentUser)return;let h=p(o.currentUser.displayName?.charAt(0)?.toUpperCase()??"?"),U=X(o.currentUser.avatar,a),W=o.currentUser.emailVerified===!0,de=o.requireEmailVerification===!0;u.innerHTML=`
        <style>${z}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close">&times;</button>
          <div class="lmu-title">${n("profile.title")}</div>

          ${d?`<div class="lmu-success" style="margin-bottom:16px;">${p(d)}</div>`:""}

          <div class="lmu-avatar-area">
            <div class="lmu-avatar-circle" id="lmu-avatar-click" title="${n("profile.avatar")}">
              ${U?`<img src="${p(U)}" alt="" />`:h}
              <div class="lmu-avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              ${S?`<div class="lmu-avatar-overlay" style="opacity:1;"><span style="font-size:11px;color:#fff;">${n("profile.avatarUploading")}</span></div>`:""}
            </div>
            <input type="file" id="lmu-avatar-input" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none;" />
            <div class="lmu-avatar-info">
              <p class="lmu-avatar-name">${p(o.currentUser.displayName)}</p>
              <div style="display:flex;align-items:center;gap:8px;margin-top:2px;">
                <p class="lmu-avatar-email" style="margin:0;">${p(o.currentUser.email)}</p>
                ${de?W?`<span class="lmu-badge lmu-badge-verified">${n("profile.emailVerified")}</span>`:`<span class="lmu-badge lmu-badge-unverified">${n("profile.emailNotVerified")}</span>`:""}
              </div>
              ${de&&!W&&!R?`<a id="lmu-resend-verify" style="font-size:11px;color:var(--lmu-link);cursor:pointer;margin-top:4px;display:inline-block;">${n("profile.resendVerification")}</a>`:""}
              ${de&&R?`<span style="font-size:11px;color:#059669;margin-top:4px;display:inline-block;">${n("profile.verificationSent")}</span>`:""}
            </div>
          </div>

          <!-- Display Name Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${n("profile.displayName")}</div>
            ${E?`<div class="lmu-success">${n("profile.saved")}</div>`:""}
            ${g?`
              <div class="lmu-field">
                <input class="lmu-input" type="text" id="lmu-name-input" value="${p(w)}" />
              </div>
              <div class="lmu-row">
                <button class="lmu-btn-sm lmu-btn-primary" id="lmu-name-save" ${T?"disabled":""}>
                  ${n(T?"profile.saving":"profile.save")}
                </button>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-cancel">${t==="zh"?"\u53D6\u6D88":"Cancel"}</button>
              </div>
            `:`
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:15px;">${p(o.currentUser.displayName)}</span>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-edit" style="padding:0 12px;height:32px;font-size:12px;">
                  ${t==="zh"?"\u7DE8\u8F2F":"Edit"}
                </button>
              </div>
            `}
          </div>

          <!-- Change Password Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${n("profile.changePassword")}</div>
            ${v?`<div class="lmu-success">${p(v)}</div>`:""}
            ${y?`<div class="lmu-error">${p(y)}</div>`:""}
            ${L?`
              <form id="lmu-pw-form">
                <div class="lmu-field">
                  <label class="lmu-label">${n("profile.currentPassword")}</label>
                  ${P("currentPassword","required")}
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${n("profile.newPassword")}</label>
                  ${P("newPassword",'required minlength="8"')}
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${n("profile.confirmPassword")}</label>
                  ${P("confirmPassword",'required minlength="8"')}
                </div>
                <div class="lmu-row">
                  <button type="submit" class="lmu-btn-sm lmu-btn-primary" ${m?"disabled":""}>
                    ${n(m?"profile.saving":"profile.save")}
                  </button>
                  <button type="button" class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-cancel">${t==="zh"?"\u53D6\u6D88":"Cancel"}</button>
                </div>
              </form>
            `:`
              <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-show">
                ${t==="zh"?"\u8B8A\u66F4\u5BC6\u78BC":"Change"}
              </button>
            `}
          </div>

          <!-- Logout -->
          <div class="lmu-section">
            <button class="lmu-btn-danger" id="lmu-logout">${n("profile.logout")}</button>
          </div>
        </div>
      `,s.applyToHost(A),u.getElementById("lmu-close")?.addEventListener("click",()=>C());let Fe=u.getElementById("lmu-avatar-click"),ue=u.getElementById("lmu-avatar-input");Fe?.addEventListener("click",()=>ue?.click()),ue?.addEventListener("change",async()=>{let B=ue.files?.[0];if(!(!B||!l)){if(B.size>2*1024*1024){d="",c();return}S=!0,c();try{let $=new FormData;$.append("file",B);let I=await fetch(`${a}/api/auth/avatar`,{method:"POST",headers:{Authorization:`Bearer ${l}`},body:$}),D=await I.json();if(!I.ok)throw new Error(D.error??n("error.generic"));let ee=D.data;ee?.user&&o.currentUser&&(o.currentUser={...o.currentUser,avatar:ee.user.avatar},o.fireCallbacks("login")),S=!1,d=n("profile.avatarUpdated"),c(),setTimeout(()=>{d="",c()},2e3)}catch{S=!1,c()}}}),u.getElementById("lmu-resend-verify")?.addEventListener("click",async()=>{if(l){try{await H(i,"/api/auth/register",{appId:e,resendVerification:!0})}catch{}R=!0,c(),setTimeout(()=>{R=!1},5e3)}}),u.getElementById("lmu-name-edit")?.addEventListener("click",()=>{g=!0,w=o.currentUser?.displayName??"",E=!1,c(),u.getElementById("lmu-name-input")?.focus()}),u.getElementById("lmu-name-cancel")?.addEventListener("click",()=>{g=!1,c()}),u.getElementById("lmu-name-save")?.addEventListener("click",async()=>{let $=u.getElementById("lmu-name-input")?.value?.trim();if(!(!$||!l)){T=!0,c();try{await Ae(i,"/api/auth/profile",{displayName:$},l),o.currentUser&&(o.currentUser={...o.currentUser,displayName:$},o.fireCallbacks("login")),g=!1,E=!0,T=!1,c(),setTimeout(()=>{E=!1,c()},2e3)}catch{T=!1,c()}}}),u.getElementById("lmu-pw-show")?.addEventListener("click",()=>{L=!0,y="",v="",c()}),u.getElementById("lmu-pw-cancel")?.addEventListener("click",()=>{L=!1,y="",c()}),u.querySelectorAll("[data-pw-toggle]").forEach(B=>{B.addEventListener("click",()=>{let $=B.dataset.pwToggle??"",I=F[$]!==!0;F={...F,[$]:I};let D=u.querySelector(`input[name="${$}"]`);D&&(D.type=I?"text":"password"),B.innerHTML=I?G:Y,B.setAttribute("aria-label",n(I?"password.hide":"password.show"))})});let be=u.getElementById("lmu-pw-form");be?.addEventListener("submit",async B=>{B.preventDefault();let $=new FormData(be),I=$.get("currentPassword"),D=$.get("newPassword"),ee=$.get("confirmPassword");if(D!==ee){y=n("profile.passwordMismatch"),c();return}if(D.length<8){y=n("error.passwordTooShort"),c();return}m=!0,y="",c();try{let j=await Ue(i,"/api/auth/change-password",{currentPassword:I,newPassword:D},l);j.accessToken&&j.refreshToken&&(o.storeTokens(j.accessToken,j.refreshToken),o.scheduleRefresh()),L=!1,m=!1,v=n("profile.passwordChanged"),c(),setTimeout(()=>{v="",c()},3e3)}catch(j){y=j instanceof Error?j.message:n("error.generic"),m=!1,c()}}),u.getElementById("lmu-logout")?.addEventListener("click",()=>{C(),b()})}c(),document.body.appendChild(A)}function He(r,e){let{auth:t,theme:a,t:o,baseUrl:s,getLoginModalDeps:i,getProfileModalDeps:n,onLogout:M,onAuthChange:b}=r,k=Ce(a.hostVars()),f=typeof e=="string"?document.querySelector(e):e;if(!f)return()=>{};let l=document.createElement("div");l.className="lmu-profile-card-host";let g=l.attachShadow({mode:"closed"});a.registerHost(l);function w(){if(!t.currentUser){g.innerHTML=`
          <style>${k}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${o("btn.login")}</a>
            </div>
          </div>
        `,a.applyToHost(l),g.getElementById("lmu-pc-login")?.addEventListener("click",()=>{_(i(),"login")});return}let E=p(t.currentUser.displayName?.charAt(0)?.toUpperCase()??"?"),L=X(t.currentUser.avatar,s);g.innerHTML=`
        <style>${k}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${L?`<img src="${p(L)}" alt="" />`:E}
            </div>
            <div class="lmu-profile-info">
              <p class="lmu-profile-name">${p(t.currentUser.displayName)}</p>
              <p class="lmu-profile-email">${p(t.currentUser.email)}</p>
            </div>
          </div>
          <div class="lmu-profile-role">${p(t.currentUser.role)}</div>
          <div class="lmu-profile-actions">
            <button class="lmu-profile-btn primary" id="lmu-pc-edit">Edit Profile</button>
            <button class="lmu-profile-btn" id="lmu-pc-logout">Logout</button>
          </div>
        </div>
      `,a.applyToHost(l),g.getElementById("lmu-pc-logout")?.addEventListener("click",()=>{M()}),g.getElementById("lmu-pc-edit")?.addEventListener("click",()=>{Q(n())})}f.appendChild(l),w();let T=b(()=>w());return()=>{T(),a.unregisterHost(l),l.remove()}}function Re(r,e){let{auth:t,theme:a,t:o,baseUrl:s,getLoginModalDeps:i,getProfileModalDeps:n,onLogout:M,onAuthChange:b}=r,k=De(a.hostVars()),f=typeof e=="string"?document.querySelector(e):e;if(!f)return()=>{};let l=document.createElement("div");l.className="lmu-avatar-host";let g=l.attachShadow({mode:"closed"});a.registerHost(l);let w=!1;function T(){if(!t.currentUser){g.innerHTML=`
          <style>${k}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${p(o("btn.login"))}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `,a.applyToHost(l),g.getElementById("lmu-av-login")?.addEventListener("click",()=>{_(i(),"login")});return}let y=p(t.currentUser.displayName?.charAt(0)?.toUpperCase()??"?"),v=X(t.currentUser.avatar,s);g.innerHTML=`
        <style>${k}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${v?`<img src="${p(v)}" alt="" />`:y}
        </button>
        ${w?`
          <div class="lmu-avatar-dropdown">
            <div class="lmu-avatar-dropdown-header">
              <p class="lmu-avatar-dropdown-name">${p(t.currentUser.displayName)}</p>
              <p class="lmu-avatar-dropdown-email">${p(t.currentUser.email)}</p>
            </div>
            <button class="lmu-avatar-dropdown-item" id="lmu-av-profile">Edit Profile</button>
            <button class="lmu-avatar-dropdown-item danger" id="lmu-av-logout">Logout</button>
          </div>
        `:""}
      `,a.applyToHost(l),g.getElementById("lmu-av-toggle")?.addEventListener("click",()=>{w=!w,T()}),g.getElementById("lmu-av-profile")?.addEventListener("click",()=>{w=!1,T(),Q(n())}),g.getElementById("lmu-av-logout")?.addEventListener("click",()=>{w=!1,M()})}function E(y){w&&!l.contains(y.target)&&(w=!1,T())}document.addEventListener("click",E),f.appendChild(l),T();let L=b(()=>{w=!1,T()});return()=>{L(),a.unregisterHost(l),document.removeEventListener("click",E),l.remove()}}var O=document.currentScript??document.querySelector('script[src*="/letmeuse.js"][data-app-id]'),J=O?.getAttribute("data-app-id")??"",ot=O?.getAttribute("data-theme")??"light",oe=O?.getAttribute("data-style")??null,ge=ze(oe),it=O?.getAttribute("data-accent")??null,se=O?.getAttribute("data-locale")??"en",Ne=O?.getAttribute("data-mode")??"modal",K=O?.src?new URL(O.src).origin:window.location.origin;J||console.warn("[LetMeUse SDK] Missing data-app-id attribute on script tag.");oe&&oe.trim().toLowerCase()!==ge&&console.warn(`[LetMeUse SDK] Unknown data-style "${oe}" \u2014 using "${ge}".`);var le=xe(se),ce=new te(ot,ge,it),fe=ce.tokens.accent,he={baseUrl:K,t:le},x=new ae(J,he);function ie(){return{appId:J,accent:fe,locale:se,auth:x,theme:ce,apiDeps:he,t:le}}function Oe(){return{appId:J,accent:fe,locale:se,baseUrl:K,auth:x,theme:ce,apiDeps:he,t:le,getLoginModalDeps:ie,onLogout:()=>ne.logout()}}function _e(){return{accent:fe,baseUrl:K,locale:se,auth:x,theme:ce,t:le,getLoginModalDeps:ie,getProfileModalDeps:Oe,onLogout:()=>ne.logout(),onAuthChange:r=>ne.onAuthChange(r)}}var me=!1,ne={get ready(){return x.ready},get user(){return x.currentUser},login(){if(Ne==="redirect"){x.markSignInStarted(),window.location.href=`${K}/login?app=${J}&redirect=${encodeURIComponent(window.location.href)}`;return}_(ie(),"login")},register(){if(Ne==="redirect"){x.markSignInStarted(),window.location.href=`${K}/login?app=${J}&redirect=${encodeURIComponent(window.location.href)}&tab=register`;return}_(ie(),"register")},async logout(){if(!me){me=!0;try{let r=x.getStoredAccessToken();if(r)try{await fetch(`${K}/api/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${r}`}})}catch{}x.clearTokens(),x.currentUser=null,x.cancelRefresh(),x.fireCallbacks("logout")}finally{me=!1}}},getToken(){return x.getStoredAccessToken()},whenReady(){return x.whenReady()},onAuthChange(r){return x.onAuthChange(r)},onTokenRefresh(r){return x.onTokenRefresh(r)},openAdmin(){window.open(`${K}/admin`,"_blank")},openProfile(){Q(Oe())},renderProfileCard(r){return He(_e(),r)},renderAvatar(r){return Re(_e(),r)}};window.letmeuse=ne;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>x.init()):x.init();})();
