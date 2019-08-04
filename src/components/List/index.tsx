import React from 'react';
import moment from 'moment';

import { IKnight } from '../../types';

import './index.css';

interface IListProps {
  knights: IKnight[];
  onKnightHover: (knight: IKnight) => void;
  onKnightsLeave: () => void;
  isMobile: boolean;
}

function prepareCoords(coord: number): number {
  return Number(Number(coord).toFixed(5));
}

function prepareDate(date: string): string {
  return moment(date).format('D MMMM YYYY, HH:mm:ss');
}

const List: React.FC<IListProps> = ({ 
  knights, 
  onKnightHover, 
  onKnightsLeave,
  isMobile,
}) => {
  const [isListVisibleInMobileMode, setIsListVisible] = React.useState<boolean>(false);

  return (
    <>
      <button 
        type="button" 
        onClick={() => setIsListVisible(!isListVisibleInMobileMode)}
        className="Visibility-button"
      >
        { isListVisibleInMobileMode ? 'Hide list' : 'Show list' }
      </button>

      <div 
        className={`Knights ${isListVisibleInMobileMode && 'Knights_visible'}`}
        onMouseLeave={() => !isMobile && onKnightsLeave()}
      >
        <div className="Knights-header_scroller">
          <div className="Knights-header">
            <h3 className="Knights-header_start">Start</h3>
            <h3 className="Knights-header_end">End</h3>
            <h3 className="Knights-header_duration">Duration</h3>
          </div>
        </div>
        <div className="Knights-scroller">
          <div className="Knights-list">
            { knights.map((knight: IKnight) => {
                const { 
                  bikeid, 
                  starttime, 
                  tripduration,
                } = knight;

                return (
                  <div
                    key={`${bikeid} ${starttime}`} 
                    onMouseEnter={() => !isMobile && onKnightHover(knight)}
                    onClick={() => isMobile && onKnightHover(knight)}
                    className="Knights-list_row"
                  >
                    <div 
                      className="Knights-row"
                      title={knight['start station name']}
                    >
                      <span className="Knights-row_station">
                        { knight['start station name'] }
                      </span>
                      <span className="Knights-row_subline">
                        { prepareDate(knight['starttime']) }
                      </span>
                      <span className="Knights-row_subline">
                        Lat: { prepareCoords(knight['start station latitude']) }
                      </span>
                      <span className="Knights-row_subline">
                        Lng: { prepareCoords(knight['start station longitude']) }
                      </span>
                    </div>

                    <div 
                      className="Knights-row"
                      title={knight['end station name']}
                    >
                      <span className="Knights-row_station">
                        { knight['end station name'] }
                      </span>
                      <span className="Knights-row_subline">
                        { prepareDate(knight['stoptime']) }
                      </span>
                      <span className="Knights-row_subline">
                        Lat: { prepareCoords(knight['end station latitude']) }
                      </span>
                      <span className="Knights-row_subline">
                        Lng: { prepareCoords(knight['end station longitude']) }
                      </span>
                    </div>

                    <div className="Knights-row_duration">
                      { tripduration }
                    </div>
                  </div>
                )
            }) }
          </div>
        </div>
      </div>
    </>
  )
}

export default List;
