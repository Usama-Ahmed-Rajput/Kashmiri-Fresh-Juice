import './Loader.css';

export default function Loader() {
  return (
    <div className="site-loader">
      <div className="loader-glow glow-1"></div>
      <div className="loader-glow glow-2"></div>

      <div className="kfj-loader">
        <img
          src="/logo.png"
          alt="Kashmiri Fresh Juices"
          className="kfj-loader-logo"
        />

        <h1>Kashmiri Fresh Juices</h1>

        <p>Pure Taste • Pure Health</p>

        <div className="kfj-ring">
          <span></span>
        </div>

        <div className="kfj-loading-text">
          Loading Freshness...
        </div>
      </div>
    </div>
  );
}
