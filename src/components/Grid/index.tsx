import React, { useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { GameStatus } from '../../consts/types';
import Cell, { CellProps, defaultCellProps } from '../Cell';
import Panel from '../Panel';
import './styles.css';

const BOMB_PROBABILITY = 0.14;

const generateRandomMineGrid = ({rows, cols}: GridProps) => {
    const mineGrid: CellProps[][] = [];
    for(let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
        mineGrid.push([]);
        for(let colIndex = 0; colIndex < cols; colIndex += 1) {
            mineGrid[rowIndex][colIndex] = {
                ...defaultCellProps,
                isBomb: Math.random() < BOMB_PROBABILITY,
            };
        }
    }
    const checkIsBomb = (rowIndex: number, colIndex: number) => {
        try {
            return mineGrid[rowIndex][colIndex].isBomb
        } catch(e) {
            return false;
        }
    };
    for(let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
        for(let colIndex = 0; colIndex < cols; colIndex += 1) {
            mineGrid[rowIndex][colIndex].value = [
                checkIsBomb(rowIndex - 1, colIndex - 1),
                checkIsBomb(rowIndex - 1, colIndex),
                checkIsBomb(rowIndex - 1, colIndex + 1),
                checkIsBomb(rowIndex, colIndex - 1),
                checkIsBomb(rowIndex, colIndex + 1),
                checkIsBomb(rowIndex + 1, colIndex - 1),
                checkIsBomb(rowIndex + 1, colIndex),
                checkIsBomb(rowIndex + 1, colIndex + 1),
            ].reduce((acc, booleanValue) => acc + Number(booleanValue), 0);
        }
    }

    return mineGrid;
};

type GridProps = {
    cols: number,
    rows: number,
}

export default function Grid(props: GridProps) {
    const { cols, rows } = props;
    const [ mineGrid, setMineGrid ] = useState(generateRandomMineGrid(props));
    const [ gameStatus, setGameStatus ] = useState(GameStatus.InProgress);
    const markCell = (rowIndex: number, colIndex: number) => {
        if (gameStatus !== GameStatus.InProgress || mineGrid[rowIndex][colIndex].isMined) {
            return;
        }

        const newMineGrid = cloneDeep(mineGrid);
        newMineGrid[rowIndex][colIndex].mark = (newMineGrid[rowIndex][colIndex].mark + 1) % 3;
        setMineGrid(newMineGrid);
    };
    const openCell = (startRowIndex: number, startColIndex: number) => {
        if (gameStatus !== GameStatus.InProgress) {
            return;
        }

        const newMineGrid = cloneDeep(mineGrid);
        newMineGrid[startRowIndex][startColIndex].isExploded = newMineGrid[startRowIndex][startColIndex].isBomb;
        newMineGrid[startRowIndex][startColIndex].isMined = true;
        const stack = [[startRowIndex, startColIndex]];
        const checkedSet = new Set();
        while(stack.length) {
            // @ts-ignore
            const [rowIndex, colIndex] = stack.pop();
            const globalIndex = rowIndex * cols + colIndex;
            if(rowIndex >= 0 && rowIndex < rows && colIndex >= 0 && colIndex < cols
                && !checkedSet.has(globalIndex)
                && !newMineGrid[rowIndex][colIndex].isBomb) {
                checkedSet.add(globalIndex);
                newMineGrid[rowIndex][colIndex].isMined = true;

                if (newMineGrid[rowIndex][colIndex].value === 0) {
                    stack.push(...[
                        [rowIndex - 1, colIndex - 1],
                        [rowIndex - 1, colIndex],
                        [rowIndex - 1, colIndex + 1],
                        [rowIndex, colIndex - 1],
                        [rowIndex, colIndex + 1],
                        [rowIndex + 1, colIndex - 1],
                        [rowIndex + 1, colIndex],
                        [rowIndex + 1, colIndex + 1],
                    ]);
                }
            }
        }

        if (newMineGrid[startRowIndex][startColIndex].isBomb) {
            setGameStatus(GameStatus.Lost);
        }
        setMineGrid(newMineGrid);
    };
    const restartGame = () => {
        setMineGrid(generateRandomMineGrid({ rows, cols }));
        setGameStatus(GameStatus.InProgress);
    };

    return (<table className='grid'>
        <thead>
        <Panel mineGrid={mineGrid} restartGame={restartGame} gameStatus={gameStatus} />
        </thead>
        <tbody>
        {mineGrid.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, colIndex) => (
                    <Cell
                        key={cols * rowIndex + colIndex}
                        {...cell}
                        onContextMenu={(e: any) => {
                            markCell(rowIndex, colIndex);
                            e.preventDefault();
                            return false;
                        }}
                        onClick={() => openCell(rowIndex, colIndex)}
                    />
                ))
            }</tr>
        ))}
        </tbody>
    </table>)
}
