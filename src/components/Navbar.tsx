import React from 'react';
import {SidebarTrigger} from "@/components/ui/sidebar";

function Navbar() {
    return (
        <nav className={"flex h-14 items-center justify-between sticky top-0 z-10 bg-black border-b opacity-80"}>
            <SidebarTrigger/>

        </nav>
    );
}

export default Navbar;
