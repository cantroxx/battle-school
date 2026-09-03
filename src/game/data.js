/* 게임 기본 데이터: 스토리, 몬스터, 장비, 물약, 레벨 규칙 */

export const STORY = {
  goal: '어둠의 마왕이 「지식의 보석」을 훔쳐 갔어요! 문제를 풀어 몬스터를 물리치고 보석을 되찾는 용사가 되어 주세요.',
  questBefore: '🎯 목표: 어둠의 마왕을 물리치고 「지식의 보석」을 되찾자!',
  questAfter: '🏆 지식의 보석을 되찾았다! 이제 최고 기록에 도전해 보자!',
  finalWin: '💎 지식의 보석을 되찾았다! 배틀 스쿨에 다시 평화가 찾아왔어요!',
};

// 아바타 후보 (캐릭터 만들 때 고른다)
export const AVATARS = ['🦁', '🐯', '🐰', '🦊', '🐼', '🐸', '🦄', '🐢', '🐱', '🐶', '🐧', '🐭'];

// 직업: 조건을 달성하면 마을에서 자유롭게 전직할 수 있다.
export const JOBS = [
  { id: 'warrior', name: '용맹 전사', icon: '🗡️', atk: 2, def: 0, hp: 0,
    skill: '강철 베기', skillDesc: '공격력의 2배 피해', unlock: '처음부터 사용 가능' },
  { id: 'mage', name: '지식 마법사', icon: '🔮', atk: 0, def: 0, hp: 0,
    skill: '지식 폭발', skillDesc: '방어를 무시하는 큰 피해', unlock: 'Lv.3 + 수학·과학 정답 15개' },
  { id: 'ranger', name: '집중 궁수', icon: '🏹', atk: 1, def: 0, hp: 0,
    skill: '집중 조준', skillDesc: '다음 정답을 치명타로', unlock: '5승 또는 5콤보 칭호' },
  { id: 'guardian', name: '수호 기사', icon: '🛡️', atk: 0, def: 2, hp: 20,
    skill: '철벽 수호', skillDesc: '체력 회복 + 다음 피해 60% 감소', unlock: 'Lv.4 + 3승' },
];

export function jobOf(id) {
  return JOBS.find((job) => job.id === id) || JOBS[0];
}

export function isJobUnlocked(player, id) {
  if (id === 'warrior') return true;
  if (id === 'mage') {
    const study = (player.subjectCorrect?.math || 0) + (player.subjectCorrect?.science || 0);
    return player.level >= 3 && study >= 15;
  }
  if (id === 'ranger') return player.wins >= 5 || player.achievements?.includes('combo5');
  if (id === 'guardian') return player.level >= 4 && player.wins >= 3;
  return false;
}

// 같은 가격대에도 공격·치명타·스킬 충전 중 무엇을 고를지 선택할 수 있다.
export const WEAPONS = [
  { id: 0, tier: 0, name: '나무 막대기', icon: '🪵', atk: 5, price: 0 },
  { id: 1, tier: 1, name: '단단한 목검', icon: '🗡️', atk: 8, price: 50 },
  { id: 101, tier: 1, name: '집중 새총', icon: '🎯', atk: 6, crit: 0.08, skillGain: 4, price: 50 },
  { id: 2, tier: 2, name: '반짝 철검', icon: '⚔️', atk: 12, price: 140 },
  { id: 102, tier: 2, name: '마력 지팡이', icon: '🪄', atk: 9, skillGain: 9, price: 140 },
  { id: 3, tier: 3, name: '기사의 창', icon: '🔱', atk: 17, price: 320 },
  { id: 103, tier: 3, name: '바람 활', icon: '🏹', atk: 14, crit: 0.12, price: 320 },
  { id: 4, tier: 4, name: '번개 지팡이', icon: '⚡', atk: 23, price: 650 },
  { id: 104, tier: 4, name: '지식의 책', icon: '📘', atk: 18, skillGain: 14, price: 650 },
  { id: 5, tier: 5, name: '전설의 용검', icon: '🐲', atk: 30, price: 1300 },
  { id: 105, tier: 5, name: '별빛 장궁', icon: '🌠', atk: 25, crit: 0.18, skillGain: 6, price: 1300 },
];

