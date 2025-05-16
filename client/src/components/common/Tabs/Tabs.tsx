import React, { useState } from 'react';
import { Tab, Nav, Button, TabPaneProps, Dropdown } from 'react-bootstrap';
import { ChevronDown } from 'react-bootstrap-icons';
import { Loader } from 'src/components/common/Loader';
interface TabsProps extends React.PropsWithChildren<unknown> {
  variant?: 'tabs' | 'pills' | 'underline' | string;
  id: string;
  defaultActiveKey?: string;
  className?: string;
  loading?: boolean;
}

const CustomToggle = React.forwardRef(
  (
    {
      children,
      onClick,
    }: { children: React.ReactNode; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void },
    ref: React.Ref<HTMLButtonElement>
  ) => (
    <Button
      ref={ref}
      variant="outline-light"
      className={`border br-2 px-4 py-2 rounded-3 text-decoration-none text-dark d-flex justify-content-between align-items-center fw-bold w-100`}
      onClick={(e): void => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </Button>
  )
);

export const Tabs: React.FC<TabsProps> = ({
  variant = 'underline',
  className,
  children,
  defaultActiveKey,
  id,
  loading,
}) => {
  const [activeKey, setActiveKey] = useState<string | undefined>(defaultActiveKey);

  const childrenArray = React.Children.toArray(children);
  const titles = childrenArray.map((child) => {
    const tabChild = child as React.ReactElement<TabPaneProps>;
    return {
      eventKey: tabChild.props.eventKey,
      title: tabChild.props.title,
    };
  });

  return (
    <Tab.Container id={id} activeKey={activeKey} onSelect={(k): void => setActiveKey(k || undefined)}>
      <Nav variant={variant} className={`d-none d-md-flex ${className || ''}`}>
        {titles.map(({ eventKey, title }) => (
          <Nav.Item role="presentation" key={eventKey}>
            <Nav.Link eventKey={eventKey}>{title}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Dropdown
        align="start"
        id={`tabs-${id}-dropdown`}
        className={`d-block d-md-none w-100 ${className || ''}`}
      >
        <Dropdown.Toggle as={CustomToggle}>
          <span>
            {titles.find(({ eventKey }) => eventKey === activeKey)?.title || 'Select Tab'}
          </span>
          <ChevronDown />
        </Dropdown.Toggle>

        <Dropdown.Menu className="rounded-3 py-3 px-0">
          {titles.map(({ eventKey, title }) => (
            <Dropdown.Item
              key={eventKey}
              as={Nav.Link}
              eventKey={eventKey}
              role="presentation"
              className="py-1 px-4"
              active={activeKey === eventKey}
            >
              {title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Tab.Content>{loading ? <Loader fullScreen noBg /> : children}</Tab.Content>
    </Tab.Container>
  );
};
