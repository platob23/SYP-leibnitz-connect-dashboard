import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'

function Navbar() {
    return (
        <nav
            className="
        sticky top-0 z-10 flex h-14 items-center justify-between
        border-b
        bg-white/80 text-black
        backdrop-blur
        dark:bg-black/80 dark:text-white
      "
        >
            <SidebarTrigger />
        </nav>
    )
}

export default Navbar
