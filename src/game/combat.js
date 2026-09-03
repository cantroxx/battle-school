import { jobOf } from './data.js';

export function answerDamage({ stats, combo, timeLeft, todayBonus, weakness, critical, roll = 0, shield = false }) {
  const speedBonus = timeLeft >= 15 ? 3 : timeLeft >= 10 ? 2 : timeLeft >= 5 ? 1 : 0;
  const comboMultiplier = 1 + 0.2 * (Math.min(combo, 5) - 1);
  const subjectMultiplier = (todayBonus ? 1.5 : 1) * (weakness ? 1.35 : 1);
  const shieldMultiplier = shield ? 0.5 : 1;
  return Math.max(1, Math.round((stats.atk + roll + speedBonus) * comboMultiplier * subjectMultiplier * shieldMultiplier) * (critical ? 2 : 1));
}

export function monsterDamage({ monsterAtk, defense, danger, specialBonus = 0, guarded = false, roll = 0 }) {
  const raw = Math.max(1, monsterAtk + specialBonus + roll - defense) * (danger ? 2 : 1);
  return Math.max(1, Math.round(raw * (guarded ? 0.4 : 1)));
}

export function skillDamage(jobId, stats, monsterMaxHp) {
  if (jobId === 'mage') return Math.round(stats.atk * 1.6 + monsterMaxHp * 0.15);
  return Math.round(stats.atk * 2);
}

export function skillText(jobId) {
  const job = jobOf(jobId);
  return `${job.icon} ${job.skill}`;
}

export function nextGauge(current, gain) {
  return Math.min(100, Math.max(0, current + gain));
}
