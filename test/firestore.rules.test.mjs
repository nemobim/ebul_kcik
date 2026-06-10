/**
 * Firestore Security Rules 단위 테스트
 *
 * 실행: firebase emulators:exec --only firestore --project demo-ebul "node test/firestore.rules.test.mjs"
 * (firebase.json의 firestore.rules를 에뮬레이터에 로드한 뒤 본 스크립트가 검증)
 *
 * 운영 DB를 사용하지 않고 contents/userReactions 규칙의 핵심 보안 속성을 확인한다.
 */
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { readFileSync } from 'node:fs'

const testEnv = await initializeTestEnvironment({
  projectId: 'demo-ebul',
  firestore: { rules: readFileSync('firestore.rules', 'utf8') },
})

// 인증 미사용(localStorage UUID) 앱이므로 unauthenticated 컨텍스트로 테스트
const db = testEnv.unauthenticatedContext().firestore()

/** 유효한 contents 문서 (createdAt은 withTs에서 serverTimestamp로 채움) */
const validContent = (id = 'doc1', overrides = {}) => ({
  id,
  user: '니니',
  userId: 'u1',
  score: 100,
  worryLabel: 'talk',
  content: '오늘의 흑역사',
  reactions: { shock: 0, laugh: 0, sad: 0 },
  reactionTotal: 0,
  ...overrides,
})

// createdAt == request.time 규칙 검증을 위해 serverTimestamp 사용
const withTs = obj => ({ ...obj, createdAt: serverTimestamp() })

let passed = 0
let failed = 0
const run = async (name, promise) => {
  try {
    await promise
    passed++
    console.log(`  ✓ ${name}`)
  } catch (e) {
    failed++
    console.log(`  ✗ ${name}\n      ${e.message}`)
  }
}

console.log('\n[contents] create')
await run('유효한 점수 저장 허용', assertSucceeds(setDoc(doc(db, 'contents', 'doc1'), withTs(validContent('doc1')))))
await run('음수 score 거부', assertFails(setDoc(doc(db, 'contents', 'bad1'), withTs(validContent('bad1', { score: -5 })))))
await run('허용되지 않은 worryLabel 거부', assertFails(setDoc(doc(db, 'contents', 'bad2'), withTs(validContent('bad2', { worryLabel: 'hacking' })))))
await run('content 500자 초과 거부', assertFails(setDoc(doc(db, 'contents', 'bad3'), withTs(validContent('bad3', { content: 'a'.repeat(501) })))))
await run('user 5자 초과 거부', assertFails(setDoc(doc(db, 'contents', 'bad4'), withTs(validContent('bad4', { user: '여섯글자닉네임' })))))
await run('reactionTotal 0이 아니면 거부', assertFails(setDoc(doc(db, 'contents', 'bad5'), withTs(validContent('bad5', { reactionTotal: 10 })))))
await run('id != docId 거부', assertFails(setDoc(doc(db, 'contents', 'bad6'), withTs(validContent('other-id')))))
await run('정의되지 않은 추가 필드 거부', assertFails(setDoc(doc(db, 'contents', 'bad7'), withTs({ ...validContent('bad7'), hacked: true }))))

// update/delete 테스트용 시드 (규칙 우회 컨텍스트로 생성)
await testEnv.withSecurityRulesDisabled(async ctx => {
  await setDoc(doc(ctx.firestore(), 'contents', 'doc2'), withTs(validContent('doc2')))
})

console.log('\n[contents] update / delete')
await run('공감 1 증가 허용', assertSucceeds(updateDoc(doc(db, 'contents', 'doc2'), { 'reactions.shock': 1, reactionTotal: 1 })))
await run('reactionTotal 누락 시 거부', assertFails(updateDoc(doc(db, 'contents', 'doc2'), { 'reactions.laugh': 1 })))
await run('score 변경 거부', assertFails(updateDoc(doc(db, 'contents', 'doc2'), { score: 99999 })))
await run('userId 변경 거부', assertFails(updateDoc(doc(db, 'contents', 'doc2'), { userId: 'attacker' })))
await run('클라이언트 삭제 거부', assertFails(deleteDoc(doc(db, 'contents', 'doc2'))))

console.log('\n[userReactions]')
await run('shock=true 기록 허용', assertSucceeds(setDoc(doc(db, 'userReactions', 'u1_doc1'), { shock: true })))
await run('shock=false 거부', assertFails(setDoc(doc(db, 'userReactions', 'u2_doc1'), { shock: false })))
await run('허용되지 않은 키 거부', assertFails(setDoc(doc(db, 'userReactions', 'u3_doc1'), { angry: true })))

await testEnv.cleanup()

console.log(`\n결과: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
