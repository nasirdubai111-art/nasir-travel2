import React from "react";
import { User, Trash2, Plus } from "lucide-react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export interface Passenger {
  id: string;
  fullName: string;
  age: number | string;
  gender: "male" | "female" | "other" | "";
  berthPreference?: string;
  idType?: string;
  idNumber?: string;
}

export interface PassengerFormProps {
  passengers: Passenger[];
  onChange: (passengers: Passenger[]) => void;
  maxPassengers?: number;
  serviceCategory?: string;
  className?: string;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({
  passengers,
  onChange,
  maxPassengers = 6,
  serviceCategory = "flights",
  className,
}) => {
  const handlePassengerChange = (id: string, field: keyof Passenger, value: string | number) => {
    const updated = passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    onChange(updated);
  };

  const handleAddPassenger = () => {
    if (passengers.length >= maxPassengers) return;
    const newPassenger: Passenger = {
      id: `pax-${Date.now()}`,
      fullName: "",
      age: "",
      gender: "",
      berthPreference: "No Preference",
    };
    onChange([...passengers, newPassenger]);
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length <= 1) return;
    onChange(passengers.filter((p) => p.id !== id));
  };

  const isTrain = serviceCategory === "trains";

  return (
    <div className={cn("space-y-4 text-left", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#111827]">Traveller Details</h4>
          <p className="text-xs text-[#6B7280]">
            Please enter names exactly as printed on Government photo IDs
          </p>
        </div>
        <span className="text-xs font-semibold text-[#0B5ED7]">
          {passengers.length} of {maxPassengers} Travellers
        </span>
      </div>

      <div className="space-y-3">
        {passengers.map((pax, index) => (
          <div
            key={pax.id}
            className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] space-y-3 relative"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0B5ED7]" />
                Passenger {index + 1}
              </span>

              {passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePassenger(pax.id)}
                  className="text-xs text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <Input
                  label="Full Name"
                  placeholder="As on Aadhaar / Passport"
                  value={pax.fullName}
                  isRequired
                  onChange={(e) => handlePassengerChange(pax.id, "fullName", e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
                <Input
                  label="Age"
                  type="number"
                  placeholder="e.g. 28"
                  value={pax.age}
                  isRequired
                  min={1}
                  max={120}
                  onChange={(e) => handlePassengerChange(pax.id, "age", e.target.value)}
                />
              </div>

              <div className="sm:col-span-4">
                <Select
                  label="Gender"
                  isRequired
                  value={pax.gender}
                  onChange={(e) => handlePassengerChange(pax.id, "gender", e.target.value)}
                  options={[
                    { value: "", label: "Select Gender" },
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </div>

              {isTrain && (
                <div className="sm:col-span-6">
                  <Select
                    label="Berth Preference"
                    value={pax.berthPreference || "No Preference"}
                    onChange={(e) => handlePassengerChange(pax.id, "berthPreference", e.target.value)}
                    options={[
                      { value: "No Preference", label: "No Preference" },
                      { value: "Lower Berth", label: "Lower Berth" },
                      { value: "Middle Berth", label: "Middle Berth" },
                      { value: "Upper Berth", label: "Upper Berth" },
                      { value: "Side Lower", label: "Side Lower" },
                      { value: "Side Upper", label: "Side Upper" },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {passengers.length < maxPassengers && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddPassenger}
          leftIcon={<Plus className="w-4 h-4" />}
          className="border-dashed"
        >
          Add Another Traveller
        </Button>
      )}
    </div>
  );
};
