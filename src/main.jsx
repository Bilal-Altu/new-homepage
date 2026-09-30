import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { formatPublishedAt, getLatestDirectusPosts as getLatestPosts, postImageUrl } from './lib/directus'
import { validateContactPayload } from './lib/contact-contract'
import {
  ArrowBendDownRight,
  ArrowRight,
  Asterisk,
  BracketsCurly,
  Browser,
  CaretLeft,
  CaretRight,
  ChartLineUp,
  FlowArrow,
  List,
  Plus,
  Robot,
  ShareNetwork,
  Star,
  X,
} from '@phosphor-icons/react'
import { FooterSocialLinks, socialLinks } from './components/footer-social-links'
import WorkflowReel from './components/workflow-reel'
import '@fontsource-variable/manrope'
import './styles.css'

const asset = (path) => `${import.meta.env.BASE_URL}${path}`
const insightOverviewUrl = (slug) => `${asset('insights/')}#${encodeURIComponent(slug)}`
const googleProfileUrl = 'https://www.google.com/maps/place//@49.6515694,8.5341134,11z/data=!3m1!4b1!4m3!3m2!1s0x4797d583f252c585:0x99f69071120f77d7!12e1?entry=ttu&g_ep=EgoyMDI2MDkyMi4wIKXMDSoASAFQAw%3D%3D'
const instagramProfile = socialLinks.find(({ label }) => label === 'SideTwo auf Instagram')

const projects = [
  { name: 'da nico', meta: 'Website, Backend, Bestellsystem', image: asset('assets/projects/da-nico.jpg'), short: 'Bestellen, ganz einfach.' },
  { name: 'Avci Gerüstbau', meta: 'Website, UX/UI, Entwicklung', image: asset('assets/projects/avci-geruestbau.jpg'), short: 'Starker Auftritt fürs Handwerk.' },
  { name: 'Krug – Das Restaurant', meta: 'Website, UX/UI, Entwicklung', image: asset('assets/projects/krug-das-restaurant.jpg'), short: 'Regional genießen.' },
  { name: 'Ingenieurbüro Nuri', meta: 'Website, UX/UI, Entwicklung', image: asset('assets/projects/kfz-nuri.jpg'), short: 'Technik verständlich gemacht.' },
  { name: 'Pfrimmpark Arena', meta: 'Website, UX/UI, Entwicklung', image: asset('assets/projects/pfrimmpark-arena.jpg'), short: 'Sport gemeinsam erleben.' },
]

const referenceProjects = [
  { ...projects[0], description: 'Website mit Backend und Bestellsystem für da nico.', url: 'https://da-nico.de/', location: 'Irmtraut' },
  { ...projects[1], description: 'Website, UX/UI und Entwicklung für ein starkes Handwerksunternehmen.', url: 'https://www.avci-geruestbau.de/', location: 'Bürstadt' },
  { ...projects[2], description: 'Website, UX/UI und Entwicklung für ein Restaurant mit regionaler Küche.', url: 'https://krug-das-restaurant.de/', location: 'Rosengarten, Lampertheim' },
  { ...projects[3], description: 'Website, UX/UI und Entwicklung für verständliche technische Leistungen.', url: 'https://ing-kaltbrunn.de/', location: 'Heppenheim' },
  { ...projects[4], description: 'Website, UX/UI und Entwicklung für eine vielseitige Sportanlage.', url: 'https://pfrimmpark-arena.de/', location: 'Worms' },
  { name: 'Michael Noll Handpan', meta: 'Website, UX/UI, Entwicklung', image: asset('assets/projects/handpan-noll.jpg'), description: 'Website und UX/UI für Handpan-Bau, Klang und persönliche Workshops.', url: 'https://bukkador-handpan.de/', location: 'Worms' },
]

const serviceItems = [
  { Icon: Browser, title: 'Webseiten', text: 'Design, Texte, SEO und Hosting.' },
  { Icon: FlowArrow, title: 'Automatisierung', text: 'Weniger Routine, mehr Zeit.' },
  { Icon: Robot, title: 'KI-Agenten', text: 'Erreichbar, wenn ihr es nicht seid.' },
  { Icon: BracketsCurly, title: 'Interne Tools', text: 'Systeme, die täglich genutzt werden.' },
  { Icon: ShareNetwork, title: 'Social Media', text: 'Content, der sichtbar bleibt.' },
]

const clientLogos = [
  { name: 'da nico', type: 'da-nico', src: asset('assets/client-logos/da-nico.svg') },
  { name: 'AVCI Gerüstbau', type: 'avci', src: asset('assets/client-logos/avci-geruestbau-white.png') },
  { name: 'Krug – Das Restaurant', type: 'krug', src: asset('assets/client-logos/krug-das-restaurant.png') },
  { name: 'Ingenieurbüro Kaltbrunn', type: 'kaltbrunn', src: asset('assets/client-logos/ingenieurbuero-kaltbrunn.svg') },
  { name: 'Pfrimmpark Arena', type: 'pfrimm', src: asset('assets/client-logos/pfrimmpark-arena.png') },
  { name: 'Bukkador Handpan', type: 'bukkador', src: asset('assets/client-logos/bukkador-handpan.png') },
]

const processSteps = [
  ['Verstehen', 'Wir klären, was ihr wirklich braucht.'],
  ['Gestalten', 'Wir machen die Idee sichtbar und klar.'],
  ['Umsetzen', 'Wir bauen die passende digitale Lösung.'],
  ['Verbessern', 'Wir bleiben dran, wenn ihr wachst.'],
]

const founderProfiles = {
  alex: {
    name: 'Alexandros Kodalis',
    portrait: 'assets/people/alex-kodalis.png',
    intro: 'Marketing, Design und digitale Systeme.',
    facts: ['Ausbildung zum Kaufmann für Marketingkommunikation', 'Fokus auf Web Development & Frontend Engineering', 'Spezialisierung auf KI-Workflows und Automatisierung', 'Leidenschaft für UI/UX und digitales Design', 'Performance-, SEO- und Conversion-orientierte Entwicklung'],
    experience: [['2024–2026', 'Kaufmann für Marketingkommunikation (Ausbildung)'], ['Marketing', 'Webentwicklung & E-Commerce'], ['Frontend', 'Responsive Websites & UI-Systeme'], ['Automation', 'n8n, APIs & KI-Workflows'], ['Design', 'Corporate Design & digitale Markenauftritte']],
    linkedin: 'https://www.linkedin.com/in/alexandros-kodalis-42a908334/',
  },
  bilal: {
    name: 'Bilal Altuntas',
    portrait: 'assets/people/bilal-altuntas.png',
    intro: 'Bilal bringt technisches Verständnis und einen praxisnahen Blick aus der Automobilbranche mit. Bei SideTwo fokussiert er sich auf einfache, funktionierende Lösungen.',
    facts: ['Kfz-Hintergrund: Ausbildung im Kfz-Bereich', 'Weiterbildung: IHK-Qualifikation', 'SideTwo: praxisnahe digitale Lösungen für Unternehmen'],
    profileHref: instagramProfile?.href,
    profileLabel: instagramProfile?.label,
  },
}

