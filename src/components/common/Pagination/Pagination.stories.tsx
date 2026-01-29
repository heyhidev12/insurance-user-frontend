import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Pagination from './index';

const meta: Meta<typeof Pagination> = {
  title: 'Design System/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: 'number',
      description: '현재 페이지',
    },
    totalPages: {
      control: 'number',
      description: '전체 페이지 수',
    },
    visiblePages: {
      control: 'number',
      description: '표시할 페이지 버튼 수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    visiblePages: 4,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    visiblePages: 4,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    visiblePages: 4,
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 3,
    visiblePages: 4,
  },
};

// Interactive example
const InteractivePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div>
      <p style={{ color: '#F0F0F0', marginBottom: '16px', fontSize: '14px' }}>
        현재 페이지: {currentPage} / {totalPages}
      </p>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        visiblePages={4}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractivePagination />,
};
