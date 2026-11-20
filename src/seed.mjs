export const seedLifecycle = Object.freeze({phase:'seed',completedCycles:0,requiredCycles:2});
export function isReadyForFirstCycle(state=seedLifecycle){return state.phase==='seed' && state.completedCycles===0;}
