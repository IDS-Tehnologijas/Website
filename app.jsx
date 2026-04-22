const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "rust",
  "density": "cozy",
  "heroVariant": "A"
} /*EDITMODE-END*/;

const ACCENTS = {
  rust: { "--rust": "#b4532a", "--rust-deep": "#8a3d1c" },
  moss: { "--rust": "#4f6b3b", "--rust-deep": "#3a5028" },
  cobalt: { "--rust": "#2f5c9a", "--rust-deep": "#1f3f72" },
  ochre: { "--rust": "#b68928", "--rust-deep": "#8a661c" },
  ink: { "--rust": "#2b2820", "--rust-deep": "#15140f" }
};

function useTweaks() {
  const [t, setT] = useState(() => {
    try {return { ...TWEAK_DEFAULTS, ...JSON.parse(localStorage.getItem("ids_tweaks") || "{}") };}
    catch {return TWEAK_DEFAULTS;}
  });
  useEffect(() => {
    localStorage.setItem("ids_tweaks", JSON.stringify(t));
    const v = ACCENTS[t.accent] || ACCENTS.rust;
    Object.entries(v).forEach(([k, val]) => document.documentElement.style.setProperty(k, val));
  }, [t]);
  return [t, setT];
}

function useEditMode(setTweak) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const h = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setOn(true);
      if (e.data.type === "__deactivate_edit_mode") setOn(false);
    };
    window.addEventListener("message", h);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", h);
  }, []);
  const persist = (edits) => {
    setTweak((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
  };
  return [on, persist];
}

const SYSTEMS = [
{
  id: "shingle",
  no: "01",
  meta: "Bitumena / Kompozīta",
  title: "Šindeļi",
  desc: "Klasiska slāņota aizsardzība. Ekonomisks un plaši izmantots risinājums slīpiem dzīvojamo māju jumtiem — kluss, neitrāls, izturīgs.",
  specs: [
  ["Kalpošana", "25–30 gadi"],
  ["Min. slīpums", "15°"],
  ["Garantija", "20 gadi"],
  ["Uguns klase", "A"]]

},
{
  id: "metal",
  no: "02",
  meta: "Falcēts / Dakstiņš",
  title: "Metāls",
  desc: "Cinka, alumīnija un cinkotā tērauda sistēmas ar slēptiem stiprinājumiem. Gari paneļi, zema apkope, mūsdienīga izteiksme.",
  specs: [
  ["Kalpošana", "50+ gadi"],
  ["Min. slīpums", "3°"],
  ["Garantija", "40 gadi"],
  ["Sniega slodze", "Augsta"]]

},
{
  id: "rubber",
  no: "03",
  meta: "EPDM / TPO membrāna",
  title: "Gumija",
  desc: "Bezšuvju membrāna plakaniem un lēzeniem jumtiem. Pilnībā līmēta vai mehāniski stiprināta. Ideāla piebūvēm un komerciāliem objektiem.",
  specs: [
  ["Kalpošana", "40 gadi"],
  ["Min. slīpums", "0°"],
  ["Garantija", "25 gadi"],
  ["Šuves", "Karstā gaisa metinātas"]]

},
{
  id: "stone",
  no: "04",
  meta: "Dabīgais slāneklis / Māls",
  title: "Akmens",
  desc: "Dabīgais slāneklis un māla dakstiņi vēsturiskām un augstas klases jaunbūvēm. Smags, skaists, faktiski mūža materiāls.",
  specs: [
  ["Kalpošana", "100+ gadi"],
  ["Min. slīpums", "25°"],
  ["Garantija", "50 gadi"],
  ["Izcelsme", "ES karjeri"]]

},
{
  id: "solar",
  no: "05",
  meta: "Saules paneļu montāža",
  title: "Saules paneļi",
  desc: "Stiprinājumu komplekti, hidroizolācija, kabeļu trases un elektrība — integrēti ar jebkuru no augstāk minētajām jumta sistēmām.",
  specs: [
  ["Gada ražība / kWp", "~950 kWh"],
  ["Opt. slīpums", "30–40°"],
  ["Garantija", "25 gadi"],
  ["Atmaksa", "7–9 gadi"]]

}];


function Nav() {
  return (
    <nav className="nav">
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 0 }}>
        <a className="logo" href="#" aria-label="IDS Tehnoloģijas">
          <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 22 L20 4 L38 22" stroke="#15140f" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
            <path d="M13 13 L20 7 L27 13" stroke="var(--rust)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none" />
            <rect x="29" y="9" width="3.2" height="7" fill="#15140f" />
            <line x1="2" y1="22" x2="38" y2="22" stroke="#15140f" strokeWidth="1.4" />
            <line x1="8" y1="27" x2="32" y2="27" stroke="var(--rust)" strokeWidth="1.4" />
          </svg>
          <span>
            <div className="name">IDS Tehnoloģijas</div>
            <div className="tag">DIB. 2011 · LATVIJA</div>
          </span>
        </a>
        <div className="navlinks">
          <a href="#systems">Sistēmas</a>
          <a href="#solar">Saules paneļi</a>
          <a href="#process">Process</a>
          <a href="#work">Darbi</a>
          <a href="#quote">Kontakti</a>
        </div>
        <a className="nav-cta" href="#quote">
          <span className="dot" /> Pieteikt tāmi
        </a>
      </div>
    </nav>);

}

