import { useEffect, useRef } from 'react'
import './CharacterProfiles.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CHARACTERS = [
  {
    id       : 'eren',
    name     : 'Eren Yeager',
    epithet  : 'The Attack Titan',
    faction  : 'Survey Corps',
    factionColor : '#6a8a4a',
    number   : '01',
    quote    : '"If you win, you live. If you lose, you die. If you don\'t fight, you can\'t win."',
    img      : '/images/chars/eren.png',
    stats    : [
      { label: 'Height',     value: '183 cm' },
      { label: 'Titan Form', value: 'Attack · War Hammer · Founding' },
      { label: 'Regiment',   value: 'Survey Corps' },
      { label: 'Status',     value: 'Deceased' },
    ],
  },
  {
    id       : 'mikasa',
    name     : 'Mikasa Ackerman',
    epithet  : 'Humanity\'s Strongest',
    faction  : 'Survey Corps',
    factionColor : '#6a8a4a',
    number   : '02',
    quote    : '"This world is cruel. It is also very beautiful."',
    img      : '/images/chars/mikasa.png',
    stats    : [
      { label: 'Height',     value: '170 cm' },
      { label: 'Titan Form', value: 'None' },
      { label: 'Regiment',   value: 'Survey Corps' },
      { label: 'Status',     value: 'Alive' },
    ],
  },
  {
    id       : 'armin',
    name     : 'Armin Arlert',
    epithet  : 'The Colossus Titan',
    faction  : 'Survey Corps',
    factionColor : '#6a8a4a',
    number   : '03',
    quote    : '"Someone who can\'t sacrifice anything, can\'t change anything."',
    img      : '/images/chars/armin.png',
    stats    : [
      { label: 'Height',     value: '163 cm' },
      { label: 'Titan Form', value: 'Colossus' },
      { label: 'Regiment',   value: 'Survey Corps' },
      { label: 'Status',     value: 'Alive' },
    ],
  },
  {
    id       : 'levi',
    name     : 'Levi Ackerman',
    epithet  : 'Humanity\'s Strongest Soldier',
    faction  : 'Survey Corps',
    factionColor : '#6a8a4a',
    number   : '04',
    quote    : '"The only thing we\'re allowed to do is believe that we won\'t regret the choice we made."',
    img      : '/images/chars/levi.png',
    stats    : [
      { label: 'Height',     value: '160 cm' },
      { label: 'Titan Form', value: 'None' },
      { label: 'Regiment',   value: 'Survey Corps' },
      { label: 'Status',     value: 'Alive' },
    ],
  },
  {
    id       : 'historia',
    name     : 'Historia Reiss',
    epithet  : 'Queen of the Walls',
    faction  : 'Royal Family',
    factionColor : '#8a6a3a',
    number   : '05',
    quote    : '"I\'m going to live a life I can be proud of."',
    img      : '/images/chars/historia.png',
    stats    : [
      { label: 'Height',     value: '157 cm' },
      { label: 'Titan Form', value: 'None' },
      { label: 'Regiment',   value: 'Survey Corps · Queen' },
      { label: 'Status',     value: 'Alive' },
    ],
  },
  {
    id       : 'reiner',
    name     : 'Reiner Braun',
    epithet  : 'The Armored Titan',
    faction  : 'Warriors',
    factionColor : '#7a3a3a',
    number   : '06',
    quote    : '"There are warriors and there are soldiers. Soldiers follow orders. Warriors have a cause."',
    img      : '/images/chars/reiner.png',
    stats    : [
      { label: 'Height',     value: '188 cm' },
      { label: 'Titan Form', value: 'Armored' },
      { label: 'Regiment',   value: 'Marleyan Warriors' },
      { label: 'Status',     value: 'Alive' },
    ],
  },
  {
    id       : 'zeke',
    name     : 'Zeke Yeager',
    epithet  : 'The Beast Titan',
    faction  : 'Warriors',
    factionColor : '#7a3a3a',
    number   : '07',
    quote    : '"Contrary to your wishes, people don\'t live just so that they can die for their kings."',
    img      : '/images/chars/zeke.png',
    stats    : [
      { label: 'Height',     value: '183 cm' },
      { label: 'Titan Form', value: 'Beast' },
      { label: 'Regiment',   value: 'Marleyan Warriors' },
      { label: 'Status',     value: 'Deceased' },
    ],
  },
  {
    id       : 'erwin',
    name     : 'Erwin Smith',
    epithet  : 'The 13th Commander',
    faction  : 'Survey Corps',
    factionColor : '#6a8a4a',
    number   : '08',
    quote    : '"My soldiers, rage! My soldiers, scream! My soldiers, fight!"',
    img      : '/images/chars/erwin.png',
    stats    : [
      { label: 'Height',     value: '188 cm' },
      { label: 'Titan Form', value: 'None' },
      { label: 'Regiment',   value: 'Survey Corps' },
      { label: 'Status',     value: 'Deceased' },
    ],
  },
  {
    id       : 'hange',
    name     : 'Hange Zoë',
    epithet  : 'The 14th Commander',
    faction  : 'Survey Corps',
    factionColor : '#6a8a4a',
    number   : '09',
    quote    : '"Ever since I joined the Survey Corps, I\'ve had people dying on me everyday."',
    img      : '/images/chars/hange.png',
    stats    : [
      { label: 'Height',     value: '170 cm' },
      { label: 'Titan Form', value: 'None' },
      { label: 'Regiment',   value: 'Survey Corps' },
      { label: 'Status',     value: 'Deceased' },
    ],
  },
  {
    id       : 'jean',
    name     : 'Jean Kirstein',
    epithet  : 'The Reliable Leader',
    faction  : 'Survey Corps',
    factionColor : '#6a8a4a',
    number   : '10',
    quote    : '"I just don\'t want those charred bones I saw to be disappointed in me."',
    img      : '/images/chars/jean.png',
    stats    : [
      { label: 'Height',     value: '190 cm' },
      { label: 'Titan Form', value: 'None' },
      { label: 'Regiment',   value: 'Survey Corps' },
      { label: 'Status',     value: 'Alive' },
    ],
  },
  {
    id       : 'sasha',
    name     : 'Sasha Blouse',
    epithet  : 'Potato Girl',
    faction  : 'Survey Corps',
    factionColor : '#6a8a4a',
    number   : '11',
    quote    : '"Are you saying I can have that? Really?"',
    img      : '/images/chars/sasha.png',
    stats    : [
      { label: 'Height',     value: '168 cm' },
      { label: 'Titan Form', value: 'None' },
      { label: 'Regiment',   value: 'Survey Corps' },
      { label: 'Status',     value: 'Deceased' },
    ],
  },
  {
    id       : 'annie',
    name     : 'Annie Leonhart',
    epithet  : 'The Female Titan',
    faction  : 'Warriors',
    factionColor : '#7a3a3a',
    number   : '12',
    quote    : '"I just want the weak, who do get swept along with the flow, be considered human too."',
    img      : '/images/chars/annie.png',
    stats    : [
      { label: 'Height',     value: '153 cm' },
      { label: 'Titan Form', value: 'Female' },
      { label: 'Regiment',   value: 'Marleyan Warriors' },
      { label: 'Status',     value: 'Alive' },
    ],
  },
  {
    id       : 'bertholdt',
    name     : 'Bertholdt Hoover',
    epithet  : 'God of Destruction',
    faction  : 'Warriors',
    factionColor : '#7a3a3a',
    number   : '13',
    quote    : '"The world is just that cruel."',
    img      : '/images/chars/bertholdt.png',
    stats    : [
      { label: 'Height',     value: '192 cm' },
      { label: 'Titan Form', value: 'Colossus' },
      { label: 'Regiment',   value: 'Marleyan Warriors' },
      { label: 'Status',     value: 'Deceased' },
    ],
  }
]

