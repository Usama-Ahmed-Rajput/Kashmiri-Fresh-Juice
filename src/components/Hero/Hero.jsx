import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
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

export default function Hero({whatsappNumber}){
  return <header className="hero" id="home" style={{backgroundImage:`linear-gradient(90deg,rgba(0,8,2,.98) 0%,rgba(0,18,7,.88) 48%,rgba(0,0,0,.28)), url(${bgc})`}}>
    <Suspense fallback={null}><FruitParticles /></Suspense>
    <section className="hero-content">
      <motion.div className="hero-text" variants={stagger} initial="hidden" animate="visible">
        <motion.p className="tagline" variants={fadeUp} transition={{ duration: .55 }}>Pure Taste, Pure Health <i className="fa-solid fa-seedling"></i></motion.p>
        <motion.h1 variants={fadeUp} transition={{ duration: .65, delay: .05 }}>Kashmiri<br/><span>Fresh Juices</span></motion.h1>
        <motion.div className="divider" variants={fadeUp} transition={{ duration: .55 }}><span></span><i className="fa-solid fa-glass-water"></i><span></span></motion.div>
        <motion.p className="desc" variants={fadeUp} transition={{ duration: .55 }}>Made with 100% natural fruits.<br/>No preservatives, no artificial flavors.<br/>Just pure freshness in every sip.</motion.p>
        <motion.div className="feature-row" variants={stagger}>
          {[
            ['fa-seedling','100% Natural'],
            ['fa-flask','No Preservatives'],
            ['fa-heart','Healthy & Tasty'],
            ['fa-glass-water','Freshly Prepared'],
          ].map(([icon,text]) => <motion.div key={text} variants={fadeUp} whileHover={{ y: -6, scale: 1.03 }} transition={{ type: 'spring', stiffness: 230, damping: 18 }}><i className={`fa-solid ${icon}`}></i><b>{text}</b></motion.div>)}
        </motion.div>
        <motion.div className="buttons" variants={fadeUp} transition={{ duration: .55 }}>
          <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }} className="whatsapp" href={`https://wa.me/${whatsappNumber}?text=Hi%20Kashmiri%20Fresh%20Juices%2C%20I%20want%20to%20order`} target="_blank"><i className="fa-brands fa-whatsapp"></i> Order on WhatsApp</motion.a>
          <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }} className="outline" href="#menu"><i className="fa-solid fa-play"></i> View Menu</motion.a>
        </motion.div>
      </motion.div>
      <motion.div className="hero-image-wrap" initial={{ opacity: 0, scale: .9, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .85, ease: 'easeOut', delay: .25 }}>
        <motion.img src={heroImg} alt="Mango juice" className="hero-image" animate={{ y: [0, -14, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}/>
        <motion.div className="natural-badge" initial={{ opacity: 0, rotate: -12, scale: .7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ delay: .8, type: 'spring', stiffness: 170 }}><i className="fa-solid fa-leaf"></i><b>100%</b><span>Natural</span></motion.div>
      </motion.div>
    </section>
  </header>
}
