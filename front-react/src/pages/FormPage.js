import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { map, throttle } from "lodash";

import "../styles/mainPage.css";

const FormPage = () => {
  const [showRelics, setShowRelics] = useState(false);
  const [foundRelics, setFoundRelics] = useState([]);
  const [term, setTerm] = useState("");
  const [selectedRelics, setSelectedRelics] = useState([]);

  const [part, setPart] = useState("")
  const [showPart, setShowPart] = useState(false)

  const fieldOpenRelics = () => {
    setShowRelics(true);
  };

  const fieldOpenPart = () => {
    setShowPart(true);
  };

  const search = async (seacrhTerm) => {
    try {
      if (seacrhTerm === "") {
        return;
      }
      const result = await axios.get(
        `http://localhost:3004/relics?name_like=${seacrhTerm}`
      );
      setFoundRelics(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setFoundRelics([]);
  };

  const throttledSeacrh = useRef(
    throttle((seacrhTerm) => search(seacrhTerm), 1000)
  );

  useEffect(() => {
    throttledSeacrh.current(term);
  }, [term]);

  const onAddSelectedRelics = (relic, e) => {
    const cloneRelics = [...selectedRelics, relic];

    setSelectedRelics(cloneRelics);

    handleClear(e)

    setTerm('')
  };

  const onKeyDownForReics = async (event) => {
    if (event.keyCode === 13 && foundRelics.length === 0) {
      const response = await axios.post(`http://localhost:3004/relics`, {
        name: term,
        locations: []
      });

      onAddSelectedRelics(response.data, event)
       
    }
  }

  const onSaveWarframe = async () => {
    
      await axios.post(`http://localhost:3004/primeParts`, {
        name: part,
        checked: false,
        relics: selectedRelics.map((relic) => {
          return relic.id
        })
      }); 
  }

  return (
    <div className="main">
      <h1 className="title">Warframe</h1>
      <div className="form-parts">
        <button className="add-part" onClick={fieldOpenPart}>
            Добавить прайм-часть
        </button>
        <div hidden={!showPart}>
          <input
            type="text"
            placeholder="Part"
            value={part}
            onChange={(event) => setPart(event.target.value)}
          />
        </div>
      </div>
      <div className="forms-relics">
        <button className="add-relic" onClick={fieldOpenRelics}>
          Добавить реликвию
        </button>
        {selectedRelics.map((selectedRelic) => (
          <div className="selected-relics" key={selectedRelic.id}>
            <p className="name-selected-relics">{selectedRelic.name}</p>
          </div>
        ))}
        <div hidden={!showRelics}>
          <input
            type="text"
            placeholder="Search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={onKeyDownForReics}
          />
          <div className="relics-list">
            {foundRelics.map((relic) => (
              <div className="found-relic" key={relic.id}>
                <button
                  className="found-relic-name"
                  onClick={(e) => onAddSelectedRelics(relic, e)}
                >
                  {relic.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={onSaveWarframe} className='form-submit'>Сохранить</button>
    </div>
  );
};

export default FormPage;
