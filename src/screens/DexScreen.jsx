import { MONSTERS } from '../game/data.js';

/* 몬스터 도감: 이긴 몬스터는 자세히, 아직인 몬스터는 실루엣으로 */
export default function DexScreen({ player, onBack }) {
  const found = player.stageCleared + 1; // 이긴 수

  return (
    <div className="screen dex">
      <div className="shop-head">
        <button className="nav-btn" onClick={onBack}>← 마을로</button>
        <div className="dex-count">📖 물리친 몬스터 {found} / {MONSTERS.length}</div>
      </div>

      <div className="dex-grid">
        {MONSTERS.map((m, i) => {
          const beaten = i <= player.stageCleared;
          const met = i === player.stageCleared + 1; // 만났지만 아직 못 이김
          return (
            <div key={m.id} className={`card dex-card ${beaten ? '' : 'unknown'}`}>
              <div className={`dex-icon ${beaten ? '' : met ? 'dim' : 'silhouette'}`}>{m.icon}</div>
              <div className="dex-name">{beaten || met ? m.name : '???'}</div>
              {beaten ? (
                <>
                  <p className="dex-desc">{m.desc}</p>
                  <div className="dex-stats">❤️{m.hp} ⚔️{m.atk} · 💰{m.gold}G</div>
                </>
              ) : (
                <p className="dex-desc">{met ? '아직 이기지 못한 상대예요!' : '아직 만나지 못했어요.'}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