const faqItems = [
  {
    question: 'Welche digitalen Leistungen bietet SideTwo?',
    answer: 'Wir entwickeln Websites, Automatisierungen, KI-gestützte Workflows, interne Tools und Social-Media-Auftritte. Entscheidend ist nicht das einzelne Tool, sondern eine Lösung, die eure Arbeit und eure Anfragen wirklich leichter macht.',
  },
  {
    question: 'Für welche Unternehmen arbeitet ihr?',
    answer: 'Wir arbeiten besonders gern mit Handwerksbetrieben, Dienstleistungsunternehmen, Gastronomie und lokalen Marken aus der Region Mannheim, Worms, Bergstraße und darüber hinaus. Wichtig ist ein echtes Vorhaben, kein bestimmtes Unternehmensalter oder eine bestimmte Größe.',
  },
  {
    question: 'Kann SideTwo eine bestehende Website verbessern?',
    answer: 'Ja. Wir schauen zuerst auf Struktur, Inhalte, Geschwindigkeit, mobile Nutzung und Anfragen. Danach entscheiden wir gemeinsam, ob ein gezieltes Update reicht oder ein neuer digitaler Auftritt sinnvoller ist.',
  },
  {
    question: 'Unterstützt ihr bei SEO und lokaler Sichtbarkeit?',
    answer: 'Bei neuen Websites legen wir eine saubere technische Basis für Suchmaschinen an: klare Seitenstruktur, relevante Inhalte, schnelle mobile Darstellung und lokale Signale. Konkrete Rankings versprechen wir nicht, aber wir bauen die Voraussetzungen dafür.',
  },
  {
    question: 'Wann sind Automatisierung oder KI-Agenten sinnvoll?',
    answer: 'Wenn wiederkehrende Anfragen, Terminabstimmungen, Nachfassaktionen oder interne Informationen Zeit kosten, prüfen wir den Ablauf mit euch. Dann automatisieren wir nur die Schritte, die eurem Team zuverlässig Arbeit abnehmen.',
  },
  {
    question: 'Könnt ihr Website, Backend und Bestellsystem zusammen umsetzen?',
    answer: 'Ja. Wenn ein Projekt es braucht, verbinden wir den sichtbaren Auftritt mit den Prozessen dahinter, zum Beispiel Anfragen, Bestellungen, Formulare oder interne Abläufe. So entsteht kein schöner Auftritt ohne funktionierendes System.',
  },
  {
    question: 'Wie startet ein Projekt mit SideTwo?',
    answer: 'Ihr beschreibt kurz euer Vorhaben über das Kontaktformular. Danach sprechen wir persönlich über Ziel, Ausgangslage und Prioritäten. Erst wenn klar ist, was sinnvoll ist, schlagen wir den nächsten konkreten Schritt vor.',
  },
]

function Button({ href = '#kontakt', children, secondary = false }) {
  return (
    <a className={`button${secondary ? ' button-secondary' : ''}`} href={href}>
      <span>{children}</span><ArrowRight size={17} weight="bold" />
    </a>
  )
}

function HeroActions({ className = '' }) {
  return (
    <div className={`hero-actions ${className}`}>
      <Button>Projekt anfragen</Button>
      <Button href="#referenzen" secondary>Projekte ansehen</Button>
    </div>
  )
}

function EditorialMark({ className = '' }) {
  return (
    <span className={`editorial-mark ${className}`} aria-hidden="true">
      <Asterisk weight="bold" /><ArrowBendDownRight weight="bold" />
    </span>
  )
}

function SideTwoLogo({ className = '' }) {
  const logoUrl = `url("${asset('assets/sidetwo-logo-currentcolor.svg')}")`

  return (
    <span
      className={`sidetwo-logo ${className}`}
      aria-hidden="true"
      style={{ WebkitMaskImage: logoUrl, maskImage: logoUrl }}
    />
  )
}

function useModalFocus(isOpen, onClose, triggerRef) {
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!isOpen) return undefined
    const dialog = dialogRef.current
    const focusable = () => [...dialog?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])') || []]
    const first = focusable()[0]
    first?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return }
      if (event.key !== 'Tab') return
      const controls = focusable()
      if (!controls.length) { event.preventDefault(); dialog?.focus(); return }
      const firstControl = controls[0]
      const lastControl = controls.at(-1)
      if (event.shiftKey && document.activeElement === firstControl) { event.preventDefault(); lastControl.focus() }
      if (!event.shiftKey && document.activeElement === lastControl) { event.preventDefault(); firstControl.focus() }
    }
    dialog?.addEventListener('keydown', onKeyDown)
    return () => { dialog?.removeEventListener('keydown', onKeyDown); triggerRef.current?.focus() }
  }, [isOpen, triggerRef])
  return dialogRef
}

