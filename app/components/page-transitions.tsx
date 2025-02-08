"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [displayedPath, setDisplayedPath] = useState(pathname);

    // Prevent animation from triggering twice
    useEffect(() => {
        setDisplayedPath(pathname);
    }, [pathname]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={displayedPath} // Ensures animation only runs once per navigation
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
