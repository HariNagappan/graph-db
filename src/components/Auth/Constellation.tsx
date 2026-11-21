const CX = 260;
const CY = 260;

const RINGS = [
    {r: 74, n: 8, size: 4.6, fill: "#151033", stroke: "rgba(142,111,255,0.85)", width: 1.3},
    {r: 124, n: 11, size: 3.2, fill: "#08131c", stroke: "rgba(53,214,222,0.6)", width: 1},
    {r: 172, n: 8, size: 2.8, fill: "#0d0b1a", stroke: "rgba(185,168,255,0.42)", width: 1},
];

/** A deterministic constellation: three orbits, which is the product's story in one graphic. */
export default function Constellation({animated = true}: {animated?: boolean}) {
    const positions = RINGS.map((ring, ringIndex) =>
        Array.from({length: ring.n}, (_, i) => {
            const angle = -Math.PI / 2 + (i / ring.n) * Math.PI * 2 + ringIndex * 0.34;
            return {
                x: CX + Math.cos(angle) * ring.r,
                y: CY + Math.sin(angle) * ring.r,
            };
        })
    );

    return (
        <svg className="gn-const" viewBox="0 0 520 520" fill="none" aria-hidden="true" focusable="false">
            <defs>
                <radialGradient id="gn-const-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6c4bf2" stopOpacity="0.2"/>
                    <stop offset="55%" stopColor="#6c4bf2" stopOpacity="0.06"/>
                    <stop offset="100%" stopColor="#6c4bf2" stopOpacity="0"/>
                </radialGradient>
            </defs>

            <circle cx={CX} cy={CY} r={225} fill="url(#gn-const-glow)"/>
            <circle cx={CX} cy={CY} r={74} stroke="rgba(142,111,255,0.30)" strokeWidth={1}/>
            <circle cx={CX} cy={CY} r={124} stroke="rgba(53,214,222,0.20)" strokeWidth={1} strokeDasharray="2 7"/>
            <circle cx={CX} cy={CY} r={172} stroke="rgba(185,168,255,0.16)" strokeWidth={1} strokeDasharray="1 8"/>

            {positions[0].map((p, i) => (
                <line
                    key={`spoke-${i}`}
                    x1={CX}
                    y1={CY}
                    x2={p.x.toFixed(1)}
                    y2={p.y.toFixed(1)}
                    stroke="rgba(142,111,255,0.30)"
                />
            ))}

            {[0, 1].map((ringIndex) => {
                const from = positions[ringIndex];
                const to = positions[ringIndex + 1];
                return from.flatMap((p, i) => {
                    const j = Math.round((i / from.length) * to.length) % to.length;
                    return [j, (j + 1) % to.length].map((k) => {
                        const q = to[k];
                        return (
                            <line
                                key={`tie-${ringIndex}-${i}-${k}`}
                                x1={p.x.toFixed(1)}
                                y1={p.y.toFixed(1)}
                                x2={q.x.toFixed(1)}
                                y2={q.y.toFixed(1)}
                                stroke={ringIndex === 0 ? "rgba(53,214,222,0.30)" : "rgba(185,168,255,0.20)"}
                                strokeDasharray="2 4"
                            />
                        );
                    });
                });
            })}

            {positions.map((ring, ringIndex) =>
                ring.map((p, i) => (
                    <circle
                        key={`node-${ringIndex}-${i}`}
                        cx={p.x.toFixed(1)}
                        cy={p.y.toFixed(1)}
                        r={RINGS[ringIndex].size}
                        fill={RINGS[ringIndex].fill}
                        stroke={RINGS[ringIndex].stroke}
                        strokeWidth={RINGS[ringIndex].width}
                        style={animated ? {
                            animation: `gn-pulse 5s ease-in-out ${(ringIndex * 0.4 + i * 0.13).toFixed(2)}s infinite`,
                        } : undefined}
                    />
                ))
            )}

            <circle cx={CX} cy={CY} r={19} fill="rgba(142,111,255,0.16)"/>
            <circle cx={CX} cy={CY} r={10} fill="#6c4bf2" stroke="rgba(200,186,255,0.9)" strokeWidth={1.4}/>
        </svg>
    );
}
