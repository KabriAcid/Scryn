
'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Label } from '../label';

interface DobPickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  required?: boolean;
}

const months = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

export function DobPicker({
  value,
  onChange,
  disabled,
  className,
  required,
}: DobPickerProps) {
  const [day, setDay] = React.useState<string | undefined>(
    value ? String(value.getDate()) : undefined
  );
  const [month, setMonth] = React.useState<string | undefined>(
    value ? String(value.getMonth()) : undefined
  );
  const [year, setYear] = React.useState<string | undefined>(
    value ? String(value.getFullYear()) : undefined
  );

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
      String(startYear + i)
    ).reverse();
  }, []);

  const daysInMonth = React.useMemo(() => {
    if (month === undefined || year === undefined) return [];
    const numDays = new Date(Number(year), Number(month) + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => String(i + 1));
  }, [month, year]);

  React.useEffect(() => {
    if (day && month && year) {
      const newDate = new Date(Number(year), Number(month), Number(day));
      if (!disabled || !disabled(newDate)) {
        onChange(newDate);
      }
    } else {
      onChange(undefined);
    }
  }, [day, month, year, onChange, disabled]);

  React.useEffect(() => {
    // If the selected day is no longer valid for the new month/year, reset it.
    if (day && !daysInMonth.includes(day)) {
      setDay(undefined);
    }
  }, [daysInMonth, day]);

  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="dob-day">Day</Label>
        <Select
          value={day}
          onValueChange={setDay}
          required={required}
          disabled={!month || !year}
        >
          <SelectTrigger id="dob-day">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {daysInMonth.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="dob-month">Month</Label>
        <Select value={month} onValueChange={setMonth} required={required}>
          <SelectTrigger id="dob-month">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={String(m.value)}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="dob-year">Year</Label>
        <Select value={year} onValueChange={setYear} required={required}>
          <SelectTrigger id="dob-year">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

    