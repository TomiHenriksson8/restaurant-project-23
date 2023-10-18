import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';


export default defineConfig({ 
  build: {
    target: 'esnext', 
  },
  resolve: {
    extensions: ['.js', '.ts', '.ttf', 'png'], 
  },
  plugins: [
    VitePWA({
        injectRegister: "auto",
        manifest: {
         name: 'Restaurant App',
         short_name: 'App',
         description: 'My Restaurant App for School Project',
         icons: [
           {
             src: '/images/icon-180.png', 
             sizes: '180x180',
             type: 'image/png'
           },
           {
            src: '/images/icon-256.png', 
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: '/images/icon-512.png', 
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/images/icon-512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/images/icon-512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
           
         ],
         
         "start_url": "/index.html",
         "background_color": "#ffffff",
         "display": "standalone",
         "theme_color": "#ffffff"
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,jpg,jpeg,json, ttf, woff, woff2}",
        ],
    }
        
})
]
});
