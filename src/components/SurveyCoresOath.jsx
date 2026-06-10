import { useEffect, useRef } from 'react'
import './SurveyCoresOath.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Wings of Freedom SVG (Survey Corps emblem) ── */
const WingsSVG = () => (
  <svg
    className="oath-wings-svg"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Central body */}
    <ellipse cx="200" cy="200" rx="18" ry="28" fill="var(--bone)" opacity="0.9"/>
    <ellipse cx="200" cy="185" rx="10" ry="13" fill="var(--bone)" opacity="0.7"/>

    {/* Left wing — upper arc */}
    <path
      d="M182 195 C155 175, 100 150, 55 120 C80 130, 110 148, 125 162
         C95 148, 58 138, 28 118 C55 132, 88 155, 105 175
         C75 165, 45 158, 22 145 C45 162, 78 178, 100 192
         C72 185, 42 180, 20 172 C42 188, 75 198, 100 205
         C80 202, 55 200, 35 196 C55 210, 82 215, 105 216
         Z"
      fill="var(--bone)"
      opacity="0.85"
    />
    {/* Left wing — feather detail lines */}
    <path d="M182 195 C160 182, 130 168, 95 160" stroke="var(--void)" strokeWidth="1.5" opacity="0.4"/>
    <path d="M178 200 C155 190, 122 180, 85 175" stroke="var(--void)" strokeWidth="1" opacity="0.3"/>
    <path d="M175 207 C153 200, 118 195, 78 192" stroke="var(--void)" strokeWidth="1" opacity="0.25"/>

    {/* Right wing — mirror */}
    <path
      d="M218 195 C245 175, 300 150, 345 120 C320 130, 290 148, 275 162
         C305 148, 342 138, 372 118 C345 132, 312 155, 295 175
         C325 165, 355 158, 378 145 C355 162, 322 178, 300 192
         C328 185, 358 180, 380 172 C358 188, 325 198, 300 205
         C320 202, 345 200, 365 196 C345 210, 318 215, 295 216
         Z"
      fill="var(--bone)"
      opacity="0.85"
    />
    {/* Right wing — feather detail lines */}
    <path d="M218 195 C240 182, 270 168, 305 160" stroke="var(--void)" strokeWidth="1.5" opacity="0.4"/>
    <path d="M222 200 C245 190, 278 180, 315 175" stroke="var(--void)" strokeWidth="1" opacity="0.3"/>
    <path d="M225 207 C247 200, 282 195, 322 192" stroke="var(--void)" strokeWidth="1" opacity="0.25"/>

    {/* Lower left wing */}
    <path
      d="M185 210 C160 220, 110 240, 65 270
         C88 255, 118 240, 135 232
         C105 248, 72 262, 45 278
         C70 262, 102 248, 122 240
         C96 254, 65 268, 42 282
         C66 268, 98 255, 120 248 Z"
      fill="var(--bone)"
      opacity="0.7"
    />
    {/* Lower right wing */}
    <path
      d="M215 210 C240 220, 290 240, 335 270
         C312 255, 282 240, 265 232
         C295 248, 328 262, 355 278
         C330 262, 298 248, 278 240
         C304 254, 335 268, 358 282
         C334 268, 302 255, 280 248 Z"
      fill="var(--bone)"
      opacity="0.7"
    />

    {/* Center crest ornament */}
    <path
      d="M200 158 L205 172 L220 172 L208 181 L213 196 L200 187 L187 196 L192 181 L180 172 L195 172 Z"
      fill="var(--gold)"
      opacity="0.8"
    />
  </svg>
)

