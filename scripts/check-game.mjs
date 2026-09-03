import assert from 'node:assert/strict';
import {
  ARMORS, JOBS, MONSTERS, WEAPONS, isJobUnlocked, newPlayer, statsOf, towerMonster,
} from '../src/game/data.js';
import { answerDamage, monsterDamage, nextGauge, skillDamage } from '../src/game/combat.js';
import { migratePlayer } from '../src/game/storage.js';

const oldSave = { name: '기존용사', avatar: '🐯', level: 5, wins: 4, weaponId: 3, armorId: 2 };
const migrated = migratePlayer(oldSave);
assert.equal(migrated.name, '기존용사');
assert.equal(migrated.jobId, 'warrior');
assert.ok(migrated.ownedWeaponIds.includes(3));
assert.ok(migrated.ownedArmorIds.includes(2));

assert.equal(JOBS.length, 4);
const mageCandidate = { ...newPlayer('마법', '🦊'), level: 3, subjectCorrect: { math: 8, science: 7 } };
assert.equal(isJobUnlocked(mageCandidate, 'mage'), true);
assert.equal(isJobUnlocked(newPlayer('새싹', '🐰'), 'mage'), false);

for (const price of [50, 140, 320, 650, 1300]) {
  assert.equal(WEAPONS.filter((item) => item.price === price).length, 2);
}
for (const price of [40, 110, 260, 520, 1000]) {
  assert.equal(ARMORS.filter((item) => item.price === price).length, 2);
}
assert.equal(new Set(WEAPONS.map((item) => item.id)).size, WEAPONS.length);
assert.equal(new Set(ARMORS.map((item) => item.id)).size, ARMORS.length);

const warrior = statsOf({ ...migrated, jobId: 'warrior', weaponId: 2, armorId: 2 });
const guardian = statsOf({ ...migrated, jobId: 'guardian', weaponId: 102, armorId: 103 });
assert.ok(warrior.atk > guardian.atk);
assert.ok(guardian.maxHp > warrior.maxHp);
assert.ok(guardian.def > warrior.def);

const normal = answerDamage({ stats: warrior, combo: 1, timeLeft: 10, todayBonus: false, weakness: false, critical: false });
const weak = answerDamage({ stats: warrior, combo: 1, timeLeft: 10, todayBonus: false, weakness: true, critical: false });
assert.ok(weak > normal);
assert.equal(answerDamage({ stats: warrior, combo: 1, timeLeft: 10, todayBonus: false, weakness: false, critical: false, shield: true }), Math.max(1, Math.round(normal * 0.5)));
assert.ok(monsterDamage({ monsterAtk: 20, defense: 4, danger: true }) > monsterDamage({ monsterAtk: 20, defense: 4, danger: false }));
assert.ok(monsterDamage({ monsterAtk: 20, defense: 4, danger: false, guarded: true }) < monsterDamage({ monsterAtk: 20, defense: 4, danger: false }));
assert.equal(nextGauge(90, 34), 100);
assert.ok(skillDamage('mage', warrior, 150) > warrior.atk);

assert.ok(MONSTERS.every((monster) => monster.weakness && monster.pattern));
const tower = towerMonster(10);
assert.equal(tower.floor, 10);
assert.ok(tower.weakness && tower.pattern && tower.hp > towerMonster(1).hp);

console.log('battle-school game checks passed');
