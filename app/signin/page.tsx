import { SignIn } from '@clerk/nextjs';
import React from 'react'

function signin() {
    return (
        <div className='flex justify-center items-center h-screen'>
            <SignIn />
        </div>
    )
}

export default signin;