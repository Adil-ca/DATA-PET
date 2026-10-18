import { useState } from 'react'
import { ArrowRight, Check, ChevronRight, Eye, Heart, LockKeyhole, RotateCcw, Sparkles } from 'lucide-react'

type Choice = 'feed' | 'hold'
type Capsule = { title: string; kind: string; icon: string; color: string; source: string; rights: string; integrity: string; correct: Choice; feedback: string }
const capsules: Capsule[] = [
  { title: 'The Photograph', kind: 'IMAGE DATA', icon: '▧', color: 'sun', source: 'Documented.', rights: 'AI training explicitly permitted.', integrity: 'Verified.', correct: 'feed', feedback: 'Perfect! The source is documented, the file is verified, and the license permits AI training. BIT loves a well-cleared data meal!' },
  { title: 'The Mystery Voice', kind: 'AUDIO DATA', icon: '♫', color: 'pink', source: 'Documented.', rights: 'Unclear.', integrity: 'Verified.', correct: 'hold', feedback: "This recording may be useful, but its AI training permission is unclear. Let's verify the rights before using it." },
  { title: 'The Research Report', kind: 'TEXT DATA', icon: '▤', color: 'mint', source: 'Documented.', rights: 'Research allowed; AI training explicitly excluded.', integrity: 'Verified.', correct: 'hold', feedback: 'The license excludes AI training. A file can be available for one use without being permitted for another.' },
  { title: 'The Digital Illustration', kind: 'IMAGE DATA', icon: '✳', color: 'lavender', source: 'Documented.', rights: 'AI training explicitly permitted.', integrity: 'Verified.', correct: 'feed', feedback: "Source checked, rights cleared, integrity verified. That's a great data contribution for BIT!" },
  { title: 'The Audio Sample', kind: 'AUDIO DATA', icon: '♫', color: 'orange', source: 'Documented.', rights: 'Personal use only.', integrity: 'Verified.', correct: 'hold', feedback: 'Personal-use rights don\'t automatically allow AI training. BIT will wait until the appropriate rights are established.' },
  { title: 'The Unknown File', kind: 'MYSTERY DATA', icon: '?', color: 'blue', source: 'Unknown.', rights: 'Claimed to be permitted, but the source has not been established.', integrity: 'Verified.', correct: 'hold', feedback: "A permission claim alone isn't enough when the source is unknown. Let's establish the provenance before considering this file." },
]
const outcomes = [
  { name: 'GLITCH GREMLIN', copy: 'Every little AI needs guidance. Now you know why provenance and permissions matter.' },
  { name: 'GLITCH GREMLIN', copy: 'Every little AI needs guidance. Now you know why provenance and permissions matter.' },
  { name: 'GLITCH GREMLIN', copy: 'Every little AI needs guidance. Now you know why provenance and permissions matter.' },
  { name: 'CURIOUS COMPANION', copy: 'BIT is growing! Careful checks can help it become even more trustworthy.' },
  { name: 'CURIOUS COMPANION', copy: 'BIT is growing! Careful checks can help it become even more trustworthy.' },
  { name: 'TRUST KEEPER', copy: 'You helped BIT grow by respecting data permissions and checking its records.' },
]

const petArt: Record<string, string> = {
  idle: 'bit-idle.png',
  wave: 'bit-wave.png',
  inspect: 'bit-inspect.png',
  happy: 'bit-happy.png',
  thinking: 'bit-thinking.png',
  glitch: 'bit-glitch.png',
  evolved: 'bit-evolved.png',
  celebrate: 'bit-celebrate.png',
}

function Pet({ mood, stage, glitch = false, celebrate = false, pose }: { mood: string; stage: number; glitch?: boolean; celebrate?: boolean; pose?: keyof typeof petArt }) {
  const art = pose ?? (celebrate ? 'celebrate' : glitch || mood === 'glitchy' ? 'glitch' : mood === 'happy' ? 'happy' : mood === 'thoughtful' ? 'inspect' : mood === 'approving' ? 'thinking' : stage >= 2 ? 'evolved' : 'idle')
  return <div className={`pet-wrap ${mood} ${glitch ? 'glitch' : ''} ${celebrate ? 'celebrate' : ''}`}>
    <div className="pet-halo" />
    <img className="pet-image" src={`/assets/bit/${petArt[art]}`} alt={`BIT ${art === 'celebrate' ? 'celebrating' : art === 'evolved' ? 'evolved' : art === 'wave' ? 'waving hello' : art === 'inspect' ? 'inspecting data' : art === 'thinking' ? 'thinking' : art === 'glitch' ? 'glitching' : art === 'happy' ? 'happy' : 'at rest'}`} draggable={false}/>
  </div>
}

