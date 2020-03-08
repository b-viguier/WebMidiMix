Object.defineProperty(Vue.prototype, 'WebMidi', { value: WebMidi });
Object.defineProperty(Vue.prototype, 'soundbanks', { value: soundbanks });

Vue.component('midi-track', {
    template: '#midi-track-template',
    props: {
        channel: Number,
        soundbank: Object
    },
    data: function () {
        return {
            volume: 100,
            instrument: {}
        }
    },
    watch: {
        volume(volume) {
            this.$emit('control-changed', {controller: 'volumecoarse', value: volume, channel: this.channel});
        },
        instrument(instrument) {
            this.$emit('control-changed', {controller: 'bankselectcoarse', value: instrument.cc00, channel: this.channel});
            this.$emit('control-changed', {controller: 'bankselectfine', value: instrument.cc32, channel: this.channel});
            this.$emit('program-changed', {program: instrument.pc, channel: this.channel});
        }
    },
    methods: {

    }
});

var app = new Vue({
    el: '#webmidimix',
    data:  {
        errorMessage: null,
        selectedMidiOutputId: null,
        midiOutput: null,
        currentSoundBank: null,
        soundbanks: {},
    },
    created: function () {
        this.soundbanks = Object.assign({}, this.soundbanks, soundbanks);
        this.currentSoundBank = Object.values(this.soundbanks)[0];

        WebMidi.enable((errorMessage) => {

            if (errorMessage) {
                this.errorMessage = '' + errorMessage;
                console.log(errorMessage);
                return;
            }

            if(WebMidi.outputs.length) {
                this.selectedMidiOutputId = WebMidi.outputs[0].id;
            }
        });
    },
    watch: {
        selectedMidiOutputId(newMidiOutputId) {
            this.midiOutput = WebMidi.getOutputById(newMidiOutputId);
        }
    },
    computed: {
    },
    methods: {
        onControlChanged(event) {
            this.midiOutput.sendControlChange(event.controller, event.value, event.channel);
        },
        onProgramChanged(event) {
            this.midiOutput.sendProgramChange(event.program, event.channel);
        }
    }
});