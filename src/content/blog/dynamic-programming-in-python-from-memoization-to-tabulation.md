---
title: "Dynamic Programming in Python: From Memoization to Tabulation"
description: "A practical walkthrough of dynamic programming in Python — covering memoization, tabulation, and when the classic approach is (and isn't) the right tool."
pubDate: 2026-08-21
kicker: "Guide"
tags: [python, algorithms, dynamic-programming]
---

Dynamic programming is one of those topics that sounds intimidating until you see it click. It's not a single algorithm — it's a strategy for breaking down problems that have overlapping subproblems and optimal substructure. In this post, I'll work through the core ideas with concrete Python examples, starting from plain recursion and building up to both memoized and tabulated solutions.

## The Problem That Starts It All: Fibonacci

No discussion of dynamic programming is complete without the Fibonacci sequence. It's simple enough to understand but exposes the fundamental issue that DP solves.

Here's the naive recursive version:

```python
def fib_naive(n: int) -> int:
    if n <= 1:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)
```

This is correct, but it's `O(2^n)` time. For `n=40`, that's over a billion function calls. The reason is that we recompute the same subproblems over and over — `fib(30)` gets computed dozens of times in different branches of the recursion tree.

The insight of dynamic programming is simple: **if you're computing the same thing more than once, compute it once and remember it.**

## Top-Down: Memoization

Memoization is the top-down approach: you start with the original problem and recursively break it down, but you cache results as you go.

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n: int) -> int:
    if n <= 1:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)
```

That's it. Python's `functools.lru_cache` does all the heavy lifting. Each distinct `n` is computed exactly once, making this `O(n)` time and `O(n)` space (for the cache plus the recursion stack).

If you want to be explicit about the caching (which is useful when the cache key is more complex than a single integer), you can implement it manually:

```python
def fib_memo_manual(n: int, memo: dict | None = None) -> int:
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo_manual(n - 1, memo) + fib_memo_manual(n - 2, memo)
    return memo[n]
```

The manual version is worth writing at least once so you truly understand what the decorator is doing under the hood.

## Bottom-Up: Tabulation

Tabulation flips the direction. Instead of starting from `n` and working down, you start from the base cases and build up, filling in a table (usually an array).

```python
def fib_tab(n: int) -> int:
    if n <= 1:
        return n
    table = [0] * (n + 1)
    table[1] = 1
    for i in range(2, n + 1):
        table[i] = table[i - 1] + table[i - 2]
    return table[n]
```

This avoids recursion entirely, which means no risk of hitting Python's recursion limit. For Fibonacci specifically, we can even collapse the table to two variables since we only ever need the previous two values:

```python
def fib_optimized(n: int) -> int:
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
```

This is `O(n)` time and `O(1)` space. A good reminder that DP is a framework, not a rigid template — the best implementation always depends on the problem's structure.

## A More Interesting Example: Minimum Path Sum

Fibonacci is a good warm-up, but real DP problems have more moving parts. Let's look at the classic "minimum path sum" problem.

> Given an `m x n` grid filled with non-negative numbers, find a path from the top-left to bottom-right that minimizes the sum of numbers along the path. You can only move down or right.

The naive recursive version tries every path — exponential in `m + n`. But this problem has **optimal substructure**: the minimum path to cell `(i, j)` is `grid[i][j]` plus the minimum of the path to the cell above it and the cell to its left.

```python
def min_path_sum_top_down(grid: list[list[int]]) -> int:
    from functools import lru_cache

    m, n = len(grid), len(grid[0])

    @lru_cache(maxsize=None)
    def dp(i: int, j: int) -> int:
        if i == 0 and j == 0:
            return grid[0][0]
        if i < 0 or j < 0:
            return float("inf")
        return grid[i][j] + min(dp(i - 1, j), dp(i, j - 1))

    return dp(m - 1, n - 1)
```

And the bottom-up version, which is often more natural for grid problems:

```python
def min_path_sum_tab(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]

    dp[0][0] = grid[0][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j - 1] + grid[0][j]
    for i in range(1, m):
        dp[i][0] = dp[i - 1][0] + grid[i][0]

    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])

    return dp[m - 1][n - 1]
```

Notice the base-case initialization: the first row and column can only be reached one way, so we fill them first. Then the interior cells follow naturally.

## How to Spot DP Problems

You'll often see these two hallmarks:

1. **Optimal substructure** — an optimal solution to the full problem can be built from optimal solutions to subproblems.
2. **Overlapping subproblems** — the same subproblem appears in multiple branches of the recursion.

If a problem asks for a "minimum", "maximum", "number of ways", or "longest" something, and involves sequential decisions, it's worth checking whether DP applies.

## Common Pitfalls

### 1. Not thinking about state
The hardest part of DP isn't the implementation — it's defining the state. If you can't articulate what `dp[i]` or `dp[i][j]` *means* in English, you'll struggle to write the recurrence.

### 2. Forgetting the base cases
The base cases are where beginners stumble most. Write them out explicitly, even when they seem obvious.

### 3. Premature optimization
Start with a correct solution before optimizing. The top-down memoized version is often the easiest to reason through — get that right first, then translate to tabulation if you need the speed or memory improvement.

### 4. Ignoring the recursion limit
Python's default recursion limit is 1000. For deep problems, top-down can hit it. The `sys.setrecursionlimit()` function exists, but it's a blunt instrument — tabulation is cleaner for very deep recursions.

## When DP Is the Wrong Tool

Not every "hard" problem needs DP. Greedy algorithms work when local optimal choices lead to a global optimum (e.g., activity selection). Divide-and-conquer is better when subproblems are independent (e.g., merge sort). And sometimes a good greedy or brute-force with pruning is just simpler to write and maintain.

DP is powerful, but the added complexity is only justified when you genuinely have overlapping subproblems.

## Further Reading

- [Python's `functools.lru_cache` documentation](https://docs.python.org/3/library/functools.html#functools.lru_cache)
- Our previous post on [algorithmic thinking patterns](/blog/algorithmic-thinking-patterns)
- Princeton's Algorithms course has an excellent section on dynamic programming

Dynamic programming rewards practice. Once you've seen a dozen or two problems, the patterns start to repeat and the state definitions come more naturally. Start small, write the recurrence out on paper, and always test your base cases first.