"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface CityOption { nm: string; em: string; tg: string; }
interface CityQuestionType { opts: CityOption[]; }
interface Props {
  question?: CityQuestionType;
  selected: string | null;
  onSelect: (value: string) => void;
}

/* ─────────────────────────────────────────
   Hook — detects app dark/light theme.
   Priority: data-theme attr → .dark/.light
   class on <html> → prefers-color-scheme.
   Re-fires on any of those changing.
───────────────────────────────────────── */
function useIsDark(): boolean {
  const detect = (): boolean => {
    if (typeof window === "undefined") return false;
    const html = document.documentElement;
    const dt = html.getAttribute("data-theme") ?? "";
    if (dt === "dark")  return true;
    if (dt === "light") return false;
    if (html.classList.contains("dark"))  return true;
    if (html.classList.contains("light")) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDark, setIsDark] = useState<boolean>(detect);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMq = () => setIsDark(detect());
    mq.addEventListener("change", onMq);
    const obs = new MutationObserver(() => setIsDark(detect()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => { mq.removeEventListener("change", onMq); obs.disconnect(); };
  }, []);

  return isDark;
}

/* ─────────────────────────────────────────
   Defaults
───────────────────────────────────────── */
const DEFAULT_OPTS: CityOption[] = [
  { nm: "Delhi",     em: "🏯", tg: "Dil walon ki" },
  { nm: "Mumbai",    em: "🌊", tg: "Sapnon ki nagri" },
  { nm: "Bengaluru", em: "🌿", tg: "Silicon valley of India" },
  { nm: "Elsewhere", em: "🌍", tg: "Incredible India" },
];

/* ─────────────────────────────────────────
   Card themes — both variants per city
───────────────────────────────────────── */
type CardTheme = {
  accent:string; accentLight:string; border:string; borderSel:string;
  bgCard:string; bgCardSel:string; shadow:string; shadowSel:string;
  bar:string; labelColor:string; tagColor:string;
};

const CITY_THEME: Record<string, { light: CardTheme; dark: CardTheme }> = {
  Delhi: {
    light: {
      accent:"#c94a18", accentLight:"#fff0eb",
      border:"rgba(201,74,24,0.18)", borderSel:"#c94a18",
      bgCard:"#fffaf8", bgCardSel:"#fff4ef",
      shadow:"0 2px 10px rgba(201,74,24,0.08)", shadowSel:"0 14px 40px rgba(201,74,24,0.22)",
      bar:"linear-gradient(90deg,#FF9933 0%,#ffffff 50%,#138808 100%)",
      labelColor:"#7a2505", tagColor:"#c96032",
    },
    dark: {
      accent:"#ff7a40", accentLight:"rgba(255,122,64,0.12)",
      border:"rgba(255,122,64,0.22)", borderSel:"#ff7a40",
      bgCard:"rgba(255,80,20,0.06)", bgCardSel:"rgba(255,80,20,0.14)",
      shadow:"0 2px 10px rgba(0,0,0,0.25)", shadowSel:"0 14px 40px rgba(255,80,20,0.28)",
      bar:"linear-gradient(90deg,#FF9933 0%,#ffffff 50%,#138808 100%)",
      labelColor:"#ffaa80", tagColor:"#ff8050",
    },
  },
  Mumbai: {
    light: {
      accent:"#1877cc", accentLight:"#eef6ff",
      border:"rgba(24,119,204,0.18)", borderSel:"#1877cc",
      bgCard:"#f8fbff", bgCardSel:"#eef6ff",
      shadow:"0 2px 10px rgba(24,119,204,0.08)", shadowSel:"0 14px 40px rgba(24,119,204,0.22)",
      bar:"linear-gradient(90deg,#56b0ff,#1877cc)",
      labelColor:"#0b3e72", tagColor:"#1877cc",
    },
    dark: {
      accent:"#56b0ff", accentLight:"rgba(86,176,255,0.12)",
      border:"rgba(86,176,255,0.22)", borderSel:"#56b0ff",
      bgCard:"rgba(20,80,180,0.08)", bgCardSel:"rgba(20,80,180,0.18)",
      shadow:"0 2px 10px rgba(0,0,0,0.25)", shadowSel:"0 14px 40px rgba(30,100,220,0.3)",
      bar:"linear-gradient(90deg,#88ccff,#56b0ff)",
      labelColor:"#a8d8ff", tagColor:"#56b0ff",
    },
  },
  Bengaluru: {
    light: {
      accent:"#1a8c4e", accentLight:"#edfaf3",
      border:"rgba(26,140,78,0.18)", borderSel:"#1a8c4e",
      bgCard:"#f7fdf9", bgCardSel:"#edfaf3",
      shadow:"0 2px 10px rgba(26,140,78,0.08)", shadowSel:"0 14px 40px rgba(26,140,78,0.22)",
      bar:"linear-gradient(90deg,#3edb82,#1a8c4e)",
      labelColor:"#0d4a26", tagColor:"#1a8c4e",
    },
    dark: {
      accent:"#3edb82", accentLight:"rgba(62,219,130,0.12)",
      border:"rgba(62,219,130,0.22)", borderSel:"#3edb82",
      bgCard:"rgba(10,80,40,0.1)", bgCardSel:"rgba(10,80,40,0.2)",
      shadow:"0 2px 10px rgba(0,0,0,0.25)", shadowSel:"0 14px 40px rgba(20,160,70,0.28)",
      bar:"linear-gradient(90deg,#70ffaa,#3edb82)",
      labelColor:"#80ffb8", tagColor:"#3edb82",
    },
  },
  Elsewhere: {
    light: {
      accent:"#b07d10", accentLight:"#fffbea",
      border:"rgba(176,125,16,0.18)", borderSel:"#c8960e",
      bgCard:"#fffef5", bgCardSel:"#fffbea",
      shadow:"0 2px 10px rgba(176,125,16,0.08)", shadowSel:"0 14px 40px rgba(176,125,16,0.22)",
      bar:"linear-gradient(90deg,#ffd84a,#c8960e)",
      labelColor:"#5a3e00", tagColor:"#9e6e08",
    },
    dark: {
      accent:"#ffd84a", accentLight:"rgba(255,216,74,0.12)",
      border:"rgba(255,216,74,0.22)", borderSel:"#ffd84a",
      bgCard:"rgba(120,80,0,0.1)", bgCardSel:"rgba(120,80,0,0.2)",
      shadow:"0 2px 10px rgba(0,0,0,0.25)", shadowSel:"0 14px 40px rgba(200,150,10,0.28)",
      bar:"linear-gradient(90deg,#ffe87a,#ffd84a)",
      labelColor:"#ffe090", tagColor:"#ffd84a",
    },
  },
};

