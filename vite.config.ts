import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 이미지 인라인(base64)/파일 이원화 제거 — 같은 화면 이미지가 서로 다른 시점에 나타나는 문제 해소.
    // 상세: docs/ISSUE-IMAGE-LOADING.md §1
    assetsInlineLimit: 0,
  },
})
