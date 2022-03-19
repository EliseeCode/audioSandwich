import { useEffect, useState } from 'react';
import { createSilentAudio } from 'create-silent-audio';

const AudioElem = ({ audios, id, setAudios, deleteAudio }) => {
    const audio = audios.filter((audio) => { return audio.id == id })[0];
    const [type, setType] = useState(audio.type);
    const [duration, setDuration] = useState(audio.duration);
    const [audioPath, setAudioPath] = useState(audio.path);
    const [file, setFile] = useState(audio.file);


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
        console.log(audios);
        var newAudio = { 'name': id, duration, type, file, path: audioPath, id: id }
        setAudios(audios.map((originAudio, i) => { return originAudio.id == id ? newAudio : originAudio; }));
    }, [audioPath, duration, file, type])


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

    return (
        <div className="level box">
            <div className="level-left">
                <div className="field has-addons level-item">
                    <div className="control">
                        {id}
                    </div>
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
                        {type == "silence" && (<div><input type="number" style={{ width: '150px' }} className="input" value={duration} onChange={handleSilenceLength} /><span style={{ display: "inline-flex", alignItems: "center", height: "40px" }}>secondes</span></div>)}
                        {type == "standard" && (
                            <div className="select">
                                <select value={audioPath || '/audios/delfInstruction.mp3'} onChange={handleStandardFileSelected} >
                                    <option value="/audios/bip.mp3">bip</option>
                                    <option value="/audios/delfInstruction.mp3">Instruction delf</option>
                                </select>
                            </div>
                        )}
                        {/* {type == "record" && <button className="button" onClick={record} >Record</button>} */}
                    </div>
                </div>
            </div>
            <div className="level-right">
                <div className="control level-item">
                    <button className="button is-danger" onClick={() => { deleteAudio(id) }}>Supprimer</button>
                </div>
            </div>
        </div>
    )
}

export default AudioElem