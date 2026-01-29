import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import IconCheck, { IconCheckProps } from './index';

const meta: Meta<typeof IconCheck> = {
  title: 'Design System/IconCheck',
  component: IconCheck,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['square', 'round-sm', 'round-lg'],
      description: '체크박스 모양',
    },
    checked: {
      control: 'boolean',
      description: '체크 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconCheck>;

// Interactive wrapper for controlled state
const InteractiveIconCheck = (args: IconCheckProps) => {
  const [checked, setChecked] = useState(args.checked || false);
  return <IconCheck {...args} checked={checked} onChange={setChecked} />;
};

export const Default: Story = {
  render: (args) => <InteractiveIconCheck {...args} />,
  args: {
    variant: 'square',
    checked: false,
    disabled: false,
  },
};

export const Square: Story = {
  render: (args) => <InteractiveIconCheck {...args} />,
  args: {
    variant: 'square',
    checked: false,
  },
};

export const SquareChecked: Story = {
  render: (args) => <InteractiveIconCheck {...args} />,
  args: {
    variant: 'square',
    checked: true,
  },
};

export const RoundSmall: Story = {
  render: (args) => <InteractiveIconCheck {...args} />,
  args: {
    variant: 'round-sm',
    checked: false,
  },
};

export const RoundSmallChecked: Story = {
  render: (args) => <InteractiveIconCheck {...args} />,
  args: {
    variant: 'round-sm',
    checked: true,
  },
};

export const RoundLarge: Story = {
  render: (args) => <InteractiveIconCheck {...args} />,
  args: {
    variant: 'round-lg',
    checked: false,
  },
};

export const RoundLargeChecked: Story = {
  render: (args) => <InteractiveIconCheck {...args} />,
  args: {
    variant: 'round-lg',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'square',
    checked: false,
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => {
    const [states, setStates] = useState({
      square: false,
      roundSm: false,
      roundLg: false,
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>
            Square (16x16)
          </h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <IconCheck variant="square" checked={false} />
            <IconCheck
              variant="square"
              checked={states.square}
              onChange={(c) => setStates((s) => ({ ...s, square: c }))}
            />
          </div>
        </div>

        <div>
          <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>
            Round Small (16x16)
          </h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <IconCheck variant="round-sm" checked={false} />
            <IconCheck
              variant="round-sm"
              checked={states.roundSm}
              onChange={(c) => setStates((s) => ({ ...s, roundSm: c }))}
            />
          </div>
        </div>

        <div>
          <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>
            Round Large (32x32)
          </h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <IconCheck variant="round-lg" checked={false} />
            <IconCheck
              variant="round-lg"
              checked={states.roundLg}
              onChange={(c) => setStates((s) => ({ ...s, roundLg: c }))}
            />
          </div>
        </div>
      </div>
    );
  },
};
