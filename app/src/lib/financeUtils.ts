import { addDaysIso, fromISODate, toISODate } from './dateUtils';
import type { FinanceCategory, FinancePeriod, FinanceSummary, FinanceTransaction } from '../types';

export const HUE_SWATCHES = [230, 60, 25, 165, 300, 340, 100, 200, 20, 280];
export const OTHER_CATEGORY: FinanceCategory = { id: 'other', name: 'Other', emoji: '📦', hue: 240, budget: 0 };

export interface PeriodRange {
  start: string;
  end: string;
}

function startOfWeekIso(iso: string): string {
  const date = fromISODate(iso);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDaysIso(iso, diff);
}

export function getPeriodRange(period: FinancePeriod, offset: number, todayIso: string): PeriodRange {
  if (period === 'day') {
    const day = addDaysIso(todayIso, offset);
    return { start: day, end: day };
  }
  if (period === 'week') {
    const start = addDaysIso(startOfWeekIso(todayIso), offset * 7);
    return { start, end: addDaysIso(start, 6) };
  }
  const today = fromISODate(todayIso);
  const y = today.getFullYear();
  const m = today.getMonth() + offset;
  const start = toISODate(new Date(y, m, 1));
  const end = toISODate(new Date(y, m + 1, 0));
  return { start, end };
}

export function inRange(dateIso: string, range: PeriodRange): boolean {
  return dateIso >= range.start && dateIso <= range.end;
}

export function totalsByCategory(transactions: FinanceTransaction[], range: PeriodRange): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const t of transactions) {
    if (inRange(t.date, range)) totals[t.categoryId] = (totals[t.categoryId] ?? 0) + t.amount;
  }
  return totals;
}

export function sumTotals(totals: Record<string, number>): number {
  return Object.values(totals).reduce((a, b) => a + b, 0);
}

export function getCategory(categories: FinanceCategory[], id: string): FinanceCategory {
  return categories.find((c) => c.id === id) ?? OTHER_CATEGORY;
}

export function formatCurrency(amount: number): string {
  return `₴${Math.round(amount).toLocaleString()}`;
}

export function formatPeriodLabel(period: FinancePeriod, range: PeriodRange): string {
  const start = fromISODate(range.start);
  if (period === 'day') return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (period === 'week') {
    const end = fromISODate(range.end);
    const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endLabel = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startLabel} – ${endLabel}`;
  }
  return start.toLocaleDateString('en-US', { month: 'long' });
}

export function last6MonthTotals(
  transactions: FinanceTransaction[],
  todayIso: string,
): { label: string; total: number; isCurrent: boolean }[] {
  const today = fromISODate(todayIso);
  const months: { label: string; total: number; isCurrent: boolean }[] = [];
  for (let i = 5; i >= 0; i--) {
    const y = today.getFullYear();
    const m = today.getMonth() - i;
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    const range = { start: toISODate(start), end: toISODate(end) };
    let total = 0;
    for (const t of transactions) if (inRange(t.date, range)) total += t.amount;
    months.push({ label: start.toLocaleDateString('en-US', { month: 'short' }), total, isCurrent: i === 0 });
  }
  return months;
}

export function computeFinanceSummary(transactions: FinanceTransaction[], todayIso: string): FinanceSummary {
  const monthRange = getPeriodRange('month', 0, todayIso);
  const yesterday = addDaysIso(todayIso, -1);
  let spentThisMonth = 0;
  let spentYesterday = 0;
  for (const t of transactions) {
    if (inRange(t.date, monthRange)) spentThisMonth += t.amount;
    if (t.date === yesterday) spentYesterday += t.amount;
  }
  return { spentThisMonth, spentYesterday };
}

export function categoryAccent(hue: number): string {
  return `oklch(0.55 0.18 ${hue})`;
}

export function categoryChipStyle(hue: number): { background: string; color: string } {
  return { background: `oklch(0.91 0.045 ${hue})`, color: `oklch(0.4 0.16 ${hue})` };
}

export function formatShortDate(dateIso: string): string {
  return fromISODate(dateIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function exportTransactionsCsv(transactions: FinanceTransaction[], categories: FinanceCategory[]): void {
  const header = 'Date,Description,Category,Amount\n';
  const body = transactions
    .map((t) => {
      const cat = getCategory(categories, t.categoryId);
      const desc = `"${t.desc.replace(/"/g, '""')}"`;
      const name = `"${cat.name.replace(/"/g, '""')}"`;
      return [t.date, desc, name, t.amount].join(',');
    })
    .join('\n');
  const blob = new Blob([header + body], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
