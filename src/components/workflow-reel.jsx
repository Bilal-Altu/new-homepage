import React, { useEffect, useRef, useState } from 'react'
import { CalendarCheck, ChatCircleDots, Check, FileText, Pause, Play, Stack } from '@phosphor-icons/react'

const asset = (path) => `${import.meta.env.BASE_URL}${path}`

// Ein Film über das, was SideTwo macht: Websites bauen, neue Kunden erreichen, mit KI den Alltag leichter machen.
// Machart eines Motion-Reels: vollflächige Farbkapitel, harte Schnitte, schwere Schrift – durchgehend Manrope.
// Die Spuren sind in Grundsekunden geschrieben; TEMPO dehnt den ganzen Film gleichmäßig.
const BASE_TOTAL = 21.2
const TEMPO = 1.3
export const REEL_TOTAL = BASE_TOTAL * TEMPO // echte Sekunden
const STILL_AT = 11.3 * TEMPO // Standbild bei reduzierter Bewegung: Karte mit allen erreichten Orten

// Karte der Region, Abstände in px vom Betrieb aus (Mitte der Karte), grob nach Lage
const TOWNS = [
  { name: 'WORMS', x: -238, y: -18 },
  { name: 'BIBLIS', x: -58, y: -176 },
  { name: 'BENSHEIM', x: 196, y: -150 },
  { name: 'HEPPENHEIM', x: 244, y: -8 },
  { name: 'LAMPERTHEIM', x: -96, y: 132 },
  { name: 'VIERNHEIM', x: 176, y: 128 },
  { name: 'MANNHEIM', x: 60, y: 226 },
]

export const reelCopy = {
  hook: { word: ['GUTE', 'ARBEIT'], line: ['Nur', 'kennt', 'sie', 'kaum', 'jemand.'] },
  web: {
    head: [['Wir', 'bauen'], ['euren', 'Auftritt.']],
    parts: 'DESIGN · TEXTE · SEO · HOSTING',
    claim: '10 WEB-PROJEKTE AUS DER REGION',
    // Echte Kundenseiten, aufgenommen am 30.09.2026
    sites: [
      { file: 'memic', url: 'ib-memic.de' },
      { file: 'kaltbrunn', url: 'ing-kaltbrunn.de' },
      { file: 'bukkador', url: 'bukkador-handpan.de' },
      { file: 'danico', url: 'da-nico.de' },
    ],
  },
  reach: {
    head: [['Neue', 'Kunden,'], ['die', 'euch', 'vorher'], ['nicht', 'fanden.']],
    parts: 'WEBSITE · SEO · LOKALE SICHTBARKEIT',
    center: 'EUER BETRIEB',
  },
  daily: {
    head: [['Der', 'Alltag'], ['wird', 'leichter.']],
    meta: 'KI-WERKZEUGE · AUTOMATISIERUNG',
    from: 'VON HAND',
    to: 'AUTOMATISCH',
    rows: [
      { n: '01', label: 'anfragen beantworten', Icon: ChatCircleDots, done: 'KI-ASSISTENT' },
      { n: '02', label: 'termine abstimmen', Icon: CalendarCheck, done: 'AUTOMATISCH' },
      { n: '03', label: 'angebote vorbereiten', Icon: FileText, done: 'VORBEREITET' },
      { n: '04', label: 'infos bündeln', Icon: Stack, done: 'AN EINEM ORT' },
    ],
  },
  result: { first: 'GEFUNDEN', pattern: 'EINFACHER', last: ['MEHR', 'ZEIT'], line: 'für das Wesentliche.' },
  fin: {
    word: 'SIDETWO',
    line: 'digitale Auftritte, die arbeiten.',
    meta: ['WEBSITES · AUTOMATISIERUNG · KI-AGENTEN', 'BÜRSTADT / 2026', 'SIDETWO.DE'],
  },
  summary: 'Film: Gute Arbeit, nur kennt sie kaum jemand. SideTwo baut den Auftritt (Ausschnitte echter Kundenseiten), macht den Betrieb in der Region für neue Kunden sichtbar und nimmt mit KI-Werkzeugen Routine ab: Anfragen, Termine, Angebote, Infos. Ergebnis: gefunden, einfacher, mehr Zeit für das Wesentliche.',
}

