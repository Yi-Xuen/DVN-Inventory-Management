import type { Preview } from '@storybook/nextjs-vite'
import { Montserrat } from 'next/font/google'
import '../app/globals.css'
import { StoreProvider } from '../lib/store'

// Same font setup as app/layout.tsx so stories render in Montserrat.
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-montserrat' })

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    // The three sizes the components are designed for (see the breakpoints in app/design-system/theme.css).
    viewport: {
      options: {
        mobile: { name: 'Mobile (base, 375)', styles: { width: '375px', height: '812px' }, type: 'mobile' },
        tablet: { name: 'Tablet (md, 768)', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
        desktop: { name: 'Desktop (lg, 1280)', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
      },
    },
    options: { storySort: { order: ['Design tokens', 'Atoms', 'Molecules', 'Organisms', '*'] } },
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
      const theme = context.globals.theme ?? 'light'
      // A Docs page renders every story of a component in one document, so a story that forces dark
      // (globals: { theme: 'dark' }) must not switch the whole page. There, the theme is scoped to each
      // story's own wrapper and the page itself stays light. A single story view themes the whole page.
      document.documentElement.dataset.theme = context.viewMode === 'docs' ? 'light' : theme
      document.documentElement.classList.add(montserrat.variable)
      return (
        <StoreProvider>
          <div data-theme={theme} className="text-fg" style={{ colorScheme: theme }}>
            <Story />
          </div>
        </StoreProvider>
      )
    },
  ],

  // Only the state the app actually reads: its localStorage key and the URL hash route.
  async beforeEach() {
    localStorage.removeItem('dvn-proto-v4')
    window.location.hash = ''
  },
};

export default preview;
