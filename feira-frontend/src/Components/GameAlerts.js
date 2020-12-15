import React, { useEffect } from 'react'

export default function GameAlerts() {
    const [alerts, setAlerts] = useState([]);

    const addAert = (textContent) => {
        setAlerts([...alerts, textContent]);
    }

    useEffect(() => {
        window.ThreeAlert = window.ThreeAlert ?? {};
        window.ThreeAlert.AddAlert = addAert;
    });

    return (
        <div>
            
        </div>
    )
}