/* ─────────────────────────────────────────
   Keyframes (shared)
───────────────────────────────────────── */
const KEYFRAMES = `
@keyframes ccCardIn{from{opacity:0;transform:translateY(22px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes ccFlagWave{0%,100%{transform:skewX(0) scaleX(1)}40%{transform:skewX(-10deg) scaleX(.88)}70%{transform:skewX(5deg) scaleX(.93)}}
@keyframes ccCloud1{0%{transform:translateX(0)}100%{transform:translateX(22px)}}
@keyframes ccCloud2{0%{transform:translateX(0)}100%{transform:translateX(-16px)}}
@keyframes ccBird{0%{transform:translateX(-30px) translateY(0)}50%{transform:translateX(100px) translateY(-8px)}100%{transform:translateX(240px) translateY(2px)}}
@keyframes ccWave1{0%,100%{d:path("M0,8 C30,3 60,13 90,8 C120,3 150,13 180,8 C200,5 212,7 220,8")}50%{d:path("M0,8 C30,13 60,3 90,8 C120,13 150,3 180,8 C200,11 212,9 220,8")}}
@keyframes ccWave2{0%,100%{d:path("M0,5 C25,10 55,1 85,5 C115,10 145,1 175,5 C195,8 210,4 220,5")}50%{d:path("M0,5 C25,1 55,10 85,5 C115,1 145,10 175,5 C195,3 210,7 220,5")}}
@keyframes ccSail{0%,100%{transform:skewX(0)}50%{transform:skewX(-5deg)}}
@keyframes ccBoatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}
@keyframes ccBoatRock{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
@keyframes ccLeafSway{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes ccTreeSway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes ccRickshaw{0%{transform:translateX(0) rotate(0)}20%{transform:translateX(6px) rotate(1deg)}60%{transform:translateX(-4px) rotate(-.5deg)}100%{transform:translateX(0) rotate(0)}}
@keyframes ccWheelSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes ccSmoke{0%{transform:translateY(0) scale(1);opacity:.45}100%{transform:translateY(-12px) scale(2.2);opacity:0}}
@keyframes ccSunPulse{0%,100%{r:11}50%{r:12.5}}
@keyframes ccRay{0%,100%{opacity:.18}50%{opacity:.38}}
@keyframes ccTwinkle{0%,100%{opacity:.1}50%{opacity:1}}
@keyframes ccButterfly{0%{transform:translateX(0) translateY(0)}25%{transform:translateX(14px) translateY(-8px)}50%{transform:translateX(28px) translateY(2px)}75%{transform:translateX(14px) translateY(-4px)}100%{transform:translateX(0) translateY(0)}}
@keyframes ccBarPulse{0%,100%{opacity:1}50%{opacity:.75}}
@keyframes ccGlowIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
@keyframes ccWaterShimmer{0%,100%{opacity:.22}50%{opacity:.48}}
@keyframes ccMetro{0%{transform:translateX(-80px)}100%{transform:translateX(250px)}}
@keyframes ccKite{0%{transform:translate(0,0) rotate(-5deg)}25%{transform:translate(8px,-10px) rotate(3deg)}50%{transform:translate(15px,-4px) rotate(-2deg)}75%{transform:translate(7px,-12px) rotate(4deg)}100%{transform:translate(0,0) rotate(-5deg)}}
@keyframes ccShootingStar{0%{transform:translate(0,0);opacity:1}100%{transform:translate(60px,20px);opacity:0}}
@keyframes ccMoonGlow{0%,100%{opacity:.8}50%{opacity:1}}
@keyframes ccFirefly{0%,70%,100%{opacity:0}72%,78%{opacity:1}75%{opacity:.6}}
@keyframes ccTorchFlicker{0%,100%{transform:scaleY(1) scaleX(1);opacity:.9}25%{transform:scaleY(1.15) scaleX(.88);opacity:1}50%{transform:scaleY(.9) scaleX(1.1);opacity:.85}75%{transform:scaleY(1.1) scaleX(.92);opacity:.95}}
@keyframes ccDomeGlow{0%,100%{opacity:.12}50%{opacity:.3}}
@keyframes ccSeaSwell{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.04)}}
`;

