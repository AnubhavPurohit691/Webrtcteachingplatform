"use client"
import React, { useState } from 'react'
import axios from "axios"
import { useRouter } from 'next/navigation'

export default function Join_OR_Create() {
  const router = useRouter()
  async function handlegettingroom(){
    const data = await axios.get("http://localhost:3001/createroom",{headers:{
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }})
    const id =  await data.data.id
    router.push(`/canva/${id}`)
  }
  return (
    <div>
      <button onClick={handlegettingroom}>Create</button>
    </div>
  )
}
