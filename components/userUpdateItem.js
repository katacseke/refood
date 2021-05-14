import { useState } from 'react';
import {
  Button,
  FormFeedback,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'shards-react';

const UserUpdateItem = ({ initialValue, onUpdate, name, icon }) => {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    if (active) {
      setError(await onUpdate(name, value));
    }

    if (name === 'password') {
      setValue(active ? initialValue : '');
    }

    setActive(!active);
  };

  return (
    <InputGroup className="mb-2">
      <InputGroupAddon type="prepend">
        <InputGroupText>{icon}</InputGroupText>
      </InputGroupAddon>
      <FormInput
        name={name}
        type={name === 'password' ? 'password' : 'text'}
        value={value}
        disabled={!active}
        onChange={(e) => setValue(e.target.value)}
        invalid={!!error}
      />
      <InputGroupAddon type="append">
        <Button theme={active ? 'primary' : 'secondary'} onClick={handleClick}>
          {active ? 'Mentés' : 'Csere'}
        </Button>
      </InputGroupAddon>

      <FormFeedback>{error}</FormFeedback>
    </InputGroup>
  );
};

export default UserUpdateItem;
