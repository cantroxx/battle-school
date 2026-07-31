import { ACHIEVEMENTS } from '../game/data.js';

/* 업적·칭호: 얻은 업적을 누르면 그 칭호를 이름 옆에 단다 */
export default function BadgeScreen({ player, onEquipTitle, onBack }) {
  const earned = player.achievements;

  return (
    <div className="screen badges">
      <div className="shop-head">
        <button className="nav-btn" onClick={onBack}>← 마을로</button>
        <div className="dex-count">🏅 모은 업적 {earned.length} / {ACHIEVEMENTS.length}</div>
      </div>

      <p className="hint badge-hint">얻은 업적을 누르면 그 칭호를 이름 옆에 달 수 있어요!</p>

      <div className="badge-list">
        {ACHIEVEMENTS.map((a) => {
          const got = earned.includes(a.id);
          const equipped = player.title === a.id;
          return (
            <button
              key={a.id}
              className={`card badge-card ${got ? '' : 'badge-locked'} ${equipped ? 'badge-on' : ''}`}
              disabled={!got}
              onClick={() => onEquipTitle(equipped ? null : a.id)}
            >
              <span className="badge-medal">{got ? '🏅' : '🔒'}</span>
              <span className="badge-text">
                <span className="badge-title">{a.title}</span>
                <span className="badge-desc">{a.desc}</span>
              </span>
              {equipped && <span className="shop-tag now">착용 중</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
