import React from 'react';

interface DropdownMenuProps {
  selectedItem?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = (DropdownMenuProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = React.useState('');

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const handleSubmit = () => {
    setSelected('submit');
  };

  return (
    <div>
      <h1>Hello!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Pick a student:
          <select
            value={DropdownMenuProps.selectedItem}
            onChange={handleChange}
          >
            <option value='firstStudent'>First Student</option>
            <option value='secondStudent'>Second Student</option>
            <option value='thirdStudent'>Third Student</option>
            <option value='fourthStudent'>Fourth Student</option>
          </select>
        </label>
        <input type='submit' value='Submit' />
      </form>
    </div>
  );
};

export default DropdownMenu;
