/* 게임 기본 데이터: 스토리, 몬스터, 장비, 물약, 레벨 규칙 */

export const STORY = {
  goal: '어둠의 마왕이 「지식의 보석」을 훔쳐 갔어요! 문제를 풀어 몬스터를 물리치고 보석을 되찾는 용사가 되어 주세요.',
  questBefore: '🎯 목표: 어둠의 마왕을 물리치고 「지식의 보석」을 되찾자!',
  questAfter: '🏆 지식의 보석을 되찾았다! 이제 최고 기록에 도전해 보자!',
  finalWin: '💎 지식의 보석을 되찾았다! 배틀 스쿨에 다시 평화가 찾아왔어요!',
};

// 아바타 후보 (캐릭터 만들 때 고른다)
export const AVATARS = ['🦁', '🐯', '🐰', '🦊', '🐼', '🐸', '🦄', '🐢', '🐱', '🐶', '🐧', '🐭'];

// 무기: 공격력을 정한다. 상점에서 골드로 구매(사면 바로 장착).
export const WEAPONS = [
  { id: 0, name: '나무 막대기', icon: '🪵', atk: 5, price: 0 },
  { id: 1, name: '단단한 목검', icon: '🗡️', atk: 8, price: 50 },
  { id: 2, name: '반짝 철검', icon: '⚔️', atk: 12, price: 140 },
  { id: 3, name: '기사의 창', icon: '🔱', atk: 17, price: 320 },
  { id: 4, name: '번개 지팡이', icon: '⚡', atk: 23, price: 650 },
  { id: 5, name: '전설의 용검', icon: '🐲', atk: 30, price: 1300 },
];

// 방어구: 받는 데미지를 줄여 준다.
export const ARMORS = [
  { id: 0, name: '헝겊 옷', icon: '👕', def: 0, price: 0 },
  { id: 1, name: '가죽 조끼', icon: '🦺', def: 2, price: 40 },
  { id: 2, name: '사슬 갑옷', icon: '⛓️', def: 4, price: 110 },
  { id: 3, name: '기사 갑옷', icon: '🛡️', def: 7, price: 260 },
  { id: 4, name: '마법 로브', icon: '🧙', def: 10, price: 520 },
  { id: 5, name: '용비늘 갑옷', icon: '🐉', def: 14, price: 1000 },
];

// 물약: 전투 중에 마셔서 체력 회복 (마셔도 턴은 안 지나간다)
export const POTIONS = {
  small: { name: '체력 물약', icon: '🧪', heal: 30, price: 15 },
  big: { name: '큰 체력 물약', icon: '🍶', heal: 80, price: 40 },
};

// 사냥터 몬스터: 위로 갈수록 세지고 보상도 커진다.
// 앞 몬스터를 이겨야 다음 몬스터에 도전할 수 있다.
export const MONSTERS = [
  { id: 0, name: '몽글 슬라임', icon: '🫧', hp: 30, atk: 4, gold: 10, xp: 8,
    desc: '말랑말랑하지만 얕보면 큰코다쳐요.' },
  { id: 1, name: '아기 버섯', icon: '🍄', hp: 45, atk: 6, gold: 15, xp: 12,
    desc: '숲에서 온 장난꾸러기. 포자를 뿌려요.' },
  { id: 2, name: '장난꾸러기 고블린', icon: '👺', hp: 60, atk: 8, gold: 24, xp: 18,
    desc: '보석 조각을 주웠다고 자랑하고 다녀요.' },
  { id: 3, name: '들판 늑대', icon: '🐺', hp: 75, atk: 11, gold: 35, xp: 26,
    desc: '밤마다 학교 근처를 어슬렁거려요.' },
  { id: 4, name: '돌주먹 골렘', icon: '🗿', hp: 95, atk: 14, gold: 50, xp: 36,
    desc: '주먹은 무겁지만 느려요. 빠르게 답하자!' },
  { id: 5, name: '아기 드래곤', icon: '🐉', hp: 120, atk: 18, gold: 80, xp: 52,
    desc: '아직 아기라서 불장난을 좋아해요.' },
  { id: 6, name: '어둠의 마왕', icon: '😈', hp: 150, atk: 24, gold: 150, xp: 80,
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
  { id: 'sword', title: '전설의 용사', desc: '전설의 용검을 손에 넣자', cond: (p) => p.weaponId >= 5 },
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
  const weapon = WEAPONS[player.weaponId] || WEAPONS[0];
  const armor = ARMORS[player.armorId] || ARMORS[0];
  return {
    maxHp: maxHpOf(player.level),
    atk: weapon.atk,
    def: armor.def,
    weapon,
    armor,
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
