import React, { useState } from "react";
import {
  X,
  Zap,
  CreditCard,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  Smartphone,
  Lock,
  Building,
  Sparkles,
  Info,
} from "lucide-react";
import { SavedQuickPayMethod } from "../../types";
import { QuickPayService } from "../../services/QuickPayService";

interface QuickPayManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndClose?: (method: SavedQuickPayMethod) => void;
}

export function QuickPayManagerModal({
  isOpen,
  onClose,
  onSelectAndClose,
}: QuickPayManagerModalProps) {
  const [methods, setMethods] = useState<SavedQuickPayMethod[]>(
    QuickPayService.getSavedMethods()
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newType, setNewType] = useState<"upi" | "card" | "wallet">("upi");

  // Form states for new method
  const [newUpiId, setNewUpiId] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardBank, setNewCardBank] = useState("HDFC Bank");
  const [setAsDefault, setSetAsDefault] = useState(true);

  if (!isOpen) return null;

  const handleSelectDefault = (id: string) => {
    const updated = QuickPayService.setPreferredMethod(id);
    setMethods(QuickPayService.getSavedMethods());
    if (updated && onSelectAndClose) {
      onSelectAndClose(updated);
    }
  };

  const handleDeleteMethod = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    QuickPayService.removeMethod(id);
    setMethods(QuickPayService.getSavedMethods());
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newType === "upi") {
      if (!newUpiId.includes("@")) {
        alert("Please enter a valid UPI ID (e.g., yourname@okhdfcbank)");
        return;
      }
      QuickPayService.saveNewMethod({
        type: "upi",
        title: `${newUpiId.split("@")[1].toUpperCase()} UPI 1-Click`,
        detail: newUpiId,
        iconName: "upi",
        isDefault: setAsDefault,
        upiId: newUpiId,
      });
    } else if (newType === "card") {
      const cleanNum = newCardNumber.replace(/\s+/g, "");
      if (cleanNum.length < 15) {
        alert("Please enter a valid 16-digit card number");
        return;
      }
      const last4 = cleanNum.slice(-4);
      QuickPayService.saveNewMethod({
        type: "card",
        title: `${newCardBank} Saved Card`,
        detail: `•••• ${last4} • Exp ${newCardExpiry || "12/28"} • Tokenized`,
        iconName: "card",
        isDefault: setAsDefault,
        cardLast4: last4,
        cardExpiry: newCardExpiry || "12/28",
        cardNetwork: cleanNum.startsWith("4") ? "visa" : cleanNum.startsWith("5") ? "mastercard" : "rupay",
        bankName: newCardBank,
      });
    }

    setMethods(QuickPayService.getSavedMethods());
    setIsAddingNew(false);
    setNewUpiId("");
    setNewCardNumber("");
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "upi":
        return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case "wallet":
        return <Wallet className="w-5 h-5 text-emerald-600" />;
      case "card":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      default:
        return <Building className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2 text-white">
                Quick Pay™ Preference Manager
              </h3>
              <p className="text-xs text-slate-300">
                1-Click Instant Booking Authorization (RBI Tokenized)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick Pay Info Badge */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">What is Quick Pay?</strong>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                When you click <strong>Quick Pay</strong> on any checkout, your selected default instrument is charged instantly without re-entering details or waiting in payment queues.
              </p>
            </div>
          </div>

          {!isAddingNew ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Saved Instruments ({methods.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Method</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {methods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handleSelectDefault(method.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      method.isDefault
                        ? "border-amber-500 bg-amber-50/40 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        {getMethodIcon(method.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{method.title}</h4>
                          {method.isDefault && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                              <Zap className="w-3 h-3 fill-slate-950" />
                              Active Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{method.detail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {method.isDefault ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDefault(method.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-[11px] font-bold border border-slate-200 transition-colors"
                        >
                          Make Default
                        </button>
                      )}

                      {methods.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteMethod(e, method.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove saved method"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Add New Method Form */
            <form onSubmit={handleAddNew} className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>Add New Payment Instrument</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Instrument Type Tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewType("upi")}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 border transition-all ${
                    newType === "upi"
                      ? "bg-white text-indigo-700 border-indigo-500 shadow-2xs"
                      : "bg-white/60 text-slate-600 border-slate-200"
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>UPI VPA ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewType("card")}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 border transition-all ${
                    newType === "card"
                      ? "bg-white text-indigo-700 border-indigo-500 shadow-2xs"
                      : "bg-white/60 text-slate-600 border-slate-200"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Saved Card</span>
                </button>
              </div>

              {newType === "upi" ? (
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-bold block">UPI Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={newUpiId}
                    onChange={(e) => setNewUpiId(e.target.value.toLowerCase())}
                    placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Supported: GPay, PhonePe, Paytm, BHIM, Cred, Amazon Pay
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">Card Number (16 Digits)</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={newCardNumber}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-600 font-bold block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 font-bold block mb-1">Bank Name</label>
                      <select
                        value={newCardBank}
                        onChange={(e) => setNewCardBank(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">SBI</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra">Kotak Mahindra</option>
                        <option value="RuPay National">RuPay Card</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="set-as-default-checkbox"
                  checked={setAsDefault}
                  onChange={(e) => setSetAsDefault(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="set-as-default-checkbox" className="text-xs text-slate-700 font-bold cursor-pointer">
                  Set as default for 1-Click Quick Pay
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Save Instrument</span>
              </button>
            </form>
          )}

          {/* Security Assurance */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>RBI Guidelines Compliant • Encrypted Tokens</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">ISO 27001 Certified</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
