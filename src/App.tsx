import React, { useMemo, useState, useRef } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: company, solana-rpc, streaming, mev-fees, ops, market

const BANK = [
  // BEGINNER
  { id:"b1", topic:"company-fun-facts", level:"beginner",
    q:"Who is the co-founder and CEO of Helius?",
    options:["Mert Mumtaz, ex-Coinbase","Liam Vovk, ex-Shopify","Nick Pennie, ex-Stripe","Anatoly Y., ex-Qualcomm"],
    answer:0,
    explain:"Mert Mumtaz, a former Coinbase software engineer, is co-founder and CEO of Helius. Source: BetaKit Series A coverage and Mert's LinkedIn." },
  { id:"b2", topic:"company-fun-facts", level:"beginner",
    q:"In which city was Helius originally headquartered?",
    options:["Austin in Texas, USA","Toronto in Ontario, CA","London in England, UK","Berlin, Germany"],
    answer:1,
    explain:"BetaKit's 2024 Series A coverage describes Helius as Toronto-based. Source: betakit.com Series A article." },
  { id:"b3", topic:"company-fun-facts", level:"beginner",
    q:"What year was Helius founded?",
    options:["The year 2018","The year 2020","The year 2022","The year 2024"],
    answer:2,
    explain:"Helius was founded in 2022 (the co-founders' LinkedIn pages list June/August 2022). Source: LinkedIn company page." },
  { id:"b4", topic:"company-fun-facts", level:"beginner",
    q:"Helius's name comes from which mythology?",
    options:["Helius is a Norse sea god","Helius is a Greek sun god","Helius is a Roman war god","Helius is a Hindu fire god"],
    answer:1,
    explain:"Helius (Helios) is the Greek personification of the sun. The brand uses a bright orange color (#E84125) consistent with this. Source: Helius brand kit and Greek mythology." },
  { id:"b5", topic:"company-fun-facts", level:"beginner",
    q:"What is Helius's primary brand color?",
    options:["A bright orange tone","A bright magenta tone","A bright cyan tone","A bright yellow tone"],
    answer:0,
    explain:"Helius's brand kit lists Helius Orange (#E84125) as the primary brand color, with black and white as neutrals. Source: helius.dev/brand." },
  { id:"b6", topic:"company-products", level:"beginner",
    q:"What is Helius primarily known for?",
    options:["A cross-chain liquidity bridge","A Solana RPC and dev platform","An Ethereum Layer 2 rollup net","A liquid staking token issuer"],
    answer:1,
    explain:"Helius is a Solana-native developer platform: RPC nodes, APIs, real-time streaming, and transaction-landing tooling. Source: helius.dev." },
  { id:"b7", topic:"company-products", level:"beginner",
    q:"Which blockchain does Helius focus on?",
    options:["Ethereum mainnet (the L1)","Avalanche C-chain mainnet","Solana mainnet-beta only","Bitcoin base-layer mainnet"],
    answer:2,
    explain:"Helius is Solana-only and positions itself as a Solana-native infra provider." },
  { id:"b8", topic:"company-products", level:"beginner",
    q:"Which of these is a publicly documented Helius product?",
    options:["LaserStream (streaming)","BlockSpaceX (streaming)","ChainPump (streaming)","StakeBoost (streaming)"],
    answer:0,
    explain:"LaserStream is Helius's low-latency, fault-tolerant Solana streaming product." },
  { id:"b9", topic:"company-products", level:"beginner",
    q:"What does Helius's DAS API give developers access to?",
    options:["Solana validator node operations","Bridges to Ethereum mainnet L1","Stablecoins backed by SOL tokens","NFT and SPL token metadata sets"],
    answer:3,
    explain:"The Digital Asset Standard (DAS) API gives normalized access to Solana NFT and token metadata. Source: helius.dev/docs/das-api." },
  { id:"b10", topic:"company-products", level:"beginner",
    q:"What are Helius Webhooks designed to deliver?",
    options:["Daily on-chain analytics CSVs","Push notices of on-chain events","Wallet plugins that sign txns","Staking rewards to user wallets"],
    answer:1,
    explain:"Helius Webhooks push on-chain events (transactions, swaps, sales) to a URL, used instead of polling." },
  { id:"b11", topic:"industry", level:"beginner",
    q:"What does an RPC node primarily do for a Solana app?",
    options:["Lets clients read and submit txns","Validates blocks and finalizes them","Stores end-user wallet private keys","Auto-mints SPL tokens on schedule"],
    answer:0,
    explain:"RPC nodes are how clients interact with the chain: reading account state, submitting transactions, subscribing to events." },
  { id:"b12", topic:"industry", level:"beginner",
    q:"What are Solana priority fees used for?",
    options:["Paying validators to skip a txn","Improving txn landing odds soon","Lowering the network gas fee SOL","Buying NFTs at a steep discount"],
    answer:1,
    explain:"Priority fees on Solana help your transaction get scheduled ahead of others when the network is busy." },
  // INTERMEDIATE
  { id:"i1", topic:"company-fun-facts", level:"intermediate",
    q:"Who is Helius's co-founder and Chief Operating Officer?",
    options:["Liam Vovk, ex-AWS staff","Nicolas Pennie, ex-AWS","Brady Werkheiser, ex-AWS","Anatoly Yakovenko, ex-AWS"],
    answer:1,
    explain:"Nicolas (Nick) Pennie, a former AWS software engineer, is Helius's co-founder and COO. Source: Nick's LinkedIn and BetaKit Series A coverage." },
  { id:"i2", topic:"company-fun-facts", level:"intermediate",
    q:"Who led Helius's Series A round in February 2024?",
    options:["Foundation Capital (sole lead)","Founders Fund (the sole lead)","Andreessen Horowitz (sole lead)","Sequoia Capital (the sole lead)"],
    answer:0,
    explain:"Helius's $9.5M Series A in Feb 2024 was led by Foundation Capital. Source: BetaKit, unchainedcrypto.com." },
  { id:"i3", topic:"company-fun-facts", level:"intermediate",
    q:"How much did Helius raise in its 2024 Series A?",
    options:["About 2.5 million USD","About 9.5 million USD","About 50 million USD","About 120 million USD"],
    answer:1,
    explain:"Helius raised $9.5M USD ($12.8M CAD) in Series A in February 2024. Source: BetaKit." },
  { id:"i4", topic:"company-fun-facts", level:"intermediate",
    q:"What is CEO Mert Mumtaz's well-known handle on X (Twitter)?",
    options:["X handle is @heliusceo","X handle is @mertmumtaz","X handle is @0xMert_","X handle is @solanamert"],
    answer:2,
    explain:"Mert Mumtaz is widely active on X as @0xMert_. Source: x.com/0xMert_." },
  { id:"i5", topic:"company-fun-facts", level:"intermediate",
    q:"Per the Helius Manifesto, the company's stated mission is to:",
    options:["Make the cheapest Solana RPC ever","Build the largest validator network","Win the most government contracts","Evolve capitalism through markets"],
    answer:3,
    explain:"The Helius Manifesto, written by Mert Mumtaz, states: 'Helius's mission is to evolve capitalism through internet markets.' Source: helius.dev/blog/manifesto." },
  { id:"i6", topic:"company-products", level:"intermediate",
    q:"Which Helius product is positioned as a Yellowstone gRPC alternative?",
    options:["DAS API (NFT metadata service)","LaserStream (state streaming)","Priority Fee API (fee priority)","Webhooks (push event delivery)"],
    answer:1,
    explain:"LaserStream is described publicly as a fault-tolerant, low-latency alternative to Yellowstone gRPC. Source: helius.dev." },
  { id:"i7", topic:"company-products", level:"intermediate",
    q:"How long is LaserStream's documented historical replay window?",
    options:["About 1 hour of recent slots","About 6 hours of recent slots","About 24 hours of recent slots","About 7 days of recent slots"],
    answer:2,
    explain:"Helius documents up to 24 hours of historical replay on LaserStream, useful for consumer reconnect/backfill." },
  { id:"i8", topic:"company-products", level:"intermediate",
    q:"On Helius's public Developer plan, roughly how many credits per month?",
    options:["About 1 million credits","About 10 million credits","About 100 million credits","About 1 billion credits"],
    answer:1,
    explain:"Helius's Developer plan is documented at 10M credits/month with a 50 req/s RPC rate limit." },
  { id:"i9", topic:"company-products", level:"intermediate",
    q:"What does Helius mean by 'Enhanced WebSockets'?",
    options:["Non-Solana streaming protocol","Wallet feature for confirmations","A Layer 2 connected to Solana","WebSockets on LaserStream infra"],
    answer:3,
    explain:"Public docs say Enhanced WSS is now powered by Helius's LaserStream backend, sharing redundancy and failover." },
  { id:"i10", topic:"company-products", level:"intermediate",
    q:"Why does Helius's Priority Fee API use the serialized transaction?",
    options:["To reduce the wallet popup count","To price by accounts written to","Solana mandates per-program fees","To make NFT mints free for users"],
    answer:1,
    explain:"The Priority Fee API uses the serialized transaction to estimate fees aware of the specific accounts and programs being written to." },
  { id:"i11", topic:"industry", level:"intermediate",
    q:"Which Solana RPC method is famously expensive at scale?",
    options:["getSlot for current slot height","getProgramAccounts full scans","getRecentBlockhash for fees","getHealth for liveness check"],
    answer:1,
    explain:"getProgramAccounts can scan very large account sets and is famously expensive; many providers rate-limit or restrict it." },
  { id:"i12", topic:"industry", level:"intermediate",
    q:"What is a 'staked connection' in the Solana ecosystem?",
    options:["A WebSocket session needing KYC","Locking tokens for governance","A send routed via staked vals","An NFT used as loan collateral"],
    answer:2,
    explain:"Staked connections route sends through a path with staked validators, improving landing odds during congestion." },
  // EXPERT
  { id:"e1", topic:"company-fun-facts", level:"expert",
    q:"Who co-led Helius's Series B round in September 2024?",
    options:["Haun Ventures + Founders Fund","Sequoia Capital + Paradigm","a16z Crypto + Polychain Cap","Multicoin Capital + Pantera"],
    answer:0,
    explain:"Helius's $21.75M Series B (Sept 2024) was co-led by Haun Ventures and Founders Fund, with 6MV, Foundation Capital, Chapter One, Spearhead. Source: unchainedcrypto.com; helius.dev funding announcement." },
  { id:"e2", topic:"company-fun-facts", level:"expert",
    q:"Which of these is publicly named as a Helius customer?",
    options:["Acme Crypto Bank Group LLC","Coinbase, Jupiter, Ledger","Pied Piper Crypto Inc Ltd","Hooli Blockchain Group Inc"],
    answer:1,
    explain:"Helius's funding announcement names Coinbase, Paxos, Ledger, Jupiter, Helium, and Hivemapper among customers. Source: helius.dev/blog/funding-announcement." },
  { id:"e3", topic:"company-fun-facts", level:"expert",
    q:"Where did Mert Mumtaz earn his Master's degree in Computer Science?",
    options:["Stanford University, USA","MIT in Cambridge, USA","Georgia Tech in Atlanta","Univ of Toronto, Canada"],
    answer:2,
    explain:"Per IQ.wiki, Mert Mumtaz earned a Master's in Computer Science from the Georgia Institute of Technology. Source: iq.wiki/wiki/mert-mumtaz." },
  { id:"e4", topic:"company-fun-facts", level:"expert",
    q:"Which pair of operating principles appears in Helius's manifesto?",
    options:["'Faster' and 'Discontent'","'Slow Down' and 'Patient'","'Process' and 'Forms'","'Stealth' and 'Secrecy'"],
    answer:0,
    explain:"The Helius Manifesto lists Faster, Divine Discontent, Clear Communication, Action, and Optimism as operating principles. Source: helius.dev/blog/manifesto." },
  { id:"e5", topic:"company-products", level:"expert",
    q:"Which combination is Helius's transaction-landing toolkit?",
    options:["DAS API plus event Webhooks","Priority Fee API plus staked","Mint endpoints plus a bridge","Validator client plus pool"],
    answer:1,
    explain:"For landing specifically, Helius's public stack is the Priority Fee API plus staked connections on paid plans." },
  { id:"e6", topic:"company-products", level:"expert",
    q:"How does Helius describe LaserStream's redundancy model?",
    options:["One server, one Solana node","Many servers, many nodes solid","No redundancy by full design","Cross-chain across many L1s"],
    answer:1,
    explain:"Helius's public LaserStream page describes per-region redundancy: multiple servers backed by multiple Solana nodes with automatic failover." },
  { id:"e7", topic:"company-products", level:"expert",
    q:"Which Helius pricing tier sits between Developer and Professional?",
    options:["The 'Hobby' starter tier","The 'Business' paid tier","The 'Maker' community tier","The 'Hacker' indie tier"],
    answer:1,
    explain:"Helius's public pricing lists Free, Developer (~$24.50/mo), Business ($499/mo), Professional ($999/mo), and Agent Basic." },
  { id:"e8", topic:"company-products", level:"expert",
    q:"Why does Helius offer historical replay on LaserStream consumers?",
    options:["It removes all reorg risk now","Resume from slot, not rebuild","Removes all consumer retries","Makes the streaming API free"],
    answer:1,
    explain:"With replay, reconnection is 'resume from last slot' instead of 'rebuild state from RPC + reconcile', far less brittle." },
  { id:"e9", topic:"industry", level:"expert",
    q:"At high stream fan-out, which protocol wins on cost per event?",
    options:["JSON-RPC polling at high rate","Default WebSocket subs scale","gRPC and Geyser-plugin push","HTTP long polling, keep-alive"],
    answer:2,
    explain:"gRPC / Geyser is the most efficient transport for high-throughput Solana state fan-out; WebSockets and polling fall over economically at scale." },
  { id:"e10", topic:"industry", level:"expert",
    q:"For Solana validator hardware, which property matters most?",
    options:["Single-thread CPU + NVMe IOPS","Total GPU FLOPS for compute","ECC RAM with error correction","Aggregate USB bus throughput"],
    answer:0,
    explain:"Solana is famously sensitive to single-thread performance and NVMe IOPS; that's why dedicated hardware shows up in serious validator deployments." },
  { id:"e11", topic:"industry", level:"expert",
    q:"Combining priority fees with staked connections is most useful when:",
    options:["The network is empty + slow","Network is congested already","Only on devnet or testnet","Never; one always suffices"],
    answer:1,
    explain:"Both pay off most under congestion: staked path increases delivery odds; priority fees increase scheduling priority once delivered." },
  { id:"e12", topic:"industry", level:"expert",
    q:"On Solana, snapshot restore time is mostly bound by:",
    options:["Validator vote weight on node","NVMe + inbound network bandw","NFT royalty enforcement size","Total circulating SOL supply"],
    answer:1,
    explain:"Restoring state from a snapshot is dominated by storage and network IO; this is why hardware quality directly affects time-to-recover." },
];

