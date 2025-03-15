import React from "react";
import Wrapper from "./_commponents/wrapper";
import { getMenuItems } from "@/lib/reports";

export default async function page() {
  const menuItem = await getMenuItems();
  return (
    <div>
      <Wrapper menuItems={menuItem} />
    </div>
  );
}
