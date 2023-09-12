'use client'
import { fetchDataFromAPI } from '@/app/assets/api_functions';
import { RememberMe, SUCCESS_STATUS, USERNAME_LOCAL, ACCESS_TOKEN, REFRES_TOKEN } from '@/app/assets/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LoginPage: React.FC = () => {

  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isRemember, setRemember] = useState(false)
  const [isLoading, setLoading] = useState(false)

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
      
      if (isRemember) {
        localStorage.setItem(USERNAME_LOCAL, username)
        localStorage.setItem(RememberMe, JSON.stringify(isRemember))
      }
      let waitingRouter = setTimeout(()=>{
        router.push("/")
      },1500)

      return () => clearTimeout(waitingRouter)
    }
    setLoading(false)
  }

  useEffect(() => {
    let rememberme: boolean = Boolean(localStorage.getItem(RememberMe))
    if (rememberme) {
      let username: string = localStorage.getItem(USERNAME_LOCAL) ?? ""
      setUsername(username)
    }
    setRemember(rememberme)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full lg:w-fit rounded-lg lg:shadow-lg overflow-hidden">
        <div className='hidden lg:flex w-full background-page' style={{backgroundImage:"url(https://source.unsplash.com/random)"}}></div>
        <div className='lg:bg-white p-8 w-full authen-box'>
        <h1 className="text-2xl font-semibold mb-4">Đăng nhập</h1>
        <div className=''>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600 mb-1">Tên người dùng</label>
            <input
              defaultValue={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              className="w-full border rounded-lg p-4"
              placeholder='user123' />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 mb-1">Mật khẩu</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full border rounded-lg p-4"
              placeholder='***' />
          </div>
          <div className="mb-4">
            <label>
              <input
                defaultChecked={isRemember}
                onChange={(e) => setRemember(e.target.checked)}
                type="checkbox"
                className="mr-2" />
              Ghi nhớ tài khoản
            </label>
          </div>
          <button
            disabled={isLoading}
            onClick={() => loginHandle()}
            className="bg-zinc-800 shadow-md lg:hover:bg-zinc-900 transition-all text-white p-4 rounded-lg w-full">
            {
              isLoading
                ?
                <LoadingSpinner className={`w-6 h-6 mx-auto`} />
                :
                <span className={``}>Đăng nhập</span>
            }
          </button>
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
