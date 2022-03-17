import logo from './logo.svg';
import './App.css';
import Crunker from 'crunker';
import { createSilentAudio } from 'create-silent-audio';
import { useRef, useState, useEffect } from 'react';
import AudioElem from './component/AudioElem';
function App() {
  const sampleRate = 48000;

  const crunker = new Crunker({ sampleRate });
  const SilentAudio = { name: "Silence 10s", type: "silence", duration: 10, path: null, file: null };
  const initialAudios = [
    { name: "audio2", type: "standard", duration: null, path: 'audios/2.mp3', file: null },
    SilentAudio,
  ]
  const [audioUpToDate, setAudioUpToDate] = useState(false);
  const [audios, setAudios] = useState(initialAudios);
  const [currentSong, setcurrentSong] = useState(null);
  const [isplaying, setisPlaying] = useState(false)
  var audioElem = useRef('audioElem');

  async function preview() {
    const output = await buildSource();
    console.log(output);
    setcurrentSong(output.url);
    setAudioUpToDate(true);
  }

  const downloadAudios = async () => {
    const output = await buildSource();
    await crunker.download(output.blob, "delfAudio");
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
    setAudios([...audios, SilentAudio])
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
              {audios.map((audio, index) => { return <AudioElem key={index} setAudios={setAudios} audios={audios} index={index} /> })}
              <hr />
              <button className="button" onClick={addAudios}>
                Ajouter Audio
              </button>
            </div>

            <div className="card-footer">
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
