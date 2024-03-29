// Early checking can deal with drift when under load!
// But mostly this class is just an abstraction from having to work
// Directly with Date.now()
const EARLY_CHECKING_OFFSET_MS = 1000;
const RECHECK_INTERVAL = 1000;

class Timer {
  constructor(ms, onCompleteFunction) {
    this.ms = ms;
    this.startTime = Date.now();
    this.endTime = this.startTime + this.ms;
    this.pausedAt = null;

    this._onComplete = onCompleteFunction;
    this.completed = false;

    this._checkTimeoutId = null;

    this.setCheckTimeout(this.ms - EARLY_CHECKING_OFFSET_MS);
  }

  static createToEndAt(endTimeMs, onCompleteFunction) {
    return new Timer(endTimeMs - Date.now(), onCompleteFunction);
  }

  static createWithSeconds(seconds, onCompleteFunction) {
    return new Timer(seconds * 1000, onCompleteFunction);
  }

  static createDummy() {
    let timer = new Timer(10000);
    timer.cancel();
    return timer;
  }

  setCheckTimeout(ms) {
    this._checkTimeoutId = setTimeout(() => {
      this.checkTimer();
    }, ms);
  }

  checkTimer() {
    if (Date.now() > this.endTime) {
      this.completed = true;
      this._onComplete();
    } else {
      this.setCheckTimeout(RECHECK_INTERVAL);
    }
  }

  get msRemaining() {
    return this.endTime - Date.now();
  }

  summary() {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      msRemaining: this.msRemaining,
      msTotal: this.ms,
    };
  }

  cancel() {
    this.completed = true;
    clearTimeout(this._checkTimeoutId);
  }

  pause() {
    clearTimeout(this._checkTimeoutId);
    this.pausedAt = Date.now();
  }

  finish() {
    // instantly execute oncomplete function and cancel the timer
    this.cancel();
    this.completed = true;
    this._onComplete();
  }
}

module.exports = Timer;