function Hero({ active, setActive, variant }) {
  const a = SYSTEMS.find((s) => s.id === active);
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-meta mono">
          <span>[ 01 — Saturs ]</span>
          <span>Jumti, notekas un saules paneļu montāža · Latvija un Baltija</span>
          <span>Aprīlis 2026</span>
        </div>

        {variant === "A" ?
        <h1>
            Jumti, kas<br />
            iztur <span className="emph">katru</span> laiku.
          </h1> :
        variant === "B" ?
        <h1>
            Katrs <span className="emph">jumts</span>,<br />
            un viss, kas uz tā.
          </h1> :

        <h1>
            Šindelis. Metāls.<br />
            Gumija. <span className="emph">Akmens.</span>
          </h1>
        }

        <div className="hero-sub">
          <p className="hero-lede">
            Mēs ierīkojam, pārklājam un uzturam visas izplatītākās jumta sistēmas — un uzstādām saules paneļus, kas atrodas uz tiem. Viena brigāde, viena garantija, viens rēķins.
          </p>
          <div className="hero-side">
            <div className="stat-row">
              <div className="stat"><div className="n">1 240+</div><div className="l">Paveikti jumti</div></div>
              <div className="stat"><div className="n">14 g.</div><div className="l">Vidējais darba stāžs</div></div>
              <div className="stat"><div className="n">98%</div><div className="l">Termiņā</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: 40 }}>
        <div className="selector">
          <div className="selector-row">
            {SYSTEMS.map((s) =>
            <button key={s.id} className={`sel-btn ${active === s.id ? "active" : ""}`} onClick={() => setActive(s.id)}>
                <span className="sel-num">{s.no}</span>
                <span className="sel-title">{s.title}</span>
                <span className="sel-meta">{s.meta}</span>
              </button>
            )}
          </div>
        </div>

        <div className="preview">
          <div className="preview-visual">
            <div className="sky" />
            <div className="sun" />
            <div className="building">
              <div className={`roof ${a.id}`}>
                <div className="overlay" style={{ backgroundPosition: "center center", margin: "25px 0px 0px 90px", width: "410.299px", backgroundSize: "contain", padding: "0px 0px 0px 200px" }} />
                {a.id === "solar" &&
                <div className="panels">
                    <div className="panel" /><div className="panel" />
                    <div className="panel" /><div className="panel" />
                  </div>
                }
              </div>
              <div className="gutter" />
              <div className="wall">
                <div className="window w1" />
                <div className="window w2" />
                <div className="window w3" />
              </div>
            </div>
            <div className="ground" />
          </div>
          <div className="preview-info">
            <div className="eyebrow">Sistēma {a.no} · {a.meta}</div>
            <div className="preview-title">{a.title}<span className="italic" style={{ color: "var(--rust)" }}>.</span></div>
            <p className="preview-desc">{a.desc}</p>
            <div className="spec-grid">
              {a.specs.map(([k, v]) =>
              <div className="spec" key={k}>
                  <div className="k">{k}</div>
                  <div className="v">{v}</div>
                </div>
              )}
            </div>
            <div className="preview-cta">
              <a className="btn primary" href="#quote">Saņemt tāmi <span className="arr" /></a>
              <a className="btn" href="#systems">Pilnā specifikācija <span className="arr" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function Ticker() {
  const items = ["Šindeļi", "Metāla falcējums", "EPDM gumija", "Dabīgais slāneklis", "Saules paneļu montāža", "Sniega barjeras", "Skursteņa apmales", "Notekas", "Jumta logi", "Ventilācija"];
  const row =
  <span>
      {items.map((it, i) => <React.Fragment key={i}><span>{it}</span><span className="dot" /></React.Fragment>)}
    </span>;

  return (
    <div className="ticker">
      <div className="ticker-track">{row}{row}</div>
    </div>);

}

