import React from 'react';

import './index.css';

type KnightType = {
  bikeid: number,
  starttime: string,
  tripduration: number,
  ['start station name']: string,
  ['end station name']: string,
}

type ListProps = {
  knights: KnightType[],
}

const List: React.FC<ListProps> = ({ knights }) => {
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
            { knights.map((knight: KnightType) => {
                const { 
                  bikeid, 
                  starttime, 
                  tripduration,
                } = knight;

                return (
                  <tr key={`${bikeid} ${starttime}`}>
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
