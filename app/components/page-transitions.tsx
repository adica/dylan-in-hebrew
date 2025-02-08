"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);

    useEffect(() => {
        if (pathname) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setDisplayChildren(children);
                setIsTransitioning(false);
            }, 300); // Match this with CSS transition duration
            return () => clearTimeout(timer);
        }
    }, [pathname, children]);

    return (
        <div
            className={`transition-opacity duration-300 ease-in-out ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
        >
            {displayChildren}
        </div>
    );
};

export default PageTransition;
