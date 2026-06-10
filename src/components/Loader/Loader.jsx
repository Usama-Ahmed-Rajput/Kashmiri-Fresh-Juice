import './Loader.css';

export default function Loader() {
  return (
    <div className="kfj-intro-overlay">
      <div className="kfj-orb kfj-orb1"></div>
      <div className="kfj-orb kfj-orb2"></div>
      <div className="kfj-orb kfj-orb3"></div>

      <div className="kfj-leaf leaf-1">🍃</div>
      <div className="kfj-leaf leaf-2">🍊</div>
      <div className="kfj-leaf leaf-3">🥭</div>
      <div className="kfj-leaf leaf-4">🍓</div>

      <div className="kfj-logo-wrap">
        <div className="kfj-logo-ring">
          <svg className="kfj-ring-svg" viewBox="0 0 140 140" fill="none">
            <circle
              cx="70"
              cy="70"
              r="66"
              stroke="url(#juiceGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="320 100"
            />
            <defs>
              <linearGradient id="juiceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8de03b" />
                <stop offset="35%" stopColor="#ffd24d" />
                <stop offset="70%" stopColor="#ff9f1c" />
                <stop offset="100%" stopColor="#ff4d6d" />
              </linearGradient>
            </defs>
          </svg>

          <img src="/logo.png" alt="Kashmiri Fresh Juices" />
        </div>

        <h1>Kashmiri Fresh Juices</h1>
        <p>Pure Taste • Pure Health</p>

        <div className="kfj-divider"></div>

        <div className="kfj-loader-wrap">
          <div className="kfj-counter-row">
            <span>Preparing Freshness</span>
            <b>100%</b>
          </div>

          <div className="kfj-loader-track">
            <div className="kfj-loader-bar"></div>
          </div>

          <div className="kfj-seg-labels">
            <span>Fresh</span>
            <span>Natural</span>
            <span>Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
