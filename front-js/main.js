async function showWarframe() {
  const responseName = await fetch(`http://localhost:3000/warframes`);
  const warframeNameResponse = await responseName.json();
  const responseParts = await fetch("http://localhost:3000/primeParts");
  const warframePartsResponse = await responseParts.json();
  const responseRelics = await fetch("http://localhost:3000/relics");
  const warframeRelicsResponse = await responseRelics.json();

  const warframes = warframeNameResponse.map((warframeElement) => {
    const parts = warframeElement.parts.map((partId) => {
      const warframePart = warframePartsResponse.find((part) => {
        return part.id === partId;
      });

      const relics = warframePart.relics.map((relicId) => {
        const partRelic = warframeRelicsResponse.find((relic) => {
          return relic.id === relicId;
        });

        return partRelic;
      });

      const partWithRelics = { ...warframePart, relics: relics };

      return partWithRelics;
    });

    return { ...warframeElement, parts: parts };
  });

  const Relic = (relic) => {
    const $relic = document.createElement("li");
    $relic.classList.add("relic-name");
    $relic.innerHTML += relic.name;
    return $relic;
  };

  const Part = (part) => {
    const $part = document.createElement("div");
    $part.classList.add("part-warframe");

    const $partName = document.createElement("p");
    $partName.classList.add("part-name");
    $partName.innerHTML = part.name;

    const $listRelics = document.createElement("ul");
    $listRelics.classList.add("relics-list");

    const $relics = part.relics.map((relic) => {
      return Relic(relic);
    });

    for (key in $relics) {
      $listRelics.appendChild($relics[key]);
    }

    $part.appendChild($partName);
    $part.appendChild($listRelics);

    return $part;
  };

  const Warframe = (warframe) => {
    const $warframe = document.createElement("div");
    $warframe.classList.add("warframe");

    const $warframeName = document.createElement("p");
    $warframeName.classList.add("warframe-name");
    $warframeName.innerHTML = warframe.name;

    const $listParts = document.createElement("div");
    $listParts.classList.add("parts-list");

    const $parts = warframe.parts.map((part) => {
      return Part(part);
    });

    for (const index in $parts) {
      $listParts.appendChild($parts[index]);
    }
    const $warframesList = document.querySelector(".all-warframes");
    $warframesList.appendChild($warframe);

    $warframe.appendChild($warframeName);
    $warframe.appendChild($listParts);
  };

  for (const key in warframes) {
    Warframe(warframes[key]);
  }
}
showWarframe();