/* ─────────────────────────────────────────
   Scene: Delhi
───────────────────────────────────────── */
function DelhiScene({ dark: D }: { dark: boolean }) {
  return (
    <svg viewBox="0 0 220 130" width="100%" style={{ display:"block" }}>
      <defs>
        <linearGradient id="dSky" x1="0" y1="0" x2="0" y2="1">
          {D ? (<><stop offset="0%"  stopColor="#0a0200" stopOpacity=".95"/><stop offset="70%" stopColor="#3a0e00" stopOpacity=".8"/><stop offset="100%" stopColor="#ff6b22" stopOpacity=".15"/></>) : (<><stop offset="0%"  stopColor="#ffe8c2"/><stop offset="55%" stopColor="#ffd49a"/><stop offset="100%" stopColor="#f5c070"/></>)}
        </linearGradient>
        <linearGradient id="dGround" x1="0" y1="0" x2="0" y2="1">
          {D ? (<><stop offset="0%"  stopColor="#1a0500"/><stop offset="100%" stopColor="#0a0200"/></>) : (<><stop offset="0%"  stopColor="#d4955a"/><stop offset="100%" stopColor="#8a5028"/></>)}
        </linearGradient>
        <linearGradient id="dWall"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%"  stopColor="#c87840"/><stop offset="100%" stopColor="#7a3e10"/></linearGradient>
        <linearGradient id="dTower" x1="0" y1="0" x2="0" y2="1"><stop offset="0%"  stopColor="#d4884e"/><stop offset="100%" stopColor="#863218"/></linearGradient>
        {D ? (
          <radialGradient id="dCel" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffe8a0" stopOpacity=".0"/>
            <stop offset="70%"  stopColor="#ff9933" stopOpacity=".12"/>
            <stop offset="100%" stopColor="#ff9933" stopOpacity=".0"/>
          </radialGradient>
        ) : (
          <radialGradient id="dCel" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff8c0"/>
            <stop offset="60%"  stopColor="#ffd860"/>
            <stop offset="100%" stopColor="#ffb830" stopOpacity=".0"/>
          </radialGradient>
        )}
        {D && <radialGradient id="dTG" cx="50%" cy="50%" r="50%"><stop offset="0%"   stopColor="#ff8c00" stopOpacity=".5"/><stop offset="100%" stopColor="#ff8c00" stopOpacity=".0"/></radialGradient>}
      </defs>

      <rect width="220" height="130" fill="url(#dSky)"/>

      {D ? (<>
        <line x1="30" y1="8" x2="46" y2="14" stroke="#fff" strokeWidth="1" strokeLinecap="round" style={{animation:"ccShootingStar 4s 2s ease-out infinite",opacity:0}}/>
        <circle cx="184" cy="19" r="22" fill="url(#dCel)" style={{animation:"ccMoonGlow 3s ease-in-out infinite"}}/>
        <circle cx="184" cy="19" r="10" fill="#ffe8a0"     style={{animation:"ccMoonGlow 3s ease-in-out infinite"}}/>
        <circle cx="188" cy="16" r="8"  fill="#0a0200" opacity=".6"/>
        {([[18,11,1.1,.1,1.8],[42,7,.9,.4,2.3],[72,14,1,.7,1.6],[110,5,.8,.3,2.5],[135,9,.8,.2,2.1],[155,6,1,.6,1.9],[162,16,1.1,.9,1.9]] as [number,number,number,number,number][]).map(([x,y,r,d,dur],i)=>(
          <circle key={i} cx={x} cy={y} r={r} fill="#ffcc88" style={{animation:`ccTwinkle ${dur}s ${d}s ease-in-out infinite`}}/>
        ))}
        <circle cx="54"  cy="74" r="14" fill="url(#dTG)" style={{animation:"ccTorchFlicker .4s ease-in-out infinite"}}/>
        <circle cx="166" cy="74" r="14" fill="url(#dTG)" style={{animation:"ccTorchFlicker .4s .15s ease-in-out infinite"}}/>
        {([[80,112,0],[140,118,1.1],[65,120,2],[155,110,.5]] as [number,number,number][]).map(([x,y,d],i)=>(
          <circle key={i} cx={x} cy={y} r="1.5" fill="#aaff44" style={{animation:`ccFirefly 3.1s ${d}s ease-in-out infinite`}}/>
        ))}
      </>) : (<>
        <circle cx="178" cy="22" r="32" fill="url(#dCel)" opacity=".55" style={{animation:"ccRay 3s ease-in-out infinite"}}/>
        <circle cx="178" cy="22" r="11" fill="#fff8c0" style={{animation:"ccSunPulse 3s ease-in-out infinite"}}/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>(
          <line key={i} x1={178+14*Math.cos(a*Math.PI/180)} y1={22+14*Math.sin(a*Math.PI/180)} x2={178+20*Math.cos(a*Math.PI/180)} y2={22+20*Math.sin(a*Math.PI/180)} stroke="#ffd060" strokeWidth="1.2" strokeLinecap="round" style={{animation:`ccRay 3s ${i*.15}s ease-in-out infinite`}}/>
        ))}
        <g style={{animation:"ccCloud1 8s ease-in-out alternate infinite"}} opacity=".55"><ellipse cx="52" cy="18" rx="22" ry="8" fill="#fff"/><ellipse cx="40" cy="20" rx="14" ry="7" fill="#fff"/><ellipse cx="64" cy="20" rx="12" ry="6" fill="#fff"/></g>
        <g style={{animation:"ccCloud2 11s ease-in-out alternate infinite"}} opacity=".4"><ellipse cx="138" cy="14" rx="18" ry="7" fill="#fff"/><ellipse cx="128" cy="16" rx="12" ry="6" fill="#fff"/></g>
        <g style={{animation:"ccBird 9s 1s linear infinite"}}><path d="M0,0 Q2,-2.5 4,0" fill="none" stroke="#8a5020" strokeWidth=".7" strokeLinecap="round"/><path d="M5,0 Q7,-2.5 9,0" fill="none" stroke="#8a5020" strokeWidth=".7" strokeLinecap="round"/></g>
        <g style={{animation:"ccKite 5s ease-in-out infinite",transformOrigin:"90px 30px"}}>
          <path d="M90,30 L96,22 L102,30 L96,38Z" fill="#ff6030" opacity=".85"/>
          <path d="M90,30 L102,30" stroke="#cc3010" strokeWidth=".5"/>
          <path d="M96,22 L96,38" stroke="#cc3010" strokeWidth=".5"/>
          <path d="M96,38 Q100,46 98,52 Q102,56 99,60" fill="none" stroke="#ff9933" strokeWidth=".8" strokeLinecap="round"/>
        </g>
      </>)}

      <rect x="0"  y="104" width="220" height="26" fill="url(#dGround)"/>
      <rect x="0"  y="104" width="220" height="3"  fill={D?"#3a0800":"#c87840"} opacity=".6"/>

      {/* Towers */}
      {[{x:18,cx:34},{x:170,cx:186}].map(({x,cx})=>(
        <g key={x}>
          <rect x={x}    y="50" width="32" height="56" fill="url(#dTower)" rx="1"/>
          <rect x={x}    y="44" width="7"  height="10" fill={D?"#c04020":"#bb5520"}/>
          <rect x={x+10} y="44" width="7"  height="10" fill={D?"#c04020":"#bb5520"}/>
          <rect x={x+20} y="44" width="7"  height="10" fill={D?"#c04020":"#bb5520"}/>
          <ellipse cx={cx} cy="44" rx="9"   ry="12" fill={D?"#d0402a":"#cc6030"}/>
          <ellipse cx={cx} cy="33" rx="5.5" ry="9"  fill={D?"#bb3018":"#aa4418"}/>
          <circle  cx={cx} cy="25" r="3"             fill={D?"#a02010":"#902808"}/>
          <rect x={cx-7} y="58" width="5" height="7" rx="1" fill={D?"#ffcc44":"#3a1408"} opacity={D?.55:.5}/>
          <rect x={cx+2} y="58" width="5" height="7" rx="1" fill={D?"#ffcc44":"#3a1408"} opacity={D?.55:.5}/>
        </g>
      ))}

      {/* Dark torches */}
      {D && (<>
        <rect x="51" y="66" width="3" height="10" fill="#8a5020"/>
        <g style={{animation:"ccTorchFlicker .38s ease-in-out infinite",transformOrigin:"52.5px 66px"}}>
          <path d="M50,66 Q52.5,58 55,66 Q52.5,63 50,66Z" fill="#ff8c00" opacity=".9"/>
          <path d="M51,66 Q52.5,60 54,66 Q52.5,64 51,66Z" fill="#ffcc00" opacity=".7"/>
        </g>
        <rect x="163" y="66" width="3" height="10" fill="#8a5020"/>
        <g style={{animation:"ccTorchFlicker .42s .1s ease-in-out infinite",transformOrigin:"164.5px 66px"}}>
          <path d="M162,66 Q164.5,58 167,66 Q164.5,63 162,66Z" fill="#ff8c00" opacity=".9"/>
          <path d="M163,66 Q164.5,60 166,66 Q164.5,64 163,66Z" fill="#ffcc00" opacity=".7"/>
        </g>
      </>)}

      <rect x="50" y="68" width="120" height="36" fill="url(#dWall)" rx="1"/>
      {[50,60,70,80,90,100,110,120,130,140,150,160].map(x=>(
        <rect key={x} x={x} y="61" width="7" height="11" fill={D?"#c04020":"#bb6030"}/>
      ))}
      <rect x="50" y="74" width="120" height="2" fill={D?"#ff8844":"#e8a060"} opacity=".4"/>
      <rect x="50" y="82" width="120" height="2" fill={D?"#ff8844":"#e8a060"} opacity=".3"/>

      <path d="M94,106 L94,80 Q110,60 126,80 L126,106Z" fill={D?"#4a0e02":"#4a2008"}/>
      <path d="M99,106 L99,82 Q110,66 121,82 L121,106Z" fill={D?"#2e0800":"#2e1005"} opacity=".88"/>
      <path d="M95,80 Q110,62 125,80" fill="none" stroke={D?"#ff9944":"#e8a060"} strokeWidth="1.2" opacity=".55"/>
      {D && <ellipse cx="110" cy="92" rx="7" ry="12" fill="#ff8c00" opacity=".0" style={{animation:"ccDomeGlow 2s ease-in-out infinite"}}/>}
      <path d="M60,106 L60,86 Q70,76 80,86 L80,106Z"     fill={D?"#4a0e02":"#4a2008"} opacity=".5"/>
      <path d="M140,106 L140,86 Q150,76 160,86 L160,106Z" fill={D?"#4a0e02":"#4a2008"} opacity=".5"/>

      <line x1="110" y1="14" x2="110" y2="42" stroke="#bbb" strokeWidth="1.2"/>
      <g style={{animation:"ccFlagWave 1.5s ease-in-out infinite",transformOrigin:"110px 14px"}}>
        <rect x="110" y="14" width="24" height="8"  fill="#FF9933" rx=".5"/>
        <rect x="110" y="22" width="24" height="8"  fill="#ffffff" rx=".5"/>
        <rect x="110" y="30" width="24" height="8"  fill="#138808" rx=".5"/>
        <circle cx="122" cy="26" r="3.5" fill="none" stroke="#000080" strokeWidth="1"/>
        <line x1="122" y1="22.5" x2="122" y2="29.5" stroke="#000080" strokeWidth=".5"/>
        <line x1="118.5" y1="26" x2="125.5" y2="26" stroke="#000080" strokeWidth=".5"/>
      </g>

      <g style={{animation:"ccRickshaw 2.5s ease-in-out infinite"}}>
        <rect x="4" y="96" width="22" height="10" rx="2.5" fill="#ff9933"/>
        <rect x="7" y="93" width="14" height="6"  rx="1.5" fill={D?"#ffcc44":"#ffc060"} opacity=".9"/>
        <rect x="8" y="97" width="4"  height="5"            fill="#fff" opacity={D?.35:.25}/>
        {D && <circle cx="26" cy="101" r="3" fill="#ffee88" opacity=".45"/>}
        {[{cx:9},{cx:23}].map(({cx})=>(
          <g key={cx} style={{transformOrigin:`${cx}px 108px`,animation:"ccWheelSpin .8s linear infinite"}}>
            <circle cx={cx}   cy="108" r="4" fill={D?"#222":"#5a3010"} stroke={D?"#555":"#8a5030"} strokeWidth=".8"/>
            <line x1={cx}   y1="104" x2={cx}   y2="112" stroke={D?"#888":"#c07040"} strokeWidth=".7"/>
            <line x1={cx-4} y1="108" x2={cx+4} y2="108" stroke={D?"#888":"#c07040"} strokeWidth=".7"/>
          </g>
        ))}
        <circle cx="4" cy="100" r="1.2" fill={D?"#aaa":"#bbb"} opacity=".45" style={{animation:"ccSmoke 1.5s ease-out infinite"}}/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   Scene: Mumbai