export default function CharacterProfiles() {
  const sectionRef  = useRef(null)
  const stickyRef   = useRef(null)
  const trackRef    = useRef(null)
  const headerRef   = useRef(null)
  const progressRef = useRef(null)
  const cardRefs    = useRef([])

  useEffect(() => {
    const section  = sectionRef.current
    const sticky   = stickyRef.current
    const track    = trackRef.current
    const header   = headerRef.current
    const progress = progressRef.current
    if (!section || !sticky || !track) return

    const cardWidth   = cardRefs.current[0]?.offsetWidth || 280
    const gap         = parseFloat(getComputedStyle(track).gap) || 32
    const totalWidth  = CHARACTERS.length * (cardWidth + gap) + window.innerWidth * 0.06
    const scrollDist  = totalWidth - window.innerWidth + window.innerWidth * 0.08

    const scrollLen   = Math.max(scrollDist * 1.4, window.innerHeight * 4)
    section.style.height = `${scrollLen + window.innerHeight}px`

    // Header fade in
    gsap.fromTo(header,
      { opacity: 0, y: -20 },
      {
        opacity  : 1,
        y        : 0,
        duration : 0.6,
        ease     : 'power2.out',
        scrollTrigger: {
          trigger : section,
          start   : 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Main horizontal scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger   : section,
        start     : 'top top',
        end       : `+=${scrollLen}`,
        scrub     : 1.5,
        pin       : sticky,
        pinSpacing: false,
        onUpdate  : (self) => {
          if (progress) progress.style.width = `${self.progress * 100}%`
        },
      },
    })

    // Horizontal track move
    tl.to(track, {
      x       : -scrollDist,
      ease    : 'none',
      duration: 1,
    }, 0)

    // Cards fan in with stagger
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const startProg = i * 0.1
      tl.fromTo(card,
        {
          opacity : 0,
          y       : 60,
          rotateY : 18,
          filter  : 'blur(6px)',
        },
        {
          opacity : 1,
          y       : 0,
          rotateY : 0,
          filter  : 'blur(0px)',
          duration: 0.18,
          ease    : 'power3.out',
        },
        startProg
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section className="cp-section" ref={sectionRef}>
      <div className="cp-sticky" ref={stickyRef}>

        <div className="cp-bg" />
        <div className="cp-grain" />

        {/* Header */}
        <div className="cp-header" ref={headerRef}>
          <div className="cp-header-eyebrow">
            <span className="cp-header-rule" />
            <span className="cp-header-eyebrow-txt">The Players</span>
            <span className="cp-header-rule" />
          </div>
          <h2 className="cp-header-title">Know Your Soldiers</h2>
        </div>

        {/* Horizontal scroll track */}
        <div className="cp-track" ref={trackRef}>
          {CHARACTERS.map((char, i) => (
            <CharacterCard
              key={char.id}
              char={char}
              index={i}
              cardRef={el => cardRefs.current[i] = el}
            />
          ))}
          {/* End padding card */}
          <div style={{ flexShrink: 0, width: '8vw' }} />
        </div>

        {/* Progress bar */}
        <div className="cp-progress">
          <span className="cp-progress-hint">Scroll</span>
          <div className="cp-progress-track">
            <div className="cp-progress-fill" ref={progressRef} />
          </div>
          <span className="cp-progress-hint">{CHARACTERS.length} Characters</span>
        </div>

      </div>
    </section>
  )
}

/* ── Sub-component: individual card ─────────────
   Extracted to avoid hooks-in-map violation        */
function CharacterCard({ char, cardRef }) {
  return (
    <div
      className="cp-card"
      ref={cardRef}
      style={{ perspectiveOrigin: 'bottom center' }}
    >
      {/* Border frame with corner ornaments */}
      <div className="cp-card-frame" />

      {/* Portrait */}
      <div className="cp-card-portrait">
        <img
          src={char.img}
          alt={char.name}
          draggable={false}
          onError={e => {
            // Graceful fallback: render a dark gradient placeholder
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.style.background =
              `linear-gradient(160deg, rgba(30,20,14,1) 0%, rgba(6,6,10,1) 100%)`
          }}
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="cp-card-overlay" />

      {/* Faction badge top-right */}
      <div className="cp-faction-badge">
        <span
          className="cp-faction-badge-dot"
          style={{ background: char.factionColor }}
        />
        <span className="cp-faction-badge-txt">{char.faction}</span>
      </div>

      {/* Base name info */}
      <div className="cp-card-info">
        <p className="cp-card-number">{char.number}</p>
        <h3 className="cp-card-name">{char.name}</h3>
        <p className="cp-card-epithet">{char.epithet}</p>
      </div>

      {/* Stats reveal panel */}
      <div className="cp-card-stats">
        <p className="cp-stats-name">{char.name}</p>
        <p className="cp-stats-quote">{char.quote}</p>
        <div className="cp-stats-grid">
          {char.stats.map(stat => (
            <StatItem key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>

    </div>
  )
}

/* Extracted from stats .map() to satisfy hooks rules */
function StatItem({ label, value }) {
  return (
    <div className="cp-stat-item">
      <p className="cp-stat-label">{label}</p>
      <p className="cp-stat-value">{value}</p>
    </div>
  )
}