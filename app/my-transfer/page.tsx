import type { Metadata } from "next";
import { ManageBooking } from "@/components/b2c/manage/ManageBooking";
import { TravelShell } from "@/components/b2c/TravelShell";
import { MANAGE } from "@/lib/b2c/copy-booking";

export const metadata: Metadata = {
  title: MANAGE.meta.title,
  description: MANAGE.meta.description,
  alternates: { canonical: "/my-transfer" },
  // A prototype over demo data, and in future a private page.
  robots: { index: false, follow: false },
};

export default function MyTransferPage() {
  return (
    <TravelShell current="my-transfer" solidHeader>
      <ManageBooking />
    </TravelShell>
  );
}
