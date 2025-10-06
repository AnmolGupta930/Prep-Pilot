"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IconPlus, IconTrash } from "@tabler/icons-react";

export default function Kanban({ cardsType, subject ,columnType }) {
  const [cards, setCards] = useState(cardsType);
  //---------custom columns-------------------
  const [list, setList] = useState(columnType);
  const [newListName, setNewListName] = useState("");

  const handleAddList = (e) => {
    e.preventDefault();
    if (newListName.trim() === "") return;
    const newList = {
      id: Date.now(),
      title: newListName.trim(),
    };

    setList([...list, newList]);
    setNewListName("");
  };

  const handleDelete = (listID) => {
    const updateList = list.filter((li) => li.id !== listID);
    setList(updateList);
  };
  //----------------------------------------------

  return (
    <div className="bg-background bgpattern flex h-full w-full flex-row gap-4 max-md:flex-col max-sm:p-2">
      {subject && (
        <div className="border-border bg-card relative h-full w-[20%] min-w-[325px] overflow-hidden rounded-2xl border max-md:max-h-[400px] max-md:w-full">
          <div className="absolute h-full w-full overflow-scroll p-4">
            <Subjects
              title="Chapters"
              column="sub"
              headingColor="text-foreground"
              cards={cards}
              setCards={setCards}
            />
          </div>
        </div>
      )}

      <div className="border-border bg-card/20 relative h-full w-full overflow-hidden rounded-2xl border backdrop-blur-[1px]">
        <div className=" absolute flex h-full w-full flex-row gap-4 overflow-x-scroll p-4">
          <Column
            title="TODO"
            column="todo"
            headingColor="text-yellow"
            cards={cards}
            setCards={setCards}
            bgColor="bg-yellowbg/5"
          />
          <Column
            title="Complete"
            column="done"
            headingColor="text-green"
            cards={cards}
            setCards={setCards}
            bgColor="bg-greenbg/5"
          />

          <div className="text-foreground flex flex-row-reverse gap-4">
            <div className="w-[256px] shrink-0">
              <div className="border-border bg-card/20 rounded-xl border p-2 backdrop-blur-[1px]">
                <form onSubmit={handleAddList} className="flex gap-2">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Add new column..."
                    className="border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-muted-foreground w-full rounded-lg border p-2 text-sm focus:outline-2"
                  />
                  <button
                    className="bg-muted text-muted-foreground hover:bg-foreground hover:text-muted flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors"
                    type="submit"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>

            <div className="flex gap-4">
              {list.map((li) => (
                <Column
                  title={li.title}
                  column={li.column || li.title}
                  key={li.title}
                  onDelete={handleDelete}
                  list={li}
                  headingColor={li.color || "text-foreground"}
                  cards={cards}
                  setCards={setCards}
                  bgColor="bg-background"
                ></Column>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  onDelete,
  list,
  bgColor,
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    let copy = [...cards];
    const cardToTransfer = copy.find((c) => c.id === cardId);
    if (!cardToTransfer) return;

    let newCard;
    if (cardToTransfer.column === "sub") {
      newCard = { ...cardToTransfer, id: Date.now().toString(), column };
    } else {
      newCard = { ...cardToTransfer, column };
      // remove from old column if not from "sub"
      copy = copy.filter((c) => c.id !== cardId);
    }

    const moveToBack = before === "-1";

    if (moveToBack) {
      copy.push(newCard);
    } else {
      const insertAtIndex = copy.findIndex((el) => el.id === before);
      if (insertAtIndex === -1) return;
      copy.splice(insertAtIndex, 0, newCard);
    }

    setCards(copy);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  //--------------------dnd indicator logic--------------------
  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };
  //--------------------dnd indicator logic--------------------

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className={`flex`}>
      <div className={`w-[256] shrink-0 transition-colors`}>
        <div
          className={`border-border flex max-h-full flex-col rounded-2xl border ${
            active ? "bg-active/20" : bgColor
          } `}
        >
          <div className="group flex shrink-0 items-center justify-between px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <h3 className={`${headingColor}`}>{title}</h3>
              <span className={`text-sm ${headingColor}`}>
                {filteredCards.length}
              </span>
            </div>

            <button
              onClick={() => onDelete(list.id)}
              className={`${column === "done" || column === "todo"? "hidden" : " "} text-muted-foreground cursor-pointer opacity-0 group-hover:opacity-100 hover:text-red-800`}
            >
              <IconTrash className="size-4" />
            </button>
          </div>

          <div className="grow overflow-y-auto">
            <div
              onDrop={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex flex-col px-2 pt-4`}
            >
              {filteredCards.map((c) => {
                return (
                  <Card
                    key={c.id}
                    {...c}
                    setCards={setCards}
                    handleDragStart={handleDragStart}
                  />
                );
              })}
              <DropIndicator beforeId={null} column={column} />
            </div>
          </div>
          <AddCard
            column={column}
            setCards={setCards}
            headingColor={headingColor}
          />
        </div>
      </div>
    </div>
  );
};

const Subjects = ({ title, headingColor, cards, column, setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    //---------------copy card logic-------------------
    let copy = [...cards];

    const orignalCard = copy.find((c) => c.id === cardId);
    if (!orignalCard) return;

    const newCard = {
      ...orignalCard,
      id: Date.now().toString(),
      column,
    };

    const moveToBack = before === "-1";
    if (moveToBack) {
      copy.push(newCard);
    } else {
      const insertAtIndex = copy.findIndex((el) => el.id === before);
      if (insertAtIndex === -1) return;
      copy.splice(insertAtIndex, 0, newCard);
    }

    // setCards(copy);

    //---------------copy card logic-------------------
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  //--------------------dnd indicator logic--------------------
  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };
  //--------------------dnd indicator logic--------------------

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const initialFilteredCards = cards.filter((c) => c.column === column);

   //------------------search-------------------------------------
    const [query, setQuery] = useState("");
  
    const filteredCards = useMemo(() => {
      return initialFilteredCards.filter((card) => {
        return card.title.toLowerCase().includes(query.toLowerCase());
      });
    }, [initialFilteredCards, query]);
    //------------------search-------------------------------------

  return (
    <div
      className={`flex max-h-full shrink-0 flex-col rounded-2xl transition-colors ${
        active ? "bg-active" : " "
      } flex`}
    >
      <div className="flex shrink-0 items-center justify-between px-2 py-3">
        <h4 className={`font-sans text-xl font-bold ${headingColor}`}>
          {title}
        </h4>
        <span className="text-muted-foreground text-sm">
          {filteredCards.length}
        </span>
      </div>
       <div className="shrink-0 items-center justify-between px-2 py-3">
        <input
          className="border-border bg-muted/20 text-foreground placeholder-muted-foreground focus:outline-muted-foreground w-full rounded-lg border p-2 text-sm focus:outline-2"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
        />
      </div>
      <div className="grow overflow-y-auto">
        <div
          onDrop={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col px-2`}
        >
          {filteredCards.map((c) => {
            return (
              <Card
                key={c.id}
                {...c}
                setCards={setCards}
                handleDragStart={handleDragStart}
              />
            );
          })}
          <DropIndicator beforeId={null} column={column} />
        </div>
      </div>
      {/* <AddCard column={column} setCards={setCards} /> */}
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart, setCards }) => {
  const handelDelet = () => {
    setCards((pv) => pv.filter((c) => c.id !== id));
  };
  // if (column === "done") {
  //   status = true;
  // }
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="text-foreground border-border bg-muted group/del flex cursor-grab flex-row items-center justify-between gap-2 rounded-lg border p-2 active:cursor-grabbing max-md:mr-[20px]"
      >
        {/* <button>{(status && <IconSquareCheck className="size-4"/>) || <IconSquare className="size-4"/>} </button> */}
        <p
          className={`flex-1 text-left ${column === "done" ? "line-through" : ""}`}
        >
          {title}
        </p>
        <button
          className={`cursor-pointer ${column === "sub" ? "hidden" : ""} `}
          onClick={handelDelet}
        >
          <IconTrash className="text-muted-foreground size-4 opacity-0 group-hover/del:opacity-100 hover:text-red-800 max-md:opacity-100" />
        </button>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="bg-foreground my-0.5 h-0.5 w-full opacity-0"
    />
  );
};

const AddCard = ({ column, setCards, headingColor }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv) => [...pv, newCard]);

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form className="px-2" layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-foreground mx-auto w-full rounded-lg border p-2 text-sm focus:outline-1"
          />
          <div className="flex items-center justify-end gap-2 px-2 py-2">
            <button
              onClick={() => setAdding(false)}
              className="text-muted-foreground hover:text-foreground p-2 text-sm transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-muted text-muted-foreground hover:bg-foreground hover:text-muted flex items-center rounded px-3 py-1.5 text-sm transition-colors"
            >
              <span>Add</span>
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className={`hover:text-foreground ${headingColor} flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors`}
        >
          <IconPlus className="size-4" />
          <span>Add card</span>
        </motion.button>
      )}
    </>
  );
};
