import React from 'react'
import Canvapage from '../../componentpages/Canvapage'
import ProtectedRoute from '../../componentpages/wrapper/Protectionroute'

const page = () => {
  return (
    <ProtectedRoute>
      <Canvapage/>
    </ProtectedRoute>
  )
}

export default page
