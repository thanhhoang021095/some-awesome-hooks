import { useEffect } from "react"
import { useCallbackRef } from "../use-callback-ref/useCallbackRef"

/**
 * React hook that provides a declarative `setTimeout`
 *
 * @param callback the callback to run after specified delay
 * @param delay the delay (in ms)
 */
export const useTimeout = (
    callback: (...args: any[]) => void,
    delay: number | null,
) => {
    const fn = useCallbackRef(callback)

    useEffect(() => {
        if (delay == null) return undefined

        let timeoutId: number | null = null

        timeoutId = window.setTimeout(() => {
            fn()
        }, delay)

        return () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId)
            }
        }
    }, [delay, fn])
}