// Szenen mit harten Schnitten, Beginn in Grundsekunden
export const scenes = [
  { id: 's1a', at: 0 },
  { id: 's1b', at: 1.7 },
  { id: 's2', at: 3.6 },
  { id: 's3', at: 7.6 },
  { id: 's4', at: 11.6 },
  { id: 's5a', at: 15.4 },
  { id: 's5b', at: 16.2 },
  { id: 's5c', at: 17.0 },
  { id: 's6', at: 18.3 },
]

const EXPO = 'cubic-bezier(.16,1,.3,1)'
const EXPO_IN = 'cubic-bezier(.7,0,.84,0)'
const INOUT = 'cubic-bezier(.65,0,.35,1)'
const BACK = 'cubic-bezier(.34,1.56,.64,1)'
const GLIDE = 'cubic-bezier(.45,.05,.25,1)'
const LINEAR = 'linear'
const CUT = 0.001 // harter Schnitt innerhalb einer Spur

const up = (y) => `translate3d(0, ${y}px, 0)`
const move = (x, y) => `translate3d(${x}px, ${y}px, 0)`

// Wort für Wort mit kurzer Bewegungsunschärfe
const rise = (t, { dy = 44, dur = 0.7, blur = 8 } = {}) => [
  [t, { opacity: 0, transform: up(dy), filter: `blur(${blur}px)` }, EXPO],
  [t + dur, { opacity: 1, transform: up(0), filter: 'blur(0px)' }],
]
const appear = (t, dur = 0.4, ease = EXPO) => [[t, { opacity: 0 }, ease], [t + dur, { opacity: 1 }]]
const wordTracks = (count, start, step, opts) => Array.from({ length: count }, (_, i) => rise(start + i * step, opts))
// Sichtbar nur im Fenster [from, to), mit harten Kanten
const windowed = (from, to, extra = {}) => [
  [from - CUT, { opacity: 0, ...extra.before }, LINEAR],
  [from, { opacity: 1, ...extra.start }, extra.ease || LINEAR],
  [to, { opacity: 1, ...extra.end }, LINEAR],
  [to + CUT, { opacity: 0, ...extra.end }],
]
// Kinetisches Wort: schnell mit Unschärfe herein
const slam = (t, fromX) => [[t, { transform: `translate3d(${fromX}%, 0, 0)`, filter: 'blur(22px)' }, EXPO], [t + 0.4, { transform: 'translate3d(0%, 0, 0)', filter: 'blur(0px)' }]]

