import type { Meta, StoryObj } from '@storybook/react';
import Icon, { IconType } from './index';

const meta: Meta<typeof Icon> = {
  title: 'Design System/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'check', 'check-gray', 'check-white', 'check-blue', 'check-gray-light',
        'close', 'close-white', 'circle-close',
        'search', 'user', 'user-white',
        'arrow-up', 'arrow-up-white', 'arrow-down', 'arrow-down-white',
        'arrow-left', 'arrow-left-gray', 'arrow-left-white',
        'arrow-right', 'arrow-right-gray', 'arrow-right-white',
        'arrow-left2-green', 'arrow-left2-gray', 'arrow-left2-white',
        'arrow-right2-green', 'arrow-right2-gray', 'arrow-right2-white',
        'plus', 'plus-gray', 'minus', 'minus-gray',
        'document', 'eye', 'eye-white', 'list-white', 'list-green',
        'info', 'info-gray', 'error', 'error-white',
        'call', 'location', 'mail', 'map', 'map-green',
        'calendar', 'calendar-white',
        'menu', 'menu-white', 'add', 'add-white', 'close-large', 'close-large-white',
      ],
      description: '아이콘 타입',
    },
    size: {
      control: 'select',
      options: [16, 20, 24, 40, 48],
      description: '아이콘 크기',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    type: 'check',
    size: 24,
  },
};

// Icon groups for showcase
const iconGroups: Record<string, IconType[]> = {
  'Check & Close': ['check', 'check-gray', 'check-white', 'check-blue', 'check-gray-light', 'close', 'close-white', 'circle-close'],
  'Arrows (Chevron)': ['arrow-up', 'arrow-up-white', 'arrow-down', 'arrow-down-white', 'arrow-left', 'arrow-left-gray', 'arrow-left-white', 'arrow-right', 'arrow-right-gray', 'arrow-right-white'],
  'Arrows (Navigation)': ['arrow-left2-green', 'arrow-left2-gray', 'arrow-left2-white', 'arrow-right2-green', 'arrow-right2-gray', 'arrow-right2-white'],
  'Plus & Minus': ['plus', 'plus-gray', 'minus', 'minus-gray'],
  'UI': ['search', 'user', 'user-white', 'eye', 'eye-white', 'list-white', 'list-green', 'document'],
  'Status': ['info', 'info-gray', 'error', 'error-white'],
  'Contact': ['call', 'location', 'mail', 'map', 'map-green', 'calendar', 'calendar-white'],
  'Large (40px)': ['menu', 'menu-white', 'add', 'add-white', 'close-large', 'close-large-white'],
};

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {Object.entries(iconGroups).map(([groupName, icons]) => {
        const isLarge = groupName.includes('Large');
        return (
          <div key={groupName}>
            <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
              {groupName}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              {icons.map((iconType) => (
                <div
                  key={iconType}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: iconType.includes('white') || iconType.includes('document') || iconType.includes('eye') ? '#2D2D2D' : 'transparent',
                    borderRadius: '8px',
                    minWidth: isLarge ? '100px' : '80px',
                  }}
                >
                  <Icon type={iconType} size={isLarge ? 40 : 24} />
                  <span style={{ color: '#8E8E8E', fontSize: '10px', textAlign: 'center' }}>
                    {iconType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>16px</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon type="info" size={16} />
          <Icon type="error" size={16} />
          <Icon type="map" size={16} />
          <Icon type="calendar" size={16} />
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>20px</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon type="check" size={20} />
          <Icon type="arrow-right" size={20} />
          <Icon type="search" size={20} />
          <Icon type="plus" size={20} />
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>24px</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon type="check" size={24} />
          <Icon type="arrow-right" size={24} />
          <Icon type="search" size={24} />
          <Icon type="user" size={24} />
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>40px</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon type="menu" size={40} />
          <Icon type="add" size={40} />
          <Icon type="close-large" size={40} />
        </div>
      </div>
    </div>
  ),
};

export const Arrows: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Chevron Arrows</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon type="arrow-left" size={24} />
          <Icon type="arrow-right" size={24} />
          <Icon type="arrow-up" size={24} />
          <Icon type="arrow-down" size={24} />
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Navigation Arrows (Green)</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon type="arrow-left2-green" size={24} />
          <Icon type="arrow-right2-green" size={24} />
        </div>
      </div>
      <div>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Navigation Arrows (Gray)</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon type="arrow-left2-gray" size={24} />
          <Icon type="arrow-right2-gray" size={24} />
        </div>
      </div>
      <div style={{ backgroundColor: '#2D2D2D', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>Navigation Arrows (White)</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon type="arrow-left2-white" size={24} />
          <Icon type="arrow-right2-white" size={24} />
        </div>
      </div>
    </div>
  ),
};

export const StatusIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon type="info" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Info</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon type="info-gray" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Info Gray</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon type="error" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Error</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', backgroundColor: '#2D2D2D', padding: '12px', borderRadius: '8px' }}>
        <Icon type="error-white" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Error White</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon type="check" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Success</span>
      </div>
    </div>
  ),
};

export const ContactIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon type="call" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Call</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon type="location" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Location</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon type="mail" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Mail</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon type="map" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Map</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon type="calendar" size={24} />
        <span style={{ color: '#8E8E8E', fontSize: '12px' }}>Calendar</span>
      </div>
    </div>
  ),
};

export const Clickable: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon type="close" size={24} onClick={() => alert('Close clicked!')} />
      <Icon type="search" size={24} onClick={() => alert('Search clicked!')} />
      <Icon type="user" size={24} onClick={() => alert('User clicked!')} />
    </div>
  ),
};
