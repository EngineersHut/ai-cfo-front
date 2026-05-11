import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-white hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">Ai-CFO Admin</h2>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <a href="/admin" className="block p-3 rounded-lg bg-primary/10 text-primary font-medium">Dashboard</a>
          <a href="#" className="block p-3 rounded-lg hover:bg-slate-100 transition-colors">Users</a>
          <a href="#" className="block p-3 rounded-lg hover:bg-slate-100 transition-colors">Reports</a>
          <a href="#" className="block p-3 rounded-lg hover:bg-slate-100 transition-colors">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">AD</div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
