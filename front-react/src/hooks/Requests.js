import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export const getRelics = async () => {
  const result = await axios.get(`http://localhost:3004/relics`);
  return result.data;
};

export const getParts = async () => {
  const result = await axios.get(`http://localhost:3004/primeParts`);
  return result.data;
};

export const getAllWarframes = async () => {
  const result = await axios.get(`http://localhost:3004/warframes`);
  return result.data;
};

export const getWarframeById = async (id) => {
  const result = await axios.get(`http://localhost:3004/warframes/${id}`);
  return result.data;
};

export const populateWarframe = (warframe, allParts, allRelics) => {
  const parts = warframe.parts.map((partId) => {
    const warframePart = allParts.find((part) => {
      return part.id === partId;
    });

    const relics = warframePart.relics.map((relicId) => {
      const partRelic = allRelics.find((relic) => {
        return relic.id === relicId;
      });

      return partRelic;
    });

    const partWithRelics = { ...warframePart, relics };

    return partWithRelics;
  });

  const warframeWithParts = { ...warframe, parts };
  return warframeWithParts;
};

export const useWarframe = (id) => {
  const [oneWarframe, setOneWarframe] = useState({});
  const [warframePartsResponse, setWarframePartsResponse] = useState([]);
  const [warframeRelicsResponse, setWarframeRelicsResponse] = useState([]);

  const updateOneWarframe = async () => {
    const warframe = await getWarframeById(id);
    setOneWarframe(warframe);
  };

  const updateParts = async () => {
    const parts = await getParts();
    setWarframePartsResponse(parts);
  };

  const updateRelics = async () => {
    const relics = await getRelics();
    setWarframeRelicsResponse(relics);
  };

  const updateAll = () => {
    updateOneWarframe(id);
    updateParts();
    updateRelics();
  };

  useEffect(() => {
    updateAll();
  }, []);

  const warframeWithParts = useMemo(
    () => {
      if (
        oneWarframe.id &&
        warframePartsResponse.length !== 0 &&
        warframeRelicsResponse.length !== 0
      ) {
        return populateWarframe(
          oneWarframe,
          warframePartsResponse,
          warframeRelicsResponse
        );
      } else {
        return [];
      }
    },
    [oneWarframe, warframePartsResponse, warframeRelicsResponse]
  );

  return { warframe: warframeWithParts, updateAll };
};

export const useWarframes = () => {
  const [warframesResponse, setWarframesResponse] = useState([]);
  const [warframePartsResponse, setWarframePartsResponse] = useState([]);
  const [warframeRelicsResponse, setWarframeRelicsResponse] = useState([]);

  const updateWarframes = async () => {
    const warframes = await getAllWarframes();
    setWarframesResponse(warframes);
  };

  const updateParts = async () => {
    const parts = await getParts();
    setWarframePartsResponse(parts);
  };

  const updateRelics = async () => {
    const relics = await getRelics();
    setWarframeRelicsResponse(relics);
  };

  const updateAll = () => {
    updateWarframes();
    updateParts();
    updateRelics();
  };

  useEffect(() => {
    updateAll();
  }, []);

  const warframesWithParts = useMemo(() => {
    if (
      warframesResponse.length !== 0 &&
      warframePartsResponse.length !== 0 &&
      warframeRelicsResponse.length !== 0
    ) {
      return warframesResponse.map((warframe) => {
        return populateWarframe(
          warframe,
          warframePartsResponse,
          warframeRelicsResponse
        );
      });
    } else {
      return [];
    }
  }, [warframesResponse, warframePartsResponse, warframeRelicsResponse]);

  return { warframes: warframesWithParts, updateAll };
};

export const markPart = async (id, checked) => {
  await axios.patch(`http://localhost:3004/primeParts/${id}`, {
    checked: !checked,
  });
};
