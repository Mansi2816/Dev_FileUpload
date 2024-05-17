
import { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [title,setTitle] = useState("")
  const [file,setFile] = useState("null")

const SubmitImage= async(e) => {
e.preventDefault()
//FormData is method provided by java,which we will store in a object
const formData = new FormData()
//in formData we will store 2 variables
//variable name and state
formData.append('title',title)
formData.append('file',file)
console.log(title,file);

const result = await axios.post('http://localhost:5000/upload-files',formData,{
  headers:{
    'Content-Type':'multipart/form-data',
  }
})
console.log(result);
}
  return (
    <>    
      <form className='formStyle' onSubmit={SubmitImage}>
      <h3> Upload pdf in react</h3> <br/>
      <input type='text' className='form-control' placeholder='title' required onChange={(e)=> setTitle(e.target.value)}/>
      <input type="file" className='form-control' accept='application/pdf' required onChange={(e)=> setFile(e.target.files[0])}/>
     <br/>
     <button className="btn btn-primary" type='submit'>Submit</button>
      </form>
    </>
  )
}

export default App