export function reelTracks() {
  const siteStarts = [3.75, 5.0, 5.55, 6.1]
  const siteEnds = [5.0, 5.55, 6.1, 7.6]
  const townAt = TOWNS.map((_, i) => 8.55 + i * 0.2)
  // Weiche, gleichmäßige Fahrt von links nach rechts; harte Bremskurven wirkten ruckelig
  const runs = [12.1, 12.4, 12.7, 13.0].map((t) => [t, 1.4, GLIDE])
  return {
    // Unsichtbarer Taktgeber für die harten Schnitte
    clock: [[0, { opacity: 0 }, LINEAR], [BASE_TOTAL, { opacity: 0 }]],

    // 01 Heute: „GUTE ARBEIT.“, dann ein einzelner Punkt in einem Feld aus Punkten
    's1a-type': slam(0.1, 42),
    's1b-ring': [[1.8, { opacity: 0, transform: 'scale(.2)' }, EXPO], [2.5, { opacity: 1, transform: 'scale(1)' }]],
    's1b-word': wordTracks(5, 1.95, 0.08, { dy: 26, dur: 0.6, blur: 6 }),
    's1b-dot': [[1.7, { transform: 'scale(1)' }, LINEAR], [3.15, { transform: 'scale(1)' }, EXPO_IN], [3.6, { transform: 'scale(92)' }]],
    's1b-field': [[1.7, { opacity: 0 }, EXPO], [2.3, { opacity: 1 }], [3.1, { opacity: 1 }, LINEAR], [3.2, { opacity: 0 }]],

    // 02 Website: Überschrift, Bestandteile, Browser mit harter Montage echter Kundenseiten
    's2-word': wordTracks(4, 3.7, 0.07),
    's2-parts': appear(4.5, 0.5),
    's2-claim': [[6.3, { clipPath: 'inset(0 100% 0 0)' }, EXPO], [6.9, { clipPath: 'inset(0 0% 0 0)' }]],
    's2-browser': [[3.72, { opacity: 0, transform: up(90) }, EXPO], [4.45, { opacity: 1, transform: up(0) }]],
    's2-site': siteStarts.map((from, i) => windowed(from, siteEnds[i], { before: { transform: 'scale(1.06)' }, start: { transform: 'scale(1.06)' }, end: { transform: 'scale(1)' }, ease: 'cubic-bezier(.2,.7,.3,1)' })),
    's2-url': siteStarts.map((from, i) => windowed(from, siteEnds[i])),
    's2-count': siteStarts.map((from, i) => windowed(from, siteEnds[i])),

    // 03 Neue Kunden: Punkt sendet Wellen, Orte der Region leuchten auf und verbinden sich mit dem Betrieb
    's3-word': wordTracks(7, 7.7, 0.06),
    's3-parts': appear(8.4, 0.5),
    's3-field': appear(7.65, 0.6),
    's3-center': [[7.7, { transform: 'scale(0)' }, BACK], [8.1, { transform: 'scale(1)' }]],
    's3-label': appear(8.2),
    's3-wave': [0, 1, 2].map((i) => [[8.0 + i * 0.45, { opacity: 0.9, transform: 'scale(.05)' }, 'cubic-bezier(.2,.6,.3,1)'], [9.5 + i * 0.45, { opacity: 0, transform: 'scale(1)' }]]),
    's3-town': townAt.map((t) => [[t, { opacity: 0, transform: 'scale(.3)' }, BACK], [t + 0.35, { opacity: 1, transform: 'scale(1)' }]]),
    's3-townlabel': townAt.map((t) => appear(t + 0.1, 0.4)),
    's3-line': townAt.map((t) => [[t + 0.2, { strokeDashoffset: 1 }, INOUT], [t + 0.75, { strokeDashoffset: 0 }]]),
    's3-packet': townAt.map((t, i) => [
      [t + 0.7, { opacity: 0, transform: move(TOWNS[i].x, TOWNS[i].y) }, LINEAR],
      [t + 0.72, { opacity: 1, transform: move(TOWNS[i].x, TOWNS[i].y) }, INOUT],
      [t + 1.35, { opacity: 1, transform: move(0, 0) }, LINEAR],
      [t + 1.4, { opacity: 0, transform: move(0, 0) }],
    ]),

    // 04 KI im Alltag: vier Aufgaben laufen von „von Hand“ nach „automatisch“
    's4-word': wordTracks(4, 11.7, 0.07),
    's4-meta': appear(11.95),
    's4-ab': appear(11.9),
    's4-row': Array.from({ length: 4 }, (_, i) => [[11.8 + i * 0.07, { opacity: 0, transform: up(14) }, EXPO], [12.3 + i * 0.07, { opacity: 1, transform: up(0) }]]),
    's4-run': runs.map(([t, dur, ease]) => [[t, { transform: 'translate3d(-100%, 0, 0)' }, ease], [t + dur, { transform: 'translate3d(0%, 0, 0)' }]]),
    's4-done': runs.map(([t, dur]) => [[t + dur - 0.1, { opacity: 0, transform: 'scale(.7)' }, BACK], [t + dur + 0.25, { opacity: 1, transform: 'scale(1)' }]]),

    // 05 Ergebnis: kinetische Schrift
    's5a-type': slam(15.4, 38),
    's5b-row': Array.from({ length: 7 }, (_, i) => [[16.2, { transform: `translate3d(${i % 2 ? -12 : -2}%, 0, 0)` }, LINEAR], [17.0, { transform: `translate3d(${i % 2 ? -2 : -12}%, 0, 0)` }]]),
    's5c-type': slam(17.0, -34),
    's5c-line': rise(17.45, { dy: 20, dur: 0.6, blur: 6 }),

    // 06 SideTwo: Zeichen, Wortmarke, Zeile
    's6-mark': [[18.35, { opacity: 0, transform: 'rotate(-140deg) scale(.4)' }, BACK], [19.0, { opacity: 1, transform: 'rotate(0deg) scale(1)' }]],
    's6-type': [[18.45, { clipPath: 'inset(0 0 100% 0)', transform: 'translate3d(0, 34%, 0)' }, EXPO], [19.1, { clipPath: 'inset(0 0 0% 0)', transform: 'translate3d(0, 0%, 0)' }]],
    's6-line': rise(19.0, { dy: 24, dur: 0.7, blur: 8 }),
    's6-rule': [[19.25, { transform: 'scaleX(0)' }, INOUT], [20.0, { transform: 'scaleX(1)' }]],
    's6-meta': Array.from({ length: 3 }, (_, i) => appear(19.5 + i * 0.12, 0.45)),
  }
}

