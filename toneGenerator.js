/*jslint devel: true, browser: true, nomen: true, maxerr: 50, indent: 4 */

(function (global) {
    "use strict";

    var ToneGenerator = function () {

    };

    ToneGenerator.prototype.init = function () {
        var oscillator,
            amp;

        if (global.context) {
            oscillator = global.context.createOscillator();
            global.fixOscillator(oscillator);
            oscillator.frequency.value = 440;
            amp = global.context.createGainNode();
            amp.gain.value = 0;

            // Connect ooscillator to amp and amp to the mixer of the context.
            // This is like connecting cables between jacks on a modular synth.
            oscillator.connect(amp);
            amp.connect(global.context.destination);
            oscillator.start(0);

            this._context = global.context;
            this._amp = amp;
            this._oscillator = oscillator;

        }

    };

    ToneGenerator.prototype.startTone = function (frequency) {
        var context = this._context,
            amp = this._amp,
            oscillator = this._oscillator,
            now = context.currentTime;

        oscillator.frequency.setValueAtTime(frequency, now);

        // Ramp up the gain so we can hear the sound.
        // We can ramp smoothly to the desired value.
        // First we should cancel any previous scheduled events that might interfere.
        amp.gain.cancelScheduledValues(now);
        // Anchor beginning of ramp at current value.
        amp.gain.setValueAtTime(amp.gain.value, now);
        amp.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.1);
    };

    ToneGenerator.prototype.stopTone = function () {
        var context = this._context,
            amp = this._amp,
            now = context.currentTime;

        amp.gain.cancelScheduledValues(now);
        amp.gain.setValueAtTime(amp.gain.value, now);
        amp.gain.linearRampToValueAtTime(0.0, context.currentTime + 1.0);
    };

    global.ToneGenerator = ToneGenerator;
}(this));
