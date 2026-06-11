import { useEffect, useRef } from 'react'
import './FinalCTA.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Marquee items ──────────────────────────── */
const MARQUEE_ITEMS = [
  'Attack on Titan',
  'Shingeki no Kyojin',
  '進撃の巨人',
  'Season I — IV',
  'Hajime Isayama',
  '2013 — 2023',
  'Dedicate Your Heart',
  '心臓を捧げよ',
  'Survey Corps',
  'Beyond the Walls',
]

/* ── Particle config ────────────────────────── */
const PARTICLE_COUNT = 22
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id    : i,
  x     : Math.random() * 100,        // % from left
  size  : 1 + Math.random() * 2.5,    // px
  dur   : 6 + Math.random() * 10,     // seconds per loop
  delay : Math.random() * -12,        // stagger start
  opacity: 0.15 + Math.random() * 0.35,
  color : i % 5 === 0 ? '#c4a450' : i % 7 === 0 ? '#9b1a1a' : '#d4cfc4',
}))

export default function FinalCTA() {
  const sectionRef   = useRef(null)
  const bgImgRef     = useRef(null)
  const eyebrowRef   = useRef(null)
  const headlineRef  = useRef(null)
  const taglineRef   = useRef(null)
  const ctaGroupRef  = useRef(null)
  const marqueeRef   = useRef(null)
  const marqueeTrackRef = useRef(null)
  const footerRef    = useRef(null)
  const particleRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // ── Ken Burns on bg image ──────────────────
    if (bgImgRef.current) {
      gsap.fromTo(bgImgRef.current,
        { scale: 1.12 },
        {
          scale    : 1.0,
          duration : 2.2,
          ease     : 'power1.out',
          scrollTrigger: {
            trigger      : section,
            start        : 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    // ── Content entrance timeline ──────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger      : section,
        start        : 'top 75%',
        toggleActions: 'play none none reverse',
      },
      defaults: { ease: 'power3.out' },
    })

    // Eyebrow
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.5 },
      0
    )

    // Headline — each line staggers up
    const lines = headlineRef.current?.querySelectorAll('.fc-headline-line')
    if (lines?.length) {
      tl.fromTo(headlineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.1 },
        0.05
      )
      tl.fromTo(lines,
        { opacity: 0, y: 60, filter: 'blur(10px)' },
        {
          opacity  : 1,
          y        : 0,
          filter   : 'blur(0px)',
          duration : 0.65,
          stagger  : 0.12,
        },
        0.05
      )
    }

    // Tagline
    tl.fromTo(taglineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.45
    )

    // CTA group
    tl.fromTo(ctaGroupRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.58
    )

    // Marquee bar
    tl.fromTo(marqueeRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      0.72
    )

    // Footer
    tl.fromTo(footerRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45 },
      0.82
    )

    // ── Marquee infinite scroll ────────────────
    const track = marqueeTrackRef.current
    if (track) {
      const singleW = track.scrollWidth / 2  // two copies of items
      gsap.to(track, {
        x        : -singleW,
        duration : 28,
        ease     : 'none',
        repeat   : -1,
      })
    }

    // ── Particles loop ─────────────────────────
    particleRefs.current.forEach((el, i) => {
      if (!el) return
      const p = PARTICLES[i]
      gsap.fromTo(el,
        { y: '110vh', opacity: 0 },
        {
          y        : '-10vh',
          opacity  : p.opacity,
          duration : p.dur,
          delay    : p.delay,
          ease     : 'none',
          repeat   : -1,
          repeatDelay: 0,
          onRepeat : () => {
            // Randomise x slightly on each loop
            gsap.set(el, {
              left: `${Math.random() * 100}%`,
            })
          },
        }
      )
    })

    // ── Mouse parallax on bg ───────────────────
    const handleMouse = (e) => {
      if (!bgImgRef.current) return
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 2
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(bgImgRef.current, {
        x        : xPct * 12,
        y        : yPct * 8,
        duration : 1.8,
        ease     : 'power1.out',
      })
    }
    section.addEventListener('mousemove', handleMouse)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
      section.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  // Double the marquee items for seamless loop
  const allMarqueeItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <section className="fc-section" ref={sectionRef} id="watch">

      {/* Key visual */}
      <div className="fc-bg-image">
        <img
          ref={bgImgRef}
          src="/images/cta-bg.jpg"
          alt=""
          aria-hidden="true"
          draggable={false}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      {/* Overlays */}
      <div className="fc-overlay" />
      <div className="fc-vignette" />

      {/* Particles */}
      <div className="fc-particles">
        {PARTICLES.map((p, i) => (
          <ParticleDot
            key={p.id}
            particle={p}
            dotRef={el => particleRefs.current[i] = el}
          />
        ))}
      </div>

      {/* Grain */}
      <div className="fc-grain" />

      {/* Main content */}
      <div className="fc-content">

        {/* Eyebrow */}
        <div className="fc-eyebrow" ref={eyebrowRef}>
          <span className="fc-eyebrow-rule" />
          <span className="fc-eyebrow-txt">The Legend Continues</span>
          <span className="fc-eyebrow-rule" />
        </div>

        {/* Headline */}
        <div className="fc-headline" ref={headlineRef}>
          <span className="fc-headline-line fc-headline-line--1">
            The Story
          </span>
          <span className="fc-headline-line fc-headline-line--2">
            Doesn't End
          </span>
          <span className="fc-headline-line fc-headline-line--3">
            Here
          </span>
        </div>

        {/* Tagline */}
        <p className="fc-tagline" ref={taglineRef}>
          From the fall of Wall Maria to the final roar of the Rumbling —
          witness the complete saga of humanity's last stand.
        </p>

        {/* CTAs */}
        <div className="fc-cta-group" ref={ctaGroupRef}>

          <a href="#" className="fc-cta-primary">
            <span className="fc-cta-primary-inner">
              <span>Watch Now</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="fc-cta-primary-bg" />
          </a>

          <a href="#" className="fc-cta-secondary">
            Read the Manga
          </a>

        </div>

      </div>

      {/* Marquee ticker */}
      <div className="fc-marquee-wrap" ref={marqueeRef}>
        <div className="fc-marquee-track" ref={marqueeTrackRef}>
          {allMarqueeItems.map((item, i) => (
            <MarqueeItem key={i} text={item} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="fc-footer" ref={footerRef}>
        <a href="#" className="fc-footer-logo">ATTACK ON TITAN</a>
        <p className="fc-footer-copy">
          © Hajime Isayama / Kodansha · Fan Tribute Site
        </p>
        <nav className="fc-footer-links">
          {['Story', 'Titans', 'Soldiers', 'Chronicle'].map(link => (
            <FooterLink key={link} label={link} />
          ))}
        </nav>
      </footer>

    </section>
  )
}

/* ── Sub-components ─────────────────────────── */

function ParticleDot({ particle, dotRef }) {
  return (
    <div
      ref={dotRef}
      className="fc-particle"
      style={{
        left       : `${particle.x}%`,
        width      : `${particle.size}px`,
        height     : `${particle.size}px`,
        background : particle.color,
        opacity    : 0,
        bottom     : 0,
      }}
    />
  )
}

function MarqueeItem({ text }) {
  return (
    <span className="fc-marquee-item">
      <span className="fc-marquee-text">{text}</span>
      <span className="fc-marquee-sep" aria-hidden="true" />
    </span>
  )
}

function FooterLink({ label }) {
  return (
    <a href={`#${label.toLowerCase()}`} className="fc-footer-link">
      {label}
    </a>
  )
}