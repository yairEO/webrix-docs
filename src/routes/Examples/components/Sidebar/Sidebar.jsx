import React, {useState, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import Search from '../Search/Search';
import Item from './Item';
import Preview from './Preview';
import ITEMS from '../../Examples.routes';
import './Sidebar.scss';

const Sidebar = () => {
    const reference = useRef();
    const [preview, setPreview] = useState();
    const [query, setQuery] = useState('');
    const {pathname} = useLocation();
    const items = ITEMS.filter(({title, tags}) => {
        const q = query.trim().toLowerCase();
        return title.toLowerCase().includes(q)
            || tags.some(tag => tag.toLowerCase().includes(q))
    });
    const onMouseEnter = (ref, path) => {
        reference.current = ref;
        setPreview(path);
    }

    return (
        <nav>
            <Search value={query} onChange={setQuery}/>
            <ul onMouseLeave={() => setPreview('')}>
                {items.length === 0 && <div className='no-results'>No examples found</div>}
                {items.map(({title, path, tags}) => (
                    <Item key={title} active={pathname === path} {...{title, path, tags, onMouseEnter}} />
                ))}
            </ul>
            <Preview reference={reference} path={preview}/>
        </nav>
    );
}

export default Sidebar;