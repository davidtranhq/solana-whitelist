import { ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

export default function CustomThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}