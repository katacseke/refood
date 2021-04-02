import React from 'react';
import { Controller } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { Badge, Container, FormInput, Button } from 'shards-react';

const DeletableBadge = ({ onDelete, children }) => (
  <Badge className="mr-1 pr-1 mb-1 d-inline-flex align-items-baseline">
    {children}
    <Button className="p-0 ml-1" onClick={() => onDelete(children)}>
      <IoClose />
    </Button>
  </Badge>
);

// eslint-disable-next-line no-unused-vars
const ChipInput = React.forwardRef(({ value, onChange, placeholder }, ref) => {
  const handleKeyDown = (e) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();

      const chip = e.target.value.trim();
      if (chip && !value.includes(chip)) {
        onChange([...value, chip]);
      }

      e.target.value = '';
    }
  };

  const handleDelete = (toBeDeleted) => {
    const updatedValue = value.filter((chip) => chip !== toBeDeleted);

    onChange(updatedValue);
  };

  console.log(placeholder);
  return (
    <>
      <Container className="pl-0 mb-1">
        {value.map((chip) => (
          <DeletableBadge key={chip} onDelete={handleDelete}>
            {chip}
          </DeletableBadge>
        ))}
      </Container>
      <FormInput type="text" placeholder={placeholder} onKeyDown={handleKeyDown} />
    </>
  );
});

const ChipInputController = ({ name, control, placeholder }) => (
  <Controller
    name={name}
    control={control}
    placeholder={placeholder}
    defaultValue={[]}
    as={ChipInput}
  />
);

export default ChipInputController;
