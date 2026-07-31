import { WEAPONS, ARMORS, POTIONS, statsOf } from '../game/data.js';

/* 상점: 골드로 무기·방어구·물약을 산다. 장비는 사면 바로 장착. */
export default function ShopScreen({ player, onBuyWeapon, onBuyArmor, onBuyPotion, onBack }) {
  const stats = statsOf(player);

  return (
    <div className="screen shop">
      <div className="shop-head">
        <button className="nav-btn" onClick={onBack}>← 마을로</button>
        <div className="gold big">💰 {player.gold}G</div>
      </div>

      <section className="card">
        <h2>⚔️ 무기 <span className="shop-sub">지금: {stats.weapon.icon} {stats.weapon.name} (공격 {stats.atk})</span></h2>
        {WEAPONS.map((w) => (
          <ShopRow
            key={w.id}
            icon={w.icon}
            name={w.name}
            stat={`공격력 ${w.atk}`}
            price={w.price}
            state={
              w.id === player.weaponId ? 'equipped' : w.id < player.weaponId ? 'passed' : 'buyable'
            }
            canAfford={player.gold >= w.price}
            onBuy={() => onBuyWeapon(w.id)}
          />
        ))}
      </section>

      <section className="card">
        <h2>🛡️ 방어구 <span className="shop-sub">지금: {stats.armor.icon} {stats.armor.name} (방어 {stats.def})</span></h2>
        {ARMORS.map((a) => (
          <ShopRow
            key={a.id}
            icon={a.icon}
            name={a.name}
            stat={`방어력 ${a.def}`}
            price={a.price}
            state={
              a.id === player.armorId ? 'equipped' : a.id < player.armorId ? 'passed' : 'buyable'
            }
            canAfford={player.gold >= a.price}
            onBuy={() => onBuyArmor(a.id)}
          />
        ))}
      </section>

      <section className="card">
        <h2>🧪 물약 <span className="shop-sub">전투 중에 마셔서 체력 회복</span></h2>
        {Object.entries(POTIONS).map(([kind, p]) => (
          <ShopRow
            key={kind}
            icon={p.icon}
            name={`${p.name} (보유 ${kind === 'small' ? player.potionSmall : player.potionBig}개)`}
            stat={`체력 +${p.heal}`}
            price={p.price}
            state="buyable"
            canAfford={player.gold >= p.price}
            onBuy={() => onBuyPotion(kind)}
          />
        ))}
      </section>
    </div>
  );
}

function ShopRow({ icon, name, stat, price, state, canAfford, onBuy }) {
  return (
    <div className={`shop-row ${state === 'equipped' ? 'equipped' : ''}`}>
      <span className="shop-icon">{icon}</span>
      <span className="shop-name">
        {name}
        <span className="shop-stat">{stat}</span>
      </span>
      {state === 'equipped' && <span className="shop-tag now">장착 중</span>}
      {state === 'passed' && <span className="shop-tag">보유</span>}
      {state === 'buyable' && (
        <button className="buy-btn" disabled={!canAfford} onClick={onBuy}>
          {canAfford ? `💰 ${price}G` : `${price}G 부족`}
        </button>
      )}
    </div>
  );
}
