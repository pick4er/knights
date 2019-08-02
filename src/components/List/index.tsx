import React from 'react';

import { database } from '../../utils/firebase';

const List: React.FC = () => {
  React.useEffect(() => {
    const roadsRef = database
      .ref('/')
      .orderByKey()
      .limitToFirst(100);

    roadsRef
      .once('value')
      .then(snapshot => {
        console.log('shapshot.val():', snapshot.val());
      });
  });

  return (
    <div />
  )
}

export default List;
