import React from "react";

const SideBarLink = ({ text, Icon }) => {
  return (
    <li className="hoverAnimation flex xl:justify-start justify-center items-center text-xl mb-3 space-x-3">
      <Icon className="h-7" />
      <span className="hidden xl:inline">{text}</span>
    </li>
  );
};

export default SideBarLink;
