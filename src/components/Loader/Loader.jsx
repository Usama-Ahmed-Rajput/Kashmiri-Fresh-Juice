import './Loader.css';

export default function Loader() {
  return (
    <div className="site-loader">
      <div className="loader-box">

        <img src="/logo.png" className="loader-logo" alt="" />

        <div className="glass-container">

          <div className="juice-mask">
            <img
              src="/filled-juice.png"
              alt=""
              className="filled-glass"
            />
          </div>

          <img
            src="/empty-glass.png"
            alt=""
            className="empty-glass"
          />

        </div>

        <h2>Kashmiri Fresh Juices</h2>

        <div className="loader-bar">
          <span />
        </div>

      </div>
    </div>
  );
}
