import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";

function Room() {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleJoinedUser = useCallback(({ email, id }) => {
    console.log(email, id);
    setRemoteSocketId(id);
  }, []);

  const sendStreams = useCallback(() => {
    for (const track of stream.getTracks()) {
        peer.peer.addTrack(track, stream);
      }
  },[stream]);

  const handleCallAccepted = useCallback(
    async ({ from, answer }) => {
      peer.setLocalDescription(answer);
      console.log("Call accepted from", from, answer);
      sendStreams();
    },
    [peer, sendStreams]
  );

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      console.log("Incoming call from", from, offer);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      const ans = await peer.getAnswer(offer);
      socket.emit("call-accepted", { to: from, answer: ans });
    },
    [socket]
  );

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, answer: ans });
    },
    [socket]
  );

  const handleCallFinal = useCallback(async ({ from, answer }) => {
    await peer.setLocalDescription(answer);
  }, []);
  //   const

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("Got Tracks")
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket, peer]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", async () => {
      // const offer = await peer.getOffer();
      return () => {
        peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
      };
    });
  }, [peer, handleNegoNeeded]);

  // use effect for sockers
  useEffect(() => {
    socket.on("user:joined", handleJoinedUser);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleCallFinal);

    return () => {
      socket.off("user:joined", handleJoinedUser);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleCallFinal);
    };
  }, [socket, handleJoinedUser, handleIncomingCall]);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const offer = await peer.getOffer();
    socket.emit("call-user", {
      to: remoteSocketId,
      offer,
    });
    setStream(stream);
  }, [remoteSocketId, socket]);

  return (
    <>
      <div className="flex justify-center items-center gap-y-3 flex-col p-3 text-2xl text-blue-300 font-bold">
        <h1>Welcome to the room created</h1>
        <h4>{remoteSocketId ? "Connected" : "ONly one"}</h4>
        {stream && <button className=" bg-blue-500 text-white p-1 w-72 rounded-md hover:bg-blue-700" onClick={sendStreams}>Send Streams</button>}
        {remoteSocketId && (
          <button
            onClick={handleCallUser}
            className=" bg-blue-500 text-white p-1 w-16 rounded-md hover:bg-blue-700"
          >
            Call
          </button>
        )}
        {stream && (
            <>
            <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="200px"
            width="400px"
            url={stream}
          />
          </>
        )}

        {remoteStream && (
            <>
            <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="200px"
            width="400px"
            url={remoteStream}
          />
          </>
        )}
      </div>
    </>
  );
}

export default Room;
