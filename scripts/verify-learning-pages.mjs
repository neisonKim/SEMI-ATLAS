import assert from 'node:assert/strict';
import { concepts } from '../lib/data.mjs';
import { conceptQuizzes } from '../lib/concept-quizzes.mjs';
const base = new URL(process.argv[2] || 'http://127.0.0.1:3102');
assert(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname));
const encode = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
for (const concept of concepts) {
  const response = await fetch(new URL(`/concept/${concept.id}/`, base));
  assert.equal(response.status, 200);
  const html = await response.text();
  const quiz = html.match(/<section(?=[^>]*\bid="quiz")[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert(quiz && html.includes('href="#quiz"'), concept.id);
  assert.equal((quiz.match(/<fieldset/g) || []).length, 3, concept.id);
  assert.equal((quiz.match(/type="radio"/g) || []).length, 9);
  for (const question of conceptQuizzes[concept.id]) {
    assert(quiz.includes(encode(question.question)) && quiz.includes(`data-question-id="${question.id}"`));
    for (const option of question.options) assert(quiz.includes(encode(option.text)));
    assert(html.includes(`id="${question.review}"`), question.id);
  }
  assert(quiz.includes(`data-read-complete="${concept.id}"`) && quiz.includes('/learn/#my-progress'));
  assert(html.includes('data-reading-status="incomplete"'), 'SSR cannot claim someone has read a lesson.');
}
const learn = await (await fetch(new URL('/learn/', base))).text();
assert(learn.includes('id="my-progress"') && learn.includes('다른 기기와 동기화되지 않으며'));
assert.equal((learn.match(/class="lesson-row"/g) || []).length, 30);
assert(learn.includes('기록을 불러오는 중'));
console.log('Learning pages PASS: all 30 concept quizzes (90 questions, 270 radio choices), review targets, reading control and learning dashboard with private hydration-safe initial state.');
