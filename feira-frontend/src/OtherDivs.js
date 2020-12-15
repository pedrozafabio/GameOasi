import React, { useState } from 'react'

export default function OtherDivs() {
    const [Kappa, setKappa] = useState([]);

    window.setKappa = setKappa;

    return (
        <div>
            {Kappa.map(x => {
                return(
                <div>
                    {x}
                </div>
                );
            })}
        </div>
    )
}
