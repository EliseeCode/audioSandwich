import './App.css';
import Crunker from 'crunker';
import { createSilentAudio } from 'create-silent-audio';
import { useRef, useState, useEffect } from 'react';
import AudioElem from './component/AudioElem';
import { initialAudioOrder, initialAudios } from './component/initialData';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
function App() {
  const sampleRate = 48000;

  const crunker = new Crunker({ sampleRate });

  const [audios, setAudios] = useState(initialAudios);
  const [audioOrder, setAudioOrder] = useState(initialAudioOrder);

  const [audioUpToDate, setAudioUpToDate] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [currentSong, setcurrentSong] = useState(null);
  const [isplaying, setisPlaying] = useState(false);
  const [nextId, setNextId] = useState(null);
  const [output, setOutput] = useState(null);
  var audioElem = useRef('audioElem');


  async function preview() {
    setIsLoadingPreview(true);
  }
  useEffect(async () => {
    if (isLoadingPreview) {
      setOutput(await buildSource());
    }
  }, [isLoadingPreview])

  useEffect(() => {
    if (output != null) {
      setcurrentSong(output.url);
      setAudioUpToDate(true);
      setIsLoadingPreview(false);
    }
  }, [output])


  const downloadAudios = async () => {
    $('.loader-wrapper').addClass('is-active');
    //output = await buildSource();
    await crunker.download(output.blob, "yourAudio");
    $('.loader-wrapper').removeClass('is-active');
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function buildSource() {
    try {
      var crunkerInputs = [];
      for (let k = 0; k < audioOrder.length; k++) {
        let audio = audios[audioOrder[k]];
        console.log(audio);
        switch (audio.type) {
          case "silence":
            crunkerInputs.push(await createSilentAudio(audio.duration, 44100));
            break;
          case "standard":
            crunkerInputs.push(audio.path);
            break;
          case "record":
            crunkerInputs.push(audio.path);
            break;
          case "import":
            //console.log('arrayBuffer', await crunker._context.decodeAudioData(await audio.file.arrayBuffer()))
            //await crunkerInputs.push(await crunker._context.decodeAudioData(await audio.file.arrayBuffer()));
            if (audio.file != null) {
              crunkerInputs.push(audio.file);
            }
            break;
        }
        setProgress(k * 90 / audioOrder.length);
        await sleep(1);
        console.log(k * 90 / audioOrder.length);
      }

      const buffers = await crunker.fetchAudio(...crunkerInputs);
      setProgress(95);
      await sleep(1);
      const merged = await crunker["concatAudio"](buffers);
      setProgress(99);
      await sleep(1);
      return await crunker.export(merged, 'audio/mp3');
    }
    catch (error) {
      console.log(error);
      setIsLoadingPreview(true);
    }
  }

  function deleteAudio(id) {
    var newAudioOrder = audioOrder.filter((AudioId) => { return AudioId != id });

    setAudioOrder(newAudioOrder);
  }


  useEffect(() => {
    if (audioUpToDate) {
      setNextId(Math.max(...audioOrder) + 1);
      setAudioUpToDate(false);
    }
  }, [audios, audioOrder])

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
    setAudios({ ...audios, [nextId]: { name: "Silence 10s", type: "silence", duration: 10, path: null, file: null, id: nextId } });
    setAudioOrder([...audioOrder, nextId]);
  }

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.index == destination.index) { return; }

    const srcId = audioOrder[source.index];

    const newAudioOrder = Array.from(audioOrder);
    newAudioOrder.splice(source.index, 1);
    newAudioOrder.splice(destination.index, 0, srcId);
    setAudioOrder([...newAudioOrder])
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="container m-3">

          <div className="card p-2">
            <div className="card-header">
              <div className="card-header-title">
                Faites-vous un petit sandwich audio !
              </div>
            </div>
            <div className="card-content">
              <div className="box">
                <div className="content" style={{ fontSize: '0.7em' }}>
                  Quelques liens utiles:
                  <br />
                  <a href="https://online-audio-converter.com/fr/">Récupérer l'audio d'une vidéo</a>
                  <br />
                  <a href="https://mp3y.download/fr/easy-youtube-convert">Récupérer l'audio d'une vidéo Youtube</a>
                  <br />
                  <a href="https://online-voice-recorder.com/fr/">S'enregistrer avec un micro</a>
                  <br />
                  <a href="https://www.soundjay.com/">Bruitages et bruit de fond</a>
                </div>
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"droppable"}>
                  {
                    (provided) => {
                      console.log(provided);
                      return (<div ref={provided.innerRef} {...provided.droppableProps}>{
                        audioOrder.map((audioId, index) => {
                          return <AudioElem key={audioId} index={index} deleteAudio={deleteAudio} setAudios={setAudios} audios={audios} id={audioId} />
                        })}
                        {provided.placeholder}
                      </div>)
                    }
                  }
                </Droppable>
              </DragDropContext>
              <hr />
              <button className="button" onClick={addAudios}>
                Ajouter Audio
              </button>
            </div>

            <div className="card-footer" style={{ position: 'relative' }}>

              <div className={`card-footer-item loader-wrapper ${isLoadingPreview && 'is-active'}`}>
                {/* <div className={`loader`}></div><br /> */}
                <progress className="progress is-primary" style={{ transition: '0.3s' }} value={progress} max="100">{progress}%</progress>
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
