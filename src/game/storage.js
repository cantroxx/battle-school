/* localStorage 저장/불러오기 (1~2단계용. 3단계에서 Firebase로 확장) */
import { newPlayer } from './data.js';

const KEY = 'battle-school-save-v1';

export function loadPlayer() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    // 예전 저장본에 없는 새 항목(물약 등)은 기본값으로 채운다
    return { ...newPlayer('용사', '🦁'), ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function savePlayer(player) {
  localStorage.setItem(KEY, JSON.stringify(player));
}

export function clearPlayer() {
  localStorage.removeItem(KEY);
}
