import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useWarframe, markPart } from "../hooks/Requests";
import "../styles/mainPage.css";

const WarframePage = () => {
  const { id } = useParams();
  const { warframe, updateAll } = useWarframe(id);

  if (!warframe.parts) {
    return <h2>Loading</h2>;
  }

  const onPartClick = async (partId, checked) => {
    await markPart(partId, checked);
    updateAll();
  };

  return (
    <div className="main">
      <h1 className="title">Warframe</h1>
      <div className="warframe">
        <p className="warframe-name">{warframe.name}</p>
        {warframe?.parts?.map((part) => (
          <div className="parts" key={part.id} id={part.id}>
            <button
              onClick={() => onPartClick(part.id, part.checked)}
              className="button-mark"
            >
              {part.checked ? (
                <p className="owned">✔</p>
              ) : (
                <p className="dont-have">✖</p>
              )}
            </button>
            <div className="part-name">
              <p className={part.checked ? `active` : `warframe-part`}>
                {part.name}
              </p>
            </div>
            <div className="relics">
              {part.relics?.map(
                (relic) =>
                  relic && ( //Когда запрос отрабатывает с undefined
                    <p className="warframe-relic" key={relic.id} id={relic.id}>
                      {relic.name}
                    </p>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarframePage;
