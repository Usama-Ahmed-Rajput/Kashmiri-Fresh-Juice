import './Loader.css';

export default function Loader() {
  return (
    <div className="site-loader">
      <div className="loader-orb orb-1"></div>
      <div className="loader-orb orb-2"></div>

      <div className="loader-card">
        <img src="/logo.png" alt="Kashmiri Fresh Juices" className="loader-logo" />

        <div className="glass-scene">
          <div className="pour-stream"></div>

          <svg className="juice-glass-svg" viewBox="0 0 220 270" fill="none">
            <ellipse cx="110" cy="248" rx="70" ry="13" fill="rgba(0,0,0,.35)" />

            <path
              d="M58 35H162L148 226C147 239 137 247 124 247H96C83 247 73 239 72 226L58 35Z"
              fill="rgba(255,255,255,.08)"
              stroke="rgba(255,255,255,.7)"
              strokeWidth="5"
            />

            <clipPath id="glassClip">
              <path d="M63 42H157L144 221C143 231 136 238 124 238H96C84 238 77 231 76 221L63 42Z" />
            </clipPath>

            <g clipPath="url(#glassClip)">
              <rect className="juice-fill-svg" x="63" y="238" width="94" height="196" />

              <path
                className="juice-wave-svg wave-a"
                d="M42 92C66 78 84 106 111 92C139 78 154 105 178 92V245H42V92Z"
              />

              <path
                className="juice-wave-svg wave-b"
                d="M36 100C62 85 83 111 111 99C140 86 158 111 184 99V245H36V100Z"
              />

              <circle className="svg-bubble b1" cx="90" cy="198" r="5" />
              <circle className="svg-bubble b2" cx="122" cy="210" r="7" />
              <circle className="svg-bubble b3" cx="136" cy="178" r="4" />
              <circle className="svg-bubble b4" cx="104" cy="160" r="6" />
            </g>

            <path
              d="M79 50C76 94 74 145 80 215"
              stroke="rgba(255,255,255,.45)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            <path
              d="M139 46C144 98 143 160 136 222"
              stroke="rgba(255,255,255,.18)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            <ellipse
              cx="110"
              cy="38"
              rx="52"
              ry="10"
              fill="rgba(255,255,255,.12)"
              stroke="rgba(255,255,255,.6)"
              strokeWidth="4"
            />

            <path
              className="straw-svg"
              d="M142 5L126 114"
              stroke="#ff477e"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              className="straw-light"
              d="M145 5L129 114"
              stroke="rgba(255,255,255,.65)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2>Kashmiri Fresh Juices</h2>
        <p>Real Freshness Loading...</p>

        <div className="loader-progress">
          <span></span>
        </div>
      </div>
    </div>
  );
}
