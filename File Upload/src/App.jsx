import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [title,setTitle] = useState("")
  const [file,setFile] = useState(null)
const [allImage, setAllImage] = useState(null)

useEffect(() => {
getPdf()
},[])

const getPdf = async()=>{
  const result = await axios.get("http://localhost:5000/get-files")
  console.log(result.data.data);
  setAllImage(result.data.data)
}

const SubmitImage= async(e) => {
e.preventDefault()
//FormData is method provided by java,which we will store in a object
const formData = new FormData()
//in formData we will store 2 variables
//variable name and state
formData.append('title',title)
formData.append('file',file)
console.log(title,file);

try {
  const result = await axios.post('http://localhost:5000/upload-files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  console.log(result.data); // Log the response data
  alert('File uploaded successfully!');
  getPdf()
} catch (error) {
  console.error('Error uploading file:', error);
  alert('Failed to upload file. Please try again.');
}
};

const showPdf = (pdf) => {
window.open(`localhost:5000/files/${pdf}`, "_blank", "noreferer")
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
     <div className="uploaded">
      <h4>Uploaded PDF:</h4>
<div className='output-div'>
  {allImage==null?"" : allImage.map((data) => {
    return (
      <div className='inner-div' key={data.id}>
    <h6>Title :{data.title}</h6>    
    <button className='btn btn-primary' onClick={()=> showPdf(data.pdf)}>Show pdf</button>
  </div>
    )
  })}
  
</div>
     </div>
    </>
  )
}

export default App