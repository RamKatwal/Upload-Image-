import {
  IconAccounting,
  IconHome,
  IconInventory,
  IconLogout,
  IconPurchase,
  IconReports,
  IconSales,
  IconSettings,
} from "./icons";

const navItems = [
  { label: "Home", icon: IconHome },
  { label: "Inventory", icon: IconInventory },
  { label: "Purchase", icon: IconPurchase },
  { label: "Sales", icon: IconSales },
  { label: "Accounting", icon: IconAccounting },
  { label: "Reports", icon: IconReports },
];

export function AppSidebar() {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-border bg-white">
      <div className="px-6 py-5">
        <span className="font-serif text-[22px] font-bold tracking-wide text-providhy-teal">
          PROVIDHY
        </span>
      </div>

      <nav className="flex flex-1 flex-col px-3">
        <ul className="space-y-0.5">
          {navItems.map(({ label, icon: Icon }) => (
            <li key={label}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-gray-50 hover:text-foreground"
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto border-t border-border px-3 py-4">
        <button
          type="button"
          className="relative flex w-full items-center gap-3 rounded-md border-l-[3px] border-providhy-teal bg-providhy-teal-light px-3 py-2.5 text-sm font-medium text-providhy-teal"
        >
          <IconSettings className="h-[18px] w-[18px] shrink-0" />
          Settings
        </button>
        <button
          type="button"
          className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-gray-50 hover:text-foreground"
        >
          <IconLogout className="h-[18px] w-[18px] shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
