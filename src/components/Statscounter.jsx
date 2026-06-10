import { useEffect, useRef, useCallback } from 'react'
import './StatsCounter.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Stats data ─────────────────────────────── */
const STATS = [
  {
    id       : 'episodes',
    number   : 87,
    suffix   : 'EP',
    label    : 'Total Episodes',
    desc     : 'Across four seasons and the Final Chapter, every episode a descent deeper into the truth.',
    featured : false,
  },
  {
    id       : 'seasons',
    number   : 4,
    suffix   : 'S',
    label    : 'Seasons',
    desc     : 'A decade-long journey from 2013 to 2023, culminating in one of anime\'s most divisive finales.',
    featured : false,
  },
  {
    id       : 'chapters',
    number   : 139,
    suffix   : 'CH',
    label    : 'Manga Chapters',
    desc     : 'Hajime Isayama\'s complete work — 139 chapters serialised over 11 years in Bessatsu Shōnen Magazine.',
    featured : false,
  },
  {
    id       : 'titan-kills',
    number   : 14,
    suffix   : '+',
    label    : 'Titan Shifters',
    desc     : 'Nine titan powers, fourteen known inheritors across the story\'s timeline. Each one a weapon and a curse.',
    featured : false,
  },
  {
    id       : 'walls',
    number   : 3,
    suffix   : '',
    label    : 'Walls',
    desc     : 'Maria. Rose. Sina. Three concentric rings housing the last of humanity — or so they believed.',
    featured : false,
  },
  {
    id       : 'wall-titans',
    number   : 1000000,
    suffix   : '+',
    label    : 'Wall Titans',
    desc     : 'The Rumbling — over a million Colossal Titans housed within the walls, unleashed in the series\' final arc.',
    featured : true,
  },
  {
    id       : 'years',
    number   : 2000,
    suffix   : 'YRS',
    label    : 'Titan Curse Duration',
    desc     : 'The power of the Titans has enslaved the Eldian people for two thousand years. Every inheritor dies at 13.',
    featured : false,
  },
  {
    id       : 'survey-deaths',
    number   : 98,
    suffix   : '%',
    label    : 'Survey Corps Casualty Rate',
    desc     : 'Beyond the walls, survival was never the expectation. The bravest soldiers in history accepted this truth.',
    featured : false,
  },
]

/* ── Wings watermark SVG ─────────────────────── */
function WingsWatermark() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="200" cy="200" rx="18" ry="28" fill="var(--bone)"/>
      <ellipse cx="200" cy="185" rx="10" ry="13" fill="var(--bone)" opacity="0.7"/>
      <path d="M182 195 C155 175,100 150,55 120 C80 130,110 148,125 162
               C95 148,58 138,28 118 C55 132,88 155,105 175
               C75 165,45 158,22 145 C45 162,78 178,100 192
               C72 185,42 180,20 172 C42 188,75 198,100 205
               C80 202,55 200,35 196 C55 210,82 215,105 216 Z"
        fill="var(--bone)" opacity="0.85"/>
      <path d="M218 195 C245 175,300 150,345 120 C320 130,290 148,275 162
               C305 148,342 138,372 118 C345 132,312 155,295 175
               C325 165,355 158,378 145 C355 162,322 178,300 192
               C328 185,358 180,380 172 C358 188,325 198,300 205
               C320 202,345 200,365 196 C345 210,318 215,295 216 Z"
        fill="var(--bone)" opacity="0.85"/>
      <path d="M185 210 C160 220,110 240,65 270 C88 255,118 240,135 232
               C105 248,72 262,45 278 C70 262,102 248,122 240
               C96 254,65 268,42 282 C66 268,98 255,120 248 Z"
        fill="var(--bone)" opacity="0.7"/>
      <path d="M215 210 C240 220,290 240,335 270 C312 255,282 240,265 232
               C295 248,328 262,355 278 C330 262,298 248,278 240
               C304 254,335 268,358 282 C334 268,302 255,280 248 Z"
        fill="var(--bone)" opacity="0.7"/>
      <path d="M200 158 L205 172 L220 172 L208 181 L213 196 L200 187 L187 196 L192 181 L180 172 L195 172 Z"
        fill="var(--gold)" opacity="0.8"/>
    </svg>
  )
}

