import React, { useState, useEffect } from "react";
import reactLogo from "../assets/react.svg";
import "../App.css";
import db from "../db/db.json";
import TurkeyMap from "../components/TurkeyMap";

const webkitSpeechRecognition = window.webkitSpeechRecognition;
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "tr-TR";
export const Old = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [blackList, setBlackList] = useState([]);
  const [note, setNote] = useState("");
  const [isTrue, setIsTrue] = useState(0);

  const [status, setStatus] = useState(
    "Dinlemeyi başlatmak için butona basın."
  );

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

    recognition.onstart = () => {
      setStatus("Dinliyorum...");
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setTranscript(transcript);
      setFinalTranscript(transcript);
      if (event.results[0].isFinal) {
        setNote(transcript);
        recognition.stop();
      }
    };
  };

  useEffect(() => {
    if (
      db
        .map((item) => item.toLocaleLowerCase())
        .includes(finalTranscript.toLocaleLowerCase()) &&
      !blackList.includes(finalTranscript)
    ) {
      setBlackList([...blackList, finalTranscript]);
      setIsTrue((prev) => prev + 1);
    }
  }, [finalTranscript]);

  return (
    <>
      <div className="box">
        <button onClick={() => setIsListening(true)} className="button start">
          Başlat
        </button>

        <button onClick={() => setIsListening(false)} className="button stop">
          Durdur
        </button>
      </div>

      <div>
        <h2>Durum</h2>
        <p>
          {status} {finalTranscript && "-" + finalTranscript}
        </p>
      </div>

      <h1>{isTrue}</h1>

      <TurkeyMap item={finalTranscript} />

      <div className="blacklist">
        <h6>Söylediğin Şehirler</h6>
        <ul>
          {blackList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
};
