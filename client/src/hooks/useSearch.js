import { useState, useMemo } from "react";
import Fuse from "fuse.js";

/**
 * A reusable hook for fuzzy searching through posts
 * @param {Array} posts - The array of post objects from your state
 */
export function useSearch(posts) {
  const [query, setQuery] = useState("");

  // We memoize the Fuse instance so it only re-indexes when posts change
  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "tags", "content"],
        threshold: 0.3, // 0.0 is perfect match, 1.0 matches everything
      }),
    [posts]
  );

  // We memoize results for performance
  const results = useMemo(() => {
    if (!query.trim()) return posts;
    return fuse.search(query).map((result) => result.item);
  }, [query, fuse, posts]);

  return { query, setQuery, results };
}
