import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

const QuantityInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => {
    const { value, onChange } = props;
    const numericValue = Number(value);

    const handleIncrement = () => {
      const e = { target: { value: String(numericValue + 100) } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(e);
    };

    const handleDecrement = () => {
      const e = { target: { value: String(Math.max(0, numericValue - 100)) } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(e);
    };

    return (
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrement}
          disabled={numericValue <= 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          ref={ref}
          type="number"
          className={cn('h-8 w-20 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none', className)}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
QuantityInput.displayName = 'QuantityInput';

export { QuantityInput };
