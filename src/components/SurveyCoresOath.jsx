import { useEffect, useRef } from 'react'
import './SurveyCoresOath.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SurveyCoresOath() {
  const sectionRef  = useRef(null)
  const stickyRef   = useRef(null)
  const wingsRef    = useRef(null)
  const eyebrowRef  = useRef(null)
  const preludeRef  = useRef(null)
  const dividerRef  = useRef(null)
  const jpRef       = useRef(null)
  const finalRef    = useRef(null)

  const wordRefs = useRef({
    line1 : [],
    line2 : [],
    line3 : [],
    line4 : [],
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

    // 0.00 — Emblem fades in, scales up from slightly small, slow rotation
    tl.fromTo(wingsRef.current,
      { opacity: 0, rotation: -6, scale: 0.82 },
      { opacity: 1, rotation: 0,  scale: 1,    duration: 0.28 },
      0.00
    )
    tl.to(wingsRef.current,
      { rotation: 10, ease: 'none', duration: 1 },
      0.28
    )

    // 0.05 — Eyebrow
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.12 },
      0.05
    )

    // 0.10 — Prelude
    tl.fromTo(preludeRef.current,
      { opacity: 0, y: 20, filter: 'blur(4px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.14 },
      0.10
    )

    // 0.20 — "DEDICATE" words scatter in from random directions
    const dedWords = wordRefs.current.line1
    dedWords.forEach((el, i) => {
      if (!el) return
      const angle = (i / Math.max(dedWords.length, 1)) * 360
      const dist  = 80 + Math.random() * 60
      const ox    = Math.cos((angle * Math.PI) / 180) * dist
      const oy    = Math.sin((angle * Math.PI) / 180) * dist - 40
      tl.fromTo(el,
        { opacity: 0, x: ox, y: oy, filter: 'blur(10px)', scale: 0.7 },
        { opacity: 1, x: 0,  y: 0,  filter: 'blur(0px)',  scale: 1,   duration: 0.14 },
        0.20 + i * 0.02
      )
    })

    // 0.36 — "YOUR" slides up
    const yourWords = wordRefs.current.line2
    yourWords.forEach((el, i) => {
      if (!el) return
      tl.fromTo(el,
        { opacity: 0, y: 30, letterSpacing: '1.2em' },
        { opacity: 1, y: 0,  letterSpacing: '0.5em', duration: 0.12 },
        0.36 + i * 0.03
      )
    })

    // 0.50 — "HEART" crashes in from below
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

    // 0.70 — Attribution
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

    // 0.88 — Final phrase
    tl.fromTo(finalRef.current,
      { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
      {
        opacity  : 1,
        scale    : 1,
        filter   : 'blur(0px)',
        duration : 0.14,
        onComplete: () => finalRef.current?.classList.add('oath-final--active'),
      },
      0.88
    )

    // 0.94 — Exit
    tl.to(
      [
        wingsRef.current, eyebrowRef.current, preludeRef.current,
        ...wordRefs.current.line1, ...wordRefs.current.line2,
        ...wordRefs.current.line3, ...wordRefs.current.line4,
        dividerRef.current, jpRef.current, finalRef.current,
      ],
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

        {/* Real Survey Corps emblem — mix-blend-mode:screen knocks out the white/grey bg */}
        <div className="oath-wings-wrap" ref={wingsRef}>
          <img
            src="/images/survey-corps-emblem.png"
            alt="Survey Corps Wings of Freedom"
            className="oath-emblem-img"
            draggable={false}
          />
        </div>

        <div className="oath-vignette" />
        <div className="oath-grain" />

        <div className="oath-text-wrap">

          <div className="oath-eyebrow" ref={eyebrowRef}>
            <span className="oath-eyebrow-rule" />
            <span className="oath-eyebrow-txt">Survey Corps · The Oath</span>
            <span className="oath-eyebrow-rule" />
          </div>

          <p className="oath-prelude" ref={preludeRef}>
            Before every expedition beyond the walls, soldiers speak these words—
          </p>

          <div className="oath-line oath-line--1">
            {['DEDICATE'].map((word, i) => (
              <WordSpan key={word + i} word={word} setRef={el => wordRefs.current.line1[i] = el} />
            ))}
          </div>

          <div className="oath-line oath-line--2">
            {['YOUR'].map((word, i) => (
              <WordSpan key={word + i} word={word} setRef={el => wordRefs.current.line2[i] = el} />
            ))}
          </div>

          <div className="oath-line oath-line--3">
            {['HEART'].map((word, i) => (
              <WordSpan key={word + i} word={word} setRef={el => wordRefs.current.line3[i] = el} />
            ))}
          </div>

          <div className="oath-divider" ref={dividerRef} />

          <div className="oath-line oath-line--4">
            {['—', 'Survey', 'Corps', 'Induction', 'Oath'].map((word, i) => (
              <WordSpan key={word + i} word={word} setRef={el => wordRefs.current.line4[i] = el} />
            ))}
          </div>

          <p className="oath-jp" ref={jpRef}>
            心臓を捧げよ &nbsp;·&nbsp; Shinzou wo Sasageyo
          </p>

          <p className="oath-final" ref={finalRef}>
            Till the last breath
          </p>

        </div>
      </div>
    </section>
  )
}

function WordSpan({ word, setRef }) {
  return (
    <span className="oath-word" ref={setRef}>
      {word}
    </span>
  )
}