const TOPIC_LABEL = {
  "company-fun-facts": "Helius company fun facts",
  "company-products": "Helius product line",
  "industry": "Solana industry & technical",
};

function pickQuestions(level, n) {
  const pool = BANK.filter(q => q.level === level);
  // For mixed at 30, pull from all levels evenly
  if (level === "mixed") {
    const b = BANK.filter(q => q.level === "beginner");
    const i = BANK.filter(q => q.level === "intermediate");
    const e = BANK.filter(q => q.level === "expert");
    const each = Math.ceil(n / 3);
    return shuffleQuestions(shuffle([...sample(b, each), ...sample(i, each), ...sample(e, n - 2*each)]).slice(0, n));
  }
  return shuffleQuestions(sample(pool, Math.min(n, pool.length)));
}

function shuffle(a) { const x = [...a]; for (let i = x.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; }
function sample(a, n) { return shuffle(a).slice(0, n); }

// shuffleQuestions: per-session re-positioning of correct answer to fight position bias.
// Uses existing schema field `answer` (numeric idx). Anti-cluster: avoid same position twice
// in a row (last-2 lookback). Balance: prefer least-used position so far.
// Apply once at quiz init, NOT per render.
function shuffleQuestions(questions) {
  const positionCounts = [0, 0, 0, 0]; // A, B, C, D
  const recentPositions = [];
  return questions.map(q => {
    const correctText = q.options[q.answer];
    const wrongTexts = q.options
      .filter((_, i) => i !== q.answer)
      .sort(() => Math.random() - 0.5);
    const blocked = recentPositions.slice(-2);
    const candidates = [0, 1, 2, 3]
      .filter(p => !blocked.includes(p))
      .sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5);
    const targetPos = candidates.length > 0
      ? candidates[0]
      : [0, 1, 2, 3].sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5)[0];
    positionCounts[targetPos]++;
    recentPositions.push(targetPos);
    const newOptions = [...wrongTexts];
    newOptions.splice(targetPos, 0, correctText);
    return { ...q, options: newOptions, answer: targetPos };
  });
}


