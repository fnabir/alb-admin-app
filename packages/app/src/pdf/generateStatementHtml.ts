import { formatCurrency, getCurrentDate } from '../utils';

export type StatementPaidItem = {
  key: string;
  details: string;
  amount: number;
};

export type StatementRow = {
  date: string;
  title: string;
  details?: string;
  amount: number;
  paidArray?: StatementPaidItem[];
};

export type GenerateStatementHtmlOptions = {
  projectId: string;
  billRows: StatementRow[];
  paymentRows: StatementRow[];
  totalBill: number;
  totalPayment: number;
  balance: number;
  letterpadUri: string;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderBillRows(rows: StatementRow[], total: number): string {
  const dataRows =
    rows.length === 0
      ? '<tr><td colspan="4" style="text-align:center;color:#888;padding:12px;">No records</td></tr>'
      : rows
          .map((row) => {
            const totalPaid =
              row.paidArray?.reduce((s, p) => s + p.amount, 0) ?? 0;
            const isPaid = row.amount > 0 && totalPaid >= row.amount;
            const isPartial = totalPaid > 0 && totalPaid < row.amount;
            const rowBg = isPaid
              ? '#d4edda'
              : isPartial
                ? '#fff3cd'
                : '#fdecea';

            let html = `
                <tr style="background:${rowBg}; page-break-inside:avoid;">
                    <td style="white-space:nowrap;">${escapeHtml(row.date)}</td>
                    <td>${escapeHtml(row.title)}</td>
                    <td>${escapeHtml(row.details ?? '')}</td>
                    <td style="text-align:right; font-weight:600;">${formatCurrency(row.amount)}</td>
                </tr>`;

            if (row.paidArray && row.paidArray.length > 0) {
              row.paidArray
                .sort((a, b) => a.key.localeCompare(b.key))
                .forEach((p) => {
                  const payDate = p.details.substring(0, 8);
                  const payDesc = p.details
                    .substring(9)
                    .replace(/:\s*৳.*$/, '')
                    .trim();
                  html += `
              <tr style="background:#eaf4fb; font-size:9px; page-break-inside:avoid;">
                <td style="padding-left:18px; white-space:nowrap;">↳ ${escapeHtml(payDate)}</td>
                <td colspan="2">${escapeHtml(payDesc)}</td>
                <td style="text-align:right; color:#1a7f37;">${formatCurrency(p.amount)}</td>
              </tr>`;
                });
            }

            return html;
          })
          .join('');

  const totalRow = `
        <tr style="background:#c8dff0; page-break-inside:avoid;">
          <td colspan="3" style="font-weight:700;">Total Bills</td>
          <td style="text-align:right; font-weight:700;">${formatCurrency(total)}</td>
        </tr>`;

  return dataRows + totalRow;
}

function renderPaymentRows(rows: StatementRow[], total: number): string {
  const dataRows =
    rows.length === 0
      ? '<tr><td colspan="4" style="text-align:center;padding:12px;">No records</td></tr>'
      : rows
          .map(
            (row) => `
        <tr style="background:#e8f5e9; page-break-inside:avoid;">
          <td style="white-space:nowrap;">${escapeHtml(row.date)}</td>
          <td>${escapeHtml(row.title)}</td>
          <td>${escapeHtml(row.details ?? '')}</td>
          <td style="text-align:right; font-weight:600; color:#1a7f37;">${formatCurrency(Math.abs(row.amount))}</td>
        </tr>`,
          )
          .join('');

  const totalRow = `
        <tr style="background:#a8d5b5; page-break-inside:avoid;">
          <td colspan="3" style="font-weight:700;">Total Payments</td>
          <td style="text-align:right; font-weight:700; color:#1a7f37;">${formatCurrency(Math.abs(total))}</td>
        </tr>`;

  return dataRows + totalRow;
}

export function generateStatementHtml(
  options: GenerateStatementHtmlOptions,
): string {
  const {
    projectId,
    billRows,
    paymentRows,
    totalBill,
    totalPayment,
    balance,
    letterpadUri,
  } = options;

  const thStyle =
    'border:1px solid #aac4d8; padding:4px 7px; background:#d0e8f8; text-align:left; font-weight:700; font-size:12px;';
  const tdStyle = 'border:1px solid #ccc; padding:3px 7px; font-size:11px;';

  return `<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8" />
    <title>Transaction Statement</title>
    <style>
        /*
        * @page margins push content away from the letterpad header/footer on
        * EVERY page (not just the first). Zero side margins so the letterpad
        * background fills edge-to-edge horizontally.
        */
        @page { size: A4 portrait; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { font-family: Arial, Helvetica, sans-serif; color: #222; }

        html::before {
            content: '';
            position: fixed;
            inset: 0;
            width: 210mm;
            height: 297mm;
            background-image: url('${letterpadUri}');
            background-size: cover;
            background-repeat: no-repeat;
            z-index: -1;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }

        .header-space { height: 43mm; }
        .footer-space { height: 14mm; }
        .page-wrap { width: 100%; border-collapse: collapse; }
        .page-wrap > thead > tr > td,
        .page-wrap > tfoot > tr > td,
        .page-wrap > tbody > tr > td {
            padding: 0 12mm;  /* side margins */
            border: none;
        }

        .stmt-title {
            text-align: center;
            font-size: 15px;
            font-weight: 700;
            color: #003366;
            margin-bottom: 4px;
        }

        .stmt-meta {
            text-align: center;
            font-size: 12px;
            color: #444;
            margin-bottom: 2px;
        }

        hr.divider {
            border: none;
            border-top: 1.5px solid #003366;
            margin: 8px 0 12px;
        }

        .section-label {
            font-size: 12px;
            font-weight: 700;
            color: #003366;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            margin-top: 10px;
        }

        table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        th { ${thStyle} }
        td { ${tdStyle} }

        .totals-box {
            margin-top: 10px;
            border: 1.5px solid #003366;
            border-radius: 4px;
            overflow: hidden;
            page-break-inside: avoid;
        }

        .totals-box table { margin: 0; }
        .totals-box td { padding: 5px 10px; font-size: 11px; }
        .totals-lbl { font-weight: 700; }
        .totals-val { text-align: right; font-weight: 700; }
        .grand-total td { background: #003366 !important; color: #fff !important; }

        @media print {
        * { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
        }
    </style>
    </head>
    <body>
        <table class="page-wrap">
            <thead><tr><td><div class="header-space"></div></td></tr></thead>
            <tfoot><tr><td><div class="footer-space"></div></td></tr></tfoot>
            <tbody><tr><td>

                <div class="stmt-title">TRANSACTION STATEMENT</div>
                    <div class="stmt-meta">Project: <strong>${escapeHtml(projectId)}</strong></div>
                    <hr class="divider" />

                    <div class="section-label">Bills</div>
                    <table>
                    <thead>
                        <tr>
                        <th style="width:16%">Date</th>
                        <th style="width:18%">Category</th>
                        <th style="width:40%">Details</th>
                        <th style="width:26%; text-align:right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderBillRows(billRows, totalBill)}
                    </tbody>
                    </table>

                    <div class="section-label">Payments</div>
                    <table>
                    <thead>
                        <tr>
                        <th style="width:16%">Date</th>
                        <th style="width:18%">Method</th>
                        <th style="width:40%">Details</th>
                        <th style="width:26%; text-align:right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderPaymentRows(paymentRows, totalPayment)}
                    </tbody>
                    </table>

                    <div class="totals-box">
                    <table>
                        <tr>
                        <td class="totals-lbl">Total Bill</td>
                        <td class="totals-val">${formatCurrency(totalBill)}</td>
                        </tr>
                        <tr>
                        <td class="totals-lbl">Total Payment</td>
                        <td class="totals-val">${formatCurrency(Math.abs(totalPayment))}</td>
                        </tr>
                        <tr class="grand-total">
                        <td class="totals-lbl">Balance Due</td>
                        <td class="totals-val">${formatCurrency(balance)}</td>
                        </tr>
                    </table>
                    </div>
                </div>
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #000; font-size: 12px; text-align: center;">
                    <div style="margin-bottom: 4px;">Generated on: ${getCurrentDate('dd.MM.yyyy')}</div>
                    <div>This statement has been generated from database of Asian Lift Bangladesh upon available data.<br/>Hence no signature required.</div>
                </div>
            </td></tr></tbody>
        </table>
    </body>
</html>`;
}
