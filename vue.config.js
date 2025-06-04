const { defineConfig } = require("@vue/cli-service")

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/main.scss";`,
      },
    },
  },
  // Configurar proxy para desarrollo
  devServer: {
    port: 8081,
    host: "0.0.0.0", // Permitir acceso desde IP local
    allowedHosts: "all",
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
    // Configurar headers para PWA en desarrollo
    headers: {
      "Service-Worker-Allowed": "/",
    },
    // Evitar problemas de MIME type
    static: {
      serveIndex: false,
    },
  },

  // Configuración específica para desarrollo vs producción
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      // Configuración para desarrollo
      config.devtool = "eval-source-map"

      // Evitar problemas con hot reload y service worker
      config.output.filename = "js/[name].js"
      config.output.chunkFilename = "js/[name].js"
    } else {
      // Optimizaciones para producción
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      }
    }
  },

  // Definir feature flags
  chainWebpack: (config) => {
    config.plugin("define").tap((args) => {
      args[0]["__VUE_PROD_HYDRATION_MISMATCH_DETAILS__"] = "false"
      return args
    })

    // Solo aplicar optimizaciones PWA en producción
    if (process.env.NODE_ENV === "production") {
      // Optimizaciones para PWA
      config.plugin("preload").tap((options) => {
        options[0] = {
          rel: "preload",
          include: "initial",
          fileBlacklist: [/\.map$/, /hot-update\.js$/],
        }
        return options
      })

      // Prefetch optimization
      config.plugin("prefetch").tap((options) => {
        options[0].fileBlacklist = options[0].fileBlacklist || []
        options[0].fileBlacklist.push(/\.map$/, /hot-update\.js$/)
        return options
      })
    }
  },

  // Configuración de publicPath
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
})
