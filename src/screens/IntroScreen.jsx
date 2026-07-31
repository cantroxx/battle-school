import { useState } from 'react';
import { AVATARS, STORY } from '../game/data.js';

/* 처음 시작: 스토리를 보여주고 캐릭터 이름과 모습을 고른다 */
export default function IntroScreen({ onCreate }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const ready = name.trim().length >= 1;

  return (
    <div className="screen intro">
      <h1 className="game-title">⚔️ 배틀 스쿨</h1>
      <p className="tagline">문제를 풀어 몬스터를 물리치고, 골드를 모아 강해지자!</p>

      <div className="story-box">📜 {STORY.goal}</div>

      <div className="card">
        <h2>내 캐릭터 만들기</h2>

        <label className="field-label">이름 (별명도 좋아요)</label>
        <input
          className="name-input"
          value={name}
          maxLength={8}
          placeholder="예: 번개호랑이"
          onChange={(e) => setName(e.target.value)}
        />

        <label className="field-label">모습 고르기</label>
        <div className="avatar-grid">
          {AVATARS.map((a) => (
            <button
              key={a}
              className={`avatar-btn ${a === avatar ? 'selected' : ''}`}
              onClick={() => setAvatar(a)}
            >
              {a}
            </button>
          ))}
        </div>

        <button
          className="big-btn primary"
          disabled={!ready}
          onClick={() => onCreate(name.trim(), avatar)}
        >
          모험 시작! 🚀
        </button>
      </div>
    </div>
  );
}
