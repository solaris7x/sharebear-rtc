/* eslint-disable @typescript-eslint/no-explicit-any */

export const requestWebcam = async (
  pc: RTCPeerConnection | null,
  webcamVideo: HTMLVideoElement | null,
  remoteVideo: HTMLVideoElement | null
) => {
  if (!pc) {
    console.error("Peer connection is not initialized");
    return;
  }
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  const remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  if (!webcamVideo || !remoteVideo) {
    console.error("Video elements are not initialized");
    return;
  }

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  //   callButton.disabled = false;
  //   answerButton.disabled = false;
  //   webcamButton.disabled = true;
};
