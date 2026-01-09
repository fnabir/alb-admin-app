export const inputStyles = {
  container: `
    w-full space-y-1
  `,
  label: `
    text-sm text-primary select-none
  `,
  fieldWrapper: `
    flex items-center px-3 gap-2
    border rounded-lg bg-card
    transition-colors duration-150
  `,
  field: `
    flex-1 py-2 text-primary bg-transparent
    placeholder:text-neutral-500
    outline-none border-none
    focus:outline-none focus:ring-0
  `,
  helper: `
    text-xs text-muted
  `,
  error: `
    text-xs text-error
  `,
};
