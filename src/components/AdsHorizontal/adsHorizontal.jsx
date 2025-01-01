import React, { useEffect } from 'react';

const AdComponent = () => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    return (
        <div>
            <ins className="adsbygoogle"
             style={{ display: 'block', backgroundColor: "white" }}
             data-ad-client="ca-pub-8031141340234257"
             data-ad-slot="6331633340"
             data-ad-format="auto"
             data-full-width-responsive="true">
        </ins>
        </div>
        // <ins className="adsbygoogle"
        //      style={{ display: 'block', backgroundColor: "white" }}
        //      data-ad-client="ca-pub-8031141340234257"
        //      data-ad-slot="6331633340"
        //      data-ad-format="auto"
        //      data-full-width-responsive="true">
        // </ins>
    );
};

export default AdComponent;