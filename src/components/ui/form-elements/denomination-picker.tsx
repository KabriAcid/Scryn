'use client';

import { cn } from '@/lib/utils';
import type { ControllerRenderProps } from 'react-hook-form';

type Denomination = {
  id: string;
  label: string;
};

interface DenominationPickerProps {
  field: ControllerRenderProps<any, 'denomination'>;
  denominations: readonly Denomination[];
}

export function DenominationPicker({ field, denominations }: DenominationPickerProps) {
  const handleToggle = (id: string) => {
    const currentValue = field.value || [];
    const newValue = currentValue.includes(id)
      ? currentValue.filter((value: string) => value !== id)
      : [...currentValue, id];
    field.onChange(newValue);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {denominations.map((item) => (
        <label
          key={item.id}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 bg-card p-2 text-center text-card-foreground transition-all hover:bg-accent/50 w-fit',
            field.value?.includes(item.id) && 'border-primary bg-primary/10 text-primary'
          )}
        >
          <input
            type="checkbox"
            className="sr-only"
            value={item.id}
            checked={field.value?.includes(item.id)}
            onChange={() => handleToggle(item.id)}
          />
          <span className="text-base font-semibold px-2">{item.label}</span>
        </label>
      ))}
    </div>
  );
}
