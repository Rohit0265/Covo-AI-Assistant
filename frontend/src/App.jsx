import React from 'react'
import { googleProvider, auth } from './utils/firebase'
import { signInWithPopup } from 'firebase/auth'

const App = () => {

  const login = async()=>{
    try {
      const result = await signInWithPopup(auth,googleProvider);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <button onClick={login} className="bg-red-600 text-white px-6 py-3 hover:cursor-pointer rounded-lg shadow-md">continue with google</button>
    </div>
  )
}

export default App