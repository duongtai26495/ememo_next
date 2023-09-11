"use client"
import { fetchDataFromAPI } from '@/app/assets/api_functions';
import { ACTIVE_EMAIL, SUCCESS_STATUS } from '@/app/assets/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
  const router = useRouter()
  const [f_name, setF_name] = useState("")
  const [l_name, setL_name] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gender, setGender] = useState("MALE")
  const [isLoading, setLoading] = useState(false)
  const [errorMess, setErrorMess] = useState("")

  const handleRegister = async () => {
    setLoading(true)
    let userRegister = JSON.stringify({
      f_name,
      l_name,
      username,
      email,
      password,
      gender
    })
    const result: any = await fetchDataFromAPI("public/sign-up", "POST", undefined, userRegister)
    if (result.status === SUCCESS_STATUS) {
      localStorage.setItem(ACTIVE_EMAIL, email)
      await sendActiveEmail()
    }
    setLoading(false)
  }

  const sendActiveEmail = async () => {
    const resultSendEmail: any = await fetchDataFromAPI(`public/send-active-mail?email=${email}`, "GET")
      if (resultSendEmail.status === SUCCESS_STATUS) {
        setLoading(false)
        router.push("/active-account")
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 background-page">
      <div className="lg:bg-white bg-opacity-80 p-8 rounded-lg lg:shadow-lg w-full lg:w-96">
        <h2 className="text-2xl font-semibold mb-4">Đăng Ký</h2>
        <div className="mb-4">
          <label htmlFor="firstname" className="block text-gray-600 font-medium mb-2 text-sm">Tên</label>
          <input
            defaultValue={f_name}
            onChange={(e) => setF_name(e.target.value)}
            type="text"
            id="firstname"
            name="firstname"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastname" className="block text-gray-600 font-medium mb-2 text-sm">Họ</label>
          <input
            defaultValue={l_name}
            onChange={(e) => setL_name(e.target.value)}
            type="text"
            id="lastname"
            name="lastname"
            className="w-full p-4 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 font-medium mb-2 text-sm">Email</label>
          <input
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            name="email"
            className="w-full p-4 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-600 font-medium mb-2 text-sm">Tên Đăng Nhập</label>
          <input

            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="username"
            name="username"
            className="w-full p-4 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 font-medium mb-2 text-sm">Mật Khẩu</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            className="w-full p-4 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
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
        </div>
        <div
          onClick={() => handleRegister()}
          className="mb-4">
          <button type="submit" className="w-full bg-zinc-700 lg:hover:bg-zinc-900 transition-all text-white py-4 rounded-md ">
            {
              isLoading
                ?
                <LoadingSpinner className={`w-6 h-6 mx-auto`} />
                :
                <span className={``}>Đăng ký</span>
            }
          </button>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Bạn đã có tài khoản? <Link href="/login" className="text-blue-500">Đăng Nhập</Link></p>
        </div>
        <div className='w-full flex gap-5 my-3 justify-between items-center'>
          <span className='flex-1 bg-stone-300' style={{ height: ".5px" }}></span>
          <span className='text-stone-500 text-sm'>Or</span>
          <span className='flex-1 bg-stone-300' style={{ height: ".5px" }}></span>
        </div>
        <div className='w-full flex gap-2 items-center mt-3'>
          <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
            Google
          </button>
          <button className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900">
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
