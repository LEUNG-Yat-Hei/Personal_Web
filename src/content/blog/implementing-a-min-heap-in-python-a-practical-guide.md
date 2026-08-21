---
title: "Implementing a Min Heap in Python: A Practical Guide"
description: "Learn how to build a min heap from scratch in Python, with a focus on understanding the heap invariant, heap operations, and practical use cases."
pubDate: 2026-08-21
kicker: "Guide"
tags: ["python", "data-structures", "algorithms", "heaps"]
---

A **min heap** is a complete binary tree where each parent node is smaller than or equal to its children. The smallest element always sits at the root, which makes heaps ideal for priority queues, graph algorithms (Dijkstra's, Prim's), and anytime you need fast access to the minimum value.

Python's standard library ships with `heapq`, a module that provides heap operations on plain lists. But implementing a min heap from scratch is a great way to internalize the mechanics—and it's a frequent interview topic.

In this post, I'll walk through a clean, self-contained Python implementation, explain the core operations, and show you when to reach for a heap.

## The Heap Invariant

Before we write code, let's get the invariant straight:

> For every node `i` (other than the root), `heap[parent(i)] <= heap[i]`.

We store the heap in a flat list. The parent-child relationships are encoded by indices:

- Parent of node `i`: `(i - 1) // 2`
- Left child of node `i`: `2 * i + 1`
- Right child of node `i`: `2 * i + 2`

Because we use a flat list with these index rules, we never need explicit node objects or pointers. This is the same trick Python's `heapq` uses.

## Core Operations

A min heap needs at least these operations:

- `insert(value)` — add a value and restore the heap property.
- `extract_min()` — remove and return the smallest value.
- `peek()` — return the smallest value without removing it.
- `size()` / `is_empty()` — convenience methods.

Two internal helper methods keep things tidy:

- `_bubble_up(index)` (also called *sift up* or *percolate up*) — move a node toward the root until the heap property is satisfied.
- `_bubble_down(index)` (also called *sift down*) — push a node toward the leaves.

Let's implement each one.

## Implementation

```python
class MinHeap:
    def __init__(self):
        self._heap = []

    def __len__(self):
        return len(self._heap)

    def is_empty(self):
        return len(self._heap) == 0

    def peek(self):
        if self.is_empty():
            raise IndexError("peek from an empty heap")
        return self._heap[0]

    def insert(self, value):
        self._heap.append(value)
        self._bubble_up(len(self._heap) - 1)

    def extract_min(self):
        if self.is_empty():
            raise IndexError("extract_min from an empty heap")

        # Save the root, move the last element to the root, then sift down.
        root = self._heap[0]
        last = self._heap.pop()

        if self._heap:  # only replace if there are remaining elements
            self._heap[0] = last
            self._bubble_down(0)

        return root

    # --- PRIVATE HELPERS ---

    def _bubble_up(self, index):
        heap = self._heap
        while index > 0:
            parent = (index - 1) // 2
            if heap[index] >= heap[parent]:
                break
            heap[index], heap[parent] = heap[parent], heap[index]
            index = parent

    def _bubble_down(self, index):
        heap = self._heap
        n = len(heap)

        while True:
            left = 2 * index + 1
            right = 2 * index + 2
            smallest = index

            if left < n and heap[left] < heap[smallest]:
                smallest = left
            if right < n and heap[right] < heap[smallest]:
                smallest = right

            if smallest == index:
                break

            heap[index], heap[smallest] = heap[smallest], heap[index]
            index = smallest
```

### A walkthrough of `extract_min`

The trickiest part is `extract_min`. Here's what happens:

1. Save the root (the minimum) so we can return it.
2. Pop the *last* element off the list.
3. If the heap isn't empty, put that last element at the root.
4. Bubble it down to restore the heap invariant.

Popping the last element is O(1) on a list, so this stays efficient.

## Complexity

| Operation     | Time Complexity |
|---------------|-----------------|
| `insert`      | O(log n)        |
| `extract_min` | O(log n)        |
| `peek`        | O(1)            |
| `size`        | O(1)            |

Building a heap from an arbitrary array can be done in O(n) using a bottom-up "heapify," but I'll leave that as an exercise.

## Using the built-in `heapq`

If you're writing production code, you probably want `heapq` rather than a hand-rolled class. Python's module is battle-tested and written in a mix of Python and C (for some operations), so it's faster than anything most of us would write.

Here's the equivalent usage with `heapq`:

```python
import heapq

heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 2)
heapq.heappush(heap, 8)

minimum = heapq.heappop(heap)        # 2
second_min = heapq.heappop(heap)     # 5
```

`heapq` also provides `heapify` (build a heap in place, O(n)), `heapreplace`, `nsmallest`, and `nlargest`—all quite useful.

## Practical notes

- **Empty heaps**: In my implementation, `peek()` and `extract_min()` raise `IndexError` on an empty heap. Real code might prefer a sentinel return or a custom exception; choose what makes sense for your use case.

- **Ties**: Heap ordering only cares about *less than* comparisons. If two elements compare equal, either can come out first. If you need stable ordering, store tuples of the form `(priority, counter, value)`.

- **Custom objects**: To store non-numeric objects, make sure they support `<` (e.g., implement `__lt__`), or store tuples with a comparable key first.

- **Max heaps**: Python's `heapq` is min-heap only. For a max heap, negate values (for numbers) or wrap with a custom comparator class. Alternatively, flip the comparison operators in the implementation above.

## When a heap helps

Reach for a min heap when you need to repeatedly extract the smallest (or largest, with a tweak) element from a growing or shrinking collection. Classic use cases:

- **Dijkstra's algorithm** — extract the node with the smallest tentative distance.
- **Merge k sorted lists** — push the head of each list, pop the min, push the next element from that list.
- **K largest/smallest elements** — maintain a heap of size k, pushing and popping as you stream through data.
- **Task schedulers** — always run the job with the earliest deadline.

## Wrapping up

Building a min heap from scratch is a small amount of code, but it packs a lot of ideas: the heap invariant, the array-as-tree encoding, and the two sift operations. Once you've internalized those, you'll find the `heapq` module trivial to use—and you'll be ready to answer the inevitable "implement a heap" interview question.

If you'd like to see a max-heap variant, a `heapify` construction in O(n), or a comparison of this class against `heapq` in benchmarks, let me know—I'm happy to write a follow-up.
