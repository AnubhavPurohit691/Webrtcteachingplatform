"use client"
import React, { useState } from 'react'
import axios from "axios"
import { useRouter } from 'next/navigation'

export default function Join_OR_Create() {
  const router = useRouter()
  const [roomid,setroomid]=useState()
  function handlegettingroom(){
    const id = crypto.randomUUID()
    router.push(`/canva/${id}`)
  }
  return (
    <div>
      {/* <button onClick={}>JOIN</button> */}
      <button onClick={handlegettingroom}>Create</button>
    </div>
  )
}
