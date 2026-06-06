import './Loader.css';

export default function Loader() {
  return (
    <div className="site-loader">
      <div className="loader-card">
        <div className="juice-3d-wrap">
          <img src="/loader-juice.png" alt="Fresh Juice" className="juice-base-img" />
          <div className="juice-fill-layer"></div>
          <div className="juice-shine"></div>
        </div>

        <h2>Kashmiri Fresh Juices</h2>
        <p>Preparing Fresh Juice...</p>

        <div className="loader-progress">
          <span></span>
        </div>
      </div>
    </div>
  );
}
