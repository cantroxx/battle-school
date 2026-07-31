import { useEffect, useState } from 'react';
import IntroScreen from './screens/IntroScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import BattleScreen from './screens/BattleScreen.jsx';
import ShopScreen from './screens/ShopScreen.jsx';
import DexScreen from './screens/DexScreen.jsx';
import BadgeScreen from './screens/BadgeScreen.jsx';
import {
  newPlayer, xpToNext, WEAPONS, ARMORS, POTIONS,
  towerMonster, todaySubjectId, checkAchievements, titleOf,
} from './game/data.js';
import { loadPlayer, savePlayer, clearPlayer } from './game/storage.js';
import { sfx, setMuted } from './game/sfx.js';
import './App.css';

export default function App() {
  const [player, setPlayer] = useState(loadPlayer);
  const [screen, setScreen] = useState(player ? 'home' : 'intro');
  const [monster, setMonster] = useState(null);
  const [battleKey, setBattleKey] = useState(0); // 다시 도전 시 전투 초기화용
  const [tower, setTower] = useState(null); // 탑 오르는 중이면 { floor, hp }
  const [toast, setToast] = useState(null);

  // 음소거 설정을 효과음 모듈에 반영
  useEffect(() => {
    setMuted(!!player?.muted);
  }, [player?.muted]);

  function update(p) {
    setPlayer(p);
    savePlayer(p);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  function handleCreate(name, avatar) {
    update(newPlayer(name, avatar));
    setScreen('home');
  }

  function handlePref(patch) {
    update({ ...player, ...patch });
  }

  function startBattle(m) {
    setMonster(m);
    setTower(null);
    setBattleKey((k) => k + 1);
    setScreen('battle');
  }

  function startTower(floor = 1, hp = null) {
    setTower({ floor, hp });
    setMonster(towerMonster(floor));
    setBattleKey((k) => k + 1);
    setScreen('battle');
  }

  // 전투가 끝나면 보상·기록·물약 사용을 반영하고 레벨업·업적을 계산한다
  function handleBattleFinish(result, next) {
    const p = { ...player };
    p.correctCount += result.correct;
    p.totalCount += result.total;
    p.subjectCorrect = {
      ...p.subjectCorrect,
      [result.subject]: (p.subjectCorrect?.[result.subject] || 0) + result.correct,
    };
    p.potionSmall -= result.potionsUsed.small;
    p.potionBig -= result.potionsUsed.big;
    if (result.win) {
      p.wins += 1;
      p.gold += result.gold;
      p.xp += result.xp;
      if (result.tower) {
        p.towerBest = Math.max(p.towerBest, result.floor);
      } else {
        p.stageCleared = Math.max(p.stageCleared, result.monsterId);
      }
      let ups = 0;
      while (p.xp >= xpToNext(p.level)) {
        p.xp -= xpToNext(p.level);
        p.level += 1;
        ups += 1;
      }
      if (ups > 0) {
        sfx.levelup();
        showToast(`🎊 레벨 업! Lv.${p.level} — 체력이 늘어났어요!`);
      }
    } else {
      p.losses += 1;
    }

    // 새 업적 확인
    const earned = checkAchievements(p, { maxCombo: result.maxCombo, perfect: result.perfect });
    if (earned.length > 0) {
      p.achievements = [...p.achievements, ...earned];
      if (!p.title) p.title = earned[0]; // 첫 칭호는 자동 착용
      sfx.achievement();
      showToast(`🏅 칭호 획득: ${earned.map(titleOf).join(', ')}!`);
    }
    update(p);

    // 다음 화면 정하기
    if (result.tower) {
      if (next === 'next') {
        startTower(result.floor + 1, result.playerHpLeft); // 체력 이어서 다음 층
      } else if (next === 'retry') {
        startTower(1, null); // 1층부터 새로
      } else {
        setTower(null);
        setScreen('home');
      }
    } else if (next === 'retry') {
      setBattleKey((k) => k + 1); // 같은 몬스터와 새 전투
    } else {
      setScreen('home');
    }
  }

  // 상점: 장비는 지금 것보다 좋은 것만 살 수 있고, 사면 바로 장착
  function buyWeapon(id) {
    const w = WEAPONS[id];
    if (id <= player.weaponId || player.gold < w.price) return;
    sfx.buy();
    afterBuy({ ...player, gold: player.gold - w.price, weaponId: id });
  }

  function buyArmor(id) {
    const a = ARMORS[id];
    if (id <= player.armorId || player.gold < a.price) return;
    sfx.buy();
    afterBuy({ ...player, gold: player.gold - a.price, armorId: id });
  }

  function buyPotion(kind) {
    const p = POTIONS[kind];
    if (player.gold < p.price) return;
    sfx.buy();
    const key = kind === 'small' ? 'potionSmall' : 'potionBig';
    afterBuy({ ...player, gold: player.gold - p.price, [key]: player[key] + 1 });
  }

  // 구매 후에도 업적 확인 (전설의 용검 등)
  function afterBuy(p) {
    const earned = checkAchievements(p, {});
    if (earned.length > 0) {
      p = { ...p, achievements: [...p.achievements, ...earned] };
      if (!p.title) p.title = earned[0];
      sfx.achievement();
      showToast(`🏅 칭호 획득: ${earned.map(titleOf).join(', ')}!`);
    }
    update(p);
  }

  function handleReset() {
    clearPlayer();
    setPlayer(null);
    setTower(null);
    setScreen('intro');
  }

  return (
    <div className="app">
      {/* 음소거 버튼: 어느 화면에서든 보인다 */}
      {player && (
        <button
          className="mute-btn"
          onClick={() => update({ ...player, muted: !player.muted })}
          title="효과음 켜기/끄기"
        >
          {player.muted ? '🔇' : '🔊'}
        </button>
      )}

      {screen === 'intro' && <IntroScreen onCreate={handleCreate} />}
      {screen === 'home' && (
        <HomeScreen
          player={player}
          onChangePref={handlePref}
          onBattle={startBattle}
          onTower={() => startTower(1, null)}
          onGoShop={() => setScreen('shop')}
          onGoDex={() => setScreen('dex')}
          onGoBadges={() => setScreen('badges')}
          onReset={handleReset}
        />
      )}
      {screen === 'battle' && (
        <BattleScreen
          key={battleKey}
          player={player}
          monster={monster}
          mode={tower ? 'tower' : 'normal'}
          startHp={tower?.hp ?? null}
          todayBonus={player.subject === todaySubjectId()}
          onFinish={handleBattleFinish}
        />
      )}
      {screen === 'shop' && (
        <ShopScreen
          player={player}
          onBuyWeapon={buyWeapon}
          onBuyArmor={buyArmor}
          onBuyPotion={buyPotion}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'dex' && <DexScreen player={player} onBack={() => setScreen('home')} />}
      {screen === 'badges' && (
        <BadgeScreen
          player={player}
          onEquipTitle={(id) => update({ ...player, title: id })}
          onBack={() => setScreen('home')}
        />
      )}
      {toast && <div className="levelup-toast">{toast}</div>}
    </div>
  );
}
