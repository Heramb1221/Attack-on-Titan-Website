import { useEffect, useRef, useState, useCallback } from 'react'
import './BattleTimeline.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Season colour map ──────────────────────── */
const SEASON_COLORS = {
  'Season 1' : '#c4a450',
  'Season 2' : '#8a6a4a',
  'Season 3' : '#7a3a3a',
  'Season 4' : '#9b1a1a',
}

/* ── Timeline events ────────────────────────── */
const EVENTS = [
  {
    id         : 'wall-maria-fall',
    season     : 'Season 1',
    year       : 'Year 845',
    title      : 'The Fall of Wall Maria',
    desc       : 'The Colossal Titan breaches the outermost wall. Humanity retreats inward. Eren watches his mother consumed.',
    significance: 95,
    above      : false,
    connectorH : 48,
    active     : true,
  },
  {
    id         : 'training-corps',
    season     : 'Season 1',
    year       : 'Year 847',
    title      : '104th Training Corps Graduates',
    desc       : 'Eren, Mikasa, and Armin complete three years of military training and join the Scout Regiment.',
    significance: 55,
    above      : true,
    connectorH : 52,
    active     : false,
  },
  {
    id         : 'trost-battle',
    season     : 'Season 1',
    year       : 'Year 850',
    title      : 'Battle of Trost District',
    desc       : 'The Colossal Titan strikes again. Eren awakens his ability to transform into a Titan, sealing the breach.',
    significance: 88,
    above      : false,
    connectorH : 44,
    active     : false,
  },
  {
    id         : 'female-titan',
    season     : 'Season 1',
    year       : 'Year 850',
    title      : 'The Female Titan Revealed',
    desc       : 'Annie Leonhart is exposed as the Female Titan. Captured in crystal, her identity shocks the Survey Corps.',
    significance: 80,
    above      : true,
    connectorH : 56,
    active     : false,
  },
  {
    id         : 'wall-rose-breach',
    season     : 'Season 2',
    year       : 'Year 850',
    title      : 'Wall Rose Infiltration',
    desc       : 'Titans appear inside Wall Rose. Reiner and Bertholdt reveal themselves as the Armored and Colossal Titans.',
    significance: 92,
    above      : false,
    connectorH : 48,
    active     : false,
  },
  {
    id         : 'royal-government',
    season     : 'Season 3',
    year       : 'Year 850',
    title      : 'Overthrow of the Royal Government',
    desc       : 'The corrupt King is deposed. Historia Reiss is crowned as the true Queen, restoring the rightful bloodline.',
    significance: 75,
    above      : true,
    connectorH : 52,
    active     : false,
  },
  {
    id         : 'retake-shiganshina',
    season     : 'Season 3',
    year       : 'Year 854',
    title      : 'Battle of Shiganshina',
    desc       : 'The Survey Corps recaptures Shiganshina. Armin inherits the Colossal Titan. Erwin Smith falls.',
    significance: 97,
    above      : false,
    connectorH : 44,
    active     : false,
  },
  {
    id         : 'marley-arc',
    season     : 'Season 4',
    year       : 'Year 854',
    title      : 'The Raid on Liberio',
    desc       : 'Eren infiltrates the Marleyan festival and transforms, throwing the world into open war.',
    significance: 90,
    above      : true,
    connectorH : 56,
    active     : false,
  },
  {
    id         : 'rumbling',
    season     : 'Season 4',
    year       : 'Year 854',
    title      : 'The Rumbling Begins',
    desc       : 'Eren unleashes the Wall Titans. Hundreds of millions march toward the world beyond the sea.',
    significance: 100,
    above      : false,
    connectorH : 44,
    active     : true,
  },
  {
    id         : 'final-battle',
    season     : 'Season 4',
    year       : 'Year 854',
    title      : 'The Final Battle',
    desc       : 'Allied forces unite against Eren at Fort Salta. The cycle of hatred reaches its end.',
    significance: 98,
    above      : true,
    connectorH : 52,
    active     : false,
  },
]

const SEASONS = ['All', 'Season 1', 'Season 2', 'Season 3', 'Season 4']

