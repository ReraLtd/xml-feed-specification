import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RERA XML feed",
  description: "Specification",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Import Specification', link: '/import-specification' }
    ],

    sidebar: [
      {
        text: 'XML Import Specification',
        items: [
          { text: 'Getting Started', link: '/import-specification#getting-started' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/reraltd/xml-feed-specification' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/rera-cy/' },
      { icon: 'instagram', link: 'https://www.instagram.com/rera.cy/' },
    ]
  }
})
