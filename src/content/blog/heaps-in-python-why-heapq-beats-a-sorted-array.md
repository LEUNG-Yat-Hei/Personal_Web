---
title: "Heaps in Python: Why heapq Beats a Sorted Array"
description: "A practical guide to min-heaps in Python: why a sorted array is the wrong tool, how heapq's methods work, and how to build a max-heap when you need one."
pubDate: 2026-08-22
kicker: "Guide"
tags: [python, algorithms, data-structures]
---

If you've ever needed to repeatedly grab the smallest (or largest) item from a collection, you've probably reached for one of two tools: a sorted array or a heap. Both work, but they have very different performance profiles — and for most dynamic workloads, the heap is the clear winner.

Let's start with the obvious question: why not just keep a sorted list around and take the first element?

## The Problem with a Sorted Array

A sorted array gives you O(1) access to the minimum (or maximum) element. That sounds unbeatable. But maintaining that sorted order as you add and remove items is where things fall apart.

Every time you insert into a sorted array, you need to find the right position (O(log n) with binary search) and then shift every element after it to make room. In the worst case — inserting at the front — that's O(n) shifts. Deletions have the same problem: removing the minimum means shifting every element left by one.

If you're doing a handful of operations, that's fine. But if you're processing millions of items — think of a priority queue in a Dijkstra's algorithm or a job scheduler — those O(n) shifts add up fast.

## Time Complexity Comparison

Here's the honest breakdown of common operations:

| Operation | Sorted Array | Min Heap |
|-----------|-------------|----------|
| Peek at min | O(1) | O(1) |
| Insert | O(n) (shift elements) | O(log n) |
| Pop min | O(n) (shift everything left) | O(log n) |
| Build from scratch | O(n log n) (sort) | O(n) (heapify) |
| Search for a value | O(log n) (binary search) | O(n) (no order) |

The heap sacrifices fast searching (you generally don't search heaps — you only care about the top), but it nails the two operations that matter for a priority queue: insertion and extraction of the min.

Asymptotically, `n` vs `log n` doesn't sound like a big deal. In practice, shifting an array of a million elements on every insert is catastrophically slow compared to the ~20 comparisons a heap needs.

## Enter `heapq`

Python's standard library gives you the `heapq` module, which implements a binary min-heap on top of a plain list. The heap invariant is simple: for any index `i`, the value at `heap[i]` is ≤ the value at `heap[2*i+1]` and `heap[2*i+2]` (if those children exist). The list is not sorted, but the smallest element is always at index 0.

### `heapify()` — Build a Heap in O(n)

The most common mistake is building a heap one `heappush` at a time, which costs O(n log n). If you already have a list, use `heapify()` — it restructures the list in place in **linear time**:

```python
import heapq

data = [5, 1, 8, 3, 9, 2]
heapq.heapify(data)
print(data)  # [1, 3, 2, 5, 9, 8] — not sorted, but min is at index 0
```

### `heappush()` and `heappop()` — The Core Operations

```python
# Push a new element
heapq.heappush(data, 0)
print(data[0])  # 0 — new minimum is at the top

# Pop the smallest element
min_val = heapq.heappop(data)
print(min_val)  # 0
print(data[0])  # 1 — the heap rebalances itself
```

Both operations run in O(log n). The list mutates in place, and the heap invariant is restored after each call.

### `heappushpop()` and `heapreplace()` — The Optimized Combos

These two functions do a push and a pop in one call at O(log n) — slightly faster than calling `heappush` then `heappop` separately:

- `heappushpop(heap, item)` — pushes `item`, then pops the smallest. Useful when you want to add something and immediately get the current minimum.
- `heapreplace(heap, item)` — pops the smallest, then pushes `item`. Slightly different semantics (fails on an empty heap) but faster than the push-pop variant.

```python
# A running top-3 tracker
import heapq

top3 = [10, 20, 30]
heapq.heapify(top3)

for score in [25, 15, 40]:
    if score > top3[0]:
        heapq.heapreplace(top3, score)

print(sorted(top3, reverse=True))  # [40, 30, 25]
```

## Building a Max-Heap

Python's `heapq` doesn't have a `heapify_max` or `heappush_max`. But you don't need them — the classic trick is to negate all your values. Since the heap always puts the smallest at the top, negating everything flips the ordering: the "smallest" negative number corresponds to the largest absolute value.

```python
import heapq

data = [5, 1, 8, 3, 9, 2]
max_heap = [-x for x in data]
heapq.heapify(max_heap)

# Pop the largest element (by negating back)
largest = -heapq.heappop(max_heap)  # 9

# Push a new value 7
heapq.heappush(max_heap, -7)
```

The negation trick is simple and works everywhere. Just remember to negate on push and negate again on pop. If you're storing tuples, negate the first element of the tuple (e.g., `(-priority, id)`).

## When a Heap Is the Wrong Choice

Heaps aren't a silver bullet. If you need to search for arbitrary elements, access by index, or iterate in sorted order, a heap is the wrong tool. In those cases, a balanced binary search tree (or just a well-maintained sorted list) is better. But Python doesn't have a built-in BST — so if you need one, you're either reaching for `bisect` on a sorted list (fine for small lists, O(n) inserts) or implementing your own structure.

For the vast majority of "give me the smallest next item" workloads, `heapq` is the right call. It's in the standard library, it's fast, and the list-based implementation means it plays nicely with everything else in Python.

## Putting It Together

Here's a real-world example — a simple task scheduler that always processes the highest-priority task first:

```python
import heapq

class TaskScheduler:
    def __init__(self):
        self._heap = []

    def add(self, priority, task):
        heapq.heappush(self._heap, (-priority, task))

    def next_task(self):
        if not self._heap:
            return None
        _, task = heapq.heappop(self._heap)
        return task
```

Notice the negative priority to simulate a max-heap. The scheduler always returns the task with the highest priority in O(log n) time, regardless of how many tasks are queued.

The takeaway: "just sort it" feels fine until your data grows. When you need dynamic ordering with fast inserts and pops, reach for `heapq` — it's the right tool for the job.