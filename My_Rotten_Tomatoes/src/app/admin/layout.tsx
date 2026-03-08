import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      <AdminHeader />
      {children}
    </div>
  );
}
