const SilentAudio2min = { name: "Silence 2min", type: "silence", duration: 120, path: null, file: null };
const SilentAudio1min30 = { name: "Silence 1min30", type: "silence", duration: 90, path: null, file: null };
const instruction = { name: "delf", type: "standard", duration: null, path: '/audios/delfInstruction.mp3', file: null };
const fin = { name: "fin delf", type: "standard", duration: null, path: '/audios/fin.mp3', file: null };
const bip = { name: "bip", type: "standard", duration: null, path: '/audios/bip.mp3', file: null };
export const initialAudios = {
    0: { ...instruction, id: 0 },
    1: { ...bip, id: 1 },
    2: { ...SilentAudio2min, id: 2 },
    3: { ...bip, id: 3 },
    4: { name: "import", type: "import", duration: null, path: null, file: null, id: 4 },
    5: { ...bip, id: 5 },
    6: { ...SilentAudio1min30, id: 6 },
    7: { ...bip, id: 7 },
    8: { name: "import", type: "import", duration: null, path: null, file: null, id: 8 },
    9: { ...bip, id: 9 },
    10: { ...SilentAudio2min, id: 10 },
    11: { ...fin, id: 11 },
}
export const initialAudioOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];