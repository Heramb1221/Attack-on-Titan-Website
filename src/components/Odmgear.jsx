import { useEffect, useRef, useState, useCallback } from 'react'
import './ODMGear.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Part definitions ───────────────────────── */
const PARTS = [
  {
    id    : 'gas-canister',
    name  : 'Gas Canisters',
    detail: 'Compressed titan gas',
    desc  : 'High-pressure canisters store the compressed gas that propels the grappling hooks and powers directional thrusters. Each soldier carries two, replaced after each sortie.',
    partIds: ['part-gas-l', 'part-gas-r'],
    leaderEnd : { x: 68, y: 154 },
    label : { x: 6, y: 148, anchor: 'start' },
    side  : 'left',
  },
  {
    id    : 'blade-holder',
    name  : 'Blade Holders',
    detail: 'Hardened steel housing',
    desc  : 'Reinforced holsters on each hip house the replaceable ultra-hard steel blades. A soldier can swap a spent blade mid-flight in under two seconds.',
    partIds: ['part-blade-l', 'part-blade-r'],
    leaderEnd : { x: 78, y: 194 },
    label : { x: 6, y: 198, anchor: 'start' },
    side  : 'left',
  },
  {
    id    : 'belt-harness',
    name  : 'Belt Harness',
    detail: 'Load-bearing frame',
    desc  : 'The central harness distributes the enormous tensional forces of high-speed flight across the torso. Crafted from leather reinforced with titanium threading.',
    partIds: ['part-belt'],
    leaderEnd : { x: 140, y: 210 },
    label : { x: 6, y: 228, anchor: 'start' },
    side  : 'left',
  },
  {
    id    : 'wire-reel',
    name  : 'Wire Reels',
    detail: 'Up to 70m reach',
    desc  : 'Each hip unit houses a motorised reel capable of launching a grapple hook up to 70 metres. Tension is controlled by a trigger-activated brake.',
    partIds: ['part-reel-l', 'part-reel-r'],
    leaderEnd : { x: 100, y: 185 },
    label : { x: 6, y: 258, anchor: 'start' },
    side  : 'left',
  },
  {
    id    : 'grapple-hook',
    name  : 'Grapple Hooks',
    detail: 'Titanium-alloy tip',
    desc  : 'Fired at high velocity, the rotating titanium hook embeds into any surface. The corkscrew tip locks on impact and releases on cable slack.',
    partIds: ['part-hook-l', 'part-hook-r'],
    leaderEnd : { x: 58, y: 230 },
    label : { x: 6, y: 288, anchor: 'start' },
    side  : 'left',
  },
  {
    id    : 'thruster-body',
    name  : 'Thruster Body',
    detail: 'Dual-port exhaust',
    desc  : 'The core propulsion unit sits at each hip. Controlled gas release through directional nozzles allows the soldier to accelerate, brake, and steer mid-air.',
    partIds: ['part-thruster-l', 'part-thruster-r'],
    leaderEnd : { x: 248, y: 175 },
    label : { x: 262, y: 148, anchor: 'start' },
    side  : 'right',
  },
  {
    id    : 'shoulder-strap',
    name  : 'Shoulder Straps',
    detail: 'Pivot-mounted brackets',
    desc  : 'Articulating shoulder mounts allow full arm movement while keeping the gear rigidly fixed to the body. Pivot brackets absorb sudden directional changes.',
    partIds: ['part-strap-l', 'part-strap-r'],
    leaderEnd : { x: 165, y: 140 },
    label : { x: 262, y: 178, anchor: 'start' },
    side  : 'right',
  },
  {
    id    : 'leg-wrap',
    name  : 'Leg Wraps',
    detail: 'Impact distribution',
    desc  : 'Wrapped around the thighs and calves, these reinforced straps transfer landing impact forces up through the harness rather than into the joints.',
    partIds: ['part-leg-l', 'part-leg-r'],
    leaderEnd : { x: 148, y: 268 },
    label : { x: 262, y: 208, anchor: 'start' },
    side  : 'right',
  },
  {
    id    : 'blades',
    name  : 'Blades',
    detail: 'Single-use ultra-hard steel',
    desc  : 'The signature paired blades are replaceable after each use — the steel is brittle enough to shatter on titan bones but sharp enough to sever the nape in one stroke.',
    partIds: ['part-sword-l', 'part-sword-r'],
    leaderEnd : { x: 200, y: 216 },
    label : { x: 262, y: 238, anchor: 'start' },
    side  : 'right',
  },
]

