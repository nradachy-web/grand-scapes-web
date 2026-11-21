/* The interactive panels are built for the ink plane, whatever the content asks. */
const PANELS = ['stripes', 'seasons', 'bed', 'reveal'];
export const planeOf = (b: { type: string; plane: string }) => (PANELS.includes(b.type) ? 'ink' : b.plane) as 'ink' | 'paper' | 'white';
