import React ,{useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import { validEmail } from '../../utils/helper'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import uploadImage from '../../utils/uploadImage'

const Signup = ({setCurrentPage}) => {
  const [profilePic , setProfilePic] = useState(null);
  const [fullName , setFullName] = useState("");
  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error , setError] = useState("")

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();


  const handleSignup = async (e)=>{
    e.preventDefault()

    let profileImageUrl = ""


    if(!fullName){
      setError("Please enter your full name");
      return;
    }
    if(!validEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter your password");
      return;
    }

    setError("");

     //login api call
    try{
      // upload profile image if exists
      if (profilePic) {
        const imgUploadResponses = await uploadImage(profilePic);
        profileImageUrl = imgUploadResponses.data.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        name: fullName,
        email,
        password,
        profileImage: profileImageUrl,
      });

    const { token } = response.data;

    if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }

    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      } else{
        setError("Something went wrong. Please try again later.");
      }
    }
  }

  return <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
    <h3 className='text-lg font font-semibold text-black'> Create an account</h3>
    <p className='text-xs text-slate-700 mt-[5px] mb-6'>
      Join us today by entering your details below
    </p>

    <form onSubmit={handleSignup}>


    <ProfilePhotoSelector image = {profilePic} setImage = {setProfilePic} />
      <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
        <Input
        value={fullName}
        onChange={({target})=> setFullName(target.value)}
        label="Full Name"
        placeholder= 'Jhon'
        type='text'
        />

        <Input
        value={email}
        onChange={({target})=> setEmail(target.value)}
        label="Email Address"
        placeholder= 'jhon@example.com'
        type='text'
        />

        <Input
        value={password}
        onChange={({target})=> setPassword(target.value)}
        label="Password"
        placeholder= 'Min 8 character'
        type='password'
        />
      </div>

      {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

      <button type='submit' className='btn-primary'>
        SIGN UP
      </button>

      <p className='text-[13px] text-slate-800 mt-3'>
        Already an account?{""}
        <button
        className='font-medium text-primary underline cursor-pointer'
        onClick={()=>{
          setCurrentPage('login');
        }}
        >
          Login 
        </button>
      </p> 
    </form>
  </div>
  
}

export default Signup