// 방어구: 받는 데미지를 줄여 준다.
export const ARMORS = [
  { id: 0, tier: 0, name: '헝겊 옷', icon: '👕', def: 0, price: 0 },
  { id: 1, tier: 1, name: '가죽 조끼', icon: '🦺', def: 2, price: 40 },
  { id: 101, tier: 1, name: '튼튼 체육복', icon: '🥋', def: 1, hp: 10, price: 40 },
  { id: 2, tier: 2, name: '사슬 갑옷', icon: '⛓️', def: 4, price: 110 },
  { id: 102, tier: 2, name: '집중 망토', icon: '🧣', def: 2, skillGain: 6, hp: 8, price: 110 },
  { id: 3, tier: 3, name: '기사 갑옷', icon: '🛡️', def: 7, price: 260 },
  { id: 103, tier: 3, name: '생명 갑옷', icon: '💚', def: 4, hp: 24, price: 260 },
  { id: 4, tier: 4, name: '마법 로브', icon: '🧙', def: 10, price: 520 },
  { id: 104, tier: 4, name: '별빛 로브', icon: '🌌', def: 7, skillGain: 10, hp: 18, price: 520 },
  { id: 5, tier: 5, name: '용비늘 갑옷', icon: '🐉', def: 14, price: 1000 },
  { id: 105, tier: 5, name: '불사조 갑옷', icon: '🔥', def: 10, hp: 38, skillGain: 5, price: 1000 },
];

// 물약: 전투 중에 마셔서 체력 회복 (마셔도 턴은 안 지나간다)
export const POTIONS = {
  small: { name: '체력 물약', icon: '🧪', heal: 30, price: 15 },
  big: { name: '큰 체력 물약', icon: '🍶', heal: 80, price: 40 },
};

// 사냥터 몬스터: 위로 갈수록 세지고 보상도 커진다.
// 앞 몬스터를 이겨야 다음 몬스터에 도전할 수 있다.
export const MONSTERS = [
  { id: 0, name: '몽글 슬라임', icon: '🫧', hp: 30, atk: 4, gold: 10, xp: 8, weakness: 'science',
    pattern: { every: 4, type: 'heal', value: 7, name: '말랑 재생' },
    desc: '말랑말랑하지만 얕보면 큰코다쳐요.' },
  { id: 1, name: '아기 버섯', icon: '🍄', hp: 45, atk: 6, gold: 15, xp: 12, weakness: 'korean',
    pattern: { every: 3, type: 'rage', value: 3, name: '포자 폭발' },
    desc: '숲에서 온 장난꾸러기. 포자를 뿌려요.' },
  { id: 2, name: '장난꾸러기 고블린', icon: '👺', hp: 60, atk: 8, gold: 24, xp: 18, weakness: 'social',
    pattern: { every: 4, type: 'drain', value: 18, name: '게이지 훔치기' },
    desc: '보석 조각을 주웠다고 자랑하고 다녀요.' },
  { id: 3, name: '들판 늑대', icon: '🐺', hp: 75, atk: 11, gold: 35, xp: 26, weakness: 'math',
    pattern: { every: 3, type: 'rage', value: 5, name: '연속 할퀴기' },
    desc: '밤마다 학교 근처를 어슬렁거려요.' },
  { id: 4, name: '돌주먹 골렘', icon: '🗿', hp: 95, atk: 14, gold: 50, xp: 36, weakness: 'science',
    pattern: { every: 3, type: 'shield', value: 0.5, name: '돌 방패' },
    desc: '주먹은 무겁지만 느려요. 빠르게 답하자!' },
  { id: 5, name: '아기 드래곤', icon: '🐉', hp: 120, atk: 18, gold: 80, xp: 52, weakness: 'fun',
    pattern: { every: 3, type: 'rage', value: 8, name: '불꽃 숨결' },
    desc: '아직 아기라서 불장난을 좋아해요.' },
  { id: 6, name: '어둠의 마왕', icon: '😈', hp: 150, atk: 24, gold: 150, xp: 80, weakness: 'korean',
    pattern: { every: 3, type: 'drain', value: 25, name: '지식 봉인' },
    desc: '「지식의 보석」을 훔쳐 간 장본인!' },
];

export const FINAL_MONSTER_ID = MONSTERS[MONSTERS.length - 1].id;

// ---------- 무한의 탑 ----------
// 마왕을 이기면 열린다. 층이 오를수록 강해지고, 층 사이에 체력이 이어진다.
const TOWER_ICONS = ['👹', '🧟', '👻', '🦇', '💀', '🐍', '👿', '🤖', '🐙', '🌋'];

export function towerMonster(floor) {
  return {
    id: 100 + floor,
    tower: true,
    floor,
    name: `${floor}층 수호자`,
    icon: TOWER_ICONS[(floor - 1) % TOWER_ICONS.length],
    hp: 60 + floor * 30,
    atk: 8 + Math.round(floor * 2.5),
    gold: 20 + floor * 10,
    xp: 15 + floor * 8,
    weakness: ['math', 'korean', 'social', 'science', 'fun'][(floor - 1) % 5],
    pattern: { every: Math.max(2, 5 - Math.floor(floor / 5)), type: floor % 2 ? 'rage' : 'shield', value: floor % 2 ? 3 + floor : 0.5, name: floor % 2 ? '탑의 분노' : '탑의 방벽' },
    desc: `무한의 탑 ${floor}층을 지키는 수호자.`,
  };
}

