import './App.css';
import Crunker from 'crunker';
import { createSilentAudio } from 'create-silent-audio';
import { useRef, useState, useEffect } from 'react';
import AudioElem from './component/AudioElem';
function App() {
  const sampleRate = 48000;

  const crunker = new Crunker({ sampleRate });
  const SilentAudio2min = { name: "Silence 2min", type: "silence", duration: 120, path: null, file: null };
  const SilentAudio1min30 = { name: "Silence 1min30", type: "silence", duration: 90, path: null, file: null };
  const instruction = { name: "delf", type: "standard", duration: null, path: '/audios/delfInstruction.mp3', file: null };
  const bip = { name: "bip", type: "standard", duration: null, path: '/audios/bip.mp3', file: null };
  const initialAudios = [
    { ...instruction, id: 0 },
    { ...bip, id: 1 },
    { ...SilentAudio2min, id: 2 },
    { ...bip, id: 3 },
    { name: "import", type: "import", duration: null, path: null, file: null, id: 4 },
    { ...bip, id: 5 },
    { ...SilentAudio1min30, id: 6 },
    { ...bip, id: 7 },
    { name: "import", type: "import", duration: null, path: null, file: null, id: 8 },
    { ...bip, id: 9 },
    { ...SilentAudio2min, id: 10 },
    { ...bip, id: 11 },
  ]
  const [audioUpToDate, setAudioUpToDate] = useState(false);
  const [audios, setAudios] = useState([...initialAudios]);
  const [currentSong, setcurrentSong] = useState(null);
  const [isplaying, setisPlaying] = useState(false)
  var audioElem = useRef('audioElem');
  var output;
  async function preview() {
    $('.loader-wrapper').addClass('is-active');
    output = await buildSource();
    console.log(output);
    setcurrentSong(output.url);
    setAudioUpToDate(true);
    $('.loader-wrapper').removeClass('is-active');
  }

  const downloadAudios = async () => {
    $('.loader-wrapper').addClass('is-active');
    //const output = await buildSource();
    await crunker.download(output.blob, "delfAudio");
    $('.loader-wrapper').removeClass('is-active');
  }

  async function buildSource() {
    console.log(audios);

    var crunkerInputs = [];
    for (let k = 0; k < audios.length; k++) {
      let audio = audios[k];
      console.log(audio);
      switch (audio.type) {
        case "silence":
          crunkerInputs.push(createSilentAudio(audio.duration, 44100));
          break;
        case "standard":
          crunkerInputs.push(audio.path);
          break;
        case "import":
          //console.log('arrayBuffer', await crunker._context.decodeAudioData(await audio.file.arrayBuffer()))
          //await crunkerInputs.push(await crunker._context.decodeAudioData(await audio.file.arrayBuffer()));
          crunkerInputs.push(audio.file);
          break;
      }
    }

    const buffers = await crunker.fetchAudio(...crunkerInputs);
    const merged = await crunker["concatAudio"](buffers);
    const output = await crunker.export(merged, 'audio/mp3');
    return output;

  }

  function deleteAudio(id) {
    console.log(audios);
    var newAudios = audios.filter((audio) => { return audio.id != id });
    console.log(newAudios)
    setAudios(newAudios);
  }

  useEffect(() => {
    setAudioUpToDate(false);
  }, [audios])

  useEffect(() => {
    if (isplaying) {
      audioElem.current.load()
      audioElem.current.play();
    }
    else {
      audioElem.current.pause();
    }
  }, [isplaying])

  const addAudios = async () => {
    setAudios([...audios, { name: "Silence 10s", type: "silence", duration: 10, path: null, file: null, id: audios.length }])
  }


  return (
    <div className="App">
      <header className="App-header">
        <div className="container m-3">

          <div className="card p-2">
            <div className="card-header">
              <div className="card-header-title">
                Faites-vous un petit sandwitch audio !
              </div>
            </div>
            <div className="card-content">
              <div className="box">
                Quelques liens utiles:
                <br />
                <a href="https://online-audio-converter.com/fr/">Récupérer l'audio d'une vidéo</a>
                <br />
                <a href="https://online-voice-recorder.com/fr/">S'enregistrer avec un micro</a>
                <br />
                <a href="https://www.soundjay.com/">Bruitages et bruit de fond</a>
              </div>
              {audios.map((audio, index) => { return <AudioElem key={audio.id} deleteAudio={deleteAudio} setAudios={setAudios} audios={audios} id={audio.id} /> })}
              <hr />
              <button className="button" onClick={addAudios}>
                Ajouter Audio
              </button>
            </div>

            <div className="card-footer" style={{ position: 'relative' }}>
              <div className="card-footer-item loader-wrapper">
                <div className="loader is-loading"></div>
              </div>
              <div className="card-footer-item">
                <audio ref={audioElem} className={audioUpToDate ? "" : "hidden"} src={currentSong} controls></audio>
                <button className={`${audioUpToDate ? "hidden" : ""} button is-primary`} onClick={preview}>
                  préécouter
                </button>
              </div>
              <button className={`${audioUpToDate ? "" : "hidden"} card-footer-item button is-primary`} style={{ margin: "20px" }} onClick={downloadAudios}>
                Télécharger
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
