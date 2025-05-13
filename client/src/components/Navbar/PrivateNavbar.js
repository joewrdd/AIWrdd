import React from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon, MicrophoneIcon } from "@heroicons/react/20/solid";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import textLogo from "../../assets/WRDD.png";
import { useAuth } from "../../auth/AuthContext";

const user = {
  name: "Joe Ward",
  email: "joewrdd@gmail.com",
};

//----- Navigation For Private Navbar -----//
const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Pricing", href: "/plans", current: true },
];

//----- User Navigation For Private Navbar -----//
const userNavigation = [{ name: "Sign out", href: "#" }];

//----- Class Names For Private Navbar -----//
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
  //----- Auth Hook -----
  const { logout } = useAuth();

  //----- Handling Logout -----
  const handleLogout = () => {
    logout();
  };

  return (
    <Disclosure as="nav" className="bg-gray-900">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center -ml-24">
                  {/* LOGO */}
                  <img
                    className="h-14 w-auto"
                    src={textLogo}
                    alt="Content Generator"
                  />
                </div>
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile Menu Button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden md:ml-8 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 -mr-24">
                  <Link
                    to="/generate-content"
                    className="relative inline-flex items-center gap-x-2 rounded-lg bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] px-4 py-2.5 text-sm font-medium text-white shadow-xl hover:shadow-lg hover:opacity-95 transition-all duration-300 group"
                  >
                    <PlusIcon
                      className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300"
                      aria-hidden="true"
                    />
                    <span className="relative">
                      Generate Content
                      <span className="absolute bottom-0 left-0 w-full h-px bg-purple-300/40 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </span>
                  </Link>

                  <Link
                    to="/voice-to-content"
                    className="ml-3 relative inline-flex items-center gap-x-2 rounded-lg bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] px-4 py-2.5 text-sm font-medium text-white shadow-xl hover:shadow-lg hover:opacity-95 transition-all duration-300 group"
                  >
                    <MicrophoneIcon
                      className="h-5 w-5 transition-transform group-hover:scale-110 duration-300"
                      aria-hidden="true"
                    />
                    <span className="relative">
                      Voice Input
                      <span className="absolute bottom-0 left-0 w-full h-px bg-purple-300/40 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="ml-3 relative inline-flex items-center gap-x-1.5 rounded-lg bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] px-3 py-2.5 text-sm font-medium text-white shadow-xl hover:shadow-lg hover:opacity-95 transition-all duration-300"
                  >
                    <FiLogOut
                      className="h-5 w-5 transition-transform hover:rotate-180 duration-300"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  <Menu as="div" className="relative ml-3">
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Link
                to="/voice-to-content"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                Voice to Content
              </Link>
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-6 sm:px-6">
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2 sm:px-3">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
