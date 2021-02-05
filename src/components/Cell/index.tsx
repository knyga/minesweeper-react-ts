import React from 'react';
import classNames from 'classnames';
import { Mark } from '../../consts/types';
import './styles.css';

export type CellProps = {
    isMined: boolean,
    isBomb: boolean,
    isExploded: boolean,
    mark: Mark,
    value: number,
    onClick?: any,
    onContextMenu?: any,
}

export const defaultCellProps: CellProps = {
    isMined: false,
    isBomb: false,
    isExploded: false,
    mark: 0,
    value: 0,
};

export default function Cell(props: CellProps) {
    const { isMined, isBomb, isExploded, value, mark, onClick, onContextMenu } = props;
    let printValue: string = '';
    if (isMined) {
        if (isBomb) {
            printValue = '☀';
        } else if(value > 0) {
            printValue = value.toString();
        }
    } else {
        if (mark === Mark.Bomb) {
            printValue = '!';
        } else if(mark === Mark.Unknown) {
            printValue = '?';
        }
    }
    return (<td
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={classNames({
            isMined,
            isExploded,
            cell: true,
            [`cell${value}`]: !isBomb
        })}>
        { printValue }
    </td>)
}
