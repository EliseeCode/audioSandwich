import { useEffect, useState } from 'react';
import { createSilentAudio } from 'create-silent-audio';

const AudioElem = ({ audios, index, setAudios }) => {
    const audio = audios[index];
    const [type, setType] = useState(audio.type);
    const [duration, setDuration] = useState(audio.duration);
    const [audioPath, setAudioPath] = useState(audio.path);
    const [file, setFile] = useState(audio.file);

    useEffect(() => {
        switch (type) {
            case "silence":
                setDuration(10);
                break;
            case "standard":
                setAudioPath('/audios/1.mp3');
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
        var newAudio = { 'name': index, duration, type, file, path: audioPath }
        setAudios(audios.map((originAudio, i) => { return i == index ? newAudio : originAudio; }));
    }, [audioPath, duration, file])

    function record() {

    }
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
    function deleteAudio() {
        setAudios(audios.filter((originAudio, i) => { return i != index }));
    }
    return (
        <div className="level">
            <div className="level-left">
                <div className="field has-addons level-item">
                    <div className="control">
                        <div className="select">
                            <select onChange={HandleChangeAudioType} value={type}>
                                <option value="silence">Silence</option>
                                <option value="import">Importer un fichier audio</option>
                                <option value="record">Enregistrer audio</option>
                                <option value="standard">Choisir un son</option>
                            </select>
                        </div>
                    </div>
                    <div className="control">
                        {type == "import" && <input type="file" className="input" onChange={handleFileSelected} />}
                        {type == "silence" && <input type="number" className="input" value={duration} onChange={handleSilenceLength} />}
                        {type == "standard" && (
                            <div className="select">
                                <select value={audioPath || '/audios/1.mp3'} onChange={handleStandardFileSelected} >
                                    <option value="/audios/1.mp3">1er fichier</option>
                                    <option value="/audios/2.mp3">2e fichier</option>
                                </select>
                            </div>
                        )}
                        {type == "record" && <button className="button" onClick={record} >Record</button>}
                    </div>
                </div>
            </div>
            <div className="level-right">
                <div className="control level-item">
                    <button className="button is-danger" onClick={deleteAudio}>Supprimer</button>
                </div>
            </div>
        </div>
    )
}

export default AudioElem