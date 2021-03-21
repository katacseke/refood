import React, { useState } from 'react';
import Router from 'next/router';
import { IoExitOutline } from 'react-icons/io5';
import {
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

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      <NavbarBrand href="/">Project name</NavbarBrand>
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

        <Nav navbar className="ml-auto">
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
          <Dropdown open={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
            <DropdownToggle nav caret>
              Saját fiók
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>Kosár</DropdownItem>
              <DropdownItem>Rendelések</DropdownItem>
              <DropdownItem>Saját profil</DropdownItem>
              <DropdownItem className="text-danger d-flex align-items-center">
                <IoExitOutline className="mr-1" />
                Kilépés
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavBar;
