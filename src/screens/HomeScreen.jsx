import { useState } from 'react';
import {
  MONSTERS, statsOf, xpToNext, POTIONS, FINAL_MONSTER_ID, STORY, todaySubjectId, titleOf,
  JOBS, isJobUnlocked,
} from '../game/data.js';
import { SUBJECTS, GRADED_SUBJECTS } from '../questions/index.js';

/* 마을(홈): 내 정보, 과목 선택, 모험 지도, 무한의 탑, 상점·도감·업적 입구 */
export default function HomeScreen({ player, onChangePref, onChooseJob, onBattle, onTower, onGoShop, onGoDex, onGoBadges, onReset }) {
  const stats = statsOf(player);
  const need = xpToNext(player.level);
  const accuracy =
    player.totalCount > 0 ? Math.round((player.correctCount / player.totalCount) * 100) : null;
  const [selected, setSelected] = useState(null); // 정보 창에 띄운 몬스터
  const [askReset, setAskReset] = useState(false);
  const today = todaySubjectId();
  const towerOpen = player.stageCleared >= FINAL_MONSTER_ID;

  return (
    <div className="screen home">
      <div className="quest-banner">
        {towerOpen ? STORY.questAfter : STORY.questBefore}
      </div>

      <header className="hero-card card">
        <div className="hero-face">{player.avatar}</div>
        <div className="hero-info">
          <div className="hero-name">
            {player.name} <span className="hero-level">Lv.{player.level}</span>
          </div>
          {player.title && <div className="hero-title">🏅 {titleOf(player.title)}</div>}
          <div className="hero-stats">
            {stats.job.icon} {stats.job.name} · ❤️ {stats.maxHp} · ⚔️ {stats.atk} · 🛡️ {stats.def}
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${(player.xp / need) * 100}%` }} />
            <span className="xp-text">경험치 {player.xp} / {need}</span>
          </div>
        </div>
        <div className="hero-side">
          <div className="gold">💰 {player.gold}G</div>
          <div className="record">
            {player.wins}승 {player.losses}패{accuracy !== null ? ` · 정답률 ${accuracy}%` : ''}
          </div>
          <div className="equip-line">{stats.weapon.icon} {stats.weapon.name}</div>
          <div className="equip-line">{stats.armor.icon} {stats.armor.name}</div>
          <div className="equip-line">
            {POTIONS.small.icon} ×{player.potionSmall} · {POTIONS.big.icon} ×{player.potionBig}
          </div>
        </div>
      </header>

      <div className="nav-row three">
        <button className="nav-btn" onClick={onGoShop}>🛒 상점</button>
        <button className="nav-btn" onClick={onGoDex}>📖 도감</button>
        <button className="nav-btn" onClick={onGoBadges}>🏅 업적</button>
      </div>

      <section className="card">
        <h2>✨ 직업과 필살기</h2>
        <p className="hint">조건을 달성한 직업으로 언제든 전직할 수 있어요. 정답으로 게이지를 채워 필살기를 쓰세요!</p>
        <div className="job-grid">
          {JOBS.map((job) => {
            const unlocked = isJobUnlocked(player, job.id);
            const selectedJob = player.jobId === job.id;
            return (
              <button
                key={job.id}
                className={`job-card ${selectedJob ? 'selected' : ''}`}
                disabled={!unlocked}
                onClick={() => onChooseJob(job.id)}
              >
                <span className="job-icon">{unlocked ? job.icon : '🔒'}</span>
                <b>{job.name}</b>
                <span>{job.skill}</span>
                <small>{unlocked ? job.skillDesc : job.unlock}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2>📖 어떤 과목으로 싸울까? <span className="today-note">⭐ = 오늘의 과목 (데미지 1.5배!)</span></h2>
        <div className="subject-row">
          {Object.entries(SUBJECTS).map(([id, s]) => (
            <button
              key={id}
              className={`subject-btn ${player.subject === id ? 'selected' : ''}`}
              onClick={() => onChangePref({ subject: id })}
            >
              <span className="subject-icon">{s.icon}</span>
              <span>{id === today ? '⭐' : ''}{s.name}</span>
            </button>
          ))}
        </div>
        {GRADED_SUBJECTS.includes(player.subject) && (
          <div className="grade-row">
            {[3, 4, 5, 6].map((g) => (
              <button
                key={g}
                className={`grade-btn ${player.grade === g ? 'selected' : ''}`}
                onClick={() => onChangePref({ grade: g })}
              >
                {g}학년
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2>🗺️ 모험 지도</h2>
        <div className="map-path">
          {MONSTERS.map((m, i) => {
            const unlocked = i <= player.stageCleared + 1;
            const beaten = i <= player.stageCleared;
            const isNext = i === player.stageCleared + 1;
            return (
              <div key={m.id} className={`map-row ${i % 2 === 1 ? 'right' : ''}`}>
                <button
                  className={`map-node ${beaten ? 'beaten' : ''} ${isNext ? 'next' : ''} ${unlocked ? '' : 'locked'}`}
                  disabled={!unlocked}
                  onClick={() => setSelected(m)}
                >
                  <span className="map-icon">{unlocked ? m.icon : '🔒'}</span>
                  {beaten && <span className="map-check">✅</span>}
                  {isNext && <span className="map-next-badge">도전!</span>}
                </button>
                <div className="map-label">{unlocked ? m.name : '???'}</div>
              </div>
            );
          })}
          <div className="map-goal">💎</div>
        </div>
        <p className="hint">몬스터를 눌러 정보를 보고 도전! 이긴 몬스터와 또 싸워 골드를 모아도 좋아요.</p>
      </section>

      {/* 무한의 탑: 마왕을 이기면 열린다 */}
      <section className={`card tower-card ${towerOpen ? '' : 'tower-locked'}`}>
        <h2>🗼 무한의 탑</h2>
        {towerOpen ? (
          <>
            <p className="tower-desc">
              층마다 강해지는 수호자를 물리치고 끝없이 올라가요. 층 사이에는 체력이 이어지니 물약을 챙기세요!
            </p>
            <div className="tower-best">🏆 최고 기록: {player.towerBest > 0 ? `${player.towerBest}층` : '아직 없음'}</div>
            <button className="big-btn primary" onClick={onTower}>🗼 탑 오르기!</button>
          </>
        ) : (
          <p className="tower-desc">🔒 어둠의 마왕을 물리치면 열려요.</p>
        )}
      </section>

      <button className="reset-link" onClick={() => setAskReset(true)}>🗑 처음부터 다시 시작하기</button>

      {/* 몬스터 정보 창 */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">{selected.icon}</div>
            <div className="modal-name">{selected.name}</div>
            <p className="modal-desc">{selected.desc}</p>
            <div className="modal-stats">
              ❤️ 체력 {selected.hp} · ⚔️ 공격 {selected.atk}
              <br />약점: {SUBJECTS[selected.weakness]?.icon} {SUBJECTS[selected.weakness]?.name}
              <br />특수 패턴: {selected.pattern?.name}
              <br />보상: 💰 {selected.gold}G · ✨ 경험치 {selected.xp}
            </div>
            <div className="end-btns">
              <button
                className="big-btn primary"
                onClick={() => {
                  setSelected(null);
                  onBattle(selected);
                }}
              >
                ⚔️ 도전하기!
              </button>
              <button className="big-btn" onClick={() => setSelected(null)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 초기화 확인 창 */}
      {askReset && (
        <div className="modal-overlay" onClick={() => setAskReset(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑</div>
            <div className="modal-name">처음부터 다시 시작할까요?</div>
            <p className="modal-desc">
              캐릭터, 골드, 장비, 기록이 <b>모두 사라져요.</b> 되돌릴 수 없어요!
            </p>
            <div className="end-btns">
              <button className="big-btn danger" onClick={onReset}>네, 지울래요</button>
              <button className="big-btn" onClick={() => setAskReset(false)}>아니요!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
