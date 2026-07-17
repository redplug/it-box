export function isDarkTheme(storedTheme: string | null): boolean {
  return storedTheme !== 'light';
}

export function getThemeClass(dark: boolean): '' | 'light-theme' {
  return dark ? '' : 'light-theme';
}
