export const buttonStyles = {
  base: `
    inline-flex items-center justify-center space-x-2
    py-1 lg:py-1.5 px-2 lg:px-4 rounded-lg
    shadow-md hover:shadow-lg
    transition-all duration-200
  `,

  variant: {
    accent: `
      text-white bg-gradient-to-b from-sky-600 to-sky-800
    `,
    primary: `
      text-background bg-primary
    `,
    danger: `
      text-white bg-gradient-to-b from-red-600 to-red-800
    `,
    secondary: `
      text-white bg-gradient-to-b from-zinc-600 to-zinc-800
    `,
    transparent: `
      text-primary bg-transparent
      !px-1.5 !rounded-md
      border-2 border-border hover:border-accent
    `,
  },
};
