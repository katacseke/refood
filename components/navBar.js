import React, { useState, useContext } from 'react';
import Router from 'next/router';
import Link from 'next/link';
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
import AuthContext from '../context/authContext';

const AuthenticatedSection = ({ logout }) => {
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
      <Dropdown open={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
        <DropdownToggle nav caret>
          Saját fiók
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>Kosár</DropdownItem>
          <DropdownItem>Rendelések</DropdownItem>
          <Link href="/profile/editt">
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

const GuestSection = () => (
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
      <Link href="/login">
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

const RestuarantSection = ({ logout, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <NavItem>
        <Link href={`/meals?restaurantId=${user.id}`}>
          <NavLink active style={{ cursor: 'pointer' }}>
            Ajánlatok
          </NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href={`/meals?restaurantId=${user.id}`}>
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
          <Link href={`/restauratns/restaurantId=${user.id}`}>
            <DropdownItem>Saját oldal</DropdownItem>
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
            Ajánlatok
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
          {user ? <AuthenticatedSection user={user} logout={logout} /> : <GuestSection />}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavBar;
