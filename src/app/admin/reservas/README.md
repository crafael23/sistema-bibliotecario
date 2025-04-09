# Reservas Module

## Architecture Overview

The reservas module follows a modular, clean architecture approach with clear separation of concerns:

```
/reservas
├── /components        # UI components
├── /db                # Data access and database operations
├── /hooks             # React hooks for client-side data fetching
├── actions.ts         # Server actions (API layer)
├── loading.tsx        # Loading state UI
├── page.tsx           # Main page component
├── types.ts           # TypeScript types and schemas
└── utils.ts           # Utility functions
```

## Key Design Principles

1. **Separation of Concerns**:
   - DB operations are isolated in the `db` directory
   - UI components are in the `components` directory
   - Client-side data fetching in `hooks`
   - Server actions in `actions.ts`

2. **Type Safety**:
   - Comprehensive type definitions in `types.ts`
   - Zod schemas for runtime validation
   - Consistent error handling

3. **Performance Optimizations**:
   - Modular SQL queries with proper indexing
   - Proper use of database transactions
   - Optimistic UI updates
   - Efficient pagination

4. **Error Handling**:
   - Consistent error responses
   - Transactions for data integrity
   - Validation of inputs

## Flow of Data

1. UI components request data through hooks
2. Hooks call server actions
3. Server actions call DB operations
4. DB operations return data to server actions
5. Server actions transform data and return to hooks
6. Hooks update local state
7. Components render based on state

## Database Operations

Database operations are modularized into:

- `queries.ts`: Basic SQL query building blocks
- `reservaciones-repository.ts`: Repository pattern for fetching data
- `transactions.ts`: Transaction operations that modify multiple tables

## Server Actions

Server actions serve as the API layer, validating inputs and calling the appropriate db functions.

## React Hooks

Custom hooks manage client-side state, pagination, and data fetching.

## Components

Components are designed to be reusable and focused on rendering UI based on props without direct data fetching.

## Utilities

Shared utility functions like date formatting and search condition building. 