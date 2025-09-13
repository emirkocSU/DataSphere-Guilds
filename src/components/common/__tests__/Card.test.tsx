import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import Card from '../Card';

describe('Card', () => {
  it('renders its children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Test Child</Text>
      </Card>
    );
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <Card style={{ backgroundColor: 'blue' }} testID="card-container">
        <Text>Test Child</Text>
      </Card>
    );
    const card = getByTestId('card-container');
    expect(card.props.style).toMatchObject({ backgroundColor: 'blue' });
  });
});
