let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function note(
  ac: AudioContext,
  freq: number,
  start: number,
  duration: number,
  volume = 0.28,
  type: OscillatorType = 'sine',
) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = type
  osc.frequency.value = freq
  const t = ac.currentTime + start
  gain.gain.setValueAtTime(volume, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.01)
}

/** 軽いタップ音（ボタン押下・画面遷移） */
export function playTap() {
  try {
    const ac = getCtx()
    note(ac, 880, 0, 0.08, 0.15, 'sine')
  } catch {}
}

/** スワイプ YES（明るい上昇チャイム） */
export function playYes() {
  try {
    const ac = getCtx()
    note(ac, 523.25, 0,    0.18, 0.3, 'sine')  // C5
    note(ac, 659.25, 0.1,  0.22, 0.3, 'sine')  // E5
    note(ac, 783.99, 0.2,  0.3,  0.25, 'sine') // G5
  } catch {}
}

/** スワイプ NO（低めのポン音） */
export function playNo() {
  try {
    const ac = getCtx()
    note(ac, 220, 0,   0.12, 0.22, 'triangle')
    note(ac, 180, 0.07, 0.18, 0.15, 'triangle')
  } catch {}
}

/** マッチ（小さなファンファーレ） */
export function playMatch() {
  try {
    const ac = getCtx()
    // C5 E5 G5 C6 arpeggio
    const seq = [523.25, 659.25, 783.99, 1046.5]
    seq.forEach((freq, i) => {
      note(ac, freq, i * 0.1, 0.3, 0.28, 'sine')
    })
    // 最後に和音
    note(ac, 523.25, 0.45, 0.5, 0.18, 'sine')
    note(ac, 659.25, 0.45, 0.5, 0.18, 'sine')
    note(ac, 783.99, 0.45, 0.5, 0.18, 'sine')
  } catch {}
}
