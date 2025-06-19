"use client"
import { useEffect, useState } from "react"


export function useSocket(): WebSocket | undefined {
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    
    useEffect(() => {
        // const token = localStorage.getItem('token');
        // if (!token) {
        //     console.error('No token found in localStorage');
        //     return;
        // }

        const ws = new WebSocket(`ws://localhost:8080`);
        
        ws.onopen = () => {
            console.log('WebSocket connection established');
        };
        setSocket(ws);
        return () => ws.close();
    }, []);

    return socket;
}