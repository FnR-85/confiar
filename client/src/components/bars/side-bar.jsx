import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import { useBars } from './bars-context';
import { useSession } from '../../contexts/session-context';
import useNavigationItems from '../../hooks/navigation-items';
import Icon from '../general/icon';
import useReactPath from '../../hooks/path-name';
import { navigateIntoObjectByPath } from '../../theme';

const getThemeAttribute = (theme, attrribute) => {
  return navigateIntoObjectByPath(theme, "components.bars.sideBar." + attrribute);
}

const StyledSideBar = styled.div`
  background-color: ${({ theme }) => getThemeAttribute(theme, "bgColor")};
  color: ${({ theme }) => getThemeAttribute(theme, "color")};
  z-index: 1000;
  height: calc(100% - 61px);
  position: absolute;
  &.small {
    width: 90px;
  }
  &.large {
    width: 280px;
  }
`;

const StyledNavLink = styled(Link)`
  cursor: pointer;

  &:hover {
    background-color: gray;
    color: white;
  }

  &.side-bar-close {
    padding: 0.5rem;
  }
`;

const StyledNavAnchor = styled.a`
  cursor: pointer;

  &:hover {
    background-color: gray;
    color: white;
  }

  &.side-bar-close {
    padding: 0.5rem;
  }
`;

const StyledNavItem = styled.li`
  margin-bottom: 5px;
`;

const StyledProfileAnchor = styled.a`
  color: ${({ theme }) => getThemeAttribute(theme, "profile.icon.color")};
`;

const StyledProfileMenu = styled.ul`
  background-color: ${({ theme }) => getThemeAttribute(theme, "bgColor")};
  & .dropdown-item {
    color: ${({ theme }) => getThemeAttribute(theme, "color")};
  }
`;

export default function SideBar(props) {
  const { session, logOut } = useSession();
  const [navigationItems] = useNavigationItems();
  const { t } = useTranslation('components', { keyPrefix: 'bars.sideBar' });
  const [itemList, setItemList] = useState({ items: <></> });
  const { sidebarOpen } = useBars();
  const pathname = useReactPath();

  const getUserName = () => {
    return session && session.user ? session.user.id : null;
  };

  const getActiveClass = useCallback((item) => {
    return item.active ? 'active' : 'link-dark';
  }, []);

  const getSideBarOpenClass = useCallback(() => {
    return sidebarOpen ? 'side-bar-open' : 'side-bar-close';
  }, [sidebarOpen]);

  const onItemClick = useCallback((item) => {
    if (item.action) {
      item.action();
    }
  }, []);

  const updateItems = useCallback(
    (sidebarOpenMode) => {
      if (navigationItems) {
        setItemList({
          items: (
            <ul className="nav nav-pills flex-column mb-auto">
              {navigationItems.map((item, index) =>
                !item.conditionFunction || (item.conditionFunction && item.conditionFunction()) ? (
                  <StyledNavItem key={item.id} className="nav-item">
                    {item.path ? (
                      <StyledNavLink
                        className={
                          'nav-link ' +
                          getActiveClass(item) +
                          ' ' +
                          getSideBarOpenClass()
                        }
                        to={item.path}
                        onClick={() => {
                          onItemClick(item);
                        }}
                      >
                        <Icon
                          fontName={item.icon}
                          size={sidebarOpenMode ? 'small' : 'medium'}
                        ></Icon>
                        {sidebarOpenMode ? item.text : null}
                      </StyledNavLink>
                    ) : (
                      <StyledNavAnchor
                        className={
                          'nav-link ' +
                          getActiveClass(item) +
                          ' ' +
                          getSideBarOpenClass()
                        }
                        onClick={() => {
                          onItemClick(item);
                        }}
                      >
                        <Icon fontName={item.icon} small></Icon>
                        {item.text}
                      </StyledNavAnchor>
                    )}
                  </StyledNavItem>
                ) : null,
              )}
            </ul>
          ),
        });
      }
    },
    [
      navigationItems,
      setItemList,
      getActiveClass,
      getSideBarOpenClass,
      onItemClick,
    ],
  );

  useEffect(() => {
    updateItems(sidebarOpen);
  }, [pathname, updateItems, sidebarOpen]);

  return (
    <div>
      <StyledSideBar
        className={
          'd-flex flex-column flex-shrink-0 p-3 sidebar ' +
          (sidebarOpen ? 'large' : 'small')
        }
      >
        {props.title ? (
          <div>
            <a
              href="/#"
              className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
            >
              <Icon fontName={props.icon}></Icon>
              <span className="fs-4">{props.title}</span>
            </a>
            <hr />
          </div>
        ) : null}
        <ul className="nav nav-pills flex-column mb-auto">{itemList.items}</ul>
        <hr />
        <div className="dropdown">
          <StyledProfileAnchor
            href="/#"
            className="d-flex align-items-center link-dark text-decoration-none"
            id="dropdownUser"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Icon
              fontName="person-circle"
              size={sidebarOpen ? 'medium' : 'large'}
            ></Icon>
            {sidebarOpen ? <strong>{getUserName()}</strong> : null}
          </StyledProfileAnchor>
          <StyledProfileMenu
            className="dropdown-menu text-small shadow"
            aria-labelledby="dropdownUser"
          >
            <li>
              <a className="dropdown-item" href="/Settings">
                 {t('profileMenu.settings')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/#">
                {t('profileMenu.profile')}
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="/#" onClick={logOut}>
                {t('profileMenu.logOut')}
              </a>
            </li>
          </StyledProfileMenu>
        </div>
      </StyledSideBar>
    </div>
  );
}
