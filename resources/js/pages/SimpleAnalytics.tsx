import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleAnalyticsProps {
    message?: string;
}

export default function SimpleAnalytics({ message = "Analytics page loaded successfully" }: SimpleAnalyticsProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Test Analytics', href: '/test-analytics' }]}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Test Analytics</h1>
                    <p className="text-muted-foreground">
                        Simple test page to verify the analytics route works
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{message}</p>
                        <p>If you see this message, the analytics route is working correctly.</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
