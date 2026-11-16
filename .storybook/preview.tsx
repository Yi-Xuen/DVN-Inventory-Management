import type { Preview } from '@storybook/nextjs-vite'
import { Montserrat } from 'next/font/google'
import '../app/globals.css'
import { StoreProvider } from '../lib/store'

// Same font setup as app/layout.tsx so stories render in Montserrat.
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-montserrat' })

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  // Toolbar switch for the design system's light / dark tokens ([data-theme] on <html>).
  globalTypes: {
    theme: {
      description: 'Design system theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },

  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme ?? 'light'
      document.documentElement.classList.add(montserrat.variable)
      return (
        <StoreProvider>
          <Story />
        </StoreProvider>
      )
    },
  ],

  // Only the state the app actually reads: its localStorage key and the URL hash route.
  async beforeEach() {
    localStorage.removeItem('dvn-proto-v2')
    window.location.hash = ''
  },
};

export default preview;
