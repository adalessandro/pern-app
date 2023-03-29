import React, { useState } from 'react';

import List from './List'
import Form from './Form'
import { User } from '@backend/models';

const Entity: React.FC = () => {
  const [menu, setMenu] = useState('list');
  const [entity, setEntiy] = useState<User | undefined>(undefined);

  const back = () => {
    setEntiy(undefined);
    setMenu('list');
  }

  const edit = (entity: User) => {
    setEntiy(entity);
    setMenu('form');
  }
  const create = () => {
    setEntiy(undefined);
    setMenu('form');
  }

  return (
    <>
      {menu === 'list' &&
        <List edit={edit} create={create} />
      }
      {menu === 'form' &&
        <Form back={back} entity={entity} />
      }
    </>
  );
}

/* <Form back={back} entity={entity} /> */

export default Entity;
