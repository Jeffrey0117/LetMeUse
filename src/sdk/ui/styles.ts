/**
 * CSS string generation for SDK UI components.
 * All styles use CSS custom properties (--lmu-*) set on the shadow host.
 */

/** Build the modal overlay + card styles (login/register/forgot) */
export function buildModalStyles(hostThemeVars: string): string {
  return `
    :host {
      ${hostThemeVars}
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
  `
}

/** Build the profile modal styles */
export function buildProfileModalStyles(hostThemeVars: string): string {
  return `
    :host {
      ${hostThemeVars}
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
  `
}

/** Build the profile card widget styles */
export function buildProfileCardStyles(hostThemeVars: string): string {
  return `
    :host {
      ${hostThemeVars}
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
  `
}

/** Build the avatar button + dropdown styles */
export function buildAvatarStyles(hostThemeVars: string): string {
  return `
    :host {
      ${hostThemeVars}
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
  `
}
