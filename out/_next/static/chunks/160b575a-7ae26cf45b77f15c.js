"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[571],{2574:function(t,i,s){s.d(i,{s5:function(){return k}});var o=s(7437),a=s(2265),e=s(1801);let n="#4fa94d",r={"aria-busy":!0,role:"progressbar"};(0,e.ZP).div`
  display: ${t=>t.$visible?"flex":"none"};
`;let h=(0,e.F4)`
12.5% {
  stroke-dasharray: ${33.98873199462888}px, ${242.776657104492}px;
  stroke-dashoffset: -${26.70543228149412}px;
}
43.75% {
  stroke-dasharray: ${84.97182998657219}px, ${242.776657104492}px;
  stroke-dashoffset: -${84.97182998657219}px;
}
100% {
  stroke-dasharray: ${2.42776657104492}px, ${242.776657104492}px;
  stroke-dashoffset: -${240.34889053344708}px;
}
`;(0,e.ZP).path`
  stroke-dasharray: ${2.42776657104492}px, ${242.776657104492};
  stroke-dashoffset: 0;
  animation: ${h} ${1.6}s linear infinite;
`;let d=[0,30,60,90,120,150,180,210,240,270,300,330],l=(0,e.F4)`
to {
   transform: rotate(360deg);
 }
`,p=(0,e.ZP).svg`
  animation: ${l} 0.75s steps(12, end) infinite;
  animation-duration: 0.75s;
`,c=(0,e.ZP).polyline`
  stroke-width: ${t=>t.width}px;
  stroke-linecap: round;

  &:nth-child(12n + 0) {
    stroke-opacity: 0.08;
  }

  &:nth-child(12n + 1) {
    stroke-opacity: 0.17;
  }

  &:nth-child(12n + 2) {
    stroke-opacity: 0.25;
  }

  &:nth-child(12n + 3) {
    stroke-opacity: 0.33;
  }

  &:nth-child(12n + 4) {
    stroke-opacity: 0.42;
  }

  &:nth-child(12n + 5) {
    stroke-opacity: 0.5;
  }

  &:nth-child(12n + 6) {
    stroke-opacity: 0.58;
  }

  &:nth-child(12n + 7) {
    stroke-opacity: 0.66;
  }

  &:nth-child(12n + 8) {
    stroke-opacity: 0.75;
  }

  &:nth-child(12n + 9) {
    stroke-opacity: 0.83;
  }

  &:nth-child(12n + 11) {
    stroke-opacity: 0.92;
  }
`,k=({strokeColor:t=n,strokeWidth:i="5",animationDuration:s="0.75",width:e="96",visible:h=!0,ariaLabel:l="rotating-lines-loading"})=>{let k=(0,a.useCallback)(()=>d.map(t=>(0,o.jsx)(c,{points:"24,12 24,4",width:i,transform:`rotate(${t}, 24, 24)`},t)),[i]);return h?(0,o.jsx)(p,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 48 48",width:e,stroke:t,speed:s,"data-testid":"rotating-lines-svg","aria-label":l,...r,children:k()}):null},f=(0,e.F4)`
to {
   stroke-dashoffset: 136;
 }
`;(0,e.ZP).polygon`
  stroke-dasharray: 17;
  animation: ${f} 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
`,(0,e.ZP).svg`
  transform-origin: 50% 65%;
`}}]);