import React, { useMemo, useState, useRef } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: company, solana-rpc, streaming, mev-fees, ops, market

const BANK = [
  // ── BEGINNER ──
  { id:"b1", topic:"company", level:"beginner",
    q:"What is Helius primarily known for?",
    options:["A cross-chain liquidity bridge","A Solana-native RPC and data platform","An Ethereum L2 rollup network","A liquid-staking token issuer"],
    answer:1,
    explain:"Helius is a Solana-native developer platform — RPC nodes, APIs, real-time streaming, and transaction-landing tooling. Public summary on helius.dev." },
  { id:"b2", topic:"company", level:"beginner",
    q:"Which blockchain does Helius focus on?",
    options:["Ethereum mainnet L1","Avalanche C-chain mainnet","Solana mainnet-beta","Bitcoin base-layer L1"],
    answer:2,
    explain:"Helius is Solana-only and positions itself as a Solana-native infra provider." },
  { id:"b3", topic:"solana-rpc", level:"beginner",
    q:"What does an RPC node primarily do for a Solana app?",
    options:["Lets clients read state and submit transactions","Validates blocks and produces protocol consensus","Stores end-user wallet private keys securely","Auto-mints SPL tokens on a fixed schedule"],
    answer:0,
    explain:"RPC nodes are how clients interact with the chain — reading account state, submitting transactions, subscribing to events." },
  { id:"b4", topic:"streaming", level:"beginner",
    q:"What is a webhook in the context of a Solana RPC provider?",
    options:["A scheduled cron job that runs once per day","A push notification of on-chain events to a URL","A wallet plugin that signs transactions for users","A staking reward distribution method for pools"],
    answer:1,
    explain:"Webhooks push on-chain events (transactions, swaps, sales) to a URL — used instead of polling." },
  { id:"b5", topic:"mev-fees", level:"beginner",
    q:"What are Solana priority fees used for?",
    options:["Paying validators to skip your transaction","Increasing the chance your txn lands during congestion","Reducing the network gas fee for a transaction","Buying NFTs at a discount on marketplaces"],
    answer:1,
    explain:"Priority fees on Solana help your transaction get scheduled ahead of others when the network is busy." },
  { id:"b6", topic:"company", level:"beginner",
    q:"Which of these is a publicly documented Helius product?",
    options:["LaserStream","BlockSpaceX","ChainPump","StakeBoost"],
    answer:0,
    explain:"LaserStream is Helius's low-latency, fault-tolerant Solana streaming product." },
  { id:"b7", topic:"solana-rpc", level:"beginner",
    q:"What does 'transaction landing' mean on Solana?",
    options:["The transaction being signed by a wallet","The transaction being indexed by an explorer","The transaction being broadcast over the gossip layer","The transaction being included in a confirmed block"],
    answer:3,
    explain:"'Landing' means actually being included in a confirmed block — the metric that matters under congestion." },
  { id:"b8", topic:"market", level:"beginner",
    q:"Which kinds of teams typically buy from a Solana RPC provider?",
    options:["Only retail wallet end users on Solana mainnet","Solana validators running consensus on mainnet","dApps, wallets, trading firms, and DeFi protocols","Solana block-explorer operators and indexers only"],
    answer:2,
    explain:"RPC providers serve developer-facing teams that need reliable reads, sends, and event streams." },
  { id:"b9", topic:"streaming", level:"beginner",
    q:"What does 'gRPC' or 'Geyser' usually refer to in Solana streaming?",
    options:["A wallet UI rendering framework","A high-performance push protocol for state","An NFT royalty enforcement scheme","An SPL token-2022 extension standard"],
    answer:1,
    explain:"Geyser plugins + gRPC are how Solana validators push high-performance state streams; Yellowstone and LaserStream are common implementations." },
  { id:"b10", topic:"company", level:"beginner",
    q:"What does Helius's 'DAS API' help developers do?",
    options:["Operate Solana validator nodes at scale","Bridge SPL tokens to Ethereum mainnet","Issue stablecoins backed by SOL collateral","Read normalized NFT and token metadata"],
    answer:3,
    explain:"The Digital Asset Standard (DAS) API gives normalized access to Solana's NFT and token metadata." },
  { id:"b11", topic:"ops", level:"beginner",
    q:"Why does multi-region RPC routing matter for global dApps?",
    options:["RPC latency varies a lot by user location","It is required by the Solana protocol","It directly lowers token market price","It exempts the dApp from regional taxes"],
    answer:0,
    explain:"User-perceived latency depends heavily on region; routing close to users reduces tail latency." },
  { id:"b12", topic:"mev-fees", level:"beginner",
    q:"What is a 'staked connection' in the Solana ecosystem?",
    options:["A WebSocket session that requires KYC","A way to lock tokens for governance voting","A send path routed through staked validators","A type of NFT used as collateral"],
    answer:2,
    explain:"Some providers (Helius among them) offer staked connections on paid plans — sends route through a path with staked validators, improving landing odds during congestion." },

  // ── INTERMEDIATE ──
  { id:"i1", topic:"company", level:"intermediate",
    q:"Which Helius product is positioned as an alternative to Yellowstone gRPC?",
    options:["DAS API for NFT and token metadata","LaserStream for low-latency state streaming","Priority Fee API for congestion pricing","Webhooks for push event delivery"],
    answer:1,
    explain:"LaserStream is described publicly as a scalable, fault-tolerant low-latency alternative to Yellowstone gRPC and WebSockets." },
  { id:"i2", topic:"company", level:"intermediate",
    q:"How long is LaserStream's documented historical replay window?",
    options:["1 hour of recent slot history","6 hours of recent slot history","24 hours of recent slot history","7 days of recent slot history"],
    answer:2,
    explain:"Helius documents up to 24 hours of historical replay on LaserStream — useful for consumer reconnect/backfill." },
  { id:"i3", topic:"solana-rpc", level:"intermediate",
    q:"Which RPC method is commonly the most expensive to call repeatedly?",
    options:["getSlot for current slot height tracking","getProgramAccounts for full program scans","getRecentBlockhash for fee anchor lookups","getHealth for validator liveness checks"],
    answer:1,
    explain:"getProgramAccounts can scan very large account sets and is famously expensive at scale; many providers rate-limit or restrict it." },
  { id:"i4", topic:"streaming", level:"intermediate",
    q:"Which is the most fragile streaming approach at scale?",
    options:["Yellowstone gRPC and Geyser plugin streams","Provider-grade enhanced WebSocket subscriptions","Default public Solana WebSockets at scale","Outbound webhooks with retry queues"],
    answer:2,
    explain:"Default Solana WebSockets are widely reported to disconnect silently under load and are not recommended for production at scale." },
  { id:"i5", topic:"mev-fees", level:"intermediate",
    q:"Why does Helius's Priority Fee API recommend serialized-transaction-aware estimation?",
    options:["To reduce wallet confirmation popups for users","Fee competition depends on accounts the txn writes to","Because Solana's protocol mandates per-program fees","To make NFT mint transactions cheaper for end users"],
    answer:1,
    explain:"The Priority Fee API uses the serialized transaction so it can recommend fees aware of the specific accounts/programs being written to — a more accurate signal than a global average." },
  { id:"i6", topic:"company", level:"intermediate",
    q:"Which is a publicly listed Helius pricing tier?",
    options:["Hobby starter tier","Developer paid tier","Maker community tier","Hacker indie tier"],
    answer:1,
    explain:"Helius's public pricing page lists Free, Developer (~$24.50/mo), Business ($499/mo), Professional ($999/mo), and an Agent Basic plan." },
  { id:"i7", topic:"company", level:"intermediate",
    q:"On Helius's public Developer plan, roughly how many monthly credits do you get?",
    options:["1 million credits per month","10 million credits per month","100 million credits per month","1 billion credits per month"],
    answer:1,
    explain:"Developer plan is documented at 10M credits/month with a 50 req/s RPC rate limit." },
  { id:"i8", topic:"ops", level:"intermediate",
    q:"What's the main risk of running a single-region Solana RPC for a global product?",
    options:["Inflation eroding token-denominated revenue","User-visible tail latency and one failure point","Token-unlock schedules pressuring price","Regulatory exposure across multiple regions"],
    answer:1,
    explain:"One region means tail latency for far users and zero capacity if that region degrades." },
  { id:"i9", topic:"streaming", level:"intermediate",
    q:"Why are push streams (Webhooks, gRPC) usually cheaper than aggressive polling at scale?",
    options:["They only fire on real on-chain events","They are subsidized directly by the validator set","They bypass the network and read from disk","They use a cheaper Solana fee market"],
    answer:0,
    explain:"Push only fires on relevant events; polling pays cost continuously regardless of activity." },
  { id:"i10", topic:"market", level:"intermediate",
    q:"Which is NOT typically a buyer persona for a Solana RPC provider?",
    options:["DEX backend engineering team","NFT marketplace operations team","Trading firm market-making desk","Token-governance forum voter"],
    answer:3,
    explain:"Governance voters use wallets; they don't buy RPC infrastructure as a persona." },
  { id:"i11", topic:"company", level:"intermediate",
    q:"What does Helius mean by 'Enhanced WebSockets'?",
    options:["A separate non-Solana streaming protocol","A wallet feature for transaction confirmations","A Layer 2 network connected to Solana","WebSockets powered by the LaserStream backend"],
    answer:3,
    explain:"Public docs say Enhanced WSS is now powered by LaserStream infra — so they share redundancy and failover." },
  { id:"i12", topic:"ops", level:"intermediate",
    q:"What is one common reason archive nodes are expensive to operate on Solana?",
    options:["They are forbidden by the Solana protocol","Solana ledger growth makes archive history huge","They require Solana Foundation–mandated hardware","They cannot use any local storage at all"],
    answer:1,
    explain:"Solana's high TPS produces a large ledger; full-history archive nodes carry significant storage and IO costs." },

  // ── EXPERT ──
  { id:"e1", topic:"streaming", level:"expert",
    q:"At high stream fan-out, which protocol typically delivers the best $/event for Solana state?",
    options:["JSON-RPC polling at high request rates","Default WebSocket subscriptions at scale","gRPC and Geyser-plugin push streams","HTTP long polling with keep-alive"],
    answer:2,
    explain:"gRPC / Geyser is generally the most efficient transport for high-throughput Solana state fan-out; WebSockets and polling fall over economically at scale." },
  { id:"e2", topic:"mev-fees", level:"expert",
    q:"Combining priority fees with staked connections is most effective when…",
    options:["The network is empty and uncontested","The network is congested and ordering matters","Only on devnet or testnet environments","Never — one alone is always sufficient"],
    answer:1,
    explain:"Both are worth most under congestion; staked path increases delivery odds while priority fees increase scheduling priority once delivered." },
  { id:"e3", topic:"ops", level:"expert",
    q:"For a Solana validator or RPC node, which hardware property tends to matter most for steady performance?",
    options:["Single-thread CPU clock and NVMe IOPS","Total GPU FLOPS for parallel compute","ECC RAM with high error correction","Aggregate USB bus throughput"],
    answer:0,
    explain:"Solana is famously sensitive to single-thread performance and NVMe IOPS; that's why dedicated hardware shows up so often in serious validator deployments." },
  { id:"e4", topic:"streaming", level:"expert",
    q:"Why does a 24h replay window simplify consumer design?",
    options:["It eliminates all on-chain reorganization risk","Consumers can resume from a slot, not rebuild state","It removes the need for any retry logic","It makes the streaming API entirely free"],
    answer:1,
    explain:"With replay, reconnection is 'resume from last slot' instead of 'rebuild state from RPC + reconcile' — far less brittle." },
  { id:"e5", topic:"market", level:"expert",
    q:"Which workload pattern tends to most justify dedicated infrastructure over shared cloud for Solana RPC?",
    options:["Random ad-hoc analytics scripts and one-offs","High-throughput, latency-sensitive production hot paths","Hobby projects with intermittent monthly traffic","Static marketing landing pages and brochures"],
    answer:1,
    explain:"Repeatable, hot-path, predictable workloads are the textbook case where bare-metal economics and latency consistency start to win." },
  { id:"e6", topic:"company", level:"expert",
    q:"Which combination represents Helius's transaction-landing toolkit?",
    options:["DAS API combined with outbound Webhooks","Priority Fee API plus staked send connections","Token-mint endpoints plus cross-chain bridges","Validator client plus stake-pool integration"],
    answer:1,
    explain:"For landing specifically, the public stack is Priority Fee API estimation + staked connections on paid plans." },
  { id:"e7", topic:"ops", level:"expert",
    q:"Why do many Solana RPC providers advise separating reads, sends, and subscriptions onto different endpoints?",
    options:["For consistent product branding across endpoints","To isolate failure modes and tune capacity by class","Because Solana protocol explicitly requires it","To avoid jurisdictional tax exposure on traffic"],
    answer:1,
    explain:"Different request classes have very different cost and failure profiles; mixing them on one endpoint amplifies blast radius." },
  { id:"e8", topic:"streaming", level:"expert",
    q:"What is a typical advantage of Yellowstone-compatible gRPC over a proprietary stream API?",
    options:["Lower per-event fees from Solana validators","Portability across providers and self-hosted nodes","Mandatory KYC enforced at the Solana protocol level","Built-in MEV-style transaction ordering guarantees"],
    answer:1,
    explain:"Yellowstone gRPC is widely adopted, so consumer code stays portable across multiple providers and self-hosted nodes." },
  { id:"e9", topic:"mev-fees", level:"expert",
    q:"For a perp DEX or market maker, the most painful symptom of poor RPC + landing is usually…",
    options:["Slightly slower internal analytics dashboards","Missed fills, stale quotes, and slippage spikes","Smaller marketing reach to retail traders","Cosmetic UI bugs in the trading frontend"],
    answer:1,
    explain:"Trading workloads convert RPC variance directly into PnL — missed fills and stale quotes cost real money." },
  { id:"e10", topic:"company", level:"expert",
    q:"Which describes Helius's documented LaserStream redundancy model?",
    options:["A single server backed by a single Solana node","Redundant servers backed by multiple Solana nodes","No redundancy — single point of failure by design","Cross-chain replication across multiple L1 chains"],
    answer:1,
    explain:"Helius's public LaserStream page describes per-region redundancy: multiple servers backed by multiple Solana nodes with automatic failover." },
  { id:"e11", topic:"ops", level:"expert",
    q:"On Solana, snapshot restore time is mostly bound by…",
    options:["Validator vote weight on the restoring node","NVMe throughput and inbound network bandwidth","NFT royalty enforcement on stored accounts","Total circulating SOL token supply"],
    answer:1,
    explain:"Restoring state from a snapshot is dominated by storage and network IO; this is why hardware quality directly affects time-to-recover." },
  { id:"e12", topic:"market", level:"expert",
    q:"Which is generally a poor reason to switch RPC providers?",
    options:["Repeated landing failures during congestion windows","Cheap headline price with no SLA or staked path","Need for dedicated streaming capacity at scale","Region coverage gaps for end-user latency"],
    answer:1,
    explain:"Headline price with no operational story is a common trap — switching saves dollars and loses landings, which costs more in user trust." },
];

const TOPIC_LABEL = {
  company: "Helius product knowledge",
  "solana-rpc": "Solana RPC fundamentals",
  streaming: "Streaming & data freshness",
  "mev-fees": "Priority fees & landing",
  ops: "Infra operations",
  market: "Market & buyer context",
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
    pct >= 50 ? "Reasonable grasp — some good rabbit holes ahead." :
    "Plenty of room to learn — this stuff rewards curiosity.";

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
          {strong.length ? strong.join(" · ") : "Nothing dominant yet — try a longer quiz at a higher level."}
        </div>
      </div>

      <div className="card">
        <h2>What's worth learning next</h2>
        <div style={{ color: "#cdd3df", fontSize: 14, lineHeight: 1.55 }}>
          {weak.length ? weak.join(" · ") : "All topics roughly even — the expert tier will pressure-test the edges."}
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