───────────────────────────────────────── */
function MumbaiScene({ dark: D }: { dark: boolean }) {
  return (
    <svg viewBox="0 0 220 130" width="100%" style={{display:"block"}}>
      <defs>
        <linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1">
          {D ? (<><stop offset="0%"  stopColor="#000d1f" stopOpacity=".95"/><stop offset="60%" stopColor="#001a3a" stopOpacity=".8"/><stop offset="100%" stopColor="#1a6aa0" stopOpacity=".1"/></>) : (<><stop offset="0%"  stopColor="#c6e8ff"/><stop offset="55%" stopColor="#a8d8f8"/><stop offset="100%" stopColor="#e0f0ff"/></>)}
        </linearGradient>
        <linearGradient id="mSea" x1="0" y1="0" x2="0" y2="1">
          {D ? (<><stop offset="0%"  stopColor="#0d5a9e" stopOpacity=".8"/><stop offset="100%" stopColor="#0a2a5a" stopOpacity=".95"/></>) : (<><stop offset="0%"  stopColor="#56a8e8"/><stop offset="100%" stopColor="#2478c0"/></>)}
        </linearGradient>
        <linearGradient id="mStone" x1="0" y1="0" x2="0" y2="1">
          {D ? (<><stop offset="0%"  stopColor="#d4aa52"/><stop offset="100%" stopColor="#8a6018"/></>) : (<><stop offset="0%"  stopColor="#f2d890"/><stop offset="100%" stopColor="#c0980c"/></>)}
        </linearGradient>
        <linearGradient id="mRefl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={D?"#ffe8a0":"#fff"} stopOpacity={D?".3":".28"}/>
          <stop offset="100%" stopColor={D?"#ffe8a0":"#fff"} stopOpacity=".0"/>
        </linearGradient>
        {D ? (
          <radialGradient id="mCel" cx="50%" cy="50%" r="50%">
            <stop offset="30%"  stopColor="#ffe8a0" stopOpacity=".0"/>
            <stop offset="70%"  stopColor="#ff9933" stopOpacity=".12"/>
            <stop offset="100%" stopColor="#ff9933" stopOpacity=".0"/>
          </radialGradient>
        ) : (
          <radialGradient id="mCel" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fffde0"/>
            <stop offset="55%"  stopColor="#ffe060"/>
            <stop offset="100%" stopColor="#ffd020" stopOpacity=".0"/>
          </radialGradient>
        )}
      </defs>

      <rect width="220" height="130" fill="url(#mSky)"/>

      {D ? (<>
        {([[14,9,1,.2,2.1],[38,15,.8,.5,1.7],[80,8,.9,.8,2],[130,12,.8,.1,2.3],[170,10,1.1,0,2.4],[200,17,.9,.7,1.9]] as [number,number,number,number,number][]).map(([x,y,r,d,dur],i)=>(
          <circle key={i} cx={x} cy={y} r={r} fill="#aaccff" style={{animation:`ccTwinkle ${dur}s ${d}s ease-in-out infinite`}}/>
        ))}
        <line x1="60" y1="6" x2="78" y2="13" stroke="#fff" strokeWidth="1" strokeLinecap="round" style={{animation:"ccShootingStar 5s 3s ease-out infinite",opacity:0}}/>
        <circle cx="30" cy="16" r="26" fill="url(#mCel)" style={{animation:"ccMoonGlow 3.5s .5s ease-in-out infinite"}}/>
        <circle cx="30" cy="16" r="9"  fill="#ffe8a0" opacity=".85" style={{animation:"ccMoonGlow 3.5s ease-in-out infinite"}}/>
        <circle cx="34" cy="13" r="7.5" fill="#000d1f" opacity=".58"/>
      </>) : (<>
        <circle cx="194" cy="20" r="28" fill="url(#mCel)" opacity=".45"/>
        <circle cx="194" cy="20" r="10" fill="#fff9c0" style={{animation:"ccSunPulse 3.5s .3s ease-in-out infinite"}}/>
        <g style={{animation:"ccCloud1 10s ease-in-out alternate infinite"}} opacity=".72"><ellipse cx="50" cy="16" rx="26" ry="9" fill="#fff"/><ellipse cx="36" cy="19" rx="16" ry="8" fill="#fff"/><ellipse cx="65" cy="19" rx="14" ry="7" fill="#fff"/></g>
        <g style={{animation:"ccCloud2 13s ease-in-out alternate infinite"}} opacity=".5"><ellipse cx="140" cy="12" rx="20" ry="7" fill="#fff"/><ellipse cx="130" cy="14" rx="14" ry="6" fill="#fff"/></g>
        <g style={{animation:"ccBird 11s 2s linear infinite"}}><path d="M0,0 Q2,-2 4,0" fill="none" stroke="#6090c0" strokeWidth=".7" strokeLinecap="round"/><path d="M5,0 Q7,-2 9,0" fill="none" stroke="#6090c0" strokeWidth=".7" strokeLinecap="round"/></g>
      </>)}

      <g style={D?{animation:"ccSeaSwell 3s ease-in-out infinite",transformOrigin:"110px 110px"}:{}}>
        <rect x="0" y="92" width="220" height="38" fill="url(#mSea)"/>
      </g>
      <rect x="12" y="92" width="18" height="38" fill="url(#mRefl)" style={{animation:"ccWaterShimmer 2.5s ease-in-out infinite"}}/>
      <rect x="90" y="95" width="10" height="35" fill="url(#mRefl)" style={{animation:"ccWaterShimmer 3s .5s ease-in-out infinite"}}/>

      <path style={{animation:"ccWave1 2s ease-in-out infinite"}} fill="none" stroke={D?"#4a9eff":"#fff"} strokeWidth="1.4" strokeOpacity={D?.5:.45} d="M0,97 C30,92 60,102 90,97 C120,92 150,102 180,97 C200,94 212,96 220,97"/>
      <path style={{animation:"ccWave2 2.6s .4s ease-in-out infinite"}} fill="none" stroke={D?"#4a9eff":"#fff"} strokeWidth=".9" strokeOpacity={D?.3:.25} d="M0,104 C25,109 55,100 85,104 C115,109 145,100 175,104 C195,107 210,103 220,104"/>

      <rect x="55" y="86" width="110" height="8" rx="1" fill="#d4b048" opacity={D?.65:.7}/>
      <rect x="48" y="90" width="124" height="4" rx="1" fill="#c09030" opacity=".5"/>

      <rect x="68" y="54" width="84" height="36" fill="url(#mStone)" rx="1"/>
      <rect x="68" y="60" width="84" height="2"  fill="#a07810" opacity=".3"/>
      <rect x="68" y="74" width="84" height="2"  fill="#a07810" opacity=".25"/>
      <rect x="68" y="84" width="84" height="2"  fill="#a07810" opacity=".2"/>

      <path d="M90,90 L90,70 Q110,48 130,70 L130,90Z"  fill={D?"#7a4e10":"#7a5010"} opacity=".9"/>
      <path d="M96,90 L96,72 Q110,54 124,72 L124,90Z"  fill={D?"#3e2408":"#4a2e08"} opacity=".9"/>
      {D && <ellipse cx="110" cy="80" rx="7" ry="12" fill="#ffe8a0" opacity=".0" style={{animation:"ccDomeGlow 3s ease-in-out infinite"}}/>}
      <path d="M91,70 Q110,50 129,70" fill="none" stroke={D?"#e8c060":"#e8c050"} strokeWidth="1.2" opacity=".55"/>
      <path d="M70,90 L70,76 Q80,66 90,76 L90,90Z"    fill={D?"#7a4e10":"#7a5010"} opacity=".5"/>
      <path d="M130,90 L130,76 Q140,66 150,76 L150,90Z" fill={D?"#7a4e10":"#7a5010"} opacity=".5"/>

      <rect x="78" y="42" width="64" height="14" fill={D?"#c8a040":"#ead880"} rx="1" opacity=".95"/>
      <rect x="80" y="38" width="60" height="6"  fill={D?"#a88028":"#c8a830"} rx="1"/>

      <ellipse cx="110" cy="30" rx="18" ry="22" fill={D?"#c8a040":"#ead880"} opacity=".95"/>
      <ellipse cx="110" cy="20" rx="11" ry="16" fill={D?"#a88028":"#c8a830"}/>
      <ellipse cx="110" cy="13" rx="6"  ry="9"  fill={D?"#886010":"#a88018"}/>
      <circle  cx="110" cy="7"  r="3"            fill={D?"#d8b040":"#e8c050"}/>
      {D && <ellipse cx="110" cy="24" rx="13" ry="16" fill="#ffe8a0" opacity=".0" style={{animation:"ccDomeGlow 2.5s .5s ease-in-out infinite"}}/>}

      {[83,137].map(cx=>(<g key={cx}><ellipse cx={cx} cy="38" rx="7" ry="10" fill={D?"#c8a830":"#c8a830"} opacity=".9"/><ellipse cx={cx} cy="30" rx="4" ry="7" fill={D?"#a88018":"#a88018"}/></g>))}
      {[{x:68,cx:73},{x:142,cx:147}].map(({x,cx})=>(<g key={x}><rect x={x} y="44" width="10" height="12" fill={D?"#c8a830":"#c8a830"} rx="1"/><ellipse cx={cx} cy="44" rx="5" ry="6" fill={D?"#a88018":"#a88018"}/></g>))}

      <g style={{animation:"ccBoatBob 3s ease-in-out infinite"}}>
        <g style={{animation:"ccBoatRock 3.5s ease-in-out infinite",transformOrigin:"32px 104px"}}>
          <path d="M14,106 Q32,100 50,106 L48,110 Q32,107 16,110Z" fill={D?"#e8e0c8":"#f5e8c0"} opacity={D?.75:.85}/>
          <line x1="32" y1="100" x2="32" y2="107" stroke="#c0a040" strokeWidth="1.3"/>
          <g style={{animation:"ccSail .3s ease-in-out infinite",transformOrigin:"32px 100px"}}><path d="M32,100 L45,105 L32,105Z" fill="#ff9933" opacity={D?.8:.85}/></g>
        </g>
      </g>
      <g style={{animation:"ccBoatBob 4s .8s ease-in-out infinite"}}>
        <g style={{animation:"ccBoatRock 4.5s .5s ease-in-out infinite",transformOrigin:"192px 107px"}}>
          <path d="M183,108 Q192,104 201,108 L199,111 Q192,109 185,111Z" fill={D?"#e8e0c8":"#f5e8c0"} opacity=".6"/>
          <line x1="192" y1="104" x2="192" y2="109" stroke="#c0a040" strokeWidth=".9"/>
          <g style={{animation:"ccSail 1.8s .3s ease-in-out infinite",transformOrigin:"192px 104px"}}><path d="M192,104 L199,107 L192,107Z" fill={D?"#4a9eff":"#56b0ff"} opacity={D?.6:.7}/></g>
        </g>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   Scene: Bengaluru
───────────────────────────────────────── */
function BengaluruScene({ dark: D }: { dark: boolean }) {
  return (
    <svg viewBox="0 0 220 130" width="100%" style={{display:"block"}}>
      <defs>
        <linearGradient id="bSky" x1="0" y1="0" x2="0" y2="1">
          {D ? (<><stop offset="0%"  stopColor="#000d05" stopOpacity=".95"/><stop offset="60%" stopColor="#001a0a" stopOpacity=".8"/><stop offset="100%" stopColor="#0d4020" stopOpacity=".1"/></>) : (<><stop offset="0%"  stopColor="#d0eeff"/><stop offset="55%" stopColor="#b8e4f0"/><stop offset="100%" stopColor="#d8f4e8"/></>)}
        </linearGradient>
        <linearGradient id="bStone" x1="0" y1="0" x2="0" y2="1">
          {D ? (<><stop offset="0%"  stopColor="#dfc898"/><stop offset="100%" stopColor="#907828"/></>) : (<><stop offset="0%"  stopColor="#f0dda0"/><stop offset="100%" stopColor="#c0a830"/></>)}
        </linearGradient>
        <linearGradient id="bTree1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%"  stopColor={D?"#2edd66":"#5ae898"}/><stop offset="100%" stopColor={D?"#0a4018":"#108840"}/></linearGradient>
        <linearGradient id="bTree2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%"  stopColor={D?"#20cc58":"#3ad870"}/><stop offset="100%" stopColor={D?"#0a4018":"#0e6830"}/></linearGradient>
        <linearGradient id="bGround" x1="0" y1="0" x2="0" y2="1">
          {D ? (<><stop offset="0%"  stopColor="#0d3018"/><stop offset="100%" stopColor="#061008"/></>) : (<><stop offset="0%"  stopColor="#6ad890"/><stop offset="100%" stopColor="#20a848"/></>)}
        </linearGradient>
      </defs>

      <rect width="220" height="130" fill="url(#bSky)"/>

      {D ? (<>
        {([[20,10,1,.3,1.9],[50,7,.9,.6,2.2],[90,12,.8,.9,1.8],[130,8,1,.2,2.4],[170,11,1.1,.1,1.7]] as [number,number,number,number,number][]).map(([x,y,r,d,dur],i)=>(
          <circle key={i} cx={x} cy={y} r={r} fill="#88ffcc" style={{animation:`ccTwinkle ${dur}s ${d}s ease-in-out infinite`}}/>
        ))}
        <circle cx="196" cy="16" r="9"   fill="#ccffee" opacity=".65" style={{animation:"ccMoonGlow 4s ease-in-out infinite"}}/>
        <circle cx="200" cy="13" r="7.5" fill="#000d05" opacity=".55"/>
      </>) : (<>
        <circle cx="188" cy="18" r="26" fill="#fffff0" opacity=".45"/>
        <circle cx="188" cy="18" r="9"  fill="#f8ffe8" style={{animation:"ccSunPulse 4s ease-in-out infinite"}}/>
        <g style={{animation:"ccCloud1 9s ease-in-out alternate infinite"}} opacity=".65"><ellipse cx="48" cy="15" rx="24" ry="9" fill="#fff"/><ellipse cx="34" cy="18" rx="15" ry="7" fill="#fff"/><ellipse cx="62" cy="18" rx="13" ry="6" fill="#fff"/></g>
        <g style={{animation:"ccCloud2 12s ease-in-out alternate infinite"}} opacity=".45"><ellipse cx="148" cy="11" rx="18" ry="7" fill="#fff"/><ellipse cx="138" cy="13" rx="12" ry="5" fill="#fff"/></g>
        <g style={{animation:"ccButterfly 6s ease-in-out infinite",transformOrigin:"65px 55px"}}>
          <ellipse cx="62" cy="54" rx="4.5" ry="6" fill="#ff9933" opacity=".75" transform="rotate(-20,62,54)"/>
          <ellipse cx="70" cy="54" rx="4.5" ry="6" fill="#ff9933" opacity=".75" transform="rotate(20,70,54)"/>
          <ellipse cx="63" cy="58" rx="2.5" ry="4" fill="#ff6020" opacity=".55" transform="rotate(-20,63,58)"/>
          <ellipse cx="69" cy="58" rx="2.5" ry="4" fill="#ff6020" opacity=".55" transform="rotate(20,69,58)"/>
          <line x1="65" y1="52" x2="65" y2="62" stroke="#5a2000" strokeWidth=".8"/>
        </g>
      </>)}

      <rect x="0" y="108" width="220" height="22" fill="url(#bGround)"/>
      <rect x="0" y="108" width="220" height="3"  fill={D?"#1a5a28":"#3ad870"} opacity=".6"/>

      {D && ([[60,114,0],[80,110,.9],[145,112,1.8],[165,117,.5]] as [number,number,number][]).map(([x,y,d],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="#aaff44" style={{animation:`ccFirefly 2.8s ${d}s ease-in-out infinite`}}/>
      ))}

      <g style={{animation:"ccMetro 5.5s 0.5s linear infinite"}}>
        <rect x="-78" y="116" width="60" height="10" rx="3" fill="#2ecc9a" opacity={D?.7:.8}/>
        <rect x="-76" y="118" width="12" height="5" rx="1" fill={D?"#0a3018":"#0a3018"} opacity={D?.5:.35}/>
        <rect x="-61" y="118" width="12" height="5" rx="1" fill={D?"#0a3018":"#0a3018"} opacity={D?.5:.35}/>
        <rect x="-46" y="118" width="12" height="5" rx="1" fill={D?"#0a3018":"#0a3018"} opacity={D?.5:.35}/>
        <circle cx="-65" cy="127" r="2.5" fill={D?"#1a1a1a":"#2a5040"}/>
        <circle cx="-26" cy="127" r="2.5" fill={D?"#1a1a1a":"#2a5040"}/>
        <circle cx="-19" cy="121" r="1.8" fill="#ffffaa" opacity={D?.9:.8}/>
      </g>

      {/* Trees */}
      {[
        {cx:22,tx:19,tw:6,th:24,dark1:D?"#3a2006":"#5a3a10",r1x:14,r1y:18,r2x:10,r2y:13,r3x:6,r3y:9,anim:"ccLeafSway",dur:"3s",cy1:84,cy2:76,cy3:70,origin:"22px 76px"},
        {cx:198,tx:195,tw:6,th:26,dark1:D?"#3a2006":"#5a3a10",r1x:15,r1y:20,r2x:11,r2y:14,r3x:7,r3y:10,anim:"ccTreeSway",dur:"3.4s .4s",cy1:80,cy2:71,cy3:65,origin:"198px 74px"},
      ].map(({cx,tx,tw,th,dark1,r1x,r1y,r2x,r2y,r3x,r3y,anim,dur,cy1,cy2,cy3,origin})=>(
        <g key={cx} style={{animation:`${anim} ${dur} ease-in-out infinite`,transformOrigin:origin}}>
          <rect x={tx} y={114-th} width={tw} height={th} fill={dark1} opacity=".8"/>
          <ellipse cx={cx} cy={cy1} rx={r1x} ry={r1y} fill="url(#bTree1)" opacity=".9"/>
          <ellipse cx={cx} cy={cy2} rx={r2x} ry={r2y} fill={D?"#4ae888":"#4ae888"} opacity={D?.72:.75}/>
          <ellipse cx={cx} cy={cy3} rx={r3x} ry={r3y} fill={D?"#60f898":"#70f8a0"} opacity={D?.55:.6}/>
        </g>
      ))}
      {[
        {cx:40,tx:38,tw:4,th:18,anim:"ccLeafSway",dur:"2.8s .7s",cy1:92,cy2:86,origin:"40px 88px"},
        {cx:180,tx:178,tw:4,th:20,anim:"ccTreeSway",dur:"3.2s .2s",cy1:90,cy2:83,origin:"180px 86px"},
      ].map(({cx,tx,tw,th,anim,dur,cy1,cy2,origin})=>(
        <g key={cx} style={{animation:`${anim} ${dur} ease-in-out infinite`,transformOrigin:origin}}>
          <rect x={tx} y={114-th} width={tw} height={th} fill={D?"#3a2006":"#5a3a10"} opacity=".6"/>
          <ellipse cx={cx} cy={cy1} rx="10" ry="13" fill="url(#bTree2)" opacity=".8"/>
          <ellipse cx={cx} cy={cy2} rx="7"  ry="9"  fill={D?"#3ad870":"#3ad870"} opacity=".65"/>
        </g>
      ))}

      <rect x="50" y="104" width="120" height="5" rx="1" fill="#d4b848" opacity=".5"/>
      <rect x="54" y="100" width="112" height="6" rx="1" fill="#e0c858" opacity=".55"/>

      <rect x="58" y="72"  width="104" height="32" fill="url(#bStone)" rx="1"/>
      {[62,72,82,92,102,112,122,132,142,152].map(x=>(<rect key={x} x={x} y="65" width="7" height="39" fill={D?"#b09020":"#b09020"} opacity=".4"/>))}
      <rect x="58" y="62" width="104" height="5"  fill={D?"#d8c050":"#e8d060"} opacity=".75" rx="1"/>
      <rect x="68" y="50" width="84"  height="16" fill={D?"#e0c858":"#f0d878"} opacity=".92" rx="1"/>
      {[72,82,92,102,112,122,132].map(x=>(<rect key={x} x={x} y="44" width="6" height="22" fill={D?"#b09020":"#c0a020"} opacity=".4"/>))}
      <rect x="68" y="42" width="84" height="5"  fill={D?"#d8c050":"#e0c858"} opacity=".8" rx="1"/>
      <rect x="82" y="30" width="56" height="14" fill={D?"#d8c050":"#eacc60"} rx="1" opacity=".92"/>
      <rect x="82" y="27" width="56" height="5"  fill={D?"#c0a838":"#d0b040"} rx="1"/>

      <ellipse cx="110" cy="22" rx="17" ry="21" fill={D?"#d8c050":"#eacc60"} opacity=".95"/>
      <ellipse cx="110" cy="13" rx="10" ry="14" fill={D?"#c0a838":"#d0b040"}/>
      <ellipse cx="110" cy="6"  rx="6"  ry="9"  fill={D?"#a09020":"#b09020"}/>
      <circle  cx="110" cy="1"  r="2.5"          fill={D?"#e8d060":"#e8d060"}/>
      {D && <ellipse cx="110" cy="18" rx="13" ry="16" fill="#ffe8a0" opacity=".0" style={{animation:"ccDomeGlow 2.8s ease-in-out infinite"}}/>}

      <ellipse cx="85"  cy="32" rx="7" ry="10" fill={D?"#c8a030":"#d0b040"} opacity=".9"/>
      <ellipse cx="85"  cy="24" rx="4" ry="7"  fill={D?"#a08020":"#b09020"}/>
      <ellipse cx="135" cy="32" rx="7" ry="10" fill={D?"#c8a030":"#d0b040"} opacity=".9"/>
      <ellipse cx="135" cy="24" rx="4" ry="7"  fill={D?"#a08020":"#b09020"}/>

      <line x1="110" y1="0" x2="110" y2="14" stroke="#bbb" strokeWidth="1.1"/>
      <g style={{animation:"ccFlagWave 1.6s ease-in-out infinite",transformOrigin:"110px 0px"}}>
        <rect x="110" y="-8" width="22" height="6" fill="#FF9933" rx=".5"/>
        <rect x="110" y="-2" width="22" height="6" fill="#ffffff" rx=".5"/>
        <rect x="110" y="4"  width="22" height="6" fill="#138808" rx=".5"/>
        <circle cx="121" cy="1" r="3" fill="none" stroke="#000080" strokeWidth=".9"/>
        <line x1="121" y1="-2" x2="121" y2="4" stroke="#000080" strokeWidth=".5"/>
        <line x1="118" y1="1"  x2="124" y2="1" stroke="#000080" strokeWidth=".5"/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   Globe canvas — light/dark aware
───────────────────────────────────────── */
const LAND_POLYS: number[][][] = [
  [[68,37],[72,34],[74,32],[76,30],[78,28],[79,26],[80,24],[80,22],[77,20],[76,18],[74,16],[77,14],[79,12],[80,10],[79,8],[78,8],[76,9],[74,12],[72,14],[70,22],[68,24],[67,28],[67,32],[68,37]],
  [[80,9],[81,7],[81,6],[80,6],[80,9]],
  [[-10,36],[0,36],[10,35],[20,37],[30,38],[40,38],[50,40],[60,42],[70,44],[80,46],[90,52],[100,54],[110,52],[120,50],[130,45],[140,42],[150,40],[160,54],[165,60],[155,68],[140,72],[120,72],[100,70],[80,72],[60,70],[40,68],[20,65],[0,62],[-10,62],[-20,56],[-10,50],[-10,40],[-10,36]],
  [[-18,15],[-16,5],[-10,-2],[0,-8],[8,-5],[12,0],[15,5],[18,10],[20,15],[22,20],[18,26],[12,30],[10,35],[0,37],[-5,34],[-8,28],[-10,20],[-14,12],[-18,15]],
  [[-60,46],[-65,44],[-70,42],[-75,40],[-80,35],[-82,30],[-90,25],[-96,20],[-100,16],[-90,14],[-85,10],[-80,8],[-75,10],[-70,12],[-65,18],[-60,22],[-60,30],[-65,40],[-60,46]],
  [[-40,-5],[-35,-8],[-40,-15],[-42,-22],[-45,-25],[-50,-30],[-55,-35],[-60,-40],[-65,-45],[-68,-50],[-70,-40],[-70,-30],[-65,-20],[-55,-10],[-50,-5],[-45,0],[-40,-5]],
  [[114,-22],[116,-28],[120,-32],[126,-34],[130,-32],[136,-34],[140,-36],[146,-38],[150,-36],[152,-28],[150,-22],[145,-16],[140,-14],[135,-12],[130,-14],[124,-18],[114,-22]],
];
const GLOBE_CITIES:[number,number,string,string][] = [[77.2,28.6,"#e05010","Delhi"],[72.8,18.9,"#1877cc","Mumbai"],[77.6,12.9,"#1a8c4e","Blr"]];

function GlobeCanvas({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angRef    = useRef(0);
  const lastTRef  = useRef(0);
  const rafRef    = useRef<number>(0);
  const darkRef   = useRef(dark);
  darkRef.current = dark;

  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W=220,H=130,CX=110,CY=65,R=52;

    function project(lon:number,lat:number,rot:number):[number,number,number]|null {
      const lam=(lon+rot)*Math.PI/180,phi=lat*Math.PI/180;
      const x=R*Math.cos(phi)*Math.sin(lam),y=-R*Math.sin(phi),z=R*Math.cos(phi)*Math.cos(lam);
      if(z<0) return null; return [CX+x,CY+y,z/R];
    }

    function draw(rot:number) {
      const D=darkRef.current; ctx.clearRect(0,0,W,H); const t=Date.now()/1000;
      const bg=ctx.createLinearGradient(0,0,0,H);
      if(D){bg.addColorStop(0,"#000d10");bg.addColorStop(1,"#001a10");}
      else{bg.addColorStop(0,"#d8eeff");bg.addColorStop(1,"#e8f8f0");}
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
      if(D){
        [[22,12],[50,8],[90,6],[155,10],[195,9],[60,22],[170,19],[100,5],[140,14]].forEach(([sx,sy],i)=>{
          const b=0.08+0.5*Math.abs(Math.sin(t*.9+i));
          ctx.beginPath();ctx.arc(sx,sy,.8,0,Math.PI*2);ctx.fillStyle=`rgba(180,220,255,${b})`;ctx.fill();
        });
      } else {
        ctx.save();ctx.globalAlpha=0.3;ctx.fillStyle="#fff";
        ctx.beginPath();ctx.ellipse(50,18,28,10,0,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.ellipse(170,14,22,8,0,0,Math.PI*2);ctx.fill();ctx.restore();
      }
      ctx.save();ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.clip();
      const ocn=ctx.createRadialGradient(CX-R*.2,CY-R*.2,0,CX,CY,R);
      if(D){ocn.addColorStop(0,"#62c0f8");ocn.addColorStop(.4,"#3298e8");ocn.addColorStop(.8,"#1878cc");ocn.addColorStop(1,"#0d58a8");}
      else{ocn.addColorStop(0,"#a8dff8");ocn.addColorStop(.5,"#6abce8");ocn.addColorStop(1,"#3898d8");}
      ctx.fillStyle=ocn;ctx.fillRect(CX-R,CY-R,R*2,R*2);
      for(let i=0;i<4;i++){const ph=t*.35+i*.8,sx=CX-R+((i*38+Math.sin(ph)*12)%(R*2));ctx.beginPath();ctx.moveTo(sx,CY-R);ctx.lineTo(sx+10,CY+R);ctx.strokeStyle=`rgba(255,255,255,${0.06+0.04*Math.sin(ph)})`;ctx.lineWidth=3;ctx.stroke();}
      ctx.strokeStyle=D?"rgba(255,255,255,0.13)":"rgba(255,255,255,0.28)";ctx.lineWidth=.5;
      for(let la=-60;la<=60;la+=30){ctx.beginPath();let f=true;for(let lo=-180;lo<=180;lo+=4){const p=project(lo,la,rot);if(!p){f=true;continue;}f?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]);f=false;}ctx.stroke();}
      for(let lo=0;lo<360;lo+=30){ctx.beginPath();let f=true;for(let la=-80;la<=80;la+=4){const p=project(lo-180,la,rot);if(!p){f=true;continue;}f?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]);f=false;}ctx.stroke();}
      LAND_POLYS.forEach((poly,ci)=>{
        ctx.beginPath();let f=true;poly.forEach(([lo,la])=>{const p=project(lo,la,rot);if(!p){f=true;return;}f?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]);f=false;});ctx.closePath();
        const isI=ci===0||ci===1,pulse=isI?(0.9+0.08*Math.sin(t*1.5)):1;
        ctx.fillStyle=isI?`rgba(255,190,40,${pulse})`:(D?"rgba(72,175,72,0.84)":"rgba(100,200,100,0.82)");ctx.fill();
        ctx.strokeStyle=isI?(D?"rgba(255,225,80,0.95)":"rgba(240,160,20,0.9)"):(D?"rgba(40,140,40,0.5)":"rgba(60,160,60,0.5)");ctx.lineWidth=isI?1.2:.5;ctx.stroke();
      });
      const shad=ctx.createRadialGradient(CX+R*.4,CY,0,CX,CY,R);
      shad.addColorStop(0,"rgba(0,0,0,0)");shad.addColorStop(.65,"rgba(0,0,0,0)");shad.addColorStop(1,D?"rgba(0,18,55,0.5)":"rgba(30,80,160,0.18)");
      ctx.fillStyle=shad;ctx.fillRect(CX-R,CY-R,R*2,R*2);ctx.restore();
      ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);
      const rim=ctx.createLinearGradient(CX-R,CY-R,CX+R,CY+R);
      rim.addColorStop(0,D?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.7)");rim.addColorStop(.5,D?"rgba(100,180,255,0.2)":"rgba(180,220,255,0.25)");rim.addColorStop(1,D?"rgba(0,25,70,0.45)":"rgba(50,120,200,0.3)");
      ctx.strokeStyle=rim;ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(CX-R*.28,CY-R*.28,R*.18,0,Math.PI*2);
      const sp=ctx.createRadialGradient(CX-R*.28,CY-R*.28,0,CX-R*.28,CY-R*.28,R*.18);sp.addColorStop(0,"rgba(255,255,255,0.5)");sp.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=sp;ctx.fill();
      GLOBE_CITIES.forEach(([lo,la,color,label])=>{
        const p=project(lo,la,rot);if(!p) return;
        const rr=4+8*((t*.6+lo/100)%1),ro=1-((t*.6+lo/100)%1);
        ctx.beginPath();ctx.arc(p[0],p[1],rr,0,Math.PI*2);ctx.strokeStyle=color+Math.round(ro*140).toString(16).padStart(2,"0");ctx.lineWidth=1.2;ctx.stroke();
        ctx.beginPath();ctx.arc(p[0],p[1],3.5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
        ctx.beginPath();ctx.arc(p[0],p[1],1.5,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();
        if(p[2]>.28){ctx.font="bold 7px sans-serif";ctx.fillStyle=color;ctx.fillText(label,p[0]+5,p[1]-2);}
      });
      const qP=project(40,20,rot);
      if(qP&&qP[2]>.2){const pl=.6+.4*Math.sin(t*2);ctx.beginPath();ctx.arc(qP[0],qP[1],10,0,Math.PI*2);ctx.fillStyle=`rgba(200,150,20,${.18*pl})`;ctx.fill();ctx.beginPath();ctx.arc(qP[0],qP[1],5,0,Math.PI*2);ctx.fillStyle=`rgba(200,150,20,${.7*pl})`;ctx.fill();ctx.font="bold 7px sans-serif";ctx.fillStyle="#fff";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("?",qP[0],qP[1]);ctx.textAlign="left";ctx.textBaseline="alphabetic";}
    }

    function loop(ts:number){const dt=ts-lastTRef.current;lastTRef.current=ts;angRef.current=(angRef.current+0.09*(dt||16))%360;draw(-angRef.current);rafRef.current=requestAnimationFrame(loop);}
    rafRef.current=requestAnimationFrame(ts=>{lastTRef.current=ts;loop(ts);});
    return ()=>cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} width={220} height={130} style={{display:"block",width:"100%"}}/>;
}

