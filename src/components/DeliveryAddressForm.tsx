import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

export interface DeliveryAddress {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

interface Props {
  onContinue: (address: DeliveryAddress) => void;
}

const INITIAL: DeliveryAddress = { name: "", phone: "", addressLine: "", city: "", state: "", pincode: "" };

export default function DeliveryAddressForm({ onContinue }: Props) {
  const [address, setAddress] = useState<DeliveryAddress>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryAddress, string>>>({});

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!address.name.trim()) e.name = "Required";
    if (!/^\d{10}$/.test(address.phone)) e.phone = "Must be 10 digits";
    if (!address.addressLine.trim()) e.addressLine = "Required";
    if (!address.city.trim()) e.city = "Required";
    if (!address.state.trim()) e.state = "Required";
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = "Must be 6 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onContinue(address);
  };

  const set = (key: keyof DeliveryAddress, value: string) => {
    setAddress(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const fields: { key: keyof DeliveryAddress; label: string; placeholder: string; half?: boolean }[] = [
    { key: "name", label: "Full Name", placeholder: "John Doe" },
    { key: "phone", label: "Phone Number", placeholder: "9876543210" },
    { key: "addressLine", label: "Address Line", placeholder: "123, Main Street, Apartment 4B" },
    { key: "city", label: "City", placeholder: "Bangalore", half: true },
    { key: "state", label: "State", placeholder: "Karnataka", half: true },
    { key: "pincode", label: "Pincode", placeholder: "560001", half: true },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">Delivery Address</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
            <Label htmlFor={f.key} className="text-sm text-muted-foreground mb-1 block">{f.label}</Label>
            <Input
              id={f.key}
              value={address[f.key]}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="bg-secondary border-border"
            />
            {errors[f.key] && <p className="text-destructive text-xs mt-1">{errors[f.key]}</p>}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-sm uppercase tracking-wide hover:shadow-gold-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Continue to Payment <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
