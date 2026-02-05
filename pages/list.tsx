import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

interface Item {
  id: number;
  title: string;
}

const ListPage: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then((res) => res.json())
      .then((data: Item[]) => setItems(data));
  }, []);

  const goToEditor = (id: number) => {
    router.push(`/editor?id=${id}`);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Items List</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: 10 }}>
              {item.title}{" "}
              <button onClick={() => goToEditor(item.id)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListPage;
