"use client"
import { fetchDataFromAPI } from '@/app/assets/api_functions';
import { ACTIVE_EMAIL, SUCCESS_STATUS } from '@/app/assets/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ActivePage: React.FC = () => {


    const router = useRouter()
    const [email, setEmail] = useState("")
    const [activeCode, setActiveCode] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [errorMess, setErrorMess] = useState("")
    const [isSuccessActive, setSuccessActive] = useState(false)

    useEffect(() => {
        let email: string = localStorage.getItem(ACTIVE_EMAIL) ?? ""
        email ? setEmail(email) : router.push("/login")
    }, [])

    const handleActive = async () => {
        setErrorMess("")
        setLoading(true)
        if (activeCode.length === 10) {
            let activeData = JSON.stringify({
                email,
                code: activeCode
            })
            const result: any = await fetchDataFromAPI(`public/activate-account`, "POST", "", activeData)
            if (result.status === SUCCESS_STATUS) {
                setSuccessActive(true)
                setLoading(false)
            } else {
                setErrorMess("Code is expired. Please try again.")
                setLoading(false)
            }

        }
        setLoading(false)
    }

    return (
        <div className='w-full min-h-screen bg-slate-100 flex flex-col items-center'>

            <div className={`active-box min-h-screen lg:min-h-fit rounded-md h-fit flex flex-col items-center justify-center lg:shadow-lg p-8 bg-slate-50 w-full lg:w-96 m-auto text-center`}>
                {
                    isSuccessActive ?
                        <p className={`text-base text-green-700`}>
                            Your account is actived.
                        </p>
                        :
                        <>
                            <h1 className='text-xl font-bold'>Active your account</h1>
                            <p className='text-sm mt-2'>Please check your email <strong>{email}</strong> for get the code</p>
                            <input
                                disabled={isLoading}
                                type='text'
                                id='code'
                                name="active-code"
                                maxLength={10}
                                minLength={10}
                                min={0}
                                placeholder='abc xyz 123'
                                onChange={(e) => setActiveCode(e.target.value)}
                                className='text-center w-52 p-4 border rounded-md bg-white mt-5 font-bold text-xl' />
                            <p className={` text-red-600 text-center mt-3 ${errorMess ? "block" : "hidden"}`}>
                                {errorMess}
                            </p>
                            <button
                                disabled={isLoading}
                                onClick={() => handleActive()}
                                className={`${errorMess ? "hidden" : "block"} w-52 font-bold bg-pink-600 text-white p-3 rounded-lg mt-5 transition-all
                 lg:hover:bg-slate-100 border-pink-600 border-2 lg:hover:text-pink-600`}>
                                {
                                    isLoading
                                        ?
                                        <LoadingSpinner className='w-6 h-6 border-white mx-auto ' />
                                        :
                                        <span className='text-sm'>
                                            Send
                                        </span>
                                }
                            </button>
                            <button
                                disabled={isLoading}
                                className={`${errorMess ? "block" : "hidden"}  w-52 font-bold bg-pink-600 text-white p-3 rounded-lg mt-5 transition-all
                 lg:hover:bg-slate-100 border-pink-600 border-2 lg:hover:text-pink-600`}>
                                {
                                    isLoading
                                        ?
                                        <LoadingSpinner className='w-6 h-6 border-white mx-auto ' />
                                        :
                                        <span className='text-sm'>
                                            Re-send code
                                        </span>
                                }
                            </button>

                        </>
                }
                <Link className='text-blue-700 text-center justify-center w-52 mt-5 text-sm flex items-center gap-1' href={"/login"}>
                    <svg className='w-4 h-4 fill-blue-700' viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <defs></defs><title />
                        <g data-name="Layer 2" id="Layer_2">
                            <path d="M13,26a1,1,0,0,1-.71-.29l-9-9a1,1,0,0,1,0-1.42l9-9a1,1,0,1,1,1.42,1.42L5.41,16l8.3,8.29a1,1,0,0,1,0,1.42A1,1,0,0,1,13,26Z" /><path d="M28,17H4a1,1,0,0,1,0-2H28a1,1,0,0,1,0,2Z" /></g><g id="frame">
                            <rect className="cls-1" height="32" width="32" />
                        </g>
                    </svg>
                    Back to login
                </Link>
            </div>
        </div>
    )
}

export default ActivePage