/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { render, screen } from '@testing-library/react';
import { useTheme } from '../../hooks/Theme.hooks';
import themes from '../../utils/Themes';
import { Theme } from '../../utils/Types';
import CheckList from '../../components/CheckList';

jest.mock('../../hooks/Theme.hooks');
const mockTheme = useTheme as jest.Mock<Theme>;

const mockHook = () => {
  mockTheme.mockReturnValue(themes[0]);
};

describe('Check List Component', () => {
  const testList = [
    { id: 'check1', detail: 'Check #1', isResolved: false },
    { id: 'check2', detail: 'Check #2', isResolved: true },
    { id: 'check3', detail: 'Check #3', isResolved: false }
  ];

  const testList2 = [
    { id: 'check1', detail: 'Check #1', isResolved: false },
    { id: 'check2', detail: 'Check #2', isResolved: true }
  ];

  beforeEach(() => mockHook());

  it('renders the component title', () => {
    render(<CheckList title={'test'} listItems={[]} />);

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('renders all details', () => {
    render(<CheckList title={'test'} listItems={testList} />);

    expect(screen.getByText('Check #1')).toBeInTheDocument();
    expect(screen.getByText('Check #2')).toBeInTheDocument();
    expect(screen.getByText('Check #3')).toBeInTheDocument();
  });

  it('checks checkboxes that should be checked', () => {
    render(<CheckList title={'test'} listItems={testList} />);

    expect(screen.getByTestId('testCheckbox0')).not.toBeChecked();
    expect(screen.getByTestId('testCheckbox1')).toBeChecked();
    expect(screen.getByTestId('testCheckbox2')).not.toBeChecked();
  });

  it('renders all buttons"', () => {
    render(<CheckList title={'test'} listItems={testList2} />);

    expect(screen.getByTestId('convertButton')).toBeInTheDocument();
    expect(screen.getByTestId('deleteButton')).toBeInTheDocument();
    expect(screen.getByText('Add New Risk')).toBeInTheDocument();
  });

  it('renders the header right', () => {
    render(<CheckList title="test" headerRight="testheaderright" listItems={[]} />);

    expect(screen.getByText('testheaderright')).toBeInTheDocument();
  });
});
