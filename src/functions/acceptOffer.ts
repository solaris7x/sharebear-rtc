// Accept offer
export const acceptOffer = async (
  pc: RTCPeerConnection,
  offerDescription: RTCSessionDescriptionInit,
  setLocalDescription: React.Dispatch<React.SetStateAction<string>>
) => {
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      const answerCandidates = localStorage.getItem("answerCandidates")
        ? JSON.parse(localStorage.getItem("answerCandidates")!)
        : [];
      answerCandidates.push(event.candidate.toJSON());
      localStorage.setItem(
        "answerCandidates",
        JSON.stringify(answerCandidates)
      );
    }
  };
  // const offerDescription = JSON.parse(remoteDescription);
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  console.log("Answer:", answer);
  setLocalDescription(JSON.stringify(answer));
  localStorage.setItem("answer-c2", JSON.stringify(answer));

  // Check for offer candidates every 5 seconds
  const offerICE = new Set<any>();
  const interval = setInterval(() => {
    const offerCandidates = localStorage.getItem("offerCandidates")
      ? JSON.parse(localStorage.getItem("offerCandidates")!)
      : [];
    offerCandidates.forEach((candidate: any) => {
      if (!offerICE.has(candidate)) {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
        offerICE.add(candidate);
      }
    });
  }, 5000);

  return () => clearInterval(interval);
};
