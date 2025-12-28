import React from 'react'

type ScrollableTableProps = {
    children: React.ReactNode;
    maxHeight?: number | string;
}

const ScrollableTable = ({
    children,
    maxHeight = 144, // default value
}: ScrollableTableProps) => {
    return (
        <div
            className='overflow-y-auto scrollbar-hide'
            style={{
                maxHeight:
                    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
            }}
        >
            {children}
        </div>
    );
}

export default ScrollableTable