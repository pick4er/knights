import React from 'react';

import { IKnight } from '../../types';

import './index.css';

interface ListProps {
  knights: IKnight[];
  onKnightHover: (knight: IKnight) => void;
  onKnightLeave?: () => void;
}

const List: React.FC<ListProps> = ({ 
  knights, 
  onKnightHover, 
  onKnightLeave,
}) => {
  return (
    <div className="Knights">
      <div className="Scroller">
        <table>
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            { knights.map((knight: IKnight) => {
                const { 
                  bikeid, 
                  starttime, 
                  tripduration,
                } = knight;

                return (
                  <tr 
                    key={`${bikeid} ${starttime}`} 
                    onMouseEnter={() => onKnightHover(knight)}
                    onMouseLeave={onKnightLeave}
                  >
                    <td>{ knight['start station name'] }</td>
                    <td>{ knight['end station name'] }</td>
                    <td>{ tripduration }</td>
                  </tr>
                )
            }) }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default List;
