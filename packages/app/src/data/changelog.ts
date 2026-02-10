type ChangelogItem = {
  date: string;
  details: string[];
};

export const changelog: Record<string, ChangelogItem> = {
  '1.5.0': {
    date: '2025-12-07',
    details: [
      '[ADMIN][FEATURE] Added changelog page.',
      '[UPDATE] Unified website forms and offer forms in single page.',
    ],
  },

  '1.4.0': {
    date: '2025-10-21',
    details: [
      '[FEATURE] Added display for forms submitted from website.',
      '[FEATURE] Added status and note update options for forms.',
      '[FIX] Fixed page-break issues when printing multi-page transaction statements.',
    ],
  },

  '1.3.0': {
    date: '2025-06-19',
    details: [
      '[FEATURE] Added option to print project transaction statements.',
      '[FIX] Fixed incorrect display of payment details and amounts when editing project expenses.',
      '[FIX] Fixed layout issues causing some pages to display incorrectly on small screens.',
    ],
  },

  '1.2.0': {
    date: '2025-06-05',
    details: [
      '[UPDATE] Divided all transactions into Expense and Payment sections, replacing previous filter options.',
      '[FIX] Fixed project balance calculation issues under various sort and filter combinations.',
    ],
  },

  '1.1.3': {
    date: '2025-06-05',
    details: [
      '[FIX] Fixed validation error affecting project expense amounts.',
    ],
  },
};
