import { useEffect, useState, useRef } from 'react';
import { createSilentAudio } from 'create-silent-audio';

const AudioElem = ({ audios, id, setAudios, deleteAudio }) => {
    const audio = audios.filter((audio) => { return audio.id == id })[0];
    const [type, setType] = useState(audio.type);
    const [duration, setDuration] = useState(audio.duration);
    const [audioPath, setAudioPath] = useState(audio.path);
    const [file, setFile] = useState(audio.file);
    const [isPlaying, setIsPlaying] = useState(false);
    //const [reader, setReader] = useState(new FileReader());
    const audioReader = useRef();
    //useEffect for reader to preview fileinput
    useEffect(() => {
        switch (type) {
            case "silence":
                setDuration(duration || 10);
                break;
            case "standard":
                setAudioPath(audioPath || '/audios/bip.mp3');
                break;
            case "import":
                setFile(null);
                break;
            case "record":
                setAudioPath(null);
                break;
        }
    }, [type])

    useEffect(() => {
        var newAudio = { 'name': id, duration, type, file, path: audioPath, id: id }
        setAudios(audios.map((originAudio, i) => { return originAudio.id == id ? newAudio : originAudio; }));
    }, [audioPath, duration, file, type])

    useEffect(() => {
        if (type == "import" && file != null) {
            var reader = new FileReader();
            reader.onload = function (e) {
                setAudioPath(e.target.result);
            }
            reader.readAsDataURL(file);
        }
    }, [file])

    useEffect(() => {
        if (type == "import" && file != null) {
            if (audioReader.current) {
                audioReader.current.pause();
                audioReader.current.load();
            }
        }
    }, [audioPath])

    function HandleChangeAudioType(event) {
        setType(event.target.value);
    }
    function handleFileSelected(event) {
        setFile(event.target.files[0]);
    }
    function handleStandardFileSelected(event) {
        setAudioPath(event.target.value);
    }
    function handleSilenceLength(event) {
        if (duration > 0) {
            setDuration(event.target.value);
        }
    }
    function pause() {
        if (audioReader.current) {
            audioReader.current.pause();
            setIsPlaying(!isPlaying);
        }
    }
    function play() {
        if (audioReader.current) {
            audioReader.current.play();
            setIsPlaying(!isPlaying);
        }
    }
    function stop() {
        if (audioReader.current) {
            audioReader.current.pause();
            audioReader.current.currentTime = 0;
            setIsPlaying(!isPlaying);
        }
    }
    return (
        <div className="level box">
            <div className="level-left">
                <div className="field has-addons level-item">
                    <div className="control">
                        <div className="select">
                            <select onChange={HandleChangeAudioType} value={type}>
                                <option value="silence">Silence</option>
                                <option value="import">Importer un fichier audio</option>
                                {/* <option value="record">Enregistrer audio</option> */}
                                <option value="standard">Choisir un son</option>
                            </select>
                        </div>
                    </div>
                    <div className="control">
                        {type == "import" && <input type="file" className="input" onChange={handleFileSelected} />}
                        {type == "silence" && (<div><input type="number" style={{ width: '150px' }} className="input" value={duration} onChange={handleSilenceLength} />
                            <span style={{ display: "inline-flex", alignItems: "center", height: "40px" }}>secondes</span>
                        </div>)}
                        {type == "standard" && (
                            <div className="select">
                                <select value={audioPath || '/audios/delfInstruction.mp3'} onChange={handleStandardFileSelected} >
                                    <option value="/audios/bip.mp3">bip</option>
                                    <option value="/audios/delfInstruction.mp3">Instruction delf</option>
                                    <option value="/audios/fin.mp3">fin de l'épreuve</option>
                                </select>
                            </div>
                        )}
                        {/* {type == "record" && <button className="button" onClick={record} >Record</button>} */}
                    </div>


                </div>
            </div>
            <div className="level-right">
                <div className="controllevel-item">
                    {isPlaying ? (<>
                        <button onClick={pause} className="button">
                            <span className="icon">
                                <i className="fas fa-pause"></i>
                            </span>
                        </button>
                        <button onClick={stop} className="button">
                            <span className="icon">
                                <i className="fas fa-stop"></i>
                            </span>
                        </button></>
                    ) : (
                        <button className="button" onClick={play}>
                            <span className="icon">
                                <i className="fas fa-play"></i>
                            </span>
                        </button>
                    )}
                    <audio controls style={{ display: "none" }} ref={audioReader} onEnded={stop}><source src={audioPath}></source></audio>
                </div>
                <div className="control level-item ml-3">
                    <button className="button is-danger" onClick={() => { deleteAudio(id) }}><span className="icon"><i className="fas fa-trash"></i></span></button>
                </div>
            </div>
        </div>
    )
}

export default AudioElem