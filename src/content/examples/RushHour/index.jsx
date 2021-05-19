import React, {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import classNames from 'classnames';
import {Movable} from 'webrix/components';
import './style.scss';

const {move, update, contain, snap, relative} = Movable.Operations;
const SQUARE_SIZE = 60;
const BOARD = [
    {coords: [4, 3], color: '#ff9f1a', vertical: true},
    {coords: [4, 1], color: '#20bf6b', vertical: true},
    {coords: [2, 0], color: '#6c5ce7', vertical: true},
    {coords: [2, 3], color: '#e056fd', vertical: true},
    {coords: [1, 1], color: '#17c0eb', vertical: true},
    {coords: [0, 2], color: '#67e6dc', vertical: true},
    {coords: [5, 2], color: '#6a89cc', vertical: true},
    {coords: [3, 3], color: '#6a89cc', vertical: true},
    {coords: [5, 3], color: '#38ada9', vertical: true},
    {coords: [5, 1], color: '#a4b0be', vertical: true},
    {coords: [3, 0], color: '#0984e3'},
    {coords: [4, 5], color: '#fad390'},
    {coords: [1, 5], color: '#636e72'},
    {coords: [2, 2], color: 'red'},
];

const getInitState = card => {
    return card.reduce((acc, { vertical, coords, color }) => ({
            ...acc,
            [color]: {position: getPosition(coords), vertical},
        }), {}
    );
}
const getCells = (position, vertical, boardPos) => {
    const root = getCoords(position, boardPos);
    return vertical
        ? [root, { col: root.col, row: root.row + 1 }]
        : [root, { col: root.col + 1, row: root.row }];
};

const isCollide = (car1, car2) =>
    car1.some(loc1 =>
        car2.some(loc2 => loc2.col === loc1.col && loc2.row === loc1.row)
    );

const isBlocked = (position, color, cars, board) => {
    const {top, left} = board.current.getBoundingClientRect();
    const currentCarCells = getCells(position, cars[color].vertical, {top, left});
    return Object.entries(cars).some(([key, c]) =>
        key !== color && isCollide(currentCarCells, getCells(c.position, c.vertical, {top, left}))
    );
}

const getPosition = ([col, row]) => ({
    top: row * SQUARE_SIZE,
    left: col * SQUARE_SIZE,
});

const getCoords = ({ top, left }, boardPos) => ({
    col: (left - boardPos.left) / SQUARE_SIZE,
    row: (top - boardPos.top) / SQUARE_SIZE,
});

const Car = ({ container, color, vertical, position, setPosition }) => {
    const movable = useRef();
    const handleOnUpdate = useCallback(({ top, left }) =>
            setPosition(color, vertical ? { ...position, top } : { ...position, left })
        ,[vertical, position, setPosition]
    );
    const {top, left} = container.current.getBoundingClientRect();
    const props = Movable.useMove(
        useMemo(() => [
            move(movable),
            contain(movable, container),
            relative(container),
            snap(SQUARE_SIZE, SQUARE_SIZE),
            update(handleOnUpdate),
        ], [container, handleOnUpdate, top, left])
    );
    return (
        <Movable
            className={classNames('car', { vertical })}
            ref={movable}
            style={{ ...position, backgroundColor: color }}
            {...props}
        />
    );
};

export default () => {
    const board = useRef();
    const [state, setState] = useState({});
    const setPosition = useCallback((color, position) => (
            setState(lastState => !isBlocked(position, color, lastState, board)
                ? ({...lastState, [color]: {...lastState[color], position}})
                : lastState)
        ),[board]
    );

    useEffect(() => {
        setState(getInitState(BOARD));
    }, [])

    return (
        <div className='board' ref={board}>
            {Object.entries(state).map(([key, props]) => (
                <Car key={key} container={board} color={key}
                     setPosition={setPosition} {...props}/>
            ))}
        </div>
    );
};
