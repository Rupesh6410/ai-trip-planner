"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";




export function NavbarDemo() {

    const { data: session } = useSession();

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Trips",
      link: "/trips",
    },
    {
      name: "Generate-Trips",
      link: "/generate-trip",
    },

  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {!session ? (
              <NavbarButton variant="secondary" onClick={() => signIn("google")}>
                Login
              </NavbarButton>
            ):(
              <NavbarButton variant="primary" onClick={() => signOut()}>Logout</NavbarButton>
            )}

</div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
            {!session ? (
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signIn("google");
                }}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
            ):(<NavbarButton
              onClick={() => {
                setIsMobileMenuOpen(false);
                signOut();
              }}
              variant="primary"
              className="w-full"
            >
              Logout
            </NavbarButton>)}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}


