# Features

Each subfolder here is a self-contained product feature (e.g. `products/`,
`cart/`, `checkout/`, `auth/`). Co-locate a feature's components, hooks, and
types inside its folder; promote anything shared to the top-level
`components/`, `hooks/`, or `types/` directories.

Example layout:

```
features/
 └── products/
      ├── components/   # ProductCard, ProductGrid, ...
      ├── hooks/        # useProducts, useProduct, ...
      └── types.ts
```
