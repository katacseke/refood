import React, { useState, useContext } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IoExitOutline } from 'react-icons/io5';
import {
  Button,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormInput,
  Collapse,
} from 'shards-react';
import { Popover } from 'reactstrap';
import CartPopover from './cartPopover';
import AuthContext from '../context/authContext';

const AuthenticatedSection = ({ logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <NavItem>
        <Link href="/meals">
          <NavLink active style={{ cursor: 'pointer' }}>
            Ajánlatok
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="/restaurants">
          <NavLink active style={{ cursor: 'pointer' }}>
            Vendéglők
          </NavLink>
        </Link>
      </NavItem>

      <NavItem>
        <NavLink active style={{ cursor: 'pointer' }} id="cartPopover">
          Kosár
        </NavLink>
        <Popover
          placement="bottom-end"
          isOpen={cartOpen}
          target="cartPopover"
          toggle={() => setCartOpen(!cartOpen)}
          trigger="legacy"
        >
          <CartPopover />
        </Popover>
      </NavItem>

      <Dropdown open={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
        <DropdownToggle nav caret>
          Saját fiók
        </DropdownToggle>
        <DropdownMenu right>
          <Link href="/cart">
            <DropdownItem>Kosár</DropdownItem>
          </Link>
          <Link href="/orders">
            <DropdownItem>Rendelések</DropdownItem>
          </Link>
          <Link href="/profile/edit">
            <DropdownItem>Saját profil</DropdownItem>
          </Link>
          <DropdownItem className="text-danger d-flex align-items-center" onClick={logout}>
            <IoExitOutline className="mr-1" />
            Kilépés
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

const GuestSection = () => {
  const router = useRouter();

  return (
    <>
      <NavItem>
        <Link href="/meals">
          <NavLink active style={{ cursor: 'pointer' }}>
            Ajánlatok
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="/restaurants">
          <NavLink active style={{ cursor: 'pointer' }}>
            Vendéglők
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link
          href={{
            pathname: '/login',
            query: { next: router.pathname },
          }}
        >
          <NavLink active>
            <Button outline theme="light">
              Belépés
            </Button>
          </NavLink>
        </Link>
      </NavItem>
      <Link href="/registration">
        <NavLink active>
          <Button outline theme="light">
            Regisztráció
          </Button>
        </NavLink>
      </Link>
    </>
  );
};

const RestaurantSection = ({ logout, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <NavItem>
        <Link href="/meals/create">
          <NavLink active style={{ cursor: 'pointer' }}>
            Ajánlat létrehozása
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="/restaurant/orders">
          <NavLink active style={{ cursor: 'pointer' }}>
            Rendelések
          </NavLink>
        </Link>
      </NavItem>
      <Dropdown open={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
        <DropdownToggle nav caret>
          Saját vendéglő
        </DropdownToggle>
        <DropdownMenu right>
          <Link href={`/restaurants/${user.restaurantId}`}>
            <DropdownItem>Saját oldal</DropdownItem>
          </Link>
          <Link href="/restaurant/meals">
            <DropdownItem>Saját ajánlatok</DropdownItem>
          </Link>
          <DropdownItem className="text-danger d-flex align-items-center" onClick={logout}>
            <IoExitOutline className="mr-1" />
            Kilépés
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

const AdminSection = ({ logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <NavItem>
        <Link href="/meals">
          <NavLink active style={{ cursor: 'pointer' }}>
            Ajánlatok
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="/restaurants">
          <NavLink active style={{ cursor: 'pointer' }}>
            Vendéglők
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="/users">
          <NavLink active style={{ cursor: 'pointer' }}>
            Felhasználók
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="/restaurants/applications">
          <NavLink active style={{ cursor: 'pointer' }}>
            Jelentkezések
          </NavLink>
        </Link>
      </NavItem>
      <Dropdown open={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
        <DropdownToggle nav caret>
          Saját fiók
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>Saját profil</DropdownItem>
          <DropdownItem className="text-danger d-flex align-items-center" onClick={logout}>
            <IoExitOutline className="mr-1" />
            Kilépés
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [navbarOpen, setNavbarOpen] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key !== 'Enter' && e.keyCode !== 13) {
      return;
    }

    const text = e.target.value;
    if (text !== '') {
      Router.push(`/search/${text}`);
    }
  };

  const handleLogout = async () => {
    try {
      const promise = logout();

      await toast.promise(
        promise,
        {
          loading: 'Kijelentkezés folyamatban...',
          success: 'Kijelentkezve!',
          error: (err) => err.response.data.error,
        },
        { style: { minWidth: '18rem' } }
      );

      Router.push('/');
    } catch (err) {}
  };

  const renderNavSection = () => {
    if (user?.role === 'user') {
      return <AuthenticatedSection user={user} logout={handleLogout} />;
    }
    if (user?.role === 'restaurant') {
      return <RestaurantSection user={user} logout={handleLogout} />;
    }
    if (user?.role === 'admin') {
      return <AdminSection logout={handleLogout} />;
    }

    return <GuestSection />;
  };

  return (
    <Navbar type="dark" theme="primary" expand="md">
      <Link href="/">
        <span>
          <NavbarBrand style={{ cursor: 'pointer' }}>Project name</NavbarBrand>
        </span>
      </Link>
      <NavbarToggler onClick={() => setNavbarOpen(!navbarOpen)} />

      <Collapse open={navbarOpen} navbar>
        <Nav navbar>
          <FormInput
            size="sm"
            seamless
            className="border-0"
            placeholder="Keresés..."
            name="searchBar"
            id="searchBar"
            onKeyPress={handleKeyPress}
          />
        </Nav>

        <Nav navbar className="ml-auto d-flex align-items-center">
          {renderNavSection()}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavBar;
