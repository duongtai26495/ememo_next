'use client'
import { checkLoginUser, fetchDataFromAPI } from '@/app/utils/api_functions';
import { SUCCESS_STATUS, USERNAME_LOCAL, ACCESS_TOKEN, REFRES_TOKEN, IS_REMEMBER, SORT_ITEMS, SORT_TASK_ITEMS } from '@/app/assets/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const LoginPage: React.FC = () => {

  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isRemember, setRemember] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [usernameErrMsg, setUsernameErrMsg] = useState("")
  const [passwordErrMsg, setPasswordErrMsg] = useState("")
  const [summaryErrMsg, setSumErrMsg] = useState("")
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)
  const submitRef = useRef(null)

  const validateInput = async () => {
    let validCheck: boolean = true
    setLoading(true)

    if (username.length < 5) {
      setUsernameErrMsg("Username must have more than 5 characters")
      validCheck = false
    } else {
      setUsernameErrMsg("")
    }

    if (password.length < 5) {
      setPasswordErrMsg("Password must have more than 5 characters")
      validCheck = false
    } else {
      setPasswordErrMsg("")
    }

    if (validCheck) {
      setSumErrMsg("")
      await loginHandle()
    } else {
      setSumErrMsg("Something went wrong. Please check again !!!")
      setLoading(false)
    }
  }
  const loginHandle = async () => {
    let userLogin = {
      username,
      password
    }
    const result: any = await fetchDataFromAPI("public/sign-in", "POST", undefined, userLogin);
    setLoading(true)
    if (result.status === SUCCESS_STATUS) {
      const content: any = result.content
      localStorage.setItem(ACCESS_TOKEN, content.access_token)
      localStorage.setItem(REFRES_TOKEN, content.refresh_token)
      let remember = isRemember
      if (remember) {
        localStorage.setItem(USERNAME_LOCAL, username)
        localStorage.setItem(IS_REMEMBER, JSON.stringify(isRemember))
      } else {
        localStorage.removeItem(USERNAME_LOCAL)
        localStorage.removeItem(IS_REMEMBER)
      }
      checkLoginUser() ? router.push("/") : ""
    }
    else {
      setSumErrMsg(result.msg)
    }
    setLoading(false)
  }
 
  useEffect(() => {
    let rememberme: boolean = Boolean(localStorage.getItem(IS_REMEMBER) ?? false) 
    if (rememberme) {
      let username: string = localStorage.getItem(USERNAME_LOCAL) ?? ""
      setUsername(username)
    }
    setRemember(rememberme)
  }, [])

  useEffect(()=>{
    console.log(isRemember)
  },[isRemember])


  useEffect(() => {
    checkLoginUser() ? router.push("/") : getPublicAssets()
    
  }, [])

  const handleNextInput = (e: any, ref: any) => {
    if (e.key === 'Enter') {
      ref.current.focus()
    }
  }


  const getPublicAssets = async () => {
    if(!localStorage.getItem(SORT_ITEMS) && !localStorage.getItem(SORT_TASK_ITEMS)){
      const result_sort_notes = await fetchDataFromAPI("public/sort_value", "GET")
      const result_sort_tasks = await fetchDataFromAPI("public/task/sort_value", "GET")
    if(result_sort_notes){
      localStorage.setItem(SORT_ITEMS, JSON.stringify(result_sort_notes))
    }
    if(result_sort_tasks){
      localStorage.setItem(SORT_TASK_ITEMS, JSON.stringify(result_sort_tasks))
    }
  }
  }

  const toggleRemember = () => {setRemember(prevState => !prevState)}

  const RememberSwitch = () => {
    return(
      <div onClick={toggleRemember} 
      className={`cursor-pointer switch-background relative ${isRemember ? "switch-background-on" : "switch-background-off"}`}>
          <span className={`${isRemember ? "active-switch" :"inactive-switch"} m-auto bg-white switch-remember`}></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full lg:w-fit rounded-lg lg:shadow-lg overflow-hidden">
        <div className='hidden lg:flex w-full background-page' style={{ backgroundImage: "url(https://source.unsplash.com/random)" }}></div>
        <div className='lg:bg-white p-8 max-w-sm lg:max-w-lg authen-box mx-auto'>
          <h1 className="text-2xl font-semibold mb-4">Đăng nhập</h1>
          <div className='flex flex-col items-center'>
            <div className="mb-4 flex flex-col w-full">
              <label htmlFor="username" className="block text-gray-600 mb-1">Tên người dùng</label>
              <input
                onKeyDown={e => handleNextInput(e, passwordRef)}
                ref={usernameRef}
                disabled={isLoading}
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                className={`w-full flex-1 p-3 border rounded-md ${usernameErrMsg ? "border-red-500" : ""} `}
                placeholder='user123' />

              <span className='text-xs text-red-500 h-2 w-full'>{usernameErrMsg}</span>
            </div>
            <div className="mb-4 flex flex-col w-full">
              <label htmlFor="password" className="block text-gray-600 mb-1">Mật khẩu</label>
              <input
                onKeyDown={e => handleNextInput(e, submitRef)}
                ref={passwordRef}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                className={`w-full flex-1 p-3 border rounded-md ${passwordErrMsg ? "border-red-500" : ""} `}
                placeholder='***' />
              <span className='text-xs text-red-500 h-2 w-full'>{passwordErrMsg}</span>
            </div>
            <div className="mb-4 w-full flex gap-2 items-center">
              <RememberSwitch />
              <label>Ghi nhớ tài khoản</label>
            </div>
            <button
              ref={submitRef}
              disabled={isLoading}
              onClick={() => validateInput()}
              className={`${summaryErrMsg !== "" ? "shake-button " : ""}bg-zinc-800 shadow-md lg:hover:bg-zinc-900 transition-all text-white p-4 rounded-lg w-full`}>
              {
                isLoading
                  ?
                  <LoadingSpinner className={`w-6 h-6 mx-auto`} />
                  :
                  <span className={``}>Đăng nhập</span>
              }
            </button>

            <span className='text-sm mt-2 text-red-500 h-2 text-center font-bold w-full'>{summaryErrMsg}</span>
          </div>
          <p className="mt-4 text-center text-gray-500">
            Bạn chưa có tài khoản?{' '}
            <Link href="/register" className="text-red-500">
              Đăng ký ngay
            </Link>
          </p>
          <p className='mt-2 text-center text-gray-500'>
            <Link href={"/recovery"} className="text-gray-700 font-bold">
              Quên mật khẩu ?
            </Link>
          </p>

          <div className='w-full flex gap-5 my-3 justify-between items-center'>
            <span className='flex-1 bg-stone-300' style={{ height: ".5px" }}></span>
            <span className='text-stone-500 text-sm'>Or</span>
            <span className='flex-1 bg-stone-300' style={{ height: ".5px" }}></span>
          </div>
          <div className="mt-4 flex gap-3 text-base">
            <button className="bg-gray-50 shadow text-blue-700 p-2 rounded-lg w-full">
              Facebook
            </button>
            <button className="bg-gray-50 shadow text-red-700 p-2 rounded-lg w-full">
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
