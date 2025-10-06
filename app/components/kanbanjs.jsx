"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { supabase } from "@/client/supabaseClient";

export default function KanbanJS({ cardsType, subject, page }) {
  //done
  const [cards, setCards] = useState(cardsType);
  const setupRan = useRef(false);

  //---------custom columns-------------------
  //define type
  const [list, setList] = useState([]);
  const [newListName, setNewListName] = useState("");
  // const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    setCards(cardsType);
  }, [cardsType]);

  //---------columns logic-------------------
  useEffect(() => {
    if (setupRan.current) {
      return;
    }
    setupRan.current = true;
    async function setupColumns() {
      const { data: existingColumns, error } = await supabase
        .from("Column")
        .select("id, title")
        .eq("page", page)
        .order("created_at", { ascending: true });
      console.log(existingColumns);
      if (error) {
        console.error("Error fetching columns:", error.message);
        setList([]);
        return;
      }

      const hasTodo = existingColumns.some(
        (c) => c.title.toLowerCase() === "todo",
      );
      const hasDone = existingColumns.some(
        (c) => c.title.toLowerCase() === "completed",
      );

      const columnsToCreate = [];
      if (!hasTodo) {
        columnsToCreate.push({ title: "Todo", page: page });
      }
      if (!hasDone) {
        columnsToCreate.push({ title: "Completed", page: page });
      }

      if (columnsToCreate.length > 0) {
        const { data: newColumns, error: insertError } = await supabase
          .from("Column")
          .insert(columnsToCreate)
          .select("id, title");

        if (insertError) {
          console.error("Error creating default columns:", insertError);
          setList(existingColumns);
        } else {
          setList([...existingColumns, ...newColumns]);
        }
      } else {
        setList(existingColumns);
        console.log(list);
      }
    }
    if (page) {
      setupColumns();
    }
  }, [page]); //refetch trigger

  const handleAddList = async (e) => {
    e.preventDefault();
    if (newListName.trim() === "") return;
    const isDuplicate = list.some(
      (column) =>
        column.title.toLowerCase() === newListName.trim().toLowerCase(),
    );

    if (isDuplicate) {
      return;
    }

    const columnToInsert = {
      title: newListName.trim(),
      page: page,
    };
    const { data: newColumn, error } = await supabase
      .from("Column")
      .insert(columnToInsert)
      .select()
      .single();
    if (error) {
      console.error("Error inserting new column:", error.message);
      alert("Failed to add the new list.");
    } else {
      setList((currentValue) => [...currentValue, newColumn]);
      setNewListName("");
      // setRefetchTrigger((prev) => prev + 1);
    }
  };

  const handleDelete = async (listID) => {
    const originalList = [...list];
    const updateList = list.filter((li) => li.id !== listID);
    setList(updateList);
    const { error } = await supabase.from("Column").delete().eq("id", listID);

    if (error) {
      console.error("Error deleting column:", error.message);
      setList(originalList);
    }
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
        <div className="absolute flex h-full w-full flex-row gap-4 overflow-x-scroll p-4">
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
                  column={li.title}
                  columnId={li.id}
                  page={page}
                  key={li.id}
                  onDelete={handleDelete}
                  list={li}
                  headingColor={
                    li.title === "Todo"
                      ? "text-yellow"
                      : li.title === "Completed"
                        ? "text-green"
                        : "text-foreground"
                  }
                  cards={cards}
                  setCards={setCards}
                  bgColor={
                    li.title === "Todo"
                      ? "bg-yellowbg/10"
                      : li.title === "Completed"
                        ? "bg-greenbg/10"
                        : "bg-background/10"
                  }
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
  columnId,
  page,
  setCards,
  onDelete,
  list,
  bgColor,
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = async (e) => {
    console.log("hello");
    const originalCards = [...cards];
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    let intermediateCopy = [...cards];

    const cardToTransfer = intermediateCopy.find((c) => c.id === cardId);
    if (!cardToTransfer) return;

    const sourceColumn = cardToTransfer.column;
    const sourceColumnId = cardToTransfer.columnId;
    const destinationColumn = column;
    const destinationColumnId = columnId;
    let finalCard;
    if (sourceColumn === "sub") {
      const { data: createdTodo, error } = await supabase
        .from("Todo")
        .insert({
          title: cardToTransfer.title,
          columnId: columnId,
          page: page,
        })
        .select("id")
        .single();
      if (error) {
        console.error("Error updating todo:", error.message);
        //add alert for not moving
        setCards(originalCards);
      }
      finalCard = {
        ...cardToTransfer,
        id: createdTodo.id,
        column: destinationColumn,
        columnId: destinationColumnId,
      };
    } else {
      const { error } = await supabase
        .from("Todo")
        .update({ columnId: columnId })
        .eq("id", cardId);
      if (error) {
        console.error("Error updating todo:", error.message);
        //add alert for not moving
        setCards(originalCards);
      }
      finalCard = {
        ...cardToTransfer,
        column: destinationColumn,
        columnId: destinationColumnId,
      };
      // remove from old column if not from "sub"
    }
    if (sourceColumn !== "sub") {
      intermediateCopy = intermediateCopy.filter((c) => c.id !== cardId);
    }
    const moveToBack = before === "-1";

    if (moveToBack) {
      intermediateCopy.push(finalCard);
    } else {
      const insertAtIndex = intermediateCopy.findIndex(
        (el) => el.id === before,
      );
      if (insertAtIndex === -1) return;
      intermediateCopy.splice(insertAtIndex, 0, finalCard);
    }

    const allUpdates = [];

    const destColumnCards = intermediateCopy.filter(
      (c) => c.column === destinationColumn,
    );
    destColumnCards.forEach((card, index) => {
      allUpdates.push({
        id: card.id,
        position: index,
        title: card.title,
        page: page,
        columnId: destinationColumnId,
      });
    });

    if (sourceColumn !== "sub" && sourceColumn !== destinationColumn) {
      const sourceColumnCards = intermediateCopy.filter(
        (c) => c.column === sourceColumn,
      );
      sourceColumnCards.forEach((card, index) => {
        allUpdates.push({
          id: card.id,
          position: index,
          title: card.title,
          page: page,
          columnId: sourceColumnId,
        });
      });
    }

    const { error: upsertError } = await supabase
      .from("Todo")
      .upsert(allUpdates);
    if (upsertError) throw upsertError;

    setCards(intermediateCopy);
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
    <motion.div layout className={`flex`}>
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
              className={`${column === "Completed" || column === "Todo" ? "hidden" : " "} text-muted-foreground cursor-pointer hover:text-red-800`}
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
                    cards={cards}
                    setCards={setCards}
                    handleDragStart={handleDragStart}
                  />
                );
              })}
              <DropIndicator beforeId={null} column={column} />
            </div>
          </div>
          <AddCard
            cards={cards}
            column={column}
            columnId={columnId}
            page={page}
            setCards={setCards}
            headingColor={headingColor}
          />
        </div>
      </div>
    </motion.div>
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
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart, cards, setCards }) => {
  const handelDelete = async () => {
    const originalCards = [...cards];
    setCards((prevCards) => prevCards.filter((c) => c.id !== id));
    const { error } = await supabase.from("Todo").delete().eq("id", id);

    if (error) {
      console.error("Error deleting card:", error.message);
      setCards(originalCards);
    }
  };
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
        <p
          className={`flex-1 text-left ${column === "Completed" ? "line-through" : ""}`}
        >
          {title}
        </p>
        <button
          className={`cursor-pointer ${column === "sub" ? "hidden" : ""} `}
          onClick={handelDelete}
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

const AddCard = ({ cards, column, columnId, page, setCards, headingColor }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim().length) return;
    const cardsInThisColumn = cards.filter((c) => c.column === column);
    const newPosition = cardsInThisColumn.length;
    const newTodo = {
      title: text.trim(),
      columnId: columnId,
      page: page,
      position: newPosition,
    };

    const { data: todo, error } = await supabase
      .from("Todo")
      .insert(newTodo)
      .select()
      .single();

    if (error) {
      console.error("Error inserting todo:", error.message);
      alert("Failed to add the new card.");
    } else {
      const newCard = {
        id: todo.id,
        title: todo.title,
        column: column,
        columnId: todo.columnId,
        position: todo.position,
        page: todo.page,
      };
      setCards((currentCards) => [...currentCards, newCard]);
      setAdding(false);
      setText("");
    }
  };

  return (
    <>
      {adding ? (
        <motion.form className="px-2" layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-muted-foreground mx-auto w-full rounded-lg border p-2 text-sm focus:outline-1"
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
