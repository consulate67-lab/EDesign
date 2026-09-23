import { useCallback, useRef, useState } from 'react';

/**
 * Simple undo/redo state history hook.
 *
 * - `state` is the current snapshot (the live value managed outside the hook)
 * - `push(newState)` records a new snapshot (call before mutating)
 * - `undo()` / `redo()` navigate
 * - `canUndo` / `canRedo` flags drive UI button enable/disable
 * - `reset(newState)` clears history (e.g. when a new template is loaded)
 *
 * For larger state objects, callers may want to wrap this with Immer or
 * switch to a dedicated library like `zundo` (Faz 4 candidate).
 */
export interface UndoHistory<T> {
    canUndo: boolean;
    canRedo: boolean;
    push: (snapshot: T) => void;
    undo: () => T | null;
    redo: () => T | null;
    reset: (snapshot: T) => void;
    size: number;
}

export const useUndoHistory = <T,>(initial: T): UndoHistory<T> => {
    const [past, setPast] = useState<T[]>([]);
    const [future, setFuture] = useState<T[]>([]);
    const initialRef = useRef<T>(initial);

    const push = useCallback((snapshot: T) => {
        setPast((p) => [...p, snapshot]);
        setFuture([]);
    }, []);

    const undo = useCallback((): T | null => {
        if (past.length === 0) return null;
        const previous = past[past.length - 1];
        setPast((p) => p.slice(0, -1));
        // Caller must also update its live state; we return the snapshot to apply.
        // The caller wraps this in their setter.
        setFuture((f) => [initialRef.current, ...f]);
        return previous;
    }, [past]);

    const redo = useCallback((): T | null => {
        if (future.length === 0) return null;
        const next = future[0];
        setFuture((f) => f.slice(1));
        setPast((p) => [...p, initialRef.current]);
        return next;
    }, [future]);

    const reset = useCallback((snapshot: T) => {
        initialRef.current = snapshot;
        setPast([]);
        setFuture([]);
    }, []);

    return {
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        push,
        undo,
        redo,
        reset,
        size: past.length,
    };
};
