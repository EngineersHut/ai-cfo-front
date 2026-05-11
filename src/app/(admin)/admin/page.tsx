import React from "react";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
          <p className="text-3xl font-bold mt-2">1,284</p>
          <div className="text-xs text-green-500 mt-2">↑ 12% from last month</div>
        </div>
      <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
          <p className="text-3xl font-bold mt-2">$42,500</p>
          <div className="text-xs text-green-500 mt-2">↑ 8% from last month</div>
        </div>
      <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Active Subscriptions</h3>
          <p className="text-3xl font-bold mt-2">856</p>
          <div className="text-xs text-red-500 mt-2">↓ 2% from last month</div>
        </div>
      </div>

      <div className="p-6 rounded-xl border bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-xs font-bold">{i}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">New User Registration</p>
                  <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{i}h ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