function App() {
  const [screen, setScreen] = useState<'welcome' | 'game' | 'result'>('welcome')
  const [index, setIndex] = useState(0)
  const [inspected, setInspected] = useState(false)
  const [decision, setDecision] = useState<Choice | null>(null)
  const [score, setScore] = useState(0)
  const [energy, setEnergy] = useState(36)
  const [trust, setTrust] = useState(60)
  const [results, setResults] = useState<(Choice | null)[]>(Array(6).fill(null))
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const [feedback, setFeedback] = useState('')
  const [mood, setMood] = useState('curious')
  const [glitch, setGlitch] = useState(false)
  const capsule = capsules[index]
  const stage = screen === 'result' ? (score >= 5 ? 3 : score >= 3 ? 2 : 1) : score >= 3 ? 2 : 1
  const outcome = outcomes[Math.min(score, 5)]
  const accuracy = Math.round((score / capsules.length) * 100)
  const trustFinal = Math.max(20, Math.min(100, trust))
  const reset = () => { setIndex(0); setInspected(false); setDecision(null); setScore(0); setEnergy(36); setTrust(60); setResults(Array(6).fill(null)); setLastCorrect(null); setFeedback(''); setMood('curious'); setGlitch(false); setScreen('welcome') }
  const inspect = () => { if (inspected || decision) return; setInspected(true); setMood('thoughtful') }
  const choose = (choice: Choice) => {
    if (!inspected || decision) return
    const right = choice === capsule.correct
    setDecision(choice); setLastCorrect(right); setResults(previous => previous.map((x, i) => i === index ? choice : x))
    if (right) { setScore(previous => previous + 1); setTrust(previous => Math.min(100, previous + 4)); if (choice === 'feed') setEnergy(previous => Math.min(100, previous + 16)); setMood(choice === 'feed' ? 'happy' : 'approving'); setGlitch(false) }
    else { setTrust(previous => Math.max(20, previous - 15)); setMood('glitchy'); setGlitch(true); window.setTimeout(() => setGlitch(false), 1000) }
    setFeedback(right ? capsule.feedback : choice === 'feed' ? 'Oops! These rights do not clear this data for AI training. A quick check helps BIT stay on the right track.' : 'This capsule was cleared for AI training. Checking the passport helps BIT enjoy the data it can use.')
  }
  const next = () => { if (!decision) return; if (index === 5) { setScreen('result'); setMood('celebrating') } else { setIndex(index + 1); setInspected(false); setDecision(null); setFeedback(''); setLastCorrect(null); setMood('hungry') } }
  const share = () => {
    const draft = `I raised a little AI in DATA PET! 🧬 Useful data isn't automatically permitted data. Check the source, rights, and integrity before training AI. @datafdn @SuiNetwork #DATAonSuiQuest\n\nhttps://x.com/datafdn/status/2109468220273123382`
    window.open(`https://x.com/intent/post?text=${encodeURIComponent(draft)}`, '_blank', 'noopener,noreferrer')
  }
  return <main className="app-shell">
    <div className="ambient-scene" aria-hidden="true"><video className="bg-video" autoPlay muted loop playsInline><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4"/></video><div className="ambient-overlay"/></div>
    <header className="topbar"><button type="button" className="brand" onClick={reset} aria-label="Return to DATA PET home"><img className="brand-logo" src="/assets/data-pet-logo.png" alt=""/><span className="sr-only">DATA PET home</span></button><div className="header-note">DATA × SUI COMMUNITY MINI-GAME</div></header>
    {screen === 'welcome' && <section className="welcome screen-enter">
      <div className="welcome-copy"><img className="welcome-logo" src="/assets/data-pet-logo.png" alt="DATA PET"/><div className="eyebrow"><Sparkles size={15}/> A LITTLE AI, A LOT OF POTENTIAL</div><h1>Meet BIT.</h1><p className="lead">Feed it right. Watch it evolve.</p><p className="instructions">Inspect six data capsules and help your little AI grow by making responsible data choices.</p><button className="primary big" onClick={() => { setScreen('game'); setMood('hungry') }}>ADOPT BIT <ArrowRight size={20}/></button><p className="micro">6 DATA CAPSULES <b>·</b> ONE LITTLE AI <b>·</b> YOUR CHOICES SHAPE ITS FUTURE</p></div>
      <div className="welcome-foot"><span>USEFUL DATA ISN’T AUTOMATICALLY PERMITTED DATA.</span><span>FICTIONAL EDUCATIONAL SIMULATION</span></div>
    </section>}
    {screen === 'game' && <section className="game screen-enter">
      <div className="game-heading"><div><div className="eyebrow">A LITTLE CARE GOES A LONG WAY</div><h1>Help BIT grow.</h1></div><div className="progress-label">CAPSULE <strong>{index + 1}</strong> <span>OF 6</span></div></div>
      <div className="progress-track" aria-label={`Capsule ${index + 1} of 6`}><div className="progress-fill" style={{ width: `${((index + (decision ? 1 : 0)) / 6) * 100}%` }}/>{capsules.map((_, i) => <span key={i} className={`progress-node ${i < index || (i === index && decision) ? 'done' : ''}`}>{i < index || (i === index && decision) ? <Check size={12}/> : ''}</span>)}</div>
      <div className="game-layout"><aside className="pet-panel"><div className="stage-chip"><span className="pulse-dot"/> {stage === 1 ? 'BABY BIT' : 'GROWING BIT'} <span className="stage-stars">{stage === 2 ? '✦' : ''}</span></div><Pet mood={mood} stage={stage} glitch={glitch}/><div className="pet-name">BIT <span>LV. {stage}</span></div><div className="meters"><div className="meter-row"><div className="meter-label"><span><Heart size={15}/> ENERGY</span><b>{energy}%</b></div><div className="meter"><i className="energy" style={{ width: `${energy}%` }}/></div></div><div className="meter-row"><div className="meter-label"><span><LockKeyhole size={14}/> TRUST</span><b>{trust}%</b></div><div className="meter"><i className="trust" style={{ width: `${trust}%` }}/></div></div></div><p className="pet-hint">{mood === 'thoughtful' ? 'Hmm… let’s check the details.' : mood === 'happy' ? 'Yum! BIT feels stronger.' : mood === 'approving' ? 'Good call. Rights matter!' : mood === 'glitchy' ? 'Bzzt! A tiny mix-up.' : 'BIT is curious about what’s next.'}</p></aside>
      <section className="capsule-panel"><div className="capsule-top"><div><div className="eyebrow">INCOMING DATA CAPSULE</div><h2>{capsule.title}</h2></div><span className="capsule-index">0{index + 1}</span></div><div className={`capsule-art ${capsule.color} ${inspected ? 'opened' : ''} ${index === 0 ? 'image-data-feature' : index === 1 ? 'audio-data-feature' : index === 2 ? 'text-data-feature' : index === 3 ? 'illustration-image-feature' : index === 4 ? 'audio-sample-feature' : index === 5 ? 'mystery-data-feature' : ''}`}>{index === 0 ? <><img className="capsule-image-art" src="/assets/data-pet/image-data-sui-data.png" alt="Sui-inspired symbol and DATA-inspired structure above a blue landscape"/><span className="art-label-shade" aria-hidden="true"/><span className="capsule-kind">{capsule.kind}</span></> : index === 1 ? <><img className="capsule-image-art" src="/assets/data-pet/audio-data-sui-data.png" alt="Blue and yellow pixel waveform flowing into a crystalline audio symbol"/><span className="art-label-shade" aria-hidden="true"/><span className="capsule-kind">{capsule.kind}</span></> : index === 2 ? <><img className="capsule-image-art" src="/assets/data-pet/text-data-sui-data.png" alt="Layered document sheets and blue pixel quotation marks across a pastel landscape"/><span className="art-label-shade" aria-hidden="true"/><span className="capsule-kind">{capsule.kind}</span></> : index === 3 ? <><img className="capsule-image-art illustration-image" src="/assets/data-pet/image-data-sui-data-1.png" alt="A leafy photographic centerpiece surrounded by blue and yellow pixel details"/><span className="art-label-shade" aria-hidden="true"/><span className="capsule-kind">{capsule.kind}</span></> : index === 4 ? <><img className="capsule-image-art audio-sample-image" src="/assets/data-pet/audio-data-sui-data-1.png" alt="Pastel blue audio landscape with Sui and DATA-inspired marks"/><span className="art-label-shade" aria-hidden="true"/><span className="capsule-kind">{capsule.kind}</span></> : index === 5 ? <><img className="capsule-image-art mystery-data-image" src="/assets/data-pet/mystery-data-sui-data.png" alt="An abstract pixel question mark within a translucent file, surrounded by greenery"/><span className="art-label-shade" aria-hidden="true"/><span className="capsule-kind">{capsule.kind}</span></> : <><span className="art-orbit"/><span className="art-icon">{capsule.icon}</span><span className="art-spark s1">✦</span><span className="art-spark s2">✧</span><span className="capsule-kind">{capsule.kind}</span></>}{decision && lastCorrect && <span className={`capsule-status ${decision}`}>{decision === 'feed' ? 'FED TO BIT' : 'HELD FOR REVIEW'}</span>}</div>
      {!inspected && !decision && <div className="inspect-box"><p>Every capsule has a story.<br/><strong>Take a peek before you decide.</strong></p><button className="primary inspect" onClick={inspect}><Eye size={18}/> INSPECT PASSPORT</button></div>}
      {inspected && <div className="passport screen-enter"><div className="passport-head"><span><span className="passport-check"><Check size={13}/></span> DATA PASSPORT</span><span className="fictional-tag">FICTIONAL</span></div><div className="passport-row"><span className="passport-icon source">◎</span><div><label>SOURCE</label><p>{capsule.source}</p></div></div><div className="passport-row"><span className="passport-icon rights">⌑</span><div><label>USAGE RIGHTS</label><p>{capsule.rights}</p></div></div><div className="passport-row"><span className="passport-icon integrity">◈</span><div><label>INTEGRITY</label><p>{capsule.integrity}</p></div></div></div>}
      {!decision && inspected && <div className="decision-row screen-enter"><button className="feed-button" onClick={() => choose('feed')}><span>FEED PET</span><small>Rights permit training</small></button><button className="hold-button" onClick={() => choose('hold')}><span>HOLD FOR REVIEW</span><small>Pause until it’s clear</small></button></div>}
      {decision && <div className={`feedback ${lastCorrect ? `good ${decision}` : 'oops'} screen-enter`}><span className="feedback-icon">{lastCorrect ? '✦' : '↝'}</span><p>{feedback}</p><button className="next-button" onClick={next}>{index === 5 ? 'SEE YOUR EVOLUTION' : 'NEXT CAPSULE'} <ChevronRight size={17}/></button></div>}
      <div className="panel-foot"><span><LockKeyhole size={13}/> SOURCE · RIGHTS · INTEGRITY</span><span>FICTIONAL EDUCATIONAL SCENARIO</span></div></section></div>
      <div className="game-note">Useful data isn’t automatically permitted data.</div>
    </section>}
    {screen === 'result' && <section className="result screen-enter"><div className="result-header"><div className="eyebrow"><Sparkles size={15}/> YOUR LITTLE AI, ALL GROWN UP</div><h1>Look what you raised.</h1></div><div className="result-layout"><div className="result-pet"><div className="evolution-banner">✦ &nbsp; FINAL EVOLUTION &nbsp; ✦</div><Pet mood="celebrating" stage={stage} glitch={score < 3} celebrate/><div className="evolution-name">{outcome.name}</div><p>{outcome.copy}</p></div><div className="result-stats"><div className="score-card"><div><span>YOUR SCORE</span><strong>{score}<small> / 6</small></strong></div><div className="accuracy-wrap"><span className="accuracy-label">ACCURACY</span><div className="score-ring" role="img" aria-label={`Accuracy ${accuracy}%`} style={{ '--score': `${accuracy}%` } as React.CSSProperties}><span>{accuracy}<small>%</small></span></div></div></div><div className="stat-pair"><div><span>TRUST</span><strong>{trustFinal}%</strong></div></div><div className="decision-gallery"><div className="gallery-title">YOUR CAPSULE CALLS <span>6 TOTAL</span></div><div className="gallery-row">{results.map((result, i) => <div key={i} className={`gallery-item ${result === capsules[i].correct ? 'right' : 'wrong'}`} title={`${capsules[i].title}: ${result === capsules[i].correct ? 'correct' : 'incorrect'}`}><span>{result === capsules[i].correct ? <Check size={15}/> : '↝'}</span><small>0{i + 1}</small></div>)}</div><div className="takeaway"><Sparkles size={16}/><span>Before AI uses data, check its source, rights, and integrity.</span></div></div><div className="result-actions"><button className="primary" onClick={reset}><RotateCcw size={17}/> PLAY AGAIN</button><button className="share-button" onClick={share}>↗ &nbsp; SHARE YOUR PET</button></div></div></div><footer className="disclaimer">Fictional educational simulation · No real datasets or rights are verified.</footer></section>}
  </main>
}
export default App
