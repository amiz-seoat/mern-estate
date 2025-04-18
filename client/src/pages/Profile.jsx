  import React, { useEffect, useState } from "react";
  import { useSelector } from "react-redux";
  import { useRef } from "react";
  import { account, storage } from "../appwrite/appwriteconfig.js";
  //import { Await } from "react-router-dom";
  import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice.js";
  import { useDispatch } from "react-redux";
  import {ID} from "appwrite";

  export default function Profile() {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [imageUrl, setImageUrl] = useState("");
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const dispatch=useDispatch();


    console.log(file);

    useEffect(() => {
      if (file) {
        handleFileUpload(file);
      }
    }, [file]);



    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    }; 

  
    const handleFileUpload = async (file) => {
      if (!file) {
        console.error("No file selected.");
        return;
      }
    
      try {
        const fileId = ID.unique(); // Generates a unique Id
        const response = await storage.createFile("67fcceb30033ff389be2", fileId, file);
        console.log("Upload successful:", response);

        const imageUrl = storage.getFileView("67fcceb30033ff389be2", response.$id);
        setImageUrl(imageUrl);
        console.log(imageUrl)
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };
    
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit= async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

    return (
      <div>
        <div className="max-w-lg mx-auto p-3 mY-7">
          <h1 className="text-3xl font-semibold   text-center  mx-auto">
            Profile
          </h1>
          <form onSubmit={handleSubmit} className="flex mt-7 flex-col gap-4 " >
            <input
              onChange={handleFileChange}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <img
              onClick={() => fileRef.current.click()}
              className="rounded-full h-30 w-30 self-center object-cover cursor-pointer"
              src={imageUrl || currentUser.avatar}
              alt="profile"
            />
            
            
            <input
              type="text"
              placeholder="username"
              defaultValue={currentUser.username}
              id='username'
              className="border-slate-400 focus:outline-none bg-white border rounded-lg p-2.5"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="email"
              id='email'
              defaultValue={currentUser.email}
              className="border-slate-400 focus:outline-none bg-white border rounded-lg p-2.5"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="password"
              id="password"
              className="border-slate-400 focus:outline-none bg-white border rounded-lg p-2.5"
              onChange={handleChange}
            />

            <button disabled={loading} className="bg-slate-800 p-2.5 text-amber-50 uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
              {loading? 'Loading...':'Update'}
            </button>
            <button className="bg-green-600 p-2.5 text-amber-50 uppercase rounded-lg  hover:opacity-95 disabled:opacity-80">
              create listing
            </button>
          </form>
          <div className="flex justify-between mt-4 ">
            <span className="text-red-800 cursor-pointer">Delete account</span>
            <span className="text-red-800 cursor-pointer">Sign out</span>
          </div>
          <p className="text-red-700 mt-5">{error ? error:''}</p>
          <p className="text-green-700 mt-5">{updateSuccess? 'user is updated successfully': ''}</p>
        </div>
      </div>
    );
  }
