
import { RedemptionOverviewChart, GeographicDistributionChart, PartyAffiliationChart } from '@/components/dashboard/analytics-charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalysisPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
          <CardDescription>
            An in-depth look at redemption patterns, demographics, and political affiliation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <RedemptionOverviewChart />
            <GeographicDistributionChart />
            <PartyAffiliationChart />
        </CardContent>
      </Card>
    </div>
  );
}
