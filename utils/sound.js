// utils/sound.js

class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playTone(freq, type = "sine", duration = 0.2, gainValue = 0.1) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        this.ctx.currentTime + duration,
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play error:", e);
    }
  }

  // Звук правильного ответа (мажорный аккорд вверх)
  playCorrect() {
    this.playTone(523.25, "triangle", 0.15, 0.15); // C5
    setTimeout(() => this.playTone(659.25, "triangle", 0.15, 0.15), 100); // E5
    setTimeout(() => this.playTone(783.99, "triangle", 0.3, 0.15), 200); // G5
  }

  // Звук ошибки (низкий нисходящий сигнал)
  playWrong() {
    this.playTone(220, "sawtooth", 0.2, 0.15);
    setTimeout(() => this.playTone(180, "sawtooth", 0.35, 0.15), 150);
  }

  // Звук Кота в мешке / Аукциона (фанфары)
  playSpecial() {
    this.playTone(440, "sine", 0.1, 0.15);
    setTimeout(() => this.playTone(554.37, "sine", 0.1, 0.15), 80);
    setTimeout(() => this.playTone(659.25, "sine", 0.1, 0.15), 160);
    setTimeout(() => this.playTone(880, "sine", 0.4, 0.2), 240);
  }

  // Звук клика / выбора ячейки
  playSelect() {
    this.playTone(600, "sine", 0.08, 0.1);
  }

  // Звук окончания времени таймера
  playTimeout() {
    this.playTone(300, "square", 0.15, 0.1);
    setTimeout(() => this.playTone(300, "square", 0.15, 0.1), 200);
    setTimeout(() => this.playTone(300, "square", 0.4, 0.15), 400);
  }
}

export const sounds = new SoundEffects();
