import PageNavbar from '@/components/PageNavbar'
import React from 'react'

async function layout(
    {
        children
    }: {
        children: React.ReactNode
    }
) {

    return (
        <div className='w-full'>
            <PageNavbar />
            {children}
        </div>
    )
}

export default layout