import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/mainPage.css";
import { Link } from "react-router-dom";
import { useWarframes, markPart } from "../hooks/Requests";
import {ROUTES} from "../const/Routes"

const MainPage = () => {
  const { warframes, updateAll } = useWarframes();

  if (!warframes) {
    return <h2>Loading</h2>;
  }

  const onPartClick = async (partId, checked) => {
    await markPart(partId, checked);
    updateAll();
  };

  return (
    <div className="main">
      <h1 className="title">Warframe</h1>
      <Link to={ROUTES.FORM} className="added-warframe">Добавить варфрейма</Link>
      <div className="all-warframes">
        {warframes.map((warframe) => (
          <div className="warframe" key={warframe.id}>
            <Link to={`/item/${warframe.id}`} className="warframe-name">
              {warframe.name}
            </Link>
            {warframe.parts.map((part) => (
              <div className="parts" key={part.id}>
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
                  {part.relics.map((relic) => (
                    <p className="warframe-relic" key={relic.id}>
                      {relic.name}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
