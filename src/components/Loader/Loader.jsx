import './Loader.css';

export default function Loader() {
  return (
    <div className="site-loader">
      <div className="loader-bg-fruit fruit-1">🍊</div>
      <div className="loader-bg-fruit fruit-2">🍓</div>
      <div className="loader-bg-fruit fruit-3">🥭</div>

      <div className="loader-card">
        <img src="/logo.png" alt="Kashmiri Fresh Juices" className="loader-logo" />

        <div className="real-glass">
          <div className="glass-shine"></div>
          <div className="straw"></div>

          <div className="juice-liquid">
            <div className="juice-wave wave-1"></div>
            <div className="juice-wave wave-2"></div>
          </div>

          <span className="bubble bubble-1"></span>
          <span className="bubble bubble-2"></span>
          <span className="bubble bubble-3"></span>
          <span className="bubble bubble-4"></span>
        </div>

        <h2>Kashmiri Fresh Juices</h2>
        <p>Freshness Loading...</p>

        <div className="loader-progress">
          <span></span>
        </div>
      </div>
    </div>
  );
}
