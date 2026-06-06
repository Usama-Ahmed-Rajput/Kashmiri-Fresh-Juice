import './Loader.css';

export default function Loader() {
  return (
    <div className="site-loader">
      <div className="loader-card">
        <img src="/loader-juice.png" alt="Fresh Juice" className="loader-juice-img" />

        <h2>Kashmiri Fresh Juices</h2>
        <p>Freshness Loading...</p>

        <div className="loader-progress">
          <span></span>
        </div>
      </div>
    </div>
  );
}