export default function SurveyCoresOath() {
  const sectionRef  = useRef(null)
  const stickyRef   = useRef(null)
  const wingsRef    = useRef(null)
  const eyebrowRef  = useRef(null)
  const preludeRef  = useRef(null)
  const dividerRef  = useRef(null)
  const jpRef       = useRef(null)
  const finalRef    = useRef(null)

  // Word refs: each line is an array
  const wordRefs = useRef({
    line1 : [],  // DEDICATE
    line2 : [],  // YOUR
    line3 : [],  // HEART
    line4 : [],  // attribution
  })

  useEffect(() => {
    const section = sectionRef.current
    const sticky  = stickyRef.current
    if (!section || !sticky) return

    const scrollLen = window.innerHeight * 5
    section.style.height = `${scrollLen + window.innerHeight}px`

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger   : section,
        start     : 'top top',
        end       : `+=${scrollLen}`,
        scrub     : 1.8,
        pin       : sticky,
        pinSpacing: false,
      },
      defaults: { ease: 'power3.out' },
    })

    // 0.00 — Wings fade in and begin slow rotation
    tl.fromTo(wingsRef.current,
      { opacity: 0, rotation: -8, scale: 0.88 },
      { opacity: 1, rotation: 0,  scale: 1, duration: 0.25 },
      0.00
    )
    // Wings continue rotating throughout
    tl.to(wingsRef.current,
      { rotation: 12, ease: 'none', duration: 1 },
      0.25
    )

    // 0.05 — Eyebrow fades up
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.12 },
      0.05
    )

    // 0.10 — Prelude line
    tl.fromTo(preludeRef.current,
      { opacity: 0, y: 20, filter: 'blur(4px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.14 },
      0.10
    )

    // 0.20 — "DEDICATE" — words scatter in from random directions
    const dedWords = wordRefs.current.line1
    dedWords.forEach((el, i) => {
      if (!el) return
      const angle = (i / dedWords.length) * 360
      const dist  = 80 + Math.random() * 60
      const ox    = Math.cos((angle * Math.PI) / 180) * dist
      const oy    = Math.sin((angle * Math.PI) / 180) * dist - 40
      tl.fromTo(el,
        { opacity: 0, x: ox, y: oy, filter: 'blur(10px)', scale: 0.7 },
        { opacity: 1, x: 0,  y: 0,  filter: 'blur(0px)',  scale: 1, duration: 0.14 },
        0.20 + i * 0.02
      )
    })

    // 0.36 — "YOUR" — slides up letter by letter
    const yourWords = wordRefs.current.line2
    yourWords.forEach((el, i) => {
      if (!el) return
      tl.fromTo(el,
        { opacity: 0, y: 30, letterSpacing: '1.2em' },
        { opacity: 1, y: 0,  letterSpacing: '0.5em', duration: 0.12 },
        0.36 + i * 0.03
      )
    })

    // 0.50 — "HEART" — crashes in from below, large
    const heartWords = wordRefs.current.line3
    heartWords.forEach((el, i) => {
      if (!el) return
      tl.fromTo(el,
        { opacity: 0, y: 100, scale: 1.3, filter: 'blur(18px)' },
        { opacity: 1, y: 0,   scale: 1,   filter: 'blur(0px)',  duration: 0.18 },
        0.50 + i * 0.03
      )
    })

    // 0.66 — Divider rule draws in
    tl.fromTo(dividerRef.current,
      { width: '0%', opacity: 0 },
      { width: '40%', opacity: 1, ease: 'power2.inOut', duration: 0.1 },
      0.66
    )

    // 0.70 — Attribution fades in
    const attrWords = wordRefs.current.line4
    attrWords.forEach((el, i) => {
      if (!el) return
      tl.fromTo(el,
        { opacity: 0, x: i % 2 === 0 ? -20 : 20 },
        { opacity: 0.75, x: 0, duration: 0.1 },
        0.70 + i * 0.025
      )
    })

    // 0.78 — Japanese subtitle
    tl.fromTo(jpRef.current,
      { opacity: 0, y: 10, letterSpacing: '0.6em' },
      { opacity: 1, y: 0,  letterSpacing: '0.3em', duration: 0.12 },
      0.78
    )

    // 0.88 — Final phrase reveals + begins pulse
    tl.fromTo(finalRef.current,
      { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
      {
        opacity  : 1,
        scale    : 1,
        filter   : 'blur(0px)',
        duration : 0.14,
        onComplete: () => {
          finalRef.current?.classList.add('oath-final--active')
        },
      },
      0.88
    )

    // Exit: everything fades out together at the end
    tl.to(
      [wingsRef.current, eyebrowRef.current, preludeRef.current,
       ...wordRefs.current.line1, ...wordRefs.current.line2,
       ...wordRefs.current.line3, ...wordRefs.current.line4,
       dividerRef.current, jpRef.current, finalRef.current],
      { opacity: 0, y: -30, filter: 'blur(8px)', duration: 0.1, stagger: 0.008 },
      0.94
    )

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
      finalRef.current?.classList.remove('oath-final--active')
    }
  }, [])

  return (
    <section className="oath-section" ref={sectionRef}>
      <div className="oath-sticky" ref={stickyRef}>

        <div className="oath-bg" />

        {/* Rotating wings background */}
        <div className="oath-wings-wrap" ref={wingsRef}>
          <WingsSVG />
        </div>

        <div className="oath-vignette" />
        <div className="oath-grain" />

        {/* All text — centered column */}
        <div className="oath-text-wrap">

          {/* Eyebrow */}
          <div className="oath-eyebrow" ref={eyebrowRef}>
            <span className="oath-eyebrow-rule" />
            <span className="oath-eyebrow-txt">Survey Corps · The Oath</span>
            <span className="oath-eyebrow-rule" />
          </div>

          {/* Prelude */}
          <p className="oath-prelude" ref={preludeRef}>
            Before every expedition beyond the walls, soldiers speak these words—
          </p>

          {/* Line 1: DEDICATE */}
          <div className="oath-line oath-line--1">
            {['DEDICATE'].map((word, i) => (
              <WordSpan
                key={word + i}
                word={word}
                setRef={el => wordRefs.current.line1[i] = el}
              />
            ))}
          </div>

          {/* Line 2: YOUR */}
          <div className="oath-line oath-line--2">
            {['YOUR'].map((word, i) => (
              <WordSpan
                key={word + i}
                word={word}
                setRef={el => wordRefs.current.line2[i] = el}
              />
            ))}
          </div>

          {/* Line 3: HEART */}
          <div className="oath-line oath-line--3">
            {['HEART'].map((word, i) => (
              <WordSpan
                key={word + i}
                word={word}
                setRef={el => wordRefs.current.line3[i] = el}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="oath-divider" ref={dividerRef} />

          {/* Line 4: attribution */}
          <div className="oath-line oath-line--4">
            {['—', 'Survey', 'Corps', 'Induction', 'Oath'].map((word, i) => (
              <WordSpan
                key={word + i}
                word={word}
                setRef={el => wordRefs.current.line4[i] = el}
              />
            ))}
          </div>

          {/* Japanese */}
          <p className="oath-jp" ref={jpRef}>
            心臓を捧げよ &nbsp;·&nbsp; Shinzou wo Sasageyo
          </p>

          {/* Final pulse phrase */}
          <p className="oath-final" ref={finalRef}>
            Till the last breath
          </p>

        </div>
      </div>
    </section>
  )
}

/* Extracted so it is never called inside a .map() as a hook-bearing component */
function WordSpan({ word, setRef }) {
  return (
    <span className="oath-word" ref={setRef}>
      {word}
    </span>
  )
}