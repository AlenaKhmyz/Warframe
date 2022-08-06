import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { throttle } from "lodash";

import "../styles/mainPage.css";

const FormPage = () => {
  const [show, setShow] = useState(false);
  const [foundRelics, setFoundRelics] = useState([]);
  const [term, setTerm] = useState("");
  const [selectedRelics, setSelectedRelics] = useState([]);

  const fieldOpen = () => {
    setShow(true);
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

  const onKeyDown = async (event) => {
    if (event.keyCode === 13 && foundRelics.length === 0) {
      const response = await axios.post(`http://localhost:3004/relics`, {
        name: term,
        locations: []
      });

      onAddSelectedRelics(response.data, event)
       
    }
  }
  
   

  return (
    <div className="main">
      <h1 className="title">Warframe</h1>
      <div className="forms-relics">
        <button className="add-relic" onClick={fieldOpen}>
          Добавить реликвию
        </button>
        {selectedRelics.map((selectedRelic) => (
          <div className="selected-relics" key={selectedRelic.id}>
            <p className="name-selected-relics">{selectedRelic.name}</p>
          </div>
        ))}
        <div hidden={!show}>
          <input
            type="text"
            placeholder="Search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={onKeyDown}
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
    </div>
  );
};

export default FormPage;
