"use client"
import { fetchDataFromAPI } from '@/app/utils/api_functions';
import { ACTIVATE_EMAIL, SUCCESS_STATUS } from '@/app/assets/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import {useTranslations} from 'next-intl';

const RegisterPage: React.FC = () => {
  
  const router = useRouter()
  const [f_name, setF_name] = useState("")
  const [l_name, setL_name] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gender, setGender] = useState("MALE")
  const [isLoading, setLoading] = useState(false)
  const [fNameErrMsg, setfNameErrMsg] = useState("")
  const [lNameErrMsg, setlNameErrMsg] = useState("")
  const [usernameErrMsg, setUsernameErrMsg] = useState("")
  const [emailErrMsg, setEmailErrMsg] = useState("")
  const [passwordErrMsg, setPasswordErrMsg] = useState("")
  const [summaryErrMsg, setSumErrMsg] = useState("")

  const fNameRef = useRef(null)
  const lNameRef = useRef(null)
  const emailRef = useRef(null)
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)
  const submitRef = useRef(null)

  const validateInput = async () => {
    let validCheck: boolean = true
    setLoading(true)
    if (f_name.length < 3) {
      setfNameErrMsg("First name must have more than 3 characters")
      validCheck = false
    } else {
      setfNameErrMsg("")
    }

    if (l_name.length < 3) {
      setlNameErrMsg("Last name must have more than 3 characters")
      validCheck = false
    } else {
      setlNameErrMsg("")
    }

    if (email.length < 3 && !validateEmail(email)) {
      setEmailErrMsg("Email format is incorrect")
      validCheck = false
    } else {
      setEmailErrMsg("")
    }

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
      await handleRegister()
    } else {
      setSumErrMsg("Something went wrong. Please check again !!!")
      setLoading(false)
    }
  }

  const validateEmail = (inputEmail: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(inputEmail);
  };
  const handleRegister = async () => {
    let userRegister = JSON.stringify({
      f_name,
      l_name,
      username,
      email,
      password
      // gender
    })
    const result: any = await fetchDataFromAPI("public/sign-up", "POST", undefined, userRegister)
    if (result && result.status === SUCCESS_STATUS) {
      localStorage.setItem(ACTIVATE_EMAIL, email)
      await sendActiveEmail()
      setLoading(false)
    } else {
      setSumErrMsg(result.msg)
      setLoading(false)
    }
  }

  const sendActiveEmail = async () => {
    const resultSendEmail: any = await fetchDataFromAPI(`public/send-activate-mail?email=${email}`, "GET")
    if (resultSendEmail.status === SUCCESS_STATUS) {
      setLoading(false)
      router.push("/activate-account")
    }
  }

  const handleNextInput = (e: any, ref: any) => {
    if (e.key === 'Enter') {
      ref.current.focus()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="flex w-full lg:w-fit rounded-lg lg:shadow-lg overflow-hidden">
        <div className='hidden lg:flex w-full background-page' style={{ backgroundImage: "url(https://source.unsplash.com/random)" }}></div>
        <div className='lg:bg-white p-8 max-w-sm lg:max-w-lg authen-box mx-auto'>
          <h2 className="text-2xl font-semibold mb-4">Register</h2>
          <div className='flex gap-3 items-center'>
            <div className="mb-4 flex flex-col w-full">
              <label htmlFor="firstname" className="block text-gray-600 font-medium mb-2 text-sm">Tên</label>
              <input
                disabled={isLoading}
                ref={fNameRef}
                autoFocus
                onKeyDown={(e) => handleNextInput(e, lNameRef)}
                defaultValue={f_name}
                onChange={(e) => setF_name(e.target.value)}
                type="text"
                id="firstname"
                name="firstname"
                className={`${fNameErrMsg ? "border-red-500" : ""} w-full p-3 border rounded-md`}
                required
                placeholder='John'
              />
              <span className='text-xs text-red-500 h-4 w-full'>{fNameErrMsg}</span>
            </div>
            <div className="mb-4 flex flex-col w-full">
              <label htmlFor="lastname" className="block text-gray-600 font-medium mb-2 text-sm">Họ</label>
              <input
                disabled={isLoading}
                onKeyDown={(e) => handleNextInput(e, emailRef)}
                ref={lNameRef}
                defaultValue={l_name}
                onChange={(e) => setL_name(e.target.value)}
                type="text"
                id="lastname"
                name="lastname"
                className={`w-full p-3 border rounded-md ${lNameErrMsg ? "border-red-500" : ""} `}
                required
                placeholder='Smith'
              />
              <span className='text-xs text-red-500 h-4 w-full'>{lNameErrMsg}</span>
            </div>
          </div>
          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-2 text-sm">Email</label>
            <input
              disabled={isLoading}
              onKeyDown={(e) => handleNextInput(e, usernameRef)}
              ref={emailRef}
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              className={`w-full p-3 border rounded-md ${emailErrMsg ? "border-red-500" : ""} `}
              required
              placeholder='johnsmith123@gmail.com'
            />
            <span className='text-xs text-red-500 h-2 w-full'>{emailErrMsg}</span>
          </div>
          <div className="mb-4 flex flex-col">
            <label htmlFor="username" className="block text-gray-600 font-medium mb-2 text-sm">Tên Đăng Nhập</label>
            <input
              disabled={isLoading}
              ref={usernameRef}
              onKeyDown={(e) => handleNextInput(e, passwordRef)}
              defaultValue={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              name="username"
              className={`w-full p-3 border rounded-md ${usernameErrMsg ? "border-red-500" : ""} `}
              required
              placeholder='johnsmith123'
            />
            <span className='text-xs text-red-500 h-2 w-full'>{usernameErrMsg}</span>
          </div>
          <div className="mb-4 flex flex-col">
            <label htmlFor="password" className="block text-gray-600 font-medium mb-2 text-sm">Mật Khẩu</label>
            <input
              disabled={isLoading}
              ref={passwordRef}
              onKeyDown={(e) => handleNextInput(e, submitRef)}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              className={`w-full p-3 border rounded-md ${passwordErrMsg ? "border-red-500" : ""} `}
              required
              placeholder='john2023@'
            />
            <span className='text-xs text-red-500 h-2 w-full'>{passwordErrMsg}</span>
          </div>
          {/* <div className="mb-4">
          <label htmlFor="gender" className="block text-gray-600 font-medium mb-2 text-sm">Giới Tính</label>
          <select
            id="gender"
            name="gender"
            className="w-full p-4 border rounded-md text-sm"
            required
            defaultValue={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="UNKNOWN">Không Xác Định</option>
          </select>
        </div> */}
          <div
            onClick={() => validateInput()}
            className="mb-4 flex flex-col items-center">
            <button
              disabled={isLoading}
              ref={submitRef}
              type="submit"
              className={`${summaryErrMsg !== "" ? "shake-button " : ""}w-full bg-zinc-700 lg:hover:bg-zinc-900 transition-all text-white py-4 rounded-md`}>
              {
                isLoading
                  ?
                  <LoadingSpinner className={`w-6 h-6 mx-auto`} />
                  :
                  <span className={``}>Đăng ký</span>
              }
            </button>
            <span className='text-sm mt-2 text-red-500 h-2 text-center font-bold w-full'>{summaryErrMsg}</span>
          </div>

          <div className="text-center">
            <p className="text-gray-600">Bạn đã có tài khoản? <Link href="/login" className="text-blue-500">Đăng Nhập</Link></p>
          </div>
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

export default RegisterPage;
