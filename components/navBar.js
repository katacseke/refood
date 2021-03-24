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
    <Dropdown open={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
      <DropdownToggle nav caret>
        Saját fiók
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem>Kosár</DropdownItem>
        <DropdownItem>Rendelések</DropdownItem>
        <DropdownItem>Saját profil</DropdownItem>
        <DropdownItem className="text-danger d-flex align-items-center" onClick={logout}>
          <IoExitOutline className="mr-1" />
          Kilépés
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const GuestSection = () => (
  <>
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
        <NavbarBrand style={{ cursor: 'pointer' }}>Project name</NavbarBrand>
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
          <NavItem>
            <NavLink active href="#">
              Ajánlatok
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="#">
              Vendéglők
            </NavLink>
          </NavItem>
          {user ? <AuthenticatedSection logout={logout} /> : <GuestSection />}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavBar;
