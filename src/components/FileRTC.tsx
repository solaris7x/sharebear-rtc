import { useEffect, useRef, useState } from "react";
import { requestWebcam } from "../functions/requestWebcam";
import { createOffer } from "../functions/createOffer";
import { acceptOffer } from "../functions/acceptOffer";

const FileRTC = () => {
  const [localDescription, setLocalDescription] = useState<string>("");
  const [remoteDescription, setRemoteDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  // const [chatLog, setChatLog] = useState<string[]>([]);

  const pc = useRef<RTCPeerConnection | null>(null);
  const webcamVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  // const dataChannel = useRef<RTCDataChannel | null>(null);

  // Start contract
  const startContract = async () => {
    if (!pc.current) {
      console.log("No peer connection");
      return;
    }
    const offerC1 = localStorage.getItem("offer-c1");
    if (offerC1) {
      const offer = JSON.parse(offerC1);
      setRemoteDescription(JSON.stringify(offer));
      acceptOffer(pc.current, offer, setLocalDescription);
    } else {
      createOffer(pc.current, setLocalDescription, setRemoteDescription);
    }
  };

  useEffect(() => {
    const config: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    pc.current = new RTCPeerConnection(config);

    return () => {
      if (pc.current) {
        pc.current.close();
      }
    };
  }, []);

  return (
    <div className="App">
      <h1>WebRTC Chat with Base64 Signaling (TypeScript)</h1>
      <div>
        <button
          onClick={() =>
            requestWebcam(pc.current, webcamVideo.current, remoteVideo.current)
          }
        >
          Request Webcam
        </button>
        <button onClick={startContract}>Start Contract</button>
        {/* <button onClick={acceptOffer}>Accept Offer</button> */}
        {/* <button onClick={completeConnection}>Complete Connection</button> */}
      </div>
      <div>
        <h3>Local Description:</h3>
        <textarea
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
          rows={5}
          cols={50}
        />
      </div>
      <div>
        <h3>Remote Description:</h3>
        <textarea
          value={remoteDescription}
          onChange={(e) => setRemoteDescription(e.target.value)}
          rows={5}
          cols={50}
        />
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        {/* <button onClick={sendMessage}>Send</button> */}
      </div>
      <div>
        <h3>Chat Log:</h3>
        {/* {chatLog.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))} */}
      </div>
      <div className="videos">
        <span>
          <h3>Local Stream</h3>
          <video
            id="webcamVideo"
            autoPlay
            playsInline
            ref={webcamVideo}
          ></video>
        </span>
        <span>
          <h3>Remote Stream</h3>
          <video
            id="remoteVideo"
            autoPlay
            playsInline
            ref={remoteVideo}
          ></video>
        </span>
      </div>
    </div>
  );
};

export default FileRTC;
