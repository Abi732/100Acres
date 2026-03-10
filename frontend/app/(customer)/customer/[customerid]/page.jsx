import React from 'react'

function Page({ params }) {
  const id = params.customerid;

  return (
    <div>
      <h1>Customer Page</h1>
      <p>ID: {id}</p>
    </div>
  )
}

export default Page