import type { Metadata } from "next";
import { BirthdayContactForm } from "@/components/admin/birthday-contact-form";

export const metadata: Metadata = { title: "Add Birthday Contact — HK Salon Admin" };

export default function NewBirthdayContactPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">Add Birthday Contact</h1>
      <BirthdayContactForm />
    </div>
  );
}