export default function ODMGear() {
  const sectionRef  = useRef(null)
  const stickyRef   = useRef(null)
  const headerRef   = useRef(null)
  const svgRef      = useRef(null)
  const badgeRef    = useRef(null)
  const tooltipRef  = useRef(null)
  const leaderRefs  = useRef([])
  const labelRefs   = useRef([])
  const dotRefs     = useRef([])

  const [tooltip, setTooltip]     = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [focusedPart, setFocusedPart] = useState(null)

  const handlePartEnter = useCallback((partId, e) => {
    const part = PARTS.find(p => p.id === partId)
    if (!part) return
    setFocusedPart(partId)
    setTooltip(part)
    setTooltipPos({ x: e.clientX + 16, y: e.clientY - 10 })
    svgRef.current?.classList.add('odm-dimmed')
    part.partIds.forEach(pid => {
      document.getElementById(pid)?.classList.add('odm-part--focused')
    })
  }, [])

  const handlePartLeave = useCallback(() => {
    setFocusedPart(null)
    setTooltip(null)
    svgRef.current?.classList.remove('odm-dimmed')
    document.querySelectorAll('.odm-part--focused')
      .forEach(el => el.classList.remove('odm-part--focused'))
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (tooltip) setTooltipPos({ x: e.clientX + 16, y: e.clientY - 10 })
  }, [tooltip])

  useEffect(() => {
    const section = sectionRef.current
    const sticky  = stickyRef.current
    if (!section || !sticky) return

    const scrollLen = window.innerHeight * 6
    section.style.height = `${scrollLen + window.innerHeight}px`

    // Header fade in on approach
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      {
        opacity : 1, y: 0, duration: 0.6,
        scrollTrigger: {
          trigger      : section,
          start        : 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger   : section,
        start     : 'top top',
        end       : `+=${scrollLen}`,
        scrub     : 1.6,
        pin       : sticky,
        pinSpacing: false,
      },
    })

    // 0.00 — Badge fades in
    tl.fromTo(badgeRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.1 },
      0.02
    )

    // Leader lines draw in + label fades, staggered per part
    PARTS.forEach((part, i) => {
      const leader = leaderRefs.current[i]
      const label  = labelRefs.current[i]
      const dot    = dotRefs.current[i]
      if (!leader || !label) return

      const start = 0.08 + i * 0.09

      // Line draws in
      tl.fromTo(leader,
        { strokeDashoffset: 300 },
        { strokeDashoffset: 0, duration: 0.1, ease: 'power2.inOut' },
        start
      )
      // Dot pops
      tl.fromTo(dot,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.06, ease: 'back.out(2)' },
        start + 0.07
      )
      // Label fades
      tl.fromTo(label,
        { opacity: 0, x: part.side === 'left' ? -12 : 12 },
        { opacity: 1, x: 0, duration: 0.1 },
        start + 0.08
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section className="odm-section" ref={sectionRef} onMouseMove={handleMouseMove}>
      <div className="odm-sticky" ref={stickyRef}>

        <div className="odm-bg" />
        <div className="odm-grain" />

        {/* Header */}
        <div className="odm-header" ref={headerRef}>
          <div className="odm-header-eyebrow">
            <span className="odm-header-rule" />
            <span className="odm-header-eyebrow-txt">Equipment · Schema</span>
            <span className="odm-header-rule" />
          </div>
          <h2 className="odm-header-title">ODM Gear Breakdown</h2>
          <p className="odm-header-sub">Omni-Directional Maneuver Gear — Technical Analysis</p>
        </div>

        {/* Schematic canvas */}
        <div className="odm-canvas">
          <svg
            ref={svgRef}
            className="odm-schematic-svg"
            viewBox="0 0 320 340"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="ODM Gear technical schematic"
          >
            <defs>
              <marker id="odm-arrow" viewBox="0 0 8 8" refX="6" refY="4"
                markerWidth="5" markerHeight="5" orient="auto">
                <path d="M1 1L6 4L1 7" fill="none" stroke="rgba(196,164,80,0.6)"
                  strokeWidth="1.2" strokeLinecap="round"/>
              </marker>
            </defs>

            {/* ── Schematic body ─────────────────────── */}

            {/* Torso / body silhouette */}
            <g id="part-belt" className="odm-part"
              onMouseEnter={e => handlePartEnter('belt-harness', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              {/* Main torso block */}
              <rect x="128" y="118" width="64" height="78" rx="4"
                fill="none" stroke="rgba(196,164,80,0.45)" strokeWidth="0.8"/>
              {/* Belt horizontal straps */}
              <line x1="118" y1="150" x2="202" y2="150"
                stroke="rgba(196,164,80,0.5)" strokeWidth="1.2"/>
              <line x1="122" y1="162" x2="198" y2="162"
                stroke="rgba(196,164,80,0.35)" strokeWidth="0.7"/>
              {/* Chest vertical straps */}
              <line x1="152" y1="118" x2="148" y2="150"
                stroke="rgba(196,164,80,0.4)" strokeWidth="0.8"/>
              <line x1="168" y1="118" x2="172" y2="150"
                stroke="rgba(196,164,80,0.4)" strokeWidth="0.8"/>
              {/* Center buckle */}
              <rect x="153" y="145" width="14" height="10" rx="2"
                fill="rgba(196,164,80,0.15)" stroke="rgba(196,164,80,0.55)" strokeWidth="0.7"/>
              <line x1="160" y1="145" x2="160" y2="155"
                stroke="rgba(196,164,80,0.5)" strokeWidth="0.6"/>
            </g>

            {/* Shoulder straps */}
            <g id="part-strap-l" className="odm-part"
              onMouseEnter={e => handlePartEnter('shoulder-strap', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <path d="M128 122 Q115 115 112 105 Q110 98 118 95 Q126 93 130 100 L128 118Z"
                fill="none" stroke="rgba(196,164,80,0.5)" strokeWidth="0.8"/>
              {/* Pivot bracket */}
              <circle cx="120" cy="107" r="3.5"
                fill="none" stroke="rgba(196,164,80,0.6)" strokeWidth="0.7"/>
              <circle cx="120" cy="107" r="1.2" fill="rgba(196,164,80,0.4)"/>
            </g>
            <g id="part-strap-r" className="odm-part"
              onMouseEnter={e => handlePartEnter('shoulder-strap', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <path d="M192 122 Q205 115 208 105 Q210 98 202 95 Q194 93 190 100 L192 118Z"
                fill="none" stroke="rgba(196,164,80,0.5)" strokeWidth="0.8"/>
              <circle cx="200" cy="107" r="3.5"
                fill="none" stroke="rgba(196,164,80,0.6)" strokeWidth="0.7"/>
              <circle cx="200" cy="107" r="1.2" fill="rgba(196,164,80,0.4)"/>
            </g>

            {/* Gas canisters */}
            <g id="part-gas-l" className="odm-part"
              onMouseEnter={e => handlePartEnter('gas-canister', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <rect x="104" y="140" width="14" height="30" rx="6"
                fill="rgba(30,25,15,0.8)" stroke="rgba(196,164,80,0.65)" strokeWidth="0.9"/>
              <line x1="107" y1="148" x2="115" y2="148"
                stroke="rgba(196,164,80,0.35)" strokeWidth="0.5"/>
              <line x1="107" y1="155" x2="115" y2="155"
                stroke="rgba(196,164,80,0.35)" strokeWidth="0.5"/>
              <line x1="107" y1="162" x2="115" y2="162"
                stroke="rgba(196,164,80,0.35)" strokeWidth="0.5"/>
              {/* Pressure cap */}
              <ellipse cx="111" cy="140" rx="5" ry="2"
                fill="none" stroke="rgba(196,164,80,0.5)" strokeWidth="0.7"/>
            </g>
            <g id="part-gas-r" className="odm-part"
              onMouseEnter={e => handlePartEnter('gas-canister', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <rect x="202" y="140" width="14" height="30" rx="6"
                fill="rgba(30,25,15,0.8)" stroke="rgba(196,164,80,0.65)" strokeWidth="0.9"/>
              <line x1="205" y1="148" x2="213" y2="148"
                stroke="rgba(196,164,80,0.35)" strokeWidth="0.5"/>
              <line x1="205" y1="155" x2="213" y2="155"
                stroke="rgba(196,164,80,0.35)" strokeWidth="0.5"/>
              <line x1="205" y1="162" x2="213" y2="162"
                stroke="rgba(196,164,80,0.35)" strokeWidth="0.5"/>
              <ellipse cx="209" cy="140" rx="5" ry="2"
                fill="none" stroke="rgba(196,164,80,0.5)" strokeWidth="0.7"/>
            </g>

            {/* Thruster bodies */}
            <g id="part-thruster-l" className="odm-part"
              onMouseEnter={e => handlePartEnter('thruster-body', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <rect x="108" y="172" width="20" height="28" rx="3"
                fill="rgba(20,15,10,0.9)" stroke="rgba(196,164,80,0.55)" strokeWidth="0.9"/>
              {/* Exhaust ports */}
              <ellipse cx="113" cy="198" rx="2" ry="1.5"
                fill="rgba(155,26,26,0.4)" stroke="rgba(155,26,26,0.6)" strokeWidth="0.5"/>
              <ellipse cx="121" cy="198" rx="2" ry="1.5"
                fill="rgba(155,26,26,0.4)" stroke="rgba(155,26,26,0.6)" strokeWidth="0.5"/>
              {/* Control panel lines */}
              <line x1="111" y1="180" x2="126" y2="180"
                stroke="rgba(196,164,80,0.3)" strokeWidth="0.5"/>
              <line x1="111" y1="185" x2="126" y2="185"
                stroke="rgba(196,164,80,0.2)" strokeWidth="0.4"/>
            </g>
            <g id="part-thruster-r" className="odm-part"
              onMouseEnter={e => handlePartEnter('thruster-body', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <rect x="192" y="172" width="20" height="28" rx="3"
                fill="rgba(20,15,10,0.9)" stroke="rgba(196,164,80,0.55)" strokeWidth="0.9"/>
              <ellipse cx="197" cy="198" rx="2" ry="1.5"
                fill="rgba(155,26,26,0.4)" stroke="rgba(155,26,26,0.6)" strokeWidth="0.5"/>
              <ellipse cx="205" cy="198" rx="2" ry="1.5"
                fill="rgba(155,26,26,0.4)" stroke="rgba(155,26,26,0.6)" strokeWidth="0.5"/>
              <line x1="194" y1="180" x2="209" y2="180"
                stroke="rgba(196,164,80,0.3)" strokeWidth="0.5"/>
              <line x1="194" y1="185" x2="209" y2="185"
                stroke="rgba(196,164,80,0.2)" strokeWidth="0.4"/>
            </g>

            {/* Wire reels */}
            <g id="part-reel-l" className="odm-part"
              onMouseEnter={e => handlePartEnter('wire-reel', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <circle cx="113" cy="188" r="7"
                fill="none" stroke="rgba(196,164,80,0.5)" strokeWidth="0.8"/>
              <circle cx="113" cy="188" r="3"
                fill="none" stroke="rgba(196,164,80,0.35)" strokeWidth="0.6"/>
              <circle cx="113" cy="188" r="1" fill="rgba(196,164,80,0.5)"/>
              {/* Wire coil hint */}
              <path d="M108 184 Q106 188 108 192" fill="none"
                stroke="rgba(196,164,80,0.25)" strokeWidth="0.5"/>
            </g>
            <g id="part-reel-r" className="odm-part"
              onMouseEnter={e => handlePartEnter('wire-reel', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <circle cx="207" cy="188" r="7"
                fill="none" stroke="rgba(196,164,80,0.5)" strokeWidth="0.8"/>
              <circle cx="207" cy="188" r="3"
                fill="none" stroke="rgba(196,164,80,0.35)" strokeWidth="0.6"/>
              <circle cx="207" cy="188" r="1" fill="rgba(196,164,80,0.5)"/>
              <path d="M212 184 Q214 188 212 192" fill="none"
                stroke="rgba(196,164,80,0.25)" strokeWidth="0.5"/>
            </g>

            {/* Blade holders */}
            <g id="part-blade-l" className="odm-part"
              onMouseEnter={e => handlePartEnter('blade-holder', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <rect x="115" y="200" width="10" height="24" rx="2"
                fill="rgba(15,12,8,0.9)" stroke="rgba(196,164,80,0.5)" strokeWidth="0.7"/>
              <line x1="117" y1="205" x2="123" y2="205"
                stroke="rgba(196,164,80,0.3)" strokeWidth="0.4"/>
              <line x1="117" y1="216" x2="123" y2="216"
                stroke="rgba(196,164,80,0.3)" strokeWidth="0.4"/>
              {/* Blade tip peek */}
              <line x1="120" y1="224" x2="120" y2="230"
                stroke="rgba(212,207,196,0.6)" strokeWidth="1.5"/>
            </g>
            <g id="part-blade-r" className="odm-part"
              onMouseEnter={e => handlePartEnter('blade-holder', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <rect x="195" y="200" width="10" height="24" rx="2"
                fill="rgba(15,12,8,0.9)" stroke="rgba(196,164,80,0.5)" strokeWidth="0.7"/>
              <line x1="197" y1="205" x2="203" y2="205"
                stroke="rgba(196,164,80,0.3)" strokeWidth="0.4"/>
              <line x1="197" y1="216" x2="203" y2="216"
                stroke="rgba(196,164,80,0.3)" strokeWidth="0.4"/>
              <line x1="200" y1="224" x2="200" y2="230"
                stroke="rgba(212,207,196,0.6)" strokeWidth="1.5"/>
            </g>

            {/* Grapple hooks / wire lines */}
            <g id="part-hook-l" className="odm-part"
              onMouseEnter={e => handlePartEnter('grapple-hook', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              {/* Wire line */}
              <path d="M113 195 Q90 210 72 238 Q65 250 60 258"
                fill="none" stroke="rgba(212,207,196,0.25)" strokeWidth="0.6"
                strokeDasharray="3 2"/>
              {/* Hook */}
              <path d="M58 255 Q54 258 55 264 Q57 268 62 266 Q66 263 64 258"
                fill="none" stroke="rgba(212,207,196,0.6)" strokeWidth="1.2"
                strokeLinecap="round"/>
              <circle cx="58" cy="256" r="1.2" fill="rgba(212,207,196,0.5)"/>
            </g>
            <g id="part-hook-r" className="odm-part"
              onMouseEnter={e => handlePartEnter('grapple-hook', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <path d="M207 195 Q230 210 248 238 Q255 250 260 258"
                fill="none" stroke="rgba(212,207,196,0.25)" strokeWidth="0.6"
                strokeDasharray="3 2"/>
              <path d="M262 255 Q266 258 265 264 Q263 268 258 266 Q254 263 256 258"
                fill="none" stroke="rgba(212,207,196,0.6)" strokeWidth="1.2"
                strokeLinecap="round"/>
              <circle cx="262" cy="256" r="1.2" fill="rgba(212,207,196,0.5)"/>
            </g>

            {/* Swords (drawn / extended) */}
            <g id="part-sword-l" className="odm-part"
              onMouseEnter={e => handlePartEnter('blades', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              {/* Handle */}
              <rect x="116" y="226" width="8" height="14" rx="1"
                fill="rgba(80,60,40,0.9)" stroke="rgba(196,164,80,0.4)" strokeWidth="0.6"/>
              {/* Guard */}
              <rect x="113" y="237" width="14" height="3" rx="1"
                fill="none" stroke="rgba(196,164,80,0.55)" strokeWidth="0.7"/>
              {/* Blade */}
              <path d="M118 240 L117 295 L120 298 L123 295 L122 240Z"
                fill="rgba(220,215,205,0.18)" stroke="rgba(212,207,196,0.65)" strokeWidth="0.6"/>
              {/* Edge highlight */}
              <line x1="120" y1="240" x2="120" y2="296"
                stroke="rgba(240,235,228,0.4)" strokeWidth="0.4"/>
            </g>
            <g id="part-sword-r" className="odm-part"
              onMouseEnter={e => handlePartEnter('blades', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <rect x="196" y="226" width="8" height="14" rx="1"
                fill="rgba(80,60,40,0.9)" stroke="rgba(196,164,80,0.4)" strokeWidth="0.6"/>
              <rect x="193" y="237" width="14" height="3" rx="1"
                fill="none" stroke="rgba(196,164,80,0.55)" strokeWidth="0.7"/>
              <path d="M198 240 L197 295 L200 298 L203 295 L202 240Z"
                fill="rgba(220,215,205,0.18)" stroke="rgba(212,207,196,0.65)" strokeWidth="0.6"/>
              <line x1="200" y1="240" x2="200" y2="296"
                stroke="rgba(240,235,228,0.4)" strokeWidth="0.4"/>
            </g>

            {/* Leg wraps */}
            <g id="part-leg-l" className="odm-part"
              onMouseEnter={e => handlePartEnter('leg-wrap', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <rect x="128" y="200" width="20" height="50" rx="2"
                fill="none" stroke="rgba(196,164,80,0.3)" strokeWidth="0.6"
                strokeDasharray="3 2"/>
              <line x1="128" y1="214" x2="148" y2="214"
                stroke="rgba(196,164,80,0.25)" strokeWidth="0.5"/>
              <line x1="128" y1="228" x2="148" y2="228"
                stroke="rgba(196,164,80,0.25)" strokeWidth="0.5"/>
              <line x1="128" y1="240" x2="148" y2="240"
                stroke="rgba(196,164,80,0.2)" strokeWidth="0.4"/>
            </g>
            <g id="part-leg-r" className="odm-part"
              onMouseEnter={e => handlePartEnter('leg-wrap', e)}
              onMouseLeave={handlePartLeave}
              style={{ cursor: 'crosshair' }}>
              <rect x="172" y="200" width="20" height="50" rx="2"
                fill="none" stroke="rgba(196,164,80,0.3)" strokeWidth="0.6"
                strokeDasharray="3 2"/>
              <line x1="172" y1="214" x2="192" y2="214"
                stroke="rgba(196,164,80,0.25)" strokeWidth="0.5"/>
              <line x1="172" y1="228" x2="192" y2="228"
                stroke="rgba(196,164,80,0.25)" strokeWidth="0.5"/>
              <line x1="172" y1="240" x2="192" y2="240"
                stroke="rgba(196,164,80,0.2)" strokeWidth="0.4"/>
            </g>

            {/* Measurement tick marks */}
            <g opacity="0.2" stroke="rgba(196,164,80,1)" strokeWidth="0.4">
              <line x1="94" y1="118" x2="94" y2="302"/>
              <line x1="91" y1="118" x2="97" y2="118"/>
              <line x1="91" y1="210" x2="97" y2="210"/>
              <line x1="91" y1="302" x2="97" y2="302"/>
            </g>
            <text x="89" y="167" textAnchor="middle"
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '4.5px',
                fill: 'rgba(196,164,80,0.3)',
                letterSpacing: '0.1em',
              }}
              transform="rotate(-90, 89, 167)">
              1.82 m
            </text>

            {/* ── Leader lines (drawn in by GSAP) ─────── */}
            {PARTS.map((part, i) => {
              const lx = part.side === 'left' ? 30 : 280
              return (
                <g key={part.id}>
                  {/* Leader line */}
                  <line
                    ref={el => leaderRefs.current[i] = el}
                    className="odm-leader"
                    x1={part.leaderEnd.x}
                    y1={part.leaderEnd.y}
                    x2={lx}
                    y2={part.label.y}
                    markerEnd="url(#odm-arrow)"
                  />
                  {/* Dot at part contact point */}
                  <circle
                    ref={el => dotRefs.current[i] = el}
                    className="odm-leader-dot"
                    cx={part.leaderEnd.x}
                    cy={part.leaderEnd.y}
                    r="2"
                  />
                  {/* Label group */}
                  <g
                    ref={el => labelRefs.current[i] = el}
                    className="odm-label"
                  >
                    <text
                      className="odm-label-name"
                      x={part.label.x}
                      y={part.label.y - 2}
                      textAnchor={part.label.anchor}
                    >
                      {part.name}
                    </text>
                    <text
                      className="odm-label-detail"
                      x={part.label.x}
                      y={part.label.y + 8}
                      textAnchor={part.label.anchor}
                    >
                      {part.detail}
                    </text>
                  </g>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Part count badge */}
        <div className="odm-badge" ref={badgeRef}>
          <span className="odm-badge-txt">Components annotated</span>
          <span className="odm-badge-num">{PARTS.length}</span>
          <span className="odm-badge-txt">· Hover to isolate</span>
        </div>

      </div>

      {/* Floating tooltip */}
      <div
        ref={tooltipRef}
        className={`odm-tooltip ${tooltip ? 'odm-tooltip--visible' : ''}`}
        style={{ left: tooltipPos.x, top: tooltipPos.y }}
      >
        {tooltip && (
          <>
            <p className="odm-tooltip-name">{tooltip.name}</p>
            <p className="odm-tooltip-desc">{tooltip.desc}</p>
          </>
        )}
      </div>
    </section>
  )
}