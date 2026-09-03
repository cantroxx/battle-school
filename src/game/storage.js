/* localStorage 저장/불러오기 (1~2단계용. 3단계에서 Firebase로 확장) */
import { newPlayer } from './data.js';

const KEY = 'battle-school-save-v1';

export function migratePlayer(saved) {
  const base = newPlayer(saved?.name || '용사', saved?.avatar || '🦁');
  const player = { ...base, ...(saved || {}) };
  player.ownedWeaponIds = Array.from(new Set([0, ...(saved?.ownedWeaponIds || []), player.weaponId]));
  player.ownedArmorIds = Array.from(new Set([0, ...(saved?.ownedArmorIds || []), player.armorId]));
  player.jobId = saved?.jobId || 'warrior';
  player.skillGauge = Math.min(100, Math.max(0, Number(saved?.skillGauge) || 0));
  return player;
}

export function loadPlayer() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    // 예전 저장본에 없는 직업·장비 보유·스킬 필드를 안전하게 채운다.
    return migratePlayer(JSON.parse(raw));
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
