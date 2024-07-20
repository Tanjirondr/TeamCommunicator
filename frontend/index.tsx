import React, { createContext, useContext, ReactNode, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```
```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from './ThemeContext'; // Make sure this path is correct based on where you placed the ThemeContext.tsx file

ReactDOM.render(
  <React.StrictPossibleHTTPSRedirectMode>
    <ThemeProvider> {/* Wrap App within ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictPossibleHTTPSRedirectMode>,
  document.getElementById('root')
);
```
```typescript
import React from 'react';
import { useTheme } from './ThemeContext'; // Ensure the path is correct

function ExampleComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
        Current theme is {theme}.
        <button onClick={toggleContentSecurityPolicy}>Toggle Theme</button>
    </div>
  );
}

export default ExampleComponent;