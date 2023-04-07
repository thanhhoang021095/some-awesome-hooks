import { useState, useEffect, useCallback } from "react";

export const useTaskQueue = (params: {
    shouldProcess: boolean
}): {
    tasks: ReadonlyArray<Task>
    isProcessing: boolean
    addTask: (task: Task) => void
} => {
    const [queue, setQueue] = useState<{
        isProcessing: boolean
        tasks: Array<Task>
    }>({ isProcessing: false, tasks: [] })

    useEffect(() => {
        if (!params.shouldProcess) return
        if (queue.tasks.length === 0) return
        if (queue.isProcessing) return

        const task = queue.tasks[0]
        setQueue((prev) => ({
            isProcessing: true,
            tasks: prev.tasks.slice(1),
        }))

        Promise.resolve(task()).finally(() => {
            setQueue((prev) => ({
                isProcessing: false,
                tasks: prev.tasks,
            }))
        })
    }, [queue, params.shouldProcess])

    return {
        tasks: queue.tasks,
        isProcessing: queue.isProcessing,
        addTask: useCallback((task) => {
            setQueue((prev) => ({
                isProcessing: prev.isProcessing,
                tasks: [...prev.tasks, task],
            }))
        }, []),
    }
}

type Task = () => Promise<void> | void