import React from 'react'

const ScrollableTable = ({ children }: { children: React.ReactNode }) => (
    <div className="max-h-[144px] overflow-y-auto scrollbar-hide">{children}</div>
)

export default ScrollableTable