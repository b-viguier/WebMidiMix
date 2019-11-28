Object.defineProperty(Vue.prototype, 'WebMidi', { value: WebMidi });

Vue.component('midi-track', {
    template: '#midi-track-template',
    props: {
        channel: Number
    },
    data: function () {
        return {
            volume: 100
        }
    },
    watch: {
        volume(volume) {
            this.$emit('control-changed', {controller: 'volumecoarse', value: volume, channel: this.channel});
        }
    },
    methods: {

    }
});

var app = new Vue({
    el: '#webmidimix',
    props: {
    },
    data:  {
        errorMessage: null,
        selectedMidiOutputId: null,
        midiOutput: null
    },
    created: function () {

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
        }
    }
});