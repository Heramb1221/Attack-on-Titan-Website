import { useEffect, useRef, useState } from 'react'
import './SceneGallery.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Scene data ─────────────────────────────── */
const SCENES = [
  {
    id       : 'wall-breach',
    quote    : 'ON THAT DAY',
    quoteFull: 'On that day, mankind received a grim reminder. We lived in fear of the Titans and were disgraced to live in these cages we called walls.',
    speaker  : 'Eren Yeager',
    season   : 'Season I · Episode 1',
    num      : '01',
    img      : '/images/scenes/wall-breach.jpg',
    imgPos   : 'center 30%',
    accent   : '#9b1a1a',
  },
  {
    id       : 'survey-corps',
    quote    : 'DEDICATE YOUR HEART',
    quoteFull: 'To you, 2,000 years from now. The Survey Corps will carry the will of every soldier who ever fell beyond the walls.',
    speaker  : 'Erwin Smith',
    season   : 'Season I · Episode 22',
    num      : '02',
    img      : '/images/scenes/survey-corps.jpg',
    imgPos   : 'center 20%',
    accent   : '#6a8a4a',
  },
  {
    id       : 'colossal',
    quote    : 'STEAM INCARNATE',
    quoteFull: 'The Colossal Titan. Sixty metres of pure destruction. The god of our nightmares given form, appearing without warning, vanishing without trace.',
    speaker  : 'Armin Arlert',
    season   : 'Season II · Episode 12',
    num      : '03',
    img      : '/images/scenes/colossal.jpg',
    imgPos   : 'center 40%',
    accent   : '#c0522a',
  },
  {
    id       : 'rumbling',
    quote    : 'THE RUMBLING',
    quoteFull: 'I keep moving forward until my enemies are destroyed. That is all. That has always been all.',
    speaker  : 'Eren Yeager',
    season   : 'Season IV · Episode 80',
    num      : '04',
    img      : '/images/scenes/rumbling.jpg',
    imgPos   : 'center 50%',
    accent   : '#7a3a3a',
  },
  {
    id       : 'final',
    quote    : 'NO REGRETS',
    quoteFull: 'Even if I knew this was wrong, I would do it again. There is no path I could walk that would keep my hands clean.',
    speaker  : 'Levi Ackerman',
    season   : 'Season IV · Final',
    num      : '05',
    img      : '/images/scenes/final.jpg',
    imgPos   : 'center 35%',
    accent   : '#c4a450',
  },
]

const PANEL_SCROLL = 1.4  // vh multiplier per panel

