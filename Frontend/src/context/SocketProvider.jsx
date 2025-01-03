import React from 'react'
import { createContext , useMemo} from 'react'
import {useContext} from 'react'
import {io}from 'socket.io-client'

const SocketContext = createContext(null)
export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket
}

function SocketProvider(props) {
    const socket = useMemo(()=>io('http://localhost:8000'),[])
  return (
    <SocketContext.Provider value={socket}>
        {props.children}
    </SocketContext.Provider>
  )
}

export default SocketProvider