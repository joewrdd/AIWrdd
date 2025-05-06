import { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setMobileMenuOpen,
  selectMobileMenuOpen,
} from "../../redux/slices/uiSlice";
import textLogo from "../../assets/WRDD.png";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Features", href: "/features", current: false },
  { name: "About", href: "/about", current: false },
  { name: "Plans", href: "/plans", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PublicNavbar() {
  const dispatch = useDispatch();
  const mobileMenuOpen = useSelector(selectMobileMenuOpen);

  return (
    <Disclosure as="nav" className="bg-gray-900">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <img
                      className="h-14 w-auto"
                      src={textLogo}
                      alt="Content Generator"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        "inline-flex items-center border-b-2 px-1 pt-1 text-base font-medium",
                        item.current
                          ? "border-[#5a3470] text-white"
                          : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 text-sm font-medium rounded-md bg-[#5a3470] text-white hover:bg-[#432752] transition-colors shadow-md"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button
                  onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-[#301934] text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center justify-center space-x-4 px-4">
                <Link
                  to="/login"
                  className="block rounded-md px-4 py-2 text-base font-medium text-white hover:bg-gray-700"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block rounded-md px-4 py-2 text-base font-medium bg-[#5a3470] text-white hover:bg-[#432752]"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