function Navigation() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [])

  return (
    <header className="nav-shell">
      <nav className="nav-pill" aria-label="Hauptnavigation">
        <a className="nav-logo" href={asset('')} aria-label="SideTwo Startseite">
          <SideTwoLogo />
        </a>
        <div className="nav-links">
          <a href="#ueber-uns">Über uns</a>
          <a href="#leistungen">Leistungen</a>
          <a href="#referenzen">Projekte</a>
          <a href="#fallstudien">Fallstudien</a>
        </div>
        <a className="nav-contact" href="#kontakt">Kontakt</a>
        <button
          className="menu-button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
        >
          {open ? <X weight="bold" /> : <List weight="bold" />}
        </button>
      </nav>
      {open ? (
        <div className="mobile-menu" id="mobile-navigation">
          {[['referenzen', 'Projekte'], ['leistungen', 'Leistungen'], ['ueber-uns', 'Über uns'], ['kontakt', 'Kontakt']].map(([item, label]) => (
            <a key={item} href={`#${item}`} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </div>
      ) : null}
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <Navigation />
      <div className="hero-atmosphere" aria-hidden="true">
        <picture>
          <source media="(max-width: 600px)" srcSet={asset('assets/editorial/hero-founders-portrait.webp')} />
          <img src={asset('assets/editorial/hero-founders-landscape.webp')} alt="" />
        </picture>
        <span className="hero-micro hero-micro-side">[KI-GENERIERT]</span>
        <span className="hero-micro hero-micro-bottom">[MANNHEIM / 2026]</span>
      </div>
      <div className="hero-content">
        <div className="hero-heading">
          <a className="google-rating" href={googleProfileUrl} target="_blank" rel="noopener noreferrer" aria-label="SideTwo auf Google ansehen">
            <span className="google-rating-context"><Star size={20} weight="fill" aria-hidden="true" /><strong>5.0</strong></span>
            <span className="google-rating-pill">
              <span className="google-rating-avatars" aria-hidden="true" style={{ '--google-rating-avatar-image': `url(${asset('assets/people/google-review-avatars.png')})` }}>
                <span />
                <span />
                <span />
              </span>
              <span>Zufriedene Kunden</span>
            </span>
          </a>
          <h1>
            <span>Wir bauen</span>
            <span>digitale Auftritte,</span>
            <span>die <em>arbeiten.</em></span>
          </h1>
          <p>Websites, Automatisierung und KI, die euren Alltag einfacher machen.</p>
          <HeroActions className="hero-copy-actions" />
        </div>
      </div>
      <ClientMarquee />
    </section>
  )
}

function ServiceRail() {
  return (
    <div className="service-rail" aria-label="Unsere Leistungsbereiche">
      {serviceItems.map(({ Icon, title }) => (
        <div key={title}><Icon size={25} weight="duotone" /><strong>{title}</strong></div>
      ))}
    </div>
  )
}

function ClientMarquee() {
  const repeatedLogos = [...clientLogos, ...clientLogos]

  return (
    <div className="client-marquee" role="region" aria-labelledby="client-marquee-title">
      <div className="client-marquee-head">
        <h2 id="client-marquee-title"><span>Vertraut von Unternehmen</span><span>aus der Region.</span></h2>
      </div>
      <div className="client-marquee-window">
        <div className="client-marquee-track">
          {repeatedLogos.map((client, index) => (
            <article
              className={`client-logo-tile client-logo-${client.type}`}
              key={`${client.type}-${index}`}
              aria-label={index < clientLogos.length ? client.name : undefined}
              aria-hidden={index >= clientLogos.length ? 'true' : undefined}
            >
              <div className="client-logo-mark">
                <img src={client.src} alt="" decoding="async" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScrollFillHeading({ id, className = '', text, fillColor, mutedColor }) {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const words = text.split(' ')
  let letterIndex = 0

  useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      frame = 0
      const section = sectionRef.current
      if (!section) return
      const bounds = section.getBoundingClientRect()
      const start = window.innerHeight * .78
      const travel = Math.min(620, Math.max(330, bounds.height * .56))
      const nextProgress = Math.min(1, Math.max(0, (start - bounds.top) / travel))
      setProgress((current) => Math.abs(current - nextProgress) > .002 ? nextProgress : current)
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <h2 ref={sectionRef} id={id} className={`scroll-fill-title ${className}`} style={{ '--scroll-fill': fillColor, '--scroll-muted': mutedColor }} aria-label={text}>
      {words.map((word, wordIndex) => (
        <React.Fragment key={`${word}-${wordIndex}`}>
          {[...word].map((character) => {
            const currentIndex = letterIndex++
            return <span className="scroll-fill-letter" style={{ '--letter-fill': Math.min(1, Math.max(0, progress * (text.length + 8) - currentIndex)) }} key={`${character}-${currentIndex}`}>{character}</span>
          })}
          {wordIndex < words.length - 1 ? ' ' : null}
          {letterIndex++ && null}
        </React.Fragment>
      ))}
    </h2>
  )
}

function StudioImpact() {
  const headline = 'Wir machen digitale Arbeit leichter. Damit ihr wieder Zeit für Kunden, Entscheidungen und das Wesentliche habt.'
  const headlineWords = headline.split(' ')
  let letterIndex = 0
  const sectionRef = useRef(null)
  const [headingProgress, setHeadingProgress] = useState(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileTriggerRef = useRef(null)
  const profileDialogRef = useModalFocus(profileOpen, () => setProfileOpen(false), profileTriggerRef)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      frame = 0
      const section = sectionRef.current
      if (!section) return
      const bounds = section.getBoundingClientRect()
      const start = window.innerHeight * .76
      const travel = Math.min(620, Math.max(360, bounds.height * .62))
      const nextProgress = Math.min(1, Math.max(0, (start - bounds.top) / travel))
      setHeadingProgress((current) => Math.abs(current - nextProgress) > .002 ? nextProgress : current)
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="studio-impact" id="impact" ref={sectionRef} aria-labelledby="studio-impact-title">
      <div className="studio-impact-copy">
        <h2 className="impact-scroll-title" id="studio-impact-title" aria-label={headline}>
          {headlineWords.map((word, wordIndex) => (
            <React.Fragment key={`${word}-${wordIndex}`}>
              {[...word].map((character) => {
                const currentIndex = letterIndex++
                return <span className="impact-letter" style={{ '--letter-fill': Math.min(1, Math.max(0, headingProgress * (headline.length + 8) - currentIndex)) }} key={`${character}-${currentIndex}`}>{character}</span>
              })}
              {wordIndex < headlineWords.length - 1 ? ' ' : null}
              {letterIndex++ && null}
            </React.Fragment>
          ))}
        </h2>
        <p>Websites, Automatisierungen und KI, die nicht mehr Arbeit machen — sondern sie abnehmen.</p>
      </div>
      <div className="studio-impact-grid">
        <article className="impact-card impact-projects">
          <div className="impact-project-mark" aria-hidden="true"><i /><i /><i /></div>
          <strong>10</strong>
          <span>Web-Projekte</span>
          <p>für Unternehmen aus der Region realisiert.</p>
        </article>
        <div className="impact-stack">
          <button className="impact-card impact-team" ref={profileTriggerRef} type="button" onClick={() => setProfileOpen(true)} aria-haspopup="dialog" aria-label="Profile von Alexandros Kodalis und Bilal Altuntas öffnen">
            <div className="impact-portraits" aria-label="Alexandros Kodalis und Bilal Altuntas">
              <img src={asset('assets/people/alex-kodalis.png')} alt="Alexandros Kodalis" />
              <img src={asset('assets/people/bilal-altuntas.png')} alt="Bilal Altuntas" />
            </div>
            <strong>Zwei Köpfe.</strong>
            <p>Strategie und Umsetzung, zusammen gedacht.</p>
            <span className="impact-team-plus" aria-hidden="true"><Plus weight="bold" /></span>
          </button>
          <article className="impact-card impact-speed">
            <strong>2×</strong><span>klarer entscheiden.</span>
          </article>
        </div>
        <article className="impact-card impact-time">
          <div className="impact-time-mark" aria-hidden="true"><i /><i /><i /></div>
          <strong>Mehr Zeit im Alltag.</strong>
          <p>Automatisierung nimmt Routine aus dem System.</p>
        </article>
        <article className="impact-card impact-quote">
          <span className="impact-quote-mark">„</span>
          <p>Wir sind die zweite Seite eures Unternehmens — die digitale, die mitdenkt.</p>
          <div><ChartLineUp size={18} weight="bold" /> <span>SideTwo</span></div>
        </article>
      </div>
      {profileOpen ? (
        <div className="reference-modal-backdrop team-modal-backdrop" role="presentation" onMouseDown={() => setProfileOpen(false)}>
          <article className="team-modal team-overview-modal" ref={profileDialogRef} tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="team-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="reference-modal-close" type="button" onClick={() => setProfileOpen(false)} aria-label="Profil schließen"><X weight="bold" /></button>
            <header className="team-overview-head">
              <div className="team-overview-portrait-duo" aria-label="Alexandros Kodalis und Bilal Altuntas">
                {Object.entries(founderProfiles).map(([key, founder]) => <span className={`team-overview-portrait team-overview-portrait-${key}`} key={key}><img src={asset(founder.portrait)} alt="" /></span>)}
              </div>
              <div className="team-overview-heading-copy"><span>Gründer · SideTwo</span><h3 id="team-modal-title">Zwei Köpfe. Eine digitale Seite.</h3><p>Strategie, Gestaltung und technische Umsetzung direkt aus einer Hand.</p></div>
            </header>
            <div className="team-overview-grid">
              {Object.entries(founderProfiles).map(([key, founder]) => (
                <article className={`team-profile-card team-profile-card-${key}`} key={key}>
                  <div className="team-profile-content">
                    <p>Gründer · SideTwo</p><h4>{founder.name}</h4><strong>{founder.intro}</strong>
                    <ul>{founder.facts.slice(0, 3).map((fact) => <li key={fact}>{fact}</li>)}</ul>
                    {founder.linkedin ? <a href={founder.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn-Profil <ArrowRight size={15} weight="bold" /></a> : founder.profileHref ? <a href={founder.profileHref} target="_blank" rel="noopener noreferrer">{founder.profileLabel} <ArrowRight size={15} weight="bold" /></a> : null}
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>
      ) : null}
    </section>
  )
}

function ReferencesSequence() {
  const [activeProject, setActiveProject] = useState(null)
  const [isCompact, setIsCompact] = useState(false)
  const [page, setPage] = useState(0)
  const swipeStart = useRef(null)
  const didSwipe = useRef(false)
  const referenceTriggerRef = useRef(null)
  const referenceDialogRef = useModalFocus(Boolean(activeProject), () => setActiveProject(null), referenceTriggerRef)

  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') setActiveProject(null)
    }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 800px)')
    const sync = () => {
      setIsCompact(media.matches)
      setPage(0)
    }
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const pageSize = isCompact ? 3 : 6
  const pageCount = Math.ceil(referenceProjects.length / pageSize)
  const visibleProjects = referenceProjects.slice(page * pageSize, page * pageSize + pageSize)
  const changePage = (direction) => setPage((current) => (current + direction + pageCount) % pageCount)
  const endSwipe = (event) => {
    if (swipeStart.current === null) return
    const distance = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(distance) > 42) {
      didSwipe.current = true
      changePage(distance < 0 ? 1 : -1)
    }
  }

  return (
    <section className="references-sequence" id="referenzen" aria-labelledby="references-title">
      <header className="references-heading">
        <ScrollFillHeading id="references-title" className="references-scroll-title" text="Digitale Arbeit, die sichtbar wirkt." fillColor="#182425" mutedColor="rgba(24, 36, 37, .19)" />
        <div className="references-heading-side">
          <p>Ein Ausschnitt der Auftritte, die wir für Unternehmen aus der Region gestaltet und umgesetzt haben.</p>
          {pageCount > 1 ? <div className="reference-pagination"><button type="button" onClick={() => changePage(-1)} aria-label="Vorherige Referenzen"><CaretLeft weight="bold" /></button><button type="button" onClick={() => changePage(1)} aria-label="Nächste Referenzen"><CaretRight weight="bold" /></button></div> : null}
        </div>
      </header>
      <div className="references-wall" onPointerDown={(event) => { swipeStart.current = event.clientX }} onPointerUp={endSwipe} onPointerCancel={() => { swipeStart.current = null }}>
        {visibleProjects.map((project) => (
          <button className="reference-tile" type="button" key={project.name} onClick={(event) => { if (didSwipe.current) { didSwipe.current = false; return } referenceTriggerRef.current = event.currentTarget; setActiveProject(project) }} aria-label={`Details zu ${project.name} öffnen`}>
            <img src={project.image} alt={`Website-Referenz: ${project.name}`} loading="lazy" />
            <span className="reference-tile-cover">
              <span><b>{project.name}</b><small>{project.meta}</small></span>
              <i><Plus weight="bold" /></i>
            </span>
          </button>
        ))}
      </div>
      {activeProject ? (
        <div className="reference-modal-backdrop" role="presentation" onMouseDown={() => setActiveProject(null)}>
          <article className="reference-modal" ref={referenceDialogRef} tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="reference-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="reference-modal-close" type="button" onClick={() => setActiveProject(null)} aria-label="Referenz schließen"><X weight="bold" /></button>
            <div className="reference-modal-image"><img src={activeProject.image} alt={`Website-Referenz: ${activeProject.name}`} /></div>
            <div className="reference-modal-copy"><p>{activeProject.meta}</p><h3 id="reference-modal-title">{activeProject.name}</h3><span>{activeProject.description}</span>{activeProject.location ? <small className="reference-location">Standort: {activeProject.location}</small> : null}{activeProject.url ? <a href={activeProject.url} target="_blank" rel="noopener noreferrer">Website ansehen <ArrowRight size={16} weight="bold" /></a> : null}<a href="#kontakt" onClick={() => setActiveProject(null)}>Ähnliche Website anfragen <ArrowRight size={16} weight="bold" /></a></div>
          </article>
        </div>
      ) : null}
    </section>
  )
}

function ServiceShowcase() {
  const serviceSlides = [
    {
      name: 'Webseiten',
      Icon: Browser,
      description: 'Ein Auftritt, der eure Leistung verständlich macht – und die passenden Anfragen auslöst.',
      image: asset('assets/services/websites-showcase.jpg'),
      type: 'website',
    },
    {
      name: 'Automatisierung',
      Icon: FlowArrow,
      description: 'Wiederkehrende Abläufe laufen verlässlich im Hintergrund. Euer Team gewinnt Zeit zurück.',
      image: asset('assets/services/automation-showcase.jpg'),
      type: 'automation',
    },
    {
      name: 'KI-Agenten',
      Icon: Robot,
      description: 'Digitale Mitarbeitende, die Anfragen sortieren, zuhören und zuverlässig antworten.',
      image: asset('assets/services/agents-showcase.jpg'),
      type: 'agent',
    },
    {
      name: 'Interne Tools',
      Icon: BracketsCurly,
      description: 'Eigene kleine Systeme, die Informationen bündeln und eure tägliche Arbeit klar machen.',
      image: asset('assets/services/tools-showcase.jpg'),
      type: 'tools',
    },
    {
      name: 'Social Media',
      Icon: ShareNetwork,
      description: 'Content und Betreuung, die euren Auftritt konsistent sichtbar und relevant hält.',
      image: asset('assets/services/social-media-showcase.jpg'),
      type: 'social',
    },
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) {
      setHasEntered(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setHasEntered(true)
      observer.disconnect()
    }, { threshold: .22 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (paused) return undefined
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % serviceSlides.length)
    }, 4600)
    return () => window.clearInterval(interval)
  }, [paused, serviceSlides.length])

  const cardClassName = (index) => {
    const distance = (index - activeIndex + serviceSlides.length) % serviceSlides.length
    if (distance === 0) return 'is-active'
    if (distance === 1) return 'is-next'
    if (distance === serviceSlides.length - 1) return 'is-previous'
    return 'is-hidden'
  }

  return (
    <section className="service-carousel" id="leistungen" ref={sectionRef} aria-labelledby="service-carousel-title">
      <div className="service-carousel-head">
        <ScrollFillHeading id="service-carousel-title" className="service-scroll-title" text="Das sind unsere Dienstleistungen." fillColor="#edf1ec" mutedColor="rgba(237, 241, 236, .3)" />
        <p>Die Bausteine für einen Auftritt, der im Alltag wirklich etwas leichter macht.</p>
      </div>
      <div className="service-carousel-shell" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className={`service-carousel-list${hasEntered ? ' is-visible' : ''}`} aria-label="Leistungsbereiche">
          {serviceSlides.map(({ name, Icon }, index) => (
            <button key={name} style={{ '--option-index': index }} className={index === activeIndex ? 'is-active' : ''} type="button" onClick={() => setActiveIndex(index)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} aria-pressed={index === activeIndex}>
              <Icon size={19} weight="regular" aria-hidden="true" /><span>{name}</span>
            </button>
          ))}
        </div>
        <div className="service-carousel-stage" aria-live="polite">
          {serviceSlides.map((slide, index) => (
            <article className={`service-carousel-card ${cardClassName(index)}`} key={slide.name} aria-hidden={index !== activeIndex}>
              <div className={`service-carousel-media service-carousel-media-${slide.type}`}><img src={slide.image} alt="" /><span className="ai-generated-label" aria-hidden="true">KI-generiert</span></div>
              <div className="service-carousel-caption"><span>{slide.name}</span><h3>{slide.description}</h3><ArrowRight size={22} weight="light" /></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkflowFilm() {
  return (
    <section className="workflow-film" id="im-alltag" aria-labelledby="workflow-film-title">
      <div className="workflow-film-head">
        <ScrollFillHeading id="workflow-film-title" className="workflow-scroll-title" text="Was sich für euch ändert." fillColor="#1d3030" mutedColor="rgba(29, 48, 48, .24)" />
        <p>Wir bauen euren Auftritt, machen euch für neue Kunden sichtbar und nehmen euch mit KI-Werkzeugen Routine ab.</p>
      </div>
      <WorkflowReel />
    </section>
  )
}

function CaseStudiesPlaceholder() {
  return (
    <section className="proof-placeholder" id="fallstudien" aria-labelledby="proof-placeholder-title">
      <div className="proof-placeholder-head">
        <ScrollFillHeading id="proof-placeholder-title" className="proof-scroll-title" text="Fallstudien und Stimmen, die bald mehr erzählen." fillColor="#1d3030" mutedColor="rgba(29, 48, 48, .24)" />
        <p>Hier entsteht Raum für ausführliche Einblicke in Projekte und für echte Rückmeldungen unserer Kundinnen und Kunden.</p>
      </div>
      <div className="proof-placeholder-grid">
        <article className="case-study-placeholder">
          <div className="case-study-art" aria-hidden="true"><i /><i /><i /><b /></div>
          <div><span>Fallstudien</span><h3>Wie aus Anforderungen funktionierende digitale Auftritte werden.</h3><p>In Vorbereitung</p></div>
        </article>
        <article className="reviews-placeholder">
          <div className="review-quote" aria-hidden="true">„</div>
          <h3>Echte Kundenstimmen folgen hier.</h3>
          <div className="review-lines" aria-hidden="true"><i /><i /><i /></div>
          <p>In Vorbereitung</p>
        </article>
      </div>
    </section>
  )
}

function ProjectCollage() {
  const [active, setActive] = useState(0)
  const project = projects[active]
  const nextProject = projects[(active + 1) % projects.length]

  return (
    <section className="projects dark-panel" id="projekte">
      <ServiceRail />
      <div className="projects-head reveal-on-scroll">
        <h2>Ausgewählte<br /><em>Projekte.</em></h2>
        <p>Eine Auswahl echter Auftritte für Handwerk, Dienstleistung und lokale Unternehmen. Von der Idee bis zum fertigen Produkt.</p>
      </div>
      <div className="project-showcase reveal-on-scroll" key={project.name}>
        <article className="project-main">
          <div className="project-paper-copy"><strong>{project.short}</strong><p>{project.meta}</p></div>
          <div className="project-screen"><img src={project.image} alt={`Projekt ${project.name}`} /></div>
          <div className="project-caption"><span>{project.meta}</span><strong>{project.name}</strong></div>
        </article>
        <article className="project-side">
          <div className="accent-cut" />
          <div className="project-poster-title">Designing<span>²</span></div>
          <img src={nextProject.image} alt={`Projekt ${nextProject.name}`} />
          <p>{nextProject.short}<br /><b>{nextProject.name}</b></p>
        </article>
      </div>
      <div className="project-controls">
        <button onClick={() => setActive((active - 1 + projects.length) % projects.length)} aria-label="Vorheriges Projekt" title="Vorheriges Projekt"><CaretLeft weight="bold" /></button>
        <span aria-live="polite">{project.name}</span>
        <button onClick={() => setActive((active + 1) % projects.length)} aria-label="Nächstes Projekt" title="Nächstes Projekt"><CaretRight weight="bold" /></button>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="services grid-bg" id="leistungen-archiv">
      <div className="services-visual reveal-on-scroll">
        <div className="services-halo" />
        <img src={asset('assets/people/alex-kodalis.png')} alt="Alex Kodalis" loading="lazy" width="1254" height="1254" />
        {serviceItems.map(({ Icon, title, text }, index) => (
          <div className={`service-card card-${index + 1}`} key={title}>
            <Icon weight="duotone" /><div><strong>{title}</strong><span>{text}</span></div>
          </div>
        ))}
      </div>
      <div className="services-copy reveal-on-scroll">
        <h2>Was wir am<br /><em>besten können.</em></h2>
        <p><b>Wir bauen nicht einfach digital.</b> Gestaltung, Entwicklung und Automatisierung werden zu Lösungen, die klar aussehen und zuverlässig funktionieren.</p>
        <div className="services-actions"><Button>Projekt anfragen</Button><Button href="#projekte" secondary>Projekte ansehen</Button></div>
      </div>
    </section>
  )
}

function Execution() {
  return (
    <section className="execution dark-panel" id="ablauf">
      <div className="execution-copy reveal-on-scroll">
        <h2>Von der Idee<br />bis <em>live.</em></h2>
        <p>Drei klare Schritte. Direkte Abstimmung. Keine unnötigen Umwege.</p>
        <div className="steps-mini"><span><b>Verstehen</b></span><span><b>Bauen</b></span><span><b>Live gehen</b></span></div>
      </div>
      <div className="showcase-stack reveal-on-scroll" aria-label="Verschiedene Projektansichten">
        <div className="browser-layer"><img src={projects[1].image} alt="Avci Gerüstbau in einer Desktopansicht" loading="lazy" /></div>
        <div className="poster-layer"><img src={projects[2].image} alt="Stadtmüller als Projektplakat" loading="lazy" /><b>Ideen werden Systeme.</b></div>
        <div className="phone-layer"><div className="phone-notch" /><img src={projects[0].image} alt="da nico auf einem Smartphone" loading="lazy" /></div>
      </div>
    </section>
  )
}

function TurnstileWidget({ siteKey, onToken, onError, resetSignal }) {
  const targetRef = useRef(null)
  const widgetIdRef = useRef(null)

  useEffect(() => {
    let mounted = true
    const scriptId = 'sidetwo-turnstile-script'
    const render = () => {
      if (!mounted || !targetRef.current || !window.turnstile) return
      widgetIdRef.current = window.turnstile.render(targetRef.current, { sitekey: siteKey, action: 'contact', callback: onToken, 'error-callback': onError, 'expired-callback': () => onToken('') })
    }
    const existing = document.getElementById(scriptId)
    if (existing) { existing.addEventListener('load', render); render(); return () => { mounted = false; existing.removeEventListener('load', render) } }
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.addEventListener('load', render)
    script.addEventListener('error', onError)
    document.head.appendChild(script)
    return () => { mounted = false; script.removeEventListener('load', render); script.removeEventListener('error', onError) }
  }, [siteKey, onToken, onError])

  useEffect(() => {
    if (resetSignal && widgetIdRef.current !== null && window.turnstile) window.turnstile.reset(widgetIdRef.current)
  }, [resetSignal])

  return <div className="turnstile-widget" ref={targetRef} aria-label="Sicherheitsprüfung" />
}

function Contact() {
  const [notice, setNotice] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0)
  const [step, setStep] = useState(1)
  const [projectType, setProjectType] = useState('Webseite')
  const formRef = useRef(null)
  const sectionRef = useRef(null)
  const contactLineRef = useRef(null)
  const contactApiUrl = import.meta.env.VITE_CONTACT_API_URL || ''
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
  const productionWorkflowEnabled = Boolean(contactApiUrl && turnstileSiteKey)

  useEffect(() => {
    let frame = 0
    const updateLine = () => {
      frame = 0
      const section = sectionRef.current
      const line = contactLineRef.current
      if (!section || !line) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        line.style.setProperty('--contact-line-dash', '2200px')
        return
      }
      const bounds = section.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (window.innerHeight * .98 - bounds.top) / (bounds.height + window.innerHeight * .08)))
      line.style.setProperty('--contact-line-dash', `${Math.round(2200 * (1 - progress))}px`)
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateLine)
    }
    updateLine()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    if (step === 1) { setStep(2); setNotice(''); return }
    const form = event.currentTarget
    const formData = new FormData(form)
    if (!formData.get('privacy')) { setErrors({ form: 'Bitte bestätige die Datenschutzerklärung.' }); setNotice('Bitte bestätige die Datenschutzerklärung.'); return }
    const { privacy: _privacy, ...fields } = Object.fromEntries(formData.entries())
    const validation = validateContactPayload({ ...fields, turnstileToken }, { requireTurnstile: productionWorkflowEnabled })
    if (!validation.ok) { setErrors(validation.errors); setNotice(validation.errors.form || 'Bitte prüfe die markierten Felder.'); return }
    setErrors({})
    if (!productionWorkflowEnabled) { setNotice('Der Formularversand ist vor dem Produktivstart noch nicht verfügbar. Bitte schreibt uns bis dahin an info@sidetwo.de.'); return }
    setIsSubmitting(true)
    setNotice('')
    try {
      const response = await fetch(contactApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', body: JSON.stringify({ ...validation.value, turnstileToken }) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.success !== true) throw new Error(result.message || 'Die Anfrage konnte nicht gesendet werden.')
      form.reset()
      setTurnstileToken('')
      setTurnstileResetSignal((current) => current + 1)
      setNotice(result.message || 'Vielen Dank. Wir melden uns zeitnah bei euch.')
    } catch (error) {
      setNotice(error instanceof Error && error.message ? error.message : 'Die Anfrage konnte nicht gesendet werden. Bitte versucht es später erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="project-start" id="kontakt" ref={sectionRef} aria-labelledby="project-start-title">
      <div className="contact-scroll-orbit" ref={contactLineRef} aria-hidden="true">
        <svg viewBox="0 0 1600 560" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="contact-loop-amber" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#f4a24d" />
              <stop offset=".55" stopColor="#ffb16a" />
              <stop offset="1" stopColor="#ee8e39" />
            </linearGradient>
          </defs>
          <path d="M -96 414 C 155 267 331 558 622 426 C 858 319 835 177 1085 125 C 1348 71 1481 219 1369 359 C 1260 495 1044 448 1053 324 C 1062 202 1251 191 1415 277 C 1532 338 1646 401 1710 345" />
        </svg>
      </div>
      <div className="project-start-inner">
        <div className="project-start-copy">
          <ScrollFillHeading id="project-start-title" className="contact-scroll-title" text="Lasst uns herausfinden, was wir für euch umsetzen können." fillColor="#edf1ec" mutedColor="rgba(237, 241, 236, .28)" />
          <p>Ihr habt eine Idee, ein konkretes Projekt oder wisst noch nicht genau, welche Lösung passt? Beantwortet ein paar kurze Fragen – wir melden uns mit einer ehrlichen ersten Einschätzung.</p>
          <div className="project-start-trust" aria-label="Hinweise zur Anfrage"><span>Unverbindlich</span><span>Persönliche Rückmeldung</span><span>In der Regel innerhalb von 24 Stunden</span></div>
          <div className="project-start-image"><img src={asset('assets/contact/project-start-team.jpg')} alt="Alex und Bilal von SideTwo bei der gemeinsamen Projektarbeit" /><span className="ai-generated-label" aria-hidden="true">KI-generiert</span></div>
        </div>
        <div className="project-start-form-wrap">
          <form className="project-start-form" ref={formRef} onSubmit={submit} noValidate>
            <div className="project-start-progress"><div><span>Schritt {step} von 2</span><strong>{step === 1 ? 'Leistung auswählen' : 'Kontakt teilen'}</strong></div></div>
            {step === 1 ? (
              <fieldset className="project-service-choices">
                <legend>Wobei können wir euch unterstützen?</legend>
                {['Webseite', 'Automatisierung', 'KI-Agenten', 'Social Media Betreuung', 'Noch nicht sicher'].map((choice) => (
                  <label key={choice} className={projectType === choice ? 'is-selected' : ''}><input type="radio" name="projectType" value={choice} checked={projectType === choice} onChange={() => setProjectType(choice)} /><span>{choice}</span><i>✓</i></label>
                ))}
              </fieldset>
            ) : (
              <div className="project-contact-fields">
                <label htmlFor="contact-name">Name<input id="contact-name" name="name" required aria-required="true" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} autoComplete="name" maxLength="120" placeholder="Vor- und Nachname" /></label>{errors.name ? <p id="contact-name-error" className="contact-field-error">{errors.name}</p> : null}
                <label htmlFor="contact-email">E-Mail-Adresse<input id="contact-email" name="email" type="email" required aria-required="true" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} autoComplete="email" maxLength="254" placeholder="name@firma.de" /></label>{errors.email ? <p id="contact-email-error" className="contact-field-error">{errors.email}</p> : null}
                <label htmlFor="contact-company">Firma <small>(optional)</small><input id="contact-company" name="company" aria-invalid={Boolean(errors.company)} autoComplete="organization" maxLength="160" placeholder="Unternehmen" /></label>{errors.company ? <p className="contact-field-error">{errors.company}</p> : null}
                <label htmlFor="contact-phone">Telefonnummer <small>(optional)</small><input id="contact-phone" name="phone" type="tel" aria-invalid={Boolean(errors.phone)} autoComplete="tel" inputMode="tel" maxLength="40" placeholder="Für eine Rückmeldung" /></label>{errors.phone ? <p className="contact-field-error">{errors.phone}</p> : null}
                <label htmlFor="contact-message">Kurz zum Projekt<textarea id="contact-message" name="message" required aria-required="true" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} rows="3" maxLength="5000" placeholder="Worum geht es?" /></label>{errors.message ? <p id="contact-message-error" className="contact-field-error">{errors.message}</p> : null}
                {productionWorkflowEnabled ? <><TurnstileWidget siteKey={turnstileSiteKey} resetSignal={turnstileResetSignal} onToken={setTurnstileToken} onError={() => { setTurnstileToken(''); setErrors((current) => ({ ...current, turnstileToken: 'Die Sicherheitsprüfung konnte nicht geladen werden.' })) }} />{errors.turnstileToken ? <p className="contact-field-error">{errors.turnstileToken}</p> : null}</> : null}
                <label className="privacy-consent"><input type="checkbox" name="privacy" required /><span>Ich habe die <a href={asset('datenschutz')}>Datenschutzerklärung</a> gelesen und akzeptiere sie.</span></label>
              </div>
            )}
            <div className="project-start-actions">
              {step === 2 ? <button className="project-back" type="button" onClick={() => setStep(1)}>Zurück</button> : <span />}
              <button className="project-next" type="submit" disabled={isSubmitting}><span>{isSubmitting ? 'Wird gesendet …' : step === 1 ? 'Weiter' : productionWorkflowEnabled ? 'Anfrage senden' : 'Anfrage vorbereiten'}</span><ArrowRight size={17} weight="bold" /></button>
            </div>
          </form>
          {notice ? <p className="contact-notice" role={Object.keys(errors).length ? 'alert' : 'status'}>{notice}</p> : null}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="faq-intro">
        <ScrollFillHeading id="faq-title" className="faq-scroll-title" text="Fragen, die vor dem Start wichtig sind." fillColor="#1c3030" mutedColor="rgba(28, 48, 48, .25)" />
        <p>Hier findet ihr klare Antworten zu Websites, Automatisierung, KI und der Zusammenarbeit mit SideTwo.</p>
        <aside className="faq-personal-card">
          <div className="faq-personal-portraits"><img src={asset('assets/people/alex-kodalis.png')} alt="Alexandros Kodalis" /><img src={asset('assets/people/bilal-altuntas.png')} alt="Bilal Altuntas" /></div>
          <strong>Alex und Bilal von SideTwo</strong><p>Ihr habt einen Sonderfall oder möchtet einfach kurz sprechen? Schreibt uns.</p>
          <a href="#kontakt">Projekt anfragen <ArrowRight size={16} weight="bold" /></a>
        </aside>
      </div>
      <div className="faq-list">
        {faqItems.map((item, index) => {
          const open = index === openIndex
          return (
            <article className={`faq-item${open ? ' is-open' : ''}`} key={item.question}>
              <h3>
                <button type="button" aria-expanded={open} aria-controls={`faq-answer-${index}`} onClick={() => setOpenIndex(open ? -1 : index)}>
                  <span>{item.question}</span><i aria-hidden="true"><Plus size={19} weight="bold" /></i>
                </button>
              </h3>
              <div className="faq-answer" id={`faq-answer-${index}`} hidden={!open}><p>{item.answer}</p></div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Blog() {
  const [posts, setPosts] = useState([])
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let current = true
    getLatestPosts().then((contentPosts) => {
      if (!current) return
      setPosts(contentPosts)
    }).catch(() => {
      if (current) setLoadError(true)
    })
    return () => { current = false }
  }, [])

  return (
    <section className="blog" id="blog" aria-labelledby="blog-title">
      <div className="blog-head"><ScrollFillHeading id="blog-title" className="blog-scroll-title" text="Impulse für digitale Arbeit." fillColor="#1c3030" mutedColor="rgba(28, 48, 48, .25)" /><a href={asset('insights/')}>Alle Artikel <ArrowRight size={16} weight="bold" /></a></div>
      <div className="blog-grid">
        {posts.slice(0, 3).map((post) => <article className="blog-card" key={post.slug || post.title}><a href={insightOverviewUrl(post.slug)} aria-label={`${post.title} lesen`}><img src={postImageUrl(post, { width: 900, height: 634 })} alt={post.mainImage?.alt || post.title} loading="lazy" /><span className="blog-card-ai-label" aria-hidden="true">KI-generiert</span><div><span>{post.category} · {formatPublishedAt(post.publishedAt)} · {post.readTime}</span><h3>{post.title}</h3><p>{post.excerpt}</p><b>Artikel lesen <ArrowRight size={15} weight="bold" /></b></div></a></article>)}
        {!posts.length && !loadError ? <p className="blog-empty">Insights werden geladen.</p> : null}
        {loadError ? <p className="blog-empty" role="status">Insights sind gerade nicht verfügbar.</p> : null}
      </div>
    </section>
  )
}

function ProcessCards() {
  const processImage = asset('assets/editorial/process-motifs.png')

  return (
    <section className="process dark-panel" id="prozess" aria-labelledby="process-title">
      <div className="process-heading reveal-on-scroll"><h2 id="process-title">Vier Schritte. <em>Ein Ziel.</em></h2></div>
      <div className="process-grid reveal-on-scroll">
        {processSteps.map(([title, text], index) => (
          <article key={title}>
            <div className="process-art" style={{ '--motif-index': index }}><img src={processImage} alt="" loading="lazy" /></div>
            <div className="process-label"><strong>{title}</strong><ArrowRight size={16} weight="bold" /></div>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer" id="ueber-uns">
      <div className="footer-inner">
        <div className="footer-brand"><SideTwoLogo className="footer-brand-logo" /><p>Wir bauen digitale Auftritte, Systeme und Automatisierungen, die im Alltag wirklich arbeiten.</p><FooterSocialLinks /></div>
        <div className="footer-col"><strong>Leistungen</strong><a href="#leistungen">Webseiten</a><a href="#leistungen">Automatisierung</a><a href="#leistungen">KI-Agenten</a><a href="#leistungen">Social Media</a></div>
        <div className="footer-col"><strong>Studio</strong><a href="#impact">Über uns</a><a href="#referenzen">Projekte</a><a href="#fallstudien">Fallstudien</a><a href="#faq">Fragen &amp; Antworten</a><a href="#kontakt">Kontakt</a></div>
        <div className="footer-col"><strong>Starten</strong><a href="#kontakt">Projekt anfragen</a><a href="#kontakt">Unverbindlich sprechen</a><a href={asset('impressum')}>Impressum</a><a href={asset('datenschutz')}>Datenschutz</a></div>
      </div>
      <div className="footer-bottom"><span>© 2026 SideTwo. Alle Rechte vorbehalten.</span><span>Alexandros Kodalis &amp; Bilal Altuntas</span><span>Direkt. Klar. Persönlich.</span></div>
    </footer>
  )
}

function App() {
  useEffect(() => {
    const encodedId = window.location.hash.slice(1)
    if (!encodedId) return undefined

    let frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        let id = encodedId
        try { id = decodeURIComponent(encodedId) } catch { /* Keep the browser-provided fragment unchanged. */ }
        const target = document.getElementById(id)
        if (!target) return
        const previousScrollBehavior = document.documentElement.style.scrollBehavior
        document.documentElement.style.scrollBehavior = 'auto'
        target.scrollIntoView({ block: 'start' })
        document.documentElement.style.scrollBehavior = previousScrollBehavior
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.16 })

    document.documentElement.classList.add('motion-ready')
    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('motion-ready')
    }
  }, [])

  return <><a className="skip-link" href="#main-content">Zum Hauptinhalt springen</a><main id="main-content"><Hero /><StudioImpact /><ReferencesSequence /><ServiceShowcase /><WorkflowFilm /><CaseStudiesPlaceholder /><Contact /><FAQ /><Blog /><Footer /></main></>
}

createRoot(document.getElementById('root')).render(<App />)
