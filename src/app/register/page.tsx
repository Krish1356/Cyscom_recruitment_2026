"use client";

import { HUDLayout } from "@/components/HUDLayout";
import { RegistrationForm } from "./RegistrationForm";

export default function RegisterPage() {
  return (
    <HUDLayout>
      <div className="pt-12 pb-24">
        <RegistrationForm />
      </div>
    </HUDLayout>
  );
}
