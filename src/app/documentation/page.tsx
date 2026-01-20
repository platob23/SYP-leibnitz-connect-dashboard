"use client";

import "github-markdown-css/github-markdown.css";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const Page = () => {
    const [readme, setReadme] = useState("");

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/platob23/SYP-leibnitz-connect-dashboard/main/README.md")
            .then(res => res.text())
            .then(setReadme);
    }, []);

    return (
        <div className="markdown-body">
            <ReactMarkdown>{readme}</ReactMarkdown>
        </div>
    );
};

export default Page;
