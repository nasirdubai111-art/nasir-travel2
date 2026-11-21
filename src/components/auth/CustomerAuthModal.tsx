import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";

export type AuthModalMode =
  | "login"
  | "register"
  | "verify-email"
  | "forgot-password"
  | "reset-password";

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthModalMode;
  onSuccess?: () => void;
}

export function CustomerAuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
}: CustomerAuthModalProps) {
  const {
    login,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    loading,
  } = useAuthContext();

  const [mode, setMode] = useState<AuthModalMode>(initialMode);

  // Registration Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Verification & Reset State
  const [otpToken, setOtpToken] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});
  }, [initialMode, isOpen]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Password strength calculator
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const passwordScore = calculatePasswordStrength(password);

  // 1. Handle Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name (minimum 2 characters).";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    const cleanPhone = mobileNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      errors.mobileNumber = "Please enter a valid 10-digit mobile number.";
    }
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!agreeToTerms) {
      errors.agreeToTerms = "You must agree to the Terms & Privacy Policy.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const res = await register({
      fullName,
      email,
      password,
      mobileNumber: cleanPhone,
      countryCode,
      agreeToTerms,
    });

    if (res.success) {
      setVerificationEmail(email);
      if (res.requiresVerification) {
        setSuccessMessage("Account created! Please check your email for the verification code.");
        setMode("verify-email");
        setResendCooldown(60);
      } else {
        setSuccessMessage("Registration successful! Welcome to BharatYatra.");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      }
    } else {
      setErrorMessage(res.error || "Registration failed. Please check your credentials.");
    }
  };

  // 2. Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const errors: Record<string, string> = {};

    if (!loginEmail.trim()) {
      errors.loginEmail = "Email address is required.";
    }
    if (!loginPassword) {
      errors.loginPassword = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const res = await login({
      email: loginEmail,
      password: loginPassword,
      rememberMe,
    });

    if (res.success) {
      setSuccessMessage("Signed in successfully! Welcome back.");
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 800);
    } else {
      setErrorMessage(res.error || "Authentication failed. Invalid email or password.");
      if (res.error?.includes("not confirmed") || res.error?.includes("verification")) {
        setVerificationEmail(loginEmail);
        setTimeout(() => setMode("verify-email"), 2000);
      }
    }
  };

  // 3. Handle Verify Email OTP
  const handleVerifyEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!otpToken.trim() || otpToken.trim().length < 6) {
      setErrorMessage("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    const res = await verifyEmail({
      email: verificationEmail || email || loginEmail,
      token: otpToken.trim(),
    });

    if (res.success) {
      setSuccessMessage("Email verified successfully! You are now fully authenticated.");
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1200);
    } else {
      setErrorMessage(res.error || "Verification code is invalid or has expired.");
    }
  };

  // 4. Handle Resend Verification
  const handleResendVerification = async () => {
    const targetEmail = verificationEmail || email || loginEmail;
    if (!targetEmail) {
      setErrorMessage("Please specify your registered email address.");
      return;
    }

    const res = await resendVerification(targetEmail);
    if (res.success) {
      setSuccessMessage("A fresh verification code has been dispatched to your inbox.");
      setResendCooldown(60);
    } else {
      setErrorMessage(res.error || "Failed to resend verification email.");
    }
  };

  // 5. Handle Forgot Password
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() && !loginEmail.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    const targetEmail = email.trim() || loginEmail.trim();
    const res = await forgotPassword(targetEmail);

    if (res.success) {
      setSuccessMessage(
        `Password reset instructions have been sent to ${targetEmail}. Please check your inbox.`
      );
    } else {
      setErrorMessage(res.error || "Unable to send password reset instructions.");
    }
  };

  // 6. Handle Reset Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const res = await resetPassword(newPassword);
    if (res.success) {
      setSuccessMessage("Password reset successfully! Please sign in with your new password.");
      setTimeout(() => setMode("login"), 1500);
    } else {
      setErrorMessage(res.error || "Failed to reset password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF9F5] w-full max-w-md rounded-2xl shadow-2xl border border-[#E8E5DD] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-[#1B4332] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] text-[#E9C46A] flex items-center justify-center font-black text-sm shadow-sm">
              BY
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">BharatYatra Account</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#E9C46A] text-[#1B4332] text-[9px] font-black uppercase">
                  SUPABASE AUTH
                </span>
              </div>
              <p className="text-[11px] text-[#A3B18A]">
                {mode === "login" && "Sign in to access bookings, wallet & tickets"}
                {mode === "register" && "Create your traveler account with Supabase"}
                {mode === "verify-email" && "Verify your registered email address"}
                {mode === "forgot-password" && "Recover your account credentials"}
                {mode === "reset-password" && "Set a new secure password"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs (Only for login and register) */}
        {(mode === "login" || mode === "register") && (
          <div className="flex border-b border-[#E8E5DD] bg-white text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
                setFieldErrors({});
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                mode === "login"
                  ? "border-[#1B4332] text-[#1B4332] bg-[#FAF9F5]"
                  : "border-transparent text-gray-500 hover:text-[#1B4332]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
                setFieldErrors({});
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                mode === "register"
                  ? "border-[#1B4332] text-[#1B4332] bg-[#FAF9F5]"
                  : "border-transparent text-gray-500 hover:text-[#1B4332]"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Notification Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{successMessage}</div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 1. SIGN IN (LOGIN) FORM */}
          {/* =============================================================== */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="traveler@bharatyatra.in"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] ${
                      fieldErrors.loginEmail ? "border-rose-400 bg-rose-50/20" : "border-[#E8E5DD]"
                    }`}
                  />
                </div>
                {fieldErrors.loginEmail && (
                  <span className="text-[10px] text-rose-600 mt-1 block font-semibold">
                    {fieldErrors.loginEmail}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-gray-700 uppercase">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot-password");
                      setErrorMessage(null);
                    }}
                    className="text-[11px] text-[#2D6A4F] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full pl-9 pr-10 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] ${
                      fieldErrors.loginPassword ? "border-rose-400 bg-rose-50/20" : "border-[#E8E5DD]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.loginPassword && (
                  <span className="text-[10px] text-rose-600 mt-1 block font-semibold">
                    {fieldErrors.loginPassword}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#1B4332] focus:ring-[#1B4332]"
                  />
                  <span className="text-gray-600 font-medium">Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in with Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-gray-500">
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-bold text-[#1B4332] hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* =============================================================== */}
          {/* 2. REGISTRATION (SIGN UP) FORM */}
          {/* =============================================================== */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aditya Sharma"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] ${
                      fieldErrors.fullName ? "border-rose-400 bg-rose-50/20" : "border-[#E8E5DD]"
                    }`}
                  />
                </div>
                {fieldErrors.fullName && (
                  <span className="text-[10px] text-rose-600 mt-1 block font-semibold">
                    {fieldErrors.fullName}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditya.sharma@example.com"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] ${
                      fieldErrors.email ? "border-rose-400 bg-rose-50/20" : "border-[#E8E5DD]"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <span className="text-[10px] text-rose-600 mt-1 block font-semibold">
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="w-20 shrink-0">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full py-2 px-2 bg-white border border-[#E8E5DD] rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-[#1B4332]"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] ${
                        fieldErrors.mobileNumber ? "border-rose-400 bg-rose-50/20" : "border-[#E8E5DD]"
                      }`}
                    />
                  </div>
                </div>
                {fieldErrors.mobileNumber && (
                  <span className="text-[10px] text-rose-600 mt-1 block font-semibold">
                    {fieldErrors.mobileNumber}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters with numbers & symbols"
                    className={`w-full pl-9 pr-10 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] ${
                      fieldErrors.password ? "border-rose-400 bg-rose-50/20" : "border-[#E8E5DD]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex gap-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordScore <= 1
                            ? "w-1/4 bg-rose-500"
                            : passwordScore === 2
                            ? "w-2/4 bg-amber-500"
                            : passwordScore === 3
                            ? "w-3/4 bg-blue-500"
                            : "w-full bg-emerald-500"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">
                      Strength:{" "}
                      <span className="font-bold">
                        {passwordScore <= 1 && "Weak"}
                        {passwordScore === 2 && "Fair"}
                        {passwordScore === 3 && "Good"}
                        {passwordScore === 4 && "Strong"}
                      </span>
                    </span>
                  </div>
                )}
                {fieldErrors.password && (
                  <span className="text-[10px] text-rose-600 mt-1 block font-semibold">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] ${
                      fieldErrors.confirmPassword ? "border-rose-400 bg-rose-50/20" : "border-[#E8E5DD]"
                    }`}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="text-[10px] text-rose-600 mt-1 block font-semibold">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#1B4332] focus:ring-[#1B4332]"
                  />
                  <span className="text-[11px] text-gray-600 leading-tight">
                    I agree to the BharatYatra{" "}
                    <span className="text-[#1B4332] font-semibold underline">Terms of Service</span>,{" "}
                    <span className="text-[#1B4332] font-semibold underline">Privacy Policy</span>, and
                    receiving booking updates on WhatsApp.
                  </span>
                </label>
                {fieldErrors.agreeToTerms && (
                  <span className="text-[10px] text-rose-600 mt-1 block font-semibold">
                    {fieldErrors.agreeToTerms}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Registering with Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
                  </>
                )}
              </button>

              <div className="pt-1 text-center text-gray-500">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-bold text-[#1B4332] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* =============================================================== */}
          {/* 3. EMAIL VERIFICATION SCREEN */}
          {/* =============================================================== */}
          {mode === "verify-email" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-[#1B4332]">Verify Your Email Address</h4>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  We've sent a 6-digit confirmation code and link to:
                  <br />
                  <strong className="text-gray-900 font-mono">
                    {verificationEmail || email || loginEmail}
                  </strong>
                </p>
              </div>

              <form onSubmit={handleVerifyEmailSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1 text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full py-2.5 text-center text-lg font-mono font-bold tracking-widest bg-white border border-[#E8E5DD] rounded-xl text-gray-900 focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying with Supabase...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Activate Account</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center space-y-2 border-t border-[#E8E5DD]">
                <div className="text-[11px] text-gray-500">
                  Didn't receive the verification email?
                </div>
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResendVerification}
                  className="text-xs font-bold text-[#2D6A4F] hover:underline disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : "Resend Verification Email"}
                </button>

                <div>
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[11px] text-gray-500 hover:text-gray-700 hover:underline cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 4. FORGOT PASSWORD SCREEN */}
          {/* =============================================================== */}
          {mode === "forgot-password" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-[#1B4332]">Reset Your Password</h4>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Enter your registered email address and we'll send a password recovery link.
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="email"
                      value={email || loginEmail}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setLoginEmail(e.target.value);
                      }}
                      placeholder="traveler@bharatyatra.in"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8E5DD] rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending reset instructions...</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center border-t border-[#E8E5DD]">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[11px] text-gray-500 hover:text-gray-700 hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 5. PASSWORD RESET SCREEN */}
          {/* =============================================================== */}
          {mode === "reset-password" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-[#1B4332]">Enter New Password</h4>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Choose a new strong password for your BharatYatra account.
                </p>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 bg-white border border-[#E8E5DD] rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-white border border-[#E8E5DD] rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#1B4332]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Security Footer Notice */}
        <div className="px-6 py-3 bg-[#F4F1EA] border-t border-[#E8E5DD] flex items-center justify-between text-[10px] text-gray-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>256-Bit Encrypted Session</span>
          </div>
          <span>RLS Enforced Multi-Tenant</span>
        </div>
      </div>
    </div>
  );
}

export default CustomerAuthModal;
