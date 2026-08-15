function ItemList({ items }) {
  if (items.length === 0) {
    return <p>No items found.</p>;
  }

  return (
    <div>
      {items.map((item) => (
        <article key={item.id}>
          <h3>{item.name}</h3>

          {item.description && (
            <p>{item.description}</p>
          )}

          <small>
            Created: {new Date(item.created_at).toLocaleString()}
          </small>
        </article>
      ))}
    </div>
  );
}

export default ItemList;