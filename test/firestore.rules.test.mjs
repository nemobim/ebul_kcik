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
await run('한글 외 닉네임 거부', assertFails(setDoc(doc(db, 'contents', 'bad8'), withTs(validContent('bad8', { user: 'abc' })))))
await run('빈 닉네임 거부', assertFails(setDoc(doc(db, 'contents', 'bad9'), withTs(validContent('bad9', { user: '' })))))
await run('한글+영문 혼용 닉네임 거부(정규식 앵커 확인)', assertFails(setDoc(doc(db, 'contents', 'bad14'), withTs(validContent('bad14', { user: '니니a' })))))
await run('script 태그 닉네임 거부', assertFails(setDoc(doc(db, 'contents', 'bad15'), withTs(validContent('bad15', { user: '<script>' })))))
await run('상한(3000m) 경계값 허용', assertSucceeds(setDoc(doc(db, 'contents', 'edge1'), withTs(validContent('edge1', { score: 3000 })))))
await run('상한 초과 점수 거부', assertFails(setDoc(doc(db, 'contents', 'bad10'), withTs(validContent('bad10', { score: 3001 })))))
await run('비현실적 점수(999999) 거부', assertFails(setDoc(doc(db, 'contents', 'bad11'), withTs(validContent('bad11', { score: 999999 })))))
await run('소수점 score 거부', assertFails(setDoc(doc(db, 'contents', 'bad12'), withTs(validContent('bad12', { score: 12.5 })))))
await run('64자 초과 userId 거부', assertFails(setDoc(doc(db, 'contents', 'bad13'), withTs(validContent('bad13', { userId: 'u'.repeat(65) })))))
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

/** 유효한 scores 문서 (updatedAt은 withTs에서 serverTimestamp로 채움) */
const validScore = (id = 'u1', overrides = {}) => ({
  userId: id,
  user: '니니',
  score: 100,
  ...overrides,
})
const withUpdatedAt = obj => ({ ...obj, updatedAt: serverTimestamp() })

console.log('\n[scores] create')
await run('유효한 최고기록 생성 허용', assertSucceeds(setDoc(doc(db, 'scores', 'u1'), withUpdatedAt(validScore('u1')))))
await run('docId != userId 거부', assertFails(setDoc(doc(db, 'scores', 'u2'), withUpdatedAt(validScore('other')))))
await run('음수 score 거부', assertFails(setDoc(doc(db, 'scores', 'sbad1'), withUpdatedAt(validScore('sbad1', { score: -1 })))))
await run('상한 초과 score 거부', assertFails(setDoc(doc(db, 'scores', 'sbad2'), withUpdatedAt(validScore('sbad2', { score: 3001 })))))
await run('상한(3000) 경계값 허용', assertSucceeds(setDoc(doc(db, 'scores', 'sedge1'), withUpdatedAt(validScore('sedge1', { score: 3000 })))))
await run('한글 외 닉네임 거부', assertFails(setDoc(doc(db, 'scores', 'sbad3'), withUpdatedAt(validScore('sbad3', { user: 'abc' })))))
await run('빈 닉네임 거부', assertFails(setDoc(doc(db, 'scores', 'sbad4'), withUpdatedAt(validScore('sbad4', { user: '' })))))
await run('닉네임 6자 이상 거부', assertFails(setDoc(doc(db, 'scores', 'sbad5'), withUpdatedAt(validScore('sbad5', { user: '여섯글자닉네임' })))))
await run('정의되지 않은 추가 필드 거부', assertFails(setDoc(doc(db, 'scores', 'sbad6'), withUpdatedAt({ ...validScore('sbad6'), hacked: true }))))
await run('updatedAt 누락 거부', assertFails(setDoc(doc(db, 'scores', 'sbad7'), validScore('sbad7'))))

// scores update 테스트 시드 (규칙 우회 컨텍스트로 기존 기록 100점 생성)
await testEnv.withSecurityRulesDisabled(async ctx => {
  await setDoc(doc(ctx.firestore(), 'scores', 'u3'), withUpdatedAt(validScore('u3', { score: 100 })))
})

console.log('\n[scores] update / delete')
await run('점수 증가 update 허용', assertSucceeds(updateDoc(doc(db, 'scores', 'u3'), { score: 200, updatedAt: serverTimestamp() })))
await run('점수 감소 update 거부', assertFails(updateDoc(doc(db, 'scores', 'u3'), { score: 50, updatedAt: serverTimestamp() })))
await run('점수 동일 update 거부 (증가만 허용)', assertFails(updateDoc(doc(db, 'scores', 'u3'), { score: 200, updatedAt: serverTimestamp() })))
await run('userId 변경 거부', assertFails(updateDoc(doc(db, 'scores', 'u3'), { userId: 'attacker', score: 500, updatedAt: serverTimestamp() })))
await run('닉네임 변경 허용 (점수 증가 동반)', assertSucceeds(updateDoc(doc(db, 'scores', 'u3'), { user: '초코', score: 250, updatedAt: serverTimestamp() })))
await run('닉네임만 변경 거부 (점수 미증가)', assertFails(updateDoc(doc(db, 'scores', 'u3'), { user: '초코', updatedAt: serverTimestamp() })))
await run('상한 초과 update 거부', assertFails(updateDoc(doc(db, 'scores', 'u3'), { score: 3001, updatedAt: serverTimestamp() })))
await run('클라이언트 삭제 거부', assertFails(deleteDoc(doc(db, 'scores', 'u3'))))

await testEnv.cleanup()

console.log(`\n결과: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
