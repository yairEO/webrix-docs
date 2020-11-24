import {useLocation} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {Highlighter} from 'components';

export default ({ext}) => {
    const {pathname} = useLocation();
    const [code, setCode] = useState('');

    useEffect(() => {
        (async () => {
            const file = ext === 'scss' ? 'style.scss' : 'index.jsx';
            const code = await import(`!raw-loader!../../../../routes/Docs/content/examples/${pathname.split('/')[2]}/${file}`);
            setCode(code.default.trim());
        })();
    }, [ext]);

    return (
        <Highlighter code={code} language={ext}/>
    )
};