/* ─────────────────────────────────────────
   Scene router
───────────────────────────────────────── */
function CityScene({ nm, dark }: { nm:string; dark:boolean }) {
  if (nm==="Delhi")     return <DelhiScene     dark={dark}/>;
  if (nm==="Mumbai")    return <MumbaiScene    dark={dark}/>;
  if (nm==="Bengaluru") return <BengaluruScene dark={dark}/>;
  return <GlobeCanvas dark={dark}/>;
}

/* ─────────────────────────────────────────
   Main export
───────────────────────────────────────── */
export default function CityQuestion({ question, selected, onSelect }: Props) {
  const opts   = question?.opts ?? DEFAULT_OPTS;
  const isDark = useIsDark();
  const [pressed, setPressed] = useState<string | null>(null);

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,padding:"14px 12px"}}>
        {opts.map((opt, i) => {
          const t     = (CITY_THEME[opt.nm] ?? CITY_THEME.Elsewhere)[isDark ? "dark" : "light"];
          const isSel = selected === opt.nm;
          const isPrs = pressed  === opt.nm;

          return (
            <div
              key={opt.nm}
              onClick={() => { onSelect(opt.nm); if(navigator.vibrate) navigator.vibrate([8,20,8]); }}
              onMouseDown={()  => setPressed(opt.nm)}
              onMouseUp={()    => setPressed(null)}
              onMouseLeave={() => setPressed(null)}
              onTouchStart={()  => setPressed(opt.nm)}
              onTouchEnd={()    => setPressed(null)}
              style={{
                position:"relative", borderRadius:18, overflow:"hidden",
                cursor:"pointer", userSelect:"none",
                WebkitTapHighlightColor:"transparent",
                border:     `2px solid ${isSel ? t.borderSel : t.border}`,
                background: isSel ? t.bgCardSel : isPrs ? t.accentLight : t.bgCard,
                transform:  isSel ? "translateY(-6px) scale(1.03)" : isPrs ? "translateY(1px) scale(0.97)" : "none",
                boxShadow:  isSel ? t.shadowSel : isPrs ? `0 1px 8px ${t.accent}30` : t.shadow,
                transition: "all 0.28s cubic-bezier(0.34,1.5,0.64,1)",
                animation:  `ccCardIn 0.45s ${i*0.08}s both`,
              }}
            >
              {/* Accent bar */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:t.bar,opacity:isSel?1:0,borderRadius:"16px 16px 0 0",transition:"opacity 0.3s",animation:"ccBarPulse 2s ease-in-out infinite"}}/>

              {/* Checkmark */}
              {isSel && (
                <div style={{position:"absolute",top:10,right:10,width:20,height:20,borderRadius:"50%",background:t.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:900,boxShadow:`0 2px 8px ${t.accent}55`,animation:"ccGlowIn 0.3s ease-out both",zIndex:10}}>✓</div>
              )}

              {/* Hover ring */}
              {!isSel && <div style={{position:"absolute",inset:0,borderRadius:16,boxShadow:`inset 0 0 0 1px ${t.accent}22`,pointerEvents:"none"}}/>}

              <CityScene nm={opt.nm} dark={isDark}/>

              <div style={{padding:"8px 12px 12px",background:isSel?`${t.accent}08`:"transparent",borderTop:`1px solid ${isSel?t.accent+"22":isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)"}`,transition:"background 0.25s"}}>
                <div style={{fontSize:15,fontWeight:700,letterSpacing:".2px",transition:"color .2s",color:isSel?t.labelColor:isDark?"#e8e8e8":"#2a2a2a"}}>{opt.nm}</div>
                <div style={{fontSize:11,fontWeight:500,marginTop:2,transition:"color .2s",color:isSel?t.tagColor:isDark?"#666":"#888"}}>{opt.tg}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}