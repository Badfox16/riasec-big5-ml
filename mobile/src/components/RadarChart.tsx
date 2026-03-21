// ─── SVG Hexagonal Radar Chart ────────────────────────────────────────────────
// 6 axes: R (top), I (top-right), A (bottom-right), S (bottom), E (bottom-left), C (top-left)

import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle } from 'react-native-svg';
import { Colors } from '../theme';
import { DimensionScore } from '../types';

interface Props {
  scores: DimensionScore[];
  size?: number;
}

// Axis angles (degrees) for a flat-top hexagon, starting from top, clockwise
const AXES: { key: string; label: string; angle: number }[] = [
  { key: 'R', label: 'R',  angle: -90  },
  { key: 'I', label: 'I',  angle: -30  },
  { key: 'A', label: 'A',  angle:  30  },
  { key: 'S', label: 'S',  angle:  90  },
  { key: 'E', label: 'E',  angle: 150  },
  { key: 'C', label: 'C',  angle: 210  },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  return {
    x: cx + r * Math.cos(toRad(angleDeg)),
    y: cy + r * Math.sin(toRad(angleDeg)),
  };
}

export default function RadarChart({ scores, size = 260 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const labelR = maxR + 18;
  const levels = [1, 2, 3, 4, 5];

  // Build score map keyed by letter
  const scoreMap: Record<string, number> = {};
  scores.forEach((s) => {
    scoreMap[s.letter] = s.score;
  });

  // Data polygon points
  const dataPoints = AXES.map(({ key, angle }) => {
    const val = scoreMap[key] ?? 1;
    const r = (val / 5) * maxR;
    return polarToXY(cx, cy, r, angle);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Grid polygon for each level
  const gridPolygons = levels.map((level) => {
    const r = (level / 5) * maxR;
    const pts = AXES.map(({ angle }) => {
      const p = polarToXY(cx, cy, r, angle);
      return `${p.x},${p.y}`;
    });
    return pts.join(' ');
  });

  return (
    <View>
      <Svg width={size} height={size}>
        {/* Grid rings */}
        {gridPolygons.map((pts, i) => (
          <Polygon
            key={`grid-${i}`}
            points={pts}
            fill="none"
            stroke={Colors.border}
            strokeWidth={1}
          />
        ))}

        {/* Axis lines from center */}
        {AXES.map(({ key, angle }) => {
          const outer = polarToXY(cx, cy, maxR, angle);
          return (
            <Line
              key={`axis-${key}`}
              x1={cx} y1={cy}
              x2={outer.x} y2={outer.y}
              stroke={Colors.border}
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <Polygon
          points={dataPolygon}
          fill={Colors.primary + '33'}
          stroke={Colors.primary}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Data dots */}
        {dataPoints.map((p, i) => (
          <Circle
            key={`dot-${i}`}
            cx={p.x} cy={p.y}
            r={4}
            fill={Colors.riasec[AXES[i].key]}
            stroke="#fff"
            strokeWidth={1.5}
          />
        ))}

        {/* Axis labels */}
        {AXES.map(({ key, angle }) => {
          const pos = polarToXY(cx, cy, labelR, angle);
          return (
            <SvgText
              key={`label-${key}`}
              x={pos.x} y={pos.y + 4}
              fontSize={13}
              fontWeight="700"
              fill={Colors.riasec[key]}
              textAnchor="middle"
            >
              {key}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
