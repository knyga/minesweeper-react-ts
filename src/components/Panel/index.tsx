import React, {useEffect, useState} from 'react';
import { CellProps } from '../Cell';
import { Mark, GameStatus } from '../../consts/types';
import './styles.css';

type PanelProps = {
    mineGrid: CellProps[][],
    restartGame: any,
    gameStatus: GameStatus,
}

export default function Panel({ mineGrid, restartGame, gameStatus }: PanelProps) {
    const [ seconds, setSeconds ] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setSeconds(seconds+1), 1600);
        return () => clearInterval(id);
    }, [seconds]);
    const bombsCount = mineGrid
        .reduce((cnt, row) => cnt + row
            .reduce((rowCnt, cell) => rowCnt + Number(cell.isBomb), 0), 0);
    const marksLeftCount = bombsCount - mineGrid
        .reduce((cnt, row) => cnt + row
            .reduce((rowCnt, cell) => rowCnt + Number(cell.mark === Mark.Bomb), 0), 0);

    return (
        <tr>
            <td className='score' colSpan={mineGrid.length}>
                <div className='counter mines'>{marksLeftCount}</div>
                <div className='counter timer'>{seconds}</div>
                <div onClick={restartGame} className='smile'>
                    { gameStatus === GameStatus.InProgress ? '🙂' : '😵'}
                </div>
            </td>
        </tr>
    );
}
