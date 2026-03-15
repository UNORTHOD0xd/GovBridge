import { useState } from "react";

interface JamaicaMapProps {
  data: Record<string, number>;
}

const PARISHES: Record<string, string> = {
  "Kingston": "M 370,280 L 385,270 L 395,275 L 400,285 L 395,295 L 380,298 L 370,290 Z",
  "St. Andrew": "M 340,250 L 370,240 L 390,250 L 395,275 L 385,270 L 370,280 L 370,290 L 355,285 L 340,270 Z",
  "St. Thomas": "M 395,250 L 430,235 L 460,240 L 470,255 L 455,270 L 425,280 L 400,285 L 395,275 L 390,250 Z",
  "Portland": "M 400,200 L 435,185 L 465,195 L 470,220 L 460,240 L 430,235 L 395,250 L 390,230 Z",
  "St. Mary": "M 340,200 L 370,185 L 400,200 L 390,230 L 370,240 L 340,250 L 335,225 Z",
  "St. Ann": "M 270,185 L 310,170 L 340,180 L 340,200 L 335,225 L 340,250 L 310,245 L 280,235 L 265,215 Z",
  "Trelawny": "M 210,190 L 240,175 L 270,185 L 265,215 L 250,230 L 225,225 L 210,210 Z",
  "St. James": "M 155,200 L 185,185 L 210,190 L 210,210 L 225,225 L 210,240 L 185,235 L 165,220 Z",
  "Hanover": "M 115,210 L 140,195 L 155,200 L 165,220 L 155,235 L 130,240 L 115,225 Z",
  "Westmoreland": "M 90,240 L 115,225 L 130,240 L 155,235 L 165,250 L 155,275 L 130,285 L 100,275 L 85,260 Z",
  "St. Elizabeth": "M 155,275 L 165,250 L 185,235 L 210,240 L 225,260 L 220,280 L 195,295 L 170,295 Z",
  "Manchester": "M 225,225 L 250,230 L 265,215 L 280,235 L 290,255 L 275,270 L 250,275 L 225,260 L 220,240 Z",
  "Clarendon": "M 290,255 L 310,245 L 335,255 L 340,270 L 330,290 L 305,295 L 280,285 L 275,270 Z",
  "St. Catherine": "M 335,255 L 340,250 L 355,285 L 370,290 L 380,298 L 365,310 L 335,305 L 310,295 L 330,290 L 340,270 Z",
};

function getColor(value: number, max: number): string {
  if (max === 0) return "#dcfce7";
  const ratio = value / max;
  if (ratio > 0.75) return "#15803d";
  if (ratio > 0.5) return "#22c55e";
  if (ratio > 0.25) return "#4ade80";
  return "#86efac";
}


export default function JamaicaMap({ data }: JamaicaMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const max = Math.max(...Object.values(data), 1);

  const legendSteps = [
    { label: "Low", color: "#86efac" },
    { label: "", color: "#4ade80" },
    { label: "", color: "#22c55e" },
    { label: "High", color: "#15803d" },
  ];

  return (
    <div className="relative">
      <svg
        viewBox="60 160 440 170"
        className="w-full h-auto"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        {Object.entries(PARISHES).map(([name, path]) => {
          const count = data[name] || 0;
          return (
            <path
              key={name}
              d={path}
              fill={getColor(count, max)}
              stroke="#166534"
              strokeWidth="1.5"
              className="cursor-pointer transition-opacity duration-200"
              opacity={hovered && hovered !== name ? 0.6 : 1}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </svg>

      {hovered && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-10"
          style={{
            left: mousePos.x + 12,
            top: mousePos.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <p className="font-semibold">{hovered}</p>
          <p>{data[hovered] || 0} requests</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-1 mt-3">
        <span className="text-xs text-gray-500 mr-1">Volume:</span>
        {legendSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: step.color }} />
            {step.label && <span className="text-xs text-gray-500">{step.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