export default function SceneGallery() {
  const sectionRef = useRef(null)
  const stickyRef  = useRef(null)
  const headerRef  = useRef(null)

  const panelRefs    = useRef([])
  const imageRefs    = useRef([])
  const quoteRefs    = useRef([])
  const infoRefs     = useRef([])

  const [activePanel, setActivePanel] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const sticky  = stickyRef.current
    if (!section || !sticky) return

    const count     = SCENES.length
    const scrollLen = window.innerHeight * count * PANEL_SCROLL
    section.style.height = `${scrollLen + window.innerHeight}px`

    // Set all panels invisible except first
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return
      gsap.set(panel, { zIndex: count - i, opacity: i === 0 ? 1 : 0 })
    })

    // Header fade in on approach
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      {
        opacity : 1, y: 0, duration: 0.5,
        scrollTrigger: {
          trigger      : section,
          start        : 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Header fades out as first panel properly enters
    gsap.to(headerRef.current, {
      opacity  : 0,
      duration : 0.3,
      scrollTrigger: {
        trigger : section,
        start   : 'top 10%',
        toggleActions: 'play none none reverse',
      },
    })

    // Per-panel scroll triggers
    SCENES.forEach((scene, i) => {
      const panel    = panelRefs.current[i]
      const imgEl    = imageRefs.current[i]
      const quoteEl  = quoteRefs.current[i]
      const infoEl   = infoRefs.current[i]
      if (!panel) return

      const panelStart = (i / count)
      const panelEnd   = ((i + 1) / count)
      const activeWindow = panelEnd - panelStart

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger   : section,
          start     : 'top top',
          end       : `+=${scrollLen}`,
          scrub     : 1.2,
          onUpdate  : (self) => {
            const prog = self.progress
            const pStart = i * (1 / count)
            const pEnd   = (i + 1) * (1 / count)
            // Determine active panel for dots
            if (prog >= pStart && prog < pEnd) {
              setActivePanel(i)
            }
          },
        },
      })

      // PANEL IN — clip wipe from right
      if (i > 0) {
        tl.fromTo(panel,
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          {
            clipPath : 'inset(0 0% 0 0)',
            opacity  : 1,
            duration : activeWindow * 0.4,
            ease     : 'power2.inOut',
          },
          panelStart
        )
      } else {
        // First panel — already visible, just handle content
        tl.set(panel, { clipPath: 'inset(0 0% 0 0)', opacity: 1 }, 0)
      }

      // Ken Burns — image slow zoom out during active window
      if (imgEl) {
        tl.fromTo(imgEl,
          { scale: 1.1 },
          { scale: 1.0, duration: activeWindow, ease: 'none' },
          panelStart
        )
      }

      // Quote text reveals
      if (quoteEl) {
        const contentIn = panelStart + activeWindow * (i === 0 ? 0.05 : 0.38)
        tl.fromTo(quoteEl,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: activeWindow * 0.25, ease: 'power2.out' },
          contentIn
        )
        // Exit: quote fades out before panel wipes away
        if (i < count - 1) {
          tl.to(quoteEl,
            { opacity: 0, y: -20, filter: 'blur(6px)', duration: activeWindow * 0.15, ease: 'power2.in' },
            panelEnd - activeWindow * 0.22
          )
        }
      }

      // Info bar
      if (infoEl) {
        const infoIn = panelStart + activeWindow * (i === 0 ? 0.08 : 0.42)
        tl.fromTo(infoEl,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: activeWindow * 0.2, ease: 'power2.out' },
          infoIn
        )
        if (i < count - 1) {
          tl.to(infoEl,
            { opacity: 0, y: -16, duration: activeWindow * 0.12, ease: 'power2.in' },
            panelEnd - activeWindow * 0.18
          )
        }
      }

      // PANEL EXIT — slide left as next panel wipes in
      if (i < count - 1) {
        tl.to(panel,
          { x: '-6%', duration: activeWindow * 0.4, ease: 'power2.in' },
          panelEnd - activeWindow * 0.4
        )
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section className="sg-section" ref={sectionRef}>
      <div className="sg-sticky" ref={stickyRef}>

        {/* Section header — fades out as first panel enters */}
        <div className="sg-header" ref={headerRef}>
          <div className="sg-header-eyebrow">
            <span className="sg-header-rule" />
            <span className="sg-header-eyebrow-txt">Key Moments</span>
            <span className="sg-header-rule" />
          </div>
          <h2 className="sg-header-title">Scene Gallery</h2>
        </div>

        {/* Panel stack */}
        {SCENES.map((scene, i) => (
          <ScenePanel
            key={scene.id}
            scene={scene}
            index={i}
            panelRef={el => panelRefs.current[i] = el}
            imageRef={el => imageRefs.current[i] = el}
            quoteRef={el => quoteRefs.current[i] = el}
            infoRef={el  => infoRefs.current[i]  = el}
          />
        ))}

        {/* Side dot indicators */}
        <div className="sg-dots">
          {SCENES.map((scene, i) => (
            <DotIndicator
              key={scene.id}
              active={activePanel === i}
            />
          ))}
        </div>

        {/* Film grain */}
        <div className="sg-grain" />

      </div>
    </section>
  )
}

/* ── Sub-components ─────────────────────────── */

function ScenePanel({ scene, panelRef, imageRef, quoteRef, infoRef }) {
  return (
    <div className="sg-panel" ref={panelRef}>

      {/* Image layer */}
      <div className="sg-panel-image">
        <img
          ref={imageRef}
          src={scene.img}
          alt={scene.quote}
          draggable={false}
          style={{ objectPosition: scene.imgPos }}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      {/* Dark overlay */}
      <div className="sg-panel-overlay" />

      {/* Quote as background-clip text mask */}
      <div className="sg-quote-mask">
        <div
          ref={quoteRef}
          className="sg-quote-text sg-quote-text--fallback"
          style={{ backgroundImage: `url('${scene.img}')` }}
          aria-hidden="true"
        >
          {scene.quote}
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="sg-info" ref={infoRef}>
        <div className="sg-info-left">
          <p className="sg-info-quote-small">{scene.quoteFull}</p>
          <p
            className="sg-info-speaker"
            style={{ color: scene.accent }}
          >
            — {scene.speaker}
          </p>
        </div>
        <div className="sg-info-right">
          <span className="sg-info-panel-num">{scene.num}</span>
          <span className="sg-info-season">{scene.season}</span>
        </div>
      </div>

    </div>
  )
}

function DotIndicator({ active }) {
  return (
    <div className={`sg-dot ${active ? 'sg-dot--active' : ''}`} />
  )
}