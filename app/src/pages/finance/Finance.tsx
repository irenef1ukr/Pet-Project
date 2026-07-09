import { useMemo, useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { getTodayISO } from '../../data/mockData';
import {
  categoryAccent,
  exportTransactionsCsv,
  formatCurrency,
  formatPeriodLabel,
  formatShortDate,
  getCategory,
  getPeriodRange,
  inRange,
  last6MonthTotals,
  sumTotals,
  totalsByCategory,
} from '../../lib/financeUtils';
import { useLocalStorageState } from '../../lib/useLocalStorageState';
import { useAppData } from '../../store/AppDataContext';
import type {
  FinanceBudgetDraft,
  FinanceNewCategoryDraft,
  FinancePeriod,
  FinanceTransactionDraft,
} from '../../types';
import { BudgetByCategoryCard } from './BudgetByCategoryCard';
import { BudgetFormScreen } from './BudgetFormScreen';
import { CategoryManagementScreen } from './CategoryManagementScreen';
import { DeleteTransactionConfirmModal } from './DeleteTransactionConfirmModal';
import { DonutCard } from './DonutCard';
import { PeriodBar } from './PeriodBar';
import { SpendingTrendChart } from './SpendingTrendChart';
import { StatCards } from './StatCards';
import { TransactionFormScreen } from './TransactionFormScreen';
import { TransactionsSection } from './TransactionsSection';
import './Finance.css';

type Screen = 'dashboard' | 'txForm' | 'categories' | 'budgetForm';
type CategoriesReturnTo = 'dashboard' | 'txForm' | 'budgetForm';

const PAGE_SIZE = 15;

export function Finance() {
  const {
    financeCategories,
    financeTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addFinanceCategory,
    renameFinanceCategory,
    changeFinanceCategoryEmoji,
    deleteFinanceCategory,
    setCategoryBudget,
  } = useAppData();

  const today = getTodayISO();

  const [screen, setScreen] = useState<Screen>('dashboard');
  const [filter, setFilter] = useLocalStorageState<FinancePeriod>('hi-app:finance-filter', 'month');
  const [periodOffset, setPeriodOffset] = useState(0);
  const [page, setPage] = useState(0);
  const [txCategoryFilter, setTxCategoryFilter] = useState('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);
  const [txForm, setTxForm] = useState<FinanceTransactionDraft>({
    date: today,
    desc: '',
    categoryId: financeCategories[0]?.id ?? '',
    amount: '',
  });
  const [txFormError, setTxFormError] = useState('');
  const [categoriesReturnTo, setCategoriesReturnTo] = useState<CategoriesReturnTo>('dashboard');
  const [newCategory, setNewCategory] = useState<FinanceNewCategoryDraft>({ emoji: '🙂', name: '', hue: 230 });
  const [budgetForm, setBudgetForm] = useState<FinanceBudgetDraft>({
    categoryId: financeCategories[0]?.id ?? '',
    amount: '',
  });
  const [budgetFormError, setBudgetFormError] = useState('');

  const changeFilter = (f: FinancePeriod) => {
    setFilter(f);
    setPeriodOffset(0);
    setPage(0);
  };

  const periodRange = getPeriodRange(filter, periodOffset, today);
  const monthRange = getPeriodRange('month', 0, today);
  const periodTotals = totalsByCategory(financeTransactions, periodRange);
  const monthTotals = totalsByCategory(financeTransactions, monthRange);
  const spentPeriod = sumTotals(periodTotals);
  const spentMonth = sumTotals(monthTotals);

  const legend = financeCategories
    .filter((c) => (periodTotals[c.id] ?? 0) > 0)
    .map((c) => ({
      name: c.name,
      dotColor: categoryAccent(c.hue),
      pctLabel: `${Math.round(((periodTotals[c.id] ?? 0) / (spentPeriod || 1)) * 100)}%`,
    }));

  let deg = 0;
  const segments = financeCategories
    .filter((c) => (periodTotals[c.id] ?? 0) > 0)
    .map((c) => {
      const frac = (periodTotals[c.id] ?? 0) / (spentPeriod || 1);
      const start = deg;
      deg += frac * 360;
      return `${categoryAccent(c.hue)} ${start}deg ${deg}deg`;
    });
  const donutGradient = segments.length ? `conic-gradient(${segments.join(', ')})` : 'conic-gradient(oklch(0.9 0.01 240) 0deg 360deg)';

  const budgetRows = financeCategories.map((c) => {
    const spent = Math.round(monthTotals[c.id] ?? 0);
    const pct = c.budget ? Math.min(100, (spent / c.budget) * 100) : 0;
    const over = c.budget > 0 && spent > c.budget;
    return {
      id: c.id,
      emoji: c.emoji,
      name: c.name,
      hue: c.hue,
      pct,
      over,
      amountLabel: `${formatCurrency(spent)} / ${formatCurrency(c.budget)}`,
    };
  });

  const trendMonths = last6MonthTotals(financeTransactions, today);
  const maxMonthAmt = Math.max(1, ...trendMonths.map((m) => m.total));

  const filteredSortedTransactions = useMemo(() => {
    const indexed = financeTransactions.map((t, i) => ({ t, i }));
    let filtered = indexed.filter(({ t }) => inRange(t.date, periodRange));
    if (txCategoryFilter !== 'all') filtered = filtered.filter(({ t }) => t.categoryId === txCategoryFilter);
    filtered.sort((a, b) => (a.t.date !== b.t.date ? (a.t.date < b.t.date ? 1 : -1) : b.i - a.i));
    return filtered.map(({ t }) => t);
  }, [financeTransactions, txCategoryFilter, periodRange]);

  const totalPages = Math.max(1, Math.ceil(filteredSortedTransactions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = filteredSortedTransactions.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const openAddTx = () => {
    setEditingTxId(null);
    setTxFormError('');
    setTxForm({ date: today, desc: '', categoryId: financeCategories[0]?.id ?? '', amount: '' });
    setScreen('txForm');
  };

  const openEditTx = (id: string) => {
    const t = financeTransactions.find((tx) => tx.id === id);
    if (!t) return;
    setEditingTxId(id);
    setTxFormError('');
    setTxForm({ date: t.date, desc: t.desc, categoryId: t.categoryId, amount: String(t.amount) });
    setScreen('txForm');
  };

  const saveTx = () => {
    const amount = parseFloat(txForm.amount);
    if (!txForm.desc.trim()) {
      setTxFormError('Please add a description.');
      return;
    }
    if (!amount || amount <= 0) {
      setTxFormError('Please enter a valid amount.');
      return;
    }
    const patch = { date: txForm.date, desc: txForm.desc.trim(), categoryId: txForm.categoryId, amount };
    if (editingTxId) {
      updateTransaction(editingTxId, patch);
    } else {
      addTransaction(patch);
      setPage(0);
    }
    setScreen('dashboard');
  };

  const removeTx = () => {
    if (editingTxId) deleteTransaction(editingTxId);
    setScreen('dashboard');
  };

  const confirmDeleteTx = () => {
    if (deletingTxId) deleteTransaction(deletingTxId);
    setDeletingTxId(null);
  };

  const openCategoriesFrom = (returnTo: CategoriesReturnTo) => {
    setCategoriesReturnTo(returnTo);
    setScreen('categories');
  };

  const addNewCategory = () => {
    const name = newCategory.name.trim();
    if (!name) return;
    addFinanceCategory({ name, emoji: newCategory.emoji || '🙂', hue: newCategory.hue, budget: 0 });
    setNewCategory({ emoji: '🙂', name: '', hue: newCategory.hue });
  };

  const openAddBudget = () => {
    setBudgetFormError('');
    setBudgetForm({ categoryId: financeCategories[0]?.id ?? '', amount: '' });
    setScreen('budgetForm');
  };

  const saveBudget = () => {
    const amount = parseFloat(budgetForm.amount);
    if (!amount || amount <= 0) {
      setBudgetFormError('Please enter a valid budget amount.');
      return;
    }
    setCategoryBudget(budgetForm.categoryId, amount);
    setScreen('dashboard');
  };

  const deletingTx = deletingTxId ? financeTransactions.find((t) => t.id === deletingTxId) : undefined;

  const handleExport = () => {
    if (filteredSortedTransactions.length === 0) return;
    exportTransactionsCsv(filteredSortedTransactions, financeCategories);
    setShowExportMenu(false);
  };

  return (
    <div className="page">
      <TopNav />
      <div className="finance-main">
        {screen === 'dashboard' && (
          <div className="finance-dashboard">
            <PeriodBar
              filter={filter}
              onFilterChange={changeFilter}
              periodLabel={formatPeriodLabel(filter, periodRange)}
              canGoNext={periodOffset < 0}
              onPrev={() => {
                setPeriodOffset((o) => o - 1);
                setPage(0);
              }}
              onNext={() => {
                setPeriodOffset((o) => Math.min(0, o + 1));
                setPage(0);
              }}
            />

            <div className="finance-summary-grid">
              <DonutCard
                legend={legend}
                gradient={donutGradient}
                centerValue={formatCurrency(spentPeriod)}
                centerLabel={filter === 'day' ? 'today' : filter === 'week' ? 'this week' : 'this month'}
              />

              <div className="finance-right-stack">
                <StatCards
                  spentMonthLabel={formatCurrency(spentMonth)}
                  showPeriodStat={filter !== 'month'}
                  periodStatLabel={filter === 'day' ? 'Spent Today' : 'Spent This Week'}
                  periodStatValue={formatCurrency(spentPeriod)}
                />
                <BudgetByCategoryCard rows={budgetRows} onAddBudget={openAddBudget} />
              </div>
            </div>

            <SpendingTrendChart months={trendMonths} maxAmount={maxMonthAmt} />

            <TransactionsSection
              categories={financeCategories}
              categoryFilter={txCategoryFilter}
              onCategoryFilterChange={(id) => {
                setTxCategoryFilter(id);
                setPage(0);
              }}
              showExportMenu={showExportMenu}
              onToggleExportMenu={() => setShowExportMenu((s) => !s)}
              onExportCsv={handleExport}
              canExport={filteredSortedTransactions.length > 0}
              onAddTx={openAddTx}
              transactions={pageItems.map((t) => ({
                id: t.id,
                dateLabel: formatShortDate(t.date),
                desc: t.desc,
                amountLabel: formatCurrency(t.amount),
                category: getCategory(financeCategories, t.categoryId),
                onEdit: () => openEditTx(t.id),
                onDelete: () => setDeletingTxId(t.id),
              }))}
              isEmpty={pageItems.length === 0}
              pageLabel={`Page ${currentPage + 1} of ${totalPages}`}
              canPrevPage={currentPage > 0}
              canNextPage={currentPage < totalPages - 1}
              onPrevPage={() => setPage((p) => Math.max(0, p - 1))}
              onNextPage={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            />
          </div>
        )}

        {screen === 'txForm' && (
          <TransactionFormScreen
            isEditing={!!editingTxId}
            categories={financeCategories}
            draft={txForm}
            error={txFormError}
            onChange={(patch) => setTxForm((f) => ({ ...f, ...patch }))}
            onManageCategories={() => openCategoriesFrom('txForm')}
            onSave={saveTx}
            onDelete={removeTx}
            onCancel={() => setScreen('dashboard')}
          />
        )}

        {screen === 'categories' && (
          <CategoryManagementScreen
            categories={financeCategories}
            newCategory={newCategory}
            onBack={() => setScreen(categoriesReturnTo)}
            onEmojiChange={changeFinanceCategoryEmoji}
            onNameChange={renameFinanceCategory}
            onDelete={deleteFinanceCategory}
            onNewCategoryChange={(patch) => setNewCategory((c) => ({ ...c, ...patch }))}
            onAddCategory={addNewCategory}
          />
        )}

        {screen === 'budgetForm' && (
          <BudgetFormScreen
            categories={financeCategories}
            draft={budgetForm}
            error={budgetFormError}
            onChange={(patch) => setBudgetForm((f) => ({ ...f, ...patch }))}
            onManageCategories={() => openCategoriesFrom('budgetForm')}
            onSave={saveBudget}
            onCancel={() => setScreen('dashboard')}
          />
        )}
      </div>

      {deletingTx && (
        <DeleteTransactionConfirmModal
          transaction={deletingTx}
          onCancel={() => setDeletingTxId(null)}
          onConfirm={confirmDeleteTx}
        />
      )}
    </div>
  );
}
