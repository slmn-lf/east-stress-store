import { ReactNode } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
