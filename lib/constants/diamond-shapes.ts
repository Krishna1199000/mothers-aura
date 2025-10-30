// Main 12 diamond shapes with images
export const MAIN_DIAMOND_SHAPES = [
  { id: 'ROUND', name: 'Round', image: '/Round.jpg' },
  { id: 'OVAL', name: 'Oval', image: '/Oval.jpg' },
  { id: 'PEAR', name: 'Pear', image: '/pear.jpg' },
  { id: 'MARQUISE', name: 'Marquise', image: '/marquise.jpg' },
  { id: 'HEART', name: 'Heart', image: '/Heart.jpg' },
  { id: 'EMERALD', name: 'Emerald', image: '/emerald.jpg' },
  { id: 'CUSHION', name: 'Cushion', image: '/cushion.jpg' },
  { id: 'PRINCESS', name: 'Princess', image: '/princess.jpg' },
  { id: 'RADIANT', name: 'Radiant', image: '/radiant.jpg' },
  { id: 'ASSCHER', name: 'Asscher', image: '/assher.jpg' },
  { id: 'TRIANGLE', name: 'Triangle', image: '/triangle.png' },
  { id: 'BAGUETTE', name: 'Baguette', image: '/baguette.jpg' },
  { id: 'OTHERS', name: 'Others', image: '/others.jpg' }
] as const;

// Additional shapes under Others
export const OTHER_DIAMOND_SHAPES = [
  { id: 'HALF_MOON', name: 'Half Moon', image: '/others.jpg' },
  { id: 'EUROPEAN', name: 'European', image: '/others.jpg' },
  { id: 'OLD_MINER', name: 'Old Miner', image: '/others.jpg' },
  { id: 'BRIOLETTE', name: 'Briolette', image: '/others.jpg' },
  { id: 'SHIELD_CUT', name: 'Shield Cut', image: '/others.jpg' },
  { id: 'STAR_CUT', name: 'Star Cut', image: '/others.jpg' },
  { id: 'BULLET_CUT', name: 'Bullet Cut', image: '/others.jpg' },
  { id: 'OCTAGON', name: 'Octagon', image: '/others.jpg' },
  { id: 'HEXAGON', name: 'Hexagon', image: '/others.jpg' },
  { id: 'PENTAGON', name: 'Pentagon', image: '/others.jpg' },
  { id: 'PORTRAIT', name: 'Portrait', image: '/others.jpg' },
  { id: 'KITE', name: 'Kite', image: '/others.jpg' },
  { id: 'TRAPEZOID', name: 'Trapezoid', image: '/others.jpg' },
  { id: 'PEAR_ROSE', name: 'Pear Rose', image: '/others.jpg' },
  { id: 'ROUGH', name: 'Rough', image: '/others.jpg' },
  { id: 'SQ_RADIANT', name: 'SQ Radiant', image: '/others.jpg' },
  { id: 'OLD_EUROPEAN', name: 'Old European', image: '/others.jpg' },
  { id: 'LONG_KITE', name: 'Long Kite', image: '/others.jpg' },
  { id: 'PEAR_ROSE_CUT', name: 'Pear Rose Cut', image: '/others.jpg' },
  { id: 'CARRE', name: 'Carre', image: '/others.jpg' },
  { id: 'LONG', name: 'Long', image: '/others.jpg' },
  { id: 'HEX_STEP_CUT', name: 'Hexstep Cut', image: '/others.jpg' },
  { id: 'CRISSCUIT', name: 'Crisscuit', image: '/others.jpg' },
  { id: 'CRSC', name: 'Crsc', image: '/others.jpg' },
  { id: 'ROSE_CUT', name: 'Rose Cut', image: '/others.jpg' },
  { id: 'OLD_EUROPEAN_LONG_CUSHION', name: 'Old European Long Cushion', image: '/others.jpg' },
  { id: 'OVAL_ROSE_CUT', name: 'Oval Rose Cut', image: '/others.jpg' },
  { id: 'TRAPEZE', name: 'Trapeze', image: '/others.jpg' },
  { id: 'OCTAGONAL', name: 'Octagonal', image: '/others.jpg' },
  { id: 'PORTUGUESE', name: 'Portuguese', image: '/others.jpg' }
] as const;

// Combined for backward compatibility
export const DIAMOND_SHAPES = [...MAIN_DIAMOND_SHAPES, ...OTHER_DIAMOND_SHAPES] as const;

export type DiamondShape = typeof DIAMOND_SHAPES[number]['id'];





















