import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../Input';

describe('Input', () => {
  it('renders correctly with a label', () => {
    const { getByText } = render(<Input label="Test Label" />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('updates its value on change', () => {
    const [value, setValue] = React.useState('');
    const { getByLabelText } = render(<Input label="Test Label" value={value} onChangeText={setValue} />);
    const input = getByLabelText('Test Label');
    fireEvent.changeText(input, 'new value');
    expect(value).toBe('new value');
  });

  it('displays an error message', () => {
    const { getByText } = render(<Input label="Test Label" error="Test Error" />);
    expect(getByText('Test Error')).toBeTruthy();
  });
});
