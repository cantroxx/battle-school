import { useEffect, useRef, useState } from 'react';
import { statsOf, POTIONS, FINAL_MONSTER_ID, STORY } from '../game/data.js';
import { getQuestion } from '../questions/index.js';
import { sfx } from '../game/sfx.js';

const TURN_SECONDS = 20;
const rand = (n) => Math.floor(Math.random() * (n + 1));

// 몇 번째 문제가 몬스터의 '강공격 찬스'인지 (3, 6, 9번째…)
const isDangerTurn = (qNumber) => qNumber % 3 === 2;

/* 전투: 매 턴 문제가 나오고, 맞히면 내가 공격 / 틀리면 몬스터가 공격
 * - 연속 정답 콤보: 데미지 배율이 올라간다 (최대 x1.8)
 * - 빠른 정답 보너스 + 오늘의 과목 보너스(x1.5)
 * - 강공격 턴: 틀리면 몬스터 데미지 2배!
 * - mode='tower'면 승리 후 다음 층으로 올라갈 수 있고 체력이 이어진다 */
export default function BattleScreen({ player, monster, onFinish, mode = 'normal', startHp = null, todayBonus = false }) {
  const stats = statsOf(player);
  const firstFinal =
    mode === 'normal' && monster.id === FINAL_MONSTER_ID && player.stageCleared < FINAL_MONSTER_ID;

  const [playerHp, setPlayerHp] = useState(startHp ?? stats.maxHp);
  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [question, setQuestion] = useState(() => getQuestion(player.subject, player.grade));
  const [qNumber, setQNumber] = useState(0);
  const [phase, setPhase] = useState('ask'); // ask → feedback → (ask 반복) → end
  const [chosen, setChosen] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);
  const [message, setMessage] = useState('문제를 맞히면 공격 성공!');
  const [combo, setCombo] = useState(0);
  const [result, setResult] = useState(null); // { win }
  const [fx, setFx] = useState(''); // 'p-atk'(내가 공격) | 'm-atk'(몬스터가 공격)
  const [popup, setPopup] = useState(null); // { target, text, kind, key }
  const [potions, setPotions] = useState({ small: player.potionSmall, big: player.potionBig });
  const score = useRef({ correct: 0, total: 0 });
  const used = useRef({ small: 0, big: 0 });
  const maxCombo = useRef(0);
  const wrongList = useRef([]); // 오답 복습용: 틀린 문제와 정답
  const answerRef = useRef(answer);
  answerRef.current = answer;

  const danger = isDangerTurn(qNumber);

  // 강공격 턴이 시작되면 경고음
  useEffect(() => {
    if (phase === 'ask' && danger) sfx.danger();
  }, [qNumber, phase, danger]);

  // 남은 시간 세기 (문제를 풀고 있을 때만)
  useEffect(() => {
    if (phase !== 'ask') return;
    if (timeLeft <= 0) {
      answerRef.current(-1); // 시간 초과는 오답 처리
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  function showPopup(target, text, kind) {
    setPopup({ target, text, kind, key: Date.now() });
  }

  function answer(idx) {
    if (phase !== 'ask') return;
    setChosen(idx);
    setPhase('feedback');
    score.current.total += 1;

    const isCorrect = idx === question.answerIndex;
    if (isCorrect) {
      score.current.correct += 1;
      const c = combo + 1;
      setCombo(c);
      maxCombo.current = Math.max(maxCombo.current, c);
      sfx.correct();
      if (c >= 2) sfx.combo(c);

      // 데미지 = (공격력 + 무작위 + 빠르기 보너스) × 콤보 배율 × 오늘의 과목 보너스, 10%로 치명타 2배
      const speedBonus = timeLeft >= 15 ? 3 : timeLeft >= 10 ? 2 : timeLeft >= 5 ? 1 : 0;
      const mult = 1 + 0.2 * (Math.min(c, 5) - 1);
      const crit = Math.random() < 0.1;
      const dmg =
        Math.round((stats.atk + rand(3) + speedBonus) * mult * (todayBonus ? 1.5 : 1)) *
        (crit ? 2 : 1);

      const nextHp = Math.max(0, monsterHp - dmg);
      setTimeout(() => {
        setMonsterHp(nextHp);
        setFx('p-atk');
        if (crit) sfx.crit();
        else sfx.hit();
        showPopup('monster', `-${dmg}`, crit ? 'crit' : 'dmg');
      }, 250);

      const notes = [];
      if (crit) notes.push('💥 치명타!');
      if (c >= 2) notes.push(`🔥 ${c}콤보`);
      if (todayBonus) notes.push('⭐ 과목 보너스');
      else if (speedBonus >= 2) notes.push('⚡ 빠름');
      setMessage(`정답! ⚔️ ${dmg} 데미지! ${notes.join(' ')}`);
      after(1700, () => (nextHp <= 0 ? end(true) : nextTurn()));
    } else {
      // 오답 복습용으로 기록
      wrongList.current.push({
        text: question.text,
        answer: question.choices[question.answerIndex],
        chosen: idx === -1 ? '(시간 초과)' : question.choices[idx],
      });
      setCombo(0);
      sfx.wrong();
      const strong = danger;
      let dmg = Math.max(1, monster.atk + rand(2) - stats.def);
      if (strong) dmg *= 2;
      const nextHp = Math.max(0, playerHp - dmg);
      setTimeout(() => {
        setPlayerHp(nextHp);
        setFx('m-atk');
        sfx.hit();
        showPopup('player', `-${dmg}`, strong ? 'crit' : 'dmg');
      }, 350);
      const head = idx === -1 ? '시간 초과!' : '아쉬워요!';
      setMessage(
        strong
          ? `${head} ${monster.name}의 강공격!! 💥💥 ${dmg} 데미지`
          : `${head} ${monster.name}의 반격! 💥 ${dmg} 데미지`,
      );
      after(2300, () => (nextHp <= 0 ? end(false) : nextTurn()));
    }
  }

  function drinkPotion(kind) {
    if (phase !== 'ask') return;
    if (potions[kind] <= 0 || playerHp >= stats.maxHp) return;
    const heal = POTIONS[kind].heal;
    setPotions((p) => ({ ...p, [kind]: p[kind] - 1 }));
    used.current[kind] += 1;
    setPlayerHp((hp) => Math.min(stats.maxHp, hp + heal));
    sfx.potion();
    showPopup('player', `+${heal}`, 'heal');
  }

  function after(ms, fn) {
    setTimeout(fn, ms);
  }

  function nextTurn() {
    setQuestion(getQuestion(player.subject, player.grade));
    setQNumber((n) => n + 1);
    setChosen(-1);
    setTimeLeft(TURN_SECONDS);
    setFx('');
    setPhase('ask');
    setMessage('문제를 맞히면 공격 성공!');
  }

  function end(win) {
    setResult({ win });
    setPhase('end');
    if (win) sfx.victory();
    else sfx.defeat();
  }

  function finish(next) {
    onFinish(
      {
        win: result.win,
        monsterId: monster.id,
        tower: !!monster.tower,
        floor: monster.floor || 0,
        gold: result.win ? monster.gold : 0,
        xp: result.win ? monster.xp : 0,
        correct: score.current.correct,
        total: score.current.total,
        subject: player.subject,
        maxCombo: maxCombo.current,
        perfect:
          result.win && score.current.total >= 4 && score.current.correct === score.current.total,
        potionsUsed: { ...used.current },
        playerHpLeft: playerHp,
      },
      next,
    );
  }

  return (
    <div className="screen battle">
      {mode === 'tower' && <div className="tower-banner">🗼 무한의 탑 — {monster.floor}층</div>}

      {/* 전투 무대: 내 캐릭터 vs 몬스터 */}
      <div className="arena card">
        <Fighter
          icon={player.avatar}
          name={`${player.name} Lv.${player.level}`}
          hp={playerHp}
          maxHp={stats.maxHp}
          fxClass={fx === 'p-atk' ? 'lunge' : fx === 'm-atk' ? 'shake' : ''}
          popup={popup && popup.target === 'player' ? popup : null}
        />
        <div className="vs-col">
          <div className="vs">VS</div>
          {combo >= 2 && <div className="combo-badge">🔥 {combo}콤보!</div>}
        </div>
        <Fighter
          icon={monster.icon}
          name={monster.name}
          hp={monsterHp}
          maxHp={monster.hp}
          fxClass={fx === 'm-atk' ? 'lunge-left' : fx === 'p-atk' ? 'shake' : ''}
          popup={popup && popup.target === 'monster' ? popup : null}
          enemy
        />
      </div>

      <div className={`battle-message ${fx === 'p-atk' ? 'good' : fx === 'm-atk' ? 'bad' : ''}`}>
        {message}
      </div>

      {/* 문제 카드 */}
      {phase !== 'end' && (
        <div className={`card question-card ${danger && phase === 'ask' ? 'danger' : ''}`}>
          {danger && phase === 'ask' && (
            <div className="danger-banner">⚠️ {monster.name}이(가) 힘을 모은다! 틀리면 데미지 2배!</div>
          )}
          <div className="question-top">
            <span className="unit-tag">{question.unit}</span>
            <span className={`timer ${timeLeft <= 5 ? 'urgent' : ''}`}>⏰ {timeLeft}초</span>
          </div>
          <div className="question-text">{question.text}</div>
          <div className="choice-grid">
            {question.choices.map((c, i) => {
              let cls = 'choice-btn';
              if (phase === 'feedback') {
                if (i === question.answerIndex) cls += ' right';
                else if (i === chosen) cls += ' wrong';
                else cls += ' dim';
              }
              return (
                <button key={i} className={cls} disabled={phase !== 'ask'} onClick={() => answer(i)}>
                  {c}
                </button>
              );
            })}
          </div>

          {/* 물약: 마셔도 문제는 그대로 (턴 소모 없음) */}
          <div className="potion-row">
            {Object.entries(POTIONS).map(([kind, p]) => (
              <button
                key={kind}
                className="potion-btn"
                disabled={phase !== 'ask' || potions[kind] <= 0 || playerHp >= stats.maxHp}
                onClick={() => drinkPotion(kind)}
              >
                {p.icon} {p.name} ×{potions[kind]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 전투 종료 */}
      {phase === 'end' && (
        <div className="card end-card">
          {result.win && <Confetti />}
          {result.win ? (
            <>
              <div className="end-title">🎉 승리!</div>
              {firstFinal && <p className="end-story">{STORY.finalWin}</p>}
              <p className="end-reward">💰 {monster.gold}G · ✨ 경험치 {monster.xp} 획득!</p>
            </>
          ) : (
            <>
              <div className="end-title">😵 패배...</div>
              <p className="end-reward">
                {mode === 'tower'
                  ? `${monster.floor}층에서 아쉽게 떨어졌어요. 여기까지의 보상은 그대로예요!`
                  : '괜찮아요! 상점에서 장비를 갖추고 다시 도전해요.'}
              </p>
            </>
          )}
          <p className="end-score">
            이번 전투 정답: {score.current.correct} / {score.current.total}
          </p>

          {/* 오답 복습: 틀린 문제와 정답 다시 보기 */}
          {wrongList.current.length > 0 && (
            <div className="review-box">
              <div className="review-title">📝 틀린 문제 복습 ({wrongList.current.length}개)</div>
              {wrongList.current.map((w, i) => (
                <div key={i} className="review-item">
                  <div className="review-q">{w.text}</div>
                  <div className="review-a">
                    정답: <b>{w.answer}</b>
                    <span className="review-mine"> (내 답: {w.chosen})</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="end-btns">
            {mode === 'tower' && result.win && (
              <>
                <button className="big-btn primary" onClick={() => finish('next')}>
                  ⬆️ 다음 층으로!
                </button>
                <button className="big-btn" onClick={() => finish('home')}>
                  💰 그만 올라가기
                </button>
              </>
            )}
            {mode === 'tower' && !result.win && (
              <>
                <button className="big-btn primary" onClick={() => finish('retry')}>
                  🔁 1층부터 다시
                </button>
                <button className="big-btn" onClick={() => finish('home')}>
                  🏠 마을로
                </button>
              </>
            )}
            {mode === 'normal' && (
              <>
                <button className="big-btn primary" onClick={() => finish('retry')}>
                  🔁 다시 도전
                </button>
                <button className="big-btn" onClick={() => finish('home')}>
                  🏠 마을로
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Fighter({ icon, name, hp, maxHp, fxClass, popup, enemy }) {
  const pct = (hp / maxHp) * 100;
  return (
    <div className={`fighter ${enemy ? 'enemy' : ''}`}>
      <div className={`fighter-icon ${fxClass}`}>{icon}</div>
      {popup && (
        <span key={popup.key} className={`dmg-pop ${popup.kind}`}>
          {popup.text}
        </span>
      )}
      <div className="fighter-name">{name}</div>
      <div className="hp-bar">
        <div className={`hp-fill ${pct <= 30 ? 'low' : ''}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="hp-num">❤️ {hp} / {maxHp}</div>
    </div>
  );
}

// 승리 축하 색종이
function Confetti() {
  const colors = ['#ff6b81', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff'];
  const pieces = Array.from({ length: 26 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    delay: `${(i % 9) * 0.14}s`,
    color: colors[i % colors.length],
    rot: `${(i * 47) % 360}deg`,
  }));
  return (
    <div className="confetti">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{ left: p.left, animationDelay: p.delay, background: p.color, transform: `rotate(${p.rot})` }}
        />
      ))}
    </div>
  );
}
