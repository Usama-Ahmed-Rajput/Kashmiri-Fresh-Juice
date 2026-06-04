import { motion } from 'framer-motion';
import strawberry2 from '../../assets/strawberry2.png';
import './About.css';

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };

export default function About(){
 return <section className="about" id="about">
  <motion.div className="about-box glass" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} transition={{ duration: .55 }}><small>ABOUT US</small><h2>Kashmiri Fresh Juices</h2><p>We bring you the finest and freshest juices made with love and care. Our juices are prepared daily using handpicked fruits to give you the best taste and maximum nutrition.</p><em>Pure Taste. Pure Kashmir <i className="fa-solid fa-seedling"></i></em><div className="mini-icons"><span><i className="fa-solid fa-basket-shopping"></i>Fresh Fruits</span><span><i className="fa-solid fa-shield-heart"></i>Hygienic</span><span><i className="fa-solid fa-award"></i>Best Quality</span><span><i className="fa-regular fa-heart"></i>Made with Love</span></div></motion.div>
  <motion.div className="about-img" initial={{ opacity: 0, scale: .88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7, ease: 'easeOut' }}><motion.img src={strawberry2} alt="Strawberry juice" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}/></motion.div>
  <motion.div className="why glass" id="benefits" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} transition={{ duration: .55, delay: .1 }}><small>WHY CHOOSE US?</small>{[
    ['fa-leaf','100% Natural','Only fresh & natural ingredients'],
    ['fa-flask','No Preservatives','We say NO to artificial things'],
    ['fa-shield-heart','Hygienic Preparation','Prepared with clean & safe environment'],
    ['fa-truck-fast','Fast Delivery','Get your order fast on WhatsApp'],
  ].map(([icon,title,text]) => <motion.div key={title} whileHover={{ x: 8 }} transition={{ type: 'spring', stiffness: 250, damping: 20 }}><i className={`fa-solid ${icon}`}></i><p><b>{title}</b><br/>{text}</p></motion.div>)}</motion.div>
 </section>
}
