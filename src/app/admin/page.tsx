import type { Metadata } from "next";
import { AdminRoot } from "@/components/admin/AdminRoot";

export const metadata: Metadata = {
  title: "لوحة إدارة الحجوزات | د. محمد الشعر",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminRoot />;
}
