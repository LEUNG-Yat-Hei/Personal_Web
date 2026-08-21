---
title: "Build a Trie in Python: A Practical Guide"
description: "Learn how to implement a trie (prefix tree) from scratch in Python, with insert, search, and prefix matching operations—plus real-world use cases."
pubDate: 2026-08-21
kicker: "Guide"
tags: ["python", "data-structures", "algorithms", "trie"]
---

The trie—pronounced "try" (or sometimes "tree" if you're feeling rebellious)—is one of those data structures that feels esoteric until you finally have a genuinely good excuse to use it. Then, suddenly, it's the cleanest tool for the job.

If you've ever built an autocomplete feature, spell checker, or IP router table, you've likely hit the moment where a hash map alone doesn't cut it. That's where the trie steps in.

## What Is a Trie?

A trie is a tree-like data structure that stores strings character by character, sharing common prefixes. Each node represents a single character, and the path from the root to any node spells out a prefix. A full word is marked with a special flag.

Here's what that looks like conceptually for the words `"cat"`, `"car"`, and `"card"`:

```
        (root)
        /  \
       c    ...
      /
     a
    / \
   t   r
       |
       d
```

Note how `"car"` and `"card"` share the `c → a → r` path. That's the entire point: **common prefixes are stored once**, not repeated.

## Why Use a Trie?

- **Fast prefix lookups**: Check if any word starts with `"car"` in O(m) time, where m is the length of the prefix—independent of how many words you've stored.
- **Memory efficient for overlapping prefixes** (e.g., `"cat"`, `"cats"`, `"catnip"`).
- **Ordered iteration** if you traverse depth-first.

But there are costs: tries use more memory per node than a flat list of strings, and they can be slower for exact-match lookups compared to a well-tuned hash map.

## The Node

We'll build this from scratch. No libraries, no magic. Just Python and a bit of cleverness.

Start with a single node class:

```python
class TrieNode:
    def __init__(self):
        # Each child is a character -> TrieNode mapping
        self.children = {}
        # True if a word ends exactly at this node
        self.is_end_of_word = False
```

Using a Python dict for `children` keeps things simple and fast. Each node only allocates space for characters it actually has children for.

## The Trie Class

Now the main class with our core operations:

```python
class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word: str) -> bool:
        node = self._traverse(word)
        return node is not None and node.is_end_of_word

    def starts_with(self, prefix: str) -> bool:
        return self._traverse(prefix) is not None

    def _traverse(self, prefix: str):
        """Walk down the trie following `prefix`. Return the final node, or None."""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

The key insight: `search()` and `starts_with()` share almost all their logic. The only difference is whether we also require the final node to be marked as the end of a word.

## Collecting All Words with a Prefix

The real power of a trie shows when you want not just *whether* a prefix exists, but *which* words match it. That's how autocomplete works.

```python
class Trie:
    # ... (previous methods)

    def words_with_prefix(self, prefix: str) -> list[str]:
        node = self._traverse(prefix)
        if node is None:
            return []
        return self._collect(node, prefix)

    def _collect(self, node: TrieNode, path: str) -> list[str]:
        results = []
        if node.is_end_of_word:
            results.append(path)
        for char, child in node.children.items():
            results.extend(self._collect(child, path + char))
        return results
```

This recursive collector walks every descendant of a given node, building up strings along the way. With `c`, `ca`, `car`, `card`, and `cart` in the trie:

```python
trie.words_with_prefix("ca")
# ['car', 'card', 'cart']
```

## Deleting Words

Deletion is the trickiest operation, because you can't just remove a node if other words share its path. You have to delete from the leaf upward, stopping as soon as a node still matters.

```python
class Trie:
    # ... (previous methods)

    def delete(self, word: str) -> bool:
        """Return True if the word existed and was removed."""
        def _delete(node: TrieNode, word: str, depth: int) -> bool:
            if depth == len(word):
                if not node.is_end_of_word:
                    return False  # word not present
                node.is_end_of_word = False
                return len(node.children) == 0  # safe to prune this node
            char = word[depth]
            child = node.children.get(char)
            if child is None:
                return False
            should_delete_child = _delete(child, word, depth + 1)
            if should_delete_child:
                del node.children[char]
                # Also return True to propagate upward if this node has no other children
                return not node.is_end_of_word and len(node.children) == 0
            return False

        return _delete(self.root, word, 0)
```

The recursion returns a boolean: "should the caller remove me?" A node is safe to remove only if it's not the end of a word itself and has no remaining children.

## Putting It All Together

Here's the complete, self-contained implementation:

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    def search(self, word: str) -> bool:
        node = self._traverse(word)
        return node is not None and node.is_end_of_word

    def starts_with(self, prefix: str) -> bool:
        return self._traverse(prefix) is not None

    def words_with_prefix(self, prefix: str) -> list[str]:
        node = self._traverse(prefix)
        if node is None:
            return []
        return self._collect(node, prefix)

    def delete(self, word: str) -> bool:
        def _delete(node: TrieNode, word: str, depth: int) -> bool:
            if depth == len(word):
                if not node.is_end_of_word:
                    return False
                node.is_end_of_word = False
                return len(node.children) == 0
            char = word[depth]
            child = node.children.get(char)
            if child is None:
                return False
            should_delete_child = _delete(child, word, depth + 1)
            if should_delete_child:
                del node.children[char]
                return not node.is_end_of_word and len(node.children) == 0
            return False
        return _delete(self.root, word, 0)

    def _traverse(self, prefix: str):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node

    def _collect(self, node: TrieNode, path: str) -> list[str]:
        results = []
        if node.is_end_of_word:
            results.append(path)
        for char, child in node.children.items():
            results.extend(self._collect(child, path + char))
        return results
```

## Complexity at a Glance

| Operation | Time | Space |
|---|---|---|
| `insert` | O(m) | O(m) worst-case new nodes |
| `search` | O(m) | O(1) |
| `starts_with` | O(m) | O(1) |
| `words_with_prefix` | O(m + k) | O(k) for results |
| `delete` | O(m) | O(m) recursion stack |

Here, m is the length of the relevant string, and k is the number of matching words in the output.

## Real-World Use Cases

- **Autocomplete**: exactly what `words_with_prefix` gives you.
- **Spell checkers**: store the dictionary in a trie, check word existence in O(m).
- **IP routing (longest prefix match)**: binary tries are the classic implementation.
- **Word games (Boggle, Scrabble)**: prune invalid prefixes early during board traversal.
- **Phone directory contact search**: match by prefix without scanning every contact.

## When *Not* to Use a Trie

A trie is powerful, but it's not always the right call:

- **Tiny datasets**: a plain list with `.startswith()` filtering is faster to write and fast enough.
- **Heavy memory constraints**: Python dicts per node add real overhead (hundreds of bytes per node). For large dictionaries, a sorted list with `bisect` or a DAWG (Directed Acyclic Word Graph) may be better.
- **Exact-match-only workloads**: a hash set wins on speed and simplicity.

## Next Steps

Want to push this further? Try these experiments:

1. **Limit results in `words_with_prefix`** so autocomplete doesn't return 10,000 matches.
2. **Sort results** by frequency or a custom score.
3. **Implement a compact trie (radix tree)** to reduce memory by merging nodes with single children.
4. **Add case-insensitivity** by normalizing characters to lowercase on insert and search.

The trie looks intimidating on paper, but once you've written one yourself, it stops being a mysterious black box and becomes just another tool in your toolkit. And now you have a working, tested implementation ready to drop into your next project.