import React, { useEffect, useState } from "react";
import db from "../db/db.json";
import TurkeyMap from "../components/TurkeyMap";
import { Modal } from "../components/Modal";

const webkitSpeechRecognition = window.webkitSpeechRecognition;
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "tr-TR";

export const KnowTheCity = () => {
  const [city, setCity] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [blackList, setBlackList] = useState([]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(
    "Dinlemeyi başlatmak için butona basın."
  );

  function resetGame() {
    setBlackList([]);
    setNote("");
    setCity(db[Math.floor(Math.random() * db.length)]);
    setShowModal(false);

    recognition.start();

    recognition.onend = () => {
      setStatus("Dinlemeye devam ediyorum...");
      console.log("...continue listening...");
      recognition.start();
    };
  }

  console.log(blackList, city);

  useEffect(() => {
    setCity(db[Math.floor(Math.random() * db.length)]);
  }, []);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      recognition.start();
      recognition.onend = () => {
        setStatus("Dinlemeye devam ediyorum...");
        console.log("...continue listening...");
        recognition.start();
      };
    } else {
      recognition.stop();
      recognition.onend = () => {
        setStatus("Dinlemeyi durdurdum.");
        console.log("Stopped listening per click");
      };
    }
  };

  recognition.onstart = () => {
    setStatus("Dinliyorum...");
  };

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]) // result[0] is a SpeechRecognitionAlternative object
      .map((result) => result.transcript)
      .join("");
    setTranscript(transcript);
    setFinalTranscript(transcript);
    if (event.results[0].isFinal) {
      recognition.stop();
    }
  };

  const [knew, setKnew] = useState(0);

  useEffect(() => {
    if (finalTranscript !== "") {
      console.log(finalTranscript);
      const changeSmallCase = finalTranscript.toLowerCase();
      if (changeSmallCase === city.toLowerCase()) {
        setBlackList([...blackList, city]);
        const newDb = db.filter((item) => !blackList.includes(item));
        setCity(newDb[Math.floor(Math.random() * newDb.length)]);
        setKnew(knew + 1);
        setNote("Bildin!");
      } else {
        console.log("Bilemedin");
      }
    }
  }, [finalTranscript, city]);

  const [skipQuantity, setSkipQuantity] = useState(0);

  const skipCity = () => {
    if (skipQuantity < 3) {
      setBlackList([...blackList, city]);
      const newDb = db.filter((item) => !blackList.includes(item));
      setCity(newDb[Math.floor(Math.random() * newDb.length)]);
      setSkipQuantity(skipQuantity + 1);
    } else {
      setShowModal(true);
    }
  };

  const [hintQuantity, setHintQuantity] = useState(0);

  const handleHint = () => {
    if (hintQuantity < 3) {
      const getRandomFromCity =
        city.split("")[Math.floor(Math.random() * city.length)];
      const findIndex = city.indexOf(getRandomFromCity);
      const hint = city.split("")[findIndex];
      setNote(
        `${findIndex + 1}. harfi ${hint} olan bir şehir. ${
          city.length
        } harfli bir şehir.`
      );
      setHintQuantity(hintQuantity + 1);
    } else {
      setShowModal(true);
    }
  };

  console.log("city", city);

  useEffect(() => {
    if (knew === 81) {
      setShowModal(true);
    }
  }, [knew]);

  return (
    <>
      <TurkeyMap city={city} blackList={blackList} />

      <button onClick={() => setIsListening(true)} className="button start">
        Başlat
      </button>

      <button onClick={() => setIsListening(false)} className="button stop">
        Durdur
      </button>

      <button onClick={skipCity} className="button clear">
        Pas ({skipQuantity} / 3)
      </button>

      <button onClick={handleHint} className="button hint">
        İpucu
      </button>

      <div className="status">{note}</div>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        knew={knew}
        resetGame={resetGame}
      />
    </>
  );
};
