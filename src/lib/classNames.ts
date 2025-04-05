
/**
 * Utility function to conditionally join CSS class names together
 */
export function classNames(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]): string {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .join(' ')
    .trim();
}