export default function BattleTimeline() {
  const sectionRef   = useRef(null)
  const stickyRef    = useRef(null)
  const trackRef     = useRef(null)
  const headerRef    = useRef(null)
  const filtersRef   = useRef(null)
  const progressRef  = useRef(null)
  const ropeProgressRef = useRef(null)
  const nodeRefs     = useRef([])
  const tlRef        = useRef(null)
  const stRef        = useRef(null)

  const [activeFilter, setActiveFilter] = useState('All')

  const filteredEvents = activeFilter === 'All'
    ? EVENTS
    : EVENTS.filter(e => e.season === activeFilter)

  const handleFilter = useCallback((season) => {
    setActiveFilter(season)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const sticky  = stickyRef.current
    const track   = trackRef.current
    if (!section || !sticky || !track) return

    // Kill previous
    if (stRef.current) stRef.current.kill()
    if (tlRef.current) tlRef.current.kill()

    const nodeW    = nodeRefs.current[0]?.offsetWidth || 220
    const gap      = 80
    const count    = nodeRefs.current.filter(Boolean).length
    const totalW   = count * (nodeW + gap) + window.innerWidth * 0.16
    const scrollDist = Math.max(totalW - window.innerWidth * 0.85, 0)
    const scrollLen  = Math.max(scrollDist * 1.5, window.innerHeight * 4)

    section.style.height = `${scrollLen + window.innerHeight}px`

    // Header fade in
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      {
        opacity  : 1, y: 0, duration: 0.6,
        scrollTrigger: {
          trigger      : section,
          start        : 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Filters fade in
    gsap.fromTo(filtersRef.current,
      { opacity: 0, y: -10 },
      {
        opacity  : 1, y: 0, duration: 0.5, delay: 0.15,
        scrollTrigger: {
          trigger      : section,
          start        : 'top 80%',
          toggleActions: 'play none none reverse',
          onEnter: () => filtersRef.current?.classList.add('bt-filters--visible'),
          onLeaveBack: () => filtersRef.current?.classList.remove('bt-filters--visible'),
        },
      }
    )

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger   : section,
        start     : 'top top',
        end       : `+=${scrollLen}`,
        scrub     : 1.4,
        onUpdate  : (self) => {
          if (progressRef.current)
            progressRef.current.style.width = `${self.progress * 100}%`
          // Rope draw-in
          if (ropeProgressRef.current) {
            const totalLen = ropeProgressRef.current.getTotalLength?.() || 9999
            ropeProgressRef.current.style.strokeDasharray  = totalLen
            ropeProgressRef.current.style.strokeDashoffset = totalLen * (1 - self.progress * 1.1)
          }
        },
      }
    })
    tlRef.current = tl

    // Track horizontal slide
    tl.to(track,
      { x: -scrollDist, ease: 'none', duration: 1 },
      0
    )

    // Nodes stagger in
    nodeRefs.current.forEach((node, i) => {
      if (!node) return
      const prog   = 0.05 + (i / count) * 0.75
      const isAbove = EVENTS[i]?.above
      tl.fromTo(node,
        {
          opacity : 0,
          y       : isAbove ? -50 : 50,
          scale   : 0.85,
          filter  : 'blur(5px)',
        },
        {
          opacity : 1,
          y       : 0,
          scale   : 1,
          filter  : 'blur(0px)',
          duration: 0.16,
          ease    : 'power3.out',
        },
        prog
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [activeFilter])

  // Rope total width
  const ropeWidth = EVENTS.length * 300 + 200

  return (
    <section className="bt-section" ref={sectionRef}>
      <div className="bt-sticky" ref={stickyRef}>

        <div className="bt-bg" />
        <div className="bt-grain" />

        {/* Header */}
        <div className="bt-header" ref={headerRef}>
          <div className="bt-header-eyebrow">
            <span className="bt-header-rule" />
            <span className="bt-header-eyebrow-txt">The Chronicle</span>
            <span className="bt-header-rule" />
          </div>
          <h2 className="bt-header-title">Battle Timeline</h2>
        </div>

        {/* Season filters */}
        <div className="bt-filters" ref={filtersRef}>
          {SEASONS.map(s => (
            <SeasonButton
              key={s}
              season={s}
              active={activeFilter === s}
              onClick={handleFilter}
            />
          ))}
        </div>

        {/* Scroll track */}
        <div className="bt-track-wrap">
          <div className="bt-track" ref={trackRef}>

            {/* Rope SVG behind the nodes */}
            <svg
              className="bt-rope-svg"
              width={ropeWidth}
              height="2"
              viewBox={`0 0 ${ropeWidth} 2`}
              aria-hidden="true"
            >
              <line
                className="bt-rope-line"
                x1="0" y1="1"
                x2={ropeWidth} y2="1"
              />
              <line
                className="bt-rope-progress"
                ref={ropeProgressRef}
                x1="0" y1="1"
                x2={ropeWidth} y2="1"
              />
            </svg>

            {/* Event nodes */}
            {filteredEvents.map((event, i) => (
              <TimelineNode
                key={event.id}
                event={event}
                index={i}
                nodeRef={el => nodeRefs.current[i] = el}
              />
            ))}

            {/* End spacer */}
            <div style={{ flexShrink: 0, width: '12vw' }} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="bt-progress-wrap">
          <span className="bt-progress-txt">Year 845</span>
          <div className="bt-progress-track">
            <div className="bt-progress-fill" ref={progressRef} />
          </div>
          <span className="bt-progress-txt">Year 854</span>
        </div>

      </div>
    </section>
  )
}

/* ── Sub-components ─────────────────────────── */

function SeasonButton({ season, active, onClick }) {
  return (
    <button
      className={`bt-filter-btn ${active ? 'bt-filter-btn--active' : ''}`}
      onClick={() => onClick(season)}
    >
      {season}
    </button>
  )
}

function TimelineNode({ event, nodeRef }) {
  const seasonColor = SEASON_COLORS[event.season] || '#c4a450'
  const sigWidth    = `${(event.significance / 100) * 72}%`

  return (
    <div
      className={`bt-node ${event.above ? 'bt-node--above' : ''} ${event.active ? 'bt-node--active' : ''}`}
      ref={nodeRef}
      style={{
        flexDirection : event.above ? 'column-reverse' : 'column',
      }}
    >
      {/* Card (above or below rope depending on alternation) */}
      <div className="bt-event-card">
        <p
          className="bt-event-season"
          style={{ color: seasonColor }}
        >
          {event.season}
        </p>
        <p className="bt-event-year">{event.year}</p>
        <h3 className="bt-event-title">{event.title}</h3>
        <p className="bt-event-desc">{event.desc}</p>
        <div className="bt-event-sig">
          <div
            className="bt-event-sig-bar"
            style={{ width: sigWidth }}
          />
          <span className="bt-event-sig-label">Impact</span>
        </div>
      </div>

      {/* Connector line to the rope */}
      <div
        className="bt-node-connector"
        style={{ height: `${event.connectorH}px` }}
      />

      {/* Dot on rope */}
      <div className="bt-node-dot-wrap">
        <div className="bt-node-dot-ring" />
        <div
          className="bt-node-dot"
          style={{ borderColor: seasonColor }}
        />
      </div>
    </div>
  )
}