import { IconBell, IconPanelLeft, IconSearch } from "./icons";

export function AppHeader() {
  return (
    <header className="flex h-[60px] items-center gap-4 border-b border-border bg-white px-6">
      <button
        type="button"
        className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-gray-50 hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        <IconPanelLeft className="h-5 w-5" />
      </button>

      <div className="relative mx-auto w-full max-w-[480px]">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-label" />
        <input
          type="search"
          placeholder="Search"
          className="h-9 w-full rounded-md border border-border bg-white pl-9 pr-4 text-sm text-foreground placeholder:text-text-label focus:border-providhy-teal focus:outline-none focus:ring-1 focus:ring-providhy-teal"
        />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-md bg-providhy-teal px-4 text-sm font-medium text-white transition-colors hover:bg-providhy-teal-dark"
        >
          <span className="text-base leading-none">+</span>
          Create
        </button>

        <button
          type="button"
          className="rounded-md p-2 text-text-muted transition-colors hover:bg-gray-50 hover:text-foreground"
          aria-label="Notifications"
        >
          <IconBell className="h-5 w-5" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-providhy-teal text-xs font-semibold text-white">
          TR
        </div>
      </div>
    </header>
  );
}
