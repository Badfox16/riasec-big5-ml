// ─── SVG Hexagonal Radar Chart ────────────────────────────────────────────────

import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle } from 'react-native-svg';
import { useColors } from '../theme';
import { DimensionScore } from '../types';

interface Props {
  scores: DimensionScore[];
  size?: number;
}

const AXES: { key: string; label: string; angle: number }[] = [
  { key: 'R', label: 'R', angle: -90 },
  { key: 'I', label: 'I', angle: -30 },
  { key: 'A', label: 'A', angle:  30 },
  { key: 'S', label: 'S', angle:  90 },
  { key: 'E', label: 'E', angle: 150 },
  { key: 'C', label: 'C', angle: 210 },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  return { x: cx + r * Math.cos(toRad(angleDeg)), y: cy + r * Math.sin(toRad(angleDeg)) };
}

export default function RadarChart({ scores, size = 260 }: Props) {
  const Colors = useColors();
  const cx = size / 2, cy = size / 2;
  const maxR = size * 0.38;
  const labelR = maxR + 18;
  const levels = [1, 2, 3, 4, 5];

  const scoreMap: Record<string, number> = {};
  scores.forEach(s => { scoreMap[s.letter] = s.score; });

  const dataPoints = AXES.map(({ key, angle }) => {
    const val = scoreMap[key] ?? 1;
    return polarToXY(cx, cy, (val / 5) * maxR, angle);
  });
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const gridPolygons = levels.map(level => {
    const r = (level / 5) * maxR;
    return AXES.map(({ angle }) => {
      const p = polarToXY(cx, cy, r, angle);
      return `${p.x},${p.y}`;
    }).join(' ');
  });

  return (
    <View>
      <Svg width={size} height={size}>
        {gridPolygons.map((pts, i) => (
          <Polygon key={`grid-${i}`} points={pts} fill="none" stroke={Colors.border} strokeWidth={1} />
        ))}
        {AXES.map(({ key, angle }) => {
          const outer = polarToXY(cx, cy, maxR, angle);
          return <Line key={`axis-${key}`} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke={Colors.border} strokeWidth={1} />;
        })}
        <Polygon points={dataPolygon} fill={Colors.primary + '33'} stroke={Colors.primary} strokeWidth={2.5} strokeLinejoin="round" />
        {dataPoints.map((p, i) => (
          <Circle key={`dot-${i}`} cx={p.x} cy={p.y} r={4} fill={Colors.riasec[AXES[i].key]} stroke={Colors.card} strokeWidth={1.5} />
        ))}
        {AXES.map(({ key, angle }) => {
          const pos = polarToXY(cx, cy, labelR, angle);
          return (
            <SvgText key={`label-${key}`} x={pos.x} y={pos.y + 4} fontSize={13} fontWeight="700" fill={Colors.riasec[key]} textAnchor="middle">
              {key}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
