export const DIAMOND_SHAPES = [
  { id: 'HALF_MOON', name: 'Half Moon', icon: '/shapes/half-moon.svg' },
  { id: 'BAGUETTE', name: 'Baguette', icon: '/shapes/baguette.svg' },
  { id: 'TRIANGLE', name: 'Triangle', icon: '/shapes/triangle.svg' },
  { id: 'EUROPEAN', name: 'European', icon: '/shapes/european.svg' },
  { id: 'OLD_MINER', name: 'Old Miner', icon: '/shapes/old-miner.svg' },
  { id: 'BRIOLETTE', name: 'Briolette', icon: '/shapes/briolette.svg' },
  { id: 'SHIELD_CUT', name: 'Shield Cut', icon: '/shapes/shield-cut.svg' },
  { id: 'STAR_CUT', name: 'Star Cut', icon: '/shapes/star-cut.svg' },
  { id: 'BULLET_CUT', name: 'Bullet Cut', icon: '/shapes/bullet-cut.svg' },
  { id: 'OCTAGON', name: 'Octagon', icon: '/shapes/octagon.svg' },
  { id: 'HEXAGON', name: 'Hexagon', icon: '/shapes/hexagon.svg' },
  { id: 'PENTAGON', name: 'Pentagon', icon: '/shapes/pentagon.svg' },
  { id: 'PORTRAIT', name: 'Portrait', icon: '/shapes/portrait.svg' },
  { id: 'KITE', name: 'Kite', icon: '/shapes/kite.svg' },
  { id: 'TRAPEZOID', name: 'Trapezoid', icon: '/shapes/trapezoid.svg' },
  { id: 'PEAR_ROSE', name: 'Pear Rose', icon: '/shapes/pear-rose.svg' },
  { id: 'ROUGH', name: 'Rough', icon: '/shapes/rough.svg' },
  { id: 'SQ_RADIANT', name: 'Square Radiant', icon: '/shapes/sq-radiant.svg' },
  { id: 'OLD_EUROPEAN', name: 'Old European', icon: '/shapes/old-european.svg' },
  { id: 'LONG_KITE', name: 'Long Kite', icon: '/shapes/long-kite.svg' },
  { id: 'PEAR_ROSE_CUT', name: 'Pear Rose Cut', icon: '/shapes/pear-rose-cut.svg' },
  { id: 'CARRE', name: 'Carre', icon: '/shapes/carre.svg' },
  { id: 'LONG', name: 'Long', icon: '/shapes/long.svg' },
  { id: 'HEX_STEP_CUT', name: 'Hex Step Cut', icon: '/shapes/hex-step-cut.svg' },
  { id: 'EMERALAD', name: 'Emerald', icon: '/shapes/emerald.svg' },
  { id: 'CRISSCUT', name: 'Crisscut', icon: '/shapes/crisscut.svg' },
  { id: 'CRSC', name: 'CRSC', icon: '/shapes/crsc.svg' },
  { id: 'ROSE_CUT', name: 'Rose Cut', icon: '/shapes/rose-cut.svg' },
  { id: 'OLD_EUROPEAN_LONG_CUSHION', name: 'Old European Long Cushion', icon: '/shapes/old-european-long-cushion.svg' },
  { id: 'OVAL_ROSE_CUT', name: 'Oval Rose Cut', icon: '/shapes/oval-rose-cut.svg' },
  { id: 'TRAPEZE', name: 'Trapeze', icon: '/shapes/trapeze.svg' },
  { id: 'OCTAGONAL', name: 'Octagonal', icon: '/shapes/octagonal.svg' },
  { id: 'PORTUGUESE', name: 'Portuguese', icon: '/shapes/portuguese.svg' }
] as const;

export type DiamondShape = typeof DIAMOND_SHAPES[number]['id'];














