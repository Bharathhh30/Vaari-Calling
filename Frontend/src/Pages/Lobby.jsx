import React, { useCallback } from "react";
import { useState,useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";


function Lobby() {
    const [email, setEmail] = useState("")
    const [room, setRoom] = useState("")

    const socket = useSocket()
    const navigate = useNavigate()

    // console.log(socket)

    const handleSubmitForm = useCallback((e)=>{
        e.preventDefault();
        // join logic using socket emit event( join-room )
        socket.emit("room:join" ,{email,room}) //syntax - socket.emit("event-name",data) , "room:join" is event-name and {email,room} is data event name refer chesi backend lo handle chestam
        // console.log(email,room)
    },[email,room,socket])

    const handleJoinRoom = useCallback((data)=>{
        const {email,room} = data;
        navigate(`/room/${room}`)
    },[navigate])

    useEffect(()=>{
        socket.on("room:join", handleJoinRoom)
        return () => {
            socket.off("room:join",handleJoinRoom)
        }
    },[socket,handleJoinRoom])

    
  return (
    <>
      <div className="flex justify-center align-middle p-12 text-3xl text-blue-300 font-bold">
        <h1>Welcome to Vaari's Lobby</h1>
      </div>

      {/* below div is of form */}

      <div>
        <form action="" onSubmit={handleSubmitForm}>
            <div className="flex gap-x-3 justify-center p-10">
                <label htmlFor="email" className="text-blue-400 text-xl">Enter Your Email-ID</label>
                <input type="text" placeholder="Email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="px-4 bg-blue-100 rounded-md ring-1 border border-blue-500 focus:border-blue-700 focus:outline-none" />
            </div>

            <div className="flex gap-x-3 justify-center p-10">
                <label htmlFor="room" className="text-blue-400 text-xl">Enter Your Room-ID</label>
                <input type="text" placeholder="Room ID" id="room" value={room} onChange={(e)=>setRoom(e.target.value)} className="px-4 bg-blue-100 rounded-md ring-1 border border-blue-500 focus:border-blue-700 focus:outline-none" />
            </div>

            <div className="flex justify-center p-10">
                <button type="submit" className=" bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700">Join Room</button>
            </div>
        </form>
      </div>
    </>
  );
}

export default Lobby;
