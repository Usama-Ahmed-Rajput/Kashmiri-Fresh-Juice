import { lazy, Suspense, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import heroImg from '../../assets/hero.png';
import bgc from '../../assets/bgc.png';
const FruitParticles = lazy(() => import('./FruitParticles'));
import './Hero.css';

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Hero({ whatsappNumber }) {
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 18 });

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <header
      className="hero"
      id="home"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={resetTilt}
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(0,8,2,.98) 0%,rgba(0,18,7,.88) 48%,rgba(0,0,0,.28)), url(${bgc})`,
      }}
    >
      <Suspense fallback={null}>
        <FruitParticles />
      </Suspense>

      <motion.div
        className="hero-glow hero-glow-one"
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.58, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-glow hero-glow-two"
        animate={{ y: [0, -22, 0], x: [0, 14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <section className="hero-content">
        <motion.div className="hero-text" variants={stagger} initial="hidden" animate="visible">
          <motion.p className="tagline" variants={fadeUp} transition={{ duration: 0.55 }}>
            Pure Taste, Pure Health <i className="fa-solid fa-seedling"></i>
          </motion.p>

          <motion.h1 variants={fadeUp} transition={{ duration: 0.65, delay: 0.05 }}>
            Kashmiri
            <br />
            <span>Fresh Juices</span>
          </motion.h1>

          <motion.div className="divider" variants={fadeUp} transition={{ duration: 0.55 }}>
            <span></span>
            <i className="fa-solid fa-glass-water"></i>
            <span></span>
          </motion.div>

          <motion.p className="desc" variants={fadeUp} transition={{ duration: 0.55 }}>
            Made with 100% natural fruits.
            <br />
            No preservatives, no artificial flavors.
            <br />
            Just pure freshness in every sip.
          </motion.p>

          <motion.div className="feature-row" variants={stagger}>
            {[
              ['fa-seedling', '100% Natural'],
              ['fa-flask', 'No Preservatives'],
              ['fa-heart', 'Healthy & Tasty'],
              ['fa-glass-water', 'Freshly Prepared'],
            ].map(([icon, text]) => (
              <motion.div
                key={text}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: -5,
                }}
                transition={{ type: 'spring', stiffness: 230, damping: 18 }}
              >
                <i className={`fa-solid ${icon}`}></i>
                <b>{text}</b>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="buttons" variants={fadeUp} transition={{ duration: 0.55 }}>
            <motion.a
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="whatsapp"
              href={`https://wa.me/${whatsappNumber}?text=Hi%20Kashmiri%20Fresh%20Juices%2C%20I%20want%20to%20order`}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-whatsapp"></i> Order on WhatsApp
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="outline"
              href="#menu"
            >
              <i className="fa-solid fa-play"></i> View Menu
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image-wrap"
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1000,
          }}
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.25 }}
        >
          <motion.div
            className="juice-plate"
            animate={{
              scale: isHovering ? 1.04 : [1, 1.025, 1],
            }}
            transition={{ duration: 4.5, repeat: isHovering ? 0 : Infinity, ease: 'easeInOut' }}
          />

          <motion.img
            src={heroImg}
            alt="Mango juice"
            className="hero-image"
            animate={{
              y: [0, -16, 0],
              rotateZ: [0, 1.2, 0],
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="floating-drop drop-one"
            animate={{ y: [0, -20, 0], rotate: [0, 12, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="floating-drop drop-two"
            animate={{ y: [0, 18, 0], rotate: [0, -16, 0] }}
            transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="natural-badge"
            initial={{ opacity: 0, rotate: -12, scale: 0.7 }}
            animate={{
              opacity: 1,
              rotate: [0, 4, 0],
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { delay: 0.8, duration: 0.3 },
              scale: { delay: 0.8, type: 'spring', stiffness: 170 },
              rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <i className="fa-solid fa-leaf"></i>
            <b>100%</b>
            <span>Natural</span>
          </motion.div>
        </motion.div>
      </section>
    </header>
  );
}

