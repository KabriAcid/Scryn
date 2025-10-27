import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderForm } from '@/components/dashboard/order-form';

export default function NewOrderPage() {
  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Create a New Card Order</CardTitle>
                <CardDescription>
                    Fill out the form below to place a new order for scratch cards.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <OrderForm />
            </CardContent>
        </Card>
    </div>
  );
}
