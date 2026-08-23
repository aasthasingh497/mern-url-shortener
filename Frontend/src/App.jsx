import { useState } from 'react'
import axios from 'axios';
import QRCode from 'react-qr-code';
import QRCodeGenerator from 'qrcode';

 
const API_BASE_URL=import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url,seturl]=useState("");
  const [shorturl,setshorturl]=useState("");
  const [copied,setcopied]=useState(false);
  const [qrimage,setqrimage]=useState("");

  const handleshorten=async()=>{
    if(!url)return;
    try {
      const res= await axios.post(`${API_BASE_URL}/shorten`,{
        orignalurl:url
      });
      const newshortUrl=res.data.shorturl;
      setshorturl(newshortUrl);
      setcopied(false);

      const qr=await QRCodeGenerator.toDataURL(newshortUrl);
      setqrimage(qr);
    } catch (error) {
      console.log(error);
      alert("something went wrong");
    }

  }
 
  const handlecopy=async()=>{
    navigator.clipboard.writeText(shorturl);
    setcopied(true);
    setTimeout(()=>setcopied(false),2000);
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6'>
      <h1 className='text-4xl font-bold mb-4 text-center'>URL-SHORTENER</h1> 
      <div className='flex flex-col gap-3 w-full max-w-3xl'>
        <input type='text' className='input input-success w-full' placeholder='enter long url ' value={url} onChange={(e)=>seturl(e.target.value)}/>
        <button onClick={handleshorten} className='btn btn-primary w-full sm:auto'>Shorten</button>
      </div>
      {shorturl && (
        <div className='flex flex-col items-center max-w-3xl w-full'>
          <p className='font-medium mb-2'>your short link :</p>
          <a className='link link-primary break-all' href={shorturl}>{shorturl}</a>
          <button onClick={handlecopy} className={`btn mt-2 w-full ${copied?"btn-success":"btn-secondary"}`}>{copied?"copied!":"copy"}</button>
          <div className='bg-white p-4 rounded-lg shadow mt-6'>
            <p className='text-center text-gray-800 font-semibold mb-2'>scan qr code:</p>
            <QRCode value={shorturl} size={180}/>

          </div>
          {qrimage && (
            <a className='btn btn-accent mt-3 w-full'download="qr-code.png" href={qrimage}>Download QR Code</a>
          )}
        </div>
      )}
    </div>
  )
}

export default App