function Services() {
  const items = [
  { no: "S-01", t: "Šindeļu jumti", sw: "shingle", p: "Stikla šķiedras un arhitektoniskie bitumena šindeļi ar pilnu pretledus hidroizolācijas slāni.",
    li: ["IKO, Owens Corning, Tegola", "Pretledus slānis uz dzegām + ielejās", "Grēdas, ribas un starta komplekts iekļauts"], price: "no €42/m²" },
  { no: "S-02", t: "Metāla jumti", sw: "metal", p: "Falcēts, klikšķa tipa un metāla dakstiņš cinkā, alumīnijā un krāsotā tēraudā.",
    li: ["Ruukki un Lindab partneri", "Slēpti stiprinājumi", "Krāsā saskaņotas apmales"], price: "no €68/m²" },
  { no: "S-03", t: "Gumijas / membrānas", sw: "rubber", p: "EPDM un TPO viena slāņa membrānas plakaniem jumtiem, terasēm, zaļajiem jumtiem.",
    li: ["Karstā gaisa metinātas šuves", "Pretsakņu opcijas", "25 gadu membrānas garantija"], price: "no €58/m²" },
  { no: "S-04", t: "Dabīgais akmens", sw: "stone", p: "Velsas, Spānijas un Skandināvijas slāneklis. Māla dakstiņi vēsturiskiem objektiem.",
    li: ["Rokas šķiroti piegādes brīdī", "Vara naglas, nerūs. āķi", "Gadsimtu kalpošana"], price: "no €145/m²" },
  { no: "S-05", t: "Saules paneļu montāža", sw: "solar", p: "Sliedes, skavas, apmales, kabeļu trases un pievadi bēniņos — integrēti ar jumta konstrukciju.",
    li: ["K2, Schletter, IBC Topfix", "Hermētiskas jumta pārdūrumi", "Jaunbūvēm un renovācijām"], price: "no €110/kWp" },
  { no: "S-06", t: "Notekas un detaļas", sw: "gutter", p: "Bezšuvju notekas, notekcaurules, sniega barjeras, skursteņa apmales, grēdas ventilācija.",
    li: ["Krāsots tērauds + varš", "Apsildāmo dzegu opcija", "Apkopes līgumi"], price: "no €22/m" }];

  return (
    <section id="systems" className="services">
      <div className="wrap">
        <div className="sec-head">
          <div className="num">02 — Ko mēs darām</div>
          <div className="title"><h2>Katra <em>jumta sistēma</em>, un viss, kas ap to.</h2></div>
        </div>
        <div className="svc-grid">
          {items.map((s, i) =>
          <div className="svc" key={i}>
              <div className="svc-head">
                <div>
                  <div className="no">{s.no}</div>
                  <h3 style={{ marginTop: 8 }}>{s.t}</h3>
                </div>
                <div className={`swatch ${s.sw}`} />
              </div>
              <p>{s.p}</p>
              <ul>{s.li.map((l, k) => <li key={k}>{l}</li>)}</ul>
              <div className="more">
                <div className="price"><small>Cena no</small>{s.price}</div>
                <a className="btn" href="#quote" style={{ padding: "8px 14px" }}>Tāme <span className="arr" /></a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const stageRef = React.useRef(null);
  const innerRef = React.useRef(null);
  React.useEffect(() => {
    const sync = () => {
      if (stageRef.current && innerRef.current) {
        innerRef.current.style.width = stageRef.current.clientWidth + "px";
      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  return (
    <section id="work" style={{ padding: "0 0 40px" }}>
      <div className="wrap">
        <div className="sec-head">
          <div className="num">03 — Paveikts</div>
          <div className="title"><h2>Koka dakstiņu nomaiņa uz akmens tipa dakstiņu.</h2></div>
        </div>
        <div className="ba-wrap">
          <div className="ba-stage" ref={stageRef} onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width * 100;
            setPos(Math.max(0, Math.min(100, x)));
          }}>
            <img className="ba-img ba-after" src="images/shingle-after.png" alt="Pēc" />
            <div className="ba-clip" style={{ width: pos + "%" }}>
              <div className="ba-clip-inner" ref={innerRef}>
                <img className="ba-img" src="images/shingle-before.png" alt="Pirms" />
              </div>
            </div>
            <div className="ba-handle" style={{ left: pos + "%" }}>
              <div className="ba-knob">‹ ›</div>
            </div>
            <div className="ba-tag ba-tag-l">PIRMS</div>
            <div className="ba-tag ba-tag-r">PĒC</div>
          </div>
          <div className="ba-info">
            <div className="ba-meta">
              <div><div className="k">Objekts</div><div className="v">Privātmāja · Vidzeme</div></div>
              <div><div className="k">Sistēma</div><div className="v">Bitumena šindeļi, krāsa "Grafīts"</div></div>
              <div><div className="k">Platība</div><div className="v">210 m²</div></div>
              <div><div className="k">Ilgums</div><div className="v">11 dienas</div></div>
              <div><div className="k">Darbi</div><div className="v">Demontāža, klāja remonts, hidroizolācija, šindeļi, notekas, skursteņa apmales</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function Solar() {
  return (
    <section id="solar" className="solar-sec">
      <div className="wrap">
        <div className="solar-grid">
          <div>
            <div className="eyebrow" style={{ color: "#e9b978" }}>04 — Saules paneļi kopā ar jumtu</div>
            <h2 style={{ marginTop: 18 }}>Paneļi uz jumta,<br />kuram mēs <em>uzticamies</em>.</h2>
            <p className="lede">Lielākā daļa saules paneļu problēmu sākas ar stiprinājumu. Mēs izpildām visu — sliedes, skavas, apmales, kabeļu trases, jumts līdz invertoram — kā daļu no jumta darba, nevis kā pēcdomu.</p>
            <div className="solar-list">
              <div><div className="k">Sistēmas</div><div className="v">K2 · Schletter · IBC</div></div>
              <div><div className="k">Jumta veidi</div><div className="v">Visi 4 — no šindeļa līdz slāneklim</div></div>
              <div><div className="k">Pārdūrumi</div><div className="v">EPDM hermetizēti</div></div>
              <div><div className="k">Pārbaude</div><div className="v">Drons + termo, katru gadu</div></div>
              <div><div className="k">Tipisks masīvs</div><div className="v">6–12 kWp māja</div></div>
              <div><div className="k">Nodošana</div><div className="v">30 dienās no apsekojuma</div></div>
            </div>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn primary" href="#quote" style={{ background: "#e9b978", borderColor: "#e9b978", color: "#15140f" }}>Plānot saules paneļus <span className="arr" /></a>
              <a className="btn" href="#process" style={{ borderColor: "#ffffff55", color: "#fff" }}>Skatīt procesu <span className="arr" /></a>
            </div>
          </div>
          <div className="solar-visual">
            <div className="sun-dot" />
            <div className="roof-angle" />
            <div className="panel-grid">
              {Array.from({ length: 12 }).map((_, i) => <div className="panel" />)}
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function Process() {
  const steps = [
  { n: "01", t: "Apsekojums", d: "Objekta vizīte, drona uzņēmumi, mērījumi un esošā jumta stāvokļa atskaite.", dur: "1 diena" },
  { n: "02", t: "Projekts", d: "Materiāli un sistēma izvēlēti. Konstrukcijas pārbaude, ja plānoti saules paneļi.", dur: "3–7 dienas" },
  { n: "03", t: "Tāme", d: "Detalizēta fiksētas cenas tāme ar produktiem, garantijām un grafiku.", dur: "48 st." },
  { n: "04", t: "Darbi", d: "Demontāža, klāja remonts, hidroizolācija, jumta segums, apmales, saules paneļi.", dur: "2–3 nedēļas" },
  { n: "05", t: "Nodošana", d: "Galīgā uzkopšana, drona QA lidojums, garantijas mape, ikgadējā pārbaude.", dur: "Tajā pašā dienā" }];

  return (
    <section id="process" className="process">
      <div className="wrap">
        <div className="sec-head">
          <div className="num">05 — Kā tas notiek</div>
          <div className="title"><h2>Piecas <em>godīgas</em> darbības, no zvana līdz nodošanai.</h2></div>
        </div>
      </div>
      <div className="wrap" style={{ padding: 0, maxWidth: "100%" }}>
        <div className="wrap">
          <div className="steps">
            {steps.map((s, i) =>
            <div className="step" key={i}>
                <div className="n">{s.n}</div>
                <div className="t">{s.t}</div>
                <div className="d">{s.d}</div>
                <div className="dur">{s.dur}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

function Materials() {
  const mats = [
  { t: "Arhitektoniskais šindelis", c: "shingle", chip: "ŠINDELIS", d: "Lamināts, izturīgs līdz 180 km/h vējam. Pieejamas pelēkas, brūnas un grafīta krāsas." },
  { t: "Cinka falcējums", c: "metal", chip: "METĀLS", d: "Patinējošs cinks antracīta vai dabīgā krāsā. 75 gadu kalpošana nozarē." },
  { t: "EPDM membrāna", c: "rubber", chip: "GUMIJA", d: "Viena loksne līdz 15 m platumā — mazāk šuvju, mazāk bojājumu." },
  { t: "Velsas dabīgais slāneklis", c: "stone", chip: "AKMENS", d: "Rokas šķirots A kategorijas slāneklis, plēsta virsma, vara stiprinājumi." }];

  return (
    <section style={{ padding: "0 0 40px" }}>
      <div className="wrap">
        <div className="sec-head">
          <div className="num">06 — Materiālu bibliotēka</div>
          <div className="title"><h2>Kā tas <em>izskatās</em> un <em>jūtas</em>.</h2></div>
        </div>
        <div className="mat-grid">
          {mats.map((m, i) =>
          <div className="mat" key={i}>
              <div className="chip">{m.chip}</div>
              <div className={`sample swatch ${m.c}`} />
              <h4>{m.t}</h4>
              <p>{m.d}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function QuoteForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    system: "", size: "", solar: "nē",
    name: "", email: "", phone: "", zip: "",
    when: "3 mēnešu laikā", notes: ""
  });
  const [err, setErr] = useState({});
  const upd = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!data.system) e.system = "Izvēlieties sistēmu";
      if (!data.size) e.size = "Ievadiet aptuveno laukumu";
    }
    if (step === 1) {
      if (!data.name) e.name = "Vārds ir obligāts";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Nepieciešama derīga e-pasta adrese";
      if (!data.phone || data.phone.length < 6) e.phone = "Tālrunis ir obligāts";
    }
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {if (validate()) setStep((s) => Math.min(s + 1, 3));};
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const send = () => {if (validate()) setStep(3);};

  const systems = ["Šindeļi", "Metāls", "Gumija", "Akmens", "Nezinu"];

  return (
    <section id="quote" className="quote">
      <div className="wrap">
        <div className="quote-grid">
          <div className="quote-left">
            <div className="num mono" style={{ color: "var(--mute)" }}>07 — Fiksētas cenas tāme</div>
            <h2 style={{ marginTop: 18 }}>Pastāstiet par <em>jumtu</em>.<br />Atbildēsim 48 stundās.</h2>
            <p>Katra tāme ir detalizēta: produkti, darbs, atkritumi, garantija. Bez slēptām "premium" uzcenošanām, bez izmaiņu pieprasījumu kruķiem. Ja mēs to nosaucām, mēs to turam.</p>
            <div className="contact-line">
              <div className="c"><div className="k">Zvanīt</div><div className="v">+371 29517165</div></div>
              <div className="c"><div className="k">E-pasts</div><div className="v">info@ids-teh.lv</div></div>
              <div className="c"><div className="k">Birojs</div><div className="v">Brīvības 214, Rīga</div></div>
            </div>
          </div>

          <div className="form">
            {step < 3 &&
            <div className="step-tabs">
                <span className={`t ${step >= 0 ? "active" : ""}`}>01 · Jumts</span>
                <span className={`t ${step >= 1 ? step === 1 ? "active" : "done" : ""}`}>02 · Jūs</span>
                <span className={`t ${step >= 2 ? step === 2 ? "active" : "done" : ""}`}>03 · Pārskats</span>
              </div>
            }

            {step === 0 && <>
              <div className="field">
                <label>Jumta sistēma</label>
                <div className="chip-row">
                  {systems.map((s) =>
                  <button key={s} type="button" className={data.system === s ? "on" : ""} onClick={() => upd("system", s)}>{s}</button>
                  )}
                </div>
                {err.system && <div className="err">{err.system}</div>}
              </div>
              <div className="grid2">
                <div className="field">
                  <label>Aptuvenais laukums (m²)</label>
                  <input value={data.size} onChange={(e) => upd("size", e.target.value)} placeholder="piem. 180" inputMode="numeric" />
                  {err.size && <div className="err">{err.size}</div>}
                </div>
                <div className="field">
                  <label>Saules paneļu montāža?</label>
                  <div className="chip-row">
                    {["jā", "nē", "varbūt"].map((o) =>
                    <button key={o} type="button" className={data.solar === o ? "on" : ""} onClick={() => upd("solar", o)}>{o}</button>
                    )}
                  </div>
                </div>
              </div>
              <div className="field">
                <label>Termiņš</label>
                <select value={data.when} onChange={(e) => upd("when", e.target.value)}>
                  <option>3 mēnešu laikā</option>
                  <option>6 mēnešu laikā</option>
                  <option>Šogad</option>
                  <option>Tikai pētu</option>
                </select>
              </div>
              <div className="actions">
                <span className="mono" style={{ color: "var(--mute)", alignSelf: "center" }}>Solis 1 no 3</span>
                <button className="btn primary" type="button" onClick={next}>Tālāk <span className="arr" /></button>
              </div>
            </>}

            {step === 1 && <>
              <div className="grid2">
                <div className="field">
                  <label>Vārds</label>
                  <input value={data.name} onChange={(e) => upd("name", e.target.value)} placeholder="Jānis Kalniņš" />
                  {err.name && <div className="err">{err.name}</div>}
                </div>
                <div className="field">
                  <label>Pasta indekss</label>
                  <input value={data.zip} onChange={(e) => upd("zip", e.target.value)} placeholder="LV-1010" />
                </div>
              </div>
              <div className="grid2">
                <div className="field">
                  <label>E-pasts</label>
                  <input value={data.email} onChange={(e) => upd("email", e.target.value)} placeholder="jus@domens.lv" type="email" />
                  {err.email && <div className="err">{err.email}</div>}
                </div>
                <div className="field">
                  <label>Tālrunis</label>
                  <input value={data.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="+371 …" type="tel" />
                  {err.phone && <div className="err">{err.phone}</div>}
                </div>
              </div>
              <div className="field">
                <label>Vai ir kas jāzina?</label>
                <textarea rows={3} value={data.notes} onChange={(e) => upd("notes", e.target.value)} placeholder="Esošā jumta vecums, piekļuve, termiņi…" />
              </div>
              <div className="actions">
                <button className="btn" type="button" onClick={prev}>Atpakaļ</button>
                <button className="btn primary" type="button" onClick={next}>Pārskats <span className="arr" /></button>
              </div>
            </>}

            {step === 2 && <>
              <div className="summary">
                <div className="row"><span className="k">Sistēma</span><span>{data.system}</span></div>
                <div className="row"><span className="k">Laukums</span><span>{data.size} m²</span></div>
                <div className="row"><span className="k">Saules paneļi</span><span>{data.solar}</span></div>
                <div className="row"><span className="k">Termiņš</span><span>{data.when}</span></div>
                <div className="row"><span className="k">Kontakts</span><span>{data.name} · {data.email}</span></div>
              </div>
              <div className="actions">
                <button className="btn" type="button" onClick={prev}>Atpakaļ</button>
                <button className="btn primary" type="button" onClick={send}>Nosūtīt pieteikumu <span className="arr" /></button>
              </div>
            </>}

            {step === 3 &&
            <div className="done">
                <div className="eyebrow">Saņemts · nr. #{Math.floor(Math.random() * 90000 + 10000)}</div>
                <div className="big">Paldies, {data.name.split(" ")[0] || "draugs"}. <em>Sazināsimies</em> 48 stundās.</div>
                <p style={{ color: "var(--ink-2)", fontSize: 14 }}>Apsekotājs piezvanīs, lai saskaņotu vizīti. Bez saistībām, bez pārdošanas dejām.</p>
                <button className="btn" type="button" onClick={() => {setStep(0);setData({ system: "", size: "", solar: "nē", name: "", email: "", phone: "", zip: "", when: "3 mēnešu laikā", notes: "" });}}>Jauns pieteikums</button>
              </div>
            }
          </div>
        </div>
      </div>
    </section>);

}

function Testimonials() {
  const t = [
  { q: "Viņi nomainīja jumtu trīs īres blokos, un nebija ne vienas īrnieka sūdzības. Augstāka slavas vērtējuma nav.", n: "Kristaps Bērziņš", r: "Nekustamā īpašuma īpašnieks · Rīga" },
  { q: "Saules paneļu montāža bija tīrākā detaļa visā mājā. Redzams, ka viņi domā par jumtu pirmajā vietā.", n: "Anna Ozola", r: "Māju īpašniece · Jūrmala" },
  { q: "Tāme atbilda rēķinam līdz pat eiro. Piesaistīju arī nākamajiem diviem īpašumiem.", n: "Mārtiņš Liepa", r: "Attīstītājs · Sigulda" }];

  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <div className="num">08 — Vārds no klientiem</div>
          <div className="title"><h2>Ko <em>cilvēki</em> saka pēc tam.</h2></div>
        </div>
        <div className="tests">
          {t.map((x, i) =>
          <div className="test" key={i}>
              <div className="stars">★ ★ ★ ★ ★</div>
              <div className="q">"{x.q}"</div>
              <div className="who">
                <div><div className="n">{x.n}</div></div>
                <div className="r">{x.r}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="big">Vēl <em>domājat</em><br />par jumtu?</div>
            <a className="btn primary" href="#quote">Pieteikt bezmaksas apsekojumu <span className="arr" /></a>
          </div>
          <div className="foot">
            <h5>Sistēmas</h5>
            <ul>
              <li><a href="#systems">Šindeļi</a></li>
              <li><a href="#systems">Metāls</a></li>
              <li><a href="#systems">Gumija</a></li>
              <li><a href="#systems">Akmens</a></li>
              <li><a href="#solar">Saules paneļu montāža</a></li>
            </ul>
          </div>
          <div className="foot">
            <h5>Uzņēmums</h5>
            <ul>
              <li><a href="#">Par mums</a></li>
              <li><a href="#work">Darbi</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#">Karjera</a></li>
            </ul>
          </div>
          <div className="foot">
            <h5>Kontakti</h5>
            <ul>
              <li>+371 29517165</li>
              <li>info@ids-teh.lv</li>
              <li>Brīvības 214, Rīga</li>
              <li>LV-1039</li>
            </ul>
          </div>
        </div>
        <div className="copyline">
          <span>© 2026 IDS Tehnoloģijas SIA</span>
          <span>Jumti · Notekas · Saules paneļi · Latvija</span>
        </div>
      </div>
    </footer>);

}

function TweaksPanel({ on, tweaks, set }) {
  return (
    <div className={`tweaks-panel ${on ? "on" : ""}`}>
      <h6>Pielāgojumi</h6>
      <div>
        <div style={{ marginBottom: 6 }}>Akcenta krāsa</div>
        <div className="swatches">
          {Object.entries(ACCENTS).map(([k, v]) =>
          <div key={k} className={`sw ${tweaks.accent === k ? "sel" : ""}`} style={{ background: v["--rust"] }} onClick={() => set({ accent: k })} title={k} />
          )}
        </div>
      </div>
      <div>
        <div style={{ marginBottom: 6 }}>Virsraksts</div>
        <div className="row" style={{ gap: 6 }}>
          {["A", "B", "C"].map((v) =>
          <button key={v} className={tweaks.heroVariant === v ? "on" : ""} onClick={() => set({ heroVariant: v })}>{v}</button>
          )}
        </div>
      </div>
    </div>);

}

function App() {
  const [tweaks, setTweaks] = useTweaks();
  const [editOn, persist] = useEditMode(setTweaks);
  const [active, setActive] = useState("metal");
  return (
    <>
      <Nav />
      <Hero active={active} setActive={setActive} variant={tweaks.heroVariant} />
      <Ticker />
      <Services />
      <BeforeAfter />
      <Solar />
      <Process />
      <Materials />
      <QuoteForm />
      <Testimonials />
      <Footer />
      <TweaksPanel on={editOn} tweaks={tweaks} set={persist} />
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);