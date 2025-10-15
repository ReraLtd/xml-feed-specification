import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/xml-feed-specification/',
  title: "RERA XML",
  description: "Specification",
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        href: 'favicon-32x32.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: 'favicon-16x16.png'
      }
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: 'apple-icon-180x180.png'
      }
    ]
  ],
  themeConfig: {
    logo: 'apple-icon-180x180.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Import', link: '/import-specification' },
      { text: 'Examples', link: '/examples' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/reraltd/xml-feed-specification' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/rera-cy/' },
      { icon: 'instagram', link: 'https://www.instagram.com/rera.cy/' },
    ]
  }
})
