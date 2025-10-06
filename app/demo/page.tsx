"use client";
import React from "react";
import { DEFAULT_CARDS } from "../components/default-cards&column/defaultcards";
import Kanban from "../components/kanban-front-end";
import { DEFAULT_COLUMNS } from "../components/default-cards&column/defaultcolumns";

export default function page() {
  return (
    <>
      <div className="bgpattern h-full w-full pt-4">
        <Kanban subject={true} cardsType={DEFAULT_CARDS} columnType={DEFAULT_COLUMNS}/>
      </div>
    </>
  );
}
