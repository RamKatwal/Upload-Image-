import { AppHeader } from "./components/AppHeader";
import { AppSidebar } from "./components/AppSidebar";
import { CompanyInfoContent } from "./components/CompanyInfoContent";
import { TrialBanner } from "./components/TrialBanner";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <TrialBanner />
      <div className="flex flex-1">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <CompanyInfoContent />
        </div>
      </div>
    </div>
  );
}