// ---------- 오늘의 과목 (매일 바뀌는 데미지 1.5배 보너스) ----------
export function todaySubjectId() {
  const d = new Date();
  const keys = ['math', 'korean', 'social', 'science', 'fun'];
  return keys[(d.getFullYear() + d.getMonth() + d.getDate()) % keys.length];
}

// ---------- 칭호·업적 ----------
// cond(플레이어, 이번전투정보)가 참이 되는 순간 획득. extra는 { maxCombo, perfect } 등.
export const ACHIEVEMENTS = [
  { id: 'first-win', title: '용사의 첫걸음', desc: '첫 승리를 거두자', cond: (p) => p.wins >= 1 },
  { id: 'combo5', title: '콤보 마스터', desc: '한 전투에서 5콤보 달성', cond: (p, x) => (x?.maxCombo || 0) >= 5 },
  { id: 'perfect', title: '완벽한 승리', desc: '문제 4개 이상을 모두 맞히고 승리', cond: (p, x) => !!x?.perfect },
  { id: 'boss', title: '보석의 수호자', desc: '어둠의 마왕을 물리치자', cond: (p) => p.stageCleared >= FINAL_MONSTER_ID },
  { id: 'rich', title: '꼬마 부자', desc: '골드 500G 모으기', cond: (p) => p.gold >= 500 },
  { id: 'sword', title: '전설의 용사', desc: '5단계 전설 무기를 손에 넣자', cond: (p) => (WEAPONS.find((w) => w.id === p.weaponId)?.tier || 0) >= 5 },
  { id: 'wins20', title: '백전노장', desc: '20승 달성', cond: (p) => p.wins >= 20 },
  { id: 'math50', title: '수학 박사', desc: '수학 문제 50개 정답', cond: (p) => (p.subjectCorrect?.math || 0) >= 50 },
  { id: 'korean50', title: '국어 왕', desc: '국어 문제 50개 정답', cond: (p) => (p.subjectCorrect?.korean || 0) >= 50 },
  { id: 'tower5', title: '탑 등반가', desc: '무한의 탑 5층 도달', cond: (p) => p.towerBest >= 5 },
  { id: 'tower10', title: '하늘에 닿은 자', desc: '무한의 탑 10층 도달', cond: (p) => p.towerBest >= 10 },
];

export function titleOf(id) {
  const a = ACHIEVEMENTS.find((a) => a.id === id);
  return a ? a.title : null;
}

// 새로 획득한 업적 id 목록을 돌려준다
export function checkAchievements(player, extra) {
  return ACHIEVEMENTS.filter(
    (a) => !player.achievements.includes(a.id) && a.cond(player, extra),
  ).map((a) => a.id);
}

// 레벨 규칙: 다음 레벨까지 필요한 경험치, 레벨이 오르면 체력 +10
export const xpToNext = (level) => level * 50;
export const maxHpOf = (level) => 40 + level * 10;

// 캐릭터의 실제 능력치 (레벨 + 장비 합산)
export function statsOf(player) {
  const weapon = WEAPONS.find((w) => w.id === player.weaponId) || WEAPONS[0];
  const armor = ARMORS.find((a) => a.id === player.armorId) || ARMORS[0];
  const job = jobOf(player.jobId);
  return {
    maxHp: maxHpOf(player.level) + (armor.hp || 0) + job.hp,
    atk: weapon.atk + job.atk,
    def: armor.def + job.def,
    crit: 0.1 + (weapon.crit || 0),
    skillGain: 34 + (weapon.skillGain || 0) + (armor.skillGain || 0),
    weapon,
    armor,
    job,
  };
}

export function newPlayer(name, avatar) {
  return {
    name,
    avatar,
    level: 1,
    xp: 0,
    gold: 0,
    weaponId: 0,
    armorId: 0,
    ownedWeaponIds: [0],
    ownedArmorIds: [0],
    jobId: 'warrior',
    skillGauge: 0,
    potionSmall: 1, // 시작 선물로 물약 1개
    potionBig: 0,
    stageCleared: -1, // 이긴 몬스터 중 가장 높은 번호 (-1이면 아직 없음)
    wins: 0,
    losses: 0,
    correctCount: 0, // 정답률 기록 — 3단계 친구 대결에서 쓰인다
    totalCount: 0,
    subjectCorrect: {}, // 과목별 정답 수 (업적용)
    subject: 'math',
    grade: 4,
    towerBest: 0, // 무한의 탑 최고 기록
    achievements: [], // 얻은 업적 id들
    title: null, // 이름 옆에 표시할 칭호 (업적 id)
    muted: false, // 효과음 끄기
  };
}
