import { CompanyProfileSection } from "./CompanyProfileSection";
import { IconChevronLeft, IconPencil } from "./icons";

export function CompanyInfoContent() {
  return (
    <div className="flex-1 overflow-auto bg-background px-8 py-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md p-1 text-text-muted transition-colors hover:bg-white hover:text-foreground"
              aria-label="Go back"
            >
              <IconChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-medium text-gray-800">Company Information</h1>
          </div>

          <div className="mt-4 border-b border-border">
            <button
              type="button"
              className="relative -mb-px border-b-2 border-gray-700 px-1 pb-2.5 text-sm font-medium text-gray-800"
            >
              Profile
            </button>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
        >
          <IconPencil />
          Edit Details
        </button>
      </div>

      <CompanyProfileSection />
    </div>
  );
}
