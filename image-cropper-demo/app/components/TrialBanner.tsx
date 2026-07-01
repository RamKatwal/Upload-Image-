export function TrialBanner() {
  return (
    <div className="flex items-center justify-center bg-banner-purple px-4 py-2 text-sm text-banner-purple-text">
      <span>
        Your Free Trial expires in 3 days. Upgrade now to continue using Providhy.{" "}
        <button type="button" className="font-medium underline underline-offset-2 hover:opacity-80">
          Upgrade Plan →
        </button>
      </span>
    </div>
  );
}
