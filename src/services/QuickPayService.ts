import { SavedQuickPayMethod, RazorpayPaymentResult } from "../types";

const LOCAL_STORAGE_KEY = "bharatyatra_saved_quickpay_methods";
const DEFAULT_METHOD_KEY = "bharatyatra_default_quickpay_id";

export const DEFAULT_SAVED_METHODS: SavedQuickPayMethod[] = [
  {
    id: "qp-upi-1",
    type: "upi",
    title: "Google Pay UPI (Instant Autopay)",
    detail: "aditya@okhdfcbank",
    iconName: "upi",
    isDefault: true,
    upiId: "aditya@okhdfcbank",
    lastUsedAt: "Just now",
  },
  {
    id: "qp-wallet-1",
    type: "wallet",
    title: "BharatYatra Cash Wallet",
    detail: "₹2,450 Available • Zero OTP",
    iconName: "wallet",
    isDefault: false,
    lastUsedAt: "Yesterday",
  },
  {
    id: "qp-card-1",
    type: "card",
    title: "HDFC Regalia RuPay Credit Card",
    detail: "•••• 4821 • Exp 08/29 • RBI Tokenized",
    iconName: "card",
    isDefault: false,
    cardLast4: "4821",
    cardNetwork: "rupay",
    cardExpiry: "08/29",
    bankName: "HDFC Bank",
    lastUsedAt: "3 days ago",
  },
  {
    id: "qp-card-2",
    type: "card",
    title: "ICICI Sapphiro Visa Card",
    detail: "•••• 9024 • Exp 12/28 • 1-Click Tap",
    iconName: "card",
    isDefault: false,
    cardLast4: "9024",
    cardNetwork: "visa",
    cardExpiry: "12/28",
    bankName: "ICICI Bank",
  },
];

class QuickPayServiceClass {
  private methods: SavedQuickPayMethod[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        this.methods = JSON.parse(stored);
      } else {
        this.methods = [...DEFAULT_SAVED_METHODS];
        this.saveToStorage();
      }

      // Check if a specific default ID is set
      const defaultId = localStorage.getItem(DEFAULT_METHOD_KEY);
      if (defaultId) {
        this.methods = this.methods.map((m) => ({
          ...m,
          isDefault: m.id === defaultId,
        }));
      }
    } catch {
      this.methods = [...DEFAULT_SAVED_METHODS];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.methods));
      const defaultMethod = this.methods.find((m) => m.isDefault);
      if (defaultMethod) {
        localStorage.setItem(DEFAULT_METHOD_KEY, defaultMethod.id);
      }
    } catch {
      // ignore
    }
    this.notifyListeners();
  }

  public getSavedMethods(): SavedQuickPayMethod[] {
    return [...this.methods];
  }

  public getPreferredMethod(): SavedQuickPayMethod {
    const found = this.methods.find((m) => m.isDefault);
    return found || this.methods[0] || DEFAULT_SAVED_METHODS[0];
  }

  public setPreferredMethod(id: string): SavedQuickPayMethod | null {
    let selected: SavedQuickPayMethod | null = null;
    this.methods = this.methods.map((m) => {
      if (m.id === id) {
        selected = { ...m, isDefault: true, lastUsedAt: "Just now" };
        return selected;
      }
      return { ...m, isDefault: false };
    });

    if (selected) {
      this.saveToStorage();
    }
    return selected;
  }

  public saveNewMethod(method: Omit<SavedQuickPayMethod, "id">): SavedQuickPayMethod {
    const newId = `qp-${method.type}-${Date.now()}`;
    const newMethod: SavedQuickPayMethod = {
      ...method,
      id: newId,
      lastUsedAt: "Just now",
    };

    if (newMethod.isDefault) {
      this.methods = this.methods.map((m) => ({ ...m, isDefault: false }));
    }

    this.methods.unshift(newMethod);
    this.saveToStorage();
    return newMethod;
  }

  public removeMethod(id: string) {
    this.methods = this.methods.filter((m) => m.id !== id);
    if (this.methods.length > 0 && !this.methods.some((m) => m.isDefault)) {
      this.methods[0].isDefault = true;
    }
    this.saveToStorage();
  }

  public executeOneClickAuth(
    method: SavedQuickPayMethod,
    amount: number
  ): Promise<RazorpayPaymentResult> {
    return new Promise((resolve) => {
      // Simulate high-speed biometric / UPI AutoPay authorization (800ms)
      setTimeout(() => {
        const txnId = `pay_QP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const orderId = `order_QP_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const rbiRrn = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;

        const result: RazorpayPaymentResult = {
          razorpayPaymentId: txnId,
          razorpayOrderId: orderId,
          razorpaySignature: `sig_${Math.random().toString(36).substring(2, 15)}`,
          status: "captured",
          amount: amount,
          currency: "INR",
          timestamp: new Date().toISOString(),
          method: method.type === "wallet" ? "wallet" : method.type === "card" ? "card" : "upi",
          bank: method.bankName || (method.type === "upi" ? "HDFC Bank (UPI)" : "BharatYatra Vault"),
          wallet: method.type === "wallet" ? "YatraCash" : undefined,
          vpa: method.upiId || (method.type === "upi" ? "quickpay@upi" : undefined),
          card: method.type === "card" ? {
            last4: method.cardLast4 || "4821",
            network: method.cardNetwork || "visa",
            type: "credit",
            issuer: method.bankName || "HDFC Bank",
            tokenized: true,
          } : undefined,
          rbiRrn: rbiRrn,
        };

        // Update last used time
        this.setPreferredMethod(method.id);

        resolve(result);
      }, 750);
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch {
        // ignore
      }
    });
  }
}

export const QuickPayService = new QuickPayServiceClass();
