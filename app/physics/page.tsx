"use client";
import React, { useEffect, useState } from "react";
import KanbanJS from "../components/kanbanjs";
import { useSession } from "../utils/session-provider";
import { useRouter } from "next/navigation";
import { IconLoader } from "@tabler/icons-react";
import { supabase } from "@/client/supabaseClient";

type CardData = {
  id: string;
  title: string;
  column: string;
  columnId?: string;
  position?: String;
  page?: String;
};

export default function ClientKanbanPage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/signup");
    }
  }, [loading, session, router]);

  useEffect(() => {
    async function getCards() {
      const { data: fetchedChapters, error } = await supabase
        .from("Chapters")
        .select("id, title, column")
        .eq("subject", "PHYSICS");
      if (error) {
        console.error("Error fetching cards:", error.message);
        return;
      }
      // const processedChapter = fetchedChapters?.map(todo => ({
      //   id: todo.id,
      //   title: todo.title,
      //   columnId: todo.column,
      //   column: todo.column
      // })) || [];
      const { data: fetchedTodos, error: err } = await supabase
        .from("Todo")
        .select(
          `
          id,
          title,
          columnId,
          column: Column (title)
        `,
        )
        .eq("page", "physics")
        .order("position", { ascending: true });
      if (err) {
        console.error("Error fetching cards:", err.message);
        return;
      }
      const processedTodos =
        fetchedTodos?.map((todo) => ({
          id: todo.id,
          title: todo.title,
          columnId: todo.columnId,
          //@ts-expect-error title can be null
          column: todo.column?.title || "Uncategorized",
        })) || [];
      const allCards = [...(fetchedChapters || []), ...processedTodos];
      setCards(allCards);
    }
    if (session) {
      getCards();
    }
  }, [session]);

  if (loading || !session || cards == null) {
    return (
      <div className="text-muted bg-background absolute top-0 left-0 flex h-screen w-screen items-center justify-center">
        <IconLoader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="bgpattern h-full w-full pt-4">
      <KanbanJS
        key="phy123"
        subject={true}
        cardsType={cards}
        page={"physics"}
      />
    </div>
  );
}