// Baut aus Zeitpunkten Web-Animations-Keyframes. Werte werden fortgeschrieben, sodass jeder
// Keyframe alle Eigenschaften trägt; Anfang und Ende schließen die Schleife.
function toKeyframes(frames, total) {
  const sorted = [...frames].sort((a, b) => a[0] - b[0])
  let state = {}
  const out = sorted.map(([t, props, easing]) => {
    state = { ...state, ...props }
    return { ...state, offset: Math.min(1, Math.max(0, t / total)), easing: easing || LINEAR }
  })
  const keys = Object.keys(state)
  const filled = out.map((frame) => {
    const full = { ...frame }
    for (const key of keys) if (!(key in full)) full[key] = sorted.find(([, p]) => key in p)[1][key]
    return full
  })
  if (filled[0].offset > 0) filled.unshift({ ...filled[0], offset: 0, easing: LINEAR })
  if (filled.at(-1).offset < 1) filled.push({ ...filled.at(-1), offset: 1, easing: LINEAR })
  return filled
}

// total: Länge der Spuren in Grundsekunden; duration: echte Laufzeit in Sekunden
export function animateTracks(root, tracks, { total, duration = total, iterations = Infinity }) {
  const animations = []
  for (const [name, spec] of Object.entries(tracks)) {
    root.querySelectorAll(`[data-rk="${name}"]`).forEach((el, i) => {
      // Listen von Spuren gelten je Element (Wörter, Orte, Zeilen); sonst dieselbe Spur für alle.
      const frames = Array.isArray(spec[0]?.[0]) ? spec[i] : spec
      if (frames) animations.push(el.animate(toKeyframes(frames, total), { duration: duration * 1000, iterations, fill: 'both' }))
    })
  }
  return animations
}

// Die sichtbare Szene folgt der Zeit (echte Sekunden); harte Schnitte gehen so bildgenau.
export function applyReelTime(root, seconds) {
  const t = (((seconds / TEMPO) % BASE_TOTAL) + BASE_TOTAL) % BASE_TOTAL
  const scene = [...scenes].reverse().find((s) => t >= s.at)
  if (root.dataset.scene !== scene.id) root.dataset.scene = scene.id
}

function SideTwoMark() {
  return (
    <svg viewBox="8 6 54 50" aria-hidden="true">
      <path d="M43.6 17.9c-2.8-2.5-6.9-3.9-11.9-3.9-8.2 0-13.5 4-13.5 10.1 0 5.5 4.2 8.1 11.7 10.1 5.9 1.6 7.8 2.8 7.8 5.4 0 2.5-2.5 4.1-6.5 4.1-4.7 0-8.3-1.9-11.2-5.1l-4.2 5.1c3.5 4 8.8 6.2 15.2 6.2 8.8 0 14.8-4.1 14.8-10.7 0-5.8-4.2-8.5-12.2-10.7-5.5-1.5-7.4-2.6-7.4-5 0-2.2 2.1-3.7 5.7-3.7 4 0 7 1.5 9.8 4.1l4.1-5.9Z" />
      <path d="M47 12.5c0-3.3 2.7-5.5 6.6-5.5 3.6 0 6.1 2 6.1 5.1 0 2.3-1.3 3.7-3.6 5.3l-2.7 1.9h6.8V23H46.9v-2.9l6.4-4.7c1.3-1 2-1.7 2-2.8 0-1.2-.9-2-2.2-2-1.5 0-2.5.9-2.5 2.6v.4H47v-1.1Z" />
    </svg>
  )
}

const words = (lines, track) => lines.map((line, l) => <span className="rk-line" key={l}>{line.map((w, i) => <span key={i} data-rk={track}>{w}</span>)}</span>)

