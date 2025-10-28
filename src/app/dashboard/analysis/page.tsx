import { AnalyticsCharts } from '@/components/dashboard/analytics-charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalysisPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
          <CardDescription>
            An in-depth look at redemption patterns and demographics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <AnalyticsCharts />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
