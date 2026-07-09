import { categoryChipStyle } from '../../lib/financeUtils';
import type { FinanceCategory } from '../../types';
import './TransactionsSection.css';

interface TransactionRow {
  id: string;
  dateLabel: string;
  desc: string;
  amountLabel: string;
  category: FinanceCategory;
  onEdit: () => void;
  onDelete: () => void;
}

interface TransactionsSectionProps {
  categories: FinanceCategory[];
  categoryFilter: string;
  onCategoryFilterChange: (id: string) => void;
  showExportMenu: boolean;
  onToggleExportMenu: () => void;
  onExportCsv: () => void;
  canExport: boolean;
  onAddTx: () => void;
  transactions: TransactionRow[];
  isEmpty: boolean;
  pageLabel: string;
  canPrevPage: boolean;
  canNextPage: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function TransactionsSection({
  categories,
  categoryFilter,
  onCategoryFilterChange,
  showExportMenu,
  onToggleExportMenu,
  onExportCsv,
  canExport,
  onAddTx,
  transactions,
  isEmpty,
  pageLabel,
  canPrevPage,
  canNextPage,
  onPrevPage,
  onNextPage,
}: TransactionsSectionProps) {
  const filterLabel =
    categoryFilter === 'all' ? 'All Categories' : (categories.find((c) => c.id === categoryFilter)?.name ?? 'All Categories');

  return (
    <div className="finance-card transactions-card">
      <div className="transactions-card__header">
        <span className="finance-section-title">Transactions</span>
        <div className="transactions-card__actions">
          <select
            className="transactions-card__filter"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
          <button type="button" className="transactions-card__export-toggle" onClick={onToggleExportMenu}>
            Export ⌄
          </button>
          <button type="button" className="finance-square-btn" onClick={onAddTx} aria-label="Add transaction">
            +
          </button>
        </div>

        {showExportMenu && (
          <div className="export-menu">
            <button
              type="button"
              className="export-menu__item"
              onClick={onExportCsv}
              disabled={!canExport}
            >
              ⬇ Export as CSV
            </button>
            <div className="export-menu__hint">
              {canExport ? `Exports ${filterLabel} matching current filter` : 'Nothing to export'}
            </div>
          </div>
        )}
      </div>

      <div className="transactions-table__head">
        <div>Date</div>
        <div>Description</div>
        <div>Category</div>
        <div className="transactions-table__amount-head">Amount</div>
        <div />
      </div>

      {transactions.map((t) => (
        <div key={t.id} className="transactions-table__row">
          <div className="transactions-table__date">{t.dateLabel}</div>
          <div className="transactions-table__desc">{t.desc}</div>
          <div>
            <span className="transactions-table__chip" style={categoryChipStyle(t.category.hue)}>
              {t.category.emoji} {t.category.name}
            </span>
          </div>
          <div className="transactions-table__amount">{t.amountLabel}</div>
          <div className="transactions-table__actions">
            <span className="transactions-table__edit" onClick={t.onEdit} role="button" tabIndex={0}>
              Edit
            </span>
            <span
              className="transactions-table__delete"
              onClick={t.onDelete}
              role="button"
              tabIndex={0}
              aria-label="Delete transaction"
            >
              Delete
            </span>
          </div>
        </div>
      ))}

      {isEmpty && <div className="transactions-card__empty">No transactions match this filter</div>}

      <div className="transactions-card__pagination">
        <span className="transactions-card__page-label">{pageLabel}</span>
        <div className="transactions-card__page-buttons">
          <button
            type="button"
            className="transactions-card__page-btn"
            onClick={onPrevPage}
            disabled={!canPrevPage}
          >
            ‹ Prev
          </button>
          <button
            type="button"
            className="transactions-card__page-btn"
            onClick={onNextPage}
            disabled={!canNextPage}
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