export function ReelCanvas({ canvasRef }) {
  const { hook, web, reach, daily, result, fin } = reelCopy
  const patternLine = Array.from({ length: 6 }, () => result.pattern).join(' ')
  return (
    <div className="rk-canvas" ref={canvasRef} data-scene="s1a">
      <div className="rk-bg" />

      <div className="rk-scene rk-s1a"><p className="rk-heavy rk-slam" data-rk="s1a-type"><span>{hook.word[0]}</span><span>{hook.word[1]}<b>.</b></span></p></div>
      <div className="rk-scene rk-s1b">
        <span className="rk-field" data-rk="s1b-field" />
        <span className="rk-s1b-ring" data-rk="s1b-ring" />
        <span className="rk-s1b-dot" data-rk="s1b-dot" />
        <p className="rk-soft rk-s1b-line">{hook.line.map((w, i) => <span key={i} data-rk="s1b-word">{w}</span>)}</p>
      </div>

      <div className="rk-scene rk-s2">
        <h3 className="rk-soft rk-s2-head">{words(web.head, 's2-word')}</h3>
        <p className="rk-caps rk-s2-parts" data-rk="s2-parts">{web.parts}</p>
        <p className="rk-caps rk-s2-claim" data-rk="s2-claim"><b>{web.claim.split(' ')[0]}</b> {web.claim.split(' ').slice(1).join(' ')}</p>
        <div className="rk-browser" data-rk="s2-browser">
          <div className="rk-browser-bar">
            <i /><i /><i />
            {web.sites.map((s) => <span className="rk-caps rk-browser-url" key={s.url} data-rk="s2-url">{s.url}</span>)}
            {web.sites.map((s, i) => <span className="rk-caps rk-browser-count" key={s.file} data-rk="s2-count">{String(i + 1).padStart(2, '0')} / {String(web.sites.length).padStart(2, '0')}</span>)}
          </div>
          <div className="rk-browser-view">
            {web.sites.map((s) => <img key={s.file} data-rk="s2-site" src={asset(`assets/workflow-reel/${s.file}.webp`)} alt="" width="1200" height="690" loading="lazy" decoding="async" />)}
          </div>
        </div>
      </div>

      <div className="rk-scene rk-s3">
        <h3 className="rk-soft rk-s3-head">{words(reach.head, 's3-word')}</h3>
        <p className="rk-caps rk-s3-parts" data-rk="s3-parts">{reach.parts}</p>
        <div className="rk-map">
          <span className="rk-field rk-field-light" data-rk="s3-field" />
          {[0, 1, 2].map((i) => <span className="rk-wave" key={i} data-rk="s3-wave" />)}
          <svg className="rk-map-lines" viewBox="-300 -300 600 600" aria-hidden="true">
            {TOWNS.map((town) => <line key={town.name} data-rk="s3-line" x1={town.x} y1={town.y} x2="0" y2="0" pathLength="1" />)}
          </svg>
          {TOWNS.map((town) => (
            <span className={`rk-town${town.x > 120 ? ' is-left' : ''}`} key={town.name} style={{ '--x': `${town.x}px`, '--y': `${town.y}px` }}>
              <i data-rk="s3-town" />
              <span className="rk-caps" data-rk="s3-townlabel">{town.name}</span>
            </span>
          ))}
          {TOWNS.map((town) => <span className="rk-packet" key={town.name} data-rk="s3-packet" />)}
          <span className="rk-map-center" data-rk="s3-center" />
          <span className="rk-caps rk-map-label" data-rk="s3-label">{reach.center}</span>
        </div>
      </div>

      <div className="rk-scene rk-s4">
        <h3 className="rk-soft rk-s4-head">{words(daily.head, 's4-word')}</h3>
        <span className="rk-caps rk-s4-meta" data-rk="s4-meta">{daily.meta}</span>
        <div className="rk-s4-rows">
          <div className="rk-caps rk-s4-ab" data-rk="s4-ab"><span>{daily.from}</span><span>{daily.to}</span></div>
          {daily.rows.map(({ n, label, Icon, done }) => (
            <div className="rk-s4-row" data-rk="s4-row" key={n}>
              <span className="rk-caps rk-s4-n">{n}</span>
              <span className="rk-s4-label">{label}</span>
              <Icon className="rk-s4-icon" weight="regular" aria-hidden="true" />
              <span className="rk-s4-track">
                <span className="rk-s4-run" data-rk="s4-run"><i /></span>
                <span className="rk-caps rk-s4-done" data-rk="s4-done"><Check weight="bold" aria-hidden="true" />{done}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rk-scene rk-s5a"><p className="rk-heavy rk-slam" data-rk="s5a-type"><span>{result.first}<b>.</b></span></p></div>
      <div className="rk-scene rk-s5b">
        {Array.from({ length: 7 }, (_, i) => <p className={`rk-heavy rk-s5b-row${i === 3 ? ' is-solid' : ''}`} data-rk="s5b-row" key={i}>{patternLine}</p>)}
      </div>
      <div className="rk-scene rk-s5c">
        <p className="rk-heavy rk-slam rk-s5c-type" data-rk="s5c-type"><span>{result.last[0]}</span><span>{result.last[1]}<b>.</b></span></p>
        <p className="rk-soft rk-s5c-line" data-rk="s5c-line">{result.line}</p>
      </div>

      <div className="rk-scene rk-s6">
        <div className="rk-s6-lockup">
          <span className="rk-s6-mark" data-rk="s6-mark"><SideTwoMark /></span>
          <span className="rk-heavy rk-s6-word" data-rk="s6-type">{fin.word}</span>
        </div>
        <p className="rk-soft rk-s6-line" data-rk="s6-line">{fin.line}</p>
        <span className="rk-s6-rule" data-rk="s6-rule" />
        <div className="rk-caps rk-s6-meta">{fin.meta.map((m, i) => <span key={m} data-rk="s6-meta">{i === 2 ? <i /> : null}{m}</span>)}</div>
      </div>

      <div className="rk-grain" />
      <span className="rk-clock" data-rk="clock" />
    </div>
  )
}

export function buildReelAnimations(canvas, options) {
  return animateTracks(canvas, reelTracks(), { total: BASE_TOTAL, duration: REEL_TOTAL, ...options })
}

export default function WorkflowReel() {
  const frameRef = useRef(null)
  const canvasRef = useRef(null)
  const animationsRef = useRef([])
  const loopRef = useRef(0)
  const [userPaused, setUserPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || document.visibilityState !== 'hidden')
  const [ready, setReady] = useState(false)
  const renderMode = typeof location !== 'undefined' && new URLSearchParams(location.search).has('render')

  // Querformat 1280 × 720, auf schmalen Bildschirmen Hochformat 720 × 900
  useEffect(() => {
    const frame = frameRef.current
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      const portrait = width < 620
      frame.dataset.layout = portrait ? 'port' : 'land'
      frame.style.setProperty('--rk-scale', String(width / (portrait ? 720 : 1280)))
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    const canvas = canvasRef.current
    document.fonts.ready.then(() => {
      if (cancelled) return
      animationsRef.current = buildReelAnimations(canvas)
      animationsRef.current.forEach((animation) => animation.pause())
      applyReelTime(canvas, 0)
      if (renderMode) {
        window.__reelSeek = (ms) => {
          animationsRef.current.forEach((animation) => { animation.pause(); animation.currentTime = ms })
          applyReelTime(canvas, ms / 1000)
        }
        window.__reelSeek(Number(new URLSearchParams(location.search).get('t') || 0) * 1000)
      }
      setReady(true)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(loopRef.current)
      animationsRef.current.forEach((animation) => animation.cancel())
      animationsRef.current = []
    }
  }, [renderMode])

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => setReducedMotion(media.matches)
    const onVisibility = () => setPageVisible(document.visibilityState !== 'hidden')
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(frameRef.current)
    media.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (!ready || renderMode) return undefined
    const animations = animationsRef.current
    const canvas = canvasRef.current
    cancelAnimationFrame(loopRef.current)
    if (reducedMotion) {
      animations.forEach((animation) => { animation.pause(); animation.currentTime = STILL_AT * 1000 })
      applyReelTime(canvas, STILL_AT)
      return undefined
    }
    if (inView && pageVisible && !userPaused) {
      animations.forEach((animation) => animation.play())
      const tick = () => {
        applyReelTime(canvas, (animations[0]?.currentTime || 0) / 1000)
        loopRef.current = requestAnimationFrame(tick)
      }
      loopRef.current = requestAnimationFrame(tick)
    } else {
      animations.forEach((animation) => animation.pause())
    }
    return () => cancelAnimationFrame(loopRef.current)
  }, [ready, reducedMotion, inView, pageVisible, userPaused, renderMode])

  return (
    <div className="workflow-reel">
      <div className={`workflow-reel-frame${ready ? ' is-ready' : ''}`} ref={frameRef} data-layout="land" role="img" aria-label={reelCopy.summary}>
        <ReelCanvas canvasRef={canvasRef} />
      </div>
      {reducedMotion || renderMode ? null : (
        <button type="button" className="workflow-reel-toggle" onClick={() => setUserPaused((paused) => !paused)} aria-pressed={userPaused}>
          {userPaused ? <Play weight="fill" aria-hidden="true" /> : <Pause weight="fill" aria-hidden="true" />}
          <span>{userPaused ? 'Film abspielen' : 'Film anhalten'}</span>
        </button>
      )}
    </div>
  )
}
