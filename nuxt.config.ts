export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },

  // Только те SCSS-файлы, которые должны стать глобальным CSS (стили, а не переменные)
  css: ['@/assets/scss/reset.scss', '@/assets/scss/global.scss'],

  // Глобальные переменные для всех компонентов (без отдельного HTTP-запроса)
  vite: {
    server: {
      allowedHosts: [
        'chinazes-auto.shares.zrok.io'
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables" as *;',
        },
      },
    },
  },

  app: {
    head: {
      title: 'ЧиназесАвто',
      htmlAttrs: { lang: 'ru' },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/icons/logo/icon.svg' }],
    },
  },

  modules: ['@nuxt/image', 'nuxt-ru-slugify'],
  image: {
    provider: 'ipx',
  },
})