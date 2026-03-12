import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Building2, Wallet, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  amount: number;
}

const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"];
const WALLETS = ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"];

export default function PaymentModal({ open, onClose, onSuccess, amount }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // UPI
  const [upiId, setUpiId] = useState("");

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleSimulateSuccess = () => {
    setProcessing(true);
    setTimeout(() => {
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      setProcessing(false);
      onSuccess(paymentId);
    }, 1800);
  };

  const tabs: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { key: "card", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
    { key: "upi", label: "UPI", icon: <Smartphone className="w-4 h-4" /> },
    { key: "netbanking", label: "Net Banking", icon: <Building2 className="w-4 h-4" /> },
    { key: "wallet", label: "Wallet", icon: <Wallet className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-card border-border">
        {/* Header bar */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground text-xs font-medium opacity-80">Pay to</p>
            <p className="text-primary-foreground font-display font-bold text-lg">PizzaCraft</p>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground text-xs font-medium opacity-80">Amount</p>
            <p className="text-primary-foreground font-display font-bold text-2xl">₹{amount.toFixed(0)}</p>
          </div>
        </div>

        {/* Payment method tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMethod(tab.key)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors relative",
                method === tab.key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
              {method === tab.key && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Payment form */}
        <div className="p-6 space-y-4 min-h-[220px]">
          {method === "card" && (
            <>
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Card Number</Label>
                <Input
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="bg-secondary border-border text-foreground font-mono tracking-wider"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground text-xs">Expiry</Label>
                  <Input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="bg-secondary border-border text-foreground font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-xs">CVV</Label>
                  <Input
                    placeholder="•••"
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="bg-secondary border-border text-foreground font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Name on Card</Label>
                <Input
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                />
              </div>
            </>
          )}

          {method === "upi" && (
            <div className="space-y-2">
              <Label className="text-foreground text-xs">UPI ID</Label>
              <Input
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
              <p className="text-muted-foreground text-xs">Enter your UPI ID to simulate payment</p>
            </div>
          )}

          {method === "netbanking" && (
            <div className="grid grid-cols-3 gap-2">
              {BANKS.map((bank) => (
                <button
                  key={bank}
                  className="bg-secondary border border-border rounded-lg p-3 text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {bank}
                </button>
              ))}
            </div>
          )}

          {method === "wallet" && (
            <div className="grid grid-cols-2 gap-2">
              {WALLETS.map((w) => (
                <button
                  key={w}
                  className="bg-secondary border border-border rounded-lg p-3 text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {w}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleSimulateSuccess}
            disabled={processing}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing…
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Simulate Payment Success
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={processing}
            className="w-full bg-secondary text-muted-foreground py-3 rounded-lg font-semibold text-sm hover:text-foreground transition-colors disabled:opacity-60"
          >
            Cancel Payment
          </button>
        </div>

        {/* Secured badge */}
        <div className="bg-secondary/50 border-t border-border px-6 py-2 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground text-[10px]">Secured · Test Mode · No real charges</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
