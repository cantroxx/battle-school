/* 문제 출제 어댑터
 * - problems.js(수학 자동 생성)와 bank.js(국어·사회·과학·인기 문제은행)를
 *   그대로 가져와서(퀴즈 서바이버에서 복사) 하나의 함수로 감싼다.
 * - 문제 형식: { unit, text, choices[4], answerIndex } */
import './problems.js';
import './bank.js';

export const SUBJECTS = window.MS_Bank.SUBJECTS; // math·korean·social·science·fun

// 학년 선택이 의미 있는 과목 (나머지는 전 학년 공통)
export const GRADED_SUBJECTS = ['math', 'social', 'science'];

export function getQuestion(subjectId, grade = 4) {
  if (subjectId === 'math') return window.MS_Problems.generate(grade);
  return window.MS_Bank.serve(subjectId, grade);
}
