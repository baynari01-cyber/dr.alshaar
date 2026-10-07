"use client";

import dynamic from "next/dynamic";

/** The dashboard reads browser storage, so it renders on the client only. */
const AdminApp = dynamic(() => import("./AdminApp"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-dvh place-items-center bg-night text-sm text-ivory/50" role="status">
      جارٍ تحميل لوحة الإدارة…
    </div>
  ),
});

export function AdminRoot() {
  return <AdminApp />;
}