function App() {
  const [length, setLength] = useState(10);
  const [level, setLevel] = useState("beginner");
  const [stage, setStage] = useState("setup"); // setup, run, done
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState({}); // qid -> chosen index
  const [revealed, setRevealed] = useState({});
  const [toast, setToast] = useState(false);

  const start = () => {
    const lvl = length === 30 ? (level === "expert" ? "expert" : "mixed") : level;
    const set = pickQuestions(lvl, length);
    setQs(set); setIdx(0); setPicks({}); setRevealed({}); setStage("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (qid, ci) => {
    if (revealed[qid] !== undefined) return;
    setPicks(p => ({ ...p, [qid]: ci }));
    setRevealed(r => ({ ...r, [qid]: ci }));
  };
  const next = () => {
    if (idx + 1 < qs.length) setIdx(idx + 1); else setStage("done");
  };

  const correctCount = useMemo(() => qs.reduce((acc,q)=> acc + (picks[q.id] === q.answer ? 1 : 0), 0), [qs, picks]);

  const topicBreakdown = useMemo(() => {
    const m = {};
    for (const q of qs) {
      const t = q.topic;
      if (!m[t]) m[t] = { correct: 0, total: 0 };
      m[t].total++;
      if (picks[q.id] === q.answer) m[t].correct++;
    }
    return m;
  }, [qs, picks]);

  const summary = useMemo(() => {
    const lines = [];
    lines.push("Helius & Solana RPC Infrastructure Quiz");
    lines.push(`Length: ${qs.length}, Level: ${length === 30 && level !== 'expert' ? 'mixed' : level}`);
    lines.push(`Score: ${correctCount} / ${qs.length}`);
    lines.push("");
    lines.push("Topic breakdown:");
    Object.entries(topicBreakdown).forEach(([t, v]) => {
      lines.push(`  • ${TOPIC_LABEL[t] || t}: ${v.correct}/${v.total}`);
    });
    return lines.join("\n");
  }, [qs.length, correctCount, topicBreakdown, level, length]);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(summary); setToast(true); setTimeout(()=>setToast(false), 1600); }
    catch { const ta=document.createElement("textarea"); ta.value=summary; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setToast(true); setTimeout(()=>setToast(false),1600); }
  };

  const restart = () => { setStage("setup"); setQs([]); setIdx(0); setPicks({}); setRevealed({}); window.scrollTo({top:0, behavior:"smooth"}); };

  const Pills = ({ value, set, options }: { value: string; set: (v: string) => void; options: string[] }) => (
    <div className="pillgroup">
      {options.map(o => (
        <button key={o.value} className={"pill " + (value === o.value ? "active" : "")} onClick={() => set(o.value)} type="button">{o.label}</button>
      ))}
    <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );

  if (stage === "setup") {
    return (
      <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
          dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
        />
        <span className="brand-chip">Independent tool</span>
      </header>
        <div className="eyebrow">A quiz · For DevRel, sales enablement, partner education</div>
        <h1>Helius & Solana RPC Infrastructure Quiz</h1>
        <p className="lede">A short, polite test of how well you understand Helius's products and the Solana RPC layer they sit on. Drawn from publicly documented Helius features (LaserStream, DAS API, Priority Fee API, Enhanced WebSockets, Webhooks, staked connections) and broader Solana infra concepts.</p>

        <div className="card">
          <label>Length</label>
          <Pills value={length} set={setLength} options={[{value:10,label:"10 questions"},{value:20,label:"20 questions"},{value:30,label:"30 questions"}]} />
          <div style={{ height: 14 }} />
          <label>Difficulty</label>
          <Pills value={level} set={setLevel} options={[{value:"beginner",label:"Beginner"},{value:"intermediate",label:"Intermediate"},{value:"expert",label:"Expert"}]} />
          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={start}>Start quiz</button>
          </div>
        </div>

        <div className="footer-note">
          Some company-specific details come directly from Helius's public docs and pricing page. Where public detail is limited, questions blend Helius context with broader Solana infrastructure education. No data is collected or stored.
        </div>
      <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  if (stage === "run") {
    const q = qs[idx];
    const chosen = picks[q.id];
    const reveal = revealed[q.id] !== undefined;
    return (
      <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
          dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
        />
        <span className="brand-chip">Independent tool</span>
      </header>
        <div className="progress"><div style={{ width: `${((idx)/qs.length)*100}%` }} /></div>
        <div className="eyebrow">Question {idx+1} of {qs.length} · {TOPIC_LABEL[q.topic]} · {q.level}</div>
        <div className="card qcard">
          <h2 style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 14 }}>{q.q}</h2>
          {q.options.map((opt, i) => {
            let cls = "opt";
            if (reveal) {
              if (i === q.answer) cls += " correct";
              else if (i === chosen) cls += " wrong";
            } else if (i === chosen) cls += " picked";
            return <button key={i} className={cls} onClick={() => choose(q.id, i)}>{String.fromCharCode(65+i)}. {opt}</button>;
          })}
          {reveal && <div className="explain"><strong>{chosen === q.answer ? "Correct." : "Not quite."}</strong> {q.explain}</div>}
          {reveal && <div style={{ marginTop: 14 }}><button className="btn" onClick={next}>{idx + 1 < qs.length ? "Next question" : "See results"}</button></div>}
        </div>
        <div style={{ display:"flex", gap: 10 }}>
          <button className="btn secondary" onClick={restart}>Restart</button>
        </div>
      <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  // done
  const pct = Math.round((correctCount / qs.length) * 100);
  const headline =
    pct >= 90 ? "Genuinely sharp on Helius and Solana RPC." :
    pct >= 70 ? "Solid working understanding." :
    pct >= 50 ? "Reasonable grasp. Some good rabbit holes ahead." :
    "Plenty of room to learn. This stuff rewards curiosity.";

  // Best/worst topics
  const topicsSorted = Object.entries(topicBreakdown).map(([t, v]) => ({ t, ...v, pct: v.correct / v.total }));
  topicsSorted.sort((a,b) => b.pct - a.pct);
  const strong = topicsSorted.slice(0, 2).filter(x => x.pct >= 0.5).map(x => TOPIC_LABEL[x.t] || x.t);
  const weak = topicsSorted.slice(-2).filter(x => x.pct < 0.7).map(x => TOPIC_LABEL[x.t] || x.t);

  return (
    <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
          dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
        />
        <span className="brand-chip">Independent tool</span>
      </header>
      <div className="eyebrow">Results</div>
      <h1>{correctCount} / {qs.length} correct · {pct}%</h1>
      <p className="lede">{headline}</p>

      <div className="card">
        <h2>Topic breakdown</h2>
        {Object.entries(topicBreakdown).map(([t, v]) => (
          <div className="topic-row" key={t}>
            <span style={{ color: "#cdd3df" }}>{TOPIC_LABEL[t] || t}</span>
            <span style={{ color: "#fff", fontVariantNumeric: "tabular-nums" }}>{v.correct}/{v.total}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>What you understand well</h2>
        <div style={{ color: "#cdd3df", fontSize: 14, lineHeight: 1.55 }}>
          {strong.length ? strong.join(" · ") : "Nothing dominant yet. Try a longer quiz at a higher level."}
        </div>
      </div>

      <div className="card">
        <h2>What's worth learning next</h2>
        <div style={{ color: "#cdd3df", fontSize: 14, lineHeight: 1.55 }}>
          {weak.length ? weak.join(" · ") : "All topics roughly even. The expert tier will pressure-test the edges."}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={onCopy}>Copy results</button>
          <button className="btn secondary" onClick={restart}>Take another quiz</button>
        </div>
      </div>

      <div className="footer-note">Helius-specific detail is sourced from public documentation and pricing. Broader Solana infrastructure questions reflect widely discussed community concepts (priority fees, staked connections, Geyser/gRPC, archive node economics).</div>

      <div className={"toast " + (toast ? "show" : "")}>Results copied to clipboard</div>
    <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );
}

export default App;
