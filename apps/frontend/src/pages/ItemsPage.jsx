import { useEffect, useState } from "react";
import { getItems } from "../../api";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadItems() {
    setLoading(true);
    setError("");

    try {
      const result = await getItems();

      setItems(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function handleItemCreated(item) {
    setItems((currentItems) => [item, ...currentItems]);
  }

  return (
    <main>
      <h1>Items</h1>

      <ItemForm onItemCreated={handleItemCreated} />

      <section>
        <h2>Item List</h2>

        {loading && <p>Loading items...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && (
          <ItemList items={items} />
        )}
      </section>
    </main>
  );
}

export default ItemsPage;