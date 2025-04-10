import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {viteSingleFile} from "vite-plugin-singlefile";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(
            {}
        ),
        viteSingleFile({useRecommendedBuildConfig: false}),
        tsconfigPaths()
    ],
    server: {
        port: 4200
    },

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "tailwindcss/base"; @import "tailwindcss/components"; @import "tailwindcss/utilities";`
            }
        }
    }

})