export default function StatsCounter() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const quoteRef   = useRef(null)
  const cardRefs   = useRef([])
  const numRefs    = useRef([])
  const countedRef = useRef(false)

  const runCounters = useCallback(() => {
    if (countedRef.current) return
    countedRef.current = true

    numRefs.current.forEach((el, i) => {
      if (!el) return
      const stat   = STATS[i]
      const target = stat.number
      const obj    = { val: 0 }

      gsap.to(obj, {
        val      : target,
        duration : target > 10000 ? 2.2 : target > 100 ? 1.8 : 1.2,
        delay    : i * 0.08,
        ease     : 'power2.out',
        onUpdate : () => {
          el.textContent = Math.round(obj.val).toLocaleString()
        },
        onComplete: () => {
          el.textContent = target.toLocaleString()
          cardRefs.current[i]?.classList.add('sc-card--counted')
        },
      })
    })
  }, [])

  const resetCounters = useCallback(() => {
    countedRef.current = false
    numRefs.current.forEach((el, i) => {
      if (!el) return
      el.textContent = '0'
      cardRefs.current[i]?.classList.remove('sc-card--counted')
    })
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Header slide in
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      {
        opacity  : 1, y: 0, duration: 0.6,
        scrollTrigger: {
          trigger      : section,
          start        : 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Cards stagger in
    gsap.fromTo(cardRefs.current.filter(Boolean),
      { opacity: 0, y: 40, filter: 'blur(4px)' },
      {
        opacity  : 1,
        y        : 0,
        filter   : 'blur(0px)',
        duration : 0.55,
        stagger  : 0.07,
        ease     : 'power3.out',
        scrollTrigger: {
          trigger      : section,
          start        : 'top 72%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Bottom quote
    gsap.fromTo(quoteRef.current,
      { opacity: 0, y: 20 },
      {
        opacity  : 1, y: 0, duration: 0.6,
        scrollTrigger: {
          trigger      : section,
          start        : 'top 40%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Counters fire on enter, reset on leave back
    ScrollTrigger.create({
      trigger      : section,
      start        : 'top 65%',
      onEnter      : runCounters,
      onLeaveBack  : resetCounters,
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [runCounters, resetCounters])

  const handleCardHover = useCallback((i) => {
    const card = cardRefs.current[i]
    const el   = numRefs.current[i]
    if (!card || !el) return

    // Glitch flash
    card.classList.add('sc-card--glitch')
    setTimeout(() => card.classList.remove('sc-card--glitch'), 380)

    // Re-run this card's counter fast
    const stat = STATS[i]
    const obj  = { val: 0 }
    gsap.to(obj, {
      val      : stat.number,
      duration : 0.5,
      ease     : 'power3.out',
      onUpdate : () => {
        el.textContent = Math.round(obj.val).toLocaleString()
      },
      onComplete: () => {
        el.textContent = stat.number.toLocaleString()
      },
    })
  }, [])

  return (
    <section className="sc-section" ref={sectionRef}>

      {/* Watermark */}
      <div className="sc-watermark">
        <WingsWatermark />
      </div>

      {/* Rules */}
      <div className="sc-rule-top" />
      <div className="sc-rule-bottom" />

      {/* Grain */}
      <div className="sc-grain" />

      <div className="sc-inner">

        {/* Header */}
        <div className="sc-header" ref={headerRef}>
          <div className="sc-header-eyebrow">
            <span className="sc-header-rule" />
            <span className="sc-header-eyebrow-txt">By The Numbers</span>
            <span className="sc-header-rule" />
          </div>
          <h2 className="sc-header-title">The Scale of the Story</h2>
        </div>

        {/* Grid */}
        <div className="sc-grid">
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={i}
              cardRef={el => cardRefs.current[i] = el}
              numRef={el  => numRefs.current[i]  = el}
              onHover={handleCardHover}
            />
          ))}
        </div>

        {/* Bottom quote */}
        <div className="sc-bottom-quote" ref={quoteRef}>
          <p className="sc-bottom-quote-text">
            "The only thing we're allowed to do is believe that we won't regret the choice we made."
          </p>
          <p className="sc-bottom-quote-attr">— Levi Ackerman</p>
        </div>

      </div>
    </section>
  )
}

/* ── Sub-components ─────────────────────────── */

function StatCard({ stat, index, cardRef, numRef, onHover }) {
  return (
    <div
      className={`sc-card ${stat.featured ? 'sc-card--featured' : ''}`}
      ref={cardRef}
      onMouseEnter={() => onHover(index)}
    >
      <div className="sc-card-bar" />

      <div className="sc-number-wrap">
        <span className="sc-number" ref={numRef}>0</span>
        {stat.suffix && (
          <span className="sc-suffix">{stat.suffix}</span>
        )}
      </div>

      <div className="sc-card-divider" />

      <p className="sc-label">{stat.label}</p>
      <p className="sc-desc">{stat.desc}</p>
    </div>
  )
}