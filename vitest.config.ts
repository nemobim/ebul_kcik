import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 순수 로직 단위 테스트만 포함. 에뮬레이터 기반 Rules 테스트(test/*.mjs)는 npm run test:rules로 별도 실행
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
