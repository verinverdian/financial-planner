'use client';

import { useState } from "react";

export default function Footer() {
    const [year] = useState<number>(new Date().getFullYear());

    return (
        <div>
            <hr />
            <div className="py-6 bg-gray-100 text-center">
                &copy; {year} FinanceTrack Co. All rights reserved.
            </div>
        </div>
    )
}