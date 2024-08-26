/* eslint-disable @typescript-eslint/no-explicit-any */

// Create offer
export const createOffer = async (
  pc: RTCPeerConnection,
  setLocalDescription: React.Dispatch<React.SetStateAction<string>>,
  setRemoteDescription: React.Dispatch<React.SetStateAction<string>>
) => {

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      const offerCandidates = localStorage.getItem("offerCandidates")
        ? JSON.parse(localStorage.getItem("offerCandidates")!)
        : [];
      offerCandidates.push(event.candidate.toJSON());
      localStorage.setItem("offerCandidates", JSON.stringify(offerCandidates));
    }
  };

  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };
  setLocalDescription(JSON.stringify(offer));
  localStorage.setItem("offer-c1", JSON.stringify(offer));

  // Check for offer answers every 5 seconds
  const answerInterval = setInterval(() => {
    const answer = localStorage.getItem("answer-c2")
    if (!pc.currentRemoteDescription && answer) {
      const answerDescription = new RTCSessionDescription(JSON.parse(answer));
      pc.setRemoteDescription(answerDescription);
      setRemoteDescription(answer);
    }
  }, 5000);

  // Check for answer candidates every 5 seconds
  const answerICE = new Set<any>();
  const interval = setInterval(() => {
    const answerCandidates = localStorage.getItem("answerCandidates")
      ? JSON.parse(localStorage.getItem("answerCandidates")!)
      : [];
    answerCandidates.forEach((candidate: any) => {
      if (!answerICE.has(candidate)) {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
        answerICE.add(candidate);
      }
    });
  }, 5000);

  return () => clearInterval(interval